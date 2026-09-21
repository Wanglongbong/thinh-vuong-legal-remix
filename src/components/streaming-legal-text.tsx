import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Check, Copy, FastForward, RefreshCw, Zap } from 'lucide-react';
import { uiSound } from '@/lib/ui-sound';

interface StreamingLegalTextProps {
  text: string;
  autoStart?: boolean;
  speedMs?: number; // interval between chunk steps (ms)
  wordsPerStep?: number; // how many words reveal per step
  onComplete?: () => void;
  className?: string;
}

export function StreamingLegalText({
  text,
  autoStart = true,
  speedMs = 18,
  wordsPerStep = 6,
  onComplete,
  className = '',
}: StreamingLegalTextProps) {
  // Split text into word tokens while preserving whitespace & newlines
  const tokens = useMemo(() => {
    if (!text || typeof text !== 'string') return [];
    try {
      const regex = /(\s+)/;
      return text.split(regex).filter((t) => t.length > 0);
    } catch {
      return [text || ''];
    }
  }, [text]);

  const [revealedCount, setRevealedCount] = useState<number>(() =>
    autoStart ? 0 : tokens.length,
  );
  const [isStreaming, setIsStreaming] = useState<boolean>(() => autoStart && tokens.length > 0);
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!autoStart || tokens.length === 0) {
      setRevealedCount(tokens.length);
      setIsStreaming(false);
      return;
    }

    setRevealedCount(0);
    setIsStreaming(true);

    let current = 0;
    const total = tokens.length;

    const tick = () => {
      current = Math.min(total, current + wordsPerStep * 2);
      setRevealedCount(current);

      if (current % 14 === 0) {
        uiSound.playStreamingTick();
      }

      if (current < total) {
        timerRef.current = window.setTimeout(tick, speedMs);
      } else {
        setIsStreaming(false);
        onComplete?.();
      }
    };

    timerRef.current = window.setTimeout(tick, 30);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [tokens, autoStart, speedMs, wordsPerStep, onComplete]);

  const showAll = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setRevealedCount(tokens.length);
    setIsStreaming(false);
    onComplete?.();
  };

  const restartStream = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setRevealedCount(0);
    setIsStreaming(true);

    let current = 0;
    const total = tokens.length;
    const tick = () => {
      current = Math.min(total, current + wordsPerStep * 2);
      setRevealedCount(current);
      if (current % 14 === 0) {
        uiSound.playStreamingTick();
      }
      if (current < total) {
        timerRef.current = window.setTimeout(tick, speedMs);
      } else {
        setIsStreaming(false);
        onComplete?.();
      }
    };
    timerRef.current = window.setTimeout(tick, 30);
  };

  const copyToClipboard = () => {
    try {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        });
      }
    } catch {
      // safe fallback
    }
  };

  const visibleText = useMemo(() => {
    return tokens.slice(0, revealedCount).join('');
  }, [tokens, revealedCount]);

  // Split visible text by newlines for clean legal paragraph formatting
  const paragraphs = useMemo(() => {
    return visibleText.split('\n\n');
  }, [visibleText]);

  return (
    <div className={`tvpay-streaming-box ${className}`}>
      {/* Top action micro-bar */}
      <div className="flex items-center justify-between pb-2 mb-3 border-b border-amber-900/10 text-xs">
        <div className="flex items-center gap-2">
          {isStreaming ? (
            <span className="flex items-center gap-1.5 text-[#8C6B18] font-semibold text-[11px] sm:text-xs">
              <span className="inline-block w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              Đang hiển thị điều khoản...
            </span>
          ) : (
            <span className="text-emerald-700 font-semibold text-[11px] sm:text-xs flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              Toàn văn điều khoản
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isStreaming && (
            <button
              type="button"
              onClick={showAll}
              className="px-2.5 py-1 text-[11px] font-bold text-[#8C6B18] bg-amber-100/70 hover:bg-amber-200/80 border border-amber-300 rounded transition flex items-center gap-1 shadow-xs"
              title="Hiện toàn bộ nội dung ngay không cần đợi"
            >
              <FastForward className="w-3 h-3" />
              Hiện toàn bộ
            </button>
          )}

          {!isStreaming && (
            <button
              type="button"
              onClick={restartStream}
              className="p-1 text-slate-500 hover:text-slate-800 transition"
              title="Phát lại hiệu ứng gõ chữ AI"
            >
              <RefreshCw className="w-3 h-3" />
            </button>
          )}

          <button
            type="button"
            onClick={copyToClipboard}
            className="px-2 py-1 text-[11px] font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded transition flex items-center gap-1"
            title="Sao chép điều khoản"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-600" />
                Đã sao chép
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                Sao chép
              </>
            )}
          </button>
        </div>
      </div>

      {/* Formatted Legal Content */}
      <div className="tvpay-streaming-text-content leading-relaxed text-slate-800 text-[13.5px] font-normal font-sans space-y-2">
        {paragraphs.map((p, idx) => {
          const trimmed = p.trim();
          if (!trimmed) return null;

          const isHeading =
            trimmed.startsWith('Điều ') ||
            trimmed.startsWith('ĐIỀU ') ||
            trimmed.startsWith('PHẦN ') ||
            trimmed.startsWith('CHƯƠNG ') ||
            trimmed.startsWith('MỤC ');

          if (isHeading) {
            return (
              <h5
                key={idx}
                className="font-serif font-bold text-slate-900 text-sm mt-3 mb-1.5 pb-1 border-b border-amber-900/10"
              >
                {trimmed}
              </h5>
            );
          }

          // Numbered clause: "1. ", "2. ", "10. "
          const numMatch = trimmed.match(/^(\d+[\.\)])\s*(.*)/s);
          if (numMatch) {
            return (
              <div
                key={idx}
                className="tvpay-clause-row my-1.5 pl-3 border-l-2 border-amber-300/80 bg-amber-50/20 py-0.5 rounded-r"
              >
                <span className="font-bold text-slate-900 text-xs bg-amber-100/80 px-1.5 py-0.5 rounded mr-1.5 inline-block text-[11px]">
                  {numMatch[1]}
                </span>
                <span className="whitespace-pre-wrap">{numMatch[2]}</span>
              </div>
            );
          }

          // Sub-clause lettered item: "a) ", "b) ", "c) ", "- ", "+ "
          const subMatch = trimmed.match(/^([a-zđ]\)|[\-\+•])\s*(.*)/is);
          if (subMatch) {
            return (
              <div
                key={idx}
                className="tvpay-subclause-row my-1 pl-5 text-slate-700 flex items-start gap-1.5"
              >
                <span className="font-bold text-[#8C6B18] text-xs flex-shrink-0">
                  {subMatch[1]}
                </span>
                <span className="whitespace-pre-wrap">{subMatch[2]}</span>
              </div>
            );
          }

          return (
            <p key={idx} className="my-1.5 whitespace-pre-wrap">
              {trimmed}
            </p>
          );
        })}
        {isStreaming && (
          <span className="inline-block text-[#C59B27] font-black animate-pulse ml-0.5 select-none">
            ▍
          </span>
        )}
      </div>
    </div>
  );
}
