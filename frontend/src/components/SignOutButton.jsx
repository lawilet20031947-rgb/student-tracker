// frontend/src/components/SignOutButton.jsx
import React from "react";
import { signOut } from "firebase/auth";
import { auth, isFirebaseInitialized } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function SignOutButton({ onLogout }) {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      if (isFirebaseInitialized && auth && typeof auth.signOut === "function") {
        await signOut(auth);
      } else {
        // Dev fallback: clear localStorage
        localStorage.removeItem("devUser");
      }
    } catch (err) {
      console.error("Sign-out failed", err);
    } finally {
      // Notify parent and navigate
      if (onLogout) onLogout();
      navigate("/login");
    }
  };

  return (
    <button
      onClick={handleSignOut}
      className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
      type="button"
    >
      Sign out
    </button>
  );
}
