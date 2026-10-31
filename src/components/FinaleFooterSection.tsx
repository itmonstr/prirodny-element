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
  const bottleWrapRef = useRef<HTMLDivElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const mm = gsap.matchMedia();

    mm.add(
      {
        reduceMotion: '(prefers-reduced-motion: reduce)',
      },
      (context) => {
        const { reduceMotion } = context.conditions as { reduceMotion: boolean };

        ScrollTrigger.create({
          trigger: wrapper,
          start: 'top 68px',
          end: 'bottom top',
          onToggle: (self) => onDarkSceneChange(self.isActive),
          onRefresh: (self) => onDarkSceneChange(self.isActive),
        });

        if (!reduceMotion) {
          const texts = wrapper.querySelectorAll('.finale-reveal');
          gsap.fromTo(
            texts,
            { opacity: 0, y: 28 },
            {
              opacity: 1,
              y: 0,
              duration: 1.05,
              stagger: 0.14,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: wrapper,
                start: 'top 72%',
              },
            }
          );

          if (bottleWrapRef.current) {
            gsap.fromTo(
              bottleWrapRef.current,
              { y: 36, scale: 0.95, opacity: 0.78 },
              {
                y: 0,
                scale: 1,
                opacity: 1,
                ease: 'power2.out',
                scrollTrigger: {
                  trigger: wrapper,
                  start: 'top 80%',
                  end: 'center center',
                  scrub: 0.7,
                },
              }
            );
          }

          if (glowRef.current) {
            gsap.fromTo(
              glowRef.current,
              { scale: 0.8, opacity: 0.35 },
              {
                scale: 1.08,
                opacity: 0.85,
                ease: 'sine.out',
                scrollTrigger: {
                  trigger: wrapper,
                  start: 'top 75%',
                  end: 'center center',
                  scrub: 0.8,
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

  return (
    <div ref={wrapperRef} className="finale-footer-wrap">
      {/* BLOCK 6: «Остаёмся на связи» — Strong Visual Finale */}
      <section className="finale-section" aria-labelledby="finale-slogan">
        <div className="container finale-section__inner">
          <div className="finale-copy">
            <h2 id="finale-slogan" className="finale-copy__slogan finale-reveal">
              Вкус качества.
              <br />
              Любовь в каждой капле
            </h2>
            <p className="finale-copy__sub finale-reveal">
              Частица природы Крыма в вашем ежедневном ритме.
            </p>
            <div className="finale-copy__cta finale-reveal">
              <button
                type="button"
                className="btn-pill btn-pill--light"
                onClick={onOrderClick}
              >
                Заказать воду
              </button>
            </div>
          </div>

          <div className="finale-bottle-stage">
            <div ref={glowRef} className="finale-bottle-stage__halo" aria-hidden="true" />
            <div ref={bottleWrapRef} className="finale-bottle-stage__wrap">
              <img
                src={assetUrl('assets/bottle-hero.webp')}
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
                  WebkitMaskImage: `url(${assetUrl('assets/bottle-hero.webp')})`,
                  maskImage: `url(${assetUrl('assets/bottle-hero.webp')})`,
                }}
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </section>

      {/* COMPACT DARK-BLUE FOOTER */}
      <footer id="contacts" className="site-footer">
        <div className="container site-footer__inner">
          <div className="site-footer__top">
            <div className="site-footer__brand-col">
              <a href="#top" className="site-footer__logo-link" aria-label="Природный Элемент — Наверх">
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
              <span className="site-footer__heading">Остаёмся на связи</span>
              <a href="tel:+79780207500" className="site-footer__phone">
                +7 978 020-75-00
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
