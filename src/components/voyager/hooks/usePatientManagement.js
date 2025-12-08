import {
  createNewPatient,
  calculateStatus,
  calculateSFCategory,
} from "../utils/patientUtils";

/**
 * Custom hook for managing patient data
 */
export const usePatientManagement = (sites, setSites, selectedSite) => {
  const addPatient = (type) => {
    const newPatient = createNewPatient();
    const updatedSites = [...sites];

    if (type === "actual") {
      updatedSites[selectedSite].actualPatients.push(newPatient);
    } else {
      updatedSites[selectedSite].forecastPatients.push(newPatient);
    }

    setSites(updatedSites);
  };

  const updatePatient = (type, patientId, field, value) => {
    const updatedSites = [...sites];
    const patients =
      type === "actual"
        ? updatedSites[selectedSite].actualPatients
        : updatedSites[selectedSite].forecastPatients;

    const patientIndex = patients.findIndex((p) => p.id === patientId);
    if (patientIndex !== -1) {
      patients[patientIndex][field] = value;

      // Auto-calculate status when screening fields or sfDate change
      if (field.startsWith("screen") || field === "sfDate") {
        patients[patientIndex].status = calculateStatus(patients[patientIndex]);
      }

      // Auto-calculate SF category when sfDate changes
      if (field === "sfDate") {
        patients[patientIndex].sfCategory = calculateSFCategory(
          patients[patientIndex]
        );
      }

      setSites(updatedSites);
    }
  };

  const deletePatient = (type, patientId) => {
    const updatedSites = [...sites];
    if (type === "actual") {
      updatedSites[selectedSite].actualPatients = updatedSites[
        selectedSite
      ].actualPatients.filter((p) => p.id !== patientId);
    } else {
      updatedSites[selectedSite].forecastPatients = updatedSites[
        selectedSite
      ].forecastPatients.filter((p) => p.id !== patientId);
    }
    setSites(updatedSites);
  };

  return {
    addPatient,
    updatePatient,
    deletePatient,
  };
};
