import { Download, Upload, FileSpreadsheet, Activity } from "lucide-react";
import Swal from "sweetalert2";
import {
  downloadSampleExcel,
  exportData,
  importData,
} from "../utils/excelUtils";

const VoyagerHeader = ({ sites, onImportSuccess }) => {
  const handleImport = (event) => {
    const file = event.target.files[0];
    importData(
      file,
      (importedSites) => {
        onImportSuccess(importedSites);
        Swal.fire({
          icon: "success",
          title: "Import Successful!",
          text: "Your data has been imported successfully.",
          confirmButtonColor: "#2C4F7C",
          timer: 3000,
          timerProgressBar: true,
        });
      },
      (error) => {
        Swal.fire({
          icon: "error",
          title: "Import Failed",
          text: error,
          confirmButtonColor: "#2C4F7C",
        });
      }
    );
    // Reset input
    event.target.value = "";
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#2C4F7C] flex items-center gap-3">
            <Activity className="text-[#2C4F7C]" size={40} strokeWidth={2.5} />
            Voyager Clinical Trial Forecasting
          </h1>
          <p className="text-gray-600 mt-2 text-lg font-medium">
            <span className="text-[#2C4F7C] font-semibold">VY7523-102_IG</span>{" "}
            • Patient Visit & Cost Management System
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={downloadSampleExcel}
            className="flex items-center gap-2 px-5 py-3 bg-[#00A3E0] text-white rounded-lg hover:bg-[#0091c7] transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 font-medium"
          >
            <FileSpreadsheet size={20} />
            Sample Template
          </button>
          <button
            onClick={() => exportData(sites)}
            className="flex items-center gap-2 px-5 py-3 bg-[#2C4F7C] text-white rounded-lg hover:bg-[#1e3a5f] transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 font-medium"
          >
            <Download size={20} />
            Export Data
          </button>
          <label className="flex items-center gap-2 px-5 py-3 bg-[#2C4F7C] text-white rounded-lg hover:bg-[#1e3a5f] transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 cursor-pointer font-medium">
            <Upload size={20} />
            Import Data
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleImport}
              className="hidden"
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default VoyagerHeader;
