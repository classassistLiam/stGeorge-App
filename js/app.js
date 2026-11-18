(()=> {
  'use strict';
  const installButton = document.querySelector('[data-install]');
  let installPrompt = null;

  const isStandalone = () =>
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true;

  const showInstallButton = () => {
    if (installButton && !isStandalone()) installButton.hidden = false;
  };

  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    installPrompt = event;
    showInstallButton();
  });

  if (installButton) {
    installButton.addEventListener('click', async () => {
      if (installPrompt) {
        installPrompt.prompt();
        try { await installPrompt.userChoice; } catch (_) {}
        installPrompt = null;
        installButton.hidden = true;
        return;
      }
      const ua = navigator.userAgent || '';
      if (/iphone|ipad|ipod/i.test(ua)) {
        alert('To install: open this page in Safari, tap Share, then choose “Add to Home Screen”.');
      } else if (!isStandalone()) {
        alert('Use your browser menu and choose “Install app” or “Add to Home screen”.');
      }
    });
  }

  window.addEventListener('appinstalled', () => {
    if (installButton) installButton.hidden = true;
    installPrompt = null;
  });

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js', { scope: './' })
        .then(registration => {
          registration.update().catch(() => {});
          registration.addEventListener('updatefound', () => {
            const worker = registration.installing;
            if (!worker) return;
            worker.addEventListener('statechange', () => {
              if (worker.state === 'installed' && navigator.serviceWorker.controller) {
                // A refresh is intentionally not forced; users won't lose in-progress work.
                console.info('A St George Youth update is ready. Reload when convenient.');
              }
            });
          });
        })
        .catch(error => console.warn('St George offline support could not start:', error));
    });
  }
})();