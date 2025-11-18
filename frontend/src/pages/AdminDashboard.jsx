import React from "react";
import AttendanceForm from "../components/AttendanceForm";
import AttendanceList from "../components/AttendanceList";
import PerformanceForm from "../components/PerformanceForm";
import PerformanceList from "../components/PerformanceList";
import UsersList from "../components/UsersList";

export default function AdminDashboard() {
  return (
    <div className="dashboard-section">
      <div className="card">
        <h1 style={{ margin: 0 }}>Admin Control Center</h1>
        <p className="muted">
          Manage roles, capture attendance, and monitor performance across the institution.
        </p>
      </div>

      <div className="card">
        <h2>User Management</h2>
        <UsersList />
      </div>

      <div className="grid-two">
        <div className="card">
          <h2>Add Attendance</h2>
          <AttendanceForm />
        </div>
        <div className="card">
          <h2>Add Performance</h2>
          <PerformanceForm />
        </div>
      </div>

      <div className="grid-two">
        <div className="card">
          <h2>Recent Attendance</h2>
          <AttendanceList />
        </div>
        <div className="card">
          <h2>Recent Performance</h2>
          <PerformanceList />
        </div>
      </div>
    </div>
  );
}
