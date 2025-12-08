import { Trash2 } from "lucide-react";

const PatientRow = ({ patient, type, onUpdate, onDelete }) => {
  const getStatusStyle = (status) => {
    switch (status) {
      case "Randomized":
        return "bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 border border-emerald-300";
      case "Screen-Fail":
        return "bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border border-red-300";
      case "ET":
        return "bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 border border-amber-300";
      default:
        return "bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-800 border border-cyan-300";
    }
  };

  return (
    <tr className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-cyan-50 hover:to-blue-50 transition-all duration-200">
      <td className="px-6 py-4">
        <input
          type="number"
          value={patient.cohort}
          onChange={(e) =>
            onUpdate(type, patient.id, "cohort", parseInt(e.target.value) || 1)
          }
          className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C4F7C] focus:border-transparent transition font-medium"
          min="1"
          max="3"
        />
      </td>
      <td className="px-6 py-4">
        <input
          type="text"
          value={patient.subjectId}
          onChange={(e) =>
            onUpdate(type, patient.id, "subjectId", e.target.value)
          }
          className="w-36 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C4F7C] focus:border-transparent transition font-medium"
          placeholder="Subject ID"
        />
      </td>
      <td className="px-6 py-4">
        <span
          className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold shadow-sm whitespace-nowrap ${getStatusStyle(
            patient.status
          )}`}
        >
          {patient.status}
        </span>
      </td>
      <td className="px-6 py-4">
        <input
          type="date"
          value={patient.screenT1}
          onChange={(e) =>
            onUpdate(type, patient.id, "screenT1", e.target.value)
          }
          className="w-40 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
        />
      </td>
      <td className="px-6 py-4">
        <input
          type="date"
          value={patient.screenT2}
          onChange={(e) =>
            onUpdate(type, patient.id, "screenT2", e.target.value)
          }
          className="w-40 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
        />
      </td>
      <td className="px-6 py-4">
        <input
          type="date"
          value={patient.screenT3}
          onChange={(e) =>
            onUpdate(type, patient.id, "screenT3", e.target.value)
          }
          className="w-40 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
        />
      </td>
      <td className="px-6 py-4">
        <input
          type="date"
          value={patient.sfDate}
          onChange={(e) => onUpdate(type, patient.id, "sfDate", e.target.value)}
          className="w-40 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
        />
      </td>
      <td className="px-6 py-4">
        <input
          type="date"
          value={patient.enrollmentDate}
          onChange={(e) =>
            onUpdate(type, patient.id, "enrollmentDate", e.target.value)
          }
          className="w-40 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
        />
      </td>
      <td className="px-6 py-4">
        <button
          onClick={() => onDelete(type, patient.id)}
          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-110 shadow-sm"
          title="Delete Patient"
        >
          <Trash2 size={18} strokeWidth={2.5} />
        </button>
      </td>
    </tr>
  );
};

export default PatientRow;
