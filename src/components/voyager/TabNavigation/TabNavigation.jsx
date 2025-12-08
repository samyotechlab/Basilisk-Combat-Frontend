import { Users, Calendar, DollarSign } from "lucide-react";

const TabNavigation = ({
  activeTab,
  onTabChange,
  actualCount,
  forecastCount,
}) => {
  const tabs = [
    {
      id: "actual",
      label: "Actual Patients",
      icon: Users,
      count: actualCount,
      color: "[#2C4F7C]",
    },
    {
      id: "forecast",
      label: "Forecast Patients",
      icon: Calendar,
      count: forecastCount,
      color: "[#2C4F7C]",
    },
    {
      id: "costing",
      label: "Cost Analysis",
      icon: DollarSign,
      count: null,
      color: "[#2C4F7C]",
    },
  ];

  return (
    <div className="flex border-b border-blue-200">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 px-6 py-4 font-semibold transition-all duration-300 relative overflow-hidden group ${
              isActive
                ? "bg-[#2C4F7C] text-white"
                : "bg-gray-50 text-gray-700 hover:bg-blue-50"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Icon
                className={`transition-transform group-hover:scale-110 ${
                  isActive ? "text-white" : `text-${tab.color}-500`
                }`}
                size={20}
                strokeWidth={2.5}
              />
              <span>
                {tab.label}
                {tab.count !== null && (
                  <span
                    className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-blue-100 text-[#2C4F7C]"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </span>
            </div>
            {isActive && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#00A3E0]"></div>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default TabNavigation;
