import React, { useState, useEffect } from "react";

const validStatuses = ["Pending", "Shipped", "Delivered"];

export default function OrderModal({ isOpen, onClose, onSave, initialData }) {
  const [customerName, setCustomerName] = useState("");
  const [orderDate, setOrderDate] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [status, setStatus] = useState("Pending");
  const [errors, setErrors] = useState({});

  // Populate form when editing
  useEffect(() => {
    if (initialData) {
      setCustomerName(initialData.customer_name || "");
      setOrderDate(initialData.order_date || "");
      setTotalAmount(initialData.total_amount || "");
      setStatus(initialData.status || "Pending");
    } else {
      setCustomerName("");
      setOrderDate("");
      setTotalAmount("");
      setStatus("Pending");
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  // Validation function
  const validate = () => {
    const errs = {};
    if (!customerName.trim()) errs.customerName = "Customer Name is required";
    if (!orderDate) errs.orderDate = "Order Date is required";
    if (totalAmount === "" || isNaN(totalAmount) || Number(totalAmount) < 0)
      errs.totalAmount = "Total Amount must be a non-negative number";
    if (!validStatuses.includes(status)) errs.status = "Status is invalid";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Form submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSave({
        customer_name: customerName.trim(),
        order_date: orderDate,
        total_amount: Number(totalAmount),
        status,
      });
    }
  };

  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <h2>{initialData ? "Edit Order" : "Add Order"}</h2>
        <form onSubmit={handleSubmit} noValidate>
          <div style={formGroupStyle}>
            <label>Customer Name</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
            {errors.customerName && (
              <div style={errorStyle}>{errors.customerName}</div>
            )}
          </div>

          <div style={formGroupStyle}>
            <label>Order Date</label>
            <input
              type="date"
              value={orderDate}
              onChange={(e) => setOrderDate(e.target.value)}
            />
            {errors.orderDate && (
              <div style={errorStyle}>{errors.orderDate}</div>
            )}
          </div>

          <div style={formGroupStyle}>
            <label>Total Amount</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
            />
            {errors.totalAmount && (
              <div style={errorStyle}>{errors.totalAmount}</div>
            )}
          </div>

          <div style={formGroupStyle}>
            <label>Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              {validStatuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            {errors.status && <div style={errorStyle}>{errors.status}</div>}
          </div>

          <div style={{ marginTop: 20, textAlign: "right" }}>
            <button
              type="button"
              onClick={onClose}
              style={{ marginRight: 10 }}
            >
              Cancel
            </button>
            <button type="submit">{initialData ? "Update" : "Add"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

const modalOverlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  height: "100vh",
  width: "100vw",
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modalContentStyle = {
  backgroundColor: "#fff",
  padding: 20,
  borderRadius: 8,
  width: 400,
  boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
};

const formGroupStyle = { marginBottom: 12, display: "flex", flexDirection: "column" };

const errorStyle = { color: "red", fontSize: 12, marginTop: 4 };
