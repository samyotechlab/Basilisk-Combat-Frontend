// Voyager Clinical Trial Forecasting - Constants

export const DEFAULT_COSTING_DATA = {
  screenFailureTier1: 4518.12,
  screenFailureTier2: 1447.62,
  screenFailureTier3: 6797.88,
  startupCost: 11500,
  pharmacySetup: 2500,
  labSetup: 1500,
  radiologySetup: 2000,
  stipendPerVisit: 511,
  closeoutCost: 5000,
};

export const DEFAULT_VISIT_GAPS = [
  5, 7, 14, 21, 28, 35, 42, 49, 56, 63, 70, 77, 84, 91, 98, 105, 112, 119, 126,
  133,
];

export const MONTHS = [
  "Jan-25",
  "Feb-25",
  "Mar-25",
  "Apr-25",
  "May-25",
  "Jun-25",
  "Jul-25",
  "Aug-25",
  "Sep-25",
  "Oct-25",
  "Nov-25",
  "Dec-25",
];

export const PATIENT_STATUS = {
  SCREENING: "Screening",
  RANDOMIZED: "Randomized",
  SCREEN_FAIL: "Screen-Fail",
  ET: "ET",
};

export const SF_CATEGORIES = {
  T1: "T1",
  T2: "T2",
  T3: "T3",
};

export const ENROLLED_COST_PER_PATIENT = 7913.44;
