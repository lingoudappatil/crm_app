import React, { useState } from "react";

const Lead = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    state: "",
    followUpDate: "",
    followUpHour: "12",
    followUpMinute: "00",
    followUpAMPM: "AM",
    followUpRemark: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Combine hour, minute, AM/PM to 12-hour format string
    const followUpTime = `${formData.followUpHour}:${formData.followUpMinute} ${formData.followUpAMPM}`;

    const payload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      state: formData.state,
      followUps: [
        {
          date: formData.followUpDate,
          time: followUpTime,
          remark: formData.followUpRemark,
        },
      ],
    };

    try {
  const base = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  const response = await fetch(`${base.replace(/\/$/, '')}/api/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Failed to add lead");

      alert("Lead added successfully!");
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        state: "",
        followUpDate: "",
        followUpHour: "12",
        followUpMinute: "00",
        followUpAMPM: "AM",
        followUpRemark: "",
      });
    } catch (error) {
      console.error("Error adding lead:", error);
      alert(`Error: ${error.message}`);
    }
  };

  // Generate hour and minute options
  const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
  const minutes = Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, "0"));

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
        <label>Phone Number:</label>
        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label>Address:</label>
        <textarea name="address" value={formData.address} onChange={handleChange} rows="3" />
      </div>

      <div className="form-group">
        <label>State:</label>
        <input type="text" name="state" value={formData.state} onChange={handleChange} required />
      </div>
    </div>

    <button type="submit" className="submit-button">Add Lead</button>
  </form>
</div>

  );
};

export default Lead;
