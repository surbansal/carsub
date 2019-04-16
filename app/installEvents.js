/* eslint-disable no-console */
let deferredPrompt;
export function addToHomeScreen() {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the prompt');
      } else {
        console.log('User dismissed the prompt');
      }
      deferredPrompt = null;
    });
  }
}

export function mathesPromptCriteria() {
  return !!deferredPrompt;
}

export default function registerEvents() {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
  });

  window.addEventListener('appinstalled', (e) => {
    // Add cookie to track installed app?
    console.log(e);
  });
}
