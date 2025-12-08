import { Plus, Building2 } from "lucide-react";

const SiteManagement = ({ sites, selectedSite, onSelectSite, onAddSite }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 mb-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl font-bold text-[#2C4F7C] flex items-center gap-2">
          <Building2 className="text-[#2C4F7C]" size={28} strokeWidth={2.5} />
          Clinical Sites
        </h2>
        <button
          onClick={onAddSite}
          className="flex items-center gap-2 px-5 py-3 bg-[#2C4F7C] text-white rounded-lg hover:bg-[#1e3a5f] transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 font-medium"
        >
          <Plus size={20} strokeWidth={2.5} />
          Add Site
        </button>
      </div>
      <div className="flex gap-3 flex-wrap">
        {sites.map((site, idx) => (
          <button
            key={site.id}
            onClick={() => onSelectSite(idx)}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-md ${
              selectedSite === idx
                ? "bg-[#2C4F7C] text-white shadow-lg transform scale-105 ring-2 ring-[#2C4F7C]/30"
                : "bg-gray-50 text-gray-700 hover:bg-blue-50 hover:shadow-md hover:text-[#2C4F7C]"
            }`}
          >
            <Building2 className="inline mr-2" size={18} />
            {site.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SiteManagement;
