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
  const bottling = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!section.current) return;
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.set([production.current, year.current], { autoAlpha: 0 });
      gsap.set(year.current, { y: 32 });
      gsap.set(factory.current, { scale: 1.08, clipPath: 'inset(0 0 100% 0)' });
      gsap.timeline({ scrollTrigger: { trigger: journey.current, start: 'top top', end: 'bottom bottom', scrub: .7, invalidateOnRefresh: true } })
        .to(coastImg.current, { scale: 1.16, ease: 'none', duration: .42 }, 0)
        .to(production.current, { autoAlpha: 1, duration: .18 }, .36)
        .to(coast.current, { autoAlpha: 0, duration: .18 }, .36)
        .to(factory.current, { clipPath: 'inset(0 0 0% 0)', scale: 1, duration: .3, ease: 'power2.out' }, .4)
        .to(year.current, { autoAlpha: 1, y: 0, duration: .18, ease: 'power2.out' }, .48);
      gsap.fromTo(bottling.current, { opacity: 0, y: 40 }, {
        opacity: 1, y: 0, ease: 'power2.out', duration: .8,
        scrollTrigger: { trigger: bottling.current, start: 'top 82%' },
      });
    });
    return () => mm.revert();
  }, []);

  return <section ref={section} id="history" className="history-story" aria-labelledby="history-title">
    <div ref={journey} className="history-story__journey">
    <div className="history-story__stage">
      <div ref={coast} className="history-story__scene history-story__coast">
        <img ref={coastImg} src={assetUrl('assets/crimea-west-hd.png')} alt="Образ побережья западного Крыма" width={1679} height={937} loading="lazy" />
        <div className="history-story__coast-copy container"><span className="history-story__eyebrow">Западный Крым · озеро Богайлы</span><h2 id="history-title" className="section-title">Как всё начиналось</h2><p>В начале 2000-х наша семья нашла источник близ озера Богайлы. Здесь начался наш путь к собственной питьевой воде.</p></div>
      </div>
      <div ref={production} className="history-story__scene history-story__production">
        <div className="history-story__production-copy"><span className="history-story__eyebrow">От идеи к собственному производству</span><span ref={year} className="history-story__year">2026</span><p>Семейный проект вырос в производство воды «Природный Элемент».</p></div>
        <img ref={factory} className="history-story__factory" src={assetUrl('assets/factory.webp')} alt="Завод питьевой воды «Природный Элемент»" width={1170} height={971} loading="lazy" />
      </div>
    </div>
    </div>
    <div ref={bottling} className="history-bottling container">
      <header className="history-bottling__header">
        <span className="history-story__eyebrow">Бережное производство</span>
        <h3>От источника<br />до каждой бутылки</h3>
      </header>
      <article className="history-bottling__story">
        <figure className="history-bottling__image"><img src={assetUrl('assets/conveyor-hd.png')} alt="Линия розлива воды «Природный Элемент»" width={1833} height={858} loading="lazy" /></figure>
        <div className="history-bottling__story-copy"><span className="history-bottling__number">01 / Розлив</span><h4>Вода становится частью каждого дня</h4><p>На линии розлива воду бережно наполняют в бутылки рядом с источником.</p></div>
      </article>
      <article className="history-bottling__story history-bottling__story--reverse">
        <figure className="history-bottling__image"><img src={assetUrl('assets/production-room.jpg')} alt="Производственный цех с подготовленными к отгрузке бутылками воды" width={2400} height={1600} loading="lazy" /></figure>
        <div className="history-bottling__story-copy"><span className="history-bottling__number">02 / Готовая продукция</span><h4>От производства — к вам</h4><p>Готовые бутылки собирают в партии и готовят к отправке.</p></div>
      </article>
    </div>
  </section>;
}
