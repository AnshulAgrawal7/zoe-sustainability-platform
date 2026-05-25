import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './utils/i18n'; // must import before App to initialise i18n
import AppRouter from './app/Router';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppRouter />
  </StrictMode>
);
