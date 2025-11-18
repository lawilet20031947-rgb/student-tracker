import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase";

export default function PerformanceForm() {
  const [studentId, setStudentId] = useState("");
  const [subject, setSubject] = useState("");
  const [marks, setMarks] = useState("");
  const [msg, setMsg] = useState("");
  const [saving, setSaving] = useState(false);

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
    setSaving(true);
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
        <label>Subject</label>
        <input value={subject} onChange={(e)=>setSubject(e.target.value)} />
      </div>
      <div className="form-field">
        <label>Marks</label>
        <input type="number" value={marks} onChange={(e)=>setMarks(e.target.value)} />
      </div>
      <button disabled={saving}>{saving ? 'Saving...' : 'Save performance'}</button>
      {msg && <div className="muted">{msg}</div>}
    </form>
  );
}
