import React from "react";
import AttendanceForm from "../components/AttendanceForm";
import AttendanceList from "../components/AttendanceList";

export default function TeacherDashboard() {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Teacher Dashboard</h1>
      <p className="mb-6 text-sm text-gray-600">Mark attendance and view class records.</p>

      <div className="p-4 border rounded mb-6">
        <AttendanceForm />
      </div>

      <div className="p-4 border rounded">
        <AttendanceList />
      </div>
    </div>
  );
}
