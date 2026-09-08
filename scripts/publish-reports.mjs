import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import mammoth from 'mammoth';
import sanitizeHtml from 'sanitize-html';

// Deterministic export of the approved Word files. The source documents are
// copied verbatim; only the web reader HTML is converted and sanitized.
const source = process.argv[2];
if (!source) throw new Error('Pass the directory containing the two updated Word reports.');

const sourceFiles = await fs.readdir(source);
await fs.mkdir('public/reports', { recursive: true });
await fs.mkdir('src/lib/generated', { recursive: true });

const reportDefinitions = [
  {
    slug: 'day-du',
    phrase: 'báo cáo tổng hợp',
    title: 'Báo cáo tổng hợp đầy đủ',
    pages: 82,
  },
  {
    slug: 'rut-gon',
    phrase: 'báo cáo sơ bộ',
    title: 'Báo cáo sơ bộ rút gọn',
    pages: 21,
  },
];

const reports = [];
for (const definition of reportDefinitions) {
  const matches = sourceFiles.filter((name) => {
    const normalized = name.normalize('NFC').toLowerCase();
    return normalized.includes(definition.phrase) && normalized.endsWith('bản cập nhật.docx');
  });
  if (matches.length !== 1) {
    throw new Error(`Expected one updated source for ${definition.slug}, found ${matches.length}.`);
  }

  const sourceName = matches[0];
  const sourcePath = path.join(source, sourceName);
  const buffer = await fs.readFile(sourcePath);
  const output = await mammoth.convertToHtml(
    { buffer },
    {
      styleMap: [
        "p[style-name='Title'] => h1:fresh",
        "p[style-name='Heading 1'] => h2:fresh",
        "p[style-name='Heading 2'] => h3:fresh",
        "p[style-name='Heading 3'] => h4:fresh",
        "p[style-name='Heading 4'] => h5:fresh",
      ],
    },
  );

  const headings = [];
  let html = output.value.replace(/<(h[1-6])([^>]*)>([\s\S]*?)<\/\1>/g, (_, tag, attrs, inner) => {
    const text = sanitizeHtml(inner, { allowedTags: [], allowedAttributes: {} });
    const id = `de-muc-${headings.length + 1}`;
    headings.push({ id, text, level: Number(tag.slice(1)) });
    return `<${tag}${attrs} id="${id}">${inner}</${tag}>`;
  });

  html = sanitizeHtml(html, {
    allowedTags: [...sanitizeHtml.defaults.allowedTags, 'img', 'h1', 'h2'],
    allowedAttributes: {
      '*': ['id'],
      a: ['href'],
      img: ['src', 'alt'],
      td: ['colspan', 'rowspan'],
      th: ['colspan', 'rowspan'],
    },
    allowedSchemes: ['https', 'http', 'mailto'],
    allowedSchemesByTag: { img: ['data'] },
  });

  const fileBase = `nhom-13-bao-cao-${definition.slug}`;
  await fs.copyFile(sourcePath, `public/reports/${fileBase}.docx`);
  reports.push({
    slug: definition.slug,
    title: definition.title,
    pages: definition.pages,
    fileBase,
    sourceName: sourceName.normalize('NFC'),
    sha256: createHash('sha256').update(buffer).digest('hex'),
    headings,
    html,
  });
  console.log(`${definition.slug}: ${definition.pages} pages, ${headings.length} headings.`);
}

await fs.writeFile('src/lib/generated/reports.json', JSON.stringify(reports));
