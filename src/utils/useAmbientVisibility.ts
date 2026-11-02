import { useEffect } from 'react';

/** Pause decorative CSS loops while their scene is outside the viewport. */
export function useAmbientVisibility() {
  useEffect(() => {
    const scenes = document.querySelectorAll('main > section, .finale-footer-wrap');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        (target as HTMLElement).dataset.ambient = isIntersecting ? 'active' : 'paused';
      });
    }, { rootMargin: '100px' });
    scenes.forEach((scene) => observer.observe(scene));
    const updateVisibility = () => {
      document.documentElement.dataset.pageHidden = String(document.hidden);
    };
    updateVisibility();
    document.addEventListener('visibilitychange', updateVisibility);
    return () => {
      observer.disconnect();
      scenes.forEach((scene) => { delete (scene as HTMLElement).dataset.ambient; });
      document.removeEventListener('visibilitychange', updateVisibility);
      delete document.documentElement.dataset.pageHidden;
    };
  }, []);
}
