#!/usr/bin/env node
// Generates a minimal valid 1-page PDF as a placeholder catalog file.
// Replace public/pdfs/sentech-catalog.pdf with the real SEN TECH catalog
// when supplied.
import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';

const OUT = resolve(process.cwd(), 'public/pdfs/sentech-catalog-placeholder.pdf');
mkdirSync(dirname(OUT), { recursive: true });

function buildPdf() {
  const lines = [
    'BT',
    '/F1 24 Tf',
    '60 740 Td',
    '(SEN TECH) Tj',
    '0 -34 Td',
    '/F1 16 Tf',
    '(NTC Thermistor & Sensor Catalog) Tj',
    '0 -28 Td',
    '/F1 11 Tf',
    '0.6 0.6 0.6 rg',
    '(Placeholder PDF - the production catalog will be supplied by SEN TECH.) Tj',
    '0 -16 Td',
    '(Drop the real file at public/pdfs/sentech-catalog.pdf to replace this preview.) Tj',
    '0 -32 Td',
    '0 0 0 rg',
    '/F1 12 Tf',
    '(Product lines covered:) Tj',
  ];
  const products = [
    '  - IN  Interchangeable NTC Thermistor   (-50 to 150 C)',
    '  - GB  Glass Bead NTC Thermistor        (-40 to 250 C)',
    '  - PM  Point Matched NTC Thermistor     (-50 to 150 C)',
    '  - HT  High-Precision NTC Thermistor    (-40 to 110 C)',
    '  - HAT High-Precision AT Thermistor     (-40 to 250 C)',
    '  - TS  Body Temperature NTC Thermistor  (-30 to 100 C)',
    '  - TA-4 Flexible Lead NTC Thermistor    (-40 to 150 C)',
    '  - TJ  Thin-Film NTC Thermistor         (-30 to  90 C)',
  ];
  for (const p of products) {
    lines.push('0 -16 Td');
    lines.push(`(${p}) Tj`);
  }
  lines.push('0 -28 Td');
  lines.push('/F1 10 Tf');
  lines.push('0.4 0.4 0.4 rg');
  lines.push('(Contact: sales@sen-tech.com  |  +886-4-2493-3297  |  www.sen-tech.com) Tj');
  lines.push('ET');
  const stream = lines.join('\n');

  const obj = (n, body) => `${n} 0 obj\n${body}\nendobj\n`;

  const objects = [
    obj(1, '<< /Type /Catalog /Pages 2 0 R >>'),
    obj(2, '<< /Type /Pages /Kids [3 0 R] /Count 1 >>'),
    obj(
      3,
      '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>'
    ),
    obj(4, '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>'),
    obj(5, `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`),
  ];

  const header = '%PDF-1.4\n%\xC4\xE5\xF2\xE5\xEB\xA7\xF3\xA0\xD0\xC4\xC6\n';
  let pdf = header;
  const offsets = [0];
  for (const o of objects) {
    offsets.push(pdf.length);
    pdf += o;
  }
  const xrefStart = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (let i = 1; i <= objects.length; i++) {
    pdf += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF\n`;
  return Buffer.from(pdf, 'binary');
}

const buf = buildPdf();
writeFileSync(OUT, buf);
console.log(`Wrote ${OUT}  (${buf.length} bytes)`);
