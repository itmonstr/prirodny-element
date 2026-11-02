import { MOTION_DURATION } from '../utils/motion';
import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { assetUrl } from '../utils/assetUrl';

gsap.registerPlugin(ScrollTrigger);

interface HistorySectionProps {
  onDarkSceneChange?: (isDark: boolean) => void;
}

export function HistorySection({ onDarkSceneChange }: HistorySectionProps = {}) {
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

  useLayoutEffect(() => {
    if (!section.current) return;
    const mm = gsap.matchMedia();

    const updateHeader = () => {
      const atBottling = (bottlingCinema.current?.getBoundingClientRect().top ?? Infinity) <= 72;
      const mobile = window.matchMedia('(max-width: 1023px)').matches;
      const bounds = production.current?.getBoundingClientRect();
      const onLightScene = mobile
        ? !!bounds && bounds.top <= 72 && bounds.bottom > 72
        : Number(production.current?.style.opacity ?? 0) > 0.5 && !atBottling;
      onDarkSceneChange?.(!onLightScene);
    };
    const themeTrigger = ScrollTrigger.create({
      trigger: section.current,
      start: 'top 72px', end: 'bottom 72px',
      onUpdate: (self) => { if (self.isActive) updateHeader(); },
      onEnter: updateHeader, onEnterBack: updateHeader,
      onLeave: () => onDarkSceneChange?.(false),
      onLeaveBack: () => onDarkSceneChange?.(false),
    });

    mm.add(
      {
        isDesktop: '(min-width: 1024px)',
        isMobile: '(max-width: 1023px)',
        reduceMotion: '(prefers-reduced-motion: reduce)',
      },
      (context) => {
        const { reduceMotion } = context.conditions as {
          reduceMotion: boolean;
        };

        if (context.conditions?.isMobile) {
          // On mobile, keep layout solid and stable in native flow without jarring 16px jumps or opacity blinking
          gsap.set([production.current, year.current, factory.current, factoryLayer.current], { autoAlpha: 1 });
          gsap.set(coast.current, { autoAlpha: 1 });
          if (!reduceMotion) {
            // Animate content in place. Never detach a scene from document flow.
            const copy = section.current?.querySelectorAll(
              '.history-story__coast-copy, .bottling-cinema__mobile-copy'
            );
            gsap.fromTo(production.current, { opacity: 0, y: 16 }, {
              opacity: 1, y: 0, duration: MOTION_DURATION, ease: 'sine.out',
              scrollTrigger: { trigger: production.current, start: 'top 85%', once: true },
            });
            section.current?.querySelectorAll('.bottling-cinema__layer').forEach((item) => {
              gsap.fromTo(item, { opacity: 0 }, {
                opacity: 1, duration: MOTION_DURATION, ease: 'sine.inOut',
                scrollTrigger: { trigger: item, start: 'top 90%', once: true },
              });
            });
            copy?.forEach((item) => {
              gsap.fromTo(item, { opacity: 0, y: 12 }, {
                opacity: 1, y: 0, duration: MOTION_DURATION, ease: 'sine.out',
                scrollTrigger: { trigger: item, start: 'top 95%', once: true },
              });
            });
          }
          return;
        }

        if (reduceMotion) {
          if (production.current) gsap.set(production.current, { autoAlpha: 1 });
          if (year.current) gsap.set(year.current, { autoAlpha: 1, y: 0 });
          if (factoryLayer.current) gsap.set(factoryLayer.current, { opacity: 1 });
          if (title2.current) gsap.set(title2.current, { opacity: 1, y: 0 });
          return;
        }

        // Each scroll threshold starts one transition with a shared duration.
        gsap.set([production.current, year.current, factory.current], { autoAlpha: 0 });
        gsap.set(year.current, { y: 16 });
        const story = gsap.timeline({
          paused: true, defaults: { duration: MOTION_DURATION, ease: 'sine.inOut' },
          onUpdate: updateHeader,
        })
          .to(coast.current, { autoAlpha: 0 }, 0)
          .to([production.current, year.current, factory.current], { autoAlpha: 1, y: 0 }, 0);
        let productionShown = false;
        ScrollTrigger.create({
          trigger: journey.current, start: 'top top', end: 'bottom bottom',
          onUpdate: (self) => {
            const shown = self.progress >= 0.4;
            if (shown === productionShown) return;
            productionShown = shown;
            if (shown) story.play(); else story.reverse();
          },
        });
        gsap.set([conveyorImg.current, factoryImg.current], { clearProps: 'transform' });
        gsap.set(factoryLayer.current, { opacity: 0 });
        gsap.set(title1.current, { opacity: 1, y: 0 });
        gsap.set(title2.current, { opacity: 0, y: 12 });
        const bottling = gsap.timeline({ paused: true, defaults: { duration: MOTION_DURATION, ease: 'sine.inOut' } })
          .to(title1.current, { opacity: 0, y: -12 }, 0)
          .to(factoryLayer.current, { opacity: 1 }, 0)
          .to(title2.current, { opacity: 1, y: 0 }, 0);
        let readyShown = false;
        ScrollTrigger.create({
          trigger: bottlingCinema.current, start: 'top top', end: 'bottom bottom',
          onUpdate: (self) => {
            const shown = self.progress >= 0.4;
            if (shown === readyShown) return;
            readyShown = shown;
            if (shown) bottling.play(); else bottling.reverse();
          },
        });

      },
      section
    );

    return () => { themeTrigger.kill(); mm.revert(); };
  }, []);

  return (
    <section ref={section} id="history" className="history-story" aria-labelledby="history-title">
      {/* Coast -> Factory 2026 Journey */}
      <div ref={journey} className="history-story__journey">
        <div className="history-story__stage">
          <div ref={coast} className="history-story__scene history-story__coast">
            <img
              ref={coastImg}
              src={assetUrl('assets/crimea-west-hd.webp')}
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
              src={assetUrl('assets/factory-exterior-01.webp')}
              alt="Завод питьевой воды «Природный Элемент»"
              width={3200}
              height={2133}
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
            <div className="bottling-cinema__mobile-copy">
              <h3 className="bottling-cinema__heading">От источника —<br />к каждой бутылке</h3>
              <p className="bottling-cinema__sub">Бережный розлив на собственном производстве в Крыму.</p>
            </div>
          </div>

          {/* Layer 2: Готовая продукция (production-room.webp) */}
          <div ref={factoryLayer} className="bottling-cinema__layer bottling-cinema__layer--factory">
            <img
              ref={factoryImg}
              src={assetUrl('assets/factory-ready.webp')}
              alt="Готовая продукция воды «Природный Элемент» к отправке"
              width={1672}
              height={941}
              loading="lazy"
              decoding="async"
              className="bottling-cinema__bg-img"
            />
            <div className="bottling-cinema__scrim bottling-cinema__scrim--ambient" aria-hidden="true" />
            <div className="bottling-cinema__mobile-copy">
              <h3 className="bottling-cinema__heading">Готова отправиться<br />к вам</h3>
              <p className="bottling-cinema__sub">От производства — к вашему дому.</p>
              <a href="#where-to-buy" className="bottling-cinema__btn">Где купить ↓</a>
            </div>
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

          </div>
        </div>
      </div>
    </section>
  );
}
