import { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { OrderSelection, VolumeFormat, WaterType } from '../types';
import { assetUrl } from '../utils/assetUrl';

gsap.registerPlugin(ScrollTrigger);

interface FormatsSectionProps {
  onOrderFormat: (selection: OrderSelection) => void;
}

interface FormatItem {
  volume: VolumeFormat;
  label: string;
  tagline: string;
  detail: string;
  hasRealPhoto: boolean;
}

const FORMATS: FormatItem[] = [
  {
    volume: '0.5',
    label: '0,5 л',
    tagline: 'Всегда с собой',
    detail: 'Компактный формат для прогулок, тренировок, автомобиля и деловых встреч.',
    hasRealPhoto: true,
  },
  {
    volume: '1.0',
    label: '1 л',
    tagline: 'На каждый день',
    detail: 'Сбалансированный объём для рабочего стола и поддержания водного баланса в течение дня.',
    hasRealPhoto: true,
  },
  {
    volume: '1.5',
    label: '1,5 л',
    tagline: 'Для дома и отдыха',
    detail: 'Семейный формат для домашнего стола, загородного отдыха и длительных поездок по Крыму.',
    hasRealPhoto: true,
  },
];

export function FormatsSection({ onOrderFormat }: FormatsSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const descRef = useRef<HTMLDivElement | null>(null);
  const [activeVolume, setActiveVolume] = useState<VolumeFormat>('0.5');
  const [waterType, setWaterType] = useState<WaterType>('sparkling');
  const [typePulse, setTypePulse] = useState<boolean>(false);
  const userInteractedRef = useRef<boolean>(false);

  const activeIndex = FORMATS.findIndex((f) => f.volume === activeVolume);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const mm = gsap.matchMedia();

    mm.add(
      {
        isDesktop: '(min-width: 1024px)',
        reduceMotion: '(prefers-reduced-motion: reduce)',
      },
      (context) => {
        const { isDesktop, reduceMotion } = context.conditions as {
          isDesktop: boolean;
          reduceMotion: boolean;
        };

        if (!reduceMotion) {
          const introEls = section.querySelectorAll('.formats-intro-anim');
          gsap.fromTo(
            introEls,
            { opacity: 0, y: 24 },
            {
              opacity: 1,
              y: 0,
              duration: 0.85,
              stagger: 0.09,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: section,
                start: 'top 78%',
              },
            }
          );
        }

        if (isDesktop && !reduceMotion) {
          // Optimized 148vh scroll-driven sequential focus across the 3 bottle formats (zero dead scroll)
          ScrollTrigger.create({
            trigger: section,
            start: 'top top',
            end: 'bottom bottom',
            onUpdate: (self) => {
              if (userInteractedRef.current) return;
              const p = self.progress;
              if (p < 0.34) setActiveVolume('0.5');
              else if (p < 0.68) setActiveVolume('1.0');
              else setActiveVolume('1.5');
            },
            onLeaveBack: () => {
              userInteractedRef.current = false;
            },
            onLeave: () => {
              userInteractedRef.current = false;
            },
          });
        }
      },
      section
    );

    return () => mm.revert();
  }, []);

  // Gentle editorial cross-rise when active format changes
  useLayoutEffect(() => {
    if (!descRef.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.fromTo(
      descRef.current,
      { opacity: 0.35, y: 8 },
      { opacity: 1, y: 0, duration: 0.42, ease: 'power2.out', overwrite: true }
    );
  }, [activeVolume]);

  const handleSelectVolume = (vol: VolumeFormat, index: number) => {
    userInteractedRef.current = true;
    setActiveVolume(vol);
    if (trackRef.current && window.matchMedia('(max-width: 680px)').matches) {
      const card = trackRef.current.children[index] as HTMLElement | undefined;
      card?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  };

  const handleWaterTypeChange = (next: WaterType) => {
    if (next === waterType) return;
    setWaterType(next);
    setTypePulse(true);
    window.setTimeout(() => setTypePulse(false), 380);
  };

  const activeItem = FORMATS[activeIndex] ?? FORMATS[0];

  const getBottleSrc = (vol: VolumeFormat, type: WaterType) => {
    if (vol === '0.5') {
      return type === 'sparkling'
        ? assetUrl('assets/bottle-05-sparkling.webp')
        : assetUrl('assets/bottle-05-still.webp');
    }
    if (vol === '1.0') {
      return type === 'sparkling'
        ? assetUrl('assets/bottle-10-sparkling.webp')
        : assetUrl('assets/bottle-10-still.webp');
    }
    return type === 'sparkling'
      ? assetUrl('assets/bottle-15-sparkling.webp')
      : assetUrl('assets/bottle-15-still.webp');
  };

  return (
    <section
      ref={sectionRef}
      id="formats"
      className="formats-section"
      aria-labelledby="formats-title"
    >
      <div className="formats-section__sticky">
        <div className="container formats-section__inner">
          <div className="formats-header">
            <div className="formats-header__titles">
              <h2 id="formats-title" className="section-title formats-intro-anim">
                Выберите свой формат
              </h2>
              <p className="section-lead formats-intro-anim">
                Для дома, работы, прогулок и поездок — выберите удобный формат.
              </p>
            </div>

            <div
              className="water-type-switch formats-intro-anim"
              role="group"
              aria-label="Тип воды"
            >
              <button
                type="button"
                className={`water-type-switch__btn ${waterType === 'sparkling' ? 'is-active' : ''}`}
                onClick={() => handleWaterTypeChange('sparkling')}
              >
                <span className="water-type-switch__dot water-type-switch__dot--sparkling" />
                Газированная
              </button>
              <button
                type="button"
                className={`water-type-switch__btn ${waterType === 'still' ? 'is-active' : ''}`}
                onClick={() => handleWaterTypeChange('still')}
              >
                <span className="water-type-switch__dot water-type-switch__dot--still" />
                Негазированная
              </button>
            </div>
          </div>

          {/* Mobile Volume Quick-Selector Tabs */}
          <div className="formats-mobile-tabs" role="tablist" aria-label="Выбор объёма">
            {FORMATS.map((item, idx) => (
              <button
                key={item.volume}
                type="button"
                role="tab"
                aria-selected={activeVolume === item.volume}
                className={`formats-mobile-tabs__tab ${
                  activeVolume === item.volume ? 'is-active' : ''
                }`}
                onClick={() => handleSelectVolume(item.volume, idx)}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Architectural Sunlit Studio Vitrine */}
          <div className="formats-vitrine formats-intro-anim">
            {/* Gliding Studio Spotlight Halo */}
            <div
              className="formats-vitrine__spotlight"
              style={{
                transform: `translate3d(${(activeIndex - 1) * 100}%, 0, 0)`,
              }}
              aria-hidden="true"
            />
            <div className="formats-vitrine__sunbeams" aria-hidden="true" />
            <div className="formats-vitrine__shelf" aria-hidden="true" />

            <div
              ref={trackRef}
              className={`formats-stage ${typePulse ? 'is-switching-type' : ''}`}
              onScroll={(e) => {
                if (!window.matchMedia('(max-width: 680px)').matches) return;
                const el = e.currentTarget;
                const ratio = el.scrollLeft / Math.max(1, el.scrollWidth - el.clientWidth);
                if (ratio < 0.28) setActiveVolume('0.5');
                else if (ratio < 0.72) setActiveVolume('1.0');
                else setActiveVolume('1.5');
              }}
            >
              {FORMATS.map((item, idx) => {
                const isActive = activeVolume === item.volume;
                return (
                  <article
                    key={item.volume}
                    className={[
                      'format-column',
                      `format-column--v${item.volume.replace('.', '')}`,
                      isActive ? 'is-active' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    onClick={() => handleSelectVolume(item.volume, idx)}
                    onMouseEnter={() => {
                      if (window.matchMedia('(min-width: 1024px)').matches) {
                        userInteractedRef.current = true;
                        setActiveVolume(item.volume);
                      }
                    }}
                  >
                    <div className="format-column__pedestal">
                      {item.hasRealPhoto ? (
                        <div className="format-bottle-wrap">
                          <img
                            src={getBottleSrc(item.volume, waterType)}
                            alt={`Природный Элемент ${item.label} (${
                              waterType === 'sparkling' ? 'газированная' : 'негазированная'
                            })`}
                            width={item.volume === '0.5' ? 152 : item.volume === '1.0' ? 172 : 214}
                            height={item.volume === '0.5' ? 502 : item.volume === '1.0' ? 570 : 709}
                            loading="lazy"
                            decoding="async"
                            className="format-bottle-wrap__img"
                          />
                          <div className="format-bottle-wrap__shadows" aria-hidden="true">
                            <span className="format-bottle-wrap__cast" />
                            <span className="format-bottle-wrap__contact" />
                          </div>
                        </div>
                      ) : (
                        /* Honest architectural blueprint silhouette for 1.0 L pending studio shoot */
                        <div
                          className="format-bottle-silhouette"
                          aria-label="Формат 1 литр — ожидается предметная фотография упаковки"
                        >
                          <svg
                            viewBox="0 0 180 600"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="format-bottle-silhouette__svg"
                          >
                            <defs>
                              <linearGradient id="blueprintWaterFill" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#A9D8F0" stopOpacity="0.22" />
                                <stop offset="55%" stopColor="#FFFFFF" stopOpacity="0.45" />
                                <stop offset="100%" stopColor="#A9D8F0" stopOpacity="0.28" />
                              </linearGradient>
                            </defs>
                            {/* Cap matching waterType */}
                            <rect
                              x="64"
                              y="14"
                              width="52"
                              height="36"
                              rx="5"
                              fill={waterType === 'sparkling' ? '#243C9A' : '#2E86CE'}
                              fillOpacity="0.92"
                            />
                            <rect
                              x="61"
                              y="52"
                              width="58"
                              height="8"
                              rx="2"
                              stroke="#123C69"
                              strokeOpacity="0.38"
                              strokeWidth="1.3"
                            />
                            {/* Exact proportional 1L contour */}
                            <path
                              d="M65 62 L65 76 C65 98, 22 124, 22 182 L22 365 C22 385, 29 398, 29 422 C29 446, 23 462, 23 488 C23 514, 28 532, 22 558 C20 572, 28 584, 44 584 C56 584, 62 574, 72 574 C80 574, 83 586, 90 586 C97 586, 100 574, 108 574 C118 574, 124 584, 136 584 C152 584, 160 572, 158 558 C152 532, 157 514, 157 488 C157 462, 151 446, 151 422 C151 398, 158 385, 158 365 L158 182 C158 124, 115 98, 115 76 L115 62 Z"
                              fill="url(#blueprintWaterFill)"
                              stroke="#123C69"
                              strokeOpacity="0.38"
                              strokeWidth="1.5"
                              strokeDasharray="5 4"
                            />
                            {/* Water meniscus line */}
                            <path
                              d="M44 114 Q 90 120 136 114"
                              stroke="#2E86CE"
                              strokeOpacity="0.38"
                              strokeWidth="1.1"
                            />
                            {/* Label zone outline */}
                            <rect
                              x="23"
                              y="196"
                              width="134"
                              height="140"
                              fill="#FFFFFF"
                              fillOpacity="0.62"
                              stroke="#123C69"
                              strokeOpacity="0.22"
                              strokeWidth="1"
                            />
                            <text
                              x="90"
                              y="256"
                              textAnchor="middle"
                              fill="#123C69"
                              fillOpacity="0.78"
                              fontSize="14"
                              fontWeight="500"
                              fontFamily="Cormorant Garamond, serif"
                              letterSpacing="1.4"
                              style={{ fontVariantNumeric: 'lining-nums proportional-nums' }}
                            >
                              1,0 ЛИТРА
                            </text>
                            <text
                              x="90"
                              y="280"
                              textAnchor="middle"
                              fill="#4A6682"
                              fillOpacity="0.88"
                              fontSize="9.5"
                              fontFamily="Manrope, sans-serif"
                            >
                              фото упаковки
                            </text>
                            <text
                              x="90"
                              y="294"
                              textAnchor="middle"
                              fill="#4A6682"
                              fillOpacity="0.88"
                              fontSize="9.5"
                              fontFamily="Manrope, sans-serif"
                            >
                              после съёмки SKU
                            </text>
                          </svg>
                          <div className="format-bottle-wrap__shadows" aria-hidden="true">
                            <span className="format-bottle-wrap__cast" />
                            <span className="format-bottle-wrap__contact" />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="format-column__caption">
                      <span className="format-column__volume">{item.label}</span>
                      <span className="format-column__tagline">{item.tagline}</span>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Gliding Active Track Bar on Vitrine Base */}
            <div className="formats-vitrine__progress" aria-hidden="true">
              <span
                className="formats-vitrine__progress-thumb"
                style={{ transform: `translate3d(${activeIndex * 100}%, 0, 0)` }}
              />
            </div>
          </div>

          {/* Active Format Footer Bar & Primary Action */}
          <div className="formats-footer">
            <div ref={descRef} className="formats-footer__desc">
              <p className="formats-footer__text">
                <strong className="formats-footer__vol-badge">{activeItem.label}</strong>
                <span>{activeItem.detail}</span>
              </p>
              {!activeItem.hasRealPhoto && (
                <p className="formats-footer__note">
                  Подлинная фотография бутылки объёмом 1 л будет размещена после предметной съёмки
                  серийной партии.
                </p>
              )}
            </div>

            <button
              type="button"
              className="btn-pill btn-pill--primary"
              onClick={() => onOrderFormat({ volume: activeVolume, waterType })}
            >
              Заказать с доставкой
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
