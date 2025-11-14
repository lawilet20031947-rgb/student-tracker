import React, { useEffect, useState } from "react";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

export default function AttendanceList({ studentId }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!db) {
      // Firestore not configured
      setItems([]);
      return;
    }
    let q;
    const col = collection(db, "attendance");
    if (studentId) {
      q = query(col, where("studentId", "==", studentId), orderBy("createdAt", "desc"));
    } else {
      q = query(col, orderBy("createdAt", "desc"));
    }
    const unsub = onSnapshot(q, snap => {
      setItems(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [studentId]);

  if (!items.length) return <div className="text-sm text-gray-500">No attendance records.</div>;

  return (
    <ul className="space-y-2">
      {items.map(it => (
        <li key={it.id} className="p-2 border rounded">
          <div className="text-sm">Student: {it.studentId}</div>
          <div className="text-sm">Date: {it.date}</div>
          <div className="text-sm">Status: {it.status}</div>
        </li>
      ))}
    </ul>
  );
}
