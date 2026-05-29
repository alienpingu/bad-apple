import { startPlayback } from './player.js';

function isDevToolsOpen(): boolean {
  const threshold = 200;
  const widthDiff = window.outerWidth - window.innerWidth;
  const heightDiff = window.outerHeight - window.innerHeight;
  return widthDiff > threshold || heightDiff > threshold;
}

function checkProfiling(): void {
  let checkCount = 0;
  const run = () => {
    const start = performance.now();
    console.profile();
    console.profileEnd();
    if (performance.now() - start > 100) {
      startPlayback();
    }
    checkCount++;
    if (checkCount < 20) setTimeout(run, 1000);
  };
  run();
}

export function initDevToolsDetection(): void {
  if (typeof window === 'undefined') return;

  if (isDevToolsOpen()) {
    console.log('DevTools detected on load. Starting playback...');
    startPlayback();
  }

  setInterval(() => {
    if (isDevToolsOpen()) {
      startPlayback();
    }
  }, 500);

  checkProfiling();
}
