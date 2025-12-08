const ForecastTable = ({ forecasts }) => {
  const formatCurrency = (value) =>
    value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const totals = {
    sfCount: forecasts.reduce((sum, f) => sum + f.sfCount, 0),
    randomizedCount: forecasts.reduce((sum, f) => sum + f.randomizedCount, 0),
    sfCost: forecasts.reduce((sum, f) => sum + f.sfCost, 0),
    startupCost: forecasts.reduce((sum, f) => sum + f.startupCost, 0),
    enrolledCost: forecasts.reduce((sum, f) => sum + f.enrolledCost, 0),
    stipends: forecasts.reduce((sum, f) => sum + f.stipends, 0),
    totalCost: forecasts.reduce((sum, f) => sum + f.totalCost, 0),
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-blue-200 shadow-md mb-8">
      <table className="w-full text-sm">
        <thead className="bg-[#2C4F7C] text-white">
          <tr>
            <th className="px-6 py-4 text-left font-bold">Month</th>
            <th className="px-6 py-4 text-right font-bold">SF Count</th>
            <th className="px-6 py-4 text-right font-bold">Randomized</th>
            <th className="px-6 py-4 text-right font-bold">SF Cost</th>
            <th className="px-6 py-4 text-right font-bold">Startup</th>
            <th className="px-6 py-4 text-right font-bold">Enrolled</th>
            <th className="px-6 py-4 text-right font-bold">Stipends</th>
            <th className="px-6 py-4 text-right font-bold">Total</th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {forecasts.map((forecast, idx) => (
            <tr
              key={idx}
              className={`border-b border-gray-100 hover:bg-gradient-to-r hover:from-cyan-50 hover:to-blue-50 transition-all duration-200 ${
                idx % 2 === 0 ? "bg-white" : "bg-gray-50"
              }`}
            >
              <td className="px-6 py-4 font-bold text-gray-900">
                {forecast.month}
              </td>
              <td className="px-6 py-4 text-right text-red-600 font-semibold">
                {forecast.sfCount}
              </td>
              <td className="px-6 py-4 text-right text-emerald-600 font-semibold">
                {forecast.randomizedCount}
              </td>
              <td className="px-6 py-4 text-right text-red-600 font-medium">
                ${formatCurrency(forecast.sfCost)}
              </td>
              <td className="px-6 py-4 text-right text-blue-600 font-medium">
                ${formatCurrency(forecast.startupCost)}
              </td>
              <td className="px-6 py-4 text-right text-indigo-600 font-medium">
                ${formatCurrency(forecast.enrolledCost)}
              </td>
              <td className="px-6 py-4 text-right text-teal-600 font-medium">
                ${formatCurrency(forecast.stipends)}
              </td>
              <td className="px-6 py-4 text-right font-bold bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-900">
                ${formatCurrency(forecast.totalCost)}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot className="bg-gradient-to-r from-gray-100 to-gray-200 font-bold border-t-4 border-cyan-600">
          <tr>
            <td className="px-6 py-4 text-left text-gray-900 text-base">
              TOTAL
            </td>
            <td className="px-6 py-4 text-right text-red-700 text-base">
              {totals.sfCount}
            </td>
            <td className="px-6 py-4 text-right text-emerald-700 text-base">
              {totals.randomizedCount}
            </td>
            <td className="px-6 py-4 text-right text-red-700 text-base">
              ${formatCurrency(totals.sfCost)}
            </td>
            <td className="px-6 py-4 text-right text-blue-700 text-base">
              ${formatCurrency(totals.startupCost)}
            </td>
            <td className="px-6 py-4 text-right text-indigo-700 text-base">
              ${formatCurrency(totals.enrolledCost)}
            </td>
            <td className="px-6 py-4 text-right text-teal-700 text-base">
              ${formatCurrency(totals.stipends)}
            </td>
            <td className="px-6 py-4 text-right text-cyan-900 bg-gradient-to-r from-cyan-200 to-blue-200 text-base">
              ${formatCurrency(totals.totalCost)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default ForecastTable;
