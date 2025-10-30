import React from "react";

export default function StatsPanel({ stats }) {
  const {
    currentStep = 0,
    totalSteps = 0,
    currentFrom = "",
    currentTo = "",
    totalDeaths = 0,
    visited = 0,
    totalNodes = 0,
    goal = "",
    progress = 0,
  } = stats || {};

  return (
    <div
      style={{
        position: "absolute",
        top: 80,
        left: 20,
        width: 280,
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(8px)",
        borderRadius: 16,
        padding: "16px 20px",
        color: "#e0f2fe",
        zIndex: 30,
        boxShadow: "0 6px 24px rgba(0,0,0,0.3)",
        transition: "all 0.4s ease",
      }}
    >
      <div style={{ fontSize: 16, fontWeight: "600", marginBottom: 12 }}>
        🧭 Subaru’s Path Stats
      </div>

      <div style={statRowStyle}>
        <span style={labelStyle}>Step:</span>
        <span>{currentStep}/{totalSteps}</span>
      </div>

      <div style={statRowStyle}>
        <span style={labelStyle}>From:</span>
        <span>{currentFrom || "-"}</span>
      </div>

      <div style={statRowStyle}>
        <span style={labelStyle}>To:</span>
        <span>{currentTo || "-"}</span>
      </div>

      <div style={statRowStyle}>
        <span style={labelStyle}>Goal:</span>
        <span>{goal || "-"}</span>
      </div>

      <div style={statRowStyle}>
        <span style={labelStyle}>Total Deaths:</span>
        <span style={{ color: "#f87171", fontWeight: "600" }}>{totalDeaths}</span>
      </div>

      <div style={statRowStyle}>
        <span style={labelStyle}>Visited Nodes:</span>
        <span>{visited}/{totalNodes}</span>
      </div>

      <div style={{ marginTop: 14 }}>
        <div style={{ fontSize: 13, opacity: 0.8 }}>Progress</div>
        <div
          style={{
            height: 8,
            width: "100%",
            borderRadius: 6,
            marginTop: 4,
            background: "rgba(255,255,255,0.1)",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${Math.min(progress, 100)}%`,
              borderRadius: 6,
              background:
                "linear-gradient(90deg, #38bdf8, #22d3ee, #67e8f9)",
              boxShadow: "0 0 12px #22d3ee88",
              transition: "width 0.4s ease",
            }}
          />
        </div>
      </div>
    </div>
  );
}

const statRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: 6,
  fontSize: 14,
};

const labelStyle = {
  opacity: 0.7,
};
