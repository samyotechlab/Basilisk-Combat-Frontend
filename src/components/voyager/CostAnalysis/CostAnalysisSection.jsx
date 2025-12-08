import { Download, DollarSign } from "lucide-react";
import StatisticsCards from "./StatisticsCards";
import ForecastTable from "./ForecastTable";
import CostingParameters from "./CostingParameters";
import {
  calculateMonthlyForecasts,
  calculateStatistics,
} from "../utils/calculations";
import { exportCalculations } from "../utils/excelUtils";

const CostAnalysisSection = ({ currentSite, sites, onUpdateCosting }) => {
  const forecasts = calculateMonthlyForecasts(currentSite);
  const statistics = calculateStatistics(currentSite);
  const totalCost = forecasts.reduce((sum, f) => sum + f.totalCost, 0);

  const handleExportCalculations = () => {
    exportCalculations(sites, calculateMonthlyForecasts);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-[#2C4F7C] flex items-center gap-2">
          <DollarSign className="text-[#2C4F7C]" size={28} strokeWidth={2.5} />
          Monthly Cost Forecast
        </h3>
        <button
          onClick={handleExportCalculations}
          className="flex items-center gap-2 px-5 py-3 bg-[#2C4F7C] text-white rounded-lg hover:bg-[#1e3a5f] transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 font-medium"
        >
          <Download size={20} strokeWidth={2.5} />
          Export Calculations
        </button>
      </div>

      <StatisticsCards statistics={statistics} totalCost={totalCost} />
      <ForecastTable forecasts={forecasts} />
      <CostingParameters
        costingData={currentSite.costingData}
        onUpdate={onUpdateCosting}
      />
    </div>
  );
};

export default CostAnalysisSection;
