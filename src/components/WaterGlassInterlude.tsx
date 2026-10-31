import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { assetUrl } from '../utils/assetUrl';

gsap.registerPlugin(ScrollTrigger);

export function WaterGlassInterlude() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const causticRef = useRef<HTMLDivElement | null>(null);
  const captionRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      if (frameRef.current) {
        gsap.fromTo(
          frameRef.current,
          { y: 28, opacity: 0.88 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 86%',
            },
          }
        );
      }

      if (imgRef.current) {
        gsap.fromTo(
          imgRef.current,
          { scale: 1.07, yPercent: -3 },
          {
            scale: 1,
            yPercent: 3,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.6,
            },
          }
        );
      }

      if (causticRef.current) {
        gsap.fromTo(
          causticRef.current,
          { xPercent: -12, opacity: 0.32 },
          {
            xPercent: 14,
            opacity: 0.72,
            ease: 'sine.inOut',
            scrollTrigger: {
              trigger: section,
              start: 'top 85%',
              end: 'bottom 15%',
              scrub: 0.7,
            },
          }
        );
      }

      if (captionRef.current) {
        gsap.fromTo(
          captionRef.current,
          { y: 18, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.85,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: captionRef.current,
              start: 'top 88%',
            },
          }
        );
      }
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="glass-interlude"
      aria-label="Чистая артезианская вода в солнечном свете"
    >
      <div className="container glass-interlude__inner">
        <div ref={frameRef} className="glass-interlude__stage">
          <img
            ref={imgRef}
            src={assetUrl('assets/glass-sunlight.webp')}
            alt="Прозрачный стакан чистой артезианской воды на светлом известняке с солнечными бликами"
            width={1920}
            height={1072}
            loading="lazy"
            decoding="async"
            className="glass-interlude__img"
          />
          <div ref={causticRef} className="glass-interlude__sunbeam" aria-hidden="true" />
          <div className="glass-interlude__glint" aria-hidden="true" />
        </div>

        <div ref={captionRef} className="glass-interlude__caption">
          <p className="glass-interlude__quote">
            Мягкий природный вкус — от тишины глубинного горизонта до первого глотка в утреннем
            свете.
          </p>
        </div>
      </div>
    </section>
  );
}
