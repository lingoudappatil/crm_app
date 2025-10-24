import React, { useEffect, useState } from "react";
import FieldRenderer from "../common/FieldRenderer";

const STORAGE_KEY = "order_fields";

export default function Order() {
  const [fields, setFields] = useState([]);
  const [values, setValues] = useState({});
  const [submitted, setSubmitted] = useState(null);
  const [loading, setLoading] = useState(false);

  // base url for API
  const defaultBase = process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : '';
  const baseUrl = process.env.REACT_APP_API_URL || defaultBase;

  useEffect(() => {
    try {
      let raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        // Set default fields if none exist
        const defaultFields = [
          {
            id: 'customerName',
            type: 'text',
            label: 'Customer Name',
            placeholder: 'Enter customer name',
            required: true,
            plugged: true
          },
          {
            id: 'orderDate',
            type: 'text',
            label: 'Order Date',
            default: new Date().toISOString().split('T')[0],
            required: true,
            plugged: true
          },
          {
            id: 'amount',
            type: 'number',
            label: 'Order Amount',
            placeholder: 'Enter order amount',
            required: true,
            min: 0,
            plugged: true
          },
          {
            id: 'status',
            type: 'select',
            label: 'Order Status',
            options: [
              { value: 'pending', label: 'Pending' },
              { value: 'processing', label: 'Processing' },
              { value: 'completed', label: 'Completed' },
              { value: 'cancelled', label: 'Cancelled' }
            ],
            default: 'pending',
            required: true,
            plugged: true
          },
          {
            id: 'notes',
            type: 'textarea',
            label: 'Notes',
            placeholder: 'Enter any additional notes',
            plugged: true
          }
        ];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultFields));
        raw = JSON.stringify(defaultFields);
      }
      const cfg = JSON.parse(raw);
      const plugged = cfg.filter(f => f.plugged);
      setFields(plugged);
      // initialize values for plugged fields
      const initial = {};
      plugged.forEach(f => initial[f.id] = f.default || "");
      setValues(initial);
    } catch (err) {
      console.error("Failed to load order fields", err);
      setFields([]);
    }
  }, []);

  function onChange(id, v) {
    setValues(prev => ({ ...prev, [id]: v }));
  }

  async function submit(e) {
    e.preventDefault();
    // basic validation
    for (const f of fields) {
      if (f.required && !values[f.id]) {
        alert(`Please fill required field: ${f.label}`);
        return;
      }
    }

    setLoading(true);
    try {
      const payload = { ...values };
      // send to server
      const url = baseUrl ? `${baseUrl.replace(/\/$/, '')}/api/orders` : '/api/orders';
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || 'Failed to submit order');
      setSubmitted({ at: new Date().toISOString(), data: data });
      // optionally reset values
      const reset = {};
      fields.forEach(f => reset[f.id] = f.default || "");
      setValues(reset);
    } catch (err) {
      console.error('Order submit error', err);
      alert(err.message || 'Submit failed');
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    const reset = {};
    fields.forEach(f => reset[f.id] = f.default || "");
    setValues(reset);
    setSubmitted(null);
  }

  return (
    <div className="order-page">
      <h2>Create Order</h2>
      {fields.length === 0 ? (
        <p>No fields are plugged in. Go to Settings to add or plug fields.</p>
      ) : (
        <form onSubmit={submit} className="order-form">
          {fields.map(f => (
            <FieldRenderer key={f.id} field={f} value={values[f.id] || ""} onChange={onChange} />
          ))}

          <div className="form-actions" style={{ marginTop: 12 }}>
            <button type="submit" disabled={loading}>{loading ? 'Submitting...' : 'Submit Order'}</button>
            <button type="button" onClick={resetForm} style={{ marginLeft: 8 }}>Reset</button>
          </div>
        </form>
      )}

      {submitted && (
        <div className="submitted" style={{ marginTop: 18 }}>
          <h3>Order Submitted</h3>
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{JSON.stringify(submitted, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
