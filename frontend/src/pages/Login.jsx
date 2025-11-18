// src/pages/Login.jsx
import React, { useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth, db, isFirebaseInitialized } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (!isFirebaseInitialized) {
        // Fallback: create a local dev user and continue
        localStorage.setItem("devUser", JSON.stringify({ email }));
        navigate("/dashboard");
        return;
      }
      const res = await createUserWithEmailAndPassword(auth, email, password);
      // create user doc with role = student (if Firestore is available)
      if (db) {
        await setDoc(doc(db, "users", res.user.uid), {
          uid: res.user.uid,
          email,
          role: "student",
          createdAt: new Date().toISOString(),
        });
      }
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
      console.error("Signup error:", err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (!isFirebaseInitialized) {
        // Dev fallback: store dev user
        localStorage.setItem("devUser", JSON.stringify({ email }));
        navigate("/dashboard");
        return;
      }
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
      console.error("Login error:", err);
    }
  };

  // call this when user clicks "Forgot password"
  async function handleForgotPassword() {
    if (!email) { setError("Enter your email first."); return; }
    if (!isFirebaseInitialized) {
      setError("Password reset is not available in development mode.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setError("Password reset email sent — check your inbox.");
    } catch (e) {
      setError(friendlyMessage(e));
      console.error("Forgot password error", e);
    }
  }

  // simple friendly message mapper for common Firebase auth errors
  function friendlyMessage(e) {
    if (!e || !e.code) return e?.message || "An error occurred.";
    const map = {
      "auth/user-not-found": "No account found for that email.",
      "auth/invalid-email": "The email address is invalid.",
      "auth/too-many-requests": "Too many requests. Try again later.",
    };
    return map[e.code] || e.message || String(e);
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-hero">
          <p className="muted" style={{ textTransform: "uppercase", letterSpacing: "0.12em" }}>
            Welcome to
          </p>
          <h1 style={{ marginTop: 0 }}>Student Performance & Attendance Portal</h1>
          <p className="muted">
            Track academic performance, monitor attendance, and collaborate with your institution
            through a single, secure workspace.
          </p>
          <ul style={{ marginTop: "1rem", paddingLeft: "1.25rem", color: "#cbd5f5" }}>
            <li>Role-aware dashboards for admins, teachers, and students</li>
            <li>Real-time syncing with Firestore for always up-to-date info</li>
            <li>Secure authentication with Firebase Auth</li>
          </ul>
        </div>

        <div>
          <h2 style={{ marginTop: 0 }}>{isSignup ? "Create an account" : "Welcome back"}</h2>
          <form onSubmit={isSignup ? handleSignup : handleLogin} className="login-form">
            <div className="form-field">
              <label>Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                type="email"
              />
            </div>
            <div className="form-field">
              <label>Password</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                type="password"
                required
                minLength={6}
              />
            </div>
            <button type="submit">
              {isSignup ? "Create account" : "Log in"}
            </button>
          </form>
          {error && <p style={{ color: "#fca5a5", marginTop: "0.75rem" }}>{error}</p>}

          <div className="login-actions" style={{ marginTop: "1rem" }}>
            <div>
              <span className="muted">
                {isSignup ? "Already registered?" : "Need an account?"}
              </span>
              <button
                type="button"
                onClick={() => {
                  setIsSignup(!isSignup);
                  setError("");
                }}
                style={{ background: "none", color: "#60a5fa", padding: 0, marginLeft: "0.5rem" }}
              >
                {isSignup ? "Log in" : "Sign up"}
              </button>
            </div>

            <button
              type="button"
              onClick={handleForgotPassword}
              style={{
                background: "transparent",
                border: "1px solid rgba(148,163,184,0.5)",
                color: "#e2e8f0",
              }}
            >
              Forgot password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
