/**
 * Generates the PWA/favicon icon set from the brand mark.
 * Run: node scripts/generate-icons.mjs
 * Dev-only tooling (sharp, png-to-ico). Re-run whenever public/icon.svg changes.
 */
import sharp from "sharp";
import pngToIco from "png-to-ico";
import { writeFile } from "node:fs/promises";
import { join } from "node:path";

const publicDir = join(process.cwd(), "public");

// Rounded-square mark (matches public/icon.svg) — used for standard icons.
const rounded = `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" rx="112" fill="#1F4740"/>
  <circle cx="256" cy="256" r="150" stroke="#F6F3EC" stroke-width="28" opacity="0.92"/>
  <path d="M256 76 V436" stroke="#F6F3EC" stroke-width="28" stroke-linecap="round" opacity="0.92"/>
  <circle cx="256" cy="150" r="40" fill="#B98D3E"/>
</svg>`;

// Full-bleed variant with generous safe area — used for maskable icons.
const maskable = `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#1F4740"/>
  <circle cx="256" cy="256" r="122" stroke="#F6F3EC" stroke-width="24" opacity="0.92"/>
  <path d="M256 110 V402" stroke="#F6F3EC" stroke-width="24" stroke-linecap="round" opacity="0.92"/>
  <circle cx="256" cy="170" r="33" fill="#B98D3E"/>
</svg>`;

const png = (svg, size) =>
  sharp(Buffer.from(svg)).resize(size, size).png().toBuffer();

async function main() {
  const targets = [
    ["icon-192.png", rounded, 192],
    ["icon-512.png", rounded, 512],
    ["apple-touch-icon.png", rounded, 180],
    ["icon-maskable-512.png", maskable, 512],
  ];

  for (const [name, svg, size] of targets) {
    const buf = await png(svg, size);
    await writeFile(join(publicDir, name), buf);
    console.log("wrote", name);
  }

  // favicon.ico from a couple of small sizes.
  const icoSizes = await Promise.all([16, 32, 48].map((s) => png(rounded, s)));
  const ico = await pngToIco(icoSizes);
  await writeFile(join(publicDir, "favicon.ico"), ico);
  console.log("wrote favicon.ico");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
