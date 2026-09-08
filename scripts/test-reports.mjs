import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import mammoth from 'mammoth';

const reports = JSON.parse(await fs.readFile('src/lib/generated/reports.json', 'utf8'));
assert.deepEqual(reports.map((report) => report.pages), [82, 21]);

for (const report of reports) {
  const buffer = await fs.readFile(`public/reports/${report.fileBase}.docx`);
  assert.equal(createHash('sha256').update(buffer).digest('hex'), report.sha256);
  const raw = await mammoth.extractRawText({ buffer });
  assert.match(raw.value, /BIÊN BẢN HỌP NHÓM 13\./);
  assert.doesNotMatch(raw.value, /DANH SÁCH THÀNH VIÊN NHÓM 13/);
  assert(report.html.includes('BIÊN BẢN HỌP NHÓM 13.'));
  assert(report.html.includes('KẾT LUẬN'));
  assert(!/<script|javascript:|onerror=/i.test(report.html));
  assert.equal(new Set(report.headings.map((heading) => heading.id)).size, report.headings.length);
  console.log(`PASS ${report.slug}: checksum, updated minutes, conclusion, sanitized reader HTML.`);
}

if (process.argv[2]) {
  const base = process.argv[2].replace(/\/$/, '');
  for (const pathname of ['/bao-cao-so-bo', '/bao-cao-so-bo/day-du', '/bao-cao-so-bo/rut-gon']) {
    const response = await fetch(base + pathname);
    assert.equal(response.status, 200, pathname);
    console.log(`PASS HTTP 200 ${pathname}`);
  }
  for (const report of reports) {
    const response = await fetch(`${base}/reports/${report.fileBase}.docx`);
    assert.equal(response.status, 200);
    const deployedHash = createHash('sha256').update(Buffer.from(await response.arrayBuffer())).digest('hex');
    assert.equal(deployedHash, report.sha256);
    console.log(`PASS deployed Word file ${report.slug}`);
  }
}
