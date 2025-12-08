import * as XLSX from "xlsx";
import { createNewSite } from "./patientUtils";
import { MONTHS } from "../constants/voyagerConstants";

/**
 * Downloads a sample Excel template
 */
export const downloadSampleExcel = () => {
  const sampleSite = createNewSite(1, "Site 001");
  sampleSite.actualPatients = [
    {
      id: 1,
      cohort: 1,
      subjectId: "001-001",
      status: "Randomized",
      screenT1: "2025-01-15",
      screenT2: "2025-01-20",
      screenT3: "2025-01-25",
      sfDate: "",
      sfCategory: "",
      sfRank: 0,
      enrollmentDate: "2025-01-30",
      projectedDiscontinued: "",
      actualDiscontinued: "",
    },
    {
      id: 2,
      cohort: 1,
      subjectId: "001-002",
      status: "Screen-Fail",
      screenT1: "2025-02-01",
      screenT2: "",
      screenT3: "",
      sfDate: "2025-02-05",
      sfCategory: "T2",
      sfRank: 1,
      enrollmentDate: "",
      projectedDiscontinued: "",
      actualDiscontinued: "",
    },
  ];
  sampleSite.forecastPatients = [
    {
      id: 3,
      cohort: 2,
      subjectId: "001-F001",
      status: "Screening",
      screenT1: "2025-03-01",
      screenT2: "",
      screenT3: "",
      sfDate: "",
      sfCategory: "",
      sfRank: 0,
      enrollmentDate: "",
      projectedDiscontinued: "",
      actualDiscontinued: "",
    },
  ];

  const wb = XLSX.utils.book_new();

  const actualData = [
    [
      "Cohort",
      "Subject ID",
      "Status",
      "Screen T1",
      "Screen T2",
      "Screen T3",
      "SF Date",
      "SF Category",
      "SF Rank",
      "Enrollment Date",
      "Projected Discontinued",
      "Actual Discontinued",
    ],
    ...sampleSite.actualPatients.map((p) => [
      p.cohort,
      p.subjectId,
      p.status,
      p.screenT1,
      p.screenT2,
      p.screenT3,
      p.sfDate,
      p.sfCategory,
      p.sfRank,
      p.enrollmentDate,
      p.projectedDiscontinued,
      p.actualDiscontinued,
    ]),
  ];
  const wsActual = XLSX.utils.aoa_to_sheet(actualData);
  XLSX.utils.book_append_sheet(wb, wsActual, "Site 001 Actual");

  const forecastData = [
    [
      "Cohort",
      "Subject ID",
      "Status",
      "Screen T1",
      "Screen T2",
      "Screen T3",
      "SF Date",
      "SF Category",
      "SF Rank",
      "Enrollment Date",
      "Projected Discontinued",
      "Actual Discontinued",
    ],
    ...sampleSite.forecastPatients.map((p) => [
      p.cohort,
      p.subjectId,
      p.status,
      p.screenT1,
      p.screenT2,
      p.screenT3,
      p.sfDate,
      p.sfCategory,
      p.sfRank,
      p.enrollmentDate,
      p.projectedDiscontinued,
      p.actualDiscontinued,
    ]),
  ];
  const wsForecast = XLSX.utils.aoa_to_sheet(forecastData);
  XLSX.utils.book_append_sheet(wb, wsForecast, "Site 001 Forecast");

  const costingData = [
    ["Parameter", "Value"],
    ["Screen Failure Tier 1", sampleSite.costingData.screenFailureTier1],
    ["Screen Failure Tier 2", sampleSite.costingData.screenFailureTier2],
    ["Screen Failure Tier 3", sampleSite.costingData.screenFailureTier3],
    ["Startup Cost", sampleSite.costingData.startupCost],
    ["Pharmacy Setup", sampleSite.costingData.pharmacySetup],
    ["Lab Setup", sampleSite.costingData.labSetup],
    ["Radiology Setup", sampleSite.costingData.radiologySetup],
    ["Stipend Per Visit", sampleSite.costingData.stipendPerVisit],
    ["Closeout Cost", sampleSite.costingData.closeoutCost],
  ];
  const wsCosting = XLSX.utils.aoa_to_sheet(costingData);
  XLSX.utils.book_append_sheet(wb, wsCosting, "Site 001 Costing");

  XLSX.writeFile(wb, "Sample_Site_Template.xlsx");
};

/**
 * Exports all site data to Excel
 */
export const exportData = (sites) => {
  const wb = XLSX.utils.book_new();

  sites.forEach((site) => {
    if (site.actualPatients.length > 0) {
      const actualData = [
        [
          "Cohort",
          "Subject ID",
          "Status",
          "Screen T1",
          "Screen T2",
          "Screen T3",
          "SF Date",
          "SF Category",
          "SF Rank",
          "Enrollment Date",
          "Projected Discontinued",
          "Actual Discontinued",
        ],
        ...site.actualPatients.map((p) => [
          p.cohort,
          p.subjectId,
          p.status,
          p.screenT1,
          p.screenT2,
          p.screenT3,
          p.sfDate,
          p.sfCategory,
          p.sfRank,
          p.enrollmentDate,
          p.projectedDiscontinued,
          p.actualDiscontinued,
        ]),
      ];
      const ws = XLSX.utils.aoa_to_sheet(actualData);
      XLSX.utils.book_append_sheet(wb, ws, `${site.name} Actual`);
    }

    if (site.forecastPatients.length > 0) {
      const forecastData = [
        [
          "Cohort",
          "Subject ID",
          "Status",
          "Screen T1",
          "Screen T2",
          "Screen T3",
          "SF Date",
          "SF Category",
          "SF Rank",
          "Enrollment Date",
          "Projected Discontinued",
          "Actual Discontinued",
        ],
        ...site.forecastPatients.map((p) => [
          p.cohort,
          p.subjectId,
          p.status,
          p.screenT1,
          p.screenT2,
          p.screenT3,
          p.sfDate,
          p.sfCategory,
          p.sfRank,
          p.enrollmentDate,
          p.projectedDiscontinued,
          p.actualDiscontinued,
        ]),
      ];
      const ws = XLSX.utils.aoa_to_sheet(forecastData);
      XLSX.utils.book_append_sheet(wb, ws, `${site.name} Forecast`);
    }

    const costingData = [
      ["Parameter", "Value"],
      ["Screen Failure Tier 1", site.costingData.screenFailureTier1],
      ["Screen Failure Tier 2", site.costingData.screenFailureTier2],
      ["Screen Failure Tier 3", site.costingData.screenFailureTier3],
      ["Startup Cost", site.costingData.startupCost],
      ["Pharmacy Setup", site.costingData.pharmacySetup],
      ["Lab Setup", site.costingData.labSetup],
      ["Radiology Setup", site.costingData.radiologySetup],
      ["Stipend Per Visit", site.costingData.stipendPerVisit],
      ["Closeout Cost", site.costingData.closeoutCost],
    ];
    const wsCosting = XLSX.utils.aoa_to_sheet(costingData);
    XLSX.utils.book_append_sheet(wb, wsCosting, `${site.name} Costing`);
  });

  XLSX.writeFile(wb, "Voyager_Forecast_Export.xlsx");
};

/**
 * Imports site data from Excel file
 */
export const importData = (file, onSuccess, onError) => {
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      const importedSites = [];

      workbook.SheetNames.forEach((sheetName) => {
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if (sheetName.includes("Actual")) {
          const siteName = sheetName.replace(" Actual", "");
          const currentSite = createNewSite(
            importedSites.length + 1,
            siteName
          );

          for (let i = 1; i < jsonData.length; i++) {
            const row = jsonData[i];
            if (row.length > 0 && row[1]) {
              currentSite.actualPatients.push({
                id: Date.now() + i,
                cohort: row[0] || 1,
                subjectId: row[1] || "",
                status: row[2] || "Screening",
                screenT1: row[3] || "",
                screenT2: row[4] || "",
                screenT3: row[5] || "",
                sfDate: row[6] || "",
                sfCategory: row[7] || "",
                sfRank: row[8] || 0,
                enrollmentDate: row[9] || "",
                projectedDiscontinued: row[10] || "",
                actualDiscontinued: row[11] || "",
                visits: Array(20).fill(""),
              });
            }
          }
          importedSites.push(currentSite);
        } else if (sheetName.includes("Forecast")) {
          const siteName = sheetName.replace(" Forecast", "");
          let site = importedSites.find((s) => s.name === siteName);

          if (!site) {
            site = createNewSite(importedSites.length + 1, siteName);
            importedSites.push(site);
          }

          for (let i = 1; i < jsonData.length; i++) {
            const row = jsonData[i];
            if (row.length > 0 && row[1]) {
              site.forecastPatients.push({
                id: Date.now() + i + 1000,
                cohort: row[0] || 1,
                subjectId: row[1] || "",
                status: row[2] || "Screening",
                screenT1: row[3] || "",
                screenT2: row[4] || "",
                screenT3: row[5] || "",
                sfDate: row[6] || "",
                sfCategory: row[7] || "",
                sfRank: row[8] || 0,
                enrollmentDate: row[9] || "",
                projectedDiscontinued: row[10] || "",
                actualDiscontinued: row[11] || "",
                visits: Array(20).fill(""),
              });
            }
          }
        } else if (sheetName.includes("Costing")) {
          const siteName = sheetName.replace(" Costing", "");
          const site = importedSites.find((s) => s.name === siteName);

          if (site && jsonData.length > 1) {
            for (let i = 1; i < jsonData.length; i++) {
              const row = jsonData[i];
              const param = row[0];
              const value = parseFloat(row[1]) || 0;

              if (param === "Screen Failure Tier 1")
                site.costingData.screenFailureTier1 = value;
              if (param === "Screen Failure Tier 2")
                site.costingData.screenFailureTier2 = value;
              if (param === "Screen Failure Tier 3")
                site.costingData.screenFailureTier3 = value;
              if (param === "Startup Cost")
                site.costingData.startupCost = value;
              if (param === "Pharmacy Setup")
                site.costingData.pharmacySetup = value;
              if (param === "Lab Setup") site.costingData.labSetup = value;
              if (param === "Radiology Setup")
                site.costingData.radiologySetup = value;
              if (param === "Stipend Per Visit")
                site.costingData.stipendPerVisit = value;
              if (param === "Closeout Cost")
                site.costingData.closeoutCost = value;
            }
          }
        }
      });

      if (importedSites.length > 0) {
        onSuccess(importedSites);
      } else {
        onError("No valid data found in the file.");
      }
    } catch (error) {
      onError("Error importing file. Please check the format.");
      console.error("Import Error:", error);
    }
  };
  reader.readAsArrayBuffer(file);
};

/**
 * Exports cost calculations to Excel
 */
export const exportCalculations = (sites, calculateMonthlyForecasts) => {
  const wb = XLSX.utils.book_new();

  sites.forEach((site) => {
    const forecasts = calculateMonthlyForecasts(site);

    const forecastData = forecasts.map((forecast) => [
      forecast.month,
      forecast.sfCount,
      forecast.randomizedCount,
      forecast.sfCost.toFixed(2),
      forecast.startupCost.toFixed(2),
      forecast.enrolledCost.toFixed(2),
      forecast.stipends.toFixed(2),
      forecast.totalCost.toFixed(2),
    ]);

    const sheetData = [
      [
        "Month",
        "SF Count",
        "Randomized",
        "SF Cost",
        "Startup Cost",
        "Enrolled Cost",
        "Stipends",
        "Total Cost",
      ],
      ...forecastData,
      [
        "TOTAL",
        forecasts.reduce((sum, f) => sum + f.sfCount, 0),
        forecasts.reduce((sum, f) => sum + f.randomizedCount, 0),
        forecasts.reduce((sum, f) => sum + f.sfCost, 0).toFixed(2),
        forecasts.reduce((sum, f) => sum + f.startupCost, 0).toFixed(2),
        forecasts.reduce((sum, f) => sum + f.enrolledCost, 0).toFixed(2),
        forecasts.reduce((sum, f) => sum + f.stipends, 0).toFixed(2),
        forecasts.reduce((sum, f) => sum + f.totalCost, 0).toFixed(2),
      ],
    ];

    const ws = XLSX.utils.aoa_to_sheet(sheetData);
    XLSX.utils.book_append_sheet(wb, ws, `${site.name} Forecast`);
  });

  XLSX.writeFile(wb, "Voyager_Cost_Analysis.xlsx");
};
