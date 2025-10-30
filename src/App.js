import React, { useState } from "react";
import InputModal from "./components/InputModal.js";
import GraphScene from "./components/GraphScene.js";
import StatsPanel from "./components/StatsPanel.js";
import { parseInput } from "./lib/parser.js";
import { dijkstra } from "./lib/dijkstra.js";

function App() {
  const [graphData, setGraphData] = useState({ nodes: [], edges: [], path: [] });
  const [showModal, setShowModal] = useState(true);
  const [stats, setStats] = useState({});
  const [lastInput, setLastInput] = useState("");

  const handleRun = (inputText) => {
    setLastInput(inputText);
    const graph = parseInput(inputText);
    if (!graph.start || !graph.goal) {
      alert("Make sure the final line contains: start_state goal_state");
      setShowModal(true);
      return;
    }
    const dj = dijkstra(graph.edges, graph.start, graph.goal) || {};
    const path = dj.getPath ? dj.getPath(graph.goal) || [] : [];

    setGraphData({
      nodes: graph.nodes || [],
      edges: graph.edges || [],
      path,
    });

    setStats({
      goal: graph.goal || "-",
      totalNodes: graph.nodes?.length || 0,
      totalDeaths: (dj.dist && dj.dist[graph.goal]) ?? 0,
    });

  };

  return (
    <div style={{ height: "100vh", width: "100vw", overflow: "hidden" }}>
      {/* Header */}
      <div
        style={{
          position: "absolute",
          top: 12,
          left: 12,
          zIndex: 200,
          display: "flex",
          gap: 8,
        }}
      >
        <div
          style={{
            color: "#e6f6ff",
            fontWeight: 700,
            fontSize: 18,
            textShadow: "0 2px 6px rgba(0,0,0,0.6)",
          }}
        >
          Re:Zero — Subaru’s Checkpoint Path Finder
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{
            marginLeft: 12,
            background: "#38bdf8",
            border: "none",
            borderRadius: 8,
            padding: "8px 12px",
            cursor: "pointer",
          }}
        >
          Edit Graph
        </button>
      </div>

      {/* Graph + Stats Panel */}
      <GraphScene
        nodes={graphData.nodes}
        edges={graphData.edges}
        path={graphData.path}
        onUpdateStats={(newStats) =>
          setStats((prev) => ({ ...prev, ...newStats }))
        }
      />

      <StatsPanel stats={stats} />

      {/* Modal Input */}
      <InputModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onRun={(input) => {
          handleRun(input);
          setShowModal(false);
        }}
      />
    </div>
  );
}

export default App;
