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
    let outgoing: HTMLElement | null = null;
    const captureOutgoing = () => {
      outgoing?.remove();
      const stage = document.querySelector('.hero-depth-stage');
      if (!stage) return;
      outgoing = stage.cloneNode(true) as HTMLElement;
      outgoing.classList.add('opening-handoff__outgoing');
      outgoing.querySelectorAll('.hero-bottle-stage, canvas, .hero-copy, .hero-mobile-actions, .aquifer-strata, .depth-scale').forEach((element) => element.remove());
      const deepBackground = outgoing.querySelector<HTMLElement>('.hero-depth-stage__deep-bg');
      if (deepBackground) deepBackground.style.opacity = '1';
      host.prepend(outgoing);
    };
    water.classList.add('opening-handoff__water');
    host.appendChild(water);
    const hide = () => { host.style.opacity = '0'; host.style.visibility = 'hidden'; };
    const trigger = ScrollTrigger.create({
      trigger: '.depth-to-light-section',
      start: 'top bottom',
      end: 'top top',
      onUpdate: (self) => {
        if (!self.isActive) { hide(); return; }
        const progress = Math.min(1, self.progress / 0.85);
        if (!outgoing) captureOutgoing();
        host.style.visibility = 'visible';
        host.style.opacity = '1';
        water.style.opacity = String(progress * progress * (3 - 2 * progress));
      },
      onEnter: captureOutgoing,
      onEnterBack: captureOutgoing,
      onLeave: hide,
      onLeaveBack: hide,
    });
    return () => { trigger.kill(); water.remove(); outgoing?.remove(); };
  }, []);
  return <div ref={overlay} className="opening-handoff" aria-hidden="true" />;
}
