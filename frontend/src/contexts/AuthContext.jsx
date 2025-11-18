import React, { createContext, useEffect, useState, useContext } from "react";
import { onAuthStateChanged, getIdTokenResult } from "firebase/auth";
import { auth, db, isFirebaseInitialized } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

const AuthContext = createContext({ user: null, role: null, loading: true });

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseInitialized || !auth || typeof auth.onAuthStateChanged !== "function") {
      // Firebase not initialized, check localStorage for dev user
      const devUser = localStorage.getItem("devUser");
      setUser(devUser ? JSON.parse(devUser) : null);
      setRole(null);
      setLoading(false);
      return;
    }

    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u || null);
      setRole(null);
      if (!u) {
        setLoading(false);
        return;
      }
      try {
        const idTokenRes = await getIdTokenResult(u, false);
        const claims = idTokenRes.claims || {};
        if (claims.role) {
          setRole(claims.role);
        } else if (db) {
          // Fallback to Firestore if no custom claim
          const userDoc = await getDoc(doc(db, "users", u.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            if (data.role) setRole(data.role);
          }
        }
      } catch (err) {
        console.error("AuthContext token fetch error:", err);
      } finally {
        setLoading(false);
      }
    });
    return () => unsub();
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
