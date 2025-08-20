# Order Tracker App

This is a full-stack Order Tracker application built with React on the frontend and a backend API (Node.js/Express with PostgreSQL) for order management. It uses AG Grid React for displaying, editing, and managing orders in a feature-rich data grid.

## Features

- Display orders in a paginated, sortable, and filterable AG Grid table.
- Inline editing of **Status** and **Total Amount** fields.
- Color-coded status badges (Pending, Shipped, Delivered).
- Add, Edit, Delete orders using modal dialogs.
- Bulk deletion with multi-row selection.
- Export orders data as CSV file.
- Frontend and backend validation for data integrity.

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher recommended)
- npm or yarn package manager
- PostgreSQL database with `orders` table accessible by the backend API

### Backend Setup

- Ensure your backend API is running at `http://localhost:5000/api/orders` or update the `apiUrl` constant in `OrderGrid.js`.
- Backend should expose REST endpoints: GET `/api/orders`, POST `/api/orders`, PUT `/api/orders/:id`, DELETE `/api/orders`

## Important Notes

- This project uses **AG Grid React v34+** which requires explicit module registration in your React code.
- Ensure CSS for AG Grid is imported as shown in `OrderGrid.js`.
- If port or API endpoint differs, update `apiUrl` variable accordingly.
- Modal component for Add/Edit order is included and handles frontend validation.

## React Libraries Used

- `react` — UI framework
- `react-dom`
- `ag-grid-react` — AG Grid React wrapper component
- `ag-grid-community` — core AG Grid modules and styles
- `axios` — HTTP client for API calls

## Folder Structure (Frontend)

- `src/OrderGrid.js` — Main component with AG Grid and order management logic
- `src/OrderModal.js` — Modal component for adding/editing orders
- `src/OrderGrid.css` — Custom styles including badge colors and grid UI tweaks



