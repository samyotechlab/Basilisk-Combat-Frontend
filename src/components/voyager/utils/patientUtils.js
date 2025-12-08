import {
  DEFAULT_COSTING_DATA,
  DEFAULT_VISIT_GAPS,
  PATIENT_STATUS,
} from "../constants/voyagerConstants";

/**
 * Creates a new patient object with default values
 */
export const createNewPatient = () => ({
  id: Date.now(),
  cohort: 1,
  subjectId: `SUB${Date.now()}`,
  status: PATIENT_STATUS.SCREENING,
  screenT1: "",
  screenT2: "",
  screenT3: "",
  sfDate: "",
  sfCategory: "",
  sfRank: 0,
  enrollmentDate: "",
  projectedDiscontinued: "",
  actualDiscontinued: "",
  visits: Array(20).fill(""),
});

/**
 * Creates a new site object with default values
 */
export const createNewSite = (id, name) => ({
  id,
  name,
  actualPatients: [],
  forecastPatients: [],
  costingData: { ...DEFAULT_COSTING_DATA },
  visitGaps: [...DEFAULT_VISIT_GAPS],
});

/**
 * Calculates patient status based on their data
 */
export const calculateStatus = (patient) => {
  if (patient.sfDate) return PATIENT_STATUS.SCREEN_FAIL;
  if (
    patient.actualDiscontinued &&
    patient.actualDiscontinued < patient.projectedDiscontinued
  )
    return PATIENT_STATUS.ET;
  if (patient.screenT1 && patient.screenT2 && patient.screenT3)
    return PATIENT_STATUS.RANDOMIZED;
  return PATIENT_STATUS.SCREENING;
};

/**
 * Calculates screen failure category
 */
export const calculateSFCategory = (patient) => {
  if (!patient.sfDate) return "";
  if (patient.screenT1 && !patient.screenT2) return "T2";
  if (patient.screenT2 && !patient.screenT3) return "T3";
  if (!patient.screenT1) return "T1";
  return "";
};
