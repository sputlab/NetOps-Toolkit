const fs = require('fs');
const zlib = require('zlib');
const path = require('path');

function createPNG(width, height, pixelFn) {
  const rowSize = 1 + width * 4;
  const rawData = Buffer.alloc(rowSize * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter: None
    for (let x = 0; x < width; x++) {
      // 2x2 supersampling for smooth antialiasing
      let r = 0, g = 0, b = 0, a = 0;
      const subOffsets = [[0.25, 0.25], [0.75, 0.25], [0.25, 0.75], [0.75, 0.75]];
      for (const [ox, oy] of subOffsets) {
        const [sr, sg, sb, sa] = pixelFn(x + ox, y + oy, width, height);
        r += sr * (sa / 255);
        g += sg * (sa / 255);
        b += sb * (sa / 255);
        a += sa;
      }
      a /= 4;
      if (a > 0) {
        r = Math.min(255, Math.round((r / 4) * (255 / a)));
        g = Math.min(255, Math.round((g / 4) * (255 / a)));
        b = Math.min(255, Math.round((b / 4) * (255 / a)));
      } else {
        r = 0; g = 0; b = 0;
      }

      const pixelOffset = rowOffset + 1 + x * 4;
      rawData[pixelOffset] = r;
      rawData[pixelOffset + 1] = g;
      rawData[pixelOffset + 2] = b;
      rawData[pixelOffset + 3] = Math.round(a);
    }
  }

  const compressed = zlib.deflateSync(rawData, { level: 9 });

  function makeChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, 'ascii');
    const crcBuf = Buffer.alloc(4);
    const crc = crc32(Buffer.concat([typeBuf, data]));
    crcBuf.writeUInt32BE(crc >>> 0, 0);
    return Buffer.concat([len, typeBuf, data, crcBuf]);
  }

  function crc32(buf) {
    let table = crc32.table;
    if (!table) {
      table = crc32.table = new Int32Array(256);
      for (let n = 0; n < 256; n++) {
        let c = n;
        for (let k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
        table[n] = c;
      }
    }
    let c = -1;
    for (let i = 0; i < buf.length; i++) c = table[(c ^ buf[i]) & 0xFF] ^ (c >>> 8);
    return (c ^ -1);
  }

  const sig = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  return Buffer.concat([sig, makeChunk('IHDR', ihdr), makeChunk('IDAT', compressed), makeChunk('IEND', Buffer.alloc(0))]);
}

// Distance to line segment
function distToSegment(px, py, x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const l2 = dx * dx + dy * dy;
  if (l2 === 0) return Math.hypot(px - x1, py - y1);
  let t = ((px - x1) * dx + (py - y1) * dy) / l2;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
}

function brandPixel(x, y, w, h) {
  // Normalize to 512x512 coordinate space
  const sx = (x / w) * 512;
  const sy = (y / h) * 512;

  // Squircle check (radius = 116)
  const rad = 116;
  const qx = Math.max(0, Math.max(rad - sx, sx - (512 - rad)));
  const qy = Math.max(0, Math.max(rad - sy, sy - (512 - rad)));
  const isCorner = (sx < rad || sx > 512 - rad) && (sy < rad || sy > 512 - rad);
  const cornerDist = isCorner ? Math.sqrt(qx * qx + qy * qy) : 0;
  if (cornerDist > rad) return [0, 0, 0, 0];

  // Base background gradient: #070c18 to #0f192f to #080f1e
  const diagNorm = (sx + sy) / 1024;
  let bgR = Math.round(7 + 10 * Math.sin(diagNorm * Math.PI));
  let bgG = Math.round(12 + 14 * Math.sin(diagNorm * Math.PI));
  let bgB = Math.round(24 + 24 * Math.sin(diagNorm * Math.PI));

  // Subtle border
  const edgeDist = Math.min(Math.min(sx, 512 - sx), Math.min(sy, 512 - sy));
  if (edgeDist < 6 || (cornerDist > rad - 6 && cornerDist <= rad)) {
    return [30, 50, 82, 255];
  }
  if (edgeDist < 8 || (cornerDist > rad - 8 && cornerDist <= rad)) {
    // subtle cyan glow rim
    return [0, 160, 140, 255];
  }

  // Network concentric circles at (256, 256)
  const centerDist = Math.hypot(sx - 256, sy - 256);
  if (Math.abs(centerDist - 190) < 1.5 || Math.abs(centerDist - 115) < 1.5) {
    bgR += 14; bgG += 30; bgB += 45;
  }
  // Crosshair lines
  if (Math.abs(sy - 256) < 1 && sx > 66 && sx < 446) { bgR += 10; bgG += 22; bgB += 35; }
  if (Math.abs(sx - 256) < 1 && sy > 66 && sy < 446) { bgR += 10; bgG += 22; bgB += 35; }

  // Geometry coordinates of the NetOps 'N'
  // Left pillar: (148, 140) to (148, 372)
  // Diagonal: (148, 140) to (364, 372)
  // Right pillar: (364, 140) to (364, 372)
  const dLeft = distToSegment(sx, sy, 148, 140, 148, 372);
  const dRight = distToSegment(sx, sy, 364, 140, 364, 372);
  const dDiag = distToSegment(sx, sy, 148, 140, 364, 372);
  const dMin = Math.min(dLeft, dRight, dDiag);

  // Outer dark track (width 52 => radius 26)
  if (dMin <= 26 && dMin > 19) {
    return [22, 38, 64, 255];
  }

  // Node centers
  const dNodeTL = Math.hypot(sx - 148, sy - 140);
  const dNodeBL = Math.hypot(sx - 148, sy - 372);
  const dNodeTR = Math.hypot(sx - 364, sy - 140);
  const dNodeBR = Math.hypot(sx - 364, sy - 372);
  const dCenter = Math.hypot(sx - 256, sy - 256);

  // Node Centers (White cores)
  if (dNodeTL <= 9 || dNodeBL <= 7 || dNodeTR <= 7 || dNodeBR <= 9 || dCenter <= 8) {
    return [255, 255, 255, 255];
  }
  // Node Outer halos
  if (dNodeTL <= 18) return [0, 240, 192, 255];
  if (dNodeBL <= 16) return [0, 212, 170, 255];
  if (dNodeTR <= 16) return [56, 189, 248, 255];
  if (dNodeBR <= 18) return [0, 144, 255, 255];
  if (dCenter <= 16) return [0, 212, 170, 255];

  // Glowing pipeline conduit (radius 19)
  if (dMin <= 19) {
    // Inner white velocity core (radius 3)
    if (dMin <= 3) {
      return [255, 255, 255, 255];
    }
    // Electric gradient along the N shape
    const progress = (sx + sy - 288) / 448; // roughly 0 at (148,140) to 1 at (364,372)
    const t = Math.max(0, Math.min(1, progress));
    // Color blend: #00f0c0 -> #00d4aa -> #0090ff -> #38bdf8
    let er, eg, eb;
    if (t < 0.5) {
      const subT = t * 2;
      er = Math.round(0 * (1 - subT) + 0 * subT);
      eg = Math.round(240 * (1 - subT) + 212 * subT);
      eb = Math.round(192 * (1 - subT) + 170 * subT);
    } else {
      const subT = (t - 0.5) * 2;
      er = Math.round(0 * (1 - subT) + 56 * subT);
      eg = Math.round(212 * (1 - subT) + 189 * subT);
      eb = Math.round(170 * (1 - subT) + 248 * subT);
    }
    return [er, eg, eb, 255];
  }

  // Soft glow around conduit
  if (dMin <= 32) {
    const glowAlpha = Math.round((1 - (dMin - 19) / 13) * 110);
    const gr = Math.round(bgR + 0 * (glowAlpha / 255));
    const gg = Math.round(bgG + 212 * (glowAlpha / 255));
    const gb = Math.round(bgB + 210 * (glowAlpha / 255));
    return [Math.min(255, gr), Math.min(255, gg), Math.min(255, gb), 255];
  }

  return [bgR, bgG, bgB, 255];
}

console.log('Rendering 512x512 icon...');
const png512 = createPNG(512, 512, brandPixel);
fs.writeFileSync('/Users/stefanosoranzio/Sputlab/WebApps/NetOps Toolkit/assets/icon-512.png', png512);

console.log('Rendering 192x192 icon...');
const png192 = createPNG(192, 192, brandPixel);
fs.writeFileSync('/Users/stefanosoranzio/Sputlab/WebApps/NetOps Toolkit/assets/icon-192.png', png192);

console.log('✓ Successfully rendered brand icons: assets/icon-512.png and assets/icon-192.png');
