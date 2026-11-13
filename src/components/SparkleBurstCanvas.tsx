import React, { useEffect, useRef } from 'react';
import { createSparkleBurstSeeds } from '../utils/gameLogic';

interface SparkleBurstCanvasProps {
  burstKey: number;
  intensity?: 'small' | 'celebration';
  originYRatio?: number;
}

interface ActiveStar {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  starPoints: 4 | 5;
  rotation: number;
  spinSpeed: number;
  twinklePhase: number;
  age: number;
  maxAge: number;
}

function drawStarShape(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  outerR: number,
  points: 4 | 5,
  rotation: number,
  color: string,
  alpha: number
) {
  const innerR = points === 4 ? outerR * 0.34 : outerR * 0.45;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
  ctx.fillStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = 8;

  ctx.beginPath();
  const totalVertices = points * 2;
  for (let i = 0; i < totalVertices; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const angle = (i * Math.PI) / points - Math.PI / 2;
    const px = Math.cos(angle) * r;
    const py = Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();

  // Crisp bright white core for extra sparkle sheen
  ctx.fillStyle = '#FFFFFF';
  ctx.globalAlpha = Math.max(0, Math.min(1, alpha * 0.85));
  ctx.beginPath();
  ctx.arc(0, 0, Math.max(1.2, outerR * 0.22), 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

export const SparkleBurstCanvas: React.FC<SparkleBurstCanvasProps> = ({
  burstKey,
  intensity = 'celebration',
  originYRatio = 0.46,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const poolRef = useRef<ActiveStar[]>([]);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (burstKey <= 0) return;

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = window.innerWidth);
    const height = (canvas.height = window.innerHeight);
    const originX = width * 0.5;
    const originY = height * originYRatio;

    const seeds = createSparkleBurstSeeds(intensity);
    const maxAge = intensity === 'celebration' ? 68 : 48;

    for (const s of seeds) {
      poolRef.current.push({
        x: originX + (Math.random() - 0.5) * 40,
        y: originY + (Math.random() - 0.5) * 30,
        vx: Math.cos(s.angleRad) * s.speed * 1.45,
        vy: Math.sin(s.angleRad) * s.speed * 1.25 - 1.4,
        size: s.size,
        color: s.color,
        starPoints: s.starPoints,
        rotation: Math.random() * Math.PI * 2,
        spinSpeed: s.spinSpeed,
        twinklePhase: s.twinklePhase,
        age: 0,
        maxAge,
      });
    }

    if (rafRef.current !== null) return;

    const renderLoop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let writeIdx = 0;
      for (let i = 0; i < poolRef.current.length; i++) {
        const p = poolRef.current[i];
        p.age += 1;
        if (p.age >= p.maxAge) continue;

        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.965;
        p.vy = p.vy * 0.965 + 0.08;
        p.rotation += p.spinSpeed;

        const lifeRatio = p.age / p.maxAge;
        const fade = lifeRatio < 0.2 ? lifeRatio / 0.2 : 1 - (lifeRatio - 0.2) / 0.8;
        const twinkle = 0.72 + 0.28 * Math.sin(p.age * 0.35 + p.twinklePhase);

        drawStarShape(
          ctx,
          p.x,
          p.y,
          p.size * twinkle,
          p.starPoints,
          p.rotation,
          p.color,
          fade
        );

        poolRef.current[writeIdx++] = p;
      }
      poolRef.current.length = writeIdx;

      if (poolRef.current.length > 0) {
        rafRef.current = window.requestAnimationFrame(renderLoop);
      } else {
        rafRef.current = null;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    rafRef.current = window.requestAnimationFrame(renderLoop);
  }, [burstKey, intensity, originYRatio]);

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      data-testid="sparkle-canvas"
      data-burst-count={burstKey}
      className="fixed inset-0 pointer-events-none z-50"
      aria-hidden="true"
    />
  );
};
