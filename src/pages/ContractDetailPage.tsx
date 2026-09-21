import { Link, useRouter } from '@/router';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleAlert,
  FileCheck2,
  Scale,
} from 'lucide-react';
import { contracts, getContract, getService } from '@/lib/site-data';
import { contractReportContent } from '@/lib/contract-report-content';
import { ContractReport } from '@/components/contract-report';
import { TvpayDocumentPresentation } from '@/components/tvpay-document-presentation';
import { tvpayOfficialDocs } from '@/lib/tvpay-official-docs';

export function ContractDetailPage() {
  const { params } = useRouter();
  const slug = params.slug;
  const item = slug ? getContract(slug) : undefined;
  const service = item ? getService(item.group) : undefined;
  const report = item ? contractReportContent[item.slug] : undefined;

  if (!item) {
    return (
      <main className="contract-detail-page">
        <section className="contract-detail-hero">
          <div className="site-shell">
            <Link className="back-link" href="/hop-dong">
              <ArrowLeft /> Thư viện hợp đồng
            </Link>
            <div className="contract-detail-heading">
              <div>
                <h1>Không tìm thấy tài liệu</h1>
                <p>
                  Tài liệu bạn đang tìm kiếm không tồn tại hoặc đã được chuyển địa chỉ.
                </p>
                <div style={{ marginTop: '24px' }}>
                  <Link className="gold-button" href="/hop-dong">
                    Quay lại thư viện hợp đồng <ArrowRight />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  const isTvpayOfficial = !!tvpayOfficialDocs[item.slug];

  return (
    <main className="contract-detail-page">
      <section className="contract-detail-hero">
        <div className="site-shell">
          <Link className="back-link" href="/hop-dong">
            <ArrowLeft /> Thư viện hợp đồng
          </Link>
          <div className="contract-detail-heading">
            <div>
              <span className={item.minimum ? 'tier minimum' : 'tier advanced'}>
                {item.minimum ? 'Tối thiểu (*)' : 'Nâng cao'}
              </span>
              <span className="contract-group-label">
                Phần {service?.number} · {service?.title}
              </span>
              <h1>{item.title}</h1>
              <p>{item.summary}</p>
            </div>
            <aside>
              <span>Phụ trách nội dung</span>
              <strong>{item.owner}</strong>
              <small>
                {report
                  ? 'Có nội dung chi tiết từ báo cáo'
                  : 'Bản giới thiệu phục vụ học tập'}
              </small>
            </aside>
          </div>
        </div>
      </section>

      {isTvpayOfficial ? (
        <section className="content-section py-8">
          <div className="site-shell max-w-7xl mx-auto">
            {/* Quick Section Anchor Navigator */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-amber-50/70 border border-amber-200/80 rounded-2xl mb-6 shadow-xs">
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold uppercase text-[#7A5B10] tracking-wide">
                  Chế độ hiển thị:
                </span>
                <span className="text-xs text-slate-600">
                  (Bao gồm cả Bàn làm việc HĐ 2 cột mới &amp; Đầy đủ hồ sơ phân tích file cũ)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href="#workbench-section"
                  className="text-xs font-bold px-3.5 py-1.5 rounded-xl bg-[#C59B27] hover:bg-[#8C6B18] text-white shadow-sm border border-amber-400/80 transition flex items-center gap-1.5"
                >
                  📜 1. Hợp đồng 2 Cột
                </a>
                <a
                  href="#original-dossier-section"
                  className="text-xs font-bold px-3.5 py-1.5 rounded-xl bg-white text-[#7A5B10] border border-amber-300 shadow-xs hover:bg-amber-100/60 transition flex items-center gap-1.5"
                >
                  📊 2. Khung Phân Tích File Cũ (Mục 01-06)
                </a>
              </div>
            </div>

            {/* PART 1: 2-COLUMN INTERACTIVE LEGAL WORKBENCH */}
            <div id="workbench-section">
              <TvpayDocumentPresentation slug={item.slug} />
            </div>

            {/* PART 2: COMPLETE ORIGINAL DOSSIER (THÔNG TIN FILE CŨ NGUYÊN BẢN 100%) */}
            <div
              id="original-dossier-section"
              className="mt-16 pt-12 border-t-2 border-dashed border-amber-900/25"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-200">
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#8C6B18] px-3 py-1 bg-amber-100 rounded-full inline-block mb-2">
                    HỒ SƠ PHÂN TÍCH &amp; BÁO CÁO GỐC CỦA FILE
                  </span>
                  <h2 className="text-2xl font-serif font-bold text-[#0A131E] m-0">
                    Khung Phân Tích Nghiệp Vụ &amp; Báo Cáo Chi Tiết
                  </h2>
                  <p className="text-xs text-slate-600 mt-1 mb-0">
                    Lưu giữ đầy đủ 100% thông tin đối tượng áp dụng, rủi ro trọng tâm, tài liệu bàn giao, căn cứ và báo cáo tư vấn của Nhóm 13.
                  </p>
                </div>
                <a
                  href="#workbench-section"
                  className="text-xs font-bold text-[#8C6B18] hover:underline flex items-center gap-1"
                >
                  ↑ Cuộn lên Hợp đồng 2 cột
                </a>
              </div>

              <div className="contract-detail-grid">
                <article className="legal-article">
                  <section>
                    <span className="article-kicker">01 · Đối tượng áp dụng</span>
                    <h2>Quan hệ pháp lý được điều chỉnh</h2>
                    <p>{item.audience}</p>
                  </section>
                  <section>
                    <span className="article-kicker">02 · Vấn đề cần giải quyết</span>
                    <h2>Rủi ro trọng tâm</h2>
                    <p>{item.solves}</p>
                    <div className="legal-warning">
                      <CircleAlert />
                      <p>
                        Phạm vi hợp đồng phải thống nhất với giấy phép, quy trình kỹ
                        thuật và thực tế vận hành. Tên gọi giao dịch không thay thế
                        việc xác định đúng bản chất pháp lý.
                      </p>
                    </div>
                  </section>
                  <section>
                    <span className="article-kicker">03 · Sản phẩm bàn giao</span>
                    <h2>Bộ tài liệu dự kiến</h2>
                    <ul className="check-list">
                      {item.deliverables.map((entry) => (
                        <li key={entry}>
                          <Check />
                          {entry}
                        </li>
                      ))}
                    </ul>
                  </section>
                  <section>
                    <span className="article-kicker">04 · Nội dung cốt lõi</span>
                    <h2>Điều khoản cần ưu tiên</h2>
                    <div className="clause-grid">
                      {item.clauses.map((entry, index) => (
                        <div key={entry}>
                          <span>0{index + 1}</span>
                          <strong>{entry}</strong>
                        </div>
                      ))}
                    </div>
                  </section>
                  <section>
                    <span className="article-kicker">05 · Căn cứ tham chiếu</span>
                    <h2>Khung pháp luật liên quan</h2>
                    <ul className="law-list">
                      {item.legalBases.map((law) => (
                        <li key={law}>
                          <Scale />
                          {law}
                        </li>
                      ))}
                    </ul>
                    <p className="source-note">
                      Hiệu lực và văn bản sửa đổi cần được kiểm tra lại tại thời điểm
                      áp dụng thực tế.
                    </p>
                  </section>
                  {report && <ContractReport content={report} />}
                </article>

                <aside className="detail-sidebar">
                  <div className="sticky-card">
                    <FileCheck2 />
                    <h2>Tạo bản dự thảo theo thông tin của bạn</h2>
                    <p>
                      Điền tên nhà đầu tư, thông tin doanh nghiệp ví và đối tác để
                      nhận bản dự thảo có cấu trúc từ mẫu này.
                    </p>
                    {report ? (
                      <Link
                        className="gold-button dark"
                        href={`/cong-cu/tao-hop-dong?mau=${item.slug}`}
                      >
                        Tạo hợp đồng <ArrowRight />
                      </Link>
                    ) : (
                      <Link className="gold-button dark" href="/lien-he">
                        Trao đổi phạm vi <ArrowRight />
                      </Link>
                    )}
                  </div>
                  <div className="selection-tip">
                    <strong>Mẹo tra cứu</strong>
                    <p>
                      Bôi đen một đoạn rồi chọn “Hỏi trợ lý” để được giải thích theo
                      bối cảnh ví điện tử.
                    </p>
                  </div>
                </aside>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="content-section">
          <div className="site-shell contract-detail-grid">
            <article className="legal-article">
              <section>
                <span className="article-kicker">01 · Đối tượng áp dụng</span>
                <h2>Quan hệ pháp lý được điều chỉnh</h2>
                <p>{item.audience}</p>
              </section>
              <section>
                <span className="article-kicker">02 · Vấn đề cần giải quyết</span>
                <h2>Rủi ro trọng tâm</h2>
                <p>{item.solves}</p>
                <div className="legal-warning">
                  <CircleAlert />
                  <p>
                    Phạm vi hợp đồng phải thống nhất với giấy phép, quy trình kỹ
                    thuật và thực tế vận hành. Tên gọi giao dịch không thay thế
                    việc xác định đúng bản chất pháp lý.
                  </p>
                </div>
              </section>
              <section>
                <span className="article-kicker">03 · Sản phẩm bàn giao</span>
                <h2>Bộ tài liệu dự kiến</h2>
                <ul className="check-list">
                  {item.deliverables.map((entry) => (
                    <li key={entry}>
                      <Check />
                      {entry}
                    </li>
                  ))}
                </ul>
              </section>
              <section>
                <span className="article-kicker">04 · Nội dung cốt lõi</span>
                <h2>Điều khoản cần ưu tiên</h2>
                <div className="clause-grid">
                  {item.clauses.map((entry, index) => (
                    <div key={entry}>
                      <span>0{index + 1}</span>
                      <strong>{entry}</strong>
                    </div>
                  ))}
                </div>
              </section>
              <section>
                <span className="article-kicker">05 · Căn cứ tham chiếu</span>
                <h2>Khung pháp luật liên quan</h2>
                <ul className="law-list">
                  {item.legalBases.map((law) => (
                    <li key={law}>
                      <Scale />
                      {law}
                    </li>
                  ))}
                </ul>
                <p className="source-note">
                  Hiệu lực và văn bản sửa đổi cần được kiểm tra lại tại thời điểm
                  áp dụng thực tế.
                </p>
              </section>
              {report && <ContractReport content={report} />}
            </article>
            <aside className="detail-sidebar">
              <div className="sticky-card">
                <FileCheck2 />
                <h2>Tạo bản dự thảo theo thông tin của bạn</h2>
                <p>
                  Điền tên nhà đầu tư, thông tin doanh nghiệp ví và đối tác để
                  nhận bản dự thảo có cấu trúc từ mẫu này.
                </p>
                {report ? (
                  <Link
                    className="gold-button dark"
                    href={`/cong-cu/tao-hop-dong?mau=${item.slug}`}
                  >
                    Tạo hợp đồng <ArrowRight />
                  </Link>
                ) : (
                  <Link className="gold-button dark" href="/lien-he">
                    Trao đổi phạm vi <ArrowRight />
                  </Link>
                )}
              </div>
              <div className="selection-tip">
                <strong>Mẹo tra cứu</strong>
                <p>
                  Bôi đen một đoạn rồi chọn “Hỏi trợ lý” để được giải thích theo
                  bối cảnh ví điện tử.
                </p>
              </div>
            </aside>
          </div>
        </section>
      )}
    </main>
  );
}
