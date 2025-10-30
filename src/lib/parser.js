// src/lib/parser.js
export function parseInput(text) {
  const lines = text
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(Boolean);

  if (lines.length === 0) return { nodes: [], edges: [], start: null, goal: null };

  let idx = 0;
  const first = lines[0].split(/\s+/);
  // If first line looks like "N M", skip it
  if (first.length >= 2 && first.every(x => /^\d+$/.test(x))) idx = 1;

  const edges = [];
  const nodes = new Set();

  // detect if last line might be "start goal"
  let endIdx = lines.length;
  const lastLine = lines[lines.length - 1].split(/\s+/);
  const maybeStartGoal = lastLine.length === 2;
  if (maybeStartGoal) {
    const allEdgeLinesValid = lines.slice(idx, -1).every(l => {
      const p = l.split(/\s+/);
      return p.length === 3 && /^\d+$/.test(p[2]);
    });
    if (allEdgeLinesValid) endIdx = lines.length - 1;
  }

  for (let i = idx; i < endIdx; i++) {
    const [from, to, costStr] = lines[i].split(/\s+/);
    const cost = Number(costStr);
    if (!from || !to || isNaN(cost)) continue;
    edges.push({ from, to, cost });
    nodes.add(from);
    nodes.add(to);
  }

  let start = null, goal = null;
  if (endIdx === lines.length - 1) {
    const [s, g] = lastLine;
    start = s;
    goal = g;
    nodes.add(s);
    nodes.add(g);
  }

  return { nodes: [...nodes], edges, start, goal };
}
