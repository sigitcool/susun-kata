import React, { useEffect, useRef } from 'react';

interface ConfettiCanvasProps {
  active: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  vRot: number;
}

const COLORS = ['#38BDF8', '#FACC15', '#34D399', '#F472B6', '#A78BFA', '#FB923C'];

export const ConfettiCanvas: React.FC<ConfettiCanvasProps> = ({ active }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) return;

    const width = (canvas.width = window.innerWidth);
    const height = (canvas.height = window.innerHeight);

    const particles: Particle[] = Array.from({ length: 85 }, () => ({
      x: width * (0.2 + Math.random() * 0.6),
      y: height * 0.25 + (Math.random() - 0.5) * 60,
      vx: (Math.random() - 0.5) * 10,
      vy: -6 - Math.random() * 7,
      size: 7 + Math.random() * 7,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rotation: Math.random() * Math.PI * 2,
      vRot: (Math.random() - 0.5) * 0.2,
    }));

    let rafId = 0;
    let frames = 0;

    const tick = () => {
      frames += 1;
      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.24;
        p.rotation += p.vRot;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 3, p.size, (p.size * 2) / 3);
        ctx.restore();
      }

      if (frames < 130) {
        rafId = window.requestAnimationFrame(tick);
      } else {
        ctx.clearRect(0, 0, width, height);
      }
    };

    rafId = window.requestAnimationFrame(tick);
    return () => {
      window.cancelAnimationFrame(rafId);
      ctx.clearRect(0, 0, width, height);
    };
  }, [active]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      data-testid="confetti-canvas"
      className="fixed inset-0 pointer-events-none z-50"
      aria-hidden="true"
    />
  );
};
