
/* ==========================================================
   ST GEORGE YOUTH — PWA APPLICATION CONTROLLER
   Installation • Service Worker • Update Detection
========================================================== */

(() => {

  'use strict';

  /* --------------------------------------------------------
     CONFIGURATION
  -------------------------------------------------------- */

  const INSTALL_BUTTON = '[data-install]';

  // IMPORTANT: Must match your actual service worker filename.
  const SERVICE_WORKER = './service.js';

  const installButton = document.querySelector(INSTALL_BUTTON);

  let deferredInstallPrompt = null;
  let isInstalling = false;


  /* --------------------------------------------------------
     DETECT INSTALLED APPLICATION
  -------------------------------------------------------- */

  function isRunningInstalled() {

    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true
    );

  }


  /* --------------------------------------------------------
     DETECT PLATFORM
  -------------------------------------------------------- */

  function getPlatform() {

    const ua = navigator.userAgent || '';

    const isAppleMobile =
      /iPhone|iPad|iPod/i.test(ua) ||
      (
        navigator.platform === 'MacIntel' &&
        navigator.maxTouchPoints > 1
      );

    if (isAppleMobile) {
      return 'ios';
    }

    if (/Android/i.test(ua)) {
      return 'android';
    }

    if (/Windows/i.test(ua)) {
      return 'windows';
    }

    if (/Macintosh|Mac OS X/i.test(ua)) {
      return 'macos';
    }

    if (/Linux/i.test(ua)) {
      return 'linux';
    }

    return 'unknown';

  }


  /* --------------------------------------------------------
     INSTALL BUTTON VISIBILITY
  -------------------------------------------------------- */

  function hideInstallButton() {

    if (installButton) {
      installButton.hidden = true;
    }

  }


  function showInstallButton() {

    if (!installButton) return;

    if (isRunningInstalled()) {
      hideInstallButton();
      return;
    }

    installButton.hidden = false;

  }


  /* --------------------------------------------------------
     INSTALL INSTRUCTIONS
  -------------------------------------------------------- */

  function getInstallInstructions() {

    const platform = getPlatform();

    switch (platform) {

      case 'ios':

        return (
          'To install St George Youth:\n\n' +
          '1. Open this website in Safari.\n' +
          '2. Tap the Share button.\n' +
          '3. Select "Add to Home Screen".\n' +
          '4. Tap Add.'
        );

      case 'android':

        return (
          'To install St George Youth:\n\n' +
          '1. Open this website in Chrome.\n' +
          '2. Open the browser menu.\n' +
          '3. Select "Install app" or "Add to Home screen".'
        );

      case 'windows':

        return (
          'To install St George Youth:\n\n' +
          '1. Open this website in Edge or Chrome.\n' +
          '2. Look for the install icon in the address bar.\n' +
          '3. Click Install.'
        );

      case 'macos':

        return (
          'To install St George Youth:\n\n' +
          'In Safari on supported macOS versions:\n' +
          '1. Open the File menu.\n' +
          '2. Select Add to Dock.\n\n' +
          'Alternatively, use Chrome or Edge and select Install app.'
        );

      case 'linux':

        return (
          'To install St George Youth:\n\n' +
          '1. Open this website in Chrome or Chromium.\n' +
          '2. Open the browser menu.\n' +
          '3. Select Install app or Create shortcut.'
        );

      default:

        return (
          'Open this website in a supported browser ' +
          'and look for the Install App option in the browser menu.'
        );

    }

  }


  /* --------------------------------------------------------
     INSTALL APPLICATION
  -------------------------------------------------------- */

  async function installApplication() {

    if (isInstalling) return;

    if (isRunningInstalled()) {

      hideInstallButton();

      return;

    }

    isInstalling = true;

    try {

      /* Native browser installation prompt */

      if (deferredInstallPrompt) {

        const promptEvent = deferredInstallPrompt;

        deferredInstallPrompt = null;

        await promptEvent.prompt();

        const choice = await promptEvent.userChoice;

        if (choice && choice.outcome === 'accepted') {

          console.info(
            '[St George PWA] Installation accepted.'
          );

        } else {

          console.info(
            '[St George PWA] Installation dismissed.'
          );

        }

        hideInstallButton();

        return;

      }


      /* Platform-specific fallback */

      alert(getInstallInstructions());

    } catch (error) {

      console.error(
        '[St George PWA] Installation error:',
        error
      );

      alert(getInstallInstructions());

    } finally {

      isInstalling = false;

    }

  }


  /* --------------------------------------------------------
     INSTALL BUTTON
  -------------------------------------------------------- */

  if (installButton) {

    installButton.addEventListener(
      'click',
      installApplication
    );

    /*
      Prevent the button from appearing if the app
      is already installed.
    */

    if (isRunningInstalled()) {

      hideInstallButton();

    } else {

      installButton.hidden = true;

    }

  }


  /* --------------------------------------------------------
     NATIVE INSTALL PROMPT
  -------------------------------------------------------- */

  window.addEventListener(
    'beforeinstallprompt',
    event => {

      /*
        Prevent automatic browser prompt.
        We will trigger it from the install button.
      */

      event.preventDefault();

      deferredInstallPrompt = event;

      showInstallButton();

      console.info(
        '[St George PWA] Install prompt is available.'
      );

    }
  );


  /* --------------------------------------------------------
     INSTALL COMPLETE
  -------------------------------------------------------- */

  window.addEventListener(
    'appinstalled',
    () => {

      deferredInstallPrompt = null;

      hideInstallButton();

      console.info(
        '[St George PWA] App successfully installed.'
      );

    }
  );


  /* --------------------------------------------------------
     SERVICE WORKER REGISTRATION
  -------------------------------------------------------- */

  async function registerServiceWorker() {

    if (!('serviceWorker' in navigator)) {

      console.info(
        '[St George PWA] Service workers are unsupported.'
      );

      return;

    }

    if (
      !location.protocol.startsWith('http')
    ) {

      console.info(
        '[St George PWA] Service worker requires HTTPS or localhost.'
      );

      return;

    }

    try {

      const registration =
        await navigator.serviceWorker.register(
          SERVICE_WORKER,
          {
            scope: './'
          }
        );

      console.info(
        '[St George PWA] Registered successfully:',
        registration.scope
      );


      /* Check for updates */

      registration.addEventListener(
        'updatefound',
        () => {

          const newWorker = registration.installing;

          if (!newWorker) return;

          newWorker.addEventListener(
            'statechange',
            () => {

              if (
                newWorker.state === 'installed' &&
                navigator.serviceWorker.controller
              ) {

                console.info(
                  '[St George PWA] A new update is ready.'
                );

                /*
                  We deliberately do not automatically
                  reload the page. This prevents losing
                  data or interrupting a user's activity.
                */

              }

            }
          );

        }
      );


      /* Ask browser to check for an update */

      registration.update().catch(error => {

        console.warn(
          '[St George PWA] Update check failed:',
          error
        );

      });


    } catch (error) {

      console.error(
        '[St George PWA] Registration failed:',
        error
      );

    }

  }


  /* --------------------------------------------------------
     STARTUP
  -------------------------------------------------------- */

  if (document.readyState === 'loading') {

    document.addEventListener(
      'DOMContentLoaded',
      registerServiceWorker,
      { once: true }
    );

  } else {

    registerServiceWorker();

  }


})();
