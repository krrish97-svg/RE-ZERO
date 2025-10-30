import React, { useState } from "react";

export default function InputModal({ onRun, open, onClose }) {
  const [input, setInput] = useState(`
5 6
Mansion TrustRam 1
TrustRam Village 2
Village MeetWitch 0
Mansion Village 5
TrustRam MeetWitch 3
Village Final 1
Mansion Final
  `);

  if (!open) return null;

  const handleRun = () => {
    if (onRun) onRun(input.trim());
    if (onClose) onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 999,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#f8fafc",
          borderRadius: "12px",
          padding: "25px",
          width: "90%",
          maxWidth: "700px",
          boxShadow: "0 6px 18px rgba(0,0,0,0.25)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <h2 style={{ margin: 0, color: "#1e293b" }}>🧩 Graph Input</h2>
        <p
          style={{
            fontSize: "0.9rem",
            color: "#475569",
            textAlign: "center",
          }}
        >
          Paste your graph data below:
        </p>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={10}
          style={{
            width: "100%",
            borderRadius: "8px",
            border: "1px solid #cbd5e1",
            padding: "10px",
            fontFamily: "monospace",
            fontSize: "0.9rem",
            color: "#1e293b",
            outline: "none",
          }}
        />

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={handleRun}
            style={{
              background: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: "10px 20px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            ▶ Run Algorithm
          </button>
          <button
            onClick={onClose}
            style={{
              background: "#ef4444",
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: "10px 20px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            ✖ Close
          </button>
        </div>
      </div>
    </div>
  );
}
