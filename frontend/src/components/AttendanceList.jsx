import React, { useEffect, useState } from "react";
import { collection, query, where, orderBy, onSnapshot, doc, getDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";

export default function AttendanceList({ studentId }) {
  const { user, role } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userMap, setUserMap] = useState({}); // uid -> user doc
  const [deleting, setDeleting] = useState(null); // id being deleted

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this attendance record?")) return;
    setDeleting(id);
    try {
      await deleteDoc(doc(db, "attendance", id));
    } catch (err) {
      alert("Delete failed: " + err.message);
    } finally {
      setDeleting(null);
    }
  };

  const canEdit = (record) => {
    // Admin can edit all, Teacher can edit their own
    return role === "admin" || (role === "teacher" && record.createdBy === user?.uid);
  };

  useEffect(() => {
    if (!db) {
      setItems([]);
      setLoading(false);
      return;
    }
    let q;
    const col = collection(db, "attendance");
    if (studentId) {
      q = query(col, where("studentId", "==", studentId), orderBy("createdAt", "desc"));
    } else {
      q = query(col, orderBy("createdAt", "desc"));
    }
    const unsub = onSnapshot(q, async (snap) => {
      const fetched = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setItems(fetched);
      // Prefetch user docs for all unique studentIds in attendance records
      const uids = [...new Set(fetched.map(it => it.studentId))];
      const map = {};
      await Promise.all(uids.map(async (uid) => {
        try {
          const userSnap = await getDoc(doc(db, "users", uid));
          map[uid] = userSnap.exists() ? userSnap.data() : null;
        } catch {
          map[uid] = null;
        }
      }));
      setUserMap(map);
      setLoading(false);
    }, (err) => {
      console.error('Attendance onSnapshot error', err);
      setLoading(false);
    });
    return () => unsub();
  }, [studentId]);

  if (loading) return <div className="text-sm text-gray-500">Loading attendance...</div>;
  if (!items.length) return <div className="text-sm text-gray-500">No attendance records.</div>;

  return (
    <div className="list-stack">
      {items.map(it => {
        const user = userMap[it.studentId];
        return (
          <div key={it.id} className="list-card">
            <div className="text-sm" style={{ fontWeight: 600 }}>
              {user ? (
                <>
                  {user.displayName || user.email}{" "}
                  <span className="muted">({it.studentId})</span>
                </>
              ) : (
                <>UID: {it.studentId}</>
              )}
            </div>
            <div className="muted">Date: {it.date}</div>
            <div className="muted">Status: {it.status}</div>
            {canEdit(it) && (
              <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.5rem" }}>
                <button
                  onClick={() => handleDelete(it.id)}
                  disabled={deleting === it.id}
                  className="btn-danger"
                  style={{ padding: "0.25rem 0.5rem", fontSize: "0.75rem" }}
                >
                  {deleting === it.id ? "Deleting..." : "Delete"}
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
