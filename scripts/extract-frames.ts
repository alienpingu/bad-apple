import { FRAMES, TOTAL_FRAMES } from '../frames.js';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

const OUT_FILE = join(import.meta.dir, '..', 'src', 'frames-data.ts');

const KEEP_CHUNKS = new Set(['IHDR', 'IDAT', 'IEND']);

function stripPngChunks(buf: Buffer): Buffer {
  const sig = buf.subarray(0, 8);
  let pos = 8;
  const chunks: Buffer[] = [];

  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos);
    const type = buf.subarray(pos + 4, pos + 8).toString('ascii');
    const data = buf.subarray(pos + 8, pos + 8 + len);
    const crc = buf.subarray(pos + 8 + len, pos + 12 + len);

    if (KEEP_CHUNKS.has(type)) {
      const chunk = Buffer.allocUnsafe(12 + len);
      buf.copy(chunk, 0, pos, pos + 12 + len);
      chunks.push(chunk);
    }

    pos += 12 + len;
  }

  return Buffer.concat([sig, ...chunks]);
}

const uniqueBase64s: string[] = [];
const base64ToIndex = new Map<string, number>();
const indexMap: number[] = [];

let originalSize = 0;
let strippedSize = 0;

console.log(`Extracting ${TOTAL_FRAMES} frames...`);

for (let i = 0; i < TOTAL_FRAMES; i++) {
  const frame = FRAMES[i];
  const match = frame.match(/base64,([^)]+)\)/);
  if (!match) {
    throw new Error(`Could not extract base64 from frame ${i}`);
  }
  const b64 = match[1];
  const buf = Buffer.from(b64, 'base64');
  originalSize += buf.length;

  const stripped = stripPngChunks(buf);
  strippedSize += stripped.length;
  const strippedB64 = stripped.toString('base64');

  let uniqueIdx = base64ToIndex.get(strippedB64);
  if (uniqueIdx === undefined) {
    uniqueIdx = uniqueBase64s.length;
    base64ToIndex.set(strippedB64, uniqueIdx);
    uniqueBase64s.push(strippedB64);
  }
  indexMap.push(uniqueIdx);
}

const lines = [
  `export const TOTAL_FRAMES = ${TOTAL_FRAMES};`,
  ``,
  `/** Stripped PNG base64 payloads (IHDR + IDAT + IEND only) */`,
  `export const UNIQUE_BASE64: readonly string[] = [`,
  ...uniqueBase64s.map((s, i) => `  "${s}"${i < uniqueBase64s.length - 1 ? ',' : ''}`),
  `];`,
  ``,
  `/** Maps original frame sequence index → unique CSS index */`,
  `export const FRAME_INDEX_MAP: readonly number[] = [`,
  ...indexMap.map((n, i) => `  ${n}${i < indexMap.length - 1 ? ',' : ''}`),
  `];`,
];

writeFileSync(OUT_FILE, lines.join('\n'));

console.log(`Original frames:    ${TOTAL_FRAMES}`);
console.log(`Unique frames:      ${uniqueBase64s.length}`);
console.log(`Deduplication:      ${((1 - uniqueBase64s.length / TOTAL_FRAMES) * 100).toFixed(1)}% smaller`);
console.log(`PNG original size:  ${(originalSize / 1024 / 1024).toFixed(2)} MB`);
console.log(`PNG stripped size:  ${(strippedSize / 1024 / 1024).toFixed(2)} MB`);
console.log(`Chunk overhead removed: ${((1 - strippedSize / originalSize) * 100).toFixed(1)}%`);
