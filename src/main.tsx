import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { SiteLoader } from './components/SiteLoader';
import './styles.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SiteLoader><App /></SiteLoader>
  </StrictMode>
);
