import { useState } from "react";
import { createNewSite } from "../utils/patientUtils";

/**
 * Custom hook for managing sites
 */
export const useSiteManagement = () => {
  const [sites, setSites] = useState([
    createNewSite(1, "Site 001"),
  ]);
  const [selectedSite, setSelectedSite] = useState(0);

  const addSite = () => {
    const newSite = createNewSite(
      sites.length + 1,
      `Site ${String(sites.length + 1).padStart(3, "0")}`
    );
    setSites([...sites, newSite]);
    setSelectedSite(sites.length);
  };

  const updateSiteCosting = (siteIndex, key, value) => {
    const updatedSites = [...sites];
    updatedSites[siteIndex].costingData[key] = value;
    setSites(updatedSites);
  };

  const replaceSites = (newSites) => {
    setSites(newSites);
    setSelectedSite(0);
  };

  return {
    sites,
    selectedSite,
    currentSite: sites[selectedSite],
    addSite,
    setSelectedSite,
    updateSiteCosting,
    replaceSites,
    setSites,
  };
};
