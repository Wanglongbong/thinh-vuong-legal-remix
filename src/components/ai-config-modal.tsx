"use client";

import { useEffect, useState } from "react";
import {
  Check,
  CheckCircle2,
  Copy,
  ExternalLink,
  Eye,
  EyeOff,
  Key,
  LoaderCircle,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  X,
  Zap,
} from "lucide-react";
import { safeStorage } from "@/lib/storage";

interface AiStatusData {
  connected: boolean;
  provider: string;
  model: string;
  isCustomKey: boolean;
  status: string;
  message: string;
}

interface PingResult {
  ok: boolean;
  latencyMs?: number;
  reply?: string;
  model?: string;
  error?: string;
}

export function AiConfigModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [customKey, setCustomKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [status, setStatus] = useState<AiStatusData | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [pingState, setPingState] = useState<"idle" | "testing" | "success" | "error">("idle");
  const [pingResult, setPingResult] = useState<PingResult | null>(null);
  const [saveToast, setSaveToast] = useState(false);

  useEffect(() => {
    const saved = safeStorage.getItem("tvl_custom_gemini_key") || "";
    setCustomKey(saved);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      loadStatus();
    }
  }, [isOpen]);

  async function loadStatus() {
    setLoadingStatus(true);
    try {
      const savedKey = safeStorage.getItem("tvl_custom_gemini_key");
      const headers: Record<string, string> = {};
      if (savedKey && savedKey.trim().length > 8) {
        headers["x-gemini-key"] = savedKey.trim();
      }
      const res = await fetch("/api/ai-status", { headers });
      if (res.ok) {
        const data = await res.json();
        setStatus(data);
      }
    } catch {
      // ignore
    } finally {
      setLoadingStatus(false);
    }
  }

  async function handlePing() {
    setPingState("testing");
    setPingResult(null);
    try {
      const activeKey = customKey.trim() || undefined;
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (activeKey) {
        headers["x-gemini-key"] = activeKey;
      }
      const res = await fetch("/api/ai-ping", {
        method: "POST",
        headers,
        body: JSON.stringify({ apiKey: activeKey }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setPingState("success");
        setPingResult(data);
      } else {
        setPingState("error");
        setPingResult({ ok: false, error: data.error || "Không thể kết nối tới Google Gemini API." });
      }
    } catch (err: any) {
      setPingState("error");
      setPingResult({ ok: false, error: err?.message || "Lỗi mạng hoặc không phản hồi." });
    }
  }

  function handleSaveKey() {
    const cleanKey = customKey.trim();
    if (cleanKey) {
      safeStorage.setItem("tvl_custom_gemini_key", cleanKey);
    } else {
      safeStorage.removeItem("tvl_custom_gemini_key");
    }
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
    loadStatus();
  }

  function handleResetDefault() {
    safeStorage.removeItem("tvl_custom_gemini_key");
    setCustomKey("");
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
    loadStatus();
  }

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl bg-white border border-[#c89b51]/40 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ai-config-title"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#FFFDF8] via-[#FAF3DE] to-[#F5E5BA] p-5 border-b border-[rgba(197,155,39,0.35)] flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-sm bg-gradient-to-br from-[#FFFDF7] to-[#FAF1D7] text-[#8C6B18] flex items-center justify-center border border-[rgba(197,155,39,0.4)] shadow-xs shrink-0">
              <Key className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="ai-config-title" className="font-serif text-lg font-bold text-[#0A131E]">
                  Cấu hình &amp; Kết nối Khóa AI
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-xs bg-[#EBF7EE] text-[#1E7E34] border border-[#A3D9A5]">
                  Google Gemini 3.6
                </span>
              </div>
              <p className="text-xs text-[#556070] mt-0.5">
                Quản lý trạng thái kết nối Google Gemini API và cấu hình khóa cá nhân.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#8C6B18] hover:text-[#2A1F04] p-1 transition cursor-pointer"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto bg-[#faf9f6]">
          {/* Card 1: Live Status */}
          <div className="p-4 bg-white border border-[#d8ddd9] shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#edf0ee]">
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                <span className="font-bold text-xs text-[#0A131E] uppercase tracking-wider">
                  Trạng thái kết nối:
                </span>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                  {status?.status === "online" || !status ? "Đang trực tuyến (Online)" : status.status}
                </span>
              </div>
              <button
                type="button"
                onClick={loadStatus}
                disabled={loadingStatus}
                className="text-xs text-[#7D5D0D] hover:text-[#2A1F04] flex items-center gap-1 cursor-pointer transition"
                title="Tải lại trạng thái"
              >
                <RefreshCw className={`w-3 h-3 ${loadingStatus ? "animate-spin" : ""}`} />
                <span>Làm mới</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 text-xs">
              <div>
                <span className="text-slate-500 block text-[11px]">Nhà cung cấp:</span>
                <strong className="text-[#0A131E]">{status?.provider || "Google DeepMind (Gemini)"}</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Mô hình AI:</span>
                <strong className="text-[#8C6B18] font-mono">{status?.model || "gemini-3.6-flash"}</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Nguồn khóa API:</span>
                <span className="font-medium text-slate-700">
                  {customKey.trim() ? "Khóa tùy chỉnh người dùng" : "Khóa hệ thống máy chủ"}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Chế độ bảo mật:</span>
                <span className="text-emerald-700 font-medium flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Full-Stack Proxy
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Ping Test */}
          <div className="p-4 bg-white border border-[#d8ddd9] shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-[#0A131E] flex items-center gap-1.5 uppercase tracking-wider">
                  <Zap className="w-4 h-4 text-[#8C6B18]" />
                  Kiểm tra phản hồi trực tiếp (Ping API)
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Gửi một yêu cầu thử nghiệm siêu ngắn để đo độ trễ và khả năng sinh văn bản của Gemini.
                </p>
              </div>
              <button
                type="button"
                onClick={handlePing}
                disabled={pingState === "testing"}
                className="px-3 py-1.5 bg-gradient-to-r from-[#D4AF37] via-[#F7EBB8] to-[#C59B27] hover:brightness-105 text-[#2A1F04] text-xs font-bold flex items-center gap-1.5 transition disabled:opacity-50 cursor-pointer shrink-0 border border-[rgba(197,155,39,0.5)] shadow-xs"
              >
                {pingState === "testing" ? (
                  <>
                    <LoaderCircle className="w-3.5 h-3.5 animate-spin text-[#2A1F04]" />
                    <span>Đang kiểm tra...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5 text-[#2A1F04]" />
                    <span>Kiểm tra kết nối</span>
                  </>
                )}
              </button>
            </div>

            {pingResult && (
              <div
                className={`p-3 text-xs border ${
                  pingResult.ok
                    ? "bg-emerald-50/70 border-emerald-200 text-emerald-900"
                    : "bg-red-50 border-red-200 text-red-900"
                }`}
              >
                {pingResult.ok ? (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 font-bold text-emerald-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>
                        Kết nối thành công! (Độ trễ: {pingResult.latencyMs}ms · Mô hình: {pingResult.model})
                      </span>
                    </div>
                    <p className="text-[11.5px] text-emerald-700 italic pl-6">
                      &quot;{pingResult.reply}&quot;
                    </p>
                  </div>
                ) : (
                  <div className="text-red-700">
                    <strong>Không thành công: </strong>
                    <span>{pingResult.error}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Card 3: Custom API Key Setting */}
          <div className="p-4 bg-white border border-[#d8ddd9] shadow-xs space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-[#0A131E] flex items-center gap-1.5 uppercase tracking-wider">
                  <Key className="w-4 h-4 text-[#8C6B18]" />
                  Khóa Google Gemini API Tùy chọn
                </h3>
                <span className="text-[10px] text-slate-500">
                  Lưu trên trình duyệt cá nhân
                </span>
              </div>
              <p className="text-[11.5px] text-slate-500 mt-1 leading-relaxed">
                Hệ thống đã kết nối sẵn khóa Gemini của dự án tại máy chủ. Bạn chỉ cần nhập khóa riêng nếu muốn dùng quota hoặc dự án Google Cloud cá nhân của bạn.
              </p>
            </div>

            <div className="space-y-2">
              <div className="relative">
                <input
                  type={showKey ? "text" : "password"}
                  value={customKey}
                  onChange={(e) => setCustomKey(e.target.value)}
                  placeholder="Nhập khóa API (ví dụ: AIzaSy...)"
                  className="w-full px-3 py-2 pr-10 text-xs border border-[#d8ddd9] focus:outline-none focus:border-[#C59B27] bg-[#fdfdfc] font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  title={showKey ? "Ẩn khóa" : "Hiện khóa"}
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex items-center justify-between gap-2 pt-1">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSaveKey}
                    className="px-3.5 py-1.5 bg-gradient-to-r from-[#D4AF37] via-[#F7EBB8] to-[#C59B27] hover:brightness-105 text-[#2A1F04] text-xs font-bold flex items-center gap-1.5 transition cursor-pointer border border-[rgba(197,155,39,0.5)] shadow-xs"
                  >
                    <Check className="w-3.5 h-3.5 text-[#2A1F04]" />
                    <span>Lưu khóa</span>
                  </button>
                  {customKey && (
                    <button
                      type="button"
                      onClick={handleResetDefault}
                      className="px-3 py-1.5 bg-white border border-[rgba(197,155,39,0.4)] hover:bg-[#FAF5E8] text-[#7D5D0D] text-xs font-medium transition cursor-pointer"
                    >
                      Dùng khóa hệ thống
                    </button>
                  )}
                </div>

                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-[#8C6B18] hover:underline flex items-center gap-1 font-medium"
                >
                  <span>Lấy khóa tại Google AI Studio</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {saveToast && (
                <div className="p-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-1.5 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Đã cập nhật cấu hình khóa AI thành công!</span>
                </div>
              )}
            </div>
          </div>

          {/* Scope list */}
          <div className="p-3 bg-gradient-to-br from-[#FFFDF9] to-[#FAF5E8] border border-[rgba(197,155,39,0.3)] text-[11.5px] text-slate-700">
            <span className="font-bold text-[#8C6B18] block mb-1">
              Phạm vi kết nối Google Gemini API:
            </span>
            <ul className="grid grid-cols-2 gap-1.5 text-[11px]">
              <li className="flex items-center gap-1">
                <Check className="w-3 h-3 text-emerald-600" />
                <span>Hỏi đáp Pháp lý Nghị định 52/2024</span>
              </li>
              <li className="flex items-center gap-1">
                <Check className="w-3 h-3 text-emerald-600" />
                <span>Soạn thảo hợp đồng ví điện tử</span>
              </li>
              <li className="flex items-center gap-1">
                <Check className="w-3 h-3 text-emerald-600" />
                <span>Rà soát bẫy pháp lý điều khoản</span>
              </li>
              <li className="flex items-center gap-1">
                <Check className="w-3 h-3 text-emerald-600" />
                <span>So sánh đối chiếu phiên bản (Diff)</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-[#ccd4d1] flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <Sparkles className="w-3.5 h-3.5 text-[#8C6B18]" />
            <span>Thịnh Vượng Legal · Đề án Nghiên cứu Nhóm 13</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-gradient-to-r from-[#D4AF37] via-[#F7EBB8] to-[#C59B27] hover:brightness-105 text-[#2A1F04] text-xs font-bold transition cursor-pointer border border-[rgba(197,155,39,0.5)] shadow-xs"
          >
            Hoàn tất &amp; Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
