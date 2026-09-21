import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Check, Copy, FastForward, Play, RefreshCw } from 'lucide-react';
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
  speedMs = 28,
  wordsPerStep = 4,
  onComplete,
  className = '',
}: StreamingLegalTextProps) {
  // Split text into word tokens while preserving whitespace & newlines
  const tokens = useMemo(() => {
    // Break into words and whitespace/newlines
    const regex = /(\s+)/;
    return text.split(regex).filter((t) => t.length > 0);
  }, [text]);

  const [revealedCount, setRevealedCount] = useState<number>(() =>
    autoStart ? 0 : tokens.length,
  );
  const [isStreaming, setIsStreaming] = useState<boolean>(autoStart);
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!autoStart) {
      setRevealedCount(tokens.length);
      setIsStreaming(false);
      return;
    }

    setRevealedCount(0);
    setIsStreaming(true);

    let current = 0;
    const total = tokens.length;

    const tick = () => {
      current = Math.min(total, current + wordsPerStep * 2); // 2 tokens per word (word + space)
      setRevealedCount(current);

      // Play ultra subtle streaming tick occasionally
      if (current % 12 === 0) {
        uiSound.playStreamingTick();
      }

      if (current < total) {
        timerRef.current = window.setTimeout(tick, speedMs);
      } else {
        setIsStreaming(false);
        onComplete?.();
      }
    };

    timerRef.current = window.setTimeout(tick, 40);

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
      if (current % 12 === 0) {
        uiSound.playStreamingTick();
      }
      if (current < total) {
        timerRef.current = window.setTimeout(tick, speedMs);
      } else {
        setIsStreaming(false);
        onComplete?.();
      }
    };
    timerRef.current = window.setTimeout(tick, 40);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
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
            <span className="flex items-center gap-1.5 text-[#8C6B18] font-semibold">
              <span className="inline-block w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              Đang hiển thị điều khoản...
            </span>
          ) : (
            <span className="text-emerald-700 font-medium flex items-center gap-1">
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
              className="px-2.5 py-1 text-[11px] font-semibold text-[#8C6B18] bg-amber-50 hover:bg-amber-100 border border-[rgba(197,155,39,0.35)] rounded transition flex items-center gap-1"
              title="Xem nhanh toàn văn không cần chờ"
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
              title="Phát lại hiệu ứng gõ chữ"
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

      {/* Rendered content */}
      <div className="tvpay-streaming-text-content leading-relaxed text-slate-800 text-[13.5px] font-normal font-sans">
        {paragraphs.map((p, idx) => {
          const isHeading =
            p.startsWith('Điều ') ||
            p.startsWith('ĐIỀU ') ||
            p.startsWith('PHẦN ') ||
            p.startsWith('CHƯƠNG ') ||
            p.startsWith('MỤC ');

          if (isHeading) {
            return (
              <h5
                key={idx}
                className="font-serif font-bold text-slate-900 text-sm mt-3 mb-1.5"
              >
                {p}
              </h5>
            );
          }

          return (
            <p key={idx} className="my-2 whitespace-pre-wrap">
              {p}
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
