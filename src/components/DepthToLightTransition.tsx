import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { assetUrl } from '../utils/assetUrl';

gsap.registerPlugin(ScrollTrigger);

interface DepthToLightTransitionProps {
  onDarkSceneChange?: (isDark: boolean) => void;
}

interface BottleMeta {
  volume: string;
  tagline: string;
  detail: string;
  src: string;
  width: number;
  height: number;
  alt: string;
  modClass: string;
}

const BOTTLES: BottleMeta[] = [
  {
    volume: '0,5 л',
    tagline: 'Всегда с собой',
    detail: 'Для динамичного дня, тренировок и встреч',
    src: assetUrl('assets/bottle-05l.webp'),
    width: 233,
    height: 740,
    alt: 'Бутылка артезианской воды «Природный Элемент» 0,5 л',
    modClass: 'depth-bottle-card--05',
  },
  {
    volume: '1,0 л',
    tagline: 'На каждый день',
    detail: 'Идеальный баланс для рабочего стола',
    src: assetUrl('assets/bottle-10l.webp'),
    width: 261,
    height: 871,
    alt: 'Бутылка артезианской воды «Природный Элемент» 1,0 л',
    modClass: 'depth-bottle-card--10',
  },
  {
    volume: '1,5 л',
    tagline: 'Для дома и отдыха',
    detail: 'Семейный формат для дома и путешествий',
    src: assetUrl('assets/bottle-15l.webp'),
    width: 302,
    height: 914,
    alt: 'Бутылка артезианской воды «Природный Элемент» 1,5 л',
    modClass: 'depth-bottle-card--15',
  },
];

export function DepthToLightTransition({ onDarkSceneChange }: DepthToLightTransitionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const waterWrapRef = useRef<HTMLDivElement | null>(null);
  const waterImgRef = useRef<HTMLImageElement | null>(null);
  const waterRaysRef = useRef<HTMLDivElement | null>(null);
  const causticsRef = useRef<HTMLDivElement | null>(null);
  const bubblesRef = useRef<HTMLDivElement | null>(null);
  const introRef = useRef<HTMLDivElement | null>(null);
  const bloomRef = useRef<HTMLDivElement | null>(null);
  const daylightBgRef = useRef<HTMLDivElement | null>(null);
  const bottlesHeaderRef = useRef<HTMLDivElement | null>(null);
  const bottleCardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const outroCueRef = useRef<HTMLDivElement | null>(null);

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
          // Static graceful presentation
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
            const isDarkPart = self.progress < 0.42;
            onDarkSceneChange?.(self.isActive && isDarkPart);
          },
          onLeave: () => onDarkSceneChange?.(false),
          onLeaveBack: () => onDarkSceneChange?.(true),
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
        gsap.set(introRef.current, { opacity: 1, y: 0 });
        gsap.set(bloomRef.current, { opacity: 0, scale: 0.92 });
        gsap.set(daylightBgRef.current, { opacity: 0 });
        gsap.set(bottlesHeaderRef.current, { opacity: 0, y: 24 });
        gsap.set(outroCueRef.current, { opacity: 0, y: 12 });

        bottleCardsRef.current.forEach((card, idx) => {
          if (!card) return;
          gsap.set(card, {
            opacity: 0,
            y: isDesktop ? 48 : 36,
            scale: idx === 1 ? 0.94 : 0.92,
          });
        });

        // Master cinematic scroll timeline: «Из глубины к свету»
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.65,
            invalidateOnRefresh: true,
          },
        });

        // 1. PHASE ONE (0.00 -> 0.38): Ascent from the deep artesian aquifer towards the surface
        tl.to(
          waterImgRef.current,
          {
            scale: 1.22,
            yPercent: isDesktop ? -10 : -8,
            ease: 'none',
            duration: 0.4,
          },
          0
        )
          .to(
            waterRaysRef.current,
            {
              opacity: 0.95,
              scale: 1.15,
              ease: 'sine.out',
              duration: 0.38,
            },
            0
          )
          .to(
            causticsRef.current,
            {
              opacity: 0.8,
              duration: 0.35,
              ease: 'sine.inOut',
            },
            0.05
          )
          .to(
            bubblesRef.current,
            {
              y: -80,
              opacity: 0.85,
              duration: 0.4,
              ease: 'power1.out',
            },
            0
          )
          .to(
            introRef.current,
            {
              opacity: 0,
              y: -28,
              ease: 'power2.in',
              duration: 0.22,
            },
            0.14
          );

        // 2. PHASE TWO (0.30 -> 0.62): Breaking the surface — Sunlight flood & Caustics bloom
        tl.to(
          bloomRef.current,
          {
            opacity: 1,
            scale: 1.15,
            ease: 'power2.inOut',
            duration: 0.28,
          },
          0.28
        )
          .to(
            daylightBgRef.current,
            {
              opacity: 1,
              ease: 'power2.out',
              duration: 0.32,
            },
            0.36
          )
          .to(
            bloomRef.current,
            {
              opacity: 0.24,
              scale: 1.25,
              ease: 'sine.out',
              duration: 0.22,
            },
            0.52
          );

        // 3. PHASE THREE (0.46 -> 0.88): The 3 Authentic Bottles Materialize from the Light
        tl.to(
          bottlesHeaderRef.current,
          {
            opacity: 1,
            y: 0,
            ease: 'power2.out',
            duration: 0.26,
          },
          0.46
        );

        // Center 1.0L Bottle leads the arrival
        const centerCard = bottleCardsRef.current[1];
        if (centerCard) {
          tl.to(
            centerCard,
            {
              opacity: 1,
              y: 0,
              scale: 1,
              ease: 'power3.out',
              duration: 0.34,
            },
            0.5
          );
        }

        // Left 0.5L Bottle follows in harmonious triad
        const leftCard = bottleCardsRef.current[0];
        if (leftCard) {
          tl.to(
            leftCard,
            {
              opacity: 1,
              y: 0,
              scale: 1,
              ease: 'power3.out',
              duration: 0.34,
            },
            0.54
          );
        }

        // Right 1.5L Bottle settles in
        const rightCard = bottleCardsRef.current[2];
        if (rightCard) {
          tl.to(
            rightCard,
            {
              opacity: 1,
              y: 0,
              scale: 1,
              ease: 'power3.out',
              duration: 0.34,
            },
            0.56
          );
        }

        // 4. PHASE FOUR (0.80 -> 1.00): Subtle cue naturally leading into «Выберите свой формат»
        tl.to(
          outroCueRef.current,
          {
            opacity: 1,
            y: 0,
            ease: 'power2.out',
            duration: 0.18,
          },
          0.82
        );
      },
      section
    );

    return () => mm.revert();
  }, [onDarkSceneChange]);

  const scrollToFormats = () => {
    const el = document.getElementById('formats');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="depth-to-light"
      className="depth-to-light-section"
      aria-label="Из глубины к свету: артезианская вода Природный Элемент"
    >
      <div ref={stageRef} className="depth-to-light-stage">
        {/* ================= 1. DEEP WATER & ASCENT BACKGROUND ================= */}
        <div ref={waterWrapRef} className="depth-water-scene" aria-hidden="true">
          <img
            ref={waterImgRef}
            src={assetUrl('assets/surface-sunlight.webp')}
            alt=""
            width={1024}
            height={682}
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
            <span className="depth-bubble depth-bubble--1" />
            <span className="depth-bubble depth-bubble--2" />
            <span className="depth-bubble depth-bubble--3" />
            <span className="depth-bubble depth-bubble--4" />
            <span className="depth-bubble depth-bubble--5" />
          </div>

          {/* Deep Navy Gradient Vignette for 100% seamless joint with 80m aquifer */}
          <div className="depth-water-vignette" />
        </div>

        {/* ================= 2. INTRO EDITORIAL BEAT («Из глубины к свету») ================= */}
        <div ref={introRef} className="depth-intro">
          <div className="container depth-intro__inner">
            <span className="depth-intro__badge">Из глубины к свету</span>
            <h2 className="depth-intro__title">
              Рождённая на глубине 80 метров,
              <br />
              вода поднимается навстречу солнцу
            </h2>
            <p className="depth-intro__lead">
              Кристальная чистота крымского источника раскрывается в прозрачном утреннем свете.
            </p>
          </div>
        </div>

        {/* ================= 3. SOLAR BLOOM & DAYLIGHT FLOOD ================= */}
        <div ref={bloomRef} className="depth-light-bloom" aria-hidden="true" />
        <div ref={daylightBgRef} className="depth-daylight-bg" aria-hidden="true">
          <div className="depth-daylight-caustic-drift" />
        </div>

        {/* ================= 4. THE 3 REAL BOTTLES MATERIALIZATION ================= */}
        <div className="container depth-bottles-container">
          <div ref={bottlesHeaderRef} className="depth-bottles-header">
            <span className="depth-bottles-subtitle">Природный Элемент</span>
            <h3 className="depth-bottles-title">Три гармоничных формата</h3>
            <p className="depth-bottles-lead">
              Для любого момента вашего дня — от первой утренней пробежки до семейного ужина.
            </p>
          </div>

          <div className="depth-bottles-vitrine">
            {BOTTLES.map((item, idx) => (
              <div
                key={item.volume}
                ref={(el) => {
                  bottleCardsRef.current[idx] = el;
                }}
                className={`depth-bottle-card ${item.modClass}`}
              >
                <div className="depth-bottle-card__pedestal">
                  {/* Subtle caustic refraction behind bottle */}
                  <div className="depth-bottle-card__aura" aria-hidden="true" />

                  <img
                    src={item.src}
                    alt={item.alt}
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
                      WebkitMaskImage: `url(${item.src})`,
                      maskImage: `url(${item.src})`,
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
                  <span className="depth-bottle-card__detail">{item.detail}</span>
                </div>
              </div>
            ))}
          </div>

          {/* ================= 5. SEAMLESS CUE INTO «ВЫБЕРИТЕ СВОЙ ФОРМАТ» ================= */}
          <div ref={outroCueRef} className="depth-outro-cue">
            <button
              type="button"
              className="depth-outro-cue__btn"
              onClick={scrollToFormats}
              aria-label="Перейти к выбору формата"
            >
              <span>Выберите формат и оформите заказ</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path
                  d="M8 2.5V13.5M8 13.5L3.5 9M8 13.5L12.5 9"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
