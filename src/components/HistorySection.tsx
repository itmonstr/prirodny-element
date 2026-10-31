import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { assetUrl } from '../utils/assetUrl';

gsap.registerPlugin(ScrollTrigger);

export function HistorySection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const coastImgRef = useRef<HTMLImageElement | null>(null);
  const routePathRef = useRef<SVGPathElement | null>(null);
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

        // Gentle reveal of editorial moments
        const blocks = section.querySelectorAll('.history-reveal');
        blocks.forEach((el) => {
          gsap.fromTo(
            el,
            { opacity: 0, y: 26 },
            {
              opacity: 1,
              y: 0,
              duration: 0.9,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: el,
                start: 'top 84%',
              },
            }
          );
        });

        // Panoramic Western Crimea coast parallax
        if (coastImgRef.current) {
          gsap.fromTo(
            coastImgRef.current,
            { scale: 1.08, yPercent: -3.5 },
            {
              scale: 1,
              yPercent: 3.5,
              ease: 'none',
              scrollTrigger: {
                trigger: coastImgRef.current,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 0.65,
              },
            }
          );
        }

        // Crimea route draw animation on scroll
        if (routePathRef.current) {
          const len = routePathRef.current.getTotalLength();
          gsap.set(routePathRef.current, { strokeDasharray: len, strokeDashoffset: len });
          gsap.to(routePathRef.current, {
            strokeDashoffset: 0,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: routePathRef.current,
              start: 'top 85%',
              end: 'top 45%',
              scrub: 0.7,
            },
          });
        }

        // Subtle local parallax on real production photography
        if (factoryImgRef.current) {
          gsap.fromTo(
            factoryImgRef.current,
            { scale: 1.06, yPercent: -2.5 },
            {
              scale: 1,
              yPercent: 2.5,
              ease: 'none',
              scrollTrigger: {
                trigger: factoryImgRef.current,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 0.65,
              },
            }
          );
        }

        if (conveyorWrapRef.current) {
          gsap.fromTo(
            conveyorWrapRef.current,
            { y: 18, opacity: 0.9 },
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
    <section
      ref={sectionRef}
      id="history"
      className="history-section"
      aria-labelledby="history-title"
    >
      <div className="container history-section__wrap">
        {/* Act I: Editorial Opening */}
        <header className="history-intro">
          <h2 id="history-title" className="section-title history-reveal">
            Как всё начиналось
          </h2>
          <p className="history-intro__lead history-reveal">
            В начале 2000-х близ озера Богайлы наша семья открыла артезианский источник. Идея
            сделать природную воду доступной жителям и гостям Крыма прошла долгий путь — от первой
            скважины до собственного производства.
          </p>
        </header>

        {/* Act II: Large Panoramic Photograph of Authentic Western Crimea */}
        <figure className="history-coast-panorama history-reveal">
          <div className="history-coast-panorama__frame">
            <img
              ref={coastImgRef}
              src={assetUrl('assets/crimea-west.webp')}
              alt="Природа Западного Крыма — песчаная пересыпь между морем и озером Богайлы в Сакском районе"
              width={1376}
              height={768}
              loading="lazy"
              decoding="async"
              className="history-coast-panorama__img"
            />
            <div className="history-coast-panorama__vignette" aria-hidden="true" />
            <figcaption className="history-coast-panorama__badge">
              Западный Крым · Сакский район, побережье близ озера Богайлы
            </figcaption>
          </div>
        </figure>

        {/* Act III: Overlapping Cartographic & Real Production Composition */}
        <div className="history-editorial-grid">
          {/* Left Overlapping Architectural Column: Crimea Map -> 2026 -> Bottling Line */}
          <div className="history-editorial-grid__left">
            <div className="crimea-map-plate history-reveal">
              <svg
                viewBox="0 0 560 320"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="crimea-map-plate__svg"
                role="img"
                aria-label="Силуэт Крымского полуострова с отметкой источника у села Фрунзе близ озера Богайлы"
              >
                <line x1="20" y1="180" x2="540" y2="180" stroke="#123C69" strokeOpacity="0.07" />
                <line x1="176" y1="16" x2="176" y2="298" stroke="#123C69" strokeOpacity="0.07" />

                {/* Accurate Geographic Silhouette of the Crimean Peninsula */}
                <path
                  d="M 218 36
                     L 246 52 L 266 46 L 292 72 L 325 90 L 342 120 L 368 142
                     L 398 146 L 434 134 L 478 130 L 518 142 L 528 158 L 498 182
                     L 462 186 L 424 184 L 388 200 L 348 222 L 304 256 L 252 286
                     L 202 296 L 174 280 L 168 252 L 182 226 L 184 196
                     C 182 178, 168 162, 146 154
                     L 106 150 L 64 138 L 48 124 L 76 106 L 122 98 L 164 82 L 194 54 Z"
                  fill="#EBF5FC"
                  stroke="#123C69"
                  strokeOpacity="0.38"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />

                {/* Lake Bogayly coastal contour on Kalamitsky Bay */}
                <ellipse
                  cx="171"
                  cy="183"
                  rx="6"
                  ry="3.5"
                  fill="#A9D8F0"
                  stroke="#123C69"
                  strokeOpacity="0.42"
                  strokeWidth="0.9"
                />

                {/* Animated Aquifer & Route Line to Frunze / Lake Bogayly */}
                <path
                  ref={routePathRef}
                  d="M 268 190 Q 222 172 176 180"
                  stroke="#123C69"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
                <circle cx="268" cy="190" r="2.8" fill="#123C69" fillOpacity="0.45" />

                {/* Pulsing Source Beacon: с. Фрунзе · оз. Богайлы */}
                <circle
                  cx="176"
                  cy="180"
                  r="18"
                  className="crimea-map-box__pulse"
                  stroke="#123C69"
                  strokeWidth="1"
                />
                <circle
                  cx="176"
                  cy="180"
                  r="5.5"
                  fill="#123C69"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                />

                <line
                  x1="176"
                  y1="180"
                  x2="132"
                  y2="230"
                  stroke="#123C69"
                  strokeOpacity="0.45"
                  strokeWidth="1"
                />
                <text
                  x="50"
                  y="248"
                  fill="#0E2A47"
                  fontSize="14"
                  fontWeight="500"
                  fontFamily="Manrope, sans-serif"
                >
                  с. Фрунзе · оз. Богайлы
                </text>
                <text
                  x="50"
                  y="266"
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
                Бережный автоматизированный розлив непосредственно у артезианской скважины
              </figcaption>
            </figure>
          </div>

          {/* Right Primary Production Column: Real Frunze Plant & Branded Delivery Fleet */}
          <div className="history-editorial-grid__right">
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
                Собственный завод розлива и отгрузки воды — Республика Крым, Сакский район, с. Фрунзе
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
