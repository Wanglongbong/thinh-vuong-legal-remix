import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from '@/components/error-boundary';
import './index.css';

// Guard against unhandled cross-origin runtime exceptions crashing the host
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    console.error('[Thịnh Vượng Legal Runtime Error]:', event.message, event.filename, event.lineno, event.error);
  });
  window.addEventListener('unhandledrejection', (event) => {
    console.warn('[Thịnh Vượng Legal Unhandled Promise Rejection]:', event.reason);
  });
}

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>,
  );
}
