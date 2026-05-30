# Bad Apple! Console Player

Play the Bad Apple! music video inside Chrome DevTools at 30fps.

Zero runtime image loading. No canvas. No flashing. Just 6,572 pre-computed frames played seamlessly through `console.log` CSS backgrounds.

---

## Demo

<video src="./assets/demo.mov" 
width="640" 
preload="metadata" 
autoplay 
muted 
loop 
playsinline>
  Il tuo browser non supporta il tag video.
</video>

---

## Installation

```bash
bun add bad-apple-console
# or
npm install bad-apple-console
```

---

## Usage

Import the player in your project:

```ts
import { startPlayback, initDevToolsDetection } from 'bad-apple-console';

// Auto-detects DevTools opening and starts playback
initDevToolsDetection();

// Or start manually:
startPlayback();
```

Open Chrome DevTools (`F12` or `Cmd+Option+J`) and the video starts automatically.

---

## How It Works

1. **Pre-build step** (`bun run extract`): All 6,572 PNG frames are deduplicated, stripped of PNG metadata overhead, and the base64 payloads are stored in `src/frames-data.ts`. At build time, Bun bundles this into a single minified ESM output.
2. **Zero runtime overhead**: The browser cycles through pre-loaded CSS strings. No `Image`, no `Canvas`, no CORS.
3. **Smooth 30fps**: `requestAnimationFrame` with elapsed-time tracking ensures exact frame timing.
4. **Console-only trigger**: DevTools detection via window dimension changes and the `console.profile()` timing trick.
5. **No flashing**: Frames scroll through console history instead of replacing each other, avoiding the `console.clear()` strobe effect.

---

## Package Size

- **npm tarball:** ~21.6 MB (gzipped)
- **Unpacked:** ~31.8 MB
- Ships **ESM only** — no duplicated CJS/IIFE builds in the package.

---

## Building from Source

```bash
bun install
bun run extract   # regenerate frames-data.ts from legacy frames.js
bun run build     # bundle ESM + types
```

Requires Bun 1.0+ and the legacy `frames.js` file in the repo root.

---

## License

MIT
