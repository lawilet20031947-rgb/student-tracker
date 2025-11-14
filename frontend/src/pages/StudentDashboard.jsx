import React from "react";
import { auth } from "../firebase";
import AttendanceList from "../components/AttendanceList";
import PerformanceList from "../components/PerformanceList";

export default function StudentDashboard() {
  const studentId = auth.currentUser?.uid;
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Student Dashboard</h1>
      <p className="mb-6 text-sm text-gray-600">View your attendance and performance.</p>

      <div className="p-4 border rounded mb-6">
        <AttendanceList studentId={studentId} />
      </div>

      <div className="p-4 border rounded">
        <PerformanceList studentId={studentId} />
      </div>
    </div>
  );
}

