import React, { useState, useEffect } from "react";

const AddLead = ({ onLeadAdded }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    state: "",
    Source: "",
    followUpDate: "",
    followUpTime: "",
    followUpRemark: "",
  });

  const [leadSources, setLeadSources] = useState([]); // <-- Dynamic sources

  useEffect(() => {
    fetchLeadSources();
  }, []);

  const fetchLeadSources = async () => {
    try {
      const base = process.env.REACT_APP_API_URL || "http://localhost:5000";
      const res = await fetch(`${base}/api/settings/lead-sources`);
      const data = await res.json();
      setLeadSources(data.sources || []);
    } catch (err) {
      console.error("Error fetching sources:", err);
    }
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const base = process.env.REACT_APP_API_URL || "http://localhost:5000";
      const res = await fetch(`${base}/api/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add lead");

      alert("✅ Lead added successfully!");
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        state: "",
        Source: "",
        followUpDate: "",
        followUpTime: "",
        followUpRemark: "",
      });
    } catch (err) {
      alert(`❌ ${err.message}`);
    }
  };

  return (
    <div className="add-form">
      <h2>Add Lead</h2>
      <form onSubmit={handleSubmit}>
        {/* Your existing fields */}

        <div className="form-group">
          <label>Source:</label>
          <select name="Source" value={formData.Source} onChange={handleChange}>
            <option value="">Select Source</option>
            {leadSources.map((src, idx) => (
              <option key={idx} value={src}>
                {src}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="submit-button">
          Add Lead
        </button>
      </form>
    </div>
  );
};

export default AddLead;
