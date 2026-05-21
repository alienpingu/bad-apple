import { FRAMES, TOTAL_FRAMES } from './frames.js';

const FPS = 30;
const FRAME_INTERVAL = 1000 / FPS;

// Scale up the 120x90 images to display at 480x360 in the console
// (4x scale via CSS padding — browser upscales the image)
const DISPLAY_WIDTH = 120 * 4;
const DISPLAY_HEIGHT = 90 * 4;

// Pre-process all frames once: replace the small padding with scaled-up padding.
// This avoids regex/string manipulation inside the hot 30fps loop.
const SCALED_FRAMES = FRAMES.map(css =>
  css.replace(
    /padding:\s*45px\s+60px/,
    `padding: ${DISPLAY_HEIGHT / 2}px ${DISPLAY_WIDTH / 2}px`
  )
);

let frameIndex = 0;
let lastFrameTime = 0;
let isPlaying = false;
let rafId = null;

// ---- Playback Loop ----

function playLoop(timestamp) {
  if (!isPlaying) return;

  // Exact 30fps timing using elapsed time
  if (timestamp - lastFrameTime >= FRAME_INTERVAL) {
    // No console.clear() — frames scroll through console history.
    // This prevents the flashing that causes nausea.
    console.log('%c ', SCALED_FRAMES[frameIndex]);

    // Advance and loop
    frameIndex = (frameIndex + 1) % TOTAL_FRAMES;
    lastFrameTime = timestamp;
  }

  rafId = requestAnimationFrame(playLoop);
}

function startPlayback() {
  if (isPlaying) return;
  isPlaying = true;
  lastFrameTime = performance.now();
  rafId = requestAnimationFrame(playLoop);

  // Update UI
  const status = document.getElementById('status');
  if (status) status.textContent = `Playing ${TOTAL_FRAMES} frames @ 30fps — scaled ${DISPLAY_WIDTH}x${DISPLAY_HEIGHT}`;

  console.log('%c Bad Apple! Starting playback...', 'color: #888; font-size: 12px;');
}

// ---- DevTools Detection ----

function isDevToolsOpen() {
  const threshold = 200;
  const widthDiff = window.outerWidth - window.innerWidth;
  const heightDiff = window.outerHeight - window.innerHeight;
  return widthDiff > threshold || heightDiff > threshold;
}

// Check immediately on load
if (isDevToolsOpen()) {
  console.log('DevTools detected on load. Starting playback...');
  startPlayback();
}

// Poll for DevTools opening (dock mode)
const devtoolsInterval = setInterval(() => {
  if (isDevToolsOpen() && !isPlaying) {
    console.log('DevTools opened! Starting playback...');
    startPlayback();
  }
}, 500);

// Also detect via console API profiling trick
let checkCount = 0;
const checkDevToolsProfiling = () => {
  const start = performance.now();
  console.profile();
  console.profileEnd();
  if (performance.now() - start > 100) {
    if (!isPlaying) startPlayback();
  }
  checkCount++;
  if (checkCount < 20) setTimeout(checkDevToolsProfiling, 1000);
};
checkDevToolsProfiling();

// Playback starts strictly when DevTools is opened.
