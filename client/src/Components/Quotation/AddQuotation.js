// client/src/Components/Quotation/AddQuotation.js
import React, { useState } from "react";
import "./quotation.css";

const AddQuotation = () => {
  const [formData, setFormData] = useState({
    customerName: "",
    email: "",
    phone: "",
    address: "",
    state: "",
  });

  const [items, setItems] = useState([
    { itemName: "", qty: 1, unit: "", price: 0, discount: 0, tax: 0, subtotal: 0 },
  ]);

  const handleCustomerChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle item row change
  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const updatedItems = [...items];
    updatedItems[index][name] = value;

    // Auto calculate subtotal
    const price = parseFloat(updatedItems[index].price) || 0;
    const qty = parseFloat(updatedItems[index].qty) || 0;
    const discount = parseFloat(updatedItems[index].discount) || 0;
    const tax = parseFloat(updatedItems[index].tax) || 0;

    const amount = price * qty;
    const discounted = amount - (amount * discount) / 100;
    const taxed = discounted + (discounted * tax) / 100;

    updatedItems[index].subtotal = taxed.toFixed(2);
    setItems(updatedItems);
  };

  // ✅ Add new row
  const addRow = () => {
    setItems([
      ...items,
      { itemName: "", qty: 1, unit: "", price: 0, discount: 0, tax: 0, subtotal: 0 },
    ]);
  };

  // ✅ Remove row
  const removeRow = (index) => {
    const updated = [...items];
    updated.splice(index, 1);
    setItems(updated);
  };

  // ✅ Calculate total
  const totalAmount = items.reduce((acc, item) => acc + parseFloat(item.subtotal || 0), 0);

  // ✅ Submit quotation
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const base = process.env.REACT_APP_API_URL || "http://localhost:5000";
      const payload = {
        ...formData,
        items,
        totalAmount,
      };

      const res = await fetch(`${base.replace(/\/$/, "")}/api/quotations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to add quotation");

      alert("Quotation added successfully!");
      setFormData({
        customerName: "",
        email: "",
        phone: "",
        address: "",
        state: "",
      });
      setItems([{ itemName: "", qty: 1, unit: "", price: 0, discount: 0, tax: 0, subtotal: 0 }]);
    } catch (err) {
      console.error(err);
      alert("Error adding quotation!");
    }
  };

  return (
    <div className="add-form">
      <h2>Add Quotation</h2>

      <form onSubmit={handleSubmit}>
        {/* ================= Customer Info ================= */}
        <div className="form-row">
          <div className="form-group">
            <label>Customer Name:</label>
            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleCustomerChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleCustomerChange}
            />
          </div>
          <div className="form-group">
            <label>Phone:</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleCustomerChange}
            />
          </div>
          <div className="form-group">
            <label>State:</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleCustomerChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Address:</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleCustomerChange}
          />
        </div>

        {/* ================= Items Table ================= */}
        <h3 style={{ marginTop: "25px" }}>Quotation Items</h3>
        <table className="quotation-table">
          <thead>
            <tr>
              <th>Sr. No</th>
              <th>Item Name</th>
              <th>Qty</th>
              <th>Unit</th>
              <th>Price</th>
              <th>Discount %</th>
              <th>Tax %</th>
              <th>Subtotal</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>
                  <input
                    type="text"
                    name="itemName"
                    value={item.itemName}
                    onChange={(e) => handleItemChange(index, e)}
                    required
                  />
                </td>
                <td>
                  <input
                    type="number"
                    name="qty"
                    min="1"
                    value={item.qty}
                    onChange={(e) => handleItemChange(index, e)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="unit"
                    value={item.unit}
                    onChange={(e) => handleItemChange(index, e)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    name="price"
                    value={item.price}
                    onChange={(e) => handleItemChange(index, e)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    name="discount"
                    value={item.discount}
                    onChange={(e) => handleItemChange(index, e)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    name="tax"
                    value={item.tax}
                    onChange={(e) => handleItemChange(index, e)}
                  />
                </td>
                <td>{item.subtotal}</td>
                <td>
                  <button
                    type="button"
                    onClick={() => removeRow(index)}
                    className="remove-btn"
                    disabled={items.length === 1}
                  >
                    ❌
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Add Row Button */}
        <button type="button" className="add-row-btn" onClick={addRow}>
          ➕ Add Item
        </button>

        {/* ================= Total ================= */}
        <div className="total-section">
          <h3>Total Amount: ₹{totalAmount.toFixed(2)}</h3>
        </div>

        <button type="submit" className="submit-button">
          Save Quotation
        </button>
      </form>
    </div>
  );
};

export default AddQuotation;
