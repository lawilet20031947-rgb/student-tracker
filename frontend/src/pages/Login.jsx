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
      // create user doc with role = student
      await setDoc(doc(db, "users", res.user.uid), { email, role: "student" });
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="p-8 bg-white rounded shadow w-full max-w-md">
        <h2 className="text-2xl mb-4">{isSignup ? "Sign up" : "Log in"}</h2>
        <form onSubmit={isSignup ? handleSignup : handleLogin} className="space-y-4">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full p-2 border rounded"
            required
            type="email"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            className="w-full p-2 border rounded"
            required
            minLength={6}
          />
          <button className="w-full p-2 bg-blue-600 text-white rounded">
            {isSignup ? "Create account" : "Log in"}
          </button>
        </form>
        {error && <p className="text-red-600 mt-3">{error}</p>}
        <p className="mt-4 text-sm flex items-center gap-2">
          <span>
            {isSignup ? "Already have account?" : "Don't have account?"}
          </span>
          <button
            onClick={() => {
              setIsSignup(!isSignup);
              setError("");
            }}
            className="ml-2 text-blue-600"
          >
            {isSignup ? "Log in" : "Sign up"}
          </button>

          <button type="button" onClick={handleForgotPassword}
            className="px-3 py-1 bg-gray-800 text-white rounded ml-3">
            Forgot password
          </button>
        </p>
      </div>
    </div>
  );
}
