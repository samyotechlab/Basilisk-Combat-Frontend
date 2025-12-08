import { Plus, Users } from "lucide-react";
import PatientTable from "./PatientTable";

const PatientDataSection = ({
  type,
  patients,
  onAddPatient,
  onUpdatePatient,
  onDeletePatient,
}) => {
  const title = type === "actual" ? "Actual" : "Forecast";

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-[#2C4F7C] flex items-center gap-2">
          <Users className="text-[#2C4F7C]" size={28} strokeWidth={2.5} />
          {title} Patient Data
        </h3>
        <button
          onClick={() => onAddPatient(type)}
          className="flex items-center gap-2 px-5 py-3 bg-[#00A3E0] text-white rounded-lg hover:bg-[#0091c7] transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 font-medium"
        >
          <Plus size={20} strokeWidth={2.5} />
          Add Patient
        </button>
      </div>

      <PatientTable
        patients={patients}
        type={type}
        onUpdate={onUpdatePatient}
        onDelete={onDeletePatient}
      />
    </div>
  );
};

export default PatientDataSection;
