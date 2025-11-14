import React from "react";
import { Link, Routes, Route } from "react-router-dom";
import AdminDashboard from "./AdminDashboard";
import TeacherDashboard from "./TeacherDashboard";
import StudentDashboard from "./StudentDashboard";

export default function Dashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <nav className="mb-6 space-x-4">
        <Link to="admin" className="text-blue-600">Admin</Link>
        <Link to="teacher" className="text-blue-600">Teacher</Link>
        <Link to="student" className="text-blue-600">Student</Link>
      </nav>

      <Routes>
        <Route path="admin" element={<AdminDashboard />} />
        <Route path="teacher" element={<TeacherDashboard />} />
        <Route path="student" element={<StudentDashboard />} />
        <Route path="/" element={<AdminDashboard />} />
      </Routes>
    </div>
  );
}
