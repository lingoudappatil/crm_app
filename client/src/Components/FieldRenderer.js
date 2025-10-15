import React from 'react';

// field: { id, label, type, required, options, placeholder, default }
export default function FieldRenderer({ field, value, onChange }) {
  const { id, label, type = 'text', required, options = [], placeholder } = field;

  const handle = (v) => onChange(id, v);

  switch (type) {
    case 'textarea':
      return (
        <div className="form-group">
          <label>{label}{required ? ' *' : ''}</label>
          <textarea
            value={value || ''}
            placeholder={placeholder || ''}
            onChange={(e) => handle(e.target.value)}
          />
        </div>
      );

    case 'select':
      return (
        <div className="form-group">
          <label>{label}{required ? ' *' : ''}</label>
          <select value={value || ''} onChange={(e) => handle(e.target.value)}>
            <option value="">-- Select --</option>
            {options.map(opt => (
              <option key={opt.value || opt} value={opt.value ?? opt}>{opt.label ?? opt}</option>
            ))}
          </select>
        </div>
      );

    case 'checkbox':
      return (
        <div className="form-group">
          <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input type="checkbox" checked={!!value} onChange={(e) => handle(e.target.checked)} />
            {label}{required ? ' *' : ''}
          </label>
        </div>
      );

    case 'date':
      return (
        <div className="form-group">
          <label>{label}{required ? ' *' : ''}</label>
          <input type="date" value={value || ''} onChange={(e) => handle(e.target.value)} />
        </div>
      );

    case 'number':
      return (
        <div className="form-group">
          <label>{label}{required ? ' *' : ''}</label>
          <input type="number" value={value || ''} placeholder={placeholder || ''} onChange={(e) => handle(e.target.value)} />
        </div>
      );

    default:
      return (
        <div className="form-group">
          <label>{label}{required ? ' *' : ''}</label>
          <input type="text" value={value || ''} placeholder={placeholder || ''} onChange={(e) => handle(e.target.value)} />
        </div>
      );
  }
}
