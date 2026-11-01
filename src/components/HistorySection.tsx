import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { assetUrl } from '../utils/assetUrl';

gsap.registerPlugin(ScrollTrigger);

export function HistorySection() {
  const section = useRef<HTMLElement>(null);
  const coast = useRef<HTMLDivElement>(null);
  const coastImg = useRef<HTMLImageElement>(null);
  const map = useRef<HTMLDivElement>(null);
  const route = useRef<SVGPathElement>(null);
  const marker = useRef<SVGGElement>(null);
  const production = useRef<HTMLDivElement>(null);
  const year = useRef<HTMLSpanElement>(null);
  const conveyor = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (!section.current || !route.current) return;
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const path = route.current!;
      const length = path.getTotalLength();
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
      gsap.set([map.current, production.current, marker.current, year.current, conveyor.current], { autoAlpha: 0 });
      gsap.set(year.current, { y: 30 });
      gsap.set(conveyor.current, { y: 24 });
      gsap.set(marker.current, { scale: .7, transformOrigin: '176px 180px' });
      gsap.timeline({ scrollTrigger: { trigger: section.current, start: 'top top', end: 'bottom bottom', scrub: .7, invalidateOnRefresh: true } })
        .to(coastImg.current, { scale: 1.16, ease: 'none', duration: .34 }, 0)
        .to(coast.current, { autoAlpha: 0, duration: .15 }, .28)
        .to(map.current, { autoAlpha: 1, duration: .15 }, .29)
        .to(path, { strokeDashoffset: 0, ease: 'none', duration: .2 }, .4)
        .to(marker.current, { autoAlpha: 1, scale: 1, duration: .1 }, .57)
        .to(map.current, { autoAlpha: 0, duration: .14 }, .65)
        .to(production.current, { autoAlpha: 1, duration: .14 }, .66)
        .to(year.current, { autoAlpha: 1, y: 0, duration: .12 }, .72)
        .to(conveyor.current, { autoAlpha: 1, y: 0, duration: .12 }, .83);
    });
    return () => mm.revert();
  }, []);

  return <section ref={section} id="history" className="history-story" aria-labelledby="history-title">
    <div className="history-story__stage">
      <div ref={coast} className="history-story__scene history-story__coast">
        <img ref={coastImg} src={assetUrl('assets/crimea-west.webp')} alt="Побережье западного Крыма близ озера Богайлы" width={1376} height={768} loading="lazy" />
        <div className="history-story__coast-copy container"><span className="history-story__eyebrow">Западный Крым · озеро Богайлы</span><h2 id="history-title" className="section-title">Как всё начиналось</h2><p>В начале 2000-х наша семья открыла здесь артезианский источник. Так началась история воды «Природный Элемент».</p></div>
      </div>
      <div ref={map} className="history-story__scene history-story__map">
        <div className="history-story__map-copy"><span className="history-story__eyebrow">От побережья — к источнику</span><h3>Точка на карте.<br />Начало пути.</h3><p>Сакский район, близ села Фрунзе. Глубина скважины — 80 метров.</p></div>
        <svg viewBox="0 0 560 320" role="img" aria-label="Маршрут к источнику близ села Фрунзе на карте Крыма">
          <path d="M 218 36 L 246 52 L 266 46 L 292 72 L 325 90 L 342 120 L 368 142 L 398 146 L 434 134 L 478 130 L 518 142 L 528 158 L 498 182 L 462 186 L 424 184 L 388 200 L 348 222 L 304 256 L 252 286 L 202 296 L 174 280 L 168 252 L 182 226 L 184 196 C 182 178 168 162 146 154 L 106 150 L 64 138 L 48 124 L 76 106 L 122 98 L 164 82 L 194 54 Z" fill="#dcecf7" stroke="#123c69" strokeWidth="2" />
          <path ref={route} d="M 393 177 Q 298 139 176 180" fill="none" stroke="#123c69" strokeWidth="3" strokeLinecap="round" />
          <g ref={marker}><circle cx="176" cy="180" r="19" fill="#a9d8f0" opacity=".55"/><circle cx="176" cy="180" r="6" fill="#123c69" stroke="white" strokeWidth="2"/><text x="186" y="219" fill="#123c69" fontSize="15">с. Фрунзе · оз. Богайлы</text></g>
        </svg>
      </div>
      <div ref={production} className="history-story__scene history-story__production">
        <img className="history-story__factory" src={assetUrl('assets/factory.webp')} alt="Завод розлива воды в селе Фрунзе" width={1170} height={971} loading="lazy" />
        <div className="history-story__production-copy"><span ref={year} className="history-story__year">2026</span><p>Семейный проект вырос в собственное производство воды.</p></div>
        <figure ref={conveyor} className="history-story__conveyor"><img src={assetUrl('assets/conveyor.webp')} alt="Линия розлива воды «Природный Элемент»" width={932} height={436} loading="lazy" /><figcaption>Бережный розлив у источника</figcaption></figure>
      </div>
    </div>
  </section>;
}
