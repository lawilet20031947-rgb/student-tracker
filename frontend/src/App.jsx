// src/App.jsx
import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { auth, isFirebaseInitialized } from "./firebase";
import SignOutButton from "./components/SignOutButton";
import FirebaseStatus from "./components/FirebaseStatus";
import "./App.css";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("App: Setting up auth listener, Firebase initialized:", isFirebaseInitialized);
    // Set up listener for Firebase auth changes (if Firebase is initialized)
    if (isFirebaseInitialized && auth && typeof auth.onAuthStateChanged === "function") {
      const unsub = auth.onAuthStateChanged((authUser) => {
        console.log("App: Auth state changed, user:", authUser?.email || "none");
        setUser(authUser);
        setLoading(false);
      });
      return () => unsub();
    } else {
      // Check localStorage for dev/mock user
      const devUser = localStorage.getItem("devUser");
      const parsedUser = devUser ? JSON.parse(devUser) : null;
      console.log("App: Using dev user:", parsedUser?.email || "none");
      setUser(parsedUser);
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl mb-2">Loading...</div>
          <div className="text-sm text-gray-500">Initializing application</div>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="app-shell">
        <header className="app-header">
          <div className="header-inner">
            <div className="brand">Student Performance & Attendance</div>
            <nav className="nav-links">
              <Link to="/dashboard" className="nav-link">
                Dashboard
              </Link>
              {!user && (
                <Link to="/login" className="nav-link">
                  Login
                </Link>
              )}
            </nav>
            <div style={{ marginLeft: "auto", display: "flex", gap: "0.75rem", alignItems: "center" }}>
              <FirebaseStatus />
              {user ? (
                <>
                  <span className="muted">{user.email || user.uid}</span>
                  <SignOutButton onLogout={() => setUser(null)} />
                </>
              ) : null}
            </div>
          </div>
        </header>

        <main className="dashboard-layout">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard/*"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
