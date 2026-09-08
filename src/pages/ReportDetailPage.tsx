import { useState, useMemo } from 'react';
import { Link, useRouter } from '@/router';
import { Download, ArrowLeft, BookOpen, Search } from 'lucide-react';
import reports from '@/lib/generated/reports.json';

function processReportHtml(rawHtml: string, slug: string): string {
  const h2Index = rawHtml.indexOf('<h2 id="de-muc-1">');
  if (h2Index === -1) return rawHtml;

  const coverPart = rawHtml.substring(0, h2Index);
  let bodyPart = rawHtml.substring(h2Index);

  // Mammoth preserves the tab between a Word TOC label and its page number,
  // but browsers collapse it to ordinary whitespace. Rebuild only the
  // document's TOC rows so the dot leader and right-aligned page number remain
  // visible in the online reader just as they are in the source Word files.
  const nextHeadingIndex = bodyPart.indexOf('<h2 id="de-muc-2">');
  if (nextHeadingIndex !== -1) {
    const tocHtml = bodyPart.substring(0, nextHeadingIndex).replace(
      /<p>((?:<strong>)?[^<\t]*(?:<\/strong>)?)\t((?:<strong>)?\d+(?:<\/strong>)?)<\/p>/g,
      (_match, label: string, page: string) => {
        const isPrimary = label.startsWith('<strong>');
        return `<p class="word-toc-row${isPrimary ? ' word-toc-level-1' : ' word-toc-level-2'}"><span class="word-toc-label">${label}</span><span class="word-toc-leader" aria-hidden="true"></span><span class="word-toc-page">${page}</span></p>`;
      }
    );
    bodyPart = tocHtml + bodyPart.substring(nextHeadingIndex);
  }

  // Extract logo
  const logoMatch = coverPart.match(/<img[^>]*src="(data:image\/png;base64,[^"]+)"[^>]*>/);
  const logoSrc = logoMatch ? logoMatch[1] : '';

  const minutesMarker = '<p><strong>BIÊN BẢN HỌP NHÓM 13.</strong></p>';
  const minutesIndex = coverPart.indexOf(minutesMarker);
  const minutesHtml = minutesIndex >= 0 ? coverPart.substring(minutesIndex) : '';

  const reportType = slug === 'rut-gon' ? 'BÁO CÁO SƠ BỘ' : 'BÁO CÁO TỔNG HỢP';

  const coverHtml = `
<div class="report-cover-intro" id="trang-dau-bao-cao">
  ${logoSrc ? `<div class="cover-logo-wrap"><img src="${logoSrc}" alt="Logo Học viện Ngân hàng" class="cover-logo-img" /></div>` : ''}
  <div class="cover-institution">HỌC VIỆN NGÂN HÀNG</div>
  <div class="cover-subject">MÔN THỰC HÀNH NGHỀ LUẬT</div>
  <div class="cover-rule"></div>
  <div class="cover-report-type">${reportType}</div>
  <h1 class="cover-report-title">
    DỊCH VỤ PHÁP LÝ HỖ TRỢ THÀNH LẬP VÀ VẬN HÀNH<br/>
    DOANH NGHIỆP CUNG ỨNG VÍ ĐIỆN TỬ
  </h1>
  <div class="cover-group">NHÓM 13</div>
</div>
${minutesHtml ? `<section class="report-minutes" aria-label="Biên bản họp Nhóm 13">${minutesHtml}</section>` : ''}
`;

  return coverHtml + bodyPart;
}

export function ReportDetailPage() {
  const { pathname } = useRouter();
  const [tocFilter, setTocFilter] = useState('');

  // Extract slug from pathname, e.g. /bao-cao-so-bo/day-du -> day-du
  const slug = pathname.replace('/bao-cao-so-bo/', '').trim() || 'day-du';
  const report = reports.find((r) => r.slug === slug) || reports[0];

  const processedHtml = useMemo(
    () => processReportHtml(report.html, report.slug),
    [report.html, report.slug]
  );

  const filteredHeadings = useMemo(() => {
    const list = [
      { id: 'trang-dau-bao-cao', text: 'Bìa báo cáo', level: 1 },
      ...(report?.headings || []),
    ];
    return list.filter((h) =>
      tocFilter ? h.text.toLowerCase().includes(tocFilter.toLowerCase()) : true
    );
  }, [report?.headings, tocFilter]);

  return (
    <main className="site-shell publication-page">
      <div className="mb-4 flex items-center justify-between">
        <Link href="/bao-cao-so-bo" className="inline-flex items-center gap-2 text-xs font-semibold text-[#8c6b18] hover:underline">
          <ArrowLeft className="w-3.5 h-3.5" /> Tất cả báo cáo
        </Link>
        <div className="flex gap-2">
          {reports.map((r) => (
            <Link
              key={r.slug}
              href={`/bao-cao-so-bo/${r.slug}`}
              className={`px-3 py-1 text-xs font-bold rounded-xs border transition ${
                r.slug === report.slug
                  ? 'bg-[#8c6b18] text-white border-[#8c6b18]'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-[#8c6b18]'
              }`}
            >
              {r.slug === 'day-du' ? 'Bản Đầy Đủ' : 'Bản Rút Gọn'}
            </Link>
          ))}
        </div>
      </div>

      <header className="reader-header">
        <span className="publication-kicker">NHÓM 13 · TÀI LIỆU HỌC TẬP</span>
        <h1>{report.title}</h1>
        <div className="publication-actions">
          <a download href={`/reports/${report.fileBase}.docx`} className="publication-primary">
            <Download size={16} /> Tải bản Word gốc (.docx)
          </a>
        </div>
      </header>

      <div className="report-reader">
        <aside className="reader-toc">
          <details open>
            <summary className="flex items-center justify-between">
              <span>Mục lục ({filteredHeadings.length})</span>
            </summary>
            <div className="p-2 border-b border-slate-200">
              <div className="flex items-center gap-1.5 px-2 py-1 bg-white border border-slate-200 rounded text-xs">
                <Search className="w-3 h-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Lọc mục lục..."
                  value={tocFilter}
                  onChange={(e) => setTocFilter(e.target.value)}
                  className="w-full bg-transparent border-0 outline-none text-xs"
                />
              </div>
            </div>
            <nav aria-label="Mục lục báo cáo">
              {filteredHeadings.map((h) => (
                <a
                  key={h.id}
                  href={`#${h.id}`}
                  className={`toc-level-${h.level}`}
                >
                  {h.text}
                </a>
              ))}
            </nav>
          </details>
        </aside>

        <article
          className="report-prose shadow-xs"
          dangerouslySetInnerHTML={{ __html: processedHtml }}
        />
      </div>
    </main>
  );
}
