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
import { TvpayPresentationSlides } from '@/components/tvpay-presentation-slides';
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
                  (Văn kiện pháp lý chính thức &amp; Khung trình chiếu Slide thuyết trình 10 trang chuyên sâu)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href="#workbench-section"
                  className="text-xs font-bold px-3.5 py-1.5 rounded-xl bg-[#C59B27] hover:bg-[#8C6B18] text-white shadow-sm border border-amber-400/80 transition flex items-center gap-1.5"
                >
                  📜 1. Toàn Văn Hợp Đồng
                </a>
                <a
                  href="#slides-section"
                  className="text-xs font-bold px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-105 text-white shadow-sm border border-amber-400/80 transition flex items-center gap-1.5"
                >
                  🖥️ 2. Slide Thuyết Trình 10 Trang
                </a>
              </div>
            </div>

            {/* PART 1: CENTERED FULL-WIDTH INTERACTIVE LEGAL PARCHMENT */}
            <div id="workbench-section">
              <TvpayDocumentPresentation slug={item.slug} />
            </div>

            {/* PART 2: INTERACTIVE PRESENTATION SLIDES (10 TRANG CHI TIẾT) */}
            <div id="slides-section" className="mt-14 pt-8 border-t-2 border-dashed border-amber-900/25">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-2 border-b border-amber-200/80">
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#8C6B18] px-3 py-1 bg-amber-100 rounded-full inline-block mb-1.5">
                    KHUNG TRÌNH CHIẾU SLIDE THUYẾT TRÌNH (10 TRANG CHI TIẾT)
                  </span>
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#0A131E] m-0">
                    Hồ Sơ Tư Vấn Điều Lệ TVPAY: 7 Lá Chắn Bảo Vệ Nhà Đầu Tư &amp; Ma Trận Rủi Ro
                  </h2>
                  <p className="text-xs text-slate-600 mt-1 mb-0">
                    Biên soạn bám sát hồ sơ tư vấn chuyên môn của Nhóm 13 (Khoa Luật HVNH): Bảo vệ 05 Nhà đầu tư khách hàng (50 Tỷ VNĐ), 04 nguyên tắc soạn thảo, 07 lá chắn bảo vệ quyền lợi và ma trận xử lý rủi ro thực tiễn.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href="#workbench-section"
                    className="text-xs font-bold text-[#8C6B18] hover:underline flex items-center gap-1"
                  >
                    ↑ Cuộn lên Văn bản hợp đồng
                  </a>
                </div>
              </div>

              <TvpayPresentationSlides slug={item.slug} />
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
