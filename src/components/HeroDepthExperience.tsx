import { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { WaterLightCanvas } from './WaterLightCanvas';
import { assetUrl } from '../utils/assetUrl';

gsap.registerPlugin(ScrollTrigger);

interface HeroDepthExperienceProps {
  onOrderClick: () => void;
  onDarkSceneChange: (isDark: boolean) => void;
}

const MINERAL_ROWS = [
  {
    symbol: 'M',
    name: 'Общая минерализация',
    unit: 'мг/л — по протоколу анализа',
  },
  {
    symbol: 'Ca',
    name: 'Кальций',
    unit: 'мг/л — по анализу',
  },
  {
    symbol: 'Mg',
    name: 'Магний',
    unit: 'мг/л — по анализу',
  },
  {
    symbol: 'Na',
    name: 'Натрий',
    unit: 'мг/л — по анализу',
  },
  {
    symbol: 'pH',
    name: 'Кислотно-щелочной баланс и HCO₃⁻',
    unit: 'по паспорту скважины',
  },
];

export function HeroDepthExperience({
  onOrderClick,
  onDarkSceneChange,
}: HeroDepthExperienceProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const deepBgRef = useRef<HTMLDivElement | null>(null);
  const heroCopyRef = useRef<HTMLDivElement | null>(null);
  const bottleWrapRef = useRef<HTMLDivElement | null>(null);
  const bottleImgRef = useRef<HTMLImageElement | null>(null);
  const bottleSheenRef = useRef<HTMLDivElement | null>(null);
  const sourceLeftRef = useRef<HTMLDivElement | null>(null);
  const sourceRightRef = useRef<HTMLDivElement | null>(null);
  const strataRef = useRef<HTMLDivElement | null>(null);
  const depthScaleRef = useRef<HTMLDivElement | null>(null);
  const depthFillRef = useRef<HTMLDivElement | null>(null);
  const mobileSourceRef = useRef<HTMLElement | null>(null);

  const depthProgressRef = useRef<number>(0);
  const [depthMeters, setDepthMeters] = useState<number>(0);
  const [heroInteractive, setHeroInteractive] = useState<boolean>(true);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const mm = gsap.matchMedia();

    mm.add(
      {
        isDesktop: '(min-width: 1024px)',
        isMobile: '(max-width: 1023px)',
        reduceMotion: '(prefers-reduced-motion: reduce)',
      },
      (context) => {
        const { isDesktop, reduceMotion } = context.conditions as {
          isDesktop: boolean;
          isMobile: boolean;
          reduceMotion: boolean;
        };

        // Initial gentle materialization of the Hero Bottle & Headline
        if (!reduceMotion && bottleImgRef.current) {
          gsap.fromTo(
            bottleImgRef.current,
            { opacity: 0, scale: 0.95, y: 26 },
            { opacity: 1, scale: 1, y: 0, duration: 1.35, ease: 'power3.out' }
          );
          if (bottleSheenRef.current) {
            gsap.fromTo(
              bottleSheenRef.current,
              { xPercent: -95, opacity: 0 },
              { xPercent: 95, opacity: 0.72, duration: 2.1, delay: 0.25, ease: 'power2.inOut' }
            );
          }
          if (heroCopyRef.current) {
            gsap.fromTo(
              heroCopyRef.current.children,
              { opacity: 0, y: 20 },
              {
                opacity: 1,
                y: 0,
                duration: 1.05,
                stagger: 0.1,
                delay: 0.15,
                ease: 'power3.out',
              }
            );
          }
        }

        if (isDesktop && !reduceMotion) {
          // Desktop continuous scroll-driven choreography (Scene 1 -> Scene 2)
          const startOffsetX = () => Math.min(window.innerWidth * 0.16, 224);

          gsap.set(bottleWrapRef.current, {
            xPercent: -50,
            yPercent: -50,
            x: startOffsetX(),
            y: 0,
            scale: 1,
          });
          gsap.set([sourceLeftRef.current, sourceRightRef.current], {
            opacity: 0,
            y: 36,
            pointerEvents: 'none',
          });
          gsap.set(deepBgRef.current, { opacity: 0 });
          gsap.set(strataRef.current, { opacity: 0, y: 40 });
          gsap.set(depthScaleRef.current, { opacity: 0 });

          const mineralItems = sourceRightRef.current?.querySelectorAll('.mineral-row') ?? [];
          gsap.set(mineralItems, { opacity: 0, y: 20 });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: root,
              start: 'top top',
              end: 'bottom bottom',
              scrub: 0.65,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                const p = self.progress;
                // Map scroll progress 0.06..0.56 -> 0..80 meters
                const normDepth = gsap.utils.clamp(0, 1, (p - 0.06) / 0.5);
                depthProgressRef.current = normDepth;
                const meters = Math.round(normDepth * 80);
                setDepthMeters(meters);
                setHeroInteractive(p < 0.24);
                onDarkSceneChange(p > 0.28 && p < 0.96);
              },
              onRefresh: (self) => {
                const p = self.progress;
                onDarkSceneChange(self.isActive && p > 0.28 && p < 0.96);
              },
              onLeave: () => {
                onDarkSceneChange(false);
              },
              onLeaveBack: () => {
                depthProgressRef.current = 0;
                setDepthMeters(0);
                setHeroInteractive(true);
                onDarkSceneChange(false);
              },
            },
          });

          // Phase 1 (0 -> 0.36): Hero copy recedes, environment dives into 80m artesian blue, bottle glides to dead center
          tl.to(
            heroCopyRef.current,
            { opacity: 0, y: -54, duration: 0.28, ease: 'power2.inOut' },
            0.02
          )
            .to(
              deepBgRef.current,
              { opacity: 1, duration: 0.38, ease: 'sine.inOut' },
              0.08
            )
            .to(
              depthScaleRef.current,
              { opacity: 1, duration: 0.2, ease: 'sine.out' },
              0.1
            )
            .to(
              depthFillRef.current,
              { scaleY: 1, duration: 0.5, ease: 'none' },
              0.06
            )
            .to(
              strataRef.current,
              { opacity: 1, y: 0, duration: 0.42, ease: 'power2.out' },
              0.16
            )
            .fromTo(
              bottleWrapRef.current,
              {
                x: () => startOffsetX(),
                y: 0,
                scale: 1,
              },
              {
                x: 0,
                y: 8,
                scale: 0.86,
                duration: 0.46,
                ease: 'power2.inOut',
              },
              0.06
            );

          if (bottleSheenRef.current) {
            tl.fromTo(
              bottleSheenRef.current,
              { xPercent: -85, opacity: 0.18 },
              { xPercent: 85, opacity: 0.55, duration: 0.5, ease: 'sine.inOut' },
              0.1
            );
          }

          // Phase 2 (0.36 -> 0.85): Reveal 80m narrative on left & mineral composition rows on right
          tl.to(
            sourceLeftRef.current,
            {
              opacity: 1,
              y: 0,
              pointerEvents: 'auto',
              duration: 0.26,
              ease: 'power2.out',
            },
            0.36
          )
            .to(
              sourceRightRef.current,
              {
                opacity: 1,
                y: 0,
                pointerEvents: 'auto',
                duration: 0.22,
                ease: 'power2.out',
              },
              0.4
            )
            .to(
              mineralItems,
              {
                opacity: 1,
                y: 0,
                duration: 0.24,
                stagger: 0.055,
                ease: 'power2.out',
              },
              0.43
            )
            // Hold calm composure so user reads comfortably (0.72 -> 1.0)
            .to(bottleWrapRef.current, { y: 0, duration: 0.25, ease: 'sine.inOut' }, 0.75);
        } else {
          // Mobile / Reduced-motion scroll tracking for dark header switching & smooth depth counter
          if (mobileSourceRef.current) {
            ScrollTrigger.create({
              trigger: mobileSourceRef.current,
              start: 'top 68px',
              end: 'bottom 56px',
              onToggle: (self) => onDarkSceneChange(self.isActive),
              onRefresh: (self) => onDarkSceneChange(self.isActive),
            });

            ScrollTrigger.create({
              trigger: mobileSourceRef.current,
              start: 'top 80%',
              end: 'bottom 20%',
              onUpdate: (self) => {
                const m = Math.min(80, Math.round(gsap.utils.clamp(0, 1, self.progress * 1.65) * 80));
                setDepthMeters(m);
              },
            });

            if (!reduceMotion) {
              const revealTargets = mobileSourceRef.current.querySelectorAll('.m-reveal');
              revealTargets.forEach((el) => {
                gsap.fromTo(
                  el,
                  { opacity: 0, y: 24 },
                  {
                    opacity: 1,
                    y: 0,
                    duration: 0.85,
                    ease: 'power2.out',
                    scrollTrigger: {
                      trigger: el,
                      start: 'top 88%',
                    },
                  }
                );
              });
            }
          }
        }
      },
      root
    );

    return () => mm.revert();
  }, [onDarkSceneChange]);

  const scrollToSource = () => {
    const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
    if (isDesktop && rootRef.current) {
      const rect = rootRef.current.getBoundingClientRect();
      const absTop = window.scrollY + rect.top;
      const targetScroll = absTop + rootRef.current.offsetHeight * 0.56;
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    } else if (mobileSourceRef.current) {
      mobileSourceRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div ref={rootRef} id="top" className="hero-depth-journey">
      {/* ==================== DESKTOP CONTINUOUS STICKY STAGE ==================== */}
      <div ref={stageRef} className="hero-depth-stage">
        {/* Sunlit Surface Canvas */}
        <WaterLightCanvas depthProgressRef={depthProgressRef} />

        {/* Deep 80m Artesian Aquifer Environment Layer */}
        <div ref={deepBgRef} className="hero-depth-stage__deep-bg" aria-hidden="true">
          <div ref={strataRef} className="aquifer-strata">
            <span className="aquifer-strata__line aquifer-strata__line--1" />
            <span className="aquifer-strata__line aquifer-strata__line--2" />
            <span className="aquifer-strata__line aquifer-strata__line--3" />
          </div>
        </div>

        {/* Bathymetric Vertical Depth Scale (0 m -> 80 m) */}
        <div ref={depthScaleRef} className="depth-scale" aria-hidden="true">
          <span className="depth-scale__mark">0 м</span>
          <div className="depth-scale__track">
            <div ref={depthFillRef} className="depth-scale__fill" />
          </div>
          <span className="depth-scale__live">{depthMeters} м</span>
        </div>

        <div className="hero-depth-stage__container">
          {/* SCENE 1 COPY: «Природа Крыма в каждой капле» */}
          <div
            ref={heroCopyRef}
            className="hero-copy"
            style={{ pointerEvents: heroInteractive ? 'auto' : 'none' }}
          >
            <h1 className="hero-copy__title">
              Природа Крыма
              <br />в каждой капле
            </h1>
            <p className="hero-copy__lead">
              Артезианская питьевая вода из собственного источника глубиной 80 метров, близ озера
              Богайлы.
            </p>
            <div className="hero-copy__actions">
              <button
                type="button"
                className="btn-pill btn-pill--primary"
                onClick={onOrderClick}
              >
                Заказать воду
              </button>
              <button
                type="button"
                className="btn-pill btn-pill--ghost"
                onClick={scrollToSource}
              >
                <span>Узнать о воде</span>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path
                    d="M7 1.75V12.25M7 12.25L2.75 8M7 12.25L11.25 8"
                    stroke="currentColor"
                    strokeWidth="1.25"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* CONTINUOUS PROTAGONIST: REAL «ПРИРОДНЫЙ ЭЛЕМЕНТ» BOTTLE */}
          <div ref={bottleWrapRef} className="hero-bottle-stage">
            <div className="hero-bottle-stage__glow" aria-hidden="true" />
            <div className="hero-bottle-stage__figure">
              <img
                ref={bottleImgRef}
                src={assetUrl('assets/bottle-hero.webp')}
                alt="Бутылка артезианской питьевой воды «Природный Элемент»"
                width={500}
                height={1850}
                fetchPriority="high"
                decoding="async"
                className="hero-bottle-stage__img"
              />
              {/* Specular sunlight refraction strictly masked to bottle silhouette */}
              <div
                className="hero-bottle-stage__sheen"
                style={{
                  WebkitMaskImage: `url(${assetUrl('assets/bottle-hero.webp')})`,
                  maskImage: `url(${assetUrl('assets/bottle-hero.webp')})`,
                }}
                aria-hidden="true"
              >
                <div ref={bottleSheenRef} className="hero-bottle-stage__sheen-beam" />
              </div>
            </div>
            <div className="hero-bottle-stage__shadow" aria-hidden="true" />

            {/* Mobile-only primary CTA + animated downward arrow */}
            <div className="hero-mobile-actions">
              <button
                type="button"
                className="btn-pill btn-pill--primary hero-mobile-actions__btn"
                onClick={onOrderClick}
              >
                Заказать воду
              </button>
              <button
                type="button"
                className="scroll-down-cue"
                onClick={scrollToSource}
                aria-label="Узнать о воде — прокрутить вниз"
              >
                <span className="scroll-down-cue__stem" />
                <svg
                  className="scroll-down-cue__arrow"
                  width="18"
                  height="10"
                  viewBox="0 0 18 10"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M1.5 1.5L9 8.5L16.5 1.5"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* SCENE 2 DESKTOP OVERLAY: «Источник глубиной 80 метров» */}
          <div ref={sourceLeftRef} className="source-panel source-panel--left">
            <div className="source-depth-figure" aria-label="Глубина скважины 80 метров">
              <span className="source-depth-figure__num">80</span>
              <span className="source-depth-figure__unit">метров</span>
            </div>
            <h2 className="source-panel__title">Источник глубиной 80 метров</h2>
            <p className="source-panel__text">
              Наш артезианский источник расположен в Сакском районе Крыма, близ озера Богайлы. Мы
              бережно относимся к качеству воды на каждом этапе производства.
            </p>
            <figure className="source-water-detail">
              <img
                src={assetUrl('assets/water-glass.webp')}
                alt="Чистая артезианская вода в стакане"
                width={1046}
                height={685}
                loading="lazy"
                decoding="async"
              />
            </figure>
          </div>

          <div ref={sourceRightRef} className="source-panel source-panel--right">
            <div className="mineral-table" role="region" aria-label="Показатели состава воды">
              {MINERAL_ROWS.map((row) => (
                <div key={row.symbol} className="mineral-row">
                  <div className="mineral-row__symbol">{row.symbol}</div>
                  <div className="mineral-row__meta">
                    <span className="mineral-row__name">{row.name}</span>
                    <span className="mineral-row__value">{row.unit}</span>
                  </div>
                </div>
              ))}
            </div>
            <p className="mineral-footnote">
              Точные числовые значения публикуются на основании протокола лабораторного анализа
              скважины.
            </p>
          </div>
        </div>
      </div>

      {/* Anchor target: positioned at 162vh on desktop, and right above Block 2 on mobile */}
      <div id="source" className="hero-depth-journey__source-anchor" aria-hidden="true" />

      {/* ==================== DEDICATED MOBILE & TABLET BLOCK 2 ==================== */}
      <section ref={mobileSourceRef} className="source-mobile-section" aria-labelledby="source-mobile-heading">
        <div className="source-mobile-section__inner">
          <div className="source-mobile-meter m-reveal" aria-hidden="true">
            <span className="source-mobile-meter__line" />
            <span className="source-mobile-meter__val">{depthMeters || 80} м</span>
          </div>

          <div className="source-depth-figure source-depth-figure--mobile m-reveal">
            <span className="source-depth-figure__num">80</span>
            <span className="source-depth-figure__unit">метров</span>
          </div>

          <h2 id="source-mobile-heading" className="source-mobile-section__title m-reveal">
            Источник глубиной 80 метров
          </h2>

          <p className="source-mobile-section__text m-reveal">
            Наш артезианский источник расположен в Сакском районе Крыма, близ озера Богайлы. Мы
            бережно относимся к качеству воды на каждом этапе производства.
          </p>

          <div className="source-mobile-visuals m-reveal">
            <div className="source-mobile-visuals__bottle">
              <img
                src={assetUrl('assets/bottle-hero.webp')}
                alt="Бутылка «Природный Элемент»"
                width={500}
                height={1850}
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="source-mobile-visuals__glass">
              <img
                src={assetUrl('assets/water-glass.webp')}
                alt="Прозрачная питьевая вода"
                width={1046}
                height={685}
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>

          <div className="mineral-table mineral-table--mobile m-reveal">
            {MINERAL_ROWS.map((row) => (
              <div key={row.symbol} className="mineral-row">
                <div className="mineral-row__symbol">{row.symbol}</div>
                <div className="mineral-row__meta">
                  <span className="mineral-row__name">{row.name}</span>
                  <span className="mineral-row__value">{row.unit}</span>
                </div>
              </div>
            ))}
          </div>

          <p className="mineral-footnote m-reveal">
            Точные числовые значения публикуются на основании протокола лабораторного анализа
            скважины.
          </p>
        </div>
      </section>
    </div>
  );
}
