import { MOTION_DURATION } from '../utils/motion';
import { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { OrderSelection, VolumeFormat, WaterType } from '../types';
import { assetUrl } from '../utils/assetUrl';

gsap.registerPlugin(ScrollTrigger);

interface DepthToLightTransitionProps {
  onDarkSceneChange?: (isDark: boolean) => void;
  onOrderFormat?: (selection: OrderSelection) => void;
}

interface BottleFormatMeta {
  volumeKey: VolumeFormat;
  volume: string;
  tagline: string;
  detail: string;
  sparklingSrc: string;
  stillSrc: string;
  width: number;
  height: number;
  alt: string;
  modClass: string;
}

const BOTTLES: BottleFormatMeta[] = [
  {
    volumeKey: '0.5',
    volume: '0,5 л',
    tagline: 'Всегда с собой',
    detail: 'Для динамичного дня, тренировок, встреч и автомобиля',
    sparklingSrc: assetUrl('assets/bottle-05-sparkling.webp'),
    stillSrc: assetUrl('assets/bottle-05-still.webp'),
    width: 233,
    height: 740,
    alt: 'Бутылка артезианской воды «Природный Элемент» 0,5 л',
    modClass: 'depth-bottle-card--05',
  },
  {
    volumeKey: '1.5',
    volume: '1,5 л',
    tagline: 'Для дома и отдыха',
    detail: 'Семейный объём для дома, загородного отдыха и путешествий',
    sparklingSrc: assetUrl('assets/bottle-15-sparkling.webp'),
    stillSrc: assetUrl('assets/bottle-15-still.webp'),
    width: 302,
    height: 914,
    alt: 'Бутылка артезианской воды «Природный Элемент» 1,5 л',
    modClass: 'depth-bottle-card--15',
  },
];

export function DepthToLightTransition({
  onDarkSceneChange,
  onOrderFormat,
}: DepthToLightTransitionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const waterWrapRef = useRef<HTMLDivElement | null>(null);
  const waterImgRef = useRef<HTMLImageElement | null>(null);
  const waterRaysRef = useRef<HTMLDivElement | null>(null);
  const causticsRef = useRef<HTMLDivElement | null>(null);
  const bubblesRef = useRef<HTMLDivElement | null>(null);
  const introRef = useRef<HTMLDivElement | null>(null);
  const introLinesRef = useRef<(HTMLSpanElement | null)[]>([]);
  const introLeadRef = useRef<HTMLParagraphElement | null>(null);
  const bloomRef = useRef<HTMLDivElement | null>(null);
  const daylightBgRef = useRef<HTMLDivElement | null>(null);
  const bottlesHeaderRef = useRef<HTMLDivElement | null>(null);
  const bottleCardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const outroCueRef = useRef<HTMLDivElement | null>(null);

  const [waterType, setWaterType] = useState<WaterType>('sparkling');

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

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

        if (reduceMotion) {
          if (introRef.current) introRef.current.style.display = 'none';
          if (bloomRef.current) bloomRef.current.style.opacity = '0';
          if (daylightBgRef.current) daylightBgRef.current.style.opacity = '1';
          if (bottlesHeaderRef.current) {
            gsap.set(bottlesHeaderRef.current, { opacity: 1, y: 0 });
          }
          bottleCardsRef.current.forEach((card) => {
            if (card) gsap.set(card, { opacity: 1, y: 0, scale: 1 });
          });
          onDarkSceneChange?.(false);
          return;
        }

        // Header theme observer: Dark header while camera is in deep water (< 40% scroll),
        // switches to clean light theme as daylight floods the screen.
        ScrollTrigger.create({
          trigger: section,
          start: 'top top',
          end: 'bottom bottom',
          onUpdate: (self) => {
            const isDarkPart = self.progress < (isDesktop ? 0.35 : 0.28);
            onDarkSceneChange?.(self.isActive && isDarkPart);
          },
          onLeave: () => onDarkSceneChange?.(false),
          onLeaveBack: () => onDarkSceneChange?.(false),
        });

        // Initial setup
        gsap.set(waterImgRef.current, {
          scale: 1.08,
          yPercent: isDesktop ? 6 : 4,
          transformOrigin: '50% 20%',
        });
        gsap.set(waterRaysRef.current, { opacity: 0.55, scale: 1 });
        gsap.set(causticsRef.current, { opacity: 0.35 });
        gsap.set(bubblesRef.current, { opacity: 0.45, y: 0 });
        gsap.set(introRef.current, { opacity: 0, y: 12 });
        gsap.set(introLinesRef.current, { opacity: 1, y: 0 });
        gsap.set(introLeadRef.current, { opacity: 1, y: 0 });
        gsap.set(bloomRef.current, { opacity: 0, scale: 0.92 });
        gsap.set(daylightBgRef.current, { opacity: 0 });
        gsap.set(bottlesHeaderRef.current, { opacity: 0, y: 24 });
        gsap.set(outroCueRef.current, { opacity: 0, y: 12 });

        bottleCardsRef.current.forEach((card) => {
          if (!card) return;
          gsap.set(card, {
            opacity: 0,
            y: isDesktop ? 48 : 36,
            scale: 0.94,
          });
        });

        // A single gesture starts the complete formats reveal; no extra scrub phases.
        const formats = [bottlesHeaderRef.current, ...bottleCardsRef.current, outroCueRef.current];
        const reveal = gsap.timeline({ paused: true, defaults: { duration: MOTION_DURATION, ease: 'sine.inOut' } })
          .fromTo(introRef.current, { opacity: 1, y: 0 }, { opacity: 0, y: -12, immediateRender: false }, 0)
          .fromTo(daylightBgRef.current, { opacity: 0 }, { opacity: 1, immediateRender: false }, 0)
          .fromTo(formats, { opacity: 0, y: 16, scale: 1 }, {
            opacity: 1, y: 0, scale: 1, immediateRender: false,
          }, 0);
        let showingFormats = false;
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section, start: 'top top', end: 'bottom bottom',
            scrub: MOTION_DURATION,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const shown = self.progress >= (isDesktop ? 0.35 : 0.28);
              if (shown === showingFormats) return;
              showingFormats = shown;
              if (shown) reveal.play(); else reveal.reverse();
            },
          },
        });
        gsap.set(bottleCardsRef.current, { scale: 1 });
        if (isDesktop) {
          tl.to(introRef.current, { opacity: 1, y: 0, duration: 0.22, ease: 'sine.out' }, 0);
        } else {
          gsap.set(introRef.current, { opacity: 1, y: 0 });
        }
        tl.to(bubblesRef.current, { y: -65, opacity: 0.75, duration: 0.4, ease: 'sine.out' }, 0)
          .to({}, { duration: 0.6 }, 0.4);

      },
      section
    );

    return () => mm.revert();
  }, [onDarkSceneChange]);

  return (
    <section
      ref={sectionRef}
      id="formats"
      className="depth-to-light-section"
      aria-label="Из глубины к свету: форматы артезианской воды Природный Элемент"
    >
      <div ref={stageRef} className="depth-to-light-stage">
        {/* ================= 1. DEEP WATER & ASCENT BACKGROUND ================= */}
        <div ref={waterWrapRef} className="depth-water-scene" aria-hidden="true">
          <img
            ref={waterImgRef}
            src={assetUrl('assets/surface-sunlight-hd.webp')}
            alt=""
            width={1672}
            height={940}
            loading="eager"
            decoding="async"
            className="depth-water-img"
          />

          {/* Dynamic Sunbeam God-Rays */}
          <div ref={waterRaysRef} className="depth-water-rays">
            <span className="depth-ray depth-ray--1" />
            <span className="depth-ray depth-ray--2" />
            <span className="depth-ray depth-ray--3" />
            <span className="depth-ray depth-ray--4" />
          </div>

          {/* Aquatic Caustic Refraction Shimmer */}
          <div ref={causticsRef} className="depth-water-caustics" />

          {/* Ambient Micro-Bubbles Floating Upwards */}
          <div ref={bubblesRef} className="depth-water-bubbles">
            {Array.from({ length: 20 }, (_, index) => (
              <span key={index} className={`depth-bubble depth-bubble--${(index % 10) + 1}`} />
            ))}
          </div>

          {/* Deep Navy Gradient Vignette for 100% seamless joint with 80m aquifer */}
          <div className="depth-water-vignette" />
        </div>

        {/* ================= 2. INTRO EDITORIAL BEAT («Из глубины к свету») ================= */}
        <div ref={introRef} className="depth-intro">
          <div className="container depth-intro__inner">
            <span className="depth-intro__badge">Из глубины к свету</span>
            <h2 className="depth-intro__title">
              <span
                ref={(el) => {
                  introLinesRef.current[0] = el;
                }}
                className="depth-intro__line"
              >
                Рождённая на глубине 80 метров,
              </span>
              <span
                ref={(el) => {
                  introLinesRef.current[1] = el;
                }}
                className="depth-intro__line"
              >
                вода поднимается навстречу солнцу
              </span>
            </h2>
            <p ref={introLeadRef} className="depth-intro__lead">
              Кристальная чистота крымского источника раскрывается в прозрачном утреннем свете.
            </p>
          </div>
        </div>

        {/* ================= 3. SOLAR BLOOM & DAYLIGHT FLOOD ================= */}
        <div ref={bloomRef} className="depth-light-bloom" aria-hidden="true" />
        <div ref={daylightBgRef} className="depth-daylight-bg" aria-hidden="true">
          <div className="depth-daylight-caustic-drift" />
        </div>

        {/* ================= 4. THE 2 REAL BOTTLES MATERIALIZATION (0.5L & 1.5L) ================= */}
        <div className="container depth-bottles-container">
          <div ref={bottlesHeaderRef} className="depth-bottles-header">
            <span className="depth-bottles-subtitle">Природный Элемент</span>
            <h3 className="depth-bottles-title">Два гармоничных формата</h3>
            <p className="depth-bottles-lead">
              Чистейшая артезианская вода в двух удобных объёмах — в наличии газированная и негазированная.
            </p>

            {/* Interactive Sparkling / Still Water Switcher */}
            <div className="water-type-switch depth-water-switch" role="group" aria-label="Тип воды">
              <button
                type="button"
                className={`water-type-switch__btn ${waterType === 'sparkling' ? 'is-active' : ''}`}
                onClick={() => setWaterType('sparkling')}
              >
                <span className="water-type-switch__dot water-type-switch__dot--sparkling" />
                Газированная
              </button>
              <button
                type="button"
                className={`water-type-switch__btn ${waterType === 'still' ? 'is-active' : ''}`}
                onClick={() => setWaterType('still')}
              >
                <span className="water-type-switch__dot water-type-switch__dot--still" />
                Негазированная
              </button>
            </div>
          </div>

          <div className="depth-bottles-vitrine">
            {BOTTLES.map((item, idx) => {
              const currentSrc = waterType === 'sparkling' ? item.sparklingSrc : item.stillSrc;
              return (
                <div
                  key={item.volumeKey}
                  ref={(el) => {
                    bottleCardsRef.current[idx] = el;
                  }}
                  className={`depth-bottle-card ${item.modClass}`}
                >
                  <div className="depth-bottle-card__pedestal">
                    {/* Subtle caustic refraction behind bottle */}
                    <div className="depth-bottle-card__aura" aria-hidden="true" />

                    <img
                      src={currentSrc}
                      alt={`${item.alt} (${waterType === 'sparkling' ? 'газированная' : 'негазированная'})`}
                      width={item.width}
                      height={item.height}
                      loading="lazy"
                      decoding="async"
                      className="depth-bottle-card__img"
                    />

                    {/* Specular sheen over PET bottle body */}
                    <div
                      className="depth-bottle-card__sheen"
                      style={{
                        WebkitMaskImage: `url(${currentSrc})`,
                        maskImage: `url(${currentSrc})`,
                      }}
                      aria-hidden="true"
                    >
                      <span className="depth-bottle-card__sheen-beam" />
                    </div>

                    {/* Realistic diffuse soft shadow & contact plane */}
                    <div className="depth-bottle-card__shadows" aria-hidden="true">
                      <span className="depth-bottle-card__shadow-cast" />
                      <span className="depth-bottle-card__shadow-contact" />
                    </div>
                  </div>

                  <div className="depth-bottle-card__meta">
                    <span className="depth-bottle-card__vol">{item.volume}</span>
                    <span className="depth-bottle-card__tagline">{item.tagline}</span>

                    {/* Clear "Газ / Негаз" Badges and Selector */}
                    <div className="depth-bottle-card__types" aria-label="Доступные варианты">
                      <button
                        type="button"
                        className={`depth-type-pill ${waterType === 'sparkling' ? 'is-active' : ''}`}
                        onClick={() => setWaterType('sparkling')}
                        title="Выбрать газированную воду"
                      >
                        Газ
                      </button>
                      <span className="depth-type-pill-divider">•</span>
                      <button
                        type="button"
                        className={`depth-type-pill ${waterType === 'still' ? 'is-active' : ''}`}
                        onClick={() => setWaterType('still')}
                        title="Выбрать негазированную воду"
                      >
                        Негаз
                      </button>
                    </div>

                    <span className="depth-bottle-card__detail">{item.detail}</span>

                    <button
                      type="button"
                      className="btn-pill btn-pill--primary depth-bottle-card__order-btn"
                      onClick={() =>
                        onOrderFormat?.({
                          volume: item.volumeKey,
                          waterType,
                        })
                      }
                      aria-label={`Заказать ${item.volume} (${waterType === 'sparkling' ? 'газированная' : 'негазированная'})`}
                    >
                      Заказать {item.volume}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ================= 5. SEAMLESS OUTRO TO NEXT SECTION ================= */}
          <div ref={outroCueRef} className="depth-outro-cue">
            <a href="#history" className="depth-outro-cue__btn" aria-label="Перейти к истории бренда">
              <span>История создания</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path
                  d="M8 2.5V13.5M8 13.5L3.5 9M8 13.5L12.5 9"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
