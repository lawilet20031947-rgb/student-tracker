import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase";

export default function AttendanceForm() {
  const [studentId, setStudentId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [status, setStatus] = useState("present");
  const [msg, setMsg] = useState("");
  const [saving, setSaving] = useState(false);

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
    setSaving(true);
    try {
      await addDoc(collection(db, "attendance"), {
        studentId,
        date,
        status,
        present: status === "present",
        createdAt: serverTimestamp(),
        createdBy: auth.currentUser?.uid || null,
      });
      setMsg("Attendance saved");
    } catch (err) {
      setMsg(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="form-field">
        <label>Student UID</label>
        <input value={studentId} onChange={(e)=>setStudentId(e.target.value)} />
      </div>
      <div className="form-field">
        <label>Date</label>
        <input type="date" value={date} onChange={(e)=>setDate(e.target.value)} />
      </div>
      <div className="form-field">
        <label>Status</label>
        <select value={status} onChange={(e)=>setStatus(e.target.value)}>
          <option value="present">Present</option>
          <option value="absent">Absent</option>
        </select>
      </div>
      <button disabled={saving}>
        {saving ? 'Saving...' : 'Save attendance'}
      </button>
      {msg && <div className="muted">{msg}</div>}
    </form>
  );
}
