import React, { useEffect, useState } from "react";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

export default function PerformanceList({ studentId }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!db) {
      setItems([]);
      return;
    }
    const col = collection(db, "performance");
    const q = studentId
      ? query(col, where("studentId", "==", studentId), orderBy("createdAt", "desc"))
      : query(col, orderBy("createdAt", "desc"));

    const unsub = onSnapshot(q, snap => {
      setItems(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [studentId]);

  if (!items.length) return <div className="text-sm text-gray-500">No performance records.</div>;

  return (
    <ul className="space-y-2">
      {items.map(it => (
        <li key={it.id} className="p-2 border rounded">
          <div className="text-sm">Student: {it.studentId}</div>
          <div className="text-sm">Subject: {it.subject}</div>
          <div className="text-sm">Marks: {it.marks}</div>
          <div className="text-sm">Date: {it.date}</div>
        </li>
      ))}
    </ul>
  );
}
