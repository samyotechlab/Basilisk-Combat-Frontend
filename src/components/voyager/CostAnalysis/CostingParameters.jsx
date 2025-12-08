import { Calculator } from "lucide-react";

const CostingParameters = ({ costingData, onUpdate }) => {
  const parameters = [
    { key: "screenFailureTier1", label: "Screen Failure Tier 1" },
    { key: "screenFailureTier2", label: "Screen Failure Tier 2" },
    { key: "screenFailureTier3", label: "Screen Failure Tier 3" },
    { key: "startupCost", label: "Startup Cost" },
    { key: "pharmacySetup", label: "Pharmacy Setup" },
    { key: "labSetup", label: "Lab Setup" },
    { key: "radiologySetup", label: "Radiology Setup" },
    { key: "stipendPerVisit", label: "Stipend Per Visit" },
    { key: "closeoutCost", label: "Closeout Cost" },
  ];

  return (
    <div className="mt-8">
      <h4 className="text-xl font-bold text-[#2C4F7C] mb-6 flex items-center gap-2">
        <Calculator className="text-[#2C4F7C]" size={24} strokeWidth={2.5} />
        Costing Parameters
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {parameters.map((param) => (
          <div
            key={param.key}
            className="bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-xl border border-gray-300 shadow-sm hover:shadow-md transition-all duration-300 hover:border-cyan-300"
          >
            <label className="block text-sm font-bold text-gray-700 mb-3">
              {param.label}
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
                $
              </span>
              <input
                type="number"
                value={costingData[param.key]}
                onChange={(e) =>
                  onUpdate(param.key, parseFloat(e.target.value) || 0)
                }
                className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 shadow-sm font-medium"
                step="0.01"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CostingParameters;
