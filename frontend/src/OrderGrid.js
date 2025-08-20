import React, { useState, useEffect } from "react";
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { AgGridReact } from "ag-grid-react";
import axios from "axios";
import OrderModal from "./OrderModal"; // Modal component for Add/Edit
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "./OrderGrid.css";

// Register AG Grid community modules (required since v34+)
ModuleRegistry.registerModules([AllCommunityModule]);

const apiUrl = "http://localhost:5000/api/orders";

const statusColors = {
  Pending: "badge badge-warning",
  Shipped: "badge badge-info",
  Delivered: "badge badge-success",
};

const StatusCellRenderer = (params) => (
  <span className={statusColors[params.value] || "badge"}>{params.value}</span>
);

export default function OrderGrid() {
  const [orders, setOrders] = useState([]);
  const [gridApi, setGridApi] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editOrder, setEditOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  // Fetch all orders from backend API
  const fetchOrders = async () => {
    try {
      const res = await axios.get(apiUrl);
      setOrders(res.data);
    } catch (error) {
      alert("Failed to fetch orders: " + error.message);
    }
  };

  // AG Grid Column definitions
  const columnDefs = [
    { headerName: "Order ID", field: "id", sortable: true, filter: true },
    { headerName: "Customer Name", field: "customer_name", sortable: true, filter: true },
    { headerName: "Order Date", field: "order_date", sortable: true },
    {
      headerName: "Total Amount",
      field: "total_amount",
      editable: true,
      sortable: true,
      cellEditor: "agNumberCellEditor",
    },
    {
      headerName: "Status",
      field: "status",
      cellRenderer: StatusCellRenderer,
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: ["Pending", "Shipped", "Delivered"],
      },
    },
  ];

  // Handle inline edits on Status and Total Amount
  const onCellValueChanged = async ({ data, colDef }) => {
    if (colDef.field === "status" || colDef.field === "total_amount") {
      if (
        colDef.field === "total_amount" &&
        (typeof data.total_amount !== "number" || data.total_amount < 0)
      ) {
        alert("Amount must be a non-negative number.");
        return fetchOrders();
      }
      try {
        await axios.put(`${apiUrl}/${data.id}`, {
          total_amount: data.total_amount,
          status: data.status,
        });
        fetchOrders();
      } catch (err) {
        alert("Server validation failed: " + err.message);
        fetchOrders();
      }
    }
  };

  // Bulk delete selected orders
  const onBulkDelete = async () => {
    if (!gridApi) {
      alert("Grid is not ready yet. Please wait.");
      return;
    }
    const selectedNodes = gridApi.getSelectedNodes();
    const ids = selectedNodes.map((node) => node.data.id);
    if (ids.length === 0) {
      alert("Please select at least one row to delete.");
      return;
    }
    if (!window.confirm(`Delete ${ids.length} order(s)? This cannot be undone.`)) {
      return;
    }
    try {
      await axios.delete(apiUrl, { data: { ids } });
      fetchOrders();
    } catch (error) {
      alert("Failed to delete orders: " + error.message);
    }
  };

  // Export grid data to CSV
  const onExportCSV = () => {
    if (!gridApi) {
      alert("Grid is not ready yet. Please wait.");
      return;
    }
    gridApi.exportDataAsCsv();
  };

  // Open Add Order modal
  const openAddModal = () => {
    setEditOrder(null);
    setIsModalOpen(true);
  };

  // Open Edit Order modal for selected row
  const openEditModal = () => {
    if (!gridApi) {
      alert("Grid is not ready yet. Please wait.");
      return;
    }
    const selectedNodes = gridApi.getSelectedNodes();
    if (selectedNodes.length !== 1) {
      alert("Please select exactly one row to edit.");
      return;
    }
    setEditOrder(selectedNodes[0].data);
    setIsModalOpen(true);
  };

  // Save new or updated order (Add/Edit)
  const handleSave = async (orderData) => {
    try {
      if (editOrder) {
        await axios.put(`${apiUrl}/${editOrder.id}`, {
          total_amount: orderData.total_amount,
          status: orderData.status,
          customer_name: orderData.customer_name,
          order_date: orderData.order_date,
        });
      } else {
        await axios.post(apiUrl, orderData);
      }
      setIsModalOpen(false);
      fetchOrders();
    } catch (error) {
      alert("Error saving order: " + error.message);
    }
  };

  return (
    <div>
      <h1 style={{ textAlign: "center", margin: "30px 0" }}>Order Tracker</h1>
      <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: 20 }}>
        <button onClick={openAddModal}>Add Order</button>
        <button onClick={openEditModal}>Edit Selected</button>
        <button onClick={onBulkDelete}>Delete Selected</button>
        <button onClick={onExportCSV}>Export CSV</button>
      </div>
      <div
        className="ag-theme-alpine"
        style={{ height: 500, width: 900, margin: "0 auto", borderRadius: 12, boxShadow: "0 2px 16px rgba(0,0,0,0.08)" }}
      >
        <AgGridReact
          rowData={orders}
          columnDefs={columnDefs}
          pagination={true}
          paginationPageSize={10}
          rowSelection="multiple"
          suppressCellSelection={false}
          rowClassRules={{
            "ag-row-odd": (params) => params.node.rowIndex % 2 === 1,
            "ag-row-even": (params) => params.node.rowIndex % 2 === 0,
          }}
          onGridReady={(params) => setGridApi(params.api)}
          onCellValueChanged={onCellValueChanged}
        />
      </div>
      <OrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={editOrder}
      />
    </div>
  );
}

