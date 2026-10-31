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

      const photos = section.querySelectorAll('.buy-scenario__still-img');
      photos.forEach((img) => {
        gsap.fromTo(
          img,
          { scale: 1.05, yPercent: -2 },
          {
            scale: 1,
            yPercent: 2,
            ease: 'none',
            scrollTrigger: {
              trigger: img,
              start: 'top bottom',
              end: 'bottom top',
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
          <p className="section-lead">
            Заказывайте воду напрямую с доставкой. По мере выхода продукции в розницу здесь появится
            карта магазинов.
          </p>
        </header>

        <div className="buy-diptych">
          {/* Scenario 1: Direct Delivery */}
          <article className="buy-scenario buy-reveal">
            <div className="buy-scenario__media" onClick={onDeliveryClick}>
              <img
                src={assetUrl('assets/buy-delivery-scene.webp')}
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
              <p className="buy-scenario__text">
                Заказ воды напрямую через согласованный канал связи с производителем. Свежие партии
                отгружаются непосредственно со склада завода в Сакском районе.
              </p>
              <div className="buy-scenario__action">
                <button
                  type="button"
                  className="btn-pill btn-pill--primary"
                  onClick={onDeliveryClick}
                >
                  Оформить заказ
                </button>
              </div>
            </div>
          </article>

          <div className="buy-diptych__divider buy-reveal" aria-hidden="true" />

          {/* Scenario 2: Retail Stores */}
          <article className="buy-scenario buy-reveal">
            <div className="buy-scenario__media" onClick={onRetailClick}>
              <img
                src={assetUrl('assets/buy-retail-scene.webp')}
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
              <p className="buy-scenario__text">
                Выход продукции в розничные магазины и торговые сети планируется. Вы можете уточнить
                актуальный статус поставок или условия сотрудничества напрямую.
              </p>
              <div className="buy-scenario__action">
                <button
                  type="button"
                  className="btn-pill btn-pill--outline"
                  onClick={onRetailClick}
                >
                  Уточнить наличие
                </button>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
