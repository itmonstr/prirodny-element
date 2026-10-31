import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { assetUrl } from '../utils/assetUrl';

gsap.registerPlugin(ScrollTrigger);

export function HistorySection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const routePathRef = useRef<SVGPathElement | null>(null);
  const crimeaOutlineRef = useRef<SVGPathElement | null>(null);
  const factoryImgRef = useRef<HTMLImageElement | null>(null);
  const conveyorWrapRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const mm = gsap.matchMedia();

    mm.add(
      {
        reduceMotion: '(prefers-reduced-motion: reduce)',
      },
      (context) => {
        const { reduceMotion } = context.conditions as { reduceMotion: boolean };
        if (reduceMotion) return;

        // Gentle reveal of text moments
        const blocks = section.querySelectorAll('.history-reveal');
        blocks.forEach((el) => {
          gsap.fromTo(
            el,
            { opacity: 0, y: 28 },
            {
              opacity: 1,
              y: 0,
              duration: 0.95,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: el,
                start: 'top 82%',
              },
            }
          );
        });

        // Crimea route draw animation on scroll
        if (routePathRef.current) {
          const len = routePathRef.current.getTotalLength();
          gsap.set(routePathRef.current, { strokeDasharray: len, strokeDashoffset: len });
          gsap.to(routePathRef.current, {
            strokeDashoffset: 0,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 65%',
              end: 'center center',
              scrub: 0.8,
            },
          });
        }

        // Subtle local parallax & scale on real production photography
        if (factoryImgRef.current) {
          gsap.fromTo(
            factoryImgRef.current,
            { scale: 1.07, yPercent: -3 },
            {
              scale: 1,
              yPercent: 3,
              ease: 'none',
              scrollTrigger: {
                trigger: section,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
              },
            }
          );
        }

        if (conveyorWrapRef.current) {
          gsap.fromTo(
            conveyorWrapRef.current,
            { y: 18, opacity: 0.88 },
            {
              y: -8,
              opacity: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: conveyorWrapRef.current,
                start: 'top 90%',
                end: 'bottom 25%',
                scrub: 0.6,
              },
            }
          );
        }
      },
      section
    );

    return () => mm.revert();
  }, []);

  return (
    <section ref={sectionRef} id="history" className="history-section" aria-labelledby="history-title">
      <div className="container history-section__inner">
        {/* Left Column: Family Story & Crimea Geographic Silhouette */}
        <div className="history-narrative">
          <h2 id="history-title" className="section-title history-reveal">
            Как всё начиналось
          </h2>

          <p className="history-narrative__lead history-reveal">
            В начале 2000-х близ озера Богайлы наша семья открыла артезианский источник. Идея
            сделать природную воду доступной жителям и гостям Крыма прошла долгий путь — от первой
            скважины до собственного производства.
          </p>

          <div className="crimea-map-box history-reveal">
            <svg
              viewBox="0 0 560 340"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="crimea-map-box__svg"
              role="img"
              aria-label="Силуэт Крымского полуострова с отметкой источника у села Фрунзе близ озера Богайлы"
            >
              {/* Subtle latitude/longitude water grid lines */}
              <line x1="20" y1="186" x2="540" y2="186" stroke="#123C69" strokeOpacity="0.07" />
              <line x1="176" y1="20" x2="176" y2="310" stroke="#123C69" strokeOpacity="0.07" />

              {/* Accurate Geographic Silhouette of the Crimean Peninsula */}
              <path
                ref={crimeaOutlineRef}
                d="M 218 42
                   L 246 58 L 266 52 L 292 78 L 325 96 L 342 126 L 368 148
                   L 398 152 L 434 140 L 478 136 L 518 148 L 528 164 L 498 188
                   L 462 192 L 424 190 L 388 206 L 348 228 L 304 262 L 252 292
                   L 202 302 L 174 286 L 168 258 L 182 232 L 184 202
                   C 182 184, 168 168, 146 160
                   L 106 156 L 64 144 L 48 130 L 76 112 L 122 104 L 164 88 L 194 60 Z"
                fill="#EBF5FC"
                stroke="#123C69"
                strokeOpacity="0.36"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />

              {/* Subtle Lake Bogayly coastal contour on Kalamitsky Bay */}
              <ellipse
                cx="171"
                cy="189"
                rx="6"
                ry="3.5"
                fill="#A9D8F0"
                stroke="#123C69"
                strokeOpacity="0.4"
                strokeWidth="0.9"
              />

              {/* Animated Aquifer & Route Line to Frunze / Lake Bogayly */}
              <path
                ref={routePathRef}
                d="M 268 196 Q 222 178 176 186"
                stroke="#123C69"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
              <circle cx="268" cy="196" r="2.8" fill="#123C69" fillOpacity="0.45" />

              {/* Pulsing Source Beacon: с. Фрунзе · оз. Богайлы */}
              <circle
                cx="176"
                cy="186"
                r="18"
                className="crimea-map-box__pulse"
                stroke="#123C69"
                strokeWidth="1"
              />
              <circle
                cx="176"
                cy="186"
                r="5.5"
                fill="#123C69"
                stroke="#FFFFFF"
                strokeWidth="2"
              />

              {/* Minimalist Geographic Callout */}
              <line
                x1="176"
                y1="186"
                x2="132"
                y2="236"
                stroke="#123C69"
                strokeOpacity="0.45"
                strokeWidth="1"
              />
              <text
                x="52"
                y="254"
                fill="#0E2A47"
                fontSize="14"
                fontWeight="500"
                fontFamily="Manrope, sans-serif"
              >
                с. Фрунзе · оз. Богайлы
              </text>
              <text
                x="52"
                y="272"
                fill="#4A6682"
                fontSize="11.5"
                fontFamily="Manrope, sans-serif"
              >
                Сакский район · глубина 80 м
              </text>
            </svg>
          </div>

          <div className="history-milestone history-reveal">
            <span className="history-milestone__year">2026</span>
            <p className="history-milestone__text">
              В 2026 году бренд «Природный Элемент» начал свою историю как производитель питьевой
              воды.
            </p>
          </div>
        </div>

        {/* Right Column: Authentic Production Photo Composition */}
        <div className="history-gallery">
          <figure className="history-gallery__main history-reveal">
            <div className="history-gallery__overflow">
              <img
                ref={factoryImgRef}
                src={assetUrl('assets/factory.webp')}
                alt="Завод питьевой воды «Природный Элемент» в селе Фрунзе, Сакский район Крыма"
                width={1170}
                height={971}
                loading="lazy"
                decoding="async"
                className="history-gallery__img"
              />
            </div>
            <figcaption className="history-gallery__caption">
              Собственный завод розлива воды — Республика Крым, Сакский район, с. Фрунзе
            </figcaption>
          </figure>

          <figure ref={conveyorWrapRef} className="history-gallery__secondary">
            <div className="history-gallery__overflow">
              <img
                src={assetUrl('assets/conveyor.webp')}
                alt="Автоматизированная линия розлива воды «Природный Элемент»"
                width={932}
                height={436}
                loading="lazy"
                decoding="async"
                className="history-gallery__img"
              />
            </div>
            <figcaption className="history-gallery__caption">
              Бережный розлив непосредственно у артезианской скважины
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
