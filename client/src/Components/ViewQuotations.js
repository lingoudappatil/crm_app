import React, { useEffect, useState } from "react";

const ViewQuotations = ({ onRefreshParent }) => {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 8;

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/quotations");
      if (!res.ok) throw new Error("Fetch failed");
      setQuotes(await res.json());
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);
  useEffect(() => {
    const input = document.getElementById("global-search");
    const handler = (e) => setQuery(e.target.value);
    if (input) input.addEventListener("input", handler);
    return () => input && input.removeEventListener("input", handler);
  }, []);

  const filtered = quotes.filter(q => JSON.stringify(q).toLowerCase().includes(query.toLowerCase()));
  const pageCount = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageData = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3>Quotations</h3>
        <button onClick={() => { fetchData(); if (onRefreshParent) onRefreshParent(); }}>Refresh</button>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table className="data-table">
          <thead>
            <tr><th>#</th><th>Quote No.</th><th>Customer</th><th>Amount</th><th>Status</th><th>Date</th></tr>
          </thead>
          <tbody>
            {pageData.length === 0 && <tr><td colSpan="6">No quotations found.</td></tr>}
            {pageData.map((q, i) => (
              <tr key={q._id || q.id || i}>
                <td>{(page - 1) * perPage + i + 1}</td>
                <td>{q.quoteNumber || q.ref || q._id}</td>
                <td>{q.customerName || q.customer || "-"}</td>
                <td>{q.totalAmount || q.amount || "-"}</td>
                <td>{q.status || "-"}</td>
                <td>{q.createdAt ? new Date(q.createdAt).toLocaleString() : "-"}</td>
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

export default ViewQuotations;
