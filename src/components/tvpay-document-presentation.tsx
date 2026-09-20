import { useState, useMemo } from 'react';
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  FileCheck2,
  FileText,
  HelpCircle,
  Landmark,
  Layers,
  Scale,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { tvpayOfficialDocs, type OfficialDocumentData } from '@/lib/tvpay-official-docs';

interface TvpayDocumentPresentationProps {
  slug: string;
}

export function TvpayDocumentPresentation({ slug }: TvpayDocumentPresentationProps) {
  const docData = tvpayOfficialDocs[slug];
  const [activeTab, setActiveTab] = useState<'outline' | 'roles' | 'protection'>('outline');
  const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTier, setFilterTier] = useState<string>('all');

  if (!docData) {
    return null;
  }

  const toggleChapter = (id: string) => {
    setExpandedChapters((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const expandAll = () => {
    const next: Record<string, boolean> = {};
    docData.chapters.forEach((c) => {
      next[c.id] = true;
    });
    setExpandedChapters(next);
  };

  const collapseAll = () => {
    setExpandedChapters({});
  };

  const filteredChapters = useMemo(() => {
    if (!searchQuery.trim()) return docData.chapters;
    const q = searchQuery.toLowerCase().trim();
    return docData.chapters.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.number.toLowerCase().includes(q) ||
        c.summary.toLowerCase().includes(q) ||
        c.content.toLowerCase().includes(q)
    );
  }, [docData.chapters, searchQuery]);

  const filteredProtections = useMemo(() => {
    if (filterTier === 'all') return docData.legalProtections;
    return docData.legalProtections.filter((p) => p.protectionTier === filterTier);
  }, [docData.legalProtections, filterTier]);

  return (
    <div className="tvpay-doc-presentation-wrap mt-10">
      {/* 1. OFFICIAL DOCUMENT BANNER */}
      <div className="tvpay-doc-banner">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-[rgba(197,155,39,0.3)]">
          <div className="flex items-center gap-3">
            <div className="tvpay-banner-badge">
              <Scale className="w-5 h-5 text-[#8C6B18]" />
            </div>
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#8C6B18]">
                {docData.codeName}
              </span>
              <h2 className="text-2xl font-serif font-bold text-[#0A131E] m-0">
                {docData.officialTitle}
              </h2>
            </div>
          </div>
          <div className="text-right">
            <span className="inline-block text-xs font-semibold px-3 py-1 bg-[#FAF4E6] text-[#8C6B18] border border-[rgba(197,155,39,0.35)] rounded-full">
              {docData.approvedDate}
            </span>
          </div>
        </div>

        <p className="text-sm text-slate-700 leading-relaxed mt-4 mb-4">
          {docData.overview}
        </p>

        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
          <span className="font-bold text-[#684F0E]">Căn cứ pháp lý:</span>
          {docData.legalBases.map((base, idx) => (
            <span
              key={idx}
              className="bg-white/90 border border-slate-200 px-2.5 py-1 rounded text-slate-700"
            >
              {base}
            </span>
          ))}
        </div>
      </div>

      {/* 2. MODE SELECTOR TABS */}
      <div className="tvpay-mode-tabs-container">
        <button
          type="button"
          onClick={() => setActiveTab('outline')}
          className={`tvpay-mode-tab ${activeTab === 'outline' ? 'active' : ''}`}
        >
          <BookOpen className="w-4 h-4" />
          <span>1. Cấu trúc Chương &amp; Toàn văn</span>
          <span className="tab-count-badge">{docData.chapters.length}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('roles')}
          className={`tvpay-mode-tab ${activeTab === 'roles' ? 'active' : ''}`}
        >
          <Landmark className="w-4 h-4" />
          <span>2. Nội dung &amp; Vai trò quan trọng</span>
          <span className="tab-count-badge">{docData.strategicRoles.length}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('protection')}
          className={`tvpay-mode-tab ${activeTab === 'protection' ? 'active' : ''}`}
        >
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>3. Lá chắn Bảo vệ Doanh nghiệp</span>
          <span className="tab-count-badge gold">{docData.legalProtections.length}</span>
        </button>
      </div>

      {/* 3. TAB 1: INTERACTIVE OUTLINE & FULL TEXT */}
      {activeTab === 'outline' && (
        <div className="tvpay-tab-content outline-view">
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-[#FCFBF8] border border-[rgba(197,155,39,0.25)] rounded-xl mb-6">
            <div className="relative flex-1 min-w-[260px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm nhanh điều khoản, từ khóa (vốn, hạn mức, hủy ngang, bảo mật)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-lg outline-none focus:border-[#C59B27]"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={expandAll}
                className="text-xs font-semibold px-3 py-2 bg-white border border-[rgba(197,155,39,0.3)] text-[#8C6B18] rounded-lg hover:bg-[#FAF4E6] transition"
              >
                Mở tất cả ({filteredChapters.length})
              </button>
              <button
                type="button"
                onClick={collapseAll}
                className="text-xs font-semibold px-3 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition"
              >
                Thu gọn tất cả
              </button>
            </div>
          </div>

          <div className="text-xs text-slate-500 italic mb-3 flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-[#8C6B18]" />
            Nhấp vào từng thanh tiêu đề chương/mục để mở xem toàn văn điều khoản chi tiết từ hồ sơ gốc.
          </div>

          <div className="space-y-4">
            {filteredChapters.map((chap) => {
              const isExpanded = !!expandedChapters[chap.id];
              return (
                <div
                  key={chap.id}
                  className={`tvpay-chapter-card ${isExpanded ? 'is-open' : ''}`}
                >
                  <button
                    type="button"
                    onClick={() => toggleChapter(chap.id)}
                    className="tvpay-chapter-header"
                    aria-expanded={isExpanded}
                  >
                    <div className="flex items-center gap-3 flex-1 text-left">
                      <span className="chapter-pill">{chap.number}</span>
                      <div>
                        <h3 className="chapter-title">{chap.title}</h3>
                        <p className="chapter-summary">{chap.summary}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                      {chap.articleCount > 0 && (
                        <span className="text-[11px] text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded">
                          {chap.articleCount} Điều
                        </span>
                      )}
                      <span className="chapter-toggle-indicator">
                        {isExpanded ? (
                          <span className="flex items-center gap-1 text-[#8C6B18] font-bold text-xs">
                            Thu gọn <ChevronUp className="w-4 h-4" />
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-slate-500 font-medium text-xs">
                            Xem toàn văn <ChevronDown className="w-4 h-4" />
                          </span>
                        )}
                      </span>
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="tvpay-chapter-body">
                      <div className="tvpay-prose-content">
                        {chap.content.split('\n\n').map((paragraph, pIdx) => {
                          const isArticleHeading =
                            paragraph.startsWith('Điều ') ||
                            paragraph.startsWith('ĐIỀU ') ||
                            paragraph.startsWith('PHẦN ');

                          if (isArticleHeading) {
                            return (
                              <h4 key={pIdx} className="article-in-chapter-heading">
                                {paragraph}
                              </h4>
                            );
                          }

                          return (
                            <p key={pIdx} className="text-slate-700 leading-relaxed text-sm my-2">
                              {paragraph}
                            </p>
                          );
                        })}
                      </div>
                      <div className="pt-4 mt-4 border-t border-slate-100 flex justify-end">
                        <button
                          type="button"
                          onClick={() => toggleChapter(chap.id)}
                          className="text-xs text-[#8C6B18] font-semibold hover:underline flex items-center gap-1"
                        >
                          Thu gọn chương này <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. TAB 2: STRATEGIC ROLES & CONTENT */}
      {activeTab === 'roles' && (
        <div className="tvpay-tab-content roles-view">
          <div className="mb-6 p-4 bg-gradient-to-r from-[#FFFDF8] to-[#FAF5E8] border-l-4 border-[#C59B27] rounded-r-xl">
            <h3 className="text-base font-bold text-[#684F0E] m-0">
              Tầm quan trọng chiến lược &amp; Vai trò sống còn đối với TVPAY
            </h3>
            <p className="text-xs text-slate-600 mt-1 mb-0">
              Phân tích vai trò nền tảng trong hồ sơ xin cấp phép trung gian thanh toán của Ngân hàng Nhà nước,
              tổ chức quản trị nội bộ và cơ chế bảo vệ khách hàng.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {docData.strategicRoles.map((role, idx) => (
              <div key={idx} className="tvpay-role-card">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#FAF2DA] text-[#7A5B10] border border-[rgba(197,155,39,0.3)]">
                    {role.badge}
                  </span>
                  <span className="text-xs font-mono font-semibold text-slate-500">
                    Trụ cột 0{idx + 1}
                  </span>
                </div>
                <h4 className="text-base font-bold text-[#0A131E] mb-2 leading-snug">
                  {role.title}
                </h4>
                <div className="bg-white p-3 rounded-lg border border-slate-200/80 mb-3">
                  <span className="text-xs font-bold text-[#8C6B18] block mb-1">
                    Điểm then chốt:
                  </span>
                  <strong className="text-sm text-slate-800 font-semibold block">
                    {role.highlight}
                  </strong>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  {role.description}
                </p>
                <div className="pt-2 border-t border-slate-100 text-[11px] text-[#8C6B18] font-medium flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Căn cứ: {role.citation}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. TAB 3: ENTERPRISE PROTECTION SHIELD MATRIX */}
      {activeTab === 'protection' && (
        <div className="tvpay-tab-content protection-view">
          <div className="mb-6 p-4 bg-gradient-to-r from-[#F5FAF8] to-[#EBF5F0] border-l-4 border-emerald-600 rounded-r-xl">
            <h3 className="text-base font-bold text-emerald-900 m-0 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              Lá chắn Bảo vệ Quyền &amp; Lợi ích Hợp pháp của Doanh nghiệp TVPAY
            </h3>
            <p className="text-xs text-emerald-800/80 mt-1 mb-0">
              Ma trận đối chiếu giữa các rủi ro pháp lý/kỹ thuật thực tế trong ngành ví điện tử và điều khoản phòng vệ đã được cài cắm trong văn bản.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-xs font-semibold text-slate-500 mr-1">Lọc cấp độ:</span>
            {['all', 'Lá chắn cốt lõi', 'Miễn trừ trách nhiệm', 'Kiểm soát rủi ro'].map((tier) => (
              <button
                key={tier}
                type="button"
                onClick={() => setFilterTier(tier)}
                className={`text-xs px-3 py-1.5 rounded-full border transition font-medium ${
                  filterTier === tier
                    ? 'bg-[#0A131E] text-white border-[#0A131E]'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {tier === 'all' ? 'Tất cả lá chắn' : tier}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {filteredProtections.map((item, idx) => (
              <div key={idx} className="tvpay-protection-card">
                <div className="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-red-50 text-red-600">
                      <ShieldAlert className="w-4 h-4" />
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 m-0">
                      {item.riskTitle}
                    </h4>
                  </div>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                      item.protectionTier === 'Lá chắn cốt lõi'
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : item.protectionTier === 'Miễn trừ trách nhiệm'
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        : 'bg-blue-100 text-blue-900 border border-blue-300'
                    }`}
                  >
                    {item.protectionTier}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                  <div className="bg-red-50/60 p-3 rounded-lg border border-red-100">
                    <span className="text-[11px] font-bold text-red-700 block uppercase tracking-wider mb-1">
                      ⚠️ Tình huống rủi ro thực tế:
                    </span>
                    <p className="text-xs text-slate-700 leading-relaxed m-0">
                      {item.riskScenario}
                    </p>
                  </div>

                  <div className="bg-emerald-50/60 p-3 rounded-lg border border-emerald-100">
                    <span className="text-[11px] font-bold text-emerald-800 block uppercase tracking-wider mb-1">
                      🛡️ Điều khoản &amp; Cơ chế bảo vệ TVPAY:
                    </span>
                    <p className="text-xs text-slate-800 leading-relaxed font-medium m-0">
                      {item.solution}
                    </p>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="text-[#8C6B18] font-semibold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    {item.articleRef}
                  </span>
                  <span className="text-slate-600 bg-slate-50 px-2.5 py-1 rounded border border-slate-200">
                    <strong>Tác dụng:</strong> {item.keyTakeaway}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
