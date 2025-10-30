// src/lib/dijkstra.js
export function dijkstra(edges, start, goal) {
  const adj = new Map();
  edges.forEach(({ from, to, cost }) => {
    if (!adj.has(from)) adj.set(from, []);
    adj.get(from).push({ to, cost });
    if (!adj.has(to)) adj.set(to, []);
  });

  const dist = new Map();
  const prev = new Map();
  const INF = Infinity;

  for (const n of adj.keys()) {
    dist.set(n, INF);
    prev.set(n, null);
  }
  dist.set(start, 0);

  const visited = new Set();
  const pq = [{ node: start, dist: 0 }];

  const popMin = () => {
    let minIdx = 0;
    for (let i = 1; i < pq.length; i++) {
      if (pq[i].dist < pq[minIdx].dist) minIdx = i;
    }
    return pq.splice(minIdx, 1)[0];
  };

  while (pq.length > 0) {
    const { node: u } = popMin();
    if (visited.has(u)) continue;
    visited.add(u);

    const du = dist.get(u);
    if (du === INF) break;
    if (goal && u === goal) break;

    const neighbors = adj.get(u) || [];
    for (const { to, cost } of neighbors) {
      const alt = du + cost;
      if (alt < dist.get(to)) {
        dist.set(to, alt);
        prev.set(to, u);
        pq.push({ node: to, dist: alt });
      }
    }
  }

  function reconstructPath(target) {
    if (dist.get(target) === INF) return null;
    const path = [];
    let cur = target;
    while (cur) {
      path.unshift(cur);
      cur = prev.get(cur);
    }
    return path;
  }

  return {
    distances: Object.fromEntries(dist),
    prev: Object.fromEntries(prev),
    getPath: target => reconstructPath(target),
  };
}
