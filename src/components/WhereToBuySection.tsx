import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { assetUrl } from '../utils/assetUrl';

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
          duration: 0.85,
          stagger: 0.12,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
          },
        }
      );

      const zones = section.querySelectorAll('.buy-scenario');
      zones.forEach((zone) => {
        gsap.fromTo(
          zone,
          { clipPath: 'inset(8% 0 0 0)', y: 28, opacity: 0 },
          {
            clipPath: 'inset(0% 0 0 0)', y: 0, opacity: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: zone,
              start: 'top 90%',
              end: 'top 45%',
              scrub: 0.6,
            },
          }
        );
      });
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
          <h2 id="buy-section-title" className="section-title">
            Где купить
          </h2>
          <p className="section-lead">Выберите удобный способ узнать о воде и заказать её.</p>
        </header>

        <div className="buy-diptych">
          {/* Scenario 1: Direct Delivery */}
          <article className="buy-scenario buy-scenario--delivery">
            <div className="buy-scenario__media">
              <img
                src={assetUrl('assets/buy-delivery-hd.png')}
                alt="Настоящие бутылки «Природный Элемент» 1,5 л для прямой доставки"
                width={1440}
                height={900}
                loading="lazy"
                decoding="async"
                className="buy-scenario__still-img"
              />
              <div className="buy-scenario__sheen" aria-hidden="true" />
            </div>

            <div className="buy-scenario__body">
              <h3 className="buy-scenario__title">Доставка</h3>
              <p className="buy-scenario__text">Закажите воду напрямую с доставкой.</p>
              <div className="buy-scenario__action">
                <button
                  type="button"
                  className="btn-pill btn-pill--primary"
                  onClick={onDeliveryClick}
                >
                  Оформить заказ
                  <span className="buy-scenario__arrow" aria-hidden="true">↗</span>
                </button>
              </div>
            </div>
          </article>

          {/* Scenario 2: Retail Stores */}
          <article className="buy-scenario buy-scenario--retail">
            <div className="buy-scenario__media">
              <img
                src={assetUrl('assets/buy-retail-hd.png')}
                alt="Ассортимент бутылок «Природный Элемент» 0,5 л и 1,5 л для розничных точек"
                width={1440}
                height={900}
                loading="lazy"
                decoding="async"
                className="buy-scenario__still-img"
              />
              <div className="buy-scenario__sheen" aria-hidden="true" />
            </div>

            <div className="buy-scenario__body">
              <h3 className="buy-scenario__title">В магазинах</h3>
              <p className="buy-scenario__text">Появление в магазинах планируется. Уточните актуальный статус.</p>
              <div className="buy-scenario__action">
                <button
                  type="button"
                  className="btn-pill btn-pill--outline"
                  onClick={onRetailClick}
                >
                  Уточнить наличие
                  <span className="buy-scenario__arrow" aria-hidden="true">↗</span>
                </button>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
