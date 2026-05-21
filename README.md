# Bad Apple! Console Player

Play the Bad Apple! music video inside Chrome DevTools at 30fps.

No canvas. No runtime image loading. No flashing. Just 6,572 pre-computed frames played seamlessly through `console.log` CSS backgrounds.

---

## Installation

```bash
npm install bad-apple-console
```

Or drop the files onto any static host:

```html
<script type="module" src="./index.js"></script>
```

---

## Usage

Import the player in your project:

```js
import { startPlayback } from 'bad-apple-console';

// Playback starts automatically when DevTools is opened.
// Or call it manually:
startPlayback();
```

Open Chrome DevTools (`F12` or `Cmd+Option+J`) and the video will start automatically.

---

## How It Works

1. **Pre-build step** (`build.js`): All 6,572 PNG frames are resized to 120x90, converted to base64, and the exact `console.log('%c ', ...)` CSS strings are pre-computed into `frames.js`.
2. **Zero runtime overhead**: At playback, the browser simply cycles through pre-loaded strings. No `Image`, no `Canvas`, no base64 conversion, no CORS.
3. **Smooth 30fps**: `requestAnimationFrame` with elapsed-time tracking ensures exact frame timing.
4. **Console-only trigger**: The player detects DevTools opening via window dimension changes and the `console.profile()` timing trick. Playback does **not** start from clicks or keystrokes.
5. **No flashing**: Frames scroll through console history instead of replacing each other, avoiding the nausea-inducing `console.clear()` strobe effect.
6. **Scaled display**: The 120x90 frames are displayed at 480x360 via CSS padding so they fill the console width.

---

## DevTools Detection

The player uses two methods to detect when Chrome DevTools is opened:

- **Window dimension check**: Compares `window.outerWidth` vs `window.innerWidth`. When DevTools is docked, the viewport shrinks.
- **`console.profile()` timing trick**: DevTools instrumentation slows down `console.profile()` measurably. If the call takes >100ms, DevTools is active.

If detection fails (e.g., undocked DevTools on a separate monitor), refreshing the page with DevTools already open will trigger playback immediately.

---

## Building from Source

If you want to regenerate `frames.js` from your own frame sequence:

1. Place your numbered PNG frames (`output_0001.png`, `output_0002.png`, ...) in the project directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the build:
   ```bash
   npm run build
   ```

The build script uses `jimp` to resize, base64-encode, and pre-compute CSS strings for every frame. It outputs a single `frames.js` module.

---

## File Sizes

- `frames.js`: ~31 MB (6,572 pre-computed frames at 120x90)
- Source PNGs: ~133 MB (not included in npm package)

---

## License

MIT
