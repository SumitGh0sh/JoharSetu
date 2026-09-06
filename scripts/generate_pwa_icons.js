const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// CRC-32 table for PNG chunk checksums
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    if (c & 1) c = 0xedb88320 ^ (c >>> 1);
    else c = c >>> 1;
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function createChunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const len = data.length;
  const chunk = Buffer.alloc(12 + len);

  chunk.writeUInt32BE(len, 0);
  typeBuf.copy(chunk, 4);
  data.copy(chunk, 8);

  const crcTarget = Buffer.concat([typeBuf, data]);
  const crcVal = crc32(crcTarget);
  chunk.writeUInt32BE(crcVal, 8 + len);

  return chunk;
}

function generatePng(size) {
  const width = size;
  const height = size;

  // Each scanline: 1 byte filter type (0) + width * 4 bytes RGBA
  const scanlineLength = 1 + width * 4;
  const rawData = Buffer.alloc(scanlineLength * height);

  const cx = width / 2;
  const cy = height / 2;
  const radius = width * 0.46;

  // Colors:
  // Terracotta: #D87A53 -> 216, 122, 83
  // Warm Sand: #D4A86A -> 212, 168, 106
  // Charcoal: #1E1E1E -> 30, 30, 30
  // White: 255, 255, 255

  for (let y = 0; y < height; y++) {
    const rowOffset = y * scanlineLength;
    rawData[rowOffset] = 0; // Filter type: None

    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist <= radius) {
        // Base Terracotta Background
        let r = 216;
        let g = 122;
        let b = 83;
        let a = 255;

        // Outer ring (Warm Sand)
        if (dist >= radius - 4) {
          r = 212;
          g = 168;
          b = 106;
        }

        // Bridge Deck & Arch design
        // Normalized coordinates: -1 to 1
        const nx = (x - cx) / (radius * 0.7);
        const ny = (y - cy) / (radius * 0.7);

        // Bridge Horizontal Roadway: ny between 0.05 and 0.18
        const onDeck = ny >= 0.05 && ny <= 0.18 && Math.abs(nx) <= 0.85;

        // Arch: parabola curve ny = 0.5 - 0.75 * (1 - nx^2)
        const archY = 0.5 - 0.65 * (1 - nx * nx);
        const onArch = ny >= archY - 0.08 && ny <= archY + 0.05 && Math.abs(nx) <= 0.85;

        // Vertical Pillars
        const onPillars =
          ny >= 0.05 &&
          ny <= 0.5 &&
          (Math.abs(nx - 0.4) < 0.04 || Math.abs(nx + 0.4) < 0.04 || Math.abs(nx) < 0.04);

        // Sun / Symbol above bridge: small circle at cx, cy - radius*0.3
        const sunDx = x - cx;
        const sunDy = y - (cy - radius * 0.35);
        const sunDist = Math.sqrt(sunDx * sunDx + sunDy * sunDy);
        const onSun = sunDist <= radius * 0.18;

        if (onDeck || onArch || onPillars) {
          // Clean White Bridge
          r = 255;
          g = 255;
          b = 255;
        } else if (onSun) {
          // Warm Golden Sun
          r = 254;
          g = 215;
          b = 102;
        }

        rawData[pxOffset] = r;
        rawData[pxOffset + 1] = g;
        rawData[pxOffset + 2] = b;
        rawData[pxOffset + 3] = a;
      } else {
        // Transparent outside circular badge
        rawData[pxOffset] = 0;
        rawData[pxOffset + 1] = 0;
        rawData[pxOffset + 2] = 0;
        rawData[pxOffset + 3] = 0;
      }
    }
  }

  // PNG Signature
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // Bit depth: 8
  ihdrData[9] = 6; // Color type: RGBA (6)
  ihdrData[10] = 0; // Compression method: Deflate
  ihdrData[11] = 0; // Filter method: Standard
  ihdrData[12] = 0; // Interlace: None
  const ihdrChunk = createChunk('IHDR', ihdrData);

  // IDAT
  const compressed = zlib.deflateSync(rawData, { level: 9 });
  const idatChunk = createChunk('IDAT', compressed);

  // IEND
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

const iconsDir = path.join(__dirname, '..', 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

const sizes = [
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-512.png', size: 512 },
  { name: 'apple-touch-icon.png', size: 180 },
];

for (const { name, size } of sizes) {
  const pngBuffer = generatePng(size);
  const outPath = path.join(iconsDir, name);
  fs.writeFileSync(outPath, pngBuffer);
  console.log(`✅ Generated PWA Icon: ${outPath} (${size}x${size}, ${pngBuffer.length} bytes)`);
}

console.log('🎉 All JoharSetu PWA icons generated successfully!');
