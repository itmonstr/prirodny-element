import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { assetUrl } from '../utils/assetUrl';

gsap.registerPlugin(ScrollTrigger);

export function HistorySection() {
  const section = useRef<HTMLElement>(null);
  const coast = useRef<HTMLDivElement>(null);
  const coastImg = useRef<HTMLImageElement>(null);
  const production = useRef<HTMLDivElement>(null);
  const factory = useRef<HTMLImageElement>(null);
  const year = useRef<HTMLSpanElement>(null);
  const conveyor = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (!section.current) return;
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.set([production.current, year.current, conveyor.current], { autoAlpha: 0 });
      gsap.set(year.current, { y: 32 });
      gsap.set(conveyor.current, { y: 28, clipPath: 'inset(100% 0 0 0)' });
      gsap.set(factory.current, { scale: 1.08, clipPath: 'inset(0 0 100% 0)' });
      gsap.timeline({ scrollTrigger: { trigger: section.current, start: 'top top', end: 'bottom bottom', scrub: .7, invalidateOnRefresh: true } })
        .to(coastImg.current, { scale: 1.16, ease: 'none', duration: .42 }, 0)
        .to(production.current, { autoAlpha: 1, duration: .18 }, .36)
        .to(coast.current, { autoAlpha: 0, duration: .18 }, .36)
        .to(factory.current, { clipPath: 'inset(0 0 0% 0)', scale: 1, duration: .3, ease: 'power2.out' }, .4)
        .to(year.current, { autoAlpha: 1, y: 0, duration: .18, ease: 'power2.out' }, .48)
        .to(conveyor.current, { autoAlpha: 1, y: 0, clipPath: 'inset(0% 0 0 0)', duration: .22, ease: 'power2.out' }, .72);
    });
    return () => mm.revert();
  }, []);

  return <section ref={section} id="history" className="history-story" aria-labelledby="history-title">
    <div className="history-story__stage">
      <div ref={coast} className="history-story__scene history-story__coast">
        <img ref={coastImg} src={assetUrl('assets/crimea-west-hd.png')} alt="Образ побережья западного Крыма" width={1679} height={937} loading="lazy" />
        <div className="history-story__coast-copy container"><span className="history-story__eyebrow">Западный Крым · озеро Богайлы</span><h2 id="history-title" className="section-title">Как всё начиналось</h2><p>В начале 2000-х наша семья нашла источник близ озера Богайлы. Здесь начался наш путь к собственной питьевой воде.</p></div>
      </div>
      <div ref={production} className="history-story__scene history-story__production">
        <div className="history-story__production-copy"><span className="history-story__eyebrow">От идеи к собственному производству</span><span ref={year} className="history-story__year">2026</span><p>Семейный проект вырос в производство воды «Природный Элемент».</p></div>
        <img ref={factory} className="history-story__factory" src={assetUrl('assets/factory.webp')} alt="Завод питьевой воды «Природный Элемент»" width={1170} height={971} loading="lazy" />
        <figure ref={conveyor} className="history-story__conveyor"><img src={assetUrl('assets/conveyor.webp')} alt="Линия розлива воды «Природный Элемент»" width={932} height={436} loading="lazy" /><figcaption>Розлив у источника</figcaption></figure>
      </div>
    </div>
  </section>;
}
