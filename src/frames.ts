import { UNIQUE_BASE64, FRAME_INDEX_MAP as IDX_MAP, TOTAL_FRAMES } from './frames-data.js';

const DISPLAY_WIDTH = 120 * 4;
const DISPLAY_HEIGHT = 90 * 4;

const CSS_PREFIX = `font-size:1px;padding:${DISPLAY_HEIGHT / 2}px ${DISPLAY_WIDTH / 2}px;background:url(data:image/png;base64,`;
const CSS_SUFFIX = `) no-repeat;background-size:contain;color:transparent`;

export { TOTAL_FRAMES };

/** Pre-computed unique CSS strings for console.log backgrounds */
export const UNIQUE_CSS: readonly string[] = UNIQUE_BASE64.map(
  (b64) => `${CSS_PREFIX}${b64}${CSS_SUFFIX}`
);

/** Maps original frame sequence index → unique CSS index */
export const FRAME_INDEX_MAP: readonly number[] = IDX_MAP;
