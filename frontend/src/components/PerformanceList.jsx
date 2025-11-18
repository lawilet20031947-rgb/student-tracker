import React, { useEffect, useState } from "react";
import { collection, query, where, orderBy, onSnapshot, doc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";

export default function PerformanceList({ studentId }) {
  const { user, role } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userMap, setUserMap] = useState({}); // uid -> user info
  const [deleting, setDeleting] = useState(null); // id being deleted

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this performance record?")) return;
    setDeleting(id);
    try {
      await deleteDoc(doc(db, "performance", id));
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
    const col = collection(db, "performance");
    const q = studentId
      ? query(col, where("studentId", "==", studentId), orderBy("createdAt", "desc"))
      : query(col, orderBy("createdAt", "desc"));

    const unsub = onSnapshot(q, async (snap) => {
      const fetched = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setItems(fetched);
      // Prefetch user docs for all unique studentIds
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
      console.error('Performance onSnapshot error', err);
      setLoading(false);
    });
    return () => unsub();
  }, [studentId]);

  if (loading) return <div className="text-sm text-gray-500">Loading performance...</div>;
  if (!items.length) return <div className="text-sm text-gray-500">No performance records.</div>;

  return (
    <div className="list-stack">
      {items.map(it => {
        const user = userMap[it.studentId];
        const isDeleting = deleting === it.id;
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
            <div className="muted">Subject: {it.subject}</div>
            <div className="muted">Marks: {it.marks}</div>
            <div className="muted">Date: {it.date}</div>
            {canEdit(it) && (
              <button
                onClick={() => handleDelete(it.id)}
                disabled={isDeleting}
                style={{
                  marginTop: "8px",
                  padding: "4px 12px",
                  fontSize: "12px",
                  backgroundColor: isDeleting ? "#999" : "#dc2626",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: isDeleting ? "not-allowed" : "pointer",
                }}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
