import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Search,
  Sparkles,
  Volume2,
  VolumeX,
  Award,
  ArrowRight,
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
import { TvpayAppendixReaderModal } from '@/components/tvpay-appendix-reader-modal';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [soundActive, setSoundActive] = useState(() => uiSound.isEnabled());
  const [streamEnabled, setStreamEnabled] = useState<boolean>(true);
  const [highlightedArticleId, setHighlightedArticleId] = useState<string | null>(null);
  const [appendixModalOpen, setAppendixModalOpen] = useState(false);
  const [activeAppendixId, setActiveAppendixId] = useState<string | null>(null);

  const openAppendixReader = (appendixId?: string) => {
    try {
      uiSound.playOpenProvision();
    } catch {}
    if (appendixId) {
      setActiveAppendixId(appendixId);
    } else {
      const defaultId =
        docData && docData.appendices && docData.appendices.length > 0
          ? docData.appendices[0].id
          : null;
      setActiveAppendixId(defaultId);
    }
    setAppendixModalOpen(true);
  };

  // Subscribe to sound state with void cleanup destructor
  useEffect(() => {
    const unsub = uiSound.subscribe((enabled) => setSoundActive(enabled));
    return () => {
      unsub();
    };
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
    try {
      uiSound.playClick();
    } catch {}
    setExpandedChapters((prev) => ({
      ...prev,
      [chapterId]: !prev[chapterId],
    }));
  };

  // Toggle single provision directly underneath in-place
  const toggleArticle = (articleId: string) => {
    try {
      setOpenedArticles((prev) => {
        const willOpen = !prev[articleId];
        try {
          if (willOpen) {
            uiSound.playOpenProvision();
          } else {
            uiSound.playClick();
          }
        } catch {}
        return {
          ...prev,
          [articleId]: willOpen,
        };
      });
    } catch (err) {
      console.error('Error toggling provision:', err);
    }
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

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Full Appendix Reader Button */}
            <button
              type="button"
              onClick={() => openAppendixReader()}
              className="text-xs font-semibold px-3 py-1.5 bg-gradient-to-r from-[#D4AF37] to-[#C59B27] hover:brightness-105 text-white border border-amber-300/80 rounded-lg shadow-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Đọc Toàn Văn Phụ Lục (1-7)</span>
            </button>

            {/* Jump to Presentation Slides below */}
            <a
              href="#slides-section"
              className="text-xs font-semibold px-3 py-1.5 bg-amber-50 hover:bg-amber-100/80 text-[#7A5B10] border border-amber-300/80 rounded-lg shadow-xs flex items-center gap-1.5 transition"
            >
              <span>🖥️ Xem Slide Ở Dưới ↓</span>
            </a>

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

            {/* AI Streaming Toggle Button */}
            <button
              type="button"
              onClick={() => {
                try {
                  uiSound.playClick();
                } catch {}
                setStreamEnabled(!streamEnabled);
              }}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition flex items-center gap-1.5 ${
                streamEnabled
                  ? 'bg-amber-50 text-[#8C6B18] border-[rgba(197,155,39,0.4)] shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200'
              }`}
              title="Bật/Tắt hiệu ứng chữ tuôn dần AI khi mở điều khoản"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Gõ chữ AI: {streamEnabled ? 'Bật' : 'Tắt (Hiện ngay)'}</span>
            </button>

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

      {/* 2. MAIN CENTERED FULL-WIDTH PARCHMENT CONTRACT */}
      <div className="tvpay-workbench-content mt-6 flex justify-center">
        <div className="tvpay-parchment-contract relative p-6 sm:p-10 rounded-2xl shadow-xl w-full max-w-5xl mx-auto">
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
                                      autoStart={streamEnabled}
                                      speedMs={18}
                                      wordsPerStep={6}
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

      {/* Full Appendix Reader Modal */}
      <TvpayAppendixReaderModal
        isOpen={appendixModalOpen}
        onClose={() => setAppendixModalOpen(false)}
        documentData={docData}
        initialAppendixId={activeAppendixId}
      />
    </div>
  );
}
