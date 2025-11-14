import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase";

export default function AttendanceForm() {
  const [studentId, setStudentId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [status, setStatus] = useState("present");
  const [msg, setMsg] = useState("");

  React.useEffect(() => {
    if (!studentId && auth.currentUser) setStudentId(auth.currentUser.uid);
  }, [studentId]);

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    if (!db) {
      setMsg("Firebase not configured. Cannot save attendance.");
      return;
    }
    try {
      await addDoc(collection(db, "attendance"), {
        studentId,
        date,
        status,
        createdAt: serverTimestamp(),
        createdBy: auth.currentUser?.uid || null,
      });
      setMsg("Attendance saved");
    } catch (err) {
      setMsg(err.message);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <label className="block text-sm">Student UID</label>
      <input value={studentId} onChange={(e)=>setStudentId(e.target.value)} className="w-full p-2 border rounded"/>
      <label className="block text-sm">Date</label>
      <input type="date" value={date} onChange={(e)=>setDate(e.target.value)} className="w-full p-2 border rounded"/>
      <label className="block text-sm">Status</label>
      <select value={status} onChange={(e)=>setStatus(e.target.value)} className="w-full p-2 border rounded">
        <option value="present">Present</option>
        <option value="absent">Absent</option>
      </select>
      <button className="px-4 py-2 bg-green-600 text-white rounded">Save</button>
      {msg && <div className="text-sm mt-2">{msg}</div>}
    </form>
  );
}
