/* eslint-disable no-console */
function registerValidSW(swUrl) {
  navigator.serviceWorker.register(swUrl)
    .catch((error) => {
      console.error('Error during service worker registration:', error);
    });
}

export default function register() {
  if ('serviceWorker' in navigator) {
    const swUrl = 'backend-cache-worker.js';
    registerValidSW(swUrl);
  }
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.unregister();
    });
  }
}
