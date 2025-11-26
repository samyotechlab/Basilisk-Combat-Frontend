import { useState } from "react";
import {
  Plus,
  Trash2,
  Download,
  Upload,
  Calculator,
  Users,
  DollarSign,
  Calendar,
} from "lucide-react";

const VoyagerForecastApp = () => {
  const [activeTab, setActiveTab] = useState("actual");
  const [sites, setSites] = useState([
    {
      id: 1,
      name: "Site 001",
      actualPatients: [],
      forecastPatients: [],
      costingData: {
        screenFailureTier1: 4518.12,
        screenFailureTier2: 1447.62,
        screenFailureTier3: 6797.88,
        startupCost: 11500,
        pharmacySetup: 2500,
        labSetup: 1500,
        radiologySetup: 2000,
        stipendPerVisit: 511,
        closeoutCost: 5000,
      },
      visitGaps: [
        5, 7, 14, 21, 28, 35, 42, 49, 56, 63, 70, 77, 84, 91, 98, 105, 112, 119,
        126, 133,
      ],
    },
  ]);
  const [selectedSite, setSelectedSite] = useState(0);

  const addSite = () => {
    const newSite = {
      id: sites.length + 1,
      name: `Site ${String(sites.length + 1).padStart(3, "0")}`,
      actualPatients: [],
      forecastPatients: [],
      costingData: {
        screenFailureTier1: 4518.12,
        screenFailureTier2: 1447.62,
        screenFailureTier3: 6797.88,
        startupCost: 11500,
        pharmacySetup: 2500,
        labSetup: 1500,
        radiologySetup: 2000,
        stipendPerVisit: 511,
        closeoutCost: 5000,
      },
      visitGaps: [
        5, 7, 14, 21, 28, 35, 42, 49, 56, 63, 70, 77, 84, 91, 98, 105, 112, 119,
        126, 133,
      ],
    };
    setSites([...sites, newSite]);
    setSelectedSite(sites.length);
  };

  const addPatient = (type) => {
    const newPatient = {
      id: Date.now(),
      cohort: 1,
      subjectId: `SUB${Date.now()}`,
      status: "Screening",
      screenT1: "",
      screenT2: "",
      screenT3: "",
      sfDate: "",
      sfCategory: "",
      sfRank: 0,
      enrollmentDate: "",
      projectedDiscontinued: "",
      actualDiscontinued: "",
      visits: Array(20).fill(""),
    };

    const updatedSites = [...sites];
    if (type === "actual") {
      updatedSites[selectedSite].actualPatients.push(newPatient);
    } else {
      updatedSites[selectedSite].forecastPatients.push(newPatient);
    }
    setSites(updatedSites);
  };

  const updatePatient = (type, patientId, field, value) => {
    const updatedSites = [...sites];
    const patients =
      type === "actual"
        ? updatedSites[selectedSite].actualPatients
        : updatedSites[selectedSite].forecastPatients;

    const patientIndex = patients.findIndex((p) => p.id === patientId);
    if (patientIndex !== -1) {
      patients[patientIndex][field] = value;

      // Auto-calculate status
      if (field.startsWith("screen") || field === "sfDate") {
        patients[patientIndex].status = calculateStatus(patients[patientIndex]);
      }

      // Auto-calculate SF Category
      if (field === "sfDate") {
        patients[patientIndex].sfCategory = calculateSFCategory(
          patients[patientIndex]
        );
      }

      setSites(updatedSites);
    }
  };

  const calculateStatus = (patient) => {
    if (patient.sfDate) return "Screen-Fail";
    if (
      patient.actualDiscontinued &&
      patient.actualDiscontinued < patient.projectedDiscontinued
    )
      return "ET";
    if (patient.screenT1 && patient.screenT2 && patient.screenT3)
      return "Randomized";
    return "Screening";
  };

  const calculateSFCategory = (patient) => {
    if (!patient.sfDate) return "";
    if (patient.screenT1 && !patient.screenT2) return "T2";
    if (patient.screenT2 && !patient.screenT3) return "T3";
    if (!patient.screenT1) return "T1";
    return "";
  };

  const deletePatient = (type, patientId) => {
    const updatedSites = [...sites];
    if (type === "actual") {
      updatedSites[selectedSite].actualPatients = updatedSites[
        selectedSite
      ].actualPatients.filter((p) => p.id !== patientId);
    } else {
      updatedSites[selectedSite].forecastPatients = updatedSites[
        selectedSite
      ].forecastPatients.filter((p) => p.id !== patientId);
    }
    setSites(updatedSites);
  };

  const calculateMonthlyForecasts = () => {
    const site = sites[selectedSite];
    const months = [
      "Jan-25",
      "Feb-25",
      "Mar-25",
      "Apr-25",
      "May-25",
      "Jun-25",
      "Jul-25",
      "Aug-25",
      "Sep-25",
      "Oct-25",
      "Nov-25",
      "Dec-25",
    ];

    const forecasts = months.map((month, idx) => {
      const allPatients = [...site.actualPatients, ...site.forecastPatients];

      // Count screen failures
      const sfCount = allPatients.filter(
        (p) => p.status === "Screen-Fail"
      ).length;
      const randomizedCount = allPatients.filter(
        (p) => p.status === "Randomized"
      ).length;

      // Calculate SF costs - average of three tiers
      const avgSF =
        (site.costingData.screenFailureTier1 +
          site.costingData.screenFailureTier2 +
          site.costingData.screenFailureTier3) /
        3;
      const sfCost = avgSF * sfCount;

      // Calculate startup costs (divided by 8 months recovery)
      const startupTotal =
        site.costingData.startupCost +
        site.costingData.pharmacySetup +
        site.costingData.labSetup +
        site.costingData.radiologySetup;
      const monthlyStartup = startupTotal / 8;

      // Calculate enrolled costs (12.5% per month for 8 month cycle)
      const enrolledCostPerPatient = 7913.44; // Base enrolled cost
      const enrolledCost = randomizedCount * enrolledCostPerPatient * 0.125;

      // Calculate stipends
      // Formula: ((SF + (Randomized * multiplier)) * stipendPerVisit) / 8
      let multiplier = 6; // Default for Jan
      if (idx >= 1 && idx <= 6) multiplier = 6.5; // Feb to July
      if (idx >= 7) multiplier = 13; // Aug to Dec

      const stipends =
        ((sfCount + randomizedCount * multiplier) *
          site.costingData.stipendPerVisit) /
        8;

      const totalCost = sfCost + monthlyStartup + enrolledCost + stipends;

      return {
        month,
        sfCount,
        randomizedCount,
        sfCost,
        startupCost: monthlyStartup,
        enrolledCost,
        stipends,
        totalCost,
      };
    });

    return forecasts;
  };

  const exportData = () => {
    const dataStr = JSON.stringify(sites, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "voyager-forecast-data.json";
    link.click();
  };

  const importData = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target.result);
          setSites(imported);
          setSelectedSite(0);
        } catch (error) {
          alert("Error importing file. Please check the format.");
          console.error("Import Error:", error);
        }
      };
      reader.readAsText(file);
    }
  };

  const forecasts = calculateMonthlyForecasts();
  const currentSite = sites[selectedSite];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
                <Calculator className="text-indigo-600 drop-shadow-lg" size={36} />
                Voyager Clinical Trial Forecasting System
              </h1>
              <p className="text-gray-600 mt-2 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                VY7523-102_IG Forecast - Patient Visit & Cost Management
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={exportData}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Download size={20} />
                Export
              </button>
              <label className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 cursor-pointer">
                <Upload size={20} />
                Import
                <input
                  type="file"
                  accept=".json"
                  onChange={importData}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Site Selection */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Users className="text-blue-500" size={24} />
              Site Management
            </h2>
            <button
              onClick={addSite}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Plus size={20} />
              Add Site
            </button>
          </div>
          <div className="flex gap-3 flex-wrap">
            {sites.map((site, idx) => (
              <button
                key={site.id}
                onClick={() => setSelectedSite(idx)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-md ${
                  selectedSite === idx
                    ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg transform -translate-y-1"
                    : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300 hover:shadow-md"
                }`}
              >
                {site.name}
              </button>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 mb-6 overflow-hidden">
          <div className="flex border-b border-indigo-200/50">
            <button
              onClick={() => setActiveTab("actual")}
              className={`flex-1 px-6 py-4 font-semibold transition-all duration-300 relative overflow-hidden group ${
                activeTab === "actual"
                  ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
                  : "bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 hover:from-gray-100 hover:to-gray-200"
              }`}
            >
              <Users className={`inline mr-2 transition-transform group-hover:scale-110 ${activeTab === "actual" ? "text-white" : "text-blue-500"}`} size={20} />
              Actual Patients ({currentSite.actualPatients.length})
              {activeTab === "actual" && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-300 to-purple-300"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab("forecast")}
              className={`flex-1 px-6 py-4 font-semibold transition-all duration-300 relative overflow-hidden group ${
                activeTab === "forecast"
                  ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
                  : "bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 hover:from-gray-100 hover:to-gray-200"
              }`}
            >
              <Calendar className={`inline mr-2 transition-transform group-hover:scale-110 ${activeTab === "forecast" ? "text-white" : "text-green-500"}`} size={20} />
              Forecast Patients ({currentSite.forecastPatients.length})
              {activeTab === "forecast" && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-300 to-purple-300"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab("costing")}
              className={`flex-1 px-6 py-4 font-semibold transition-all duration-300 relative overflow-hidden group ${
                activeTab === "costing"
                  ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
                  : "bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 hover:from-gray-100 hover:to-gray-200"
              }`}
            >
              <DollarSign className={`inline mr-2 transition-transform group-hover:scale-110 ${activeTab === "costing" ? "text-white" : "text-emerald-500"}`} size={20} />
              Cost Analysis
              {activeTab === "costing" && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-300 to-purple-300"></div>
              )}
            </button>
          </div>

          <div className="p-6">
            {/* Actual/Forecast Patient Lists */}
            {(activeTab === "actual" || activeTab === "forecast") && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <Users className="text-blue-500" size={24} />
                    {activeTab === "actual" ? "Actual" : "Forecast"} Patient Data
                  </h3>
                  <button
                    onClick={() => addPatient(activeTab)}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <Plus size={20} />
                    Add Patient
                  </button>
                </div>

                <div className="overflow-x-auto rounded-xl border border-gray-200/50">
                  <table className="w-full text-sm">
                    <thead className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                      <tr>
                        <th className="px-6 py-4 text-left font-semibold">
                          Cohort
                        </th>
                        <th className="px-6 py-4 text-left font-semibold">
                          Subject ID
                        </th>
                        <th className="px-6 py-4 text-left font-semibold w-32">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left font-semibold">
                          Screen T1
                        </th>
                        <th className="px-6 py-4 text-left font-semibold">
                          Screen T2
                        </th>
                        <th className="px-6 py-4 text-left font-semibold">
                          Screen T3
                        </th>
                        <th className="px-6 py-4 text-left font-semibold">
                          SF Date
                        </th>
                        <th className="px-6 py-4 text-left font-semibold">
                          Enrollment
                        </th>
                        <th className="px-6 py-4 text-left font-semibold w-16">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {(activeTab === "actual"
                        ? currentSite.actualPatients
                        : currentSite.forecastPatients
                      ).map((patient, idx) => (
                        <tr
                          key={patient.id}
                          className={`border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200 ${
                            idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                          }`}
                        >
                          <td className="px-6 py-4">
                            <input
                              type="number"
                              value={patient.cohort}
                              onChange={(e) =>
                                updatePatient(
                                  activeTab,
                                  patient.id,
                                  "cohort",
                                  parseInt(e.target.value) || 1
                                )
                              }
                              className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                              min="1"
                              max="3"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <input
                              type="text"
                              value={patient.subjectId}
                              onChange={(e) =>
                                updatePatient(
                                  activeTab,
                                  patient.id,
                                  "subjectId",
                                  e.target.value
                                )
                              }
                              className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            />
                          </td>
                          <td className="px-6 py-4 w-32">
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold shadow-sm whitespace-nowrap ${
                                patient.status === "Randomized"
                                  ? "bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 border border-emerald-200"
                                  : patient.status === "Screen-Fail"
                                  ? "bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border border-red-200"
                                  : patient.status === "ET"
                                  ? "bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 border border-amber-200"
                                  : "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-200"
                              }`}
                            >
                              {patient.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <input
                              type="date"
                              value={patient.screenT1}
                              onChange={(e) =>
                                updatePatient(
                                  activeTab,
                                  patient.id,
                                  "screenT1",
                                  e.target.value
                                )
                              }
                              className="w-40 px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <input
                              type="date"
                              value={patient.screenT2}
                              onChange={(e) =>
                                updatePatient(
                                  activeTab,
                                  patient.id,
                                  "screenT2",
                                  e.target.value
                                )
                              }
                              className="w-40 px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <input
                              type="date"
                              value={patient.screenT3}
                              onChange={(e) =>
                                updatePatient(
                                  activeTab,
                                  patient.id,
                                  "screenT3",
                                  e.target.value
                                )
                              }
                              className="w-40 px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <input
                              type="date"
                              value={patient.sfDate}
                              onChange={(e) =>
                                updatePatient(
                                  activeTab,
                                  patient.id,
                                  "sfDate",
                                  e.target.value
                                )
                              }
                              className="w-40 px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <input
                              type="date"
                              value={patient.enrollmentDate}
                              onChange={(e) =>
                                updatePatient(
                                  activeTab,
                                  patient.id,
                                  "enrollmentDate",
                                  e.target.value
                                )
                              }
                              className="w-40 px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                            />
                          </td>
                          <td className="px-6 py-4 w-16">
                            <button
                              onClick={() =>
                                deletePatient(activeTab, patient.id)
                              }
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-110 shadow-sm"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {(activeTab === "actual"
                    ? currentSite.actualPatients
                    : currentSite.forecastPatients
                  ).length === 0 && (
                    <div className="text-center py-12 text-gray-500 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                      <Users className="mx-auto mb-4 text-gray-300" size={48} />
                      No patients added yet. Click "Add Patient" to get started.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Cost Analysis Tab */}
            {activeTab === "costing" && (
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <DollarSign className="text-emerald-500" size={24} />
                  Monthly Cost Forecast
                </h3>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200 shadow-md">
                    <p className="text-sm text-blue-600 font-semibold flex items-center gap-2">
                      <Users size={16} />
                      Total Patients
                    </p>
                    <p className="text-3xl font-bold text-blue-900 mt-2">
                      {currentSite.actualPatients.length +
                        currentSite.forecastPatients.length}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-100 p-6 rounded-xl border border-emerald-200 shadow-md">
                    <p className="text-sm text-emerald-600 font-semibold flex items-center gap-2">
                      <Calendar size={16} />
                      Randomized
                    </p>
                    <p className="text-3xl font-bold text-emerald-900 mt-2">
                      {
                        [
                          ...currentSite.actualPatients,
                          ...currentSite.forecastPatients,
                        ].filter((p) => p.status === "Randomized").length
                      }
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-red-50 to-rose-100 p-6 rounded-xl border border-red-200 shadow-md">
                    <p className="text-sm text-red-600 font-semibold flex items-center gap-2">
                      <Trash2 size={16} />
                      Screen Failures
                    </p>
                    <p className="text-3xl font-bold text-red-900 mt-2">
                      {
                        [
                          ...currentSite.actualPatients,
                          ...currentSite.forecastPatients,
                        ].filter((p) => p.status === "Screen-Fail").length
                      }
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-violet-100 p-6 rounded-xl border border-purple-200 shadow-md">
                    <p className="text-sm text-purple-600 font-semibold flex items-center gap-2">
                      <Calculator size={16} />
                      Total Cost (12mo)
                    </p>
                    <p className="text-3xl font-bold text-purple-900 mt-2">
                      $
                      {forecasts
                        .reduce((sum, f) => sum + f.totalCost, 0)
                        .toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                    </p>
                  </div>
                </div>

                {/* Monthly Breakdown */}
                <div className="overflow-x-auto rounded-xl border border-gray-200/50 mb-8">
                  <table className="w-full text-sm">
                    <thead className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                      <tr>
                        <th className="px-6 py-4 text-left font-semibold">
                          Month
                        </th>
                        <th className="px-6 py-4 text-right font-semibold">
                          SF Count
                        </th>
                        <th className="px-6 py-4 text-right font-semibold">
                          Randomized
                        </th>
                        <th className="px-6 py-4 text-right font-semibold">
                          SF Cost
                        </th>
                        <th className="px-6 py-4 text-right font-semibold">
                          Startup
                        </th>
                        <th className="px-6 py-4 text-right font-semibold">
                          Enrolled
                        </th>
                        <th className="px-6 py-4 text-right font-semibold">
                          Stipends
                        </th>
                        <th className="px-6 py-4 text-right font-semibold">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {forecasts.map((forecast, idx) => (
                        <tr key={idx} className={`border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200 ${
                          idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                        }`}>
                          <td className="px-6 py-4 font-semibold text-gray-900">
                            {forecast.month}
                          </td>
                          <td className="px-6 py-4 text-right text-red-600 font-medium">
                            {forecast.sfCount}
                          </td>
                          <td className="px-6 py-4 text-right text-emerald-600 font-medium">
                            {forecast.randomizedCount}
                          </td>
                          <td className="px-6 py-4 text-right text-red-600">
                            $
                            {forecast.sfCost.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </td>
                          <td className="px-6 py-4 text-right text-blue-600">
                            $
                            {forecast.startupCost.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </td>
                          <td className="px-6 py-4 text-right text-purple-600">
                            $
                            {forecast.enrolledCost.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </td>
                          <td className="px-6 py-4 text-right text-teal-600">
                            $
                            {forecast.stipends.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </td>
                          <td className="px-6 py-4 text-right font-bold bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-900 rounded px-2">
                            $
                            {forecast.totalCost.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gradient-to-r from-gray-50 to-gray-100 font-bold border-t-2 border-indigo-200">
                      <tr>
                        <td className="px-6 py-4 text-left text-gray-800">TOTAL</td>
                        <td className="px-6 py-4 text-right text-red-700">
                          {forecasts.reduce((sum, f) => sum + f.sfCount, 0)}
                        </td>
                        <td className="px-6 py-4 text-right text-emerald-700">
                          {forecasts.reduce(
                            (sum, f) => sum + f.randomizedCount,
                            0
                          )}
                        </td>
                        <td className="px-6 py-4 text-right text-red-700">
                          $
                          {forecasts
                            .reduce((sum, f) => sum + f.sfCost, 0)
                            .toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                        </td>
                        <td className="px-6 py-4 text-right text-blue-700">
                          $
                          {forecasts
                            .reduce((sum, f) => sum + f.startupCost, 0)
                            .toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                        </td>
                        <td className="px-6 py-4 text-right text-purple-700">
                          $
                          {forecasts
                            .reduce((sum, f) => sum + f.enrolledCost, 0)
                            .toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                        </td>
                        <td className="px-6 py-4 text-right text-teal-700">
                          $
                          {forecasts
                            .reduce((sum, f) => sum + f.stipends, 0)
                            .toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                        </td>
                        <td className="px-6 py-4 text-right text-indigo-900 bg-gradient-to-r from-indigo-200 to-purple-200 rounded px-2">
                          $
                          {forecasts
                            .reduce((sum, f) => sum + f.totalCost, 0)
                            .toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* Costing Parameters */}
                <div className="mt-8">
                  <h4 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <Calculator className="text-purple-500" size={20} />
                    Costing Parameters
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Object.entries(currentSite.costingData).map(
                      ([key, value]) => (
                        <div key={key} className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
                          <label className="block text-sm font-semibold text-gray-700 mb-3 capitalize">
                            {key
                              .replace(/([A-Z])/g, " $1")
                              .replace(/^./, (str) => str.toUpperCase())}
                          </label>
                          <input
                            type="number"
                            value={value}
                            onChange={(e) => {
                              const updatedSites = [...sites];
                              updatedSites[selectedSite].costingData[key] =
                                parseFloat(e.target.value) || 0;
                              setSites(updatedSites);
                            }}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 shadow-sm"
                            step="0.01"
                          />
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoyagerForecastApp;