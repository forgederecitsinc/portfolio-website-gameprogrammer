import { useEffect, useRef } from 'react';

interface GridCell {
  col: number;
  row: number;
}

const CELL_SIZE = 38;

/**
 * Lightweight 2D A* NavMesh pathfinding visualizer for the Hero background.
 * - Caps DPR at 2 to prevent thermal throttling on integrated GPUs.
 * - Disables animation below 768px and under prefers-reduced-motion: reduce.
 * - Keeps contrast ultra-subtle so light-mode hero typography stays razor-sharp.
 */
export function HeroNavMeshCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isDesktop = window.matchMedia('(min-width: 768px)').matches;
    if (prefersReduced || !isDesktop) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let cols = 0;
    let rows = 0;
    let obstacles = new Set<string>();
    let raf = 0;

    // Agent & target positions in grid coordinates
    let agentPos = { x: 3.5, y: 3.5 };
    let targetCell: GridCell = { col: 14, row: 5 };
    let hasPointer = false;
    let path: GridCell[] = [];
    let explored: GridCell[] = [];
    let lastTime = performance.now();
    let repathAccum = 0;

    const key = (c: number, r: number) => `${c},${r}`;

    const buildObstacles = () => {
      obstacles = new Set<string>();
      // Deterministic sparse level-design islands so the grid feels like a real NavMesh
      for (let c = 2; c < cols - 2; c++) {
        for (let r = 1; r < rows - 1; r++) {
          const hash = (c * 73856093) ^ (r * 19349663);
          if (Math.abs(hash) % 13 === 0) {
            obstacles.add(key(c, r));
          }
        }
      }
      // Keep start & target clear
      obstacles.delete(key(Math.floor(agentPos.x), Math.floor(agentPos.y)));
      obstacles.delete(key(targetCell.col, targetCell.row));
    };

    const runAStar = (start: GridCell, goal: GridCell) => {
      if (
        start.col < 0 ||
        start.col >= cols ||
        start.row < 0 ||
        start.row >= rows ||
        goal.col < 0 ||
        goal.col >= cols ||
        goal.row < 0 ||
        goal.row >= rows
      ) {
        return { path: [] as GridCell[], explored: [] as GridCell[] };
      }

      const open: Array<{ cell: GridCell; g: number; f: number }> = [
        { cell: start, g: 0, f: Math.abs(goal.col - start.col) + Math.abs(goal.row - start.row) },
      ];
      const cameFrom = new Map<string, GridCell>();
      const gScore = new Map<string, number>([[key(start.col, start.row), 0]]);
      const closed = new Set<string>();
      const visitedOrder: GridCell[] = [];

      const dirs = [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ];

      let iterations = 0;
      const maxIter = Math.min(900, cols * rows * 2);

      while (open.length > 0 && iterations < maxIter) {
        iterations++;
        let bestIdx = 0;
        for (let i = 1; i < open.length; i++) {
          if (open[i].f < open[bestIdx].f) bestIdx = i;
        }
        const current = open.splice(bestIdx, 1)[0];
        const curKey = key(current.cell.col, current.cell.row);

        if (current.cell.col === goal.col && current.cell.row === goal.row) {
          const finalPath: GridCell[] = [goal];
          let traceKey = curKey;
          while (cameFrom.has(traceKey)) {
            const prev = cameFrom.get(traceKey)!;
            finalPath.unshift(prev);
            traceKey = key(prev.col, prev.row);
          }
          return { path: finalPath, explored: visitedOrder };
        }

        closed.add(curKey);
        if (visitedOrder.length < 140) visitedOrder.push(current.cell);

        for (const [dc, dr] of dirs) {
          const nc = current.cell.col + dc;
          const nr = current.cell.row + dr;
          if (nc < 0 || nc >= cols || nr < 0 || nr >= rows) continue;
          const nKey = key(nc, nr);
          if (closed.has(nKey) || obstacles.has(nKey)) continue;

          const tentativeG = current.g + 1;
          const existingG = gScore.get(nKey);
          if (existingG === undefined || tentativeG < existingG) {
            cameFrom.set(nKey, current.cell);
            gScore.set(nKey, tentativeG);
            const h = Math.abs(goal.col - nc) + Math.abs(goal.row - nr);
            const existingOpen = open.find((item) => item.cell.col === nc && item.cell.row === nr);
            if (existingOpen) {
              existingOpen.g = tentativeG;
              existingOpen.f = tentativeG + h;
            } else {
              open.push({ cell: { col: nc, row: nr }, g: tentativeG, f: tentativeG + h });
            }
          }
        }
      }

      return { path: [] as GridCell[], explored: visitedOrder };
    };

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      cols = Math.max(8, Math.floor(width / CELL_SIZE));
      rows = Math.max(5, Math.floor(height / CELL_SIZE));
      agentPos = {
        x: Math.min(cols - 2, Math.max(1.5, agentPos.x)),
        y: Math.min(rows - 2, Math.max(1.5, agentPos.y)),
      };
      targetCell = {
        col: Math.min(cols - 2, Math.max(1, Math.floor(cols * 0.72))),
        row: Math.min(rows - 2, Math.max(1, Math.floor(rows * 0.48))),
      };
      buildObstacles();
      const result = runAStar(
        { col: Math.floor(agentPos.x), row: Math.floor(agentPos.y) },
        targetCell
      );
      path = result.path;
      explored = result.explored;
    };

    const onPointerMove = (e: PointerEvent) => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const relX = e.clientX - rect.left;
      const relY = e.clientY - rect.top;
      if (relX < 0 || relY < 0 || relX > rect.width || relY > rect.height) return;

      hasPointer = true;
      const col = Math.min(cols - 1, Math.max(0, Math.floor(relX / CELL_SIZE)));
      const row = Math.min(rows - 1, Math.max(0, Math.floor(relY / CELL_SIZE)));
      if (!obstacles.has(key(col, row)) && (col !== targetCell.col || row !== targetCell.row)) {
        targetCell = { col, row };
        const result = runAStar(
          { col: Math.floor(agentPos.x), row: Math.floor(agentPos.y) },
          targetCell
        );
        path = result.path;
        explored = result.explored;
      }
    };

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;

      // Gentle autonomous target orbit when cursor isn't moving inside hero
      repathAccum += dt;
      if (!hasPointer && repathAccum > 2.8) {
        repathAccum = 0;
        const nextCol = Math.min(cols - 2, Math.max(1, Math.floor((Math.sin(now * 0.001) * 0.35 + 0.55) * cols)));
        const nextRow = Math.min(rows - 2, Math.max(1, Math.floor((Math.cos(now * 0.0013) * 0.3 + 0.5) * rows)));
        if (!obstacles.has(key(nextCol, nextRow))) {
          targetCell = { col: nextCol, row: nextRow };
          const result = runAStar(
            { col: Math.floor(agentPos.x), row: Math.floor(agentPos.y) },
            targetCell
          );
          path = result.path;
          explored = result.explored;
        }
      }

      // Advance agent smoothly along path
      if (path.length > 1) {
        const next = path[1];
        const tx = next.col + 0.5;
        const ty = next.row + 0.5;
        const dx = tx - agentPos.x;
        const dy = ty - agentPos.y;
        const dist = Math.hypot(dx, dy);
        const speed = 3.2 * dt;
        if (dist <= speed) {
          agentPos.x = tx;
          agentPos.y = ty;
          path.shift();
        } else {
          agentPos.x += (dx / dist) * speed;
          agentPos.y += (dy / dist) * speed;
        }
      }

      // Draw
      ctx.clearRect(0, 0, width, height);

      // Subtle archival ink grid
      ctx.strokeStyle = 'rgba(26, 23, 21, 0.055)';
      ctx.lineWidth = 0.75;
      for (let c = 0; c <= cols; c++) {
        const x = c * CELL_SIZE;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let r = 0; r <= rows; r++) {
        const y = r * CELL_SIZE;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Soft obstacle blocks
      ctx.fillStyle = 'rgba(140, 118, 108, 0.11)';
      obstacles.forEach((k) => {
        const [c, r] = k.split(',').map(Number);
        ctx.fillRect(c * CELL_SIZE + 4, r * CELL_SIZE + 4, CELL_SIZE - 8, CELL_SIZE - 8);
      });

      // Explored frontier cells
      ctx.fillStyle = 'rgba(164, 120, 100, 0.065)';
      for (const cell of explored) {
        ctx.fillRect(cell.col * CELL_SIZE + 6, cell.row * CELL_SIZE + 6, CELL_SIZE - 12, CELL_SIZE - 12);
      }

      // A* computed path
      if (path.length > 0) {
        ctx.beginPath();
        ctx.moveTo(agentPos.x * CELL_SIZE, agentPos.y * CELL_SIZE);
        for (let i = 1; i < path.length; i++) {
          ctx.lineTo((path[i].col + 0.5) * CELL_SIZE, (path[i].row + 0.5) * CELL_SIZE);
        }
        ctx.strokeStyle = 'rgba(164, 120, 100, 0.42)';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.lineDashOffset = -(now * 0.025);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Target goal ring
      const gx = (targetCell.col + 0.5) * CELL_SIZE;
      const gy = (targetCell.row + 0.5) * CELL_SIZE;
      ctx.beginPath();
      ctx.arc(gx, gy, 7 + Math.sin(now * 0.005) * 1.5, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(164, 120, 100, 0.55)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Agent node
      const ax = agentPos.x * CELL_SIZE;
      const ay = agentPos.y * CELL_SIZE;
      ctx.beginPath();
      ctx.arc(ax, ay, 5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(35, 27, 24, 0.55)';
      ctx.fill();

      raf = requestAnimationFrame(tick);
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 hidden h-full w-full md:block"
    />
  );
}
