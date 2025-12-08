import { Users, Calendar, AlertCircle, DollarSign } from "lucide-react";

const StatisticsCards = ({ statistics, totalCost }) => {
  const cards = [
    {
      label: "Total Patients",
      value: statistics.totalPatients,
      icon: Users,
      gradient: "from-[#2C4F7C] to-[#1e3a5f]",
      bgGradient: "from-blue-50 to-blue-100",
      borderColor: "border-blue-300",
    },
    {
      label: "Randomized",
      value: statistics.randomizedCount,
      icon: Calendar,
      gradient: "from-emerald-500 to-teal-600",
      bgGradient: "from-emerald-50 to-teal-100",
      borderColor: "border-emerald-300",
    },
    {
      label: "Screen Failures",
      value: statistics.screenFailCount,
      icon: AlertCircle,
      gradient: "from-red-500 to-rose-600",
      bgGradient: "from-red-50 to-rose-100",
      borderColor: "border-red-300",
    },
    {
      label: "Total Cost (12mo)",
      value: `$${totalCost.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      icon: DollarSign,
      gradient: "from-[#00A3E0] to-[#0091c7]",
      bgGradient: "from-cyan-50 to-blue-100",
      borderColor: "border-cyan-300",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`bg-gradient-to-br ${card.bgGradient} p-6 rounded-xl border-2 ${card.borderColor} shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1`}
          >
            <div className="flex items-center justify-between mb-3">
              <p
                className={`text-sm font-bold bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent uppercase tracking-wide`}
              >
                {card.label}
              </p>
              <Icon
                className={`bg-gradient-to-r ${card.gradient} text-white p-2 rounded-lg`}
                size={36}
                strokeWidth={2.5}
              />
            </div>
            <p className="text-3xl font-bold text-gray-800">{card.value}</p>
          </div>
        );
      })}
    </div>
  );
};

export default StatisticsCards;
