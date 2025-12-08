import { useState } from "react";
import VoyagerHeader from "./Header/VoyagerHeader";
import SiteManagement from "./SiteManagement/SiteManagement";
import TabNavigation from "./TabNavigation/TabNavigation";
import PatientDataSection from "./PatientData/PatientDataSection";
import CostAnalysisSection from "./CostAnalysis/CostAnalysisSection";
import { useSiteManagement } from "./hooks/useSiteManagement";
import { usePatientManagement } from "./hooks/usePatientManagement";

const VoyagerApp = () => {
  const [activeTab, setActiveTab] = useState("actual");

  const {
    sites,
    selectedSite,
    currentSite,
    addSite,
    setSelectedSite,
    updateSiteCosting,
    replaceSites,
    setSites,
  } = useSiteManagement();

  const { addPatient, updatePatient, deletePatient } = usePatientManagement(
    sites,
    setSites,
    selectedSite
  );

  const handleImportSuccess = (importedSites) => {
    replaceSites(importedSites);
  };

  const handleUpdateCosting = (key, value) => {
    updateSiteCosting(selectedSite, key, value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-gray-50 to-blue-100">
      <div className="container mx-auto p-6">
        <VoyagerHeader sites={sites} onImportSuccess={handleImportSuccess} />

        <SiteManagement
          sites={sites}
          selectedSite={selectedSite}
          onSelectSite={setSelectedSite}
          onAddSite={addSite}
        />

        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 mb-6 overflow-hidden">
          <TabNavigation
            activeTab={activeTab}
            onTabChange={setActiveTab}
            actualCount={currentSite.actualPatients.length}
            forecastCount={currentSite.forecastPatients.length}
          />

          {activeTab === "actual" && (
            <PatientDataSection
              type="actual"
              patients={currentSite.actualPatients}
              onAddPatient={addPatient}
              onUpdatePatient={updatePatient}
              onDeletePatient={deletePatient}
            />
          )}

          {activeTab === "forecast" && (
            <PatientDataSection
              type="forecast"
              patients={currentSite.forecastPatients}
              onAddPatient={addPatient}
              onUpdatePatient={updatePatient}
              onDeletePatient={deletePatient}
            />
          )}

          {activeTab === "costing" && (
            <CostAnalysisSection
              currentSite={currentSite}
              sites={sites}
              onUpdateCosting={handleUpdateCosting}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default VoyagerApp;
