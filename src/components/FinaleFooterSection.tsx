import { MOTION_DURATION } from '../utils/motion';
import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { assetUrl } from '../utils/assetUrl';

gsap.registerPlugin(ScrollTrigger);

interface FinaleFooterSectionProps {
  onOrderClick: () => void;
  onPrivacyClick: () => void;
  onAssetsNoteClick: () => void;
  onDarkSceneChange: (isDark: boolean) => void;
}

export function FinaleFooterSection({
  onOrderClick,
  onPrivacyClick,
  onAssetsNoteClick,
  onDarkSceneChange,
}: FinaleFooterSectionProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const bottleAssemblyRef = useRef<HTMLDivElement | null>(null);
  const sheenBeamRef = useRef<HTMLDivElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

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
        const scrubVal = isDesktop ? 0.85 : 0.25;

        ScrollTrigger.create({
          trigger: wrapper,
          start: 'top 68px',
          end: 'bottom top',
          onToggle: (self) => onDarkSceneChange(self.isActive),
          onRefresh: (self) => onDarkSceneChange(self.isActive),
          onLeave: () => onDarkSceneChange(false),
          onLeaveBack: () => onDarkSceneChange(false),
        });

        if (!reduceMotion) {
          const texts = wrapper.querySelectorAll('.finale-reveal');
          gsap.fromTo(
            texts,
            { opacity: 0, y: 26 },
            {
              opacity: 1,
              y: 0,
              duration: MOTION_DURATION,
              stagger: 0,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: wrapper,
                start: 'top 74%',
              },
            }
          );

          if (bottleAssemblyRef.current) {
            gsap.fromTo(
              bottleAssemblyRef.current,
              { y: 34, scale: 0.94, opacity: 0.78 },
              {
                y: 0,
                scale: 1,
                opacity: 1,
                ease: 'power2.out',
                scrollTrigger: {
                  trigger: wrapper,
                  start: 'top 82%',
                  end: 'center 54%',
                  scrub: scrubVal,
                },
              }
            );
          }

          if (sheenBeamRef.current) {
            gsap.fromTo(
              sheenBeamRef.current,
              { xPercent: -90, opacity: 0.2 },
              {
                xPercent: 90,
                opacity: 0.68,
                ease: 'sine.inOut',
                scrollTrigger: {
                  trigger: wrapper,
                  start: 'top 75%',
                  end: 'bottom bottom',
                  scrub: scrubVal,
                },
              }
            );
          }

          if (glowRef.current) {
            gsap.fromTo(
              glowRef.current,
              { scale: 0.84, opacity: 0.45 },
              {
                scale: 1.06,
                opacity: 0.95,
                ease: 'sine.out',
                scrollTrigger: {
                  trigger: wrapper,
                  start: 'top 78%',
                  end: 'center center',
                  scrub: scrubVal,
                },
              }
            );
          }
        }
      },
      wrapper
    );

    return () => mm.revert();
  }, [onDarkSceneChange]);

  const bottleUrl = assetUrl('assets/bottle-hero.webp');

  return (
    <div ref={wrapperRef} className="finale-footer-wrap">
      {/* BLOCK 6: «Остаёмся на связи» — Atmospheric Nocturne Finale */}
      <section className="finale-section" aria-labelledby="finale-slogan">
        {/* Blended studio water & volumetric light backdrop */}
        <div className="finale-section__backdrop" aria-hidden="true">
          <picture className="responsive-photo"><source media="(max-width: 1023px)" srcSet={assetUrl('assets/finale-water-stage-mobile.webp')} /><img
            src={assetUrl('assets/finale-water-stage.webp')}

            alt=""
            width={1600}
            height={1000}
            loading="lazy"
            decoding="async"
            className="finale-section__backdrop-img"
          /></picture>
        </div>

        <div className="container finale-section__inner">
          <div className="finale-copy">
            <h2 id="finale-slogan" className="finale-copy__slogan finale-reveal">
              Остаёмся на связи
            </h2>
            <p className="finale-copy__sub finale-reveal">
              Поможем с заказом и ответим на вопросы о продукции.
            </p>
            <div className="finale-copy__cta finale-reveal">
              <a href="#contacts" className="btn-pill btn-pill--light">
                Связаться с нами
              </a>
            </div>
          </div>

          <div className="finale-bottle-stage">
            <div ref={glowRef} className="finale-bottle-stage__halo" aria-hidden="true" />
            <div className="finale-bottle-stage__lightcone" aria-hidden="true" />

            <div ref={bottleAssemblyRef} className="finale-bottle-stage__assembly">
              <div className="finale-bottle-stage__wrap">
                <img
                  src={bottleUrl}
                  alt="Настоящая бутылка артезианской воды «Природный Элемент»"
                  width={500}
                  height={1850}
                  loading="lazy"
                  decoding="async"
                  className="finale-bottle-stage__img"
                />
                <div
                  className="finale-bottle-stage__rimlight"
                  style={{
                    WebkitMaskImage: `url(${bottleUrl})`,
                    maskImage: `url(${bottleUrl})`,
                  }}
                  aria-hidden="true"
                >
                  <div ref={sheenBeamRef} className="finale-bottle-stage__sheen-beam" />
                </div>

                {/* Exact bottle-width mirror reflection on dark water surface */}
                <div className="finale-bottle-stage__reflection" aria-hidden="true">
                  <img
                    src={bottleUrl}
                    alt=""
                    width={500}
                    height={1850}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>

              {/* Water-surface ripple contact ring */}
              <div className="finale-bottle-stage__water-ring" aria-hidden="true" />
            </div>
          </div>
        </div>

        {/* Seamless architectural horizon divider into the footer */}
        <div className="container finale-section__seam" aria-hidden="true">
          <span className="finale-section__seam-line" />
          <span className="finale-section__seam-drop" />
          <span className="finale-section__seam-line" />
        </div>
      </section>

      {/* COMPACT DARK-BLUE FOOTER */}
      <footer id="contacts" className="site-footer">
        <div className="container site-footer__inner">
          <div className="site-footer__top">
            <div className="site-footer__brand-col">
              <a
                href="#top"
                className="site-footer__logo-link"
                aria-label="Природный Элемент — Наверх"
              >
                <img
                  src={assetUrl('assets/logo-white.webp')}
                  alt="Природный Элемент"
                  width={593}
                  height={276}
                  loading="lazy"
                  className="site-footer__logo"
                />
              </a>
              <p className="site-footer__company">ООО «Матушка-водица»</p>
              <address className="site-footer__address">
                Республика Крым, Сакский район,
                <br />
                с. Фрунзе, ул. Шоссе Приморское, 1А
              </address>
            </div>

            <div className="site-footer__contacts-col">
              <span className="site-footer__heading">Контакты</span>
              <a href="tel:+79790314673" className="site-footer__phone">
                +7 979 031-46-73
              </a>
              <a href="mailto:matushka-voditsa@mail.ru" className="site-footer__email">
                matushka-voditsa@mail.ru
              </a>
              <div className="site-footer__cta-row">
                <button
                  type="button"
                  className="btn-pill btn-pill--light"
                  onClick={onOrderClick}
                >
                  Заказать воду
                </button>
              </div>
            </div>

            <nav className="site-footer__nav-col" aria-label="Навигация в подвале">
              <a href="#source" className="site-footer__nav-link">
                Источник
              </a>
              <a href="#formats" className="site-footer__nav-link">
                Форматы
              </a>
              <a href="#history" className="site-footer__nav-link">
                История
              </a>
              <a href="#where-to-buy" className="site-footer__nav-link">
                Где купить
              </a>
              <a href="#contacts" className="site-footer__nav-link">
                Контакты
              </a>
            </nav>
          </div>

          <div className="site-footer__bottom">
            <span className="site-footer__copy">© 2026 ООО «Матушка-водица»</span>
            <div className="site-footer__legal-links">
              <button
                type="button"
                className="site-footer__text-btn"
                onClick={onPrivacyClick}
              >
                Политика конфиденциальности
              </button>
              <button
                type="button"
                className="site-footer__text-btn"
                onClick={onAssetsNoteClick}
              >
                Материалы к запуску
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
