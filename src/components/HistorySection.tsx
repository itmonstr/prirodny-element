import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { assetUrl } from '../utils/assetUrl';

gsap.registerPlugin(ScrollTrigger);

export function HistorySection() {
  const section = useRef<HTMLElement>(null);
  const journey = useRef<HTMLDivElement>(null);
  const coast = useRef<HTMLDivElement>(null);
  const coastImg = useRef<HTMLImageElement>(null);
  const production = useRef<HTMLDivElement>(null);
  const factory = useRef<HTMLImageElement>(null);
  const year = useRef<HTMLSpanElement>(null);

  // Cinematic Bottling Stage Refs
  const bottlingCinema = useRef<HTMLDivElement>(null);
  const conveyorImg = useRef<HTMLImageElement>(null);
  const factoryLayer = useRef<HTMLDivElement>(null);
  const factoryImg = useRef<HTMLImageElement>(null);
  const title1 = useRef<HTMLDivElement>(null);
  const title2 = useRef<HTMLDivElement>(null);
  const bottleWrap = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!section.current) return;
    const mm = gsap.matchMedia();

    mm.add(
      {
        isDesktop: '(min-width: 1024px)',
        isMobile: '(max-width: 1023px)',
        reduceMotion: '(prefers-reduced-motion: reduce)',
      },
      (context) => {
        const { isDesktop, reduceMotion } = context.conditions as {
          isDesktop: boolean;
          isMobile: boolean;
          reduceMotion: boolean;
        };

        if (reduceMotion) {
          if (production.current) gsap.set(production.current, { autoAlpha: 1 });
          if (year.current) gsap.set(year.current, { autoAlpha: 1, y: 0 });
          if (factoryLayer.current) gsap.set(factoryLayer.current, { opacity: 1 });
          if (title2.current) gsap.set(title2.current, { opacity: 1, y: 0 });
          if (bottleWrap.current) gsap.set(bottleWrap.current, { opacity: 1, y: 0, scale: 1 });
          return;
        }

        // Scene 1 & 2: Coast -> Factory 2026
        gsap.set([production.current, year.current], { autoAlpha: 0 });
        gsap.set(year.current, { y: 32 });
        gsap.set(factory.current, { scale: 1.08, clipPath: 'inset(0 0 100% 0)' });

        gsap.timeline({
          scrollTrigger: {
            trigger: journey.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.7,
            invalidateOnRefresh: true,
          },
        })
          .to(coastImg.current, { scale: 1.16, ease: 'none', duration: 0.42 }, 0)
          .to(production.current, { autoAlpha: 1, duration: 0.18 }, 0.36)
          .to(coast.current, { autoAlpha: 0, duration: 0.18 }, 0.36)
          .to(factory.current, { clipPath: 'inset(0 0 0% 0)', scale: 1, duration: 0.3, ease: 'power2.out' }, 0.4)
          .to(year.current, { autoAlpha: 1, y: 0, duration: 0.18, ease: 'power2.out' }, 0.48);

        // ==================== CINEMATIC BOTTLING SCENE (BAIKAL430 LEVEL) ====================
        if (bottlingCinema.current) {
          gsap.set(conveyorImg.current, { scale: 1.0 });
          gsap.set(factoryLayer.current, { opacity: 0 });
          gsap.set(factoryImg.current, { scale: 1.08, yPercent: 0 });
          gsap.set(title1.current, { opacity: 1, y: 0 });
          gsap.set(title2.current, { opacity: 0, y: 30 });
          gsap.set(bottleWrap.current, {
            opacity: 0,
            y: isDesktop ? 60 : 40,
            scale: 0.92,
          });

          const tlBottling = gsap.timeline({
            scrollTrigger: {
              trigger: bottlingCinema.current,
              start: 'top top',
              end: 'bottom bottom',
              scrub: 0.65,
              invalidateOnRefresh: true,
            },
          });

          // Phase 1: Camera zooms into conveyor bottling line
          tlBottling.to(
            conveyorImg.current,
            {
              scale: 1.10,
              ease: 'none',
              duration: 0.45,
            },
            0
          );

          // Title 1 fades out as the ready-to-ship phase approaches
          tlBottling.to(
            title1.current,
            {
              opacity: 0,
              y: -30,
              ease: 'power2.in',
              duration: 0.22,
            },
            0.24
          );

          // Phase 2: Smooth cinematic cross-fade to finished product (warehouse/plant)
          tlBottling.to(
            factoryLayer.current,
            {
              opacity: 1,
              ease: 'power2.inOut',
              duration: 0.36,
            },
            0.30
          )
            .to(
              factoryImg.current,
              {
                scale: 1.0,
                yPercent: -2,
                ease: 'none',
                duration: 0.50,
              },
              0.32
            )
            .to(
              title2.current,
              {
                opacity: 1,
                y: 0,
                ease: 'power2.out',
                duration: 0.28,
              },
              0.44
            );

          // Phase 3: Real authentic bottle emerges and visually connects to «Где купить»
          tlBottling.to(
            bottleWrap.current,
            {
              opacity: 1,
              y: 0,
              scale: 1,
              ease: 'power3.out',
              duration: 0.32,
            },
            0.56
          );
        }
      },
      section
    );

    return () => mm.revert();
  }, []);

  return (
    <section ref={section} id="history" className="history-story" aria-labelledby="history-title">
      {/* Coast -> Factory 2026 Journey */}
      <div ref={journey} className="history-story__journey">
        <div className="history-story__stage">
          <div ref={coast} className="history-story__scene history-story__coast">
            <img
              ref={coastImg}
              src={assetUrl('assets/crimea-west-hd.png')}
              alt="Образ побережья западного Крыма"
              width={1679}
              height={937}
              loading="lazy"
            />
            <div className="history-story__coast-copy container">
              <span className="history-story__eyebrow">Западный Крым · озеро Богайлы</span>
              <h2 id="history-title" className="section-title">Как всё начиналось</h2>
              <p>В начале 2000-х наша семья нашла источник близ озера Богайлы. Здесь начался наш путь к собственной питьевой воде.</p>
            </div>
          </div>
          <div ref={production} className="history-story__scene history-story__production">
            <div className="history-story__production-copy">
              <span className="history-story__eyebrow">От идеи к собственному производству</span>
              <span ref={year} className="history-story__year">2026</span>
              <p>Семейный проект вырос в производство воды «Природный Элемент».</p>
            </div>
            <img
              ref={factory}
              className="history-story__factory"
              src={assetUrl('assets/factory.webp')}
              alt="Завод питьевой воды «Природный Элемент»"
              width={1170}
              height={971}
              loading="lazy"
            />
          </div>
        </div>
      </div>

      {/* ==================== CINEMATIC SCENE: ОТ ИСТОЧНИКА ДО КАЖДОЙ БУТЫЛКИ ==================== */}
      <div
        ref={bottlingCinema}
        className="bottling-cinema"
        aria-label="Линия розлива и готовая продукция Природный Элемент"
      >
        <div className="bottling-cinema__stage">
          {/* Layer 1: Линия розлива (conveyor.webp) */}
          <div className="bottling-cinema__layer bottling-cinema__layer--conveyor">
            <img
              ref={conveyorImg}
              src={assetUrl('assets/conveyor.webp')}
              alt="Линия розлива воды «Природный Элемент»"
              width={1833}
              height={858}
              loading="lazy"
              decoding="async"
              className="bottling-cinema__bg-img"
            />
            <div className="bottling-cinema__scrim bottling-cinema__scrim--deep" aria-hidden="true" />
          </div>

          {/* Layer 2: Готовая продукция (production-room.webp) */}
          <div ref={factoryLayer} className="bottling-cinema__layer bottling-cinema__layer--factory">
            <img
              ref={factoryImg}
              src={assetUrl('assets/production-room.webp')}
              alt="Готовая продукция воды «Природный Элемент» к отправке"
              width={2400}
              height={1600}
              loading="lazy"
              decoding="async"
              className="bottling-cinema__bg-img"
            />
            <div className="bottling-cinema__scrim bottling-cinema__scrim--ambient" aria-hidden="true" />
          </div>

          {/* Foreground Cinematic Typography & Real Bottle Handoff */}
          <div className="container bottling-cinema__content">
            <div className="bottling-cinema__text-col">
              {/* Scene 1: От источника — к каждой бутылке */}
              <div ref={title1} className="bottling-cinema__title-pane bottling-cinema__title-pane--1">
                <h3 className="bottling-cinema__heading">
                  От источника —<br />к каждой бутылке
                </h3>
                <p className="bottling-cinema__sub">
                  Бережный розлив на собственном производстве в Крыму.
                </p>
              </div>

              {/* Scene 2: Готова отправиться к вам */}
              <div ref={title2} className="bottling-cinema__title-pane bottling-cinema__title-pane--2">
                <h3 className="bottling-cinema__heading">
                  Готова отправиться<br />к вам
                </h3>
                <p className="bottling-cinema__sub">
                  От производства — к вашему дому.
                </p>
                <div className="bottling-cinema__action">
                  <a href="#where-to-buy" className="bottling-cinema__btn">
                    <span>Где купить</span>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <path
                        d="M7 2V12M7 12L2.5 7.5M7 12L11.5 7.5"
                        stroke="currentColor"
                        strokeWidth="1.35"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Real Bottle Silhouette Handoff */}
            <div ref={bottleWrap} className="bottling-cinema__bottle-pane" aria-hidden="true">
              <div className="bottling-cinema__bottle-aura" />
              <img
                src={assetUrl('assets/bottle-hero.webp')}
                alt="Бутылка воды Природный Элемент"
                width={500}
                height={1850}
                loading="lazy"
                decoding="async"
                className="bottling-cinema__bottle-img"
              />
              <div className="bottling-cinema__bottle-shadow" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
