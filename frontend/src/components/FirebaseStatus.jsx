// frontend/src/components/FirebaseStatus.jsx
import React, { useEffect, useState } from "react";
import { app } from "../firebase";

export default function FirebaseStatus() {
  const [status, setStatus] = useState("unknown");

  useEffect(() => {
    // `app` is null when firebase is not initialized in firebase.js
    setStatus(app ? "initialized" : "not-configured");
  }, []);

  const bg =
    status === "initialized" ? "bg-green-600" :
    status === "not-configured" ? "bg-yellow-700" :
    "bg-gray-600";

  return (
    <>
      <div className={`px-2 py-1 text-xs text-white rounded ${bg}`}>
        Firebase: {status === "initialized" ? "connected" : "not configured"}
      </div>
      {/*
        Ensure Tailwind keeps these utility classes when purging.
        The exact bg classes used above are referenced here so they aren't removed.
      */}
      <div className="hidden">
        <span className="bg-green-600 bg-yellow-700 bg-gray-600" />
      </div>
    </>
  );
}
