import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import zlib from 'zlib';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to generate a valid minimal PNG file
function createMinimalPng(width = 600, height = 400) {
  const signature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  
  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData.writeUInt8(8, 8); // 8 bits per sample
  ihdrData.writeUInt8(2, 9); // RGB color type
  ihdrData.writeUInt8(0, 10); // compression
  ihdrData.writeUInt8(0, 11); // filter
  ihdrData.writeUInt8(0, 12); // interlace

  const ihdrChunk = createChunk('IHDR', ihdrData);

  // Raw uncompressed image data (RGB + scanline filter byte)
  const rowSize = 1 + width * 3;
  const rawData = Buffer.alloc(rowSize * height);
  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter: none
    for (let x = 0; x < width; x++) {
      const pixelOffset = rowOffset + 1 + x * 3;
      // Elegant off-white / parchment background with light blue border
      const isBorder = x < 8 || x > width - 9 || y < 8 || y > height - 9;
      if (isBorder) {
        rawData[pixelOffset] = 27;   // R
        rawData[pixelOffset + 1] = 54; // G
        rawData[pixelOffset + 2] = 93; // B (#1b365d Gov Blue)
      } else {
        rawData[pixelOffset] = 250;
        rawData[pixelOffset + 1] = 250;
        rawData[pixelOffset + 2] = 248;
      }
    }
  }

  const compressedData = zlib.deflateSync(rawData);
  const idatChunk = createChunk('IDAT', compressedData);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function createChunk(type, data) {
  const length = data.length;
  const header = Buffer.alloc(8);
  header.writeUInt32BE(length, 0);
  header.write(type, 4, 4, 'ascii');
  
  const crcData = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = crc32(crcData);
  const footer = Buffer.alloc(4);
  footer.writeUInt32BE(crc, 0);

  return Buffer.concat([header.subarray(0, 4), crcData, footer]);
}

// Standard CRC32 table & function
const crcTable = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let crc = -1;
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ crcTable[(crc ^ buf[i]) & 0xff];
  }
  return (crc ^ -1) >>> 0;
}

export function ensureSampleCertificates() {
  const uploadsDir = path.join(__dirname, '../uploads');
  const clientPublicDir = path.join(__dirname, '../../client/public');

  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
  if (!fs.existsSync(clientPublicDir)) fs.mkdirSync(clientPublicDir, { recursive: true });

  const pngBuffer = createMinimalPng(600, 400);

  const certServerPath = path.join(uploadsDir, 'sample_income_certificate.png');
  const certClientPath = path.join(clientPublicDir, 'sample_income_certificate.png');

  fs.writeFileSync(certServerPath, pngBuffer);
  fs.writeFileSync(certClientPath, pngBuffer);

  // Minimal standard PDF file representation
  const pdfContent = `%PDF-1.4
1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj
2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj
3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << >> >> endobj
4 0 obj << /Length 124 >> stream
BT
/F1 18 Tf
50 700 Td
(GOVERNMENT OF KARNATAKA - REVENUE DEPARTMENT) Tj
0 -30 Td
(INCOME & DOMICILE CERTIFICATE: RAMESH KUMAR VERMA) Tj
ET
endstream
endobj
xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000214 00000 n 
trailer << /Size 5 /Root 1 0 R >>
startxref
389
%%EOF`;

  const pdfServerPath = path.join(uploadsDir, 'sample_income_certificate.pdf');
  const pdfClientPath = path.join(clientPublicDir, 'sample_income_certificate.pdf');

  fs.writeFileSync(pdfServerPath, pdfContent);
  fs.writeFileSync(pdfClientPath, pdfContent);

  console.log('[Assets] Sample income certificate files verified in server/uploads & client/public');
}
