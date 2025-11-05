// client/src/context/SettingsContext.js
import React, { createContext, useState, useContext } from "react";

// Create Context
const SettingsContext = createContext();

// Provider component
export const SettingsProvider = ({ children }) => {
  // You can add more settings later (like status, stage, etc.)
  const [leadSources, setLeadSources] = useState([
    "Friend",
    "Walk In",
    "Social Media",
    "Other",
  ]);

  // Function to add a new source
  const addLeadSource = (newSource) => {
    if (!leadSources.includes(newSource) && newSource.trim() !== "") {
      setLeadSources([...leadSources, newSource]);
    }
  };

  // Function to remove a source
  const removeLeadSource = (sourceToRemove) => {
    setLeadSources(leadSources.filter(source => source !== sourceToRemove));
  };

  return (
    <SettingsContext.Provider value={{ leadSources, addLeadSource, removeLeadSource }}>
      {children}
    </SettingsContext.Provider>
  );
};

// Hook to use in other components
export const useSettings = () => useContext(SettingsContext);