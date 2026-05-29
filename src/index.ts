export { startPlayback, stopPlayback, isPlaying } from './player.js';
export { initDevToolsDetection } from './detect.js';
export { TOTAL_FRAMES } from './frames.js';
import { initDevToolsDetection } from './detect.js';

// Auto-init in browser
if (typeof window !== 'undefined') {
  initDevToolsDetection();
}
