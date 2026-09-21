import React, { useState, useEffect, useMemo } from 'react';
import {
  BookOpen,
  Check,
  Copy,
  ExternalLink,
  FileText,
  Printer,
  Scale,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  X,
  Zap,
} from 'lucide-react';
import {
  type OfficialDocumentData,
  type DocumentAppendix,
} from '@/lib/tvpay-official-docs';
import { uiSound } from '@/lib/ui-sound';

interface TvpayAppendixReaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentData: OfficialDocumentData;
  initialAppendixId?: string | null;
}

export function TvpayAppendixReaderModal({
  isOpen,
  onClose,
  documentData,
  initialAppendixId,
}: TvpayAppendixReaderModalProps) {
  const appendices = documentData.appendices || [];

  const [activeId, setActiveId] = useState<string>(() => {
    return initialAppendixId || (appendices.length > 0 ? appendices[0].id : '');
  });
  const [searchKeyword, setSearchKeyword] = useState('');
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg'>('base');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (initialAppendixId) {
      setActiveId(initialAppendixId);
    } else if (appendices.length > 0 && !appendices.some((a) => a.id === activeId)) {
      setActiveId(appendices[0].id);
    }
  }, [initialAppendixId, appendices, activeId]);

  // Lock body scroll when modal open
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, onClose]);

  const activeAppendix = useMemo(() => {
    return appendices.find((a) => a.id === activeId) || appendices[0];
  }, [appendices, activeId]);

  const handleCopyContent = () => {
    if (!activeAppendix) return;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(activeAppendix.content).then(() => {
          setCopied(true);
          uiSound.playClick();
          setTimeout(() => setCopied(false), 2000);
        });
      }
    } catch {}
  };

  const handleAskAI = () => {
    if (!activeAppendix) return;
    try {
      uiSound.playClick();
      const quote = `[${activeAppendix.number}: ${activeAppendix.title}]\n\nTóm tắt: ${activeAppendix.summary}\n\nTrích dẫn nội dung:\n${activeAppendix.content.slice(0, 800)}...`;
      window.dispatchEvent(
        new CustomEvent('tv:ask-selection', { detail: quote }),
      );
    } catch {}
  };

  if (!isOpen || !activeAppendix) return null;

  const paragraphs = activeAppendix.content.split('\n\n');
  const wordCount = activeAppendix.content.split(/\s+/).filter(Boolean).length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="appendix-modal-title"
    >
      <div className="relative w-full max-w-5xl h-[92vh] max-h-[900px] flex flex-col bg-[#FAF9F5] text-slate-900 rounded-2xl shadow-2xl border-2 border-amber-300/80 overflow-hidden">
        {/* =========================================================================
            HEADER BAR
            ========================================================================= */}
        <div className="p-4 sm:px-6 bg-gradient-to-r from-[#FFFDF8] via-[#FAF5E8] to-[#FFFDF8] text-slate-900 flex items-center justify-between gap-3 border-b border-amber-300/80 shadow-xs">
          <div className="flex items-center gap-3 min-w-0">
            <span className="p-2 rounded-xl bg-amber-100/90 border border-amber-300/80 text-[#8C6B18] shrink-0 shadow-xs">
              <BookOpen className="w-5 h-5" />
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#7A5B10] font-mono bg-amber-100/90 border border-amber-300/80 px-2 py-0.5 rounded">
                  HỒ SƠ PHÁP LÝ NHÓM 13 · KHOA LUẬT HVNH
                </span>
                <span className="text-[11px] text-slate-500 hidden sm:inline-block">
                  · {documentData.officialTitle}
                </span>
              </div>
              <h2
                id="appendix-modal-title"
                className="font-serif text-sm sm:text-base font-bold text-slate-900 truncate m-0 mt-0.5"
              >
                Toàn Văn Nội Dung, Vai Trò &amp; Giải Pháp Bảo Vệ Quyền Lợi Hợp Pháp DN
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Ask AI CTA */}
            <button
              type="button"
              onClick={handleAskAI}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-[#0c665f] hover:bg-[#0e7c74] text-white rounded-lg border border-emerald-400/40 transition cursor-pointer shadow-sm"
              title="Đưa nội dung phụ lục này vào AI Copilot"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              <span>Hỏi AI Copilot</span>
            </button>

            {/* Copy CTA */}
            <button
              type="button"
              onClick={handleCopyContent}
              className="px-2.5 py-1.5 text-xs font-semibold bg-white hover:bg-amber-50 text-slate-700 rounded-lg border border-amber-200 transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="Sao chép toàn văn phụ lục"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="hidden sm:inline">Đã sao chép</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-600" />
                  <span className="hidden sm:inline">Sao chép</span>
                </>
              )}
            </button>

            {/* Print CTA */}
            <button
              type="button"
              onClick={() => window.print()}
              className="p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-amber-100/60 border border-amber-200 bg-white transition cursor-pointer shadow-xs"
              title="In văn bản"
            >
              <Printer className="w-4 h-4" />
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={() => {
                uiSound.playClick();
                onClose();
              }}
              className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-red-50 hover:text-red-600 transition cursor-pointer ml-1"
              aria-label="Đóng cửa sổ"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* =========================================================================
            APPENDIX TABS NAVIGATION
            ========================================================================= */}
        <div className="bg-[#F8F4EA] px-4 py-2 flex items-center gap-2 overflow-x-auto border-b border-amber-200/80 text-xs shrink-0 scrollbar-none">
          <span className="text-[11px] font-bold text-[#8C6B18] uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
            <Scale className="w-3.5 h-3.5" />
            Phụ Lục:
          </span>
          {appendices.map((app) => {
            const isSelected = app.id === activeAppendix.id;
            return (
              <button
                key={app.id}
                type="button"
                onClick={() => {
                  uiSound.playClick();
                  setActiveId(app.id);
                }}
                className={`px-3 py-1.5 rounded-lg font-bold text-xs whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  isSelected
                    ? 'bg-[#C59B27] text-white shadow-md font-extrabold border border-amber-500'
                    : 'bg-white/80 text-slate-700 hover:text-slate-950 hover:bg-white border border-amber-200/60'
                }`}
              >
                <span
                  className={`text-[10px] font-mono px-1 py-0.2 rounded ${
                    isSelected ? 'bg-amber-900/25 text-white' : 'bg-amber-100/80 text-[#7A5B10]'
                  }`}
                >
                  {app.number}
                </span>
                <span className="truncate max-w-[200px] sm:max-w-[260px]">{app.title}</span>
              </button>
            );
          })}
        </div>

        {/* =========================================================================
            MICRO ACTION & METADATA BAR
            ========================================================================= */}
        <div className="px-5 py-2.5 bg-amber-50/70 border-b border-amber-200/80 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center gap-3 text-slate-600">
            <span className="font-serif font-bold text-slate-900 text-sm">
              {activeAppendix.number}: {activeAppendix.title}
            </span>
            <span className="hidden sm:inline text-slate-300">|</span>
            <span className="text-[11px] text-amber-900/80 font-mono hidden sm:inline">
              Độ dài: ~{wordCount.toLocaleString()} từ
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Font size switcher */}
            <div className="flex items-center gap-1 bg-white border border-amber-200 rounded-lg p-0.5 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-400 px-1.5">Cỡ chữ:</span>
              <button
                type="button"
                onClick={() => setFontSize('sm')}
                className={`px-2 py-0.5 text-xs rounded transition ${
                  fontSize === 'sm'
                    ? 'bg-amber-100 text-slate-900 font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Nhỏ
              </button>
              <button
                type="button"
                onClick={() => setFontSize('base')}
                className={`px-2 py-0.5 text-xs rounded transition ${
                  fontSize === 'base'
                    ? 'bg-amber-100 text-slate-900 font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Vừa
              </button>
              <button
                type="button"
                onClick={() => setFontSize('lg')}
                className={`px-2 py-0.5 text-xs rounded transition ${
                  fontSize === 'lg'
                    ? 'bg-amber-100 text-slate-900 font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Lớn
              </button>
            </div>
          </div>
        </div>

        {/* =========================================================================
            READING CONTENT BODY
            ========================================================================= */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-4">
          {/* Executive Summary Card */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100/40 border border-amber-300/80 shadow-xs">
            <div className="flex items-center gap-2 mb-1.5 text-xs font-bold text-[#8C6B18] uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-[#8C6B18]" />
              <span>Tóm tắt chiến lược &amp; Căn cứ cốt lõi</span>
            </div>
            <p className="text-xs sm:text-[13px] text-slate-800 leading-relaxed m-0 font-medium">
              {activeAppendix.summary}
            </p>
          </div>

          {/* Formatted Full Appendix Content */}
          <div
            className={`tvpay-appendix-body font-sans leading-relaxed text-slate-800 space-y-3.5 ${
              fontSize === 'sm'
                ? 'text-[13px]'
                : fontSize === 'lg'
                  ? 'text-[16px] leading-loose'
                  : 'text-[14.5px]'
            }`}
          >
            {paragraphs.map((p, idx) => {
              const trimmed = p.trim();
              if (!trimmed) return null;

              // Check if markdown table
              if (trimmed.startsWith('|') && trimmed.includes('\n|')) {
                const tableLines = trimmed.split('\n').filter((l) => l.trim().startsWith('|'));
                if (tableLines.length >= 2) {
                  const headers = tableLines[0].split('|').map((s) => s.trim()).filter(Boolean);
                  const rows = tableLines.slice(2).map((rowLine) =>
                    rowLine.split('|').map((s) => s.trim()).filter(Boolean),
                  );
                  return (
                    <div
                      key={idx}
                      className="my-4 overflow-x-auto rounded-xl border border-amber-300/80 shadow-xs bg-white"
                    >
                      <table className="min-w-full text-xs text-left text-slate-800 divide-y divide-amber-200">
                        <thead className="bg-gradient-to-r from-amber-100/80 to-amber-200/60 font-serif font-bold text-slate-900">
                          <tr>
                            {headers.map((h, hIdx) => (
                              <th
                                key={hIdx}
                                className="px-3.5 py-2.5 border-r border-amber-200 last:border-r-0 whitespace-nowrap"
                              >
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-amber-100 bg-white">
                          {rows.map((r, rIdx) => (
                            <tr
                              key={rIdx}
                              className={
                                rIdx % 2 === 0
                                  ? 'bg-white'
                                  : 'bg-amber-50/30 hover:bg-amber-50/60'
                              }
                            >
                              {r.map((c, cIdx) => {
                                const isRed = c.toLowerCase() === 'đỏ' || c.toLowerCase() === 'cao';
                                const isYellow = c.toLowerCase() === 'vàng' || c.toLowerCase() === 'trung bình';
                                const isGreen = c.toLowerCase() === 'xanh' || c.toLowerCase() === 'thấp';
                                return (
                                  <td
                                    key={cIdx}
                                    className="px-3.5 py-2.5 border-r border-amber-100/80 last:border-r-0 align-top"
                                  >
                                    {isRed ? (
                                      <span className="px-2 py-0.5 font-bold rounded bg-red-100 text-red-700 border border-red-300 inline-block text-[11px]">
                                        {c}
                                      </span>
                                    ) : isYellow ? (
                                      <span className="px-2 py-0.5 font-bold rounded bg-amber-100 text-amber-800 border border-amber-300 inline-block text-[11px]">
                                        {c}
                                      </span>
                                    ) : isGreen ? (
                                      <span className="px-2 py-0.5 font-bold rounded bg-emerald-100 text-emerald-800 border border-emerald-300 inline-block text-[11px]">
                                        {c}
                                      </span>
                                    ) : (
                                      c
                                    )}
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
                }
              }

              // Heading levels
              const isMainTitle = trimmed.startsWith('PHỤ LỤC ') || trimmed.startsWith('NỘI DUNG VÀ VAI TRÒ');
              const isH3 = trimmed.startsWith('### ') || trimmed.startsWith('Thứ nhất,') || trimmed.startsWith('Thứ hai,') || trimmed.startsWith('Thứ ba,') || trimmed.startsWith('Thứ tư,') || trimmed.startsWith('Thứ năm,');
              const isSectionHeader =
                trimmed.startsWith('Giải pháp ') ||
                trimmed.startsWith('CẢNH BÁO ') ||
                trimmed.startsWith('HƯỚNG DẪN ') ||
                trimmed.startsWith('TUYỆT ĐỐI KHÔNG') ||
                trimmed.startsWith('QUÝ KHÁCH NÊN');

              if (isMainTitle) {
                return (
                  <h3
                    key={idx}
                    className="font-serif text-base sm:text-lg font-bold text-slate-900 mt-5 pb-2 border-b-2 border-amber-500/50 text-[#8C6B18]"
                  >
                    {trimmed}
                  </h3>
                );
              }

              if (isSectionHeader) {
                return (
                  <div
                    key={idx}
                    className="my-3 p-3 rounded-lg bg-amber-100/40 border-l-4 border-[#C59B27] text-slate-900 font-serif font-bold text-sm sm:text-[15px]"
                  >
                    {trimmed}
                  </div>
                );
              }

              // Sub-clause lettered / numbered: "1. ", "a) ", "- "
              const numMatch = trimmed.match(/^(\d+[\.\)])\s*(.*)/s);
              if (numMatch) {
                return (
                  <div
                    key={idx}
                    className="my-2 pl-3 border-l-2 border-amber-400 bg-amber-50/25 py-1 rounded-r"
                  >
                    <span className="font-bold text-slate-900 text-xs bg-amber-200/80 px-1.5 py-0.5 rounded mr-2 inline-block text-[11px]">
                      {numMatch[1]}
                    </span>
                    <span className="font-medium text-slate-800">{numMatch[2]}</span>
                  </div>
                );
              }

              const subMatch = trimmed.match(/^([a-zđ]\)|[\-\+•])\s*(.*)/is);
              if (subMatch) {
                return (
                  <div key={idx} className="my-1.5 pl-4 text-slate-700 flex items-start gap-2">
                    <span className="font-bold text-[#8C6B18] text-xs shrink-0 bg-amber-100/60 px-1 py-0.5 rounded border border-amber-200 text-[11px]">
                      {subMatch[1]}
                    </span>
                    <span>{subMatch[2]}</span>
                  </div>
                );
              }

              return (
                <p key={idx} className="my-2 text-justify">
                  {trimmed}
                </p>
              );
            })}
          </div>
        </div>

        {/* =========================================================================
            MODAL FOOTER
            ========================================================================= */}
        <div className="p-3.5 sm:px-6 bg-[#FAF6ED] border-t border-amber-200/80 flex items-center justify-between gap-3 text-xs shrink-0">
          <div className="text-slate-500 italic hidden sm:block">
            Nhấn <kbd className="px-1.5 py-0.5 bg-white border border-amber-200 rounded font-mono text-[10px] text-slate-700">Esc</kbd> để đóng cửa sổ
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={handleAskAI}
              className="px-3.5 py-2 text-xs font-bold bg-[#0c665f] hover:bg-[#0e7c74] text-white rounded-lg border border-emerald-400/40 transition flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              <span>Hỏi AI về phụ lục này</span>
            </button>

            <button
              type="button"
              onClick={() => {
                uiSound.playClick();
                onClose();
              }}
              className="px-4 py-2 text-xs font-bold bg-white hover:bg-amber-50 text-slate-800 border border-amber-300 rounded-lg transition cursor-pointer shadow-xs"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
