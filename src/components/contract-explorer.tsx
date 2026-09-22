import { useMemo, useState } from 'react';
import { Link } from '@/router';
import { ArrowUpRight, CheckCircle2, ChevronRight, FileCheck2, FileText, Layers, Presentation, Scale, Search, ShieldCheck, SlidersHorizontal, Sparkles, Star } from 'lucide-react';
import { contracts, services } from '@/lib/site-data';
import { contractReportContent } from '@/lib/contract-report-content';

type Tier = 'all' | 'demo' | 'minimum' | 'advanced';

export function ContractExplorer() {
  const [query, setQuery] = useState('');
  const [tier, setTier] = useState<Tier>('all');
  const [group, setGroup] = useState('all');

  const results = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('vi');
    return contracts.filter(
      (item) =>
        (!normalized ||
          `${item.title} ${item.summary} ${item.audience}`
            .toLocaleLowerCase('vi')
            .includes(normalized)) &&
        (tier === 'all' ||
          (tier === 'demo'
            ? item.slug === 'dieu-le-cong-ty-co-phan' || item.slug === 'mo-va-su-dung-vi-dien-tu'
            : tier === 'minimum'
              ? item.minimum
              : !item.minimum)) &&
        (group === 'all' || item.group === group)
    );
  }, [query, tier, group]);

  return (
    <div className="contract-explorer">
      {/* ========================================================================= */}
      {/* PHẦN 2: HAI SẢN PHẨM PHÁP LÝ DEMO TRỌNG TÂM (CASE STUDY TVPAY)            */}
      {/* ========================================================================= */}
      <section className="demo-products-showcase mb-8 p-5 sm:p-7 bg-gradient-to-br from-[#FFFDF9] via-[#FAF6EE] to-[#F5ECE0] rounded-2xl border-2 border-amber-300/90 shadow-[0_8px_30px_rgba(180,140,40,0.12)] relative overflow-hidden">
        {/* Decorative Watermark & Filigree Patterns */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(ellipse_at_top_right,rgba(212,175,55,0.15),transparent_70%)] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[radial-gradient(ellipse_at_bottom_left,rgba(212,175,55,0.12),transparent_70%)] pointer-events-none" />

        <div className="relative z-10 mb-5">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-amber-100/90 text-amber-900 border border-amber-300 shadow-2xs font-mono">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-600" />
              PHẦN 2 · HAI SẢN PHẨM PHÁP LÝ DEMO TRỌNG TÂM
            </span>
            <span className="text-xs text-amber-900/80 font-medium">
              Case Study Ví điện tử TVPAY · Đề bài Thầy giao &amp; Bảo vệ 05 Nhà đầu tư
            </span>
          </div>

          <h2 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 m-0 tracking-tight">
            Hai Sản Phẩm Báo Cáo Cốt Lõi Của Nhóm 13 (Thịnh Vượng Legal)
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1.5 max-w-4xl leading-relaxed">
            Dưới đây là 02 sản phẩm pháp lý nòng cốt được xây dựng chuyên sâu toàn diện, tích hợp đầy đủ <strong>Slide Thuyết trình Rạp chiếu (Cinema Mode)</strong>, trích lục toàn văn điều khoản, giải pháp bảo vệ quyền lợi doanh nghiệp và biểu mẫu tải Word theo đúng đề tài.
          </p>
        </div>

        {/* 2 VIP Demo Showcase Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 relative z-10">
          {/* DEMO PRODUCT 1: ĐIỀU LỆ CÔNG TY CP */}
          <div className="p-5 bg-white/95 rounded-xl border-2 border-amber-300/80 shadow-[0_4px_16px_rgba(180,140,40,0.08)] hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2.5 pb-2 border-b border-amber-100">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10.5px] font-bold uppercase tracking-wider bg-amber-50 text-[#8C6B18] border border-amber-200">
                  <FileText className="w-3.5 h-3.5 text-[#8C6B18]" />
                  SẢN PHẨM DEMO 01 · SLIDE THUYẾT TRÌNH
                </span>
                <span className="text-[11px] font-mono font-bold text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded">
                  Vốn 50 Tỷ · 05 NĐT Sáng Lập
                </span>
              </div>

              <h3 className="font-serif text-base sm:text-lg font-bold text-slate-900 m-0 mb-2 group-hover:text-amber-900 transition-colors">
                Điều Lệ Công Ty Cổ Phần Cung Ứng Ví Điện Tử TVPAY
              </h3>

              <p className="text-xs text-slate-600 leading-relaxed m-0 mb-3">
                Quy chế quản trị nội bộ tối cao xác lập cơ chế ra quyết định ĐHĐCĐ (tỷ lệ phủ quyết 65%), thẩm quyền HĐQT - BKS, khóa chuyển nhượng cổ phần sáng lập trong 03 năm đầu và trích lập Quỹ dự trữ thanh toán rủi ro 2% bảo vệ vốn nhà đầu tư.
              </p>

              <div className="p-2.5 bg-[#FAF6EE] rounded-lg border border-amber-200/80 text-[11.5px] text-slate-700 space-y-1 mb-4">
                <div className="flex items-center gap-1.5 text-amber-900 font-semibold">
                  <Scale className="w-3.5 h-3.5 text-[#8C6B18]" />
                  <span>Chủ thể ký kết:</span>
                  <span className="font-normal text-slate-800">05 Nhà đầu tư sáng lập (Lê Quang Tùng, Trịnh Hoàng Sơn, Nguyễn Minh Lân, Phạm Phương Hà, Lê Thu Minh)</span>
                </div>
                <div className="flex items-center gap-1.5 text-amber-900 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Thuyết trình:</span>
                  <span className="font-normal text-slate-800">Đoàn Ánh Phương (Nhóm trưởng), Lê Phương Thảo, Vũ Thảo, Dạ Thảo, Hồng Nhung, Kiều Hoài Thu</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-amber-100">
              <Link
                href="/hop-dong/dieu-le-cong-ty-co-phan"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#D4AF37] via-[#C59B27] to-[#8C6B18] text-white font-bold text-xs shadow-xs hover:brightness-110 transition cursor-pointer"
              >
                <Presentation className="w-3.5 h-3.5" />
                <span>Xem Toàn Văn &amp; Slide Thuyết Trình</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
              <button
                type="button"
                onClick={() => {
                  setTier('demo');
                  setQuery('Điều lệ');
                }}
                className="px-3 py-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-[#8C6B18] border border-amber-200 font-semibold text-xs transition cursor-pointer"
              >
                Lọc xem mục này
              </button>
            </div>
          </div>

          {/* DEMO PRODUCT 2: THỎA THUẬN MỞ VÍ */}
          <div className="p-5 bg-white/95 rounded-xl border-2 border-amber-300/80 shadow-[0_4px_16px_rgba(180,140,40,0.08)] hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2.5 pb-2 border-b border-amber-100">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10.5px] font-bold uppercase tracking-wider bg-amber-50 text-[#8C6B18] border border-amber-200">
                  <FileCheck2 className="w-3.5 h-3.5 text-[#8C6B18]" />
                  SẢN PHẨM DEMO 02 · SLIDE THUYẾT TRÌNH
                </span>
                <span className="text-[11px] font-mono font-bold text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded">
                  Hợp Đồng Mẫu · Người Dùng Cuối
                </span>
              </div>

              <h3 className="font-serif text-base sm:text-lg font-bold text-slate-900 m-0 mb-2 group-hover:text-amber-900 transition-colors">
                Hợp Đồng Mở Và Sử Dụng Ví Điện Tử TVPAY
              </h3>

              <p className="text-xs text-slate-600 leading-relaxed m-0 mb-3">
                Hợp đồng mẫu gia nhập (Adhesion Contract) xác lập quyền nghĩa vụ giữa TVPAY và khách hàng mở ví, chuẩn hóa quy trình eKYC Thông tư 40/2024, hạn mức 100 triệu, <strong>Phần C (Tiện ích lõi, Hệ sinh thái, An toàn, Lợi thế NĐT)</strong> và 03 Phụ lục an toàn.
              </p>

              <div className="p-2.5 bg-[#FAF6EE] rounded-lg border border-amber-200/80 text-[11.5px] text-slate-700 space-y-1 mb-4">
                <div className="flex items-center gap-1.5 text-amber-900 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Chủ thể ký kết:</span>
                  <span className="font-normal text-slate-800">Công ty Cổ phần TVPAY &amp; Khách hàng mở ví (Opt-in điện tử)</span>
                </div>
                <div className="flex items-center gap-1.5 text-amber-900 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Thuyết trình:</span>
                  <span className="font-normal text-slate-800">Trần Thị Thơ, Lê Phương Thảo, Trần Thị Thùy, Vương Thu Thủy, Phạm Văn Quang, Đoàn Ánh Phương</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-amber-100">
              <Link
                href="/hop-dong/mo-va-su-dung-vi-dien-tu"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#D4AF37] via-[#C59B27] to-[#8C6B18] text-white font-bold text-xs shadow-xs hover:brightness-110 transition cursor-pointer"
              >
                <Presentation className="w-3.5 h-3.5" />
                <span>Xem Toàn Văn &amp; Slide Thuyết Trình</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
              <button
                type="button"
                onClick={() => {
                  setTier('demo');
                  setQuery('Mở và sử dụng ví');
                }}
                className="px-3 py-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-[#8C6B18] border border-amber-200 font-semibold text-xs transition cursor-pointer"
              >
                Lọc xem mục này
              </button>
            </div>
          </div>
        </div>

        {/* Quick Filter Status Bar */}
        <div className="mt-4 pt-3 border-t border-amber-200/80 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-[#7A5B10]">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>
              {tier === 'demo' ? (
                <strong>Đang lọc: Chỉ hiển thị 02 sản phẩm demo trọng tâm trong danh sách bên dưới</strong>
              ) : (
                <span>Bấm nút lọc nhanh bên dưới để tra cứu hoặc lọc riêng 02 sản phẩm demo</span>
              )}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {tier === 'demo' ? (
              <button
                type="button"
                onClick={() => {
                  setTier('all');
                  setQuery('');
                }}
                className="text-amber-800 font-bold underline hover:text-amber-950 cursor-pointer text-xs"
              >
                ← Xem toàn bộ 20 hợp đồng
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setTier('demo');
                  setQuery('');
                }}
                className="px-2.5 py-1 rounded bg-amber-200/70 hover:bg-amber-200 text-amber-950 font-bold text-[11px] cursor-pointer transition border border-amber-300"
              >
                ⭐ Bấm để chỉ lọc 2 sản phẩm Demo
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Standard Explorer Controls */}
      <div className="contract-controls">
        <label className="search-box">
          <Search aria-hidden="true" />
          <span className="sr-only">Tìm hợp đồng</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm theo tên, đối tượng hoặc vấn đề…"
          />
        </label>
        <div className="filter-row" aria-label="Lọc theo mức dịch vụ">
          <SlidersHorizontal aria-hidden="true" />
          {(
            [
              ['all', 'Tất cả (20)'],
              ['demo', '⭐ 2 Sản phẩm Demo (Phần 2)'],
              ['minimum', 'Tối thiểu (*)'],
              ['advanced', 'Nâng cao'],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              onClick={() => setTier(value)}
              className={tier === value ? 'active' : ''}
            >
              {label}
            </button>
          ))}
        </div>
        <label className="select-box">
          <span className="sr-only">Lọc theo nhóm dịch vụ</span>
          <select value={group} onChange={(e) => setGroup(e.target.value)}>
            <option value="all">Mọi nhóm dịch vụ</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.number}. {s.title}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="result-summary">
        <strong>{results.length}</strong> tài liệu phù hợp{' '}
        <span>· {tier === 'demo' ? 'Bộ lọc 2 Sản phẩm Demo Trọng tâm' : 'Cập nhật 09/2026'}</span>
      </div>

      {results.length ? (
        <div className="contract-grid">
          {results.map((item) => {
            const service = services.find((s) => s.id === item.group);
            const hasReport = Boolean(contractReportContent[item.slug]);
            return (
              <Link
                className="contract-card"
                href={`/hop-dong/${item.slug}`}
                key={item.slug}
              >
                <div className="contract-card-top">
                  <span
                    className={item.minimum ? 'tier minimum' : 'tier advanced'}
                  >
                    {item.minimum ? 'Tối thiểu (*)' : 'Nâng cao'}
                  </span>
                  <ArrowUpRight />
                </div>
                <span className="contract-group">
                  {service?.number}. {service?.title}
                </span>
                <h2>{item.shortTitle}</h2>
                <p>{item.summary}</p>
                {hasReport && (
                  <span className="report-available text-xs text-[#0c665f] bg-[#e8f1ef] px-2.5 py-1 font-semibold flex items-center gap-1.5 w-fit mb-3">
                    Có nội dung chi tiết từ báo cáo
                  </span>
                )}
                <span className="contract-owner">
                  Phụ trách: {item.owner}
                </span>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="empty-state">
          <Search />
          <h2>Chưa tìm thấy tài liệu phù hợp</h2>
          <p>Thử bỏ bớt từ khóa hoặc chọn lại nhóm dịch vụ.</p>
        </div>
      )}
    </div>
  );
}
