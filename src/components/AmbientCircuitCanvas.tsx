import React, { useEffect, useRef } from 'react';

interface NodePoint {
  x: number;
  y: number;
  connections: number[];
}

interface Pulse {
  fromIndex: number;
  toIndex: number;
  progress: number;
  speed: number;
  color: string;
}

export function AmbientCircuitCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initNetwork();
    };

    window.addEventListener('resize', handleResize, { passive: true });

    let nodes: NodePoint[] = [];
    let pulses: Pulse[] = [];

    const initNetwork = () => {
      nodes = [];
      pulses = [];

      const cols = Math.max(6, Math.floor(width / 180));
      const rows = Math.max(5, Math.floor(height / 180));
      const cellW = width / cols;
      const cellH = height / rows;

      // Create grid of nodes with slight organic jitter
      for (let r = 0; r <= rows; r++) {
        for (let c = 0; c <= cols; c++) {
          nodes.push({
            x: c * cellW + ((c % 2 === 0 ? 1 : -1) * 20),
            y: r * cellH + ((r % 2 === 0 ? 1 : -1) * 15),
            connections: [],
          });
        }
      }

      // Connect neighbor nodes (horizontal, vertical, or 45-degree trace)
      nodes.forEach((node, i) => {
        const c = i % (cols + 1);
        const r = Math.floor(i / (cols + 1));

        // Right neighbor
        if (c < cols && Math.random() > 0.35) {
          node.connections.push(i + 1);
        }
        // Down neighbor
        if (r < rows && Math.random() > 0.4) {
          node.connections.push(i + (cols + 1));
        }
        // Diagonal 45-deg PCB trace
        if (c < cols && r < rows && Math.random() > 0.65) {
          node.connections.push(i + (cols + 1) + 1);
        }
      });

      // Spawn initial signal pulses
      const colors = ['#7de2ff', '#7cffb2', '#ffd09e', '#a98cff'];
      for (let p = 0; p < 12; p++) {
        const from = Math.floor(Math.random() * nodes.length);
        if (nodes[from].connections.length > 0) {
          const to = nodes[from].connections[Math.floor(Math.random() * nodes[from].connections.length)];
          pulses.push({
            fromIndex: from,
            toIndex: to,
            progress: Math.random(),
            speed: 0.004 + Math.random() * 0.006,
            color: colors[p % colors.length],
          });
        }
      }
    };

    initNetwork();

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw faint static PCB traces
      ctx.lineWidth = 1;
      nodes.forEach((node) => {
        node.connections.forEach((targetIdx) => {
          const target = nodes[targetIdx];
          if (!target) return;

          ctx.strokeStyle = 'rgba(125, 226, 255, 0.04)';
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(target.x, target.y);
          ctx.stroke();
        });

        // Small PCB via pad
        ctx.fillStyle = 'rgba(125, 226, 255, 0.07)';
        ctx.beginPath();
        ctx.arc(node.x, node.y, 2, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw traveling signal pulses
      pulses.forEach((pulse) => {
        const from = nodes[pulse.fromIndex];
        const to = nodes[pulse.toIndex];
        if (!from || !to) return;

        pulse.progress += pulse.speed;
        if (pulse.progress >= 1) {
          // Re-route pulse to another connection or random node
          pulse.progress = 0;
          pulse.fromIndex = pulse.toIndex;
          const nextTargets = nodes[pulse.toIndex]?.connections || [];
          if (nextTargets.length > 0) {
            pulse.toIndex = nextTargets[Math.floor(Math.random() * nextTargets.length)];
          } else {
            pulse.fromIndex = Math.floor(Math.random() * nodes.length);
            pulse.toIndex = nodes[pulse.fromIndex]?.connections[0] || 0;
          }
        }

        const curX = from.x + (to.x - from.x) * pulse.progress;
        const curY = from.y + (to.y - from.y) * pulse.progress;

        // Glowing packet
        ctx.fillStyle = pulse.color;
        ctx.shadowColor = pulse.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(curX, curY, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-[1] opacity-70"
    />
  );
}
