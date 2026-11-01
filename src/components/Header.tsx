import { useEffect, useState } from 'react';
import { assetUrl } from '../utils/assetUrl';

interface HeaderProps {
  isDarkScene: boolean;
  onOrderClick: () => void;
}

const NAV_ITEMS = [
  { href: '#source', label: 'Источник' },
  { href: '#formats', label: 'Форматы' },
  { href: '#history', label: 'История' },
  { href: '#where-to-buy', label: 'Где купить' },
  { href: '#contacts', label: 'Контакты' },
];

export function Header({ isDarkScene, onOrderClick }: HeaderProps) {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 36);
      if (y > 220 && y > lastY + 8 && !mobileOpen) {
        setHidden(true);
      } else if (y < lastY - 6 || y <= 120) {
        setHidden(false);
      }
      lastY = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [mobileOpen]);

  const handleNavClick = () => {
    setMobileOpen(false);
  };

  const isTopHero = !scrolled;
  const invertTheme = isDarkScene && !isTopHero && !mobileOpen;

  return (
    <>
      <header
        className={[
          'site-header',
          scrolled ? 'is-scrolled' : '',
          hidden ? 'is-hidden' : '',
          invertTheme ? 'is-dark-scene' : '',
          mobileOpen ? 'is-menu-open' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <div className="site-header__inner">
          <a href="#top" className="site-header__brand" aria-label="Природный Элемент — На главную">
            <img
              src={invertTheme ? assetUrl('assets/logo-white.webp') : assetUrl('assets/logo-dark.webp')}
              alt="Природный Элемент"
              width={593}
              height={276}
              className="site-header__logo"
            />
          </a>

          <nav className="site-header__nav" aria-label="Основная навигация">
            {NAV_ITEMS.map((item) => (
              <a key={item.href} href={item.href} className="site-header__link">
                {item.label}
              </a>
            ))}
          </nav>

          <div className="site-header__actions">
            <button
              type="button"
              className="btn-pill btn-pill--header"
              onClick={onOrderClick}
            >
              Заказать воду
            </button>

            <button
              type="button"
              className="site-header__burger"
              aria-expanded={mobileOpen}
              aria-controls="mobile-navigation-drawer"
              aria-label={mobileOpen ? 'Закрыть меню' : 'Открыть меню'}
              onClick={() => setMobileOpen((prev) => !prev)}
            >
              <span className="site-header__burger-line" />
              <span className="site-header__burger-line" />
            </button>
          </div>
        </div>
      </header>

      <div
        id="mobile-navigation-drawer"
        className={`mobile-menu ${mobileOpen ? 'is-open' : ''}`}
        aria-hidden={!mobileOpen}
      >
        <div className="mobile-menu__inner">
          <nav className="mobile-menu__nav" aria-label="Мобильная навигация">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="mobile-menu__link"
                onClick={handleNavClick}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="mobile-menu__footer">
            <button
              type="button"
              className="btn-pill btn-pill--primary mobile-menu__cta"
              onClick={() => {
                setMobileOpen(false);
                onOrderClick();
              }}
            >
              Заказать воду
            </button>

            <div className="mobile-menu__contacts">
              <a href="tel:+79780207500" className="mobile-menu__contact-link">
                +7 978 020-75-00
              </a>
              <a href="mailto:matushka-voditsa@mail.ru" className="mobile-menu__contact-link">
                matushka-voditsa@mail.ru
              </a>
              <p className="mobile-menu__address">
                Республика Крым, Сакский район, с. Фрунзе
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
