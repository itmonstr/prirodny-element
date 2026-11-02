import { MOTION_DURATION } from '../utils/motion';
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
          scrollTrigger: { trigger, start: 'top bottom', end: 'top 20%', scrub: MOTION_DURATION },
        });
      });
      gsap.fromTo('.bottling-cinema__stage', { opacity: 1 }, {
        opacity: 0,
        immediateRender: false,
        ease: 'sine.inOut',
        scrollTrigger: {
          trigger: '.bottling-cinema', start: 'bottom bottom', end: 'bottom 20%',
          scrub: MOTION_DURATION,
        },
      });
    });
    // On mobile, keep layout in clean native scroll flow without jarring translateY shifts or blinks
    return () => media.revert();
  }, []);
  return null;
}
