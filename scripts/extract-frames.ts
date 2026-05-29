import { FRAMES, TOTAL_FRAMES } from '../frames.js';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const DATA_DIR = join(import.meta.dir, '..', 'data');
mkdirSync(DATA_DIR, { recursive: true });

const uniqueBase64s: string[] = [];
const base64ToIndex = new Map<string, number>();
const indexMap: number[] = [];

console.log(`Extracting ${TOTAL_FRAMES} frames...`);

for (let i = 0; i < TOTAL_FRAMES; i++) {
  const frame = FRAMES[i];
  const match = frame.match(/base64,([^)]+)\)/);
  if (!match) {
    throw new Error(`Could not extract base64 from frame ${i}`);
  }
  const b64 = match[1];

  let uniqueIdx = base64ToIndex.get(b64);
  if (uniqueIdx === undefined) {
    uniqueIdx = uniqueBase64s.length;
    base64ToIndex.set(b64, uniqueIdx);
    uniqueBase64s.push(b64);
  }
  indexMap.push(uniqueIdx);
}

writeFileSync(join(DATA_DIR, 'frames.json'), JSON.stringify(uniqueBase64s));
writeFileSync(join(DATA_DIR, 'index-map.json'), JSON.stringify(indexMap));

console.log(`Original frames: ${TOTAL_FRAMES}`);
console.log(`Unique frames:   ${uniqueBase64s.length}`);
console.log(`Deduplication:   ${((1 - uniqueBase64s.length / TOTAL_FRAMES) * 100).toFixed(1)}% smaller`);
