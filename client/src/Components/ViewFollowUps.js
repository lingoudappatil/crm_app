import React, { useEffect, useState } from "react";

export default function ViewFollowUps() {
  const [followUps, setFollowUps] = useState([]);

  const fetchFollowUps = async () => {
  const base = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  const res = await fetch(`${base.replace(/\/$/, '')}/api/followups`);
    const data = await res.json();
    setFollowUps(data);
  };

  useEffect(() => { fetchFollowUps(); }, []);

  return (
    <div className="followup-container">
      <h2>📅 All Follow-Ups</h2>
      <table className="followup-table">
        <thead>
          <tr>
            <th>Type</th>
            <th>Related ID</th>
            <th>Follow-Up Date</th>
            <th>Notes</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {followUps.map(f => (
            <tr key={f._id}>
              <td>{f.relatedType}</td>
              <td>{f.relatedId}</td>
              <td>{new Date(f.followUpDate).toLocaleDateString()}</td>
              <td>{f.notes}</td>
              <td>{f.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
