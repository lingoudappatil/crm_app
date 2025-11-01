import React, { useState } from "react";

const AddLead = ({ onLeadAdded }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    state: "",
    followUpDate: "",
    followUpTime: "",
    followUpRemark: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      state: formData.state,
      followUps: [
        {
          date: formData.followUpDate,
          time: formData.followUpTime || "00:00",
          remark: formData.followUpRemark,
        },
      ],
    };

    try {
      const base = process.env.REACT_APP_API_URL || "http://localhost:5000";
      const response = await fetch(`${base.replace(/\/$/, "")}/api/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Failed to add lead");

      alert("✅ Lead added successfully!");
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        state: "",
        followUpDate: "",
        followUpTime: "",
        followUpRemark: "",
      });

      // Notify parent to refresh view list
      if (onLeadAdded) onLeadAdded();

    } catch (error) {
      console.error("Error adding lead:", error);
      alert(`❌ Error: ${error.message}`);
    }
  };

  return (
    <div className="add-form">
      <h2>Add Lead</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Full Name:</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Phone:</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Address:</label>
            <textarea name="address" value={formData.address} onChange={handleChange} rows="2" />
          </div>

          <div className="form-group">
            <label>State:</label>
            <input type="text" name="state" value={formData.state} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Follow-Up Date:</label>
            <input type="date" name="followUpDate" value={formData.followUpDate} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Follow-Up Time:</label>
            <input type="time" name="followUpTime" value={formData.followUpTime} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Follow-Up Remark:</label>
            <input type="text" name="followUpRemark" value={formData.followUpRemark} onChange={handleChange} required />
          </div>
        </div>

        <button type="submit" className="submit-button">Add Lead</button>
      </form>
    </div>
  );
};

export default AddLead;
