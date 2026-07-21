import { writeFileSync, mkdirSync } from "fs";
import { deflateSync } from "zlib";
import { join } from "path";

const WIDTH = 180;
const HEIGHT = 180;
const OUTPUT = join(process.cwd(), "public", "apple-touch-icon.png");

mkdirSync(join(process.cwd(), "public"), { recursive: true });

function pointInShield(px, py) {
  const cx = 90, cy = 86, w = 50, h = 66;
  const topY = cy - h, botY = cy + h, midY = cy;
  if (py < topY || py > botY || px < cx - w || px > cx + w) return false;
  let maxX;
  if (py < midY) {
    maxX = w * ((py - topY) / (midY - topY));
  } else {
    const t = (py - midY) / (botY - midY);
    maxX = w * (1 - t * t);
  }
  return Math.abs(px - cx) <= maxX;
}

function signedDistShield(px, py) {
  const cx = 90, cy = 86, w = 50, h = 66;
  const topY = cy - h, botY = cy + h, midY = cy;
  if (py >= topY && py <= botY && px >= cx - w && px <= cx + w) {
    let maxX;
    if (py < midY) {
      maxX = w * ((py - topY) / (midY - topY));
    } else {
      const t = (py - midY) / (botY - midY);
      maxX = w * (1 - t * t);
    }
    const dx = Math.abs(px - cx) - maxX;
    if (dx <= 0) return dx;
  }
  let minD = Infinity;
  const steps = 60;
  for (let i = 0; i <= steps; i++) {
    const a = (i / steps) * Math.PI * 2;
    const rx = w * (py <= midY ? Math.sin(a) : Math.cos(a) * (1 - ((Math.max(0, py - midY) / (botY - midY)) ** 2)));
    const ry = h * 0.5 + (py <= midY ? h * 0.5 * ((py - topY) / (midY - topY)) : h * 0.5 * (1 - ((py - midY) / (botY - midY)) ** 2));
    const bx = cx + rx * Math.cos(a);
    const by = cy + ry * Math.sin(a);
    const d = Math.sqrt((px - bx) ** 2 + (py - by) ** 2);
    if (d < minD) minD = d;
  }
  return minD * 0.8;
}

console.log("Generating 180x180 apple-touch-icon...");

const pixels = Buffer.alloc(WIDTH * HEIGHT * 4);

for (let y = 0; y < HEIGHT; y++) {
  for (let x = 0; x < WIDTH; x++) {
    const offset = (y * WIDTH + x) * 4;
    const inside = pointInShield(x, y);
    let alpha = 1;

    if (inside) {
      const cx = 90, cy = 86;
      const dx = x - cx, dy = y - cy;
      const angle = Math.atan2(dy, dx);
      const nx = dx / 50, ny = dy / 66;
      const edge = Math.max(Math.abs(nx), Math.abs(ny));

      const r = Math.round(0x3b + (0x60 - 0x3b) * Math.max(0, 1 - edge * 1.8) * 0.6);
      const g = Math.round(0x82 + (0xb0 - 0x82) * Math.max(0, 1 - edge * 1.8) * 0.5);
      const bVal = 0xf6;

      const highlight = Math.max(0, 1 - edge * 2.2) * (0.3 + 0.15 * Math.sin(angle * 2 - 0.5));
      pixels[offset] = Math.min(255, r + Math.round(highlight * 40));
      pixels[offset + 1] = Math.min(255, g + Math.round(highlight * 30));
      pixels[offset + 2] = Math.min(255, bVal + Math.round(highlight * 15));
      pixels[offset + 3] = 255;

      // anti-alias outer edge
      let minDist = Infinity;
      for (let dy2 = -1; dy2 <= 1; dy2++) {
        for (let dx2 = -1; dx2 <= 1; dx2++) {
          if (!pointInShield(x + dx2, y + dy2)) {
            const d = Math.abs(dx2) + Math.abs(dy2);
            if (d < minDist) minDist = d;
          }
        }
      }
      if (minDist <= 1) {
        alpha = 0.5 + 0.5 * minDist;
        pixels[offset + 3] = Math.round(255 * alpha);
      }
    } else {
      // check if adjacent to shield for AA
      let minDist = Infinity;
      let anyInside = false;
      for (let dy2 = -1; dy2 <= 1; dy2++) {
        for (let dx2 = -1; dx2 <= 1; dx2++) {
          if (pointInShield(x + dx2, y + dy2)) {
            anyInside = true;
            const d = Math.abs(dx2) + Math.abs(dy2);
            if (d < minDist) minDist = d;
          }
        }
      }
      if (anyInside && minDist <= 1) {
        alpha = 0.5 * (1 - minDist);
        pixels[offset] = 0x3b;
        pixels[offset + 1] = 0x82;
        pixels[offset + 2] = 0xf6;
        pixels[offset + 3] = Math.round(255 * alpha);
      } else {
        // rounded corners
        const cornerR = 24;
        const corners = [
          [cornerR, cornerR],
          [WIDTH - cornerR, cornerR],
          [cornerR, HEIGHT - cornerR],
          [WIDTH - cornerR, HEIGHT - cornerR],
        ];
        let inCorner = false;
        for (const [cx, cy] of corners) {
          if (
            ((x < cx && y < cy) || (x > WIDTH - cornerR && y < cy) ||
             (x < cx && y > HEIGHT - cornerR) || (x > WIDTH - cornerR && y > HEIGHT - cornerR))
          ) {
            const d = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
            if (d > cornerR) {
              inCorner = true;
              break;
            }
          }
        }
        if (inCorner) {
          pixels[offset] = 0;
          pixels[offset + 1] = 0;
          pixels[offset + 2] = 0;
          pixels[offset + 3] = 0;
        } else {
          pixels[offset] = 0x09;
          pixels[offset + 1] = 0x09;
          pixels[offset + 2] = 0x0b;
          pixels[offset + 3] = 255;
        }
      }
    }
  }
}

// PNG encoding
function crc32(buf) {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c;
  }
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) crc = table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const typeAndData = Buffer.concat([Buffer.from(type), data]);
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(typeAndData));
  return Buffer.concat([len, typeAndData, crc]);
}

const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

const ihdrData = Buffer.alloc(13);
ihdrData.writeUInt32BE(WIDTH, 0);
ihdrData.writeUInt32BE(HEIGHT, 4);
ihdrData[8] = 8;
ihdrData[9] = 6; // RGBA
ihdrData[10] = 0;
ihdrData[11] = 0;
ihdrData[12] = 0;

const rowLen = WIDTH * 4 + 1;
const raw = Buffer.alloc(HEIGHT * rowLen);
for (let y = 0; y < HEIGHT; y++) {
  raw[y * rowLen] = 0;
  pixels.copy(raw, y * rowLen + 1, y * WIDTH * 4, (y + 1) * WIDTH * 4);
}

const compressed = deflateSync(raw, { level: 9 });

const png = Buffer.concat([
  signature,
  makeChunk("IHDR", ihdrData),
  makeChunk("IDAT", compressed),
  makeChunk("IEND", Buffer.alloc(0)),
]);

writeFileSync(OUTPUT, png);
console.log(`Saved: ${OUTPUT}`);
console.log(`Size: ${png.length} bytes`);
