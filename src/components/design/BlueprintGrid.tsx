import { useEffect, useRef, useCallback } from 'react';
import { useReducedMotion } from 'framer-motion';

const CELL = 32;

interface Dot {
  x: number;
  y: number;
  baseOpacity: number;
  currentOpacity: number;
  pulseOffset: number;
}

export function BlueprintGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const dotsRef = useRef<Dot[]>([]);
  const rafRef = useRef<number>(0);
  const prefersReduced = useReducedMotion();

  const buildDots = useCallback((w: number, h: number) => {
    const dots: Dot[] = [];
    const cols = Math.floor(w / CELL) + 2;
    const rows = Math.floor(h / CELL) + 2;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        dots.push({
          x: c * CELL,
          y: r * CELL,
          baseOpacity: 0.35,
          currentOpacity: 0.35,
          pulseOffset: Math.random() * Math.PI * 2,
        });
      }
    }
    return dots;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      dotsRef.current = buildDots(canvas.width, canvas.height);
    };
    resize();

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const INFLUENCE = 80;
    let t = 0;

    const draw = () => {
      t += 0.016;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const dot of dotsRef.current) {
        const dx = dot.x - mouseRef.current.x;
        const dy = dot.y - mouseRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        let opacity: number;
        if (prefersReduced) {
          opacity = 0.4;
        } else {
          // ambient pulse
          const pulse = 0.35 + Math.sin(t * 0.8 + dot.pulseOffset) * 0.15;
          // mouse proximity brightening
          const proximity = dist < INFLUENCE
            ? (1 - dist / INFLUENCE) * 0.55
            : 0;
          opacity = Math.min(1, pulse + proximity);
        }

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, 1, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(61, 123, 255, ${opacity})`;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    window.addEventListener('mousemove', onMouseMove);
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('mousemove', onMouseMove);
      ro.disconnect();
    };
  }, [buildDots, prefersReduced]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ display: 'block' }}
    />
  );
}
