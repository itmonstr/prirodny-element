import { useEffect, useRef } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/** A full-viewport dissolve masks the moving seam between the opening scenes. */
export function OpeningHandoff() {
  const overlay = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const host = overlay.current;
    const source = document.querySelector('.depth-water-scene');
    if (!host || !source) return;
    const water = source.cloneNode(true) as HTMLElement;
    host.appendChild(water);
    const hide = () => { host.style.opacity = '0'; host.style.visibility = 'hidden'; };
    const trigger = ScrollTrigger.create({
      trigger: '.depth-to-light-section',
      start: 'top bottom',
      end: 'top top',
      onUpdate: (self) => {
        if (!self.isActive) { hide(); return; }
        const progress = Math.min(1, self.progress / 0.85);
        host.style.visibility = 'visible';
        host.style.opacity = String(progress * progress * (3 - 2 * progress));
      },
      onLeave: hide,
      onLeaveBack: hide,
    });
    return () => { trigger.kill(); water.remove(); };
  }, []);
  return <div ref={overlay} className="opening-handoff" aria-hidden="true" />;
}
