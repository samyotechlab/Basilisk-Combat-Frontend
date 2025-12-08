import { Users } from "lucide-react";
import PatientRow from "./PatientRow";

const PatientTable = ({ patients, type, onUpdate, onDelete }) => {
  return (
    <div className="overflow-x-auto rounded-xl border border-blue-200 shadow-sm">
      <table className="w-full text-sm">
        <thead className="bg-[#2C4F7C] text-white">
          <tr>
            <th className="px-6 py-4 text-left font-bold">Cohort</th>
            <th className="px-6 py-4 text-left font-bold">Subject ID</th>
            <th className="px-6 py-4 text-left font-bold">Status</th>
            <th className="px-6 py-4 text-left font-bold">Screen T1</th>
            <th className="px-6 py-4 text-left font-bold">Screen T2</th>
            <th className="px-6 py-4 text-left font-bold">Screen T3</th>
            <th className="px-6 py-4 text-left font-bold">SF Date</th>
            <th className="px-6 py-4 text-left font-bold">Enrollment</th>
            <th className="px-6 py-4 text-left font-bold">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {patients.length > 0 ? (
            patients.map((patient) => (
              <PatientRow
                key={patient.id}
                patient={patient}
                type={type}
                onUpdate={onUpdate}
                onDelete={onDelete}
              />
            ))
          ) : (
            <tr>
              <td colSpan="9" className="text-center py-16">
                <div className="flex flex-col items-center justify-center text-gray-400">
                  <Users size={56} strokeWidth={1.5} className="mb-4" />
                  <p className="text-lg font-medium text-gray-500">
                    No patients added yet
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    Click "Add Patient" to get started
                  </p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PatientTable;
