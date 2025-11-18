import React from "react";
import { auth } from "../firebase";
import AttendanceList from "../components/AttendanceList";
import PerformanceList from "../components/PerformanceList";

export default function StudentDashboard() {
  const studentId = auth.currentUser?.uid;
  return (
    <div className="dashboard-section">
      <div className="card">
        <h1 style={{ margin: 0 }}>Student Insights</h1>
        <p className="muted">Track your attendance trends and performance progress in one place.</p>
      </div>

      <div className="card">
        <h2>Your Attendance</h2>
        <AttendanceList studentId={studentId} />
      </div>

      <div className="card">
        <h2>Your Performance</h2>
        <PerformanceList studentId={studentId} />
      </div>
    </div>
  );
}