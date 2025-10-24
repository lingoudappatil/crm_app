import React, { useEffect, useState } from "react";

const ViewLeads = ({ onRefreshParent }) => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 8;

  const fetchData = async () => {
    setLoading(true);
    try {
  const base = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  const res = await fetch(`${base.replace(/\/$/, '')}/api/leads`);
      if (!res.ok) throw new Error("Fetch failed");
      setLeads(await res.json());
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);
  useEffect(() => {
    const input = document.getElementById("global-search");
    const handler = (e) => setQuery(e.target.value);
    if (input) input.addEventListener("input", handler);
    return () => input && input.removeEventListener("input", handler);
  }, []);

  const filtered = leads.filter(l => JSON.stringify(l).toLowerCase().includes(query.toLowerCase()));
  const pageCount = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageData = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3>Leads</h3>
        <button onClick={() => { fetchData(); if (onRefreshParent) onRefreshParent(); }}>Refresh</button>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table className="data-table">
          <thead>
            <tr><th>#</th><th>Title</th><th>Contact</th><th>Source</th><th>Status</th><th>Created</th></tr>
          </thead>
          <tbody>
            {pageData.length === 0 && <tr><td colSpan="6">No leads found.</td></tr>}
            {pageData.map((l, i) => (
              <tr key={l._id || l.id || i}>
                <td>{(page - 1) * perPage + i + 1}</td>
                <td>{l.title || l.name || "-"}</td>
                <td>{l.contact || l.phone || l.email || "-"}</td>
                <td>{l.source || "-"}</td>
                <td>{l.status || "-"}</td>
                <td>{l.createdAt ? new Date(l.createdAt).toLocaleString() : "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button onClick={() => setPage(1)} disabled={page === 1}>First</button>
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Prev</button>
        <span>Page {page} / {pageCount}</span>
        <button onClick={() => setPage(p => Math.min(pageCount, p + 1))} disabled={page === pageCount}>Next</button>
        <button onClick={() => setPage(pageCount)} disabled={page === pageCount}>Last</button>
      </div>
    </div>
  );
};

export default ViewLeads;
