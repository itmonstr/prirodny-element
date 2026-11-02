import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function SceneTransitions() {
  useLayoutEffect(() => {
    const media = gsap.matchMedia();
    media.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
      const scenes = [
        ['.history-story__journey', '.history-story__stage'],
        ['.bottling-cinema', '.bottling-cinema__stage'],
        ['.finale-footer-wrap', '.finale-footer-wrap'],
      ];
      scenes.forEach(([trigger, target]) => {
        gsap.fromTo(target, { opacity: 0 }, {
          opacity: 1,
          ease: 'sine.inOut',
          scrollTrigger: { trigger, start: 'top bottom', end: 'top 20%', scrub: 0.6 },
        });
      });
      gsap.fromTo('.bottling-cinema__stage', { opacity: 1 }, {
        opacity: 0,
        immediateRender: false,
        ease: 'sine.inOut',
        scrollTrigger: {
          trigger: '.bottling-cinema', start: 'bottom bottom', end: 'bottom 20%',
          scrub: 0.6,
        },
      });
    });
    media.add('(max-width: 1023px) and (prefers-reduced-motion: no-preference)', () => {
      const scenes = [
        ['.history-story__coast', '.history-story__coast'],
        ['.history-story__production', '.history-story__production'],
        ['.bottling-cinema__layer--conveyor', '.bottling-cinema__layer--conveyor'],
        ['.bottling-cinema__layer--factory', '.bottling-cinema__layer--factory'],
        ['.buy-section', '.buy-section__inner'],
        ['.finale-footer-wrap', '.finale-section'],
      ];
      scenes.forEach(([trigger, target]) => {
        gsap.fromTo(target, { opacity: 0.35 }, {
          opacity: 1, ease: 'sine.inOut',
          scrollTrigger: { trigger, start: 'top bottom', end: 'top 52%', scrub: 0.35 },
        });
      });
    });
    return () => media.revert();
  }, []);
  return null;
}
