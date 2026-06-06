import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const src = join(root, 'public', 'iconf.png');
const outDir = join(root, 'public', 'icons');
const SIZES = [512, 192, 180, 144, 96, 72, 48];

if (!existsSync(src)) {
  console.error(`Icone-fonte nao encontrado: ${src}`);
  process.exit(1);
}
await mkdir(outDir, { recursive: true });
for (const size of SIZES) {
  const out = join(outDir, `icon-${size}x${size}.png`);
  await sharp(src).resize(size, size, { fit: 'cover', position: 'centre' }).png().toFile(out);
  console.log(`OK icon-${size}x${size}.png`);
}
console.log('Pronto - icones em public/icons/');
