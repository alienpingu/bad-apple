import { UNIQUE_CSS, FRAME_INDEX_MAP, TOTAL_FRAMES } from './frames.js';
import type { PlayerState } from './types.js';

const FPS = 30;
const FRAME_INTERVAL = 1000 / FPS;

const state: PlayerState = {
  frameIndex: 0,
  lastFrameTime: 0,
  isPlaying: false,
  rafId: null,
};

function playLoop(timestamp: number): void {
  if (!state.isPlaying) return;

  if (timestamp - state.lastFrameTime >= FRAME_INTERVAL) {
    const uniqueIdx = FRAME_INDEX_MAP[state.frameIndex];
    console.log('%c ', UNIQUE_CSS[uniqueIdx]);
    state.frameIndex = (state.frameIndex + 1) % TOTAL_FRAMES;
    state.lastFrameTime = timestamp;
  }

  state.rafId = requestAnimationFrame(playLoop);
}

export function startPlayback(): void {
  if (state.isPlaying) return;
  state.isPlaying = true;
  state.lastFrameTime = performance.now();
  state.rafId = requestAnimationFrame(playLoop);

  const status = document.getElementById('status');
  if (status) {
    status.textContent = `Playing ${TOTAL_FRAMES} frames @ ${FPS}fps — scaled ${120 * 4}x${90 * 4}`;
  }

  console.log('%c Bad Apple! Starting playback...', 'color: #888; font-size: 12px;');
}

export function stopPlayback(): void {
  state.isPlaying = false;
  if (state.rafId !== null) {
    cancelAnimationFrame(state.rafId);
    state.rafId = null;
  }
}

export function isPlaying(): boolean {
  return state.isPlaying;
}
