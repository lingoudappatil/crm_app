// client/src/Components/Settings/SettingsPage.js
import React, { useState } from "react";
import { useSettings } from "../../context/SettingsContext";
import "./settings.css";

const SettingsPage = () => {
  const { leadSources, addLeadSource, removeLeadSource } = useSettings();
  const [newSource, setNewSource] = useState("");
  const [activeTab, setActiveTab] = useState("sources");

  const handleAdd = (e) => {
    e.preventDefault();
    if (newSource.trim()) {
      addLeadSource(newSource.trim());
      setNewSource("");
    }
  };

  return (
    <div className="settings-page">
      <h2>Settings</h2>
      
      <div className="settings-nav">
        <button 
          className={activeTab === "sources" ? "active" : ""} 
          onClick={() => setActiveTab("sources")}
        >
          Lead Sources
        </button>
        {/* Add more settings tabs here */}
      </div>

      {activeTab === "sources" && (
        <div className="settings-section">
          <h3>Manage Lead Sources</h3>
          
          <ul className="source-list">
            {leadSources.map((source, index) => (
              <li key={index} className="source-item">
                <span>{source}</span>
                <button onClick={() => removeLeadSource(source)}>Remove</button>
              </li>
            ))}
          </ul>

          <form onSubmit={handleAdd} className="add-source-form">
            <input
              type="text"
              placeholder="Enter new lead source"
              value={newSource}
              onChange={(e) => setNewSource(e.target.value)}
            />
            <button type="submit">Add Source</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
