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
      gsap.fromTo(
        zones,
        { opacity: 0, y: 32, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.95,
          stagger: 0.14,
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
      className="buy-section buy-section--editorial"
      aria-labelledby="buy-section-title"
    >
      <div className="container buy-section__inner">
        <header className="buy-section__header buy-reveal">
          <h2 id="buy-section-title" className="section-title">
            Где купить
          </h2>
          <p className="section-lead">Ближе к вам. Каждый день.</p>
        </header>

        <div className="buy-diptych">
          {/* Scenario 1: Direct Delivery */}
          <article className="buy-scenario buy-scenario--delivery">
            <div className="buy-route" aria-hidden="true">
              <span className="buy-route__number">01 / НАПРЯМУЮ</span>
              <svg className="buy-route__drawing" viewBox="0 0 360 160" fill="none">
                <path className="buy-route__trail" d="M20 116H105C147 116 132 42 180 42S214 116 260 116H338" />
                <circle cx="20" cy="116" r="5" />
                <path d="M263 71L298 42L333 71M273 64V101H323V64M291 101V79H305V101" />
              </svg>
              <span className="buy-route__caption">От источника — к вашему столу</span>
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
            <div className="buy-route" aria-hidden="true">
              <span className="buy-route__number">02 / РЯДОМ С ВАМИ</span>
              <svg className="buy-route__drawing" viewBox="0 0 360 160" fill="none">
                <path d="M122 63L133 35H227L238 63M129 81V126H231V81M120 63H240V73C240 88 216 88 216 73C216 88 192 88 192 73C192 88 168 88 168 73C168 88 144 88 144 73C144 88 120 88 120 73V63ZM157 126V99H180V126M196 100H217V115H196V100" />
                <path className="buy-route__trail" d="M22 126H105M255 126H338" />
              </svg>
              <span className="buy-route__caption">Выход в розницу планируется</span>
            </div>

            <div className="buy-scenario__body">
              <h3 className="buy-scenario__title">В магазинах</h3>
              <p className="buy-scenario__text">Готовимся стать ближе. Узнайте о появлении воды в магазинах.</p>
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
