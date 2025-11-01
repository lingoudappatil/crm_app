import React, { useEffect, useState } from "react";
import DateFilter from "./datefilter"; // ✅ Make sure file name matches correctly

const ViewLeads = ({ onRefreshParent }) => {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [page, setPage] = useState(1);
  const perPage = 8;

  // ✅ Fetch data from backend
  const fetchData = async () => {
    setLoading(true);
    try {
      const base = process.env.REACT_APP_API_URL || "http://localhost:5000";
      const res = await fetch(`${base.replace(/\/$/, "")}/api/leads`);
      if (!res.ok) throw new Error("Fetch failed");
      const data = await res.json();
      setLeads(data);
      setFilteredLeads(data); // show all initially
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ✅ Global search
  useEffect(() => {
    const input = document.getElementById("global-search");
    const handler = (e) => setQuery(e.target.value);
    if (input) input.addEventListener("input", handler);
    return () => input && input.removeEventListener("input", handler);
  }, []);

  // ✅ Status + Search filter
  const visibleLeads = filteredLeads
    .filter((l) => JSON.stringify(l).toLowerCase().includes(query.toLowerCase()))
    .filter((l) => (filterStatus === "all" ? true : l.status === filterStatus));

  // ✅ Pagination
  const pageCount = Math.max(1, Math.ceil(visibleLeads.length / perPage));
  const pageData = visibleLeads.slice((page - 1) * perPage, page * perPage);

  // ✅ Date filter handler
  const handleDateFilter = (start, end) => {
    if (!start || !end) {
      setFilteredLeads(leads);
      return;
    }
    const filtered = leads.filter((item) => {
      const date = new Date(item.createdAt);
      return date >= start && date <= end;
    });
    setFilteredLeads(filtered);
    setPage(1);
  };

  return (
    <div>
      {/* 🔹 Header Line Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "15px",
          background: "#f5f5f5",
          padding: "10px 15px",
          borderRadius: "8px",
        }}
      >
        <h3 style={{ margin: 0 }}>Leads</h3>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{
              padding: "6px 10px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          >
            <option value="all">All</option>
            <option value="New">New</option>
            <option value="Active">Active</option>
            <option value="Converted">Converted</option>
            <option value="Lost">Lost</option>
          </select>

          {/* Date Filter Component */}
          <DateFilter onFilter={handleDateFilter} />

          {/* Refresh Button */}
          <button
            onClick={() => {
              fetchData();
              if (onRefreshParent) onRefreshParent();
            }}
            style={{
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "6px",
              padding: "6px 12px",
              cursor: "pointer",
            }}
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* 🔹 Data Table */}
      <div style={{ overflowX: "auto" }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Contact</th>
              <th>Source</th>
              <th>Status</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {pageData.length === 0 && (
              <tr>
                <td colSpan="6">No leads found.</td>
              </tr>
            )}
            {pageData.map((l, i) => (
              <tr key={l._id || i}>
                <td>{(page - 1) * perPage + i + 1}</td>
                <td>{l.title || l.name || "-"}</td>
                <td>{l.contact || l.phone || l.email || "-"}</td>
                <td>{l.source || "-"}</td>
                <td>{l.status || "-"}</td>
                <td>
                  {l.createdAt
                    ? new Date(l.createdAt).toLocaleDateString()
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🔹 Pagination */}
      <div className="pagination">
        <button onClick={() => setPage(1)} disabled={page === 1}>
          First
        </button>
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Prev
        </button>
        <span>
          Page {page} / {pageCount}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
          disabled={page === pageCount}
        >
          Next
        </button>
        <button
          onClick={() => setPage(pageCount)}
          disabled={page === pageCount}
        >
          Last
        </button>
      </div>
    </div>
  );
};

export default ViewLeads;
