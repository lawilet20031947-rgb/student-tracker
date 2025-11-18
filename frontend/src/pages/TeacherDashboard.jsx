import React from "react";
import AttendanceForm from "../components/AttendanceForm";
import AttendanceList from "../components/AttendanceList";

export default function TeacherDashboard() {
  return (
    <div className="dashboard-section">
      <div className="card">
        <h1 style={{ margin: 0 }}>Teacher Workspace</h1>
        <p className="muted">Capture attendance and keep track of the latest classroom activity.</p>
      </div>

      <div className="card">
        <h2>Record Attendance</h2>
        <AttendanceForm />
      </div>

      <div className="card">
        <h2>Class Attendance Log</h2>
        <AttendanceList />
      </div>
    </div>
  );
}
