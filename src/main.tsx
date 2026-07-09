import React from 'react';
import ReactDOM from 'react-dom/client';
import { SplashScreen } from '@capacitor/splash-screen';
import App from './App';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

SplashScreen.hide().catch(() => undefined);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const swPath = `${import.meta.env.BASE_URL}service-worker.js`;
    navigator.serviceWorker.register(swPath).catch(() => undefined);
  });
}
