// src/App.jsx
import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { auth, isFirebaseInitialized } from "./firebase";
import SignOutButton from "./components/SignOutButton";
import FirebaseStatus from "./components/FirebaseStatus";

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Set up listener for Firebase auth changes (if Firebase is initialized)
    if (isFirebaseInitialized && auth && typeof auth.onAuthStateChanged === "function") {
      const unsub = auth.onAuthStateChanged((authUser) => {
        setUser(authUser);
      });
      return () => unsub();
    } else {
      // Check localStorage for dev/mock user
      const devUser = localStorage.getItem("devUser");
      setUser(devUser ? JSON.parse(devUser) : null);
    }
  }, []);

  return (
    <BrowserRouter>
      <header className="p-4 border-b">
        <div className="max-w-4xl mx-auto flex gap-4 items-center">
          {/* show Login only when not signed in */}
          {!user && <Link to="/login" className="text-blue-600">Login</Link>}

          <Link to="/dashboard" className="text-blue-600">Dashboard</Link>

          <div className="ml-auto flex items-center gap-3">
            <FirebaseStatus />
            {user ? (
              <>
                <span className="text-sm text-gray-300 break-words max-w-xs">{user.email}</span>
                <SignOutButton onLogout={() => setUser(null)} />
              </>
            ) : null}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6">
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

    </BrowserRouter>
  );
}
