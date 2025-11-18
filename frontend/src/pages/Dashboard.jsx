import React from "react";
import { NavLink, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import AdminDashboard from "./AdminDashboard";
import TeacherDashboard from "./TeacherDashboard";
import StudentDashboard from "./StudentDashboard";

export default function Dashboard() {
  const { role, loading } = useAuth();

  if (loading) return <div className="text-sm text-gray-500">Loading...</div>;

  // Role-based access restrictions
  const canAccessAdmin = role === "admin";
  const canAccessTeacher = role === "admin" || role === "teacher";
  const canAccessStudent = role !== undefined; // All authenticated users can view student dashboard

  return (
    <div>
      <div style={{ marginBottom: "1rem" }}>
        <p className="muted">Choose a workspace</p>
        <div className="dashboard-nav">
          {canAccessAdmin && (
            <NavLink to="admin" className={({ isActive }) => (isActive ? "active" : "")}>
              Admin
            </NavLink>
          )}
          {canAccessTeacher && (
            <NavLink to="teacher" className={({ isActive }) => (isActive ? "active" : "")}>
              Teacher
            </NavLink>
          )}
          {canAccessStudent && (
            <NavLink to="student" className={({ isActive }) => (isActive ? "active" : "")}>
              Student
            </NavLink>
          )}
        </div>
      </div>

      <Routes>
        {canAccessAdmin && <Route path="admin" element={<AdminDashboard />} />}
        {canAccessTeacher && <Route path="teacher" element={<TeacherDashboard />} />}
        {canAccessStudent && <Route path="student" element={<StudentDashboard />} />}
        
        {/* Redirect to first allowed dashboard */}
        <Route path="/" element={
          canAccessAdmin ? <AdminDashboard /> : canAccessTeacher ? <TeacherDashboard /> : <StudentDashboard />
        } />
        
        {/* Catch-all for disallowed routes */}
        <Route path="*" element={
          <Navigate to={canAccessAdmin ? "admin" : canAccessTeacher ? "teacher" : "student"} replace />
        } />
      </Routes>
    </div>
  );
}
