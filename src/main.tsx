import * as Sentry from '@sentry/react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.scss';
import reportWebVitals from './reportWebVitals';

Sentry.init({
  dsn: import.meta.env.VITE_DNS_SENTRY,
  debug: false,
  environment: import.meta.env.VITE_NODE_ENV!,
  integrations: [Sentry.browserTracingIntegration()],
  tracesSampleRate: 1.0,
  tracePropagationTargets: [
    'localhost',
    import.meta.env.VITE_BASE_URL!,
    import.meta.env.VITE_SITE_URI!,
  ],
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
