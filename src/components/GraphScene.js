import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export default function GraphScene({ nodes = [], edges = [], path = [], onUpdateStats = () => {} }) {
  const mountRef = useRef(null);
  const [message, setMessage] = useState("");
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0b1220);
    scene.fog = new THREE.Fog(0x0b1220, 20, 100);

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 500);
    camera.position.set(15, 10, 20);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0xffffff, 0.35);
    const dir = new THREE.DirectionalLight(0xffffff, 0.8);
    dir.position.set(10, 15, 5);
    scene.add(ambient, dir);

    const hemi = new THREE.HemisphereLight(0x4466ff, 0x080820, 0.25);
    scene.add(hemi);

    // --- 🌌 Layout nodes in a Fibonacci sphere for even spacing ---
    const nodeMap = {};
    const radius = Math.max(10, nodes.length * 1.3);
    const phi = Math.PI * (3 - Math.sqrt(5)); // golden angle

    nodes.forEach((name, i) => {
      const y = nodes.length > 1 ? 1 - (i / (nodes.length - 1)) * 2 : 0;
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = phi * i;
      const x = Math.cos(theta) * r * radius;
      const z = Math.sin(theta) * r * radius;

      const pos = new THREE.Vector3(x, y * radius * 0.7, z);

      const geom = new THREE.SphereGeometry(0.5, 24, 24);
      const mat = new THREE.MeshStandardMaterial({
        color: 0x94a3b8,
        roughness: 0.5,
        emissive: 0x000000,
      });
      const mesh = new THREE.Mesh(geom, mat);
      mesh.position.copy(pos);
      scene.add(mesh);

      const label = makeLabelSprite(name);
      label.position.set(x, y * radius * 0.7 + 0.9, z);
      scene.add(label);

      nodeMap[name] = { pos, mesh, label };
    });

    // --- 🌉 Edges ---
    const edgeObjects = [];
    edges.forEach(({ from, to, cost }) => {
      const A = nodeMap[from];
      const B = nodeMap[to];
      if (!A || !B) return;
      const pts = [A.pos, B.pos];
      const geom = new THREE.BufferGeometry().setFromPoints(pts);
      const mat = new THREE.LineBasicMaterial({
        color: 0x475569,
        transparent: true,
        opacity: 0.6,
      });
      const line = new THREE.Line(geom, mat);
      scene.add(line);

      const mid = new THREE.Vector3().lerpVectors(A.pos, B.pos, 0.5);
      const costSprite = makeLabelSprite(String(cost), {
        fontsize: 16,
        color: "#e2e8f0",
      });
      costSprite.position.copy(mid);
      costSprite.position.y += 0.25;
      scene.add(costSprite);

      edgeObjects.push({ from, to, cost, line, mat, visited: false });
    });

    // --- 🌀 Subaru orb ---
    const orbGeom = new THREE.SphereGeometry(0.3, 32, 32);
    const orbMat = new THREE.MeshStandardMaterial({
      color: 0x22d3ee,
      emissive: 0x22d3ee,
      emissiveIntensity: 2.0,
    });
    const orb = new THREE.Mesh(orbGeom, orbMat);
    orb.visible = false;
    scene.add(orb);

    // Trail setup
    const trail = [];
    const makeTrail = (pos) => {
      const dot = makeTrailDot();
      dot.position.copy(pos);
      scene.add(dot);
      trail.push({ sprite: dot, life: 1 });
    };

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    controls.autoRotate = false;

    let step = 0;
    let t = 0;
    let isPlaying = false;
    let camTarget = new THREE.Vector3();

    const totalSteps = Math.max(0, path.length - 1);

    // initialize stats for StatsPanel
    try {
      onUpdateStats({
        totalNodes: nodes.length,
        totalSteps,
        goal: path.length ? path[path.length - 1] : "-",
        currentStep: 0,
        currentFrom: path[0] || "-",
        currentTo: path[1] || "-",
        visited: edgeObjects.filter((e) => e.visited).length,
        progress: totalSteps === 0 ? 100 : 0,
      });
    } catch (e) {
      // swallow — onUpdateStats might throw if parent unmounted; avoid crashing
      console.warn("onUpdateStats error", e);
    }

    // --- 🎬 Animation Control ---
    const startTraversal = () => {
      if (!path || path.length < 2) return;
      orb.visible = true;
      orb.position.copy(nodeMap[path[0]].pos);
      step = 0;
      t = 0;
      isPlaying = true;
      setPlaying(true);
      setMessage(`Starting at ${path[0]}`);

      try {
        onUpdateStats({
          currentStep: 0,
          totalSteps,
          currentFrom: path[0],
          currentTo: path[1] || "-",
          visited: edgeObjects.filter((e) => e.visited).length,
          progress: 0,
        });
      } catch (e) {
        console.warn("onUpdateStats startTraversal error", e);
      }
    };

    const markEdgeVisited = (f, to) => {
      const e = edgeObjects.find((x) => x.from === f && x.to === to);
      if (e && !e.visited) {
        e.visited = true;
        e.mat.color.setHex(0x60a5fa);
        e.mat.opacity = 1;
      }
    };

    const clock = new THREE.Clock();
    const renderLoop = () => {
      const dt = clock.getDelta();

      if (isPlaying && path.length > 1) {
        t += dt * 0.25; // slow, gentle speed
        if (t >= 1) {
          // finish current leg
          markEdgeVisited(path[step], path[step + 1]);

          // increment step AFTER marking edge visited
          step++;
          t = 0;

          // update stats after arriving at node
          const visitedCount = edgeObjects.filter((e) => e.visited).length;
          const curStep = Math.min(step, totalSteps);
          const curFrom = path[curStep] || "-";
          const curTo = path[curStep + 1] || "-";
          const prog = totalSteps === 0 ? 100 : Math.round((curStep / totalSteps) * 100);

          try {
            onUpdateStats({
              currentStep: curStep,
              totalSteps,
              currentFrom: curFrom,
              currentTo: curTo,
              visited: visitedCount,
              progress: prog,
            totalDeaths: visitedCount,
            });
          } catch (e) {
            console.warn("onUpdateStats renderLoop error", e);
          }

          if (step >= path.length - 1) {
            setMessage(`Reached ${path[step]} — Journey complete!`);
            isPlaying = false;
            setPlaying(false);

            // final stats
            try {
              onUpdateStats({
                currentStep: totalSteps,
                totalSteps,
                currentFrom: path[step] || "-",
                currentTo: "-",
                visited: edgeObjects.filter((e) => e.visited).length,
                progress: 100,
              });
            } catch (e) {
              console.warn("onUpdateStats final error", e);
            }
          } else {
            setMessage(`Moving from ${path[step]} → ${path[step + 1]}`);
          }
        } else {
          // in-between nodes: interpolate orb and camera, update progress smoothly
          const from = nodeMap[path[step]].pos;
          const to = nodeMap[path[step + 1]].pos;
          orb.position.lerpVectors(from, to, easeInOutQuad(t));
          makeTrail(orb.position);
          camTarget.copy(orb.position);
          const camPos = camTarget
            .clone()
            .add(new THREE.Vector3(8, 5, 8));
          camera.position.lerp(camPos, 0.04);
          camera.lookAt(orb.position);

          // update stats mid-travel
          const visitedCount = edgeObjects.filter((e) => e.visited).length;
          const rawProgress = totalSteps === 0 ? 1 : (step + t) / totalSteps;
          const prog = Math.round(Math.min(100, rawProgress * 100));

          try {
            onUpdateStats({
              currentStep: Math.min(step, totalSteps),
              totalSteps,
              currentFrom: path[step] || "-",
              currentTo: path[step + 1] || "-",
              visited: visitedCount,
              progress: prog,
            });
          } catch (e) {
            console.warn("onUpdateStats renderLoop mid error", e);
          }
        }
      }

      // orb pulse
      if (orb.visible) {
        const s = 1 + Math.sin(clock.elapsedTime * 3) * 0.1;
        orb.scale.setScalar(s);
      }

      // fade trail
      for (let i = trail.length - 1; i >= 0; i--) {
        trail[i].life -= dt * 0.6;
        trail[i].sprite.material.opacity = Math.max(0, trail[i].life);
        if (trail[i].life <= 0) {
          scene.remove(trail[i].sprite);
          trail.splice(i, 1);
        }
      }

      controls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(renderLoop);
    };

    renderLoop();
    if (path.length > 1) startTraversal();

    const onResize = () => {
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(
        mountRef.current.clientWidth,
        mountRef.current.clientHeight
      );
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      try {
        mountRef.current.removeChild(renderer.domElement);
      } catch (e) {
        // ignore if already removed
      }

      // reset stats when unmounting
      try {
        onUpdateStats({
          currentStep: 0,
          totalSteps: 0,
          currentFrom: "-",
          currentTo: "-",
          visited: 0,
          progress: 0,
        });
      } catch (e) {
        // noop
      }
    };
  }, [nodes, edges, path]);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <div ref={mountRef} style={{ width: "100%", height: "100%" }} />
      <div
        style={{
          position: "absolute",
          bottom: 24,
          left: "50%",
          transform: "translateX(-50%)",
          background: "rgba(15,23,42,0.8)",
          color: "#e2f6ff",
          padding: "12px 20px",
          borderRadius: "12px",
          fontSize: "16px",
          maxWidth: "80%",
          textAlign: "center",
          transition: "opacity 0.6s ease",
        }}
      >
        {message}
      </div>
    </div>
  );
}

// 🧊 Helpers

function makeLabelSprite(text, opts = {}) {
  const fontsize = opts.fontsize || 20;
  const color = opts.color || "#e2e8f0";

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const width = Math.max(100, text.length * 16);
  canvas.width = width;
  canvas.height = 40;

  ctx.fillStyle = "rgba(20,30,50,0.85)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.font = `bold ${fontsize}px Arial`;
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  const tex = new THREE.CanvasTexture(canvas);
  const mat = new THREE.SpriteMaterial({ map: tex, transparent: true });
  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(3.5, 1.2, 1);
  return sprite;
}

function makeTrailDot() {
  const mat = new THREE.SpriteMaterial({
    color: 0x22d3ee,
    transparent: true,
    opacity: 1,
  });
  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(0.1, 0.1, 0.1);
  return sprite;
}

function easeInOutQuad(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}
