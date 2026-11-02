import { MOTION_DURATION } from '../utils/motion';
import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface WhereToBuySectionProps {
  onDeliveryClick: () => void;
  onRetailClick: () => void;
}

export function WhereToBuySection({
  onDeliveryClick,
  onRetailClick,
}: WhereToBuySectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const items = section.querySelectorAll('.buy-reveal');
      gsap.fromTo(
        items,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: MOTION_DURATION,
          stagger: 0,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
          },
        }
      );

      const cards = section.querySelectorAll('.buy-card');
      gsap.fromTo(
        cards,
        { opacity: 0, y: 32, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: MOTION_DURATION,
          stagger: 0,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 78%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="where-to-buy"
      className="buy-section"
      aria-labelledby="buy-section-title"
    >
      <div className="container buy-section__inner">
        <header className="buy-section__header buy-reveal">
          <h2 id="buy-section-title" className="section-title buy-section__title">
            Где купить
          </h2>
          <p className="section-lead buy-section__lead">Ближе к вам. Каждый день.</p>
        </header>

        <div className="buy-diptych">
          {/* Card 1: Доставка (Напрямую) */}
          <article className="buy-card buy-card--delivery">
            <div className="buy-card__top">
              <div className="buy-card__meta">
                <span className="buy-card__num">01 / НАПРЯМУЮ</span>
                <p className="buy-card__caption">
                  От производства —<br />к вашему дому
                </p>
              </div>

              <div className="buy-card__scene" aria-hidden="true">
                <svg
                  className="buy-card__svg buy-card__svg--delivery"
                  viewBox="0 0 460 148"
                  fill="none"
                  preserveAspectRatio="xMaxYMax meet"
                >
                  <defs>
                    <linearGradient
                      id="delivery-hill-grad"
                      x1="200"
                      y1="40"
                      x2="380"
                      y2="135"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop offset="0%" stop-color="#b8daf0" stop-opacity="0.8" />
                      <stop offset="70%" stop-color="#d0e7f7" stop-opacity="0.4" />
                      <stop offset="100%" stop-color="#edf5fa" stop-opacity="0" />
                    </linearGradient>
                  </defs>

                  {/* Soft Blue Shaded Hill under house and path */}
                  <path
                    d="M170 135 C230 135 250 86 330 82 C380 78 410 98 435 135 Z"
                    fill="url(#delivery-hill-grad)"
                  />

                  {/* Soft contact shadow under house */}
                  <ellipse cx="346" cy="135" rx="58" ry="4" fill="rgba(12, 43, 77, 0.12)" />

                  {/* Dotted path curving from Pin to House */}
                  <path
                    d="M48 132 C82 132 126 130 168 108 C208 86 250 68 296 72"
                    stroke="#0c2b4d"
                    strokeWidth="1.8"
                    strokeDasharray="4 6"
                    strokeLinecap="round"
                  />

                  {/* Location Pin */}
                  <g
                    stroke="#0c2b4d"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path
                      d="M48 124 C48 124 33 108 33 93 A15 15 0 0 1 63 93 C63 108 48 124 48 124 Z"
                      fill="#edf5fa"
                    />
                    <circle cx="48" cy="93" r="4.5" fill="#edf5fa" />
                    <circle cx="48" cy="132" r="3.5" fill="#0c2b4d" stroke="none" />
                  </g>

                  {/* House & Bushes */}
                  <g
                    stroke="#0c2b4d"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {/* Left Bush */}
                    <path
                      d="M280 134 C280 125 287 119 295 119 C298 113 306 111 312 117 C316 122 316 134 316 134"
                      fill="#edf5fa"
                    />
                    {/* Right Bush */}
                    <path
                      d="M376 134 C376 123 384 116 393 116 C398 111 407 112 411 119 C415 125 414 134 414 134"
                      fill="#edf5fa"
                    />

                    {/* Ground line */}
                    <line x1="276" y1="134" x2="420" y2="134" />

                    {/* Main House Wall Box */}
                    <rect x="308" y="74" width="74" height="60" fill="#edf5fa" />

                    {/* Gable Roof */}
                    <path d="M299 74 L345 42 L391 74 Z" fill="#edf5fa" />

                    {/* Chimney */}
                    <path d="M367 56 V44 H379 V65" fill="#edf5fa" />

                    {/* 4-Pane Square Window */}
                    <rect x="330" y="88" width="30" height="30" fill="#edf5fa" />
                    <line x1="345" y1="88" x2="345" y2="118" />
                    <line x1="330" y1="103" x2="360" y2="103" />
                  </g>
                </svg>
              </div>
            </div>

            <div className="buy-card__bottom">
              <h3 className="buy-card__title">Доставка</h3>
              <p className="buy-card__text">
                Закажите воду напрямую<br />с доставкой.
              </p>
              <div className="buy-card__action">
                <button
                  type="button"
                  className="buy-card__btn buy-card__btn--primary"
                  onClick={onDeliveryClick}
                  aria-label="Оформить заказ воды с доставкой"
                >
                  <span>Оформить заказ</span>
                  <span className="buy-card__btn-arrow" aria-hidden="true">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M2.5 8H13.5M13.5 8L9 3.5M13.5 8L9 12.5"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </button>
              </div>
            </div>
          </article>

          {/* Card 2: В магазинах (Рядом с вами) */}
          <article className="buy-card buy-card--retail">
            <div className="buy-card__top">
              <div className="buy-card__meta">
                <span className="buy-card__num">02 / РЯДОМ С ВАМИ</span>
                <p className="buy-card__caption">
                  Выход в розницу<br />планируется
                </p>
              </div>

              <div className="buy-card__scene" aria-hidden="true">
                <svg
                  className="buy-card__svg buy-card__svg--retail"
                  viewBox="0 0 460 148"
                  fill="none"
                  preserveAspectRatio="xMaxYMax meet"
                >
                  <defs>
                    <linearGradient
                      id="retail-hill-grad"
                      x1="160"
                      y1="40"
                      x2="380"
                      y2="135"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop offset="0%" stop-color="#194876" stop-opacity="0.9" />
                      <stop offset="100%" stop-color="#0c2b4d" stop-opacity="0.2" />
                    </linearGradient>
                  </defs>

                  {/* Background soft hill arching behind the shop */}
                  <path
                    d="M120 135 C170 85 240 54 330 56 C380 58 415 88 435 135 Z"
                    fill="url(#retail-hill-grad)"
                  />

                  {/* Bushes beside shop */}
                  <g
                    stroke="#ffffff"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="#0c2b4d"
                  >
                    {/* Left Bush */}
                    <path d="M228 134 C228 122 236 114 246 114 C250 106 260 104 268 112 C274 120 274 134 274 134" />
                    {/* Right Bush */}
                    <path d="M370 134 C370 120 378 112 390 112 C396 104 406 106 412 116 C416 122 414 134 414 134" />
                  </g>

                  {/* Ground line */}
                  <line
                    x1="220"
                    y1="134"
                    x2="424"
                    y2="134"
                    stroke="#ffffff"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />

                  {/* Retail Shop Building */}
                  <g stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    {/* Main Store Wall Box */}
                    <rect x="272" y="74" width="98" height="60" fill="#0c2b4d" />

                    {/* Awning Sloped Roof */}
                    <path d="M264 74 L278 44 H364 L378 74 Z" fill="#0c2b4d" />
                    {/* 3D Awning crease lines */}
                    <line x1="278" y1="44" x2="264" y2="74" />
                    <line x1="364" y1="44" x2="378" y2="74" />
                    <line x1="278" y1="44" x2="364" y2="44" />

                    {/* Awning 5 Scallops across span from 264 to 378 */}
                    <path
                      d="M264 74 Q275.4 86 286.8 74 Q298.2 86 309.6 74 Q321 86 332.4 74 Q343.8 86 355.2 74 Q366.6 86 378 74"
                      fill="#0c2b4d"
                    />

                    {/* Door on Left */}
                    <rect x="286" y="86" width="22" height="48" fill="#0c2b4d" />
                    {/* Door handle */}
                    <circle cx="303" cy="110" r="1.5" fill="#ffffff" stroke="none" />

                    {/* Display Window on Right */}
                    <rect x="318" y="86" width="42" height="32" fill="#0c2b4d" />
                    {/* Diagonal glass reflection slash lines */}
                    <line x1="328" y1="112" x2="340" y2="92" />
                    <line x1="338" y1="112" x2="350" y2="92" />
                  </g>
                </svg>
              </div>
            </div>

            <div className="buy-card__bottom">
              <h3 className="buy-card__title">В магазинах</h3>
              <p className="buy-card__text">
                Готовимся стать ближе. Узнайте<br />о появлении воды в магазинах.
              </p>
              <div className="buy-card__action">
                <button
                  type="button"
                  className="buy-card__btn buy-card__btn--outline"
                  onClick={onRetailClick}
                  aria-label="Уточнить наличие воды в магазинах"
                >
                  <span>Уточнить наличие</span>
                  <span className="buy-card__btn-arrow" aria-hidden="true">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M2.5 8H13.5M13.5 8L9 3.5M13.5 8L9 12.5"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </button>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
