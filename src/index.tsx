import ReactDOM from 'react-dom/client';
import App from './App';
import { Helmet } from 'react-helmet';
import ErrorBoundary from './components/ErrorBoundry';
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import reportWebVitals from './reportWebVitals';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [new BrowserTracing()],
  tracesSampleRate: 1.0,
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then(registration => {
        console.log('Service worker registered:', registration);
      })
      .catch(error => {
        console.log('Service worker registration failed:', error);
      });
  });
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  // <React.StrictMode>
  <>
    <Helmet>
      <meta
        httpEquiv='Content-Security-Policy'
        content="
            default-src 'self';
            script-src 'self' https://onesignal.com https://cdn.onesignal.com;
            style-src 'self' 'unsafe-inline' https://onesignal.com;
            img-src 'self' https://fastly.picsum.photos;
            font-src 'self' ;
            object-src 'none';
            base-uri 'self';
            form-action 'self';
            connect-src 'self' http://localhost:3000 https://onesignal.com ws://localhost:3000 https://o4504905475424256.ingest.sentry.io;
            child-src 'self';
            frame-src 'self';
            manifest-src 'self';
            prefetch-src 'self';
            worker-src 'self';
            script-src-attr 'none';
            upgrade-insecure-requests;
            block-all-mixed-content;
          "
      />
    </Helmet>
    <ErrorBoundary fallback={<p>Something went wrong!</p>}>
      <App />
    </ErrorBoundary>
  </>
  // </React.StrictMode>
);
reportWebVitals(console.log);
