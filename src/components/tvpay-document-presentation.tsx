import React, { useState, useMemo, useRef, useEffect } from 'react';
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
  Volume2,
  VolumeX,
  ExternalLink,
  Check,
  Award,
  ArrowRight,
  Maximize2,
  Minimize2,
  Eye,
} from 'lucide-react';
import {
  tvpayOfficialDocs,
  getChapterArticles,
  type OfficialDocumentData,
  type DocumentChapter,
  type DocumentArticle,
} from '@/lib/tvpay-official-docs';
import { StreamingLegalText } from '@/components/streaming-legal-text';
import { uiSound } from '@/lib/ui-sound';
import { Link } from '@/router';

interface TvpayDocumentPresentationProps {
  slug: string;
}

// Delicate filigree corner vector for parchment contract borders
function CornerFiligree({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`tvpay-filigree-svg ${className}`}
      aria-hidden="true"
    >
      <path
        d="M3 3H48C40 3 30 13 30 23C30 33 40 38 40 48C40 58 32 66 22 66C12 66 3 56 3 48V3Z"
        stroke="url(#filigreeGold)"
        strokeWidth="1.4"
        fill="none"
        opacity="0.85"
      />
      <path
        d="M5 5C20 5 35 20 35 35C35 45 28 52 18 52C8 52 5 45 5 35Z"
        stroke="url(#filigreeGold)"
        strokeWidth="1.1"
        fill="rgba(197, 155, 39, 0.08)"
      />
      <circle cx="12" cy="12" r="3.5" fill="#C59B27" />
      <circle cx="28" cy="8" r="2" fill="#8C6B18" />
      <circle cx="8" cy="28" r="2" fill="#8C6B18" />
      <path
        d="M3 3L28 3M3 3L3 28"
        stroke="#8C6B18"
        strokeWidth="3"
        strokeLinecap="square"
      />
      <defs>
        <linearGradient
          id="filigreeGold"
          x1="0"
          y1="0"
          x2="72"
          y2="72"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#E6C86E" />
          <stop offset="0.5" stopColor="#9E7719" />
          <stop offset="1" stopColor="#F5D77F" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function TvpayDocumentPresentation({ slug }: TvpayDocumentPresentationProps) {
  const docData = tvpayOfficialDocs[slug];

  // State
  const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>({
    'dl-chap-1': true, // open chapter 1 by default
    'hd-sec-1': true,
    'hd-sec-2': true,
  });
  const [openedArticles, setOpenedArticles] = useState<Record<string, boolean>>({
    'dl-chap-1-art-1': true, // open first provision by default
    'hd-sec-1-art-1': true,
  });
  const [rightDockTab, setRightDockTab] = useState<'roles' | 'protection' | 'brief'>('roles');
  const [filterTier, setFilterTier] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [soundActive, setSoundActive] = useState(() => uiSound.isEnabled());
  const [highlightedArticleId, setHighlightedArticleId] = useState<string | null>(null);

  // Subscribe to sound state
  useEffect(() => {
    return uiSound.subscribe((enabled) => setSoundActive(enabled));
  }, []);

  if (!docData) {
    return null;
  }

  const otherDocSlug =
    slug === 'dieu-le-cong-ty-co-phan'
      ? 'mo-va-su-dung-vi-dien-tu'
      : 'dieu-le-cong-ty-co-phan';
  const otherDocData = tvpayOfficialDocs[otherDocSlug];

  // Toggle chapter
  const toggleChapter = (chapterId: string) => {
    uiSound.playClick();
    setExpandedChapters((prev) => ({
      ...prev,
      [chapterId]: !prev[chapterId],
    }));
  };

  // Toggle single provision
  const toggleArticle = (articleId: string) => {
    setOpenedArticles((prev) => {
      const willOpen = !prev[articleId];
      if (willOpen) {
        uiSound.playOpenProvision();
      } else {
        uiSound.playClick();
      }
      return {
        ...prev,
        [articleId]: willOpen,
      };
    });
  };

  const expandAllChapters = () => {
    uiSound.playClick();
    const nextChapters: Record<string, boolean> = {};
    docData.chapters.forEach((c) => {
      nextChapters[c.id] = true;
    });
    setExpandedChapters(nextChapters);
  };

  const collapseAllChapters = () => {
    uiSound.playClick();
    setExpandedChapters({});
    setOpenedArticles({});
  };

  const openAllArticlesInChapter = (chap: DocumentChapter) => {
    uiSound.playClick();
    const articles = getChapterArticles(chap);
    setExpandedChapters((prev) => ({ ...prev, [chap.id]: true }));
    setOpenedArticles((prev) => {
      const next = { ...prev };
      articles.forEach((a) => {
        next[a.id] = true;
      });
      return next;
    });
  };

  // Jump from Right Dock (Roles or Shield) to a specific article on Left Parchment Contract
  const jumpToArticle = (chapNumberQuery: string, articleNumberQuery: string) => {
    uiSound.playOpenProvision();

    // Find the chapter
    const targetChapter = docData.chapters.find(
      (c) =>
        c.number.toLowerCase().includes(chapNumberQuery.toLowerCase()) ||
        c.title.toLowerCase().includes(chapNumberQuery.toLowerCase()),
    );

    if (targetChapter) {
      setExpandedChapters((prev) => ({ ...prev, [targetChapter.id]: true }));
      const articles = getChapterArticles(targetChapter);
      const targetArticle = articles.find(
        (a) =>
          a.articleNumber.toLowerCase().includes(articleNumberQuery.toLowerCase()) ||
          a.title.toLowerCase().includes(articleNumberQuery.toLowerCase()),
      );

      if (targetArticle) {
        setOpenedArticles((prev) => ({ ...prev, [targetArticle.id]: true }));
        setHighlightedArticleId(targetArticle.id);

        setTimeout(() => {
          const el = document.getElementById(targetArticle.id);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 150);

        setTimeout(() => {
          setHighlightedArticleId(null);
        }, 3500);
      }
    }
  };

  // Filter protections
  const filteredProtections = useMemo(() => {
    if (filterTier === 'all') return docData.legalProtections;
    return docData.legalProtections.filter((p) => p.protectionTier === filterTier);
  }, [docData.legalProtections, filterTier]);

  // Filter chapters/provisions by search
  const filteredChapters = useMemo(() => {
    if (!searchQuery.trim()) return docData.chapters;
    const q = searchQuery.toLowerCase().trim();
    return docData.chapters.filter((chap) => {
      if (chap.title.toLowerCase().includes(q) || chap.number.toLowerCase().includes(q)) {
        return true;
      }
      const articles = getChapterArticles(chap);
      return articles.some(
        (a) =>
          a.articleNumber.toLowerCase().includes(q) ||
          a.title.toLowerCase().includes(q) ||
          a.content.toLowerCase().includes(q),
      );
    });
  }, [docData.chapters, searchQuery]);

  return (
    <div className="tvpay-full-workbench-wrap">
      {/* 1. TOP DUAL-DOCUMENT SWITCHER & SOUND CONTROL BAR */}
      <div className="tvpay-top-action-bar">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Văn kiện chính thức:
            </span>
            <span className="text-xs font-extrabold px-3 py-1 bg-amber-100 text-[#7A5B10] border border-amber-300 rounded-full flex items-center gap-1.5 shadow-sm">
              <Award className="w-3.5 h-3.5 text-[#8C6B18]" />
              {docData.officialTitle}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Document Switcher */}
            {otherDocData && (
              <Link
                href={`/hop-dong/${otherDocSlug}`}
                className="text-xs font-semibold px-3 py-1.5 bg-white hover:bg-amber-50 text-[#8C6B18] border border-[rgba(197,155,39,0.35)] rounded-lg transition flex items-center gap-1.5 shadow-xs"
              >
                <span>Chuyển sang: {otherDocData.codeName}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}

            {/* Sound Toggle Button */}
            <button
              type="button"
              onClick={() => uiSound.toggleSound()}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition flex items-center gap-1.5 ${
                soundActive
                  ? 'bg-amber-50 text-[#8C6B18] border-[rgba(197,155,39,0.4)] shadow-xs'
                  : 'bg-slate-100 text-slate-500 border-slate-200'
              }`}
              title={soundActive ? 'Tắt âm thanh click & chạm' : 'Bật âm thanh click & chạm'}
            >
              {soundActive ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-[#8C6B18]" />
                  <span>Âm thanh UI: Bật</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                  <span>Âm thanh UI: Tắt</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN 2-COLUMN WORKBENCH GRID */}
      <div className="tvpay-workbench-grid grid grid-cols-1 lg:grid-cols-12 gap-7 mt-6 items-start">
        {/* =========================================================================
            LEFT COLUMN (~58%): PARCHMENT CONTRACT (HỢP ĐỒNG GIẤY NGÀ TƯƠNG TÁC)
            ========================================================================= */}
        <div className="lg:col-span-7">
          <div className="tvpay-parchment-contract relative p-6 sm:p-9 rounded-2xl shadow-xl">
            {/* 4 Corner Filigree vector ornaments */}
            <CornerFiligree className="absolute top-2.5 left-2.5 w-14 h-14 pointer-events-none opacity-85" />
            <CornerFiligree className="absolute top-2.5 right-2.5 w-14 h-14 pointer-events-none opacity-85 -scale-x-100" />
            <CornerFiligree className="absolute bottom-2.5 left-2.5 w-14 h-14 pointer-events-none opacity-85 -scale-y-100" />
            <CornerFiligree className="absolute bottom-2.5 right-2.5 w-14 h-14 pointer-events-none opacity-85 -scale-x-100 -scale-y-100" />

            {/* Inner Gold Inset Border */}
            <div className="tvpay-parchment-inner-border" />

            {/* Contract Formal National Emblem & Header */}
            <div className="text-center pt-2 pb-6 border-b border-amber-900/15 relative z-10">
              <p className="font-serif font-bold text-xs uppercase tracking-widest text-[#0A131E] m-0">
                CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
              </p>
              <p className="font-serif text-xs font-semibold text-slate-700 italic tracking-wide mt-1 m-0">
                Độc lập – Tự do – Hạnh phúc
              </p>
              <div className="w-28 h-[1px] bg-[#C59B27] mx-auto my-2 opacity-60" />

              <h2 className="font-serif text-xl sm:text-2xl font-black text-[#0A131E] tracking-tight uppercase mt-4 mb-2">
                {docData.officialTitle}
              </h2>
              <p className="text-xs font-semibold text-[#8C6B18] tracking-wide m-0">
                {docData.codeName} · {docData.approvedDate}
              </p>

              <div className="mt-3 inline-flex flex-wrap justify-center gap-1.5 max-w-xl mx-auto text-[11px] text-slate-600">
                <span className="font-bold text-slate-700">Căn cứ:</span>
                {docData.legalBases.map((base, idx) => (
                  <span
                    key={idx}
                    className="bg-amber-50/70 border border-amber-200/80 px-2 py-0.5 rounded text-slate-700"
                  >
                    {base}
                  </span>
                ))}
              </div>
            </div>

            {/* Contract Interactive Toolbar */}
            <div className="my-5 p-3.5 bg-amber-50/50 border border-amber-200/60 rounded-xl relative z-10 flex flex-wrap items-center justify-between gap-3">
              <div className="relative flex-1 min-w-[220px]">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tìm nhanh điều khoản (vốn, 50 tỷ, phong tỏa, OTP)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-amber-200 rounded-lg outline-none focus:border-[#C59B27] placeholder:text-slate-400"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={expandAllChapters}
                  className="text-[11px] font-semibold px-2.5 py-1.5 bg-white border border-amber-200 text-[#7A5B10] rounded-lg hover:bg-amber-100/60 transition"
                >
                  Mở tất cả ({docData.chapters.length} chương)
                </button>
                <button
                  type="button"
                  onClick={collapseAllChapters}
                  className="text-[11px] font-semibold px-2.5 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-100 transition"
                >
                  Thu gọn
                </button>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 italic mb-4 flex items-center gap-1.5 relative z-10">
              <HelpCircle className="w-3.5 h-3.5 text-[#8C6B18]" />
              Quy tắc hiển thị: Mặc định chỉ hiện tiêu đề Chương &amp; Mục quy định. Bấm vào từng
              quy định để mở khóa văn bản tuôn dần (AI streaming).
            </div>

            {/* CHAPTERS & PROVISIONS LIST */}
            <div className="space-y-4 relative z-10">
              {filteredChapters.map((chap) => {
                const isChapExpanded = !!expandedChapters[chap.id];
                const articles = getChapterArticles(chap);

                return (
                  <div
                    key={chap.id}
                    className={`tvpay-parchment-chapter-box ${
                      isChapExpanded ? 'is-expanded' : ''
                    }`}
                  >
                    {/* Chapter Header */}
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => toggleChapter(chap.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          toggleChapter(chap.id);
                        }
                      }}
                      className="tvpay-parchment-chapter-header"
                      aria-expanded={isChapExpanded}
                    >
                      <div className="flex items-center gap-2.5 flex-1 text-left min-w-0">
                        <span className="chapter-seal-pill">{chap.number}</span>
                        <div className="min-w-0">
                          <h4 className="font-serif font-bold text-sm sm:text-[15px] text-[#0A131E] truncate">
                            {chap.title}
                          </h4>
                          <p className="text-[11px] text-slate-500 truncate m-0">
                            {chap.summary}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 flex-shrink-0 ml-3">
                        <span className="text-[11px] font-semibold px-2 py-0.5 bg-amber-100/70 text-[#7A5B10] border border-amber-200 rounded">
                          {articles.length} Quy định
                        </span>
                        <span className="text-[#8C6B18]">
                          {isChapExpanded ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Chapter Content: List of Provisions / Articles */}
                    {isChapExpanded && (
                      <div className="tvpay-parchment-chapter-body p-3.5 sm:p-4 bg-white/70 border-t border-amber-200/60">
                        <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-amber-900/10 text-xs text-slate-500">
                          <span className="font-semibold text-[#7A5B10]">
                            Danh mục quy định trong {chap.number}:
                          </span>
                          <button
                            type="button"
                            onClick={() => openAllArticlesInChapter(chap)}
                            className="text-[11px] font-medium text-[#8C6B18] hover:underline"
                          >
                            Mở toàn bộ quy định chương này
                          </button>
                        </div>

                        {/* List of individual articles */}
                        <div className="space-y-2.5">
                          {articles.map((art) => {
                            const isArtOpened = !!openedArticles[art.id];
                            const isHighlighted = highlightedArticleId === art.id;

                            return (
                              <div
                                key={art.id}
                                id={art.id}
                                className={`tvpay-provision-item transition-all duration-300 ${
                                  isArtOpened ? 'is-active' : ''
                                } ${isHighlighted ? 'ring-2 ring-[#C59B27] bg-amber-50' : ''}`}
                              >
                                {/* Provision clickable row */}
                                <div
                                  role="button"
                                  tabIndex={0}
                                  onClick={() => toggleArticle(art.id)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                      toggleArticle(art.id);
                                    }
                                  }}
                                  className="tvpay-provision-trigger"
                                  aria-expanded={isArtOpened}
                                >
                                  <div className="flex items-center gap-2.5 flex-1 min-w-0">
                                    <span className="provision-badge">
                                      {art.articleNumber}
                                    </span>
                                    <span className="font-semibold text-xs sm:text-[13px] text-slate-900 truncate">
                                      {art.title}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                                    {isArtOpened ? (
                                      <span className="text-[11px] font-bold text-[#8C6B18] flex items-center gap-1">
                                        Đang mở <ChevronUp className="w-3.5 h-3.5" />
                                      </span>
                                    ) : (
                                      <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                                        Xem nội dung <ChevronDown className="w-3.5 h-3.5" />
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {/* Provision Details with AI Streaming Effect */}
                                {isArtOpened && (
                                  <div className="tvpay-provision-detail p-3.5 bg-[#FCFBF8] border-t border-amber-200/50 rounded-b-xl">
                                    <StreamingLegalText
                                      text={art.content}
                                      autoStart={true}
                                      speedMs={24}
                                      wordsPerStep={3}
                                    />
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Contract Signatures & Official Stamp Footer */}
            <div className="mt-8 pt-6 border-t-2 border-amber-900/15 relative z-10">
              <div className="grid grid-cols-2 gap-4 text-center font-serif text-xs">
                <div>
                  <p className="font-bold uppercase text-slate-800 m-0">
                    CÁC CỔ ĐÔNG SÁNG LẬP
                  </p>
                  <p className="text-[11px] text-slate-500 italic m-0">
                    (Đã ký tên và nộp đủ vốn góp)
                  </p>
                  <div className="my-6 text-slate-400 font-sans italic text-[11px]">
                    [Đã ký điện tử xác thực 5 cổ đông]
                  </div>
                  <p className="font-bold text-slate-900 m-0">Lê Quang Tùng</p>
                  <p className="text-[10px] text-slate-500 m-0">Đại diện nhóm sáng lập</p>
                </div>

                <div>
                  <p className="font-bold uppercase text-slate-800 m-0">
                    CÔNG TY CỔ PHẦN TVPAY
                  </p>
                  <p className="text-[11px] text-slate-500 italic m-0">
                    (Người đại diện theo pháp luật)
                  </p>
                  <div className="my-6">
                    <span className="inline-block px-3 py-1 border-2 border-dashed border-red-600/60 rounded text-red-600 font-bold text-[11px] uppercase tracking-wider -rotate-3">
                      ★ CHỨNG THỰC BẢN GỐC TVPAY ★
                    </span>
                  </div>
                  <p className="font-bold text-slate-900 m-0">Lê Quang Tùng</p>
                  <p className="text-[10px] text-slate-500 m-0">Tổng Giám đốc</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            RIGHT COLUMN (~42%): STICKY STRATEGIC ROLES & ENTERPRISE SHIELD DOCK
            ========================================================================= */}
        <div className="lg:col-span-5">
          <div className="tvpay-right-sticky-dock sticky top-24 space-y-4">
            {/* Dock Main Header */}
            <div className="tvpay-dock-header p-5 bg-gradient-to-br from-[#0A131E] to-[#162333] text-white rounded-2xl shadow-lg border border-slate-700/60">
              <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-700/80">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-[#C59B27]/20 text-[#E6C86E]">
                    <ShieldCheck className="w-4 h-4" />
                  </span>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#E6C86E] block">
                      Khoa Luật · HVNH
                    </span>
                    <h3 className="text-sm font-bold text-white m-0">
                      Tư Vấn Chiến Lược &amp; Phòng Vệ DN
                    </h3>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-800 text-amber-300 border border-slate-700 rounded">
                  TVPAY FINTECH
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mt-3 mb-0">
                Phân tích chuyên sâu 2 nội dung nhóm trưởng yêu cầu: Vai trò chiến lược đối với
                cấp phép NHNN và ma trận giải pháp bảo vệ quyền lợi hợp pháp của doanh nghiệp.
              </p>

              {/* Sub-tabs switcher */}
              <div className="grid grid-cols-3 gap-1.5 mt-4 p-1 bg-slate-900/80 rounded-xl">
                <button
                  type="button"
                  onClick={() => {
                    uiSound.playClick();
                    setRightDockTab('roles');
                  }}
                  className={`text-[11px] font-bold py-1.5 px-2 rounded-lg transition flex items-center justify-center gap-1 ${
                    rightDockTab === 'roles'
                      ? 'bg-[#C59B27] text-slate-950 shadow'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Landmark className="w-3 h-3" />
                  <span>1. Vai trò</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    uiSound.playClick();
                    setRightDockTab('protection');
                  }}
                  className={`text-[11px] font-bold py-1.5 px-2 rounded-lg transition flex items-center justify-center gap-1 ${
                    rightDockTab === 'protection'
                      ? 'bg-emerald-600 text-white shadow'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Shield className="w-3 h-3" />
                  <span>2. Lá chắn</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    uiSound.playClick();
                    setRightDockTab('brief');
                  }}
                  className={`text-[11px] font-bold py-1.5 px-2 rounded-lg transition flex items-center justify-center gap-1 ${
                    rightDockTab === 'brief'
                      ? 'bg-blue-600 text-white shadow'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <FileText className="w-3 h-3" />
                  <span>3. Slide tóm tắt</span>
                </button>
              </div>
            </div>

            {/* TAB 1: STRATEGIC ROLES */}
            {rightDockTab === 'roles' && (
              <div className="space-y-3.5">
                <div className="p-3 bg-amber-50/80 border border-amber-200/80 rounded-xl text-xs text-[#7A5B10]">
                  <strong>🏛️ Tầm quan trọng chiến lược:</strong> Hồ sơ pháp lý sống còn để TVPAY
                  đáp ứng đầy đủ các điều kiện khắt khe của NHNN theo Nghị định 52/2024/NĐ-CP và
                  Thông tư 40/2024/TT-NHNN.
                </div>

                {docData.strategicRoles.map((role, idx) => (
                  <div key={idx} className="tvpay-role-side-card">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-[#7A5B10] border border-amber-300">
                        {role.badge}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        Trụ cột 0{idx + 1}
                      </span>
                    </div>

                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-1.5 leading-snug">
                      {role.title}
                    </h4>

                    <div className="bg-amber-50/40 p-2.5 rounded-lg border border-amber-200/60 mb-2">
                      <span className="text-[10px] font-bold text-[#8C6B18] block uppercase">
                        Điểm cốt lõi:
                      </span>
                      <strong className="text-xs text-slate-800 font-semibold block">
                        {role.highlight}
                      </strong>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed mb-2.5">
                      {role.description}
                    </p>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <span className="text-[#8C6B18] font-medium">{role.citation}</span>
                      <button
                        type="button"
                        onClick={() => {
                          // Extract chapter/article number from citation
                          const match = role.citation.match(/Điều\s+(\d+|xx)/i);
                          const artNum = match ? match[0] : 'Điều 1';
                          jumpToArticle('Chương', artNum);
                        }}
                        className="text-[11px] font-bold text-[#8C6B18] hover:text-[#5F450B] flex items-center gap-1 hover:underline"
                      >
                        <span>Mở điều khoản</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 2: ENTERPRISE PROTECTION SHIELD MATRIX */}
            {rightDockTab === 'protection' && (
              <div className="space-y-3.5">
                <div className="p-3 bg-emerald-50/80 border border-emerald-200/80 rounded-xl text-xs text-emerald-900">
                  <strong className="flex items-center gap-1.5 mb-1 text-emerald-800">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Lá chắn bảo vệ quyền lợi hợp pháp TVPAY:
                  </strong>
                  Đối sách phòng thủ trước các vụ tranh chấp bồi thường của khách hàng, lỗi mạng ngân
                  hàng và gian lận công nghệ cao.
                </div>

                {/* Filter buttons */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {['all', 'Lá chắn cốt lõi', 'Miễn trừ trách nhiệm', 'Kiểm soát rủi ro'].map(
                    (tier) => (
                      <button
                        key={tier}
                        type="button"
                        onClick={() => {
                          uiSound.playClick();
                          setFilterTier(tier);
                        }}
                        className={`text-[10px] px-2.5 py-1 rounded-full border transition font-semibold ${
                          filterTier === tier
                            ? 'bg-[#0A131E] text-white border-[#0A131E]'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {tier === 'all' ? 'Tất cả lá chắn' : tier}
                      </button>
                    ),
                  )}
                </div>

                {filteredProtections.map((prot, idx) => (
                  <div key={idx} className="tvpay-protection-side-card">
                    <div className="flex items-start justify-between gap-2 pb-2 border-b border-slate-100">
                      <div className="flex items-center gap-1.5">
                        <ShieldAlert className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                        <h4 className="text-xs font-bold text-slate-900 m-0">
                          {prot.riskTitle}
                        </h4>
                      </div>
                      <span
                        className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full flex-shrink-0 ${
                          prot.protectionTier === 'Lá chắn cốt lõi'
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : prot.protectionTier === 'Miễn trừ trách nhiệm'
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                            : 'bg-blue-100 text-blue-900 border border-blue-300'
                        }`}
                      >
                        {prot.protectionTier}
                      </span>
                    </div>

                    <div className="mt-2.5 space-y-2">
                      <div className="bg-red-50/70 p-2.5 rounded-lg border border-red-100 text-xs">
                        <span className="text-[10px] font-bold text-red-700 block uppercase">
                          ⚠️ Rủi ro thực tế:
                        </span>
                        <p className="text-[11px] text-slate-700 m-0 leading-relaxed">
                          {prot.riskScenario}
                        </p>
                      </div>

                      <div className="bg-emerald-50/70 p-2.5 rounded-lg border border-emerald-100 text-xs">
                        <span className="text-[10px] font-bold text-emerald-800 block uppercase">
                          🛡️ Điều khoản bảo vệ TVPAY:
                        </span>
                        <p className="text-[11px] text-slate-800 m-0 leading-relaxed font-medium">
                          {prot.solution}
                        </p>
                      </div>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <span className="text-[#8C6B18] font-bold flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        {prot.articleRef}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const match = prot.articleRef.match(/Điều\s+(\d+|xx)/i);
                          const artNum = match ? match[0] : 'Điều 4';
                          jumpToArticle('Chương', artNum);
                        }}
                        className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 hover:underline"
                      >
                        <span>Mở lá chắn</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 3: SLIDE TÓM TẮT DÀNH CHO NHÓM TRƯỞNG & THUYẾT TRÌNH */}
            {rightDockTab === 'brief' && (
              <div className="space-y-3">
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl text-xs text-blue-900">
                  <h4 className="font-bold text-sm text-blue-950 mb-1.5">
                    🎯 Kịch bản trình bày Slide theo yêu cầu Nhóm trưởng
                  </h4>
                  <p className="text-xs text-blue-800/90 leading-relaxed m-0">
                    Nhóm trưởng yêu cầu tách bạch rõ: (1) Cấu trúc văn bản chỉ nêu tên chương/mục,
                    (2) Trọng tâm dồn vào Vai trò quan trọng và Giải pháp bảo vệ lợi ích DN TVPAY.
                  </p>
                </div>

                <div className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C6B18] block mb-1">
                    Slide Mục 1: Nội dung &amp; Vai trò quan trọng
                  </span>
                  <ul className="text-xs text-slate-700 space-y-1.5 pl-4 list-disc m-0">
                    <li>
                      <strong>Vốn điều lệ 50 tỷ:</strong> Đáp ứng điều kiện tiên quyết cấp phép
                      trung gian thanh toán theo NĐ 52/2024.
                    </li>
                    <li>
                      <strong>Cơ chế bảo toàn 1:1:</strong> Ký quỹ ngân hàng liên kết, đảm bảo an
                      toàn thanh khoản 24/7.
                    </li>
                    <li>
                      <strong>Chuẩn hóa eKYC:</strong> Xác thực sinh trắc học và CCCD gắn chip
                      chính chủ, ngăn chặn tài khoản ảo.
                    </li>
                    <li>
                      <strong>Phân định quyền lực:</strong> ĐHĐCĐ - HĐQT - TGĐ tránh xung đột lợi
                      ích cổ đông.
                    </li>
                  </ul>
                </div>

                <div className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block mb-1">
                    Slide Mục 2: Giải pháp bảo vệ quyền lợi hợp pháp TVPAY
                  </span>
                  <ul className="text-xs text-slate-700 space-y-1.5 pl-4 list-disc m-0">
                    <li>
                      <strong>Giao dịch không hủy ngang (Điều 5):</strong> Khách không thể đòi rút
                      lại tiền sau khi lệnh đã thực hiện thành công.
                    </li>
                    <li>
                      <strong>Miễn trừ sự cố bên thứ ba (Điều 16):</strong> Không bồi thường khi lỗi
                      do ngân hàng liên kết hoặc người dùng để lộ OTP.
                    </li>
                    <li>
                      <strong>Quyền phong tỏa khẩn cấp (Điều 10):</strong> Khóa ví ngay khi có dấu
                      hiệu rửa tiền hoặc yêu cầu bằng văn bản từ Công an.
                    </li>
                    <li>
                      <strong>Thời hiệu khiếu nại (Điều 13):</strong> Giới hạn thời gian tra soát,
                      tránh rủi ro kiện tụng kéo dài.
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
