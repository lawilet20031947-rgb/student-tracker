import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, doc, updateDoc, onSnapshot, orderBy } from "firebase/firestore";

export default function UsersList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [changing, setChanging] = useState(null);

  useEffect(() => {
    if (!db) {
      setLoading(false);
      return;
    }

    // Listen to users collection in real-time
    const unsubscribe = onSnapshot(
      collection(db, "users"),
      (snapshot) => {
        const usersList = snapshot.docs.map((doc) => ({
          uid: doc.id,
          ...doc.data(),
        }));
        setUsers(usersList);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching users:", err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  async function changeRole(uid, newRole) {
    if (!db) {
      alert("Firebase not configured");
      return;
    }

    setChanging(uid);
    try {
      // Update role directly in Firestore
      const userRef = doc(db, "users", uid);
      await updateDoc(userRef, {
        role: newRole,
        updatedAt: new Date().toISOString(),
      });
      // The onSnapshot listener will automatically update the UI
    } catch (err) {
      console.error("setUserRole error", err);
      alert(err.message || "Failed to update role. Make sure you have admin permissions.");
    } finally {
      setChanging(null);
    }
  }

  if (loading) return <div>Loading users…</div>;
  if (!users.length) return <div>No users found.</div>;

  return (
    <div className="table-wrapper">
      <table className="users-table">
        <thead>
          <tr>
            <th>Name / Email</th>
            <th>User ID</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.uid}>
              <td>
                <div style={{ fontWeight: 600 }}>{u.displayName || "(no name)"}</div>
                <div className="muted" style={{ fontSize: "0.85rem" }}>{u.email || "No email"}</div>
              </td>
              <td className="muted" style={{ fontSize: "0.8rem" }}>{u.uid}</td>
              <td>
                <select
                  value={u.role || "student"}
                  onChange={(e) => changeRole(u.uid, e.target.value)}
                  disabled={changing === u.uid}
                >
                  <option value="student">student</option>
                  <option value="teacher">teacher</option>
                  <option value="admin">admin</option>
                </select>
                {changing === u.uid ? <div className="muted" style={{ marginTop: 4 }}>Saving…</div> : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
