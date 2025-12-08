import {
  MONTHS,
  PATIENT_STATUS,
  ENROLLED_COST_PER_PATIENT,
} from "../constants/voyagerConstants";

/**
 * Calculates monthly forecasts for a site
 */
export const calculateMonthlyForecasts = (site) => {
  const forecasts = MONTHS.map((month, idx) => {
    const allPatients = [...site.actualPatients, ...site.forecastPatients];

    const sfCount = allPatients.filter(
      (p) => p.status === PATIENT_STATUS.SCREEN_FAIL
    ).length;
    const randomizedCount = allPatients.filter(
      (p) => p.status === PATIENT_STATUS.RANDOMIZED
    ).length;

    const avgSF =
      (site.costingData.screenFailureTier1 +
        site.costingData.screenFailureTier2 +
        site.costingData.screenFailureTier3) /
      3;
    const sfCost = avgSF * sfCount;

    const startupTotal =
      site.costingData.startupCost +
      site.costingData.pharmacySetup +
      site.costingData.labSetup +
      site.costingData.radiologySetup;
    const monthlyStartup = startupTotal / 8;

    const enrolledCost = randomizedCount * ENROLLED_COST_PER_PATIENT * 0.125;

    let multiplier = 6;
    if (idx >= 1 && idx <= 6) multiplier = 6.5;
    if (idx >= 7) multiplier = 13;

    const stipends =
      ((sfCount + randomizedCount * multiplier) *
        site.costingData.stipendPerVisit) /
      8;

    const totalCost = sfCost + monthlyStartup + enrolledCost + stipends;

    return {
      month,
      sfCount,
      randomizedCount,
      sfCost,
      startupCost: monthlyStartup,
      enrolledCost,
      stipends,
      totalCost,
    };
  });

  return forecasts;
};

/**
 * Calculates aggregate statistics for a site
 */
export const calculateStatistics = (site) => {
  const allPatients = [...site.actualPatients, ...site.forecastPatients];

  return {
    totalPatients: allPatients.length,
    randomizedCount: allPatients.filter(
      (p) => p.status === PATIENT_STATUS.RANDOMIZED
    ).length,
    screenFailCount: allPatients.filter(
      (p) => p.status === PATIENT_STATUS.SCREEN_FAIL
    ).length,
  };
};
