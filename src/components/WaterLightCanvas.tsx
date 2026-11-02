import { useEffect, useRef } from 'react';

interface WaterLightCanvasProps {
  /** 0 = sunlit surface (#F5FAFD), 1 = 80m deep aquifer (#123C69) */
  depthProgressRef: React.MutableRefObject<number>;
}

/**
 * Subtle, organic water-light refraction canvas.
 * Renders soft caustic light ribbons at 60fps when visible, automatically
 * pausing offscreen or when prefers-reduced-motion is enabled.
 */
export function WaterLightCanvas({ depthProgressRef }: WaterLightCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia('(max-width: 1023px)').matches) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.dataset.performance === 'lite';
    let width = 0;
    let height = 0;
    let rafId = 0;
    let isVisible = true;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });

    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0.01 }
    );
    observer.observe(canvas);

    let lastFrame = 0;
    const drawFrame = (timeMs: number) => {
      if (isVisible && !document.hidden && timeMs - lastFrame >= 32) {
        lastFrame = timeMs;
        const t = reducedMotion ? 1.2 : timeMs * 0.00032;
        const depth = Math.max(0, Math.min(1, depthProgressRef.current));

        ctx.clearRect(0, 0, width, height);

        // Soft top-right Crimean sunlight aura on surface -> overhead deep-water shaft at 80m
        const sunX = width * (0.64 - depth * 0.14) + Math.sin(t * 0.9) * 28;
        const sunY = height * (0.18 - depth * 0.12) + Math.cos(t * 0.7) * 18;
        const radius = Math.max(width, height) * 0.72;

        const aura = ctx.createRadialGradient(sunX, sunY, 10, sunX, sunY, radius);
        if (depth < 0.5) {
          const surfaceAlpha = (1 - depth * 1.4) * 0.36;
          aura.addColorStop(0, `rgba(255, 255, 255, ${Math.max(0, surfaceAlpha * 1.4)})`);
          aura.addColorStop(0.45, `rgba(169, 216, 240, ${Math.max(0, surfaceAlpha)})`);
          aura.addColorStop(1, 'rgba(245, 250, 253, 0)');
        } else {
          const deepAlpha = (depth - 0.35) * 0.24;
          aura.addColorStop(0, `rgba(169, 216, 240, ${Math.min(0.22, deepAlpha)})`);
          aura.addColorStop(0.55, `rgba(52, 118, 178, ${Math.min(0.12, deepAlpha * 0.5)})`);
          aura.addColorStop(1, 'rgba(18, 60, 105, 0)');
        }
        ctx.fillStyle = aura;
        ctx.fillRect(0, 0, width, height);

        // Delicate water-surface light refraction curves (3 quiet organic waves, never noisy)
        const waveCount = 3;
        for (let i = 0; i < waveCount; i++) {
          ctx.beginPath();
          const baseY = height * (0.28 + i * 0.22) - depth * height * 0.08;
          const amp = (18 + i * 9) * (1 - depth * 0.35);
          const freq = 0.0022 + i * 0.0006;
          const phase = t * (1.1 + i * 0.35) + i * 1.9;

          for (let x = 0; x <= width; x += 24) {
            const y =
              baseY +
              Math.sin(x * freq + phase) * amp +
              Math.cos(x * freq * 1.7 - phase * 0.7) * (amp * 0.42);
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }

          const lineAlpha = depth < 0.45 ? 0.16 - i * 0.03 : 0.09 - i * 0.02;
          ctx.strokeStyle =
            depth < 0.45
              ? `rgba(169, 216, 240, ${Math.max(0.03, lineAlpha)})`
              : `rgba(169, 216, 240, ${Math.max(0.03, lineAlpha * 0.9)})`;
          ctx.lineWidth = 1.15;
          ctx.stroke();
        }
      }

      if (!reducedMotion) {
        rafId = window.requestAnimationFrame(drawFrame);
      }
    };

    rafId = window.requestAnimationFrame(drawFrame);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      observer.disconnect();
    };
  }, [depthProgressRef]);

  return <canvas ref={canvasRef} className="water-light-canvas" aria-hidden="true" />;
}
