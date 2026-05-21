import { Jimp } from 'jimp';
import { readdir, writeFile } from 'fs/promises';
import { join } from 'path';

const FRAME_DIR = '/Users/samuelebertocco/Desktop/bad apple ';
const OUTPUT_FILE = '/Users/samuelebertocco/Desktop/bad apple /frames.js';
const TARGET_WIDTH = 120;
const TARGET_HEIGHT = 90;

async function build() {
  const files = await readdir(FRAME_DIR);
  const pngFiles = files
    .filter(f => f.match(/^output_\d+\.png$/))
    .sort((a, b) => {
      const numA = parseInt(a.match(/\d+/)[0], 10);
      const numB = parseInt(b.match(/\d+/)[0], 10);
      return numA - numB;
    });

  console.log(`Found ${pngFiles.length} frames`);

  const frames = [];
  
  for (let i = 0; i < pngFiles.length; i++) {
    const file = pngFiles[i];
    const image = await Jimp.read(join(FRAME_DIR, file));
    
    // Force resize to exactly 120x90
    image.resize({ w: TARGET_WIDTH, h: TARGET_HEIGHT });
    
    // Get base64 PNG data URL
    const base64 = await image.getBase64('image/png');
    
    // Pre-compute the exact console.log CSS string
    const style = [
      'font-size: 1px;',
      `padding: ${TARGET_HEIGHT / 2}px ${TARGET_WIDTH / 2}px;`,
      `background: url(${base64}) no-repeat;`,
      'background-size: contain;',
      'color: transparent;'
    ].join(' ');
    
    frames.push(style);
    
    if ((i + 1) % 500 === 0 || i === pngFiles.length - 1) {
      console.log(`Processed ${i + 1}/${pngFiles.length} frames`);
    }
  }

  // Write frames as a JS module
  const lines = frames.map(f => `  "${f}"`);
  const output = `export const FRAMES = [\n${lines.join(',\n')}\n];\nexport const TOTAL_FRAMES = ${frames.length};\n`;
  
  await writeFile(OUTPUT_FILE, output);
  
  console.log(`Done! Wrote ${frames.length} pre-computed frames to ${OUTPUT_FILE}`);
}

build().catch(console.error);
