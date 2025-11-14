import React from "react";
import AttendanceForm from "../components/AttendanceForm";
import AttendanceList from "../components/AttendanceList";
import PerformanceForm from "../components/PerformanceForm";
import PerformanceList from "../components/PerformanceList";

export default function AdminDashboard() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <p className="mb-6 text-sm text-gray-600">Add attendance or performance for any student.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 border rounded">
          <AttendanceForm />
        </div>
        <div className="p-4 border rounded">
          <PerformanceForm />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 border rounded">
          <AttendanceList />
        </div>
        <div className="p-4 border rounded">
          <PerformanceList />
        </div>
      </div>
    </div>
  );
}
