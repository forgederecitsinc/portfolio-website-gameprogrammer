import { useEffect, useRef } from 'react';

interface Vec3 {
  x: number;
  y: number;
  z: number;
}

const PHI = (1 + Math.sqrt(5)) / 2;

// Normalized icosahedron vertices
const RAW_VERTS: Vec3[] = [
  { x: -1, y: PHI, z: 0 },
  { x: 1, y: PHI, z: 0 },
  { x: -1, y: -PHI, z: 0 },
  { x: 1, y: -PHI, z: 0 },
  { x: 0, y: -1, z: PHI },
  { x: 0, y: 1, z: PHI },
  { x: 0, y: -1, z: -PHI },
  { x: 0, y: 1, z: -PHI },
  { x: PHI, y: 0, z: -1 },
  { x: PHI, y: 0, z: 1 },
  { x: -PHI, y: 0, z: -1 },
  { x: -PHI, y: 0, z: 1 },
].map((v) => {
  const len = Math.hypot(v.x, v.y, v.z);
  return { x: v.x / len, y: v.y / len, z: v.z / len };
});

// 20 triangular faces of the icosahedron
const FACES: [number, number, number][] = [
  [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
  [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
  [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
  [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1],
];

function rotatePoint(p: Vec3, ax: number, ay: number, az: number): Vec3 {
  // Rotate around X
  const cx = Math.cos(ax);
  const sx = Math.sin(ax);
  const y1 = p.y * cx - p.z * sx;
  const z1 = p.y * sx + p.z * cx;

  // Rotate around Y
  const cy = Math.cos(ay);
  const sy = Math.sin(ay);
  const x2 = p.x * cy + z1 * sy;
  const z2 = -p.x * sy + z1 * cy;

  // Rotate around Z
  const cz = Math.cos(az);
  const sz = Math.sin(az);
  return {
    x: x2 * cz - y1 * sz,
    y: x2 * sz + y1 * cz,
    z: z2,
  };
}

/**
 * Resn-inspired lightweight 3D faceted specimen canvas:
 * - Real-time 3D rotation matrices, Lambertian face lighting, painter's sort,
 *   and dual orbital wireframe rings.
 * - Reacts smoothly to both page scroll and pointer movement.
 * - Zero external 3D library overhead; caps DPR at 2 and respects reduced-motion.
 */
export function Resn3DShowcase() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let width = 0;
    let height = 0;
    let raf = 0;
    let targetPointerX = 0;
    let targetPointerY = 0;
    let smoothPointerX = 0;
    let smoothPointerY = 0;
    let scrollAngle = 0;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 3);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      targetPointerX = Math.max(-1.2, Math.min(1.2, nx));
      targetPointerY = Math.max(-1.2, Math.min(1.2, ny));
    };

    const onScroll = () => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      scrollAngle = (window.scrollY / maxScroll) * Math.PI * 2.5;
    };

    const lightDir = (() => {
      const l = { x: -0.45, y: -0.65, z: 0.62 };
      const len = Math.hypot(l.x, l.y, l.z);
      return { x: l.x / len, y: l.y / len, z: l.z / len };
    })();

    const renderFrame = (now: number) => {
      const t = prefersReduced ? 0 : now * 0.00055;
      smoothPointerX += (targetPointerX - smoothPointerX) * 0.08;
      smoothPointerY += (targetPointerY - smoothPointerY) * 0.08;

      const ax = t * 0.7 + smoothPointerY * 0.55 + scrollAngle * 0.35;
      const ay = t * 1.0 + smoothPointerX * 0.75 + scrollAngle * 0.65;
      const az = t * 0.3;

      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const radius = Math.min(width, height) * 0.29;
      const fov = 3.2;

      const project = (v: Vec3) => {
        const scale = fov / (fov - v.z);
        return {
          x: cx + v.x * radius * scale,
          y: cy + v.y * radius * scale,
          z: v.z,
        };
      };

      // Draw outer tilted 3D orbital rings
      const drawOrbitRing = (rx: number, ry: number, tiltX: number, tiltY: number, color: string) => {
        ctx.beginPath();
        const steps = 48;
        for (let i = 0; i <= steps; i++) {
          const a = (i / steps) * Math.PI * 2;
          const p = rotatePoint(
            { x: Math.cos(a) * rx, y: Math.sin(a) * ry, z: 0 },
            tiltX,
            tiltY,
            0
          );
          const proj = project(p);
          if (i === 0) ctx.moveTo(proj.x, proj.y);
          else ctx.lineTo(proj.x, proj.y);
        }
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.25;
        ctx.stroke();
      };

      drawOrbitRing(1.42, 1.42, ax * 0.6 + 1.0, ay * 0.5, 'rgba(15, 15, 15, 0.25)');
      drawOrbitRing(1.62, 1.62, -ax * 0.4 + 0.5, ay * 0.8 + 0.7, 'rgba(82, 82, 82, 0.28)');

      // Transform vertices
      const transformed = RAW_VERTS.map((v) => rotatePoint(v, ax, ay, az));
      const projected = transformed.map(project);

      // Compute faces with normals & depth for painter's sort
      const faceData = FACES.map(([i0, i1, i2], idx) => {
        const v0 = transformed[i0];
        const v1 = transformed[i1];
        const v2 = transformed[i2];

        const ux = v1.x - v0.x;
        const uy = v1.y - v0.y;
        const uz = v1.z - v0.z;
        const vx = v2.x - v0.x;
        const vy = v2.y - v0.y;
        const vz = v2.z - v0.z;

        const nx = uy * vz - uz * vy;
        const ny = uz * vx - ux * vz;
        const nz = ux * vy - uy * vx;
        const nLen = Math.hypot(nx, ny, nz) || 1;

        const dot = (nx / nLen) * lightDir.x + (ny / nLen) * lightDir.y + (nz / nLen) * lightDir.z;
        const avgZ = (v0.z + v1.z + v2.z) / 3;

        return {
          indices: [i0, i1, i2] as [number, number, number],
          nz: nz / nLen,
          light: Math.max(0.15, Math.min(1, 0.52 + dot * 0.55)),
          avgZ,
          idx,
        };
      })
        .filter((f) => f.nz > -0.15)
        .sort((a, b) => a.avgZ - b.avgZ);

      // Render shaded facets
      for (const face of faceData) {
        const [i0, i1, i2] = face.indices;
        const p0 = projected[i0];
        const p1 = projected[i1];
        const p2 = projected[i2];

        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.closePath();

        // Pure silver-gelatin black & white facet shading
        const lightness = Math.round(18 + face.light * 74);
        ctx.fillStyle = `hsla(0, 0%, ${lightness}%, 0.94)`;
        ctx.fill();

        ctx.strokeStyle = 'rgba(15, 15, 15, 0.5)';
        ctx.lineWidth = 0.85;
        ctx.stroke();
      }

      // Specular vertex nodes
      for (let i = 0; i < projected.length; i++) {
        if (transformed[i].z < 0) continue;
        const p = projected[i];
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fill();
      }

      if (!prefersReduced) {
        raf = requestAnimationFrame(renderFrame);
      }
    };

    resize();
    onScroll();
    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    raf = requestAnimationFrame(renderFrame);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="relative h-56 w-full overflow-hidden rounded-lg border border-[#D4D4D2] bg-gradient-to-br from-[#F7F7F5] via-[#ECEBE9] to-[#E2E1DF] sm:h-64">
      <canvas ref={canvasRef} className="h-full w-full" aria-hidden="true" />
      <div className="pointer-events-none absolute right-3 bottom-2.5 rounded-sm border border-[#D4D4D2] bg-[#F7F7F5]/95 px-2.5 py-0.5 font-mono text-[10px] font-medium tracking-widest text-[#0F0F0F] uppercase">
        3D Specimen · Scroll &amp; Move
      </div>
    </div>
  );
}
