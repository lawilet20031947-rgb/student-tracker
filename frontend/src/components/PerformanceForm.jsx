import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase";

export default function PerformanceForm() {
  const [studentId, setStudentId] = useState("");
  const [subject, setSubject] = useState("");
  const [marks, setMarks] = useState("");
  const [msg, setMsg] = useState("");

  React.useEffect(() => {
    if (!studentId && auth.currentUser) setStudentId(auth.currentUser.uid);
  }, [studentId]);

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    if (!db) {
      setMsg("Firebase not configured. Cannot save performance.");
      return;
    }
    try {
      await addDoc(collection(db, "performance"), {
        studentId,
        subject,
        marks: Number(marks),
        date: new Date().toISOString().slice(0,10),
        createdAt: serverTimestamp(),
        createdBy: auth.currentUser?.uid || null,
      });
      setMsg("Performance saved");
    } catch (err) {
      setMsg(err.message);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <label className="block text-sm">Student UID</label>
      <input value={studentId} onChange={(e)=>setStudentId(e.target.value)} className="w-full p-2 border rounded"/>
      <label className="block text-sm">Subject</label>
      <input value={subject} onChange={(e)=>setSubject(e.target.value)} className="w-full p-2 border rounded"/>
      <label className="block text-sm">Marks</label>
      <input type="number" value={marks} onChange={(e)=>setMarks(e.target.value)} className="w-full p-2 border rounded"/>
      <button className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
      {msg && <div className="text-sm mt-2">{msg}</div>}
    </form>
  );
}
