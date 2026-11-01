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
  const aquiferRaysRef = useRef<HTMLDivElement | null>(null);
  const heroCopyRef = useRef<HTMLDivElement | null>(null);
  const bottleWrapRef = useRef<HTMLDivElement | null>(null);
  const bottleImgRef = useRef<HTMLImageElement | null>(null);
  const bottleSheenRef = useRef<HTMLDivElement | null>(null);
  const sourceLeftRef = useRef<HTMLDivElement | null>(null);
  const sourceRightRef = useRef<HTMLDivElement | null>(null);
  const strataRef = useRef<HTMLDivElement | null>(null);
  const depthScaleRef = useRef<HTMLDivElement | null>(null);
  const depthFillRef = useRef<HTMLDivElement | null>(null);
  const heroMobileActionsRef = useRef<HTMLDivElement | null>(null);

  const depthProgressRef = useRef<number>(0);
  const [depthMeters, setDepthMeters] = useState<number>(0);
  const isDesktopRef = useRef<boolean>(true);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const mm = gsap.matchMedia();

    mm.add(
      {
        isDesktop: '(min-width: 1024px)',
        isMobile: '(max-width: 1023px)',
        isShortPhone: '(max-width: 680px) and (max-height: 700px)',
        isCompactLandscape: '(max-width: 1023px) and (max-height: 500px) and (orientation: landscape)',
        reduceMotion: '(prefers-reduced-motion: reduce)',
      },
      (context) => {
        const { isDesktop, isShortPhone, isCompactLandscape, reduceMotion } = context.conditions as {
          isDesktop: boolean;
          isMobile: boolean;
          isShortPhone: boolean;
          isCompactLandscape: boolean;
          reduceMotion: boolean;
        };

        // Initial gentle materialization of the Hero Bottle & Headline
        if (!reduceMotion && bottleImgRef.current) {
          gsap.fromTo(
            bottleImgRef.current,
            { opacity: 0, scale: 0.95, y: 24 },
            { opacity: 1, scale: 1, y: 0, duration: 1.3, ease: 'power3.out' }
          );
          if (bottleSheenRef.current) {
            gsap.fromTo(
              bottleSheenRef.current,
              { xPercent: -95, opacity: 0 },
              { xPercent: 95, opacity: 0.72, duration: 2.0, delay: 0.22, ease: 'power2.inOut' }
            );
          }
          if (heroCopyRef.current) {
            gsap.fromTo(
              heroCopyRef.current.children,
              { opacity: 0, y: 18 },
              {
                opacity: 1,
                y: 0,
                duration: 1.0,
                stagger: 0.09,
                delay: 0.14,
                ease: 'power3.out',
              }
            );
          }
        }

        isDesktopRef.current = isDesktop;
        if (!reduceMotion) {
          // Optimized continuous choreography on desktop and mobile:
          // In Hero: Title & lead text + bottle. As you scroll, title fades out,
          // background deepens to deep 80m artesian aquifer, depth scale fills (0 -> 80m),
          // bottle stays as the central protagonist and transitions smoothly.

          const startOffsetX = () => (isDesktop ? Math.min(window.innerWidth * 0.16, 224) : 0);
          const startOffsetY = () => (isDesktop || isCompactLandscape ? 0 : 108);
          const endOffsetY = () => (isDesktop ? 6 : isCompactLandscape ? 4 : 116);
          const endScale = () => (isDesktop ? 0.87 : 0.84);

          gsap.set(bottleWrapRef.current, {
            xPercent: -50,
            yPercent: -50,
            x: startOffsetX(),
            y: startOffsetY(),
            scale: 1,
            opacity: 1,
          });
          gsap.set([sourceLeftRef.current, sourceRightRef.current], {
            opacity: 0,
            y: 30,
            pointerEvents: 'none',
          });
          gsap.set(deepBgRef.current, { opacity: 0 });
          gsap.set(aquiferRaysRef.current, { opacity: 0, xPercent: -4 });
          gsap.set(strataRef.current, { opacity: 0, y: 32 });
          gsap.set(depthScaleRef.current, { opacity: 0 });
          if (heroMobileActionsRef.current) {
            gsap.set(heroMobileActionsRef.current, { opacity: 1, y: 0 });
          }

          const mineralItems = sourceRightRef.current?.querySelectorAll('.mineral-row') ?? [];
          gsap.set(mineralItems, { opacity: 0, y: 18 });

          // Dedicated dark-header observer: stays dark from 80m transition until the sticky stage & top decompression gradient clear the header
          ScrollTrigger.create({
            trigger: root,
            start: () => `top -${Math.round(window.innerHeight * 0.25)}`,
            end: 'bottom -24px',
            invalidateOnRefresh: true,
            onToggle: (self) => onDarkSceneChange(self.isActive),
            onRefresh: (self) => onDarkSceneChange(self.isActive),
          });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: root,
              start: 'top top',
              end: 'bottom bottom',
              scrub: 0.8,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                const p = self.progress;
                // On desktop: 0..0.54 maps to 0..80 meters
                // On mobile: 0..0.38 maps to 0..80 meters so gauge completes right as 80m title arrives
                const depthRange = isDesktop ? 0.54 : 0.38;
                const normDepth = gsap.utils.clamp(0, 1, (p - 0.03) / depthRange);
                depthProgressRef.current = normDepth;
                const meters = Math.round(normDepth * 80);
                setDepthMeters(meters);
                if (heroCopyRef.current) {
                  heroCopyRef.current.style.pointerEvents = p < 0.14 ? 'auto' : 'none';
                }
                if (heroMobileActionsRef.current) {
                  heroMobileActionsRef.current.style.pointerEvents = p < 0.14 ? 'auto' : 'none';
                }
              },
              onLeaveBack: () => {
                depthProgressRef.current = 0;
                setDepthMeters(0);
                if (heroCopyRef.current) {
                  heroCopyRef.current.style.pointerEvents = 'auto';
                }
                if (heroMobileActionsRef.current) {
                  heroMobileActionsRef.current.style.pointerEvents = 'auto';
                  gsap.to(heroMobileActionsRef.current, { opacity: 1, y: 0, duration: 0.2 });
                }
              },
            },
          });

          if (isDesktop) {
            // ==================== DESKTOP CHOREOGRAPHY ====================
            tl.to(
              heroCopyRef.current,
              { opacity: 0, y: -46, duration: 0.28, ease: 'power2.inOut' },
              0.01
            )
              .to(
                deepBgRef.current,
                { opacity: 1, duration: 0.38, ease: 'sine.inOut' },
                0.05
              )
              .to(
                aquiferRaysRef.current,
                { opacity: 1, xPercent: 3, duration: 0.55, ease: 'sine.out' },
                0.08
              )
              .to(
                depthScaleRef.current,
                { opacity: 1, duration: 0.22, ease: 'sine.out' },
                0.07
              )
              .to(
                depthFillRef.current,
                { scaleY: 1, duration: 0.54, ease: 'none' },
                0.04
              )
              .to(
                strataRef.current,
                { opacity: 1, y: 0, duration: 0.44, ease: 'power2.out' },
                0.12
              )
              .fromTo(
                bottleWrapRef.current,
                {
                  x: () => startOffsetX(),
                  y: () => startOffsetY(),
                  scale: 1,
                },
                {
                  x: 0,
                  y: () => endOffsetY(),
                  scale: () => endScale(),
                  duration: 0.46,
                  ease: 'power2.inOut',
                },
                0.04
              );

            if (bottleSheenRef.current) {
              tl.fromTo(
                bottleSheenRef.current,
                { xPercent: -85, opacity: 0.18 },
                { xPercent: 85, opacity: 0.58, duration: 0.54, ease: 'sine.inOut' },
                0.08
              );
            }

            tl.to(
              sourceLeftRef.current,
              {
                opacity: 1,
                y: 0,
                pointerEvents: 'auto',
                duration: 0.28,
                ease: 'power2.out',
              },
              0.25
            )
              .to(
                sourceRightRef.current,
                {
                  opacity: 1,
                  y: 0,
                  pointerEvents: 'auto',
                  duration: 0.24,
                  ease: 'power2.out',
                },
                0.3
              )
              .to(
                mineralItems,
                {
                  opacity: 1,
                  y: 0,
                  duration: 0.25,
                  stagger: 0.055,
                  ease: 'power2.out',
                },
                0.33
              )
              .to(
                bottleWrapRef.current,
                { y: () => endOffsetY() - 6, duration: 0.28, ease: 'sine.inOut' },
                0.72
              )
              .to(
                aquiferRaysRef.current,
                { xPercent: 7, opacity: 0.72, duration: 0.28, ease: 'none' },
                0.72
              )
              .to(
                strataRef.current,
                { y: -14, duration: 0.28, ease: 'none' },
                0.72
              );
          } else {
            // ==================== MOBILE & TABLET SEQUENTIAL CHOREOGRAPHY ====================
            // Step 1 (0 -> 0.38): Hero fades out, depth meter fills, aquifer background activates, bottle settles
            tl.to(
              heroCopyRef.current,
              { opacity: 0, y: -24, duration: 0.14, ease: 'power2.inOut' },
              0.01
            )
              .to(
                heroMobileActionsRef.current,
                { opacity: 0, y: 12, duration: 0.10, ease: 'power2.out' },
                0.01
              )
              .to(
                deepBgRef.current,
                { opacity: 1, duration: 0.28, ease: 'sine.inOut' },
                0.03
              )
              .to(
                aquiferRaysRef.current,
                { opacity: 1, xPercent: 3, duration: 0.40, ease: 'sine.out' },
                0.05
              )
              .to(
                depthScaleRef.current,
                { opacity: 1, duration: 0.16, ease: 'sine.out' },
                0.04
              )
              .to(
                depthFillRef.current,
                { scaleY: 1, duration: 0.36, ease: 'none' },
                0.03
              )
              .to(
                strataRef.current,
                { opacity: 1, y: 0, duration: 0.32, ease: 'power2.out' },
                0.06
              )
              .fromTo(
                bottleWrapRef.current,
                {
                  x: 0,
                  y: () => startOffsetY(),
                  scale: 1,
                },
                {
                  x: 0,
                  y: () => endOffsetY(),
                  scale: () => endScale(),
                  duration: 0.32,
                  ease: 'power2.inOut',
                },
                0.02
              );

            if (bottleSheenRef.current) {
              tl.fromTo(
                bottleSheenRef.current,
                { xPercent: -85, opacity: 0.18 },
                { xPercent: 85, opacity: 0.58, duration: 0.38, ease: 'sine.inOut' },
                0.05
              );
            }

            // A short phone cannot fit the bottle beside the source copy and mineral table.
            // Let the bottle leave before either text panel appears, then return for the handoff.
            if (isShortPhone) {
              tl.to(bottleWrapRef.current, { opacity: 0, duration: 0.08, ease: 'power1.out' }, 0.08);
            }

            // Step 2 (0.16 -> 0.44): 80m source narrative beat
            tl.to(
              sourceLeftRef.current,
              {
                opacity: 1,
                y: 0,
                pointerEvents: 'auto',
                duration: 0.18,
                ease: 'power2.out',
              },
              0.16
            )
              // Step 3 (0.44 -> 0.50): 80m narrative cleanly fades out completely before minerals enter
              .to(
                sourceLeftRef.current,
                {
                  opacity: 0,
                  y: -16,
                  pointerEvents: 'none',
                  duration: 0.13,
                  ease: 'sine.inOut',
                },
                0.44
              )
              // Make room for the minerals card: depth gauge steps aside, bottle sinks lower & recedes
              .to(
                depthScaleRef.current,
                { opacity: 0, duration: 0.11, ease: 'sine.inOut' },
                0.45
              )
              .to(
                bottleWrapRef.current,
                {
                  y: () => endOffsetY() + Math.round(window.innerHeight * 0.17),
                  scale: 0.66,
                  opacity: isShortPhone ? 0 : 0.55,
                  duration: 0.15,
                  ease: 'sine.inOut',
                },
                0.44
              )
              // Step 4 (0.51 -> 0.78): Mineral composition table reveals with all 5 rows crisp and legible
              .to(
                sourceRightRef.current,
                {
                  opacity: 1,
                  y: 0,
                  pointerEvents: 'auto',
                  duration: 0.14,
                  ease: 'power2.out',
                },
                0.51
              )
              .to(
                mineralItems,
                {
                  opacity: 1,
                  y: 0,
                  duration: 0.12,
                  stagger: 0.015,
                  ease: 'power2.out',
                },
                0.52
              )
              // Step 5 (0.78 -> 0.86): Minerals fade out smoothly into interlude
              .to(
                sourceRightRef.current,
                {
                  opacity: 0,
                  y: -16,
                  pointerEvents: 'none',
                  duration: 0.13,
                  ease: 'sine.inOut',
                },
                0.78
              )
              // Final hold and ambient drift before transition into the sunlit glass interlude
              .to(
                aquiferRaysRef.current,
                { xPercent: 6, duration: 0.16, ease: 'none' },
                0.84
              )
              .to(
                bottleWrapRef.current,
                {
                  y: () => endOffsetY() + 8,
                  scale: () => endScale(),
                  opacity: 1,
                  duration: 0.12,
                  ease: 'sine.inOut',
                },
                0.84
              )
              .to(
                depthScaleRef.current,
                { opacity: 1, duration: 0.08, ease: 'sine.out' },
                0.86
              );
          }
          tl.to(
            [depthScaleRef.current, sourceLeftRef.current, sourceRightRef.current],
            { opacity: 0, duration: 0.12, ease: 'sine.inOut' },
            0.92
          );
        } else {
          // Reduced motion fallback
          setDepthMeters(80);
          depthProgressRef.current = 1;
        }
      },
      root
    );

    return () => mm.revert();
  }, [onDarkSceneChange]);

  const scrollToSource = () => {
    if (rootRef.current) {
      const rect = rootRef.current.getBoundingClientRect();
      const absTop = window.scrollY + rect.top;
      const targetScroll = absTop + (rootRef.current.offsetHeight - window.innerHeight) * 0.82;
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    }
  };

  return (
    <div ref={rootRef} id="top" className="hero-depth-journey">
      {/* ==================== UNIFIED CONTINUOUS STICKY STAGE (DESKTOP & MOBILE) ==================== */}
      <div ref={stageRef} className="hero-depth-stage">
        {/* Sunlit Surface Canvas */}
        <WaterLightCanvas depthProgressRef={depthProgressRef} />

        {/* Deep 80m Artesian Aquifer Environment Layer */}
        <div ref={deepBgRef} className="hero-depth-stage__deep-bg" aria-hidden="true">
          <div ref={aquiferRaysRef} className="aquifer-rays" />
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
            <span className="depth-scale__tick depth-scale__tick--25" />
            <span className="depth-scale__tick depth-scale__tick--50" />
            <span className="depth-scale__tick depth-scale__tick--75" />
          </div>
          <span className="depth-scale__live">{depthMeters} м</span>
        </div>

        <div className="hero-depth-stage__container">
          {/* SCENE 1 COPY: «Природа Крыма в каждой капле» */}
          <div ref={heroCopyRef} className="hero-copy">
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

            {/* Mobile-only cue arrow */}
            <div ref={heroMobileActionsRef} className="hero-mobile-actions">
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

          {/* SCENE 2: «Источник глубиной 80 метров» */}
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
            <div className="source-origin-coords">
              <span className="source-origin-coords__line" aria-hidden="true" />
              <span>Сакский район · оз. Богайлы · с. Фрунзе</span>
            </div>
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

      {/* Anchor target */}
      <div id="source" className="hero-depth-journey__source-anchor" aria-hidden="true" />
    </div>
  );
}
