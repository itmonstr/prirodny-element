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
        { opacity: 0, y: 26 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.14,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 78%',
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
            <div
              className="buy-scenario__media buy-scenario__media--delivery"
              onClick={onDeliveryClick}
            >
              <div className="buy-scenario__sunlight" aria-hidden="true" />
              <div className="buy-scenario__horizon" aria-hidden="true" />
              <div className="buy-scenario__bottles-pair" aria-hidden="true">
                <img
                  src={assetUrl('assets/bottle-15-still.webp')}
                  alt=""
                  width={212}
                  height={709}
                  loading="lazy"
                  decoding="async"
                  className="buy-scenario__bottle-back"
                />
                <img
                  src={assetUrl('assets/bottle-15-sparkling.webp')}
                  alt="Формат 1,5 л для прямой доставки"
                  width={214}
                  height={709}
                  loading="lazy"
                  decoding="async"
                  className="buy-scenario__bottle-front"
                />
              </div>
              <span className="buy-scenario__caption-tag">Со склада в с. Фрунзе · 0,5 и 1,5 л</span>
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
            <div
              className="buy-scenario__media buy-scenario__media--retail"
              onClick={onRetailClick}
            >
              <div className="buy-scenario__horizon" aria-hidden="true" />
              <div className="buy-scenario__retail-trio" aria-hidden="true">
                <img
                  src={assetUrl('assets/bottle-05-still.webp')}
                  alt=""
                  width={152}
                  height={504}
                  loading="lazy"
                  decoding="async"
                />
                <img
                  src={assetUrl('assets/bottle-05-sparkling.webp')}
                  alt=""
                  width={152}
                  height={502}
                  loading="lazy"
                  decoding="async"
                />
                <img
                  src={assetUrl('assets/bottle-15-sparkling.webp')}
                  alt="Ассортимент «Природный Элемент» для розничных точек"
                  width={214}
                  height={709}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <span className="buy-scenario__caption-tag">Формируется розничная сеть · Крым</span>
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
