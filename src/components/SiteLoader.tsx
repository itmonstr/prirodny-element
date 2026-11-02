import { useEffect, useState, type ReactNode } from 'react';
import { assetUrl } from '../utils/assetUrl';

const ASSETS = [
  'logo-dark.webp', 'bottle-hero.webp', 'surface-sunlight-hd.webp',
  'bottle-05-sparkling.webp', 'bottle-05-still.webp',
  'bottle-15-sparkling.webp', 'bottle-15-still.webp',
  'crimea-west-hd.webp', 'factory-exterior-01.webp', 'conveyor.webp',
  'factory-ready.webp', 'finale-water-stage.webp',
];

export function SiteLoader({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    document.documentElement.dataset.performance = connection?.saveData || /(^|-)2g$/.test(connection?.effectiveType ?? '') ? 'lite' : 'normal';
    let active = true;
    let completed = 0;
    const finish = () => { if (active) setReady(true); };
    const timeout = window.setTimeout(finish, 60_000);
    const minimum = new Promise<void>((resolve) => window.setTimeout(resolve, 900));
    const tasks: Promise<unknown>[] = ASSETS.map((name) => new Promise<void>((resolve) => {
      const image = new Image();
      image.onload = () => { image.decode().catch(() => {}).finally(resolve); };
      image.onerror = () => resolve();
      image.src = assetUrl(`assets/${name}`);
    }));
    tasks.push(Promise.allSettled([
      document.fonts.load('400 24px "Cormorant Garamond"', 'Природный Элемент'),
      document.fonts.load('400 16px Manrope', 'Природный Элемент'),
      document.fonts.load('600 16px Manrope', 'Природный Элемент'),
    ]));
    tasks.forEach((task) => task.finally(() => {
      completed += 1;
      if (active) setProgress(Math.round(completed / tasks.length * 100));
    }));
    Promise.all([Promise.allSettled(tasks), minimum]).then(() => { window.clearTimeout(timeout); finish(); });
    return () => { active = false; window.clearTimeout(timeout); };
  }, []);

  useEffect(() => {
    if (ready) {
      const timeout = window.setTimeout(() => setVisible(false), 300);
      return () => window.clearTimeout(timeout);
    }
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [ready]);

  return <>
    {ready && children}
    {visible && <div className={`site-loader${ready ? ' site-loader--done' : ''}`} role="status" aria-live="polite">
      <span className="site-loader__brand">Природный<br />Элемент</span>
      <span className="site-loader__caption">Готовим первое знакомство</span>
      <div className="site-loader__track" aria-hidden="true"><span style={{ transform: `scaleX(${progress / 100})` }} /></div>
      <span className="site-loader__progress" aria-hidden="true">{progress}%</span>
    </div>}
  </>;
}
