import uniqueBase64s from '../data/frames.json';
import indexMap from '../data/index-map.json';

const DISPLAY_WIDTH = 120 * 4;
const DISPLAY_HEIGHT = 90 * 4;

const CSS_PREFIX = `font-size:1px;padding:${DISPLAY_HEIGHT / 2}px ${DISPLAY_WIDTH / 2}px;background:url(data:image/png;base64,`;
const CSS_SUFFIX = `) no-repeat;background-size:contain;color:transparent`;

export const TOTAL_FRAMES = indexMap.length;

/** Pre-computed unique CSS strings for console.log backgrounds */
export const UNIQUE_CSS: readonly string[] = uniqueBase64s.map(
  (b64) => `${CSS_PREFIX}${b64}${CSS_SUFFIX}`
);

/** Maps original frame sequence index → unique CSS index */
export const FRAME_INDEX_MAP: readonly number[] = indexMap;
