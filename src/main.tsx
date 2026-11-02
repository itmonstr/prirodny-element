import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { App } from './App';
import { SiteLoader } from './components/SiteLoader';
import './styles.css';

gsap.registerPlugin(ScrollTrigger);

// Prevent mobile address bar show/hide from thrashing ScrollTrigger calculations and causing jerky frames
ScrollTrigger.config({
  ignoreMobileResize: true,
  autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load',
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SiteLoader><App /></SiteLoader>
  </StrictMode>
);
