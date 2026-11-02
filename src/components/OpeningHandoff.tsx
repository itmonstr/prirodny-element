import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/** A full-viewport dissolve masks the moving seam between the opening scenes. */
export function OpeningHandoff() {
  const overlay = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const host = overlay.current;
    const source = document.querySelector('.depth-water-scene');
    if (!host || !source) return;
    const mobile = matchMedia('(max-width: 1023px)').matches;
    const water = source.cloneNode(true) as HTMLElement;
    let outgoing: HTMLElement | null = null;
    const captureOutgoing = () => {
      outgoing?.remove();
      if (mobile) {
        outgoing = document.createElement('div');
        outgoing.className = 'opening-handoff__mobile-base';
        host.prepend(outgoing);
        return;
      }
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
    if (mobile) gsap.set(water, { opacity: 0 });
    const fade = gsap.quickTo(water, 'opacity', { duration: 0.35, ease: 'sine.out' });
    const hide = () => { host.style.opacity = '0'; host.style.visibility = 'hidden'; };
    let advancing = false;
    let advance: gsap.core.Tween | null = null;
    let entranceFade: gsap.core.Tween | null = null;
    const advanceOnce = () => {
      captureOutgoing();
      const section = document.querySelector<HTMLElement>('.depth-to-light-section');
      if (!section) return;
      advancing = true;
      fade.tween.pause();
      host.style.visibility = 'visible';
      host.style.opacity = '1';
      gsap.set(water, { opacity: 0 });
      entranceFade?.kill();
      entranceFade = gsap.to(water, { opacity: 1, duration: 0.45, ease: 'sine.inOut' });
      const position = { y: window.scrollY };
      const destination = section.getBoundingClientRect().top + window.scrollY
        + Math.max(0, section.offsetHeight - window.innerHeight) * 0.15;
      advance?.kill();
      advance = gsap.to(position, {
        y: destination, duration: 0.55, ease: 'sine.inOut',
        onUpdate: () => window.scrollTo({ top: position.y, behavior: 'instant' }),
        onComplete: () => { advancing = false; hide(); },
      });
    };
    const trigger = ScrollTrigger.create({
      trigger: '.depth-to-light-section',
      start: 'top bottom',
      end: 'top top',
      onUpdate: (self) => {
        if (advancing) return;
        if (!self.isActive) { hide(); return; }
        const progress = Math.min(1, self.progress / (mobile ? 0.4 : 0.85));
        if (!outgoing) captureOutgoing();
        host.style.visibility = 'visible';
        host.style.opacity = '1';
        if (mobile) fade(progress * progress * (3 - 2 * progress));
        else water.style.opacity = String(progress * progress * (3 - 2 * progress));
      },
      onEnter: () => { if (mobile) captureOutgoing(); else advanceOnce(); },
      onEnterBack: captureOutgoing,
      onLeave: hide,
      onLeaveBack: hide,
    });
    return () => { trigger.kill(); advance?.kill(); entranceFade?.kill(); fade.tween.kill(); water.remove(); outgoing?.remove(); };
  }, []);
  return <div ref={overlay} className="opening-handoff" aria-hidden="true" />;
}
