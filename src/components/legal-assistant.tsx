import { useEffect, useRef, useState, type SyntheticEvent } from 'react';
import {
  AlertTriangle,
  Bot,
  Check,
  CheckCircle2,
  Copy,
  CornerDownLeft,
  FileSearch,
  FileText,
  HelpCircle,
  Key,
  LoaderCircle,
  Scale,
  Send,
  ShieldAlert,
  Sparkles,
  Zap,
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { safeStorage } from '@/lib/storage';

type Message = { role: 'user' | 'assistant'; text: string };

interface ClauseReviewResult {
  riskLevel: 'CAO' | 'TRUNG BÌNH' | 'THẤP';
  legalTrap: string;
  citation: string;
  recommendedClause: string;
  actionNotes?: string;
}

const sampleClauses = [
  {
    label: 'Bẫy miễn trừ trách nhiệm sự cố',
    text: 'Bên A hoàn toàn được miễn trừ mọi trách nhiệm bồi thường thiệt hại trực tiếp hoặc gián tiếp đối với khách hàng khi hệ thống thanh toán gặp sự cố kỹ thuật hoặc lỗi đường truyền từ đối tác viễn thông/ngân hàng.',
  },
  {
    label: 'Bẫy chia sẻ dữ liệu trái phép',
    text: 'Bên B đồng ý cho phép Bên A toàn quyền lưu trữ, chia sẻ và khai thác thông tin định danh, lịch sử giao dịch và số tài khoản thanh toán cho các đối tác quảng cáo và chấm điểm tín dụng của Bên A.',
  },
  {
    label: 'Bẫy phong tỏa vốn thanh quyết toán',
    text: 'Bên A có quyền đơn phương giữ lại toàn bộ doanh thu bán hàng của Bên B trong thời hạn 90 ngày mà không phải trả bất kỳ khoản lãi nào nếu Bên A nghi ngờ có rủi ro gian lận.',
  },
];

const contextualQuestions = [
  {
    category: 'Tài chính & Thu phí',
    badge: 'Hội đồng quan tâm',
    q: 'Khách hàng trả tiền bao nhiêu và trả cho công ty hay trả thẳng cho luật sư?',
  },
  {
    category: 'Đầu lương & Thù lao',
    badge: '12 Thành viên',
    q: 'Các đầu lương, thù lao vụ việc và cơ chế chia lợi nhuận cho 12 thành viên ra sao?',
  },
  {
    category: 'Lợi nhuận thời gian chờ',
    badge: 'Chiến lược 6-12 tháng',
    q: 'Trong 6-12 tháng đợi hồ sơ cấp phép NHNN, làm thế nào để vẫn kiếm được tiền và sinh lợi nhuận?',
  },
  {
    category: 'Phản biện Nhà đầu tư',
    badge: 'Điểm hòa vốn',
    q: 'Kịch bản trả lời thầy giáo và nhà đầu tư về điểm hòa vốn và mô hình doanh thu?',
  },
  {
    category: 'Nhân sự & Đội ngũ',
    badge: 'Nhóm 13',
    q: '12 thành viên Ban Nghiên cứu Nhóm 13 gồm những ai và phụ trách mảng nào?',
  },
  {
    category: 'Pháp lý Fintech',
    badge: 'Nghị định 52/2024',
    q: 'Vốn điều lệ 50 tỷ theo NĐ 52/2024 và tài khoản đảm bảo thanh toán 1:1 quy định thế nào?',
  },
];

function FormattedInline({ text, isUser }: { text: string; isUser: boolean }) {
  if (!text) return null;
  const parts = text.split(/(\*\*.*?\*\*|\*[^*\n]+?\*)/g);
  return (
    <>
      {parts.map((part, idx) => {
        if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
          const inner = part.slice(2, -2);
          return (
            <strong
              key={idx}
              className={`font-semibold ${isUser ? 'text-white' : 'text-[#071b2e]'}`}
            >
              {inner}
            </strong>
          );
        }
        if (part.startsWith('*') && part.endsWith('*') && part.length >= 3 && !part.startsWith('**')) {
          const inner = part.slice(1, -1);
          return (
            <em key={idx} className="italic opacity-90">
              {inner}
            </em>
          );
        }
        const cleaned = part.replace(/\*\*/g, '');
        return <span key={idx}>{cleaned}</span>;
      })}
    </>
  );
}

function FormattedMessage({ content, isUser }: { content: string; isUser: boolean }) {
  const lines = content.split('\n');
  return (
    <div className="space-y-1.5 leading-relaxed">
      {lines.map((rawLine, idx) => {
        const line = rawLine.trim();
        if (!line) {
          return <div key={idx} className="h-1" />;
        }

        if (line === '---' || line === '***' || line === '___') {
          return (
            <hr
              key={idx}
              className={`my-2 border-t ${isUser ? 'border-white/20' : 'border-[#d8ddd9]'}`}
            />
          );
        }

        if (line.startsWith('### ')) {
          return (
            <h4
              key={idx}
              className={`font-heading font-bold text-xs pt-1 ${
                isUser ? 'text-[#e7c487]' : 'text-[#071b2e]'
              }`}
            >
              <FormattedInline text={line.slice(4)} isUser={isUser} />
            </h4>
          );
        }

        if (line.startsWith('## ')) {
          return (
            <h3
              key={idx}
              className={`font-heading font-bold text-[13px] pt-1.5 ${
                isUser ? 'text-[#e7c487]' : 'text-[#071b2e]'
              }`}
            >
              <FormattedInline text={line.slice(3)} isUser={isUser} />
            </h3>
          );
        }

        if (line.startsWith('*(') && line.endsWith(')*')) {
          return (
            <div
              key={idx}
              className={`text-[11px] italic pt-1 ${
                isUser ? 'text-slate-300' : 'text-slate-500'
              }`}
            >
              <FormattedInline text={line.slice(2, -2)} isUser={isUser} />
            </div>
          );
        }

        if (
          line.startsWith('• ') ||
          line.startsWith('- ') ||
          (line.startsWith('* ') && !line.startsWith('**'))
        ) {
          const bulletText = line.replace(/^[•\-\*]\s+/, '');
          return (
            <div key={idx} className="flex items-start gap-1.5 pl-0.5 text-[11.5px]">
              <span className={`shrink-0 ${isUser ? 'text-[#e7c487]' : 'text-[#0c665f]'}`}>•</span>
              <div className="flex-1">
                <FormattedInline text={bulletText} isUser={isUser} />
              </div>
            </div>
          );
        }

        const numMatch = line.match(/^(\d+[\.\)])\s+(.*)/);
        if (numMatch) {
          const [, prefix, rest] = numMatch;
          return (
            <div key={idx} className="flex items-start gap-1.5 pl-0.5 text-[11.5px]">
              <span
                className={`font-semibold shrink-0 ${isUser ? 'text-[#e7c487]' : 'text-[#0c665f]'}`}
              >
                {prefix}
              </span>
              <div className="flex-1">
                <FormattedInline text={rest} isUser={isUser} />
              </div>
            </div>
          );
        }

        return (
          <p key={idx} className="text-[11.5px]">
            <FormattedInline text={line} isUser={isUser} />
          </p>
        );
      })}
    </div>
  );
}

interface LegalAssistantProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  showFloatingTrigger?: boolean;
}

export function LegalAssistant({
  open: openProp,
  onOpenChange,
  showFloatingTrigger = true,
}: LegalAssistantProps = {}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : internalOpen;

  const setOpen = (nextOpen: boolean) => {
    if (isControlled) {
      onOpenChange?.(nextOpen);
    } else {
      setInternalOpen(nextOpen);
    }
  };

  const [activeTab, setActiveTab] = useState<'chat' | 'reviewer'>('chat');

  // Chat State
  const [input, setInput] = useState('');
  const [selectedText, setSelectedText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [pending, setPending] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Reviewer State
  const [clauseInput, setClauseInput] = useState('');
  const [reviewPending, setReviewPending] = useState(false);
  const [reviewResult, setReviewResult] = useState<ClauseReviewResult | null>(null);
  const [copiedRecommended, setCopiedRecommended] = useState(false);

  useEffect(() => {
    const ask = (event: Event) => {
      const text = (event as CustomEvent<string>).detail;
      setSelectedText(text);
      setActiveTab('reviewer');
      setClauseInput(text);
      setOpen(true);
    };
    const handleOpen = () => setOpen(true);

    window.addEventListener('tv:ask-selection', ask);
    window.addEventListener('tv:open-assistant', handleOpen);
    return () => {
      window.removeEventListener('tv:ask-selection', ask);
      window.removeEventListener('tv:open-assistant', handleOpen);
    };
  }, [isControlled]);

  // Submit Chat Message
  async function submitChat(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = input.trim();
    if (!message || pending) return;

    setMessages((old) => [...old, { role: 'user', text: message }]);
    setInput('');
    setPending(true);

    try {
      const customKey = safeStorage.getItem('tvl_custom_gemini_key');
      const reqHeaders: Record<string, string> = {
        'content-type': 'application/json',
      };
      if (customKey && customKey.trim().length > 8) {
        reqHeaders['x-gemini-key'] = customKey.trim();
      }

      const response = await fetch('/api/legal-assistant', {
        method: 'POST',
        headers: reqHeaders,
        body: JSON.stringify({
          message,
          selectedText: selectedText || undefined,
        }),
      });

      if (!response.ok) {
        const payload: any = await response.json().catch(() => ({}));
        throw new Error(payload?.error || 'Trợ lý chưa thể trả lời lúc này.');
      }

      setSelectedText('');
      const data = await response.json();
      const answer = data.answer || 'Đã xử lý câu hỏi.';
      setMessages((old) => [...old, { role: 'assistant', text: answer }]);
    } catch (error: any) {
      console.error(error);
      setMessages((old) => [
        ...old,
        {
          role: 'assistant',
          text: error?.message || 'Trợ lý chưa thể phản hồi lúc này. Vui lòng thử lại sau.',
        },
      ]);
    } finally {
      setPending(false);
    }
  }

  // Submit Clause Review
  async function handleReviewClause() {
    if (!clauseInput.trim() || reviewPending) return;
    setReviewPending(true);
    setReviewResult(null);

    try {
      const customKey = safeStorage.getItem('tvl_custom_gemini_key');
      const reqHeaders: Record<string, string> = {
        'content-type': 'application/json',
      };
      if (customKey && customKey.trim().length > 8) {
        reqHeaders['x-gemini-key'] = customKey.trim();
      }

      const response = await fetch('/api/review-clause', {
        method: 'POST',
        headers: reqHeaders,
        body: JSON.stringify({ clauseText: clauseInput }),
      });

      if (!response.ok) {
        const errorData: any = await response.json().catch(() => ({}));
        throw new Error(errorData?.error || 'Không thể rà soát điều khoản.');
      }

      const result = await response.json();
      setReviewResult(result);
    } catch (err: any) {
      console.error(err);
      setReviewResult({
        riskLevel: 'TRUNG BÌNH',
        legalTrap: 'Không thể kết nối máy chủ phân tích: ' + (err?.message || 'Lỗi xử lý.'),
        citation: 'Nghị định 52/2024/NĐ-CP',
        recommendedClause: clauseInput,
        actionNotes: 'Vui lòng kiểm tra lại kết nối mạng hoặc thử lại.',
      });
    } finally {
      setReviewPending(false);
    }
  }

  const handleCopyClause = (text: string) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text);
      }
    } catch (e) {
      console.warn('Clipboard write failed:', e);
    }
    setCopiedRecommended(true);
    setTimeout(() => setCopiedRecommended(false), 2000);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {showFloatingTrigger && (
        <SheetTrigger className="ai-trigger flex items-center gap-2 px-4 py-2.5 bg-[#071b2e] text-white border border-[#c89b51] shadow-xl hover:bg-[#0c665f] transition cursor-pointer" aria-label="Mở trợ lý pháp lý AI 2.0">
          <Sparkles className="w-4 h-4 text-[#e7c487]" />
          <span className="text-xs font-bold uppercase tracking-wider">AI Legal Copilot 2.0</span>
        </SheetTrigger>
      )}

      <SheetContent className="ai-sheet flex flex-col p-0 w-full sm:max-w-lg bg-[#f7f6f1]">
        {/* Header */}
        <SheetHeader className="ai-header bg-[#071b2e] text-white p-5 border-b border-[#c89b51]/30">
          <div className="ai-title-row flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-sm bg-[#0c665f] text-[#e7c487] flex items-center justify-center">
                <Bot className="w-6 h-6" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <SheetTitle className="text-white font-serif text-lg">
                    AI Legal Copilot 2.0
                  </SheetTitle>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 bg-[#c89b51] text-[#071523] font-black rounded-xs">
                    PRO
                  </span>
                </div>
                <SheetDescription className="text-slate-300 text-xs mt-0.5">
                  Tư vấn Pháp luật Fintech, Giới thiệu Đề án & Soát xét Hợp đồng
                </SheetDescription>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                window.dispatchEvent(new CustomEvent('tv:open-ai-settings'))
              }
              className="px-2.5 py-1 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 text-[11px] font-semibold flex items-center gap-1.5 rounded-xs transition cursor-pointer shrink-0"
              title="Cấu hình khóa Google Gemini API"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <Key className="w-3 h-3 text-[#e7c487]" />
              <span>Khóa AI</span>
            </button>
          </div>
        </SheetHeader>

        {/* Tab Selection */}
        <div className="bg-[#0d2b3e] px-4 py-2 flex gap-2 border-b border-[#c89b51]/20">
          <button
            type="button"
            onClick={() => setActiveTab('chat')}
            className={`px-3 py-1.5 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition rounded-xs ${
              activeTab === 'chat'
                ? 'bg-[#c89b51] text-[#071b2e]'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            Hỏi Đáp Pháp Lý &amp; Đề Án
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('reviewer')}
            className={`px-3 py-1.5 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition rounded-xs ${
              activeTab === 'reviewer'
                ? 'bg-[#c89b51] text-[#071b2e]'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <FileSearch className="w-3.5 h-3.5" />
            Rà Soát Điều Khoản Hợp Đồng
          </button>
        </div>

        {/* Tab 1: Chat Q&A */}
        {activeTab === 'chat' && (
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            <div className="ai-notice bg-[#fff8e7] border-b border-[#eed48c] px-4 py-2 text-[11px] text-[#7a5d1b] flex items-center justify-between">
              <span>Hỏi đáp Pháp lý, 12 Thành viên Nhóm 13 &amp; Dịch vụ Hợp đồng</span>
              <span className="font-bold text-[#0c665f]">Hỗ trợ 24/7</span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {!messages.length && (
                <div className="space-y-4 py-4">
                  <div className="text-center">
                    <span className="w-12 h-12 bg-[#edf3f2] text-[#0c665f] rounded-full mx-auto flex items-center justify-center mb-2">
                      <Scale className="w-6 h-6" />
                    </span>
                    <h3 className="font-serif text-lg font-semibold text-[#071b2e]">
                      Tham vấn Pháp lý &amp; Đội ngũ Thịnh Vượng Legal
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                      Bạn có thể hỏi mọi vấn đề về luật ví điện tử, 12 thành viên Nhóm 13, 20 hợp đồng mẫu hoặc thông tin liên hệ công ty.
                    </p>
                  </div>

                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      <span>Gợi ý câu hỏi trọng tâm & Phản biện:</span>
                      <span className="text-[10px] text-[#0c665f] font-semibold">Tài chính · Lương · Lợi nhuận</span>
                    </div>
                    {contextualQuestions.map((item, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setInput(item.q);
                          inputRef.current?.focus();
                        }}
                        className="w-full text-left p-2.5 bg-white border border-[#d8ddd9] hover:border-[#0c665f] hover:bg-[#edf3f2] text-xs text-slate-700 font-medium flex items-center justify-between group transition cursor-pointer"
                      >
                        <div className="pr-2">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="text-[10px] font-bold text-[#0c665f] bg-[#edf3f2] px-1.5 py-0.5 border border-[#0c665f]/20">
                              {item.category}
                            </span>
                            <span className="text-[10px] text-amber-700 bg-amber-50 px-1 py-0.5 border border-amber-200/60">
                              {item.badge}
                            </span>
                          </div>
                          <span className="line-clamp-2 text-slate-800 group-hover:text-[#071b2e]">{item.q}</span>
                        </div>
                        <CornerDownLeft className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0c665f] shrink-0 ml-2" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`p-3.5 rounded-sm text-xs leading-relaxed max-w-[92%] ${
                    m.role === 'user'
                      ? 'ml-auto bg-[#071b2e] text-white'
                      : 'mr-auto bg-white border border-[#d8ddd9] text-slate-800 shadow-xs'
                  }`}
                >
                  <div className="font-bold text-[10px] uppercase mb-1 opacity-70">
                    {m.role === 'user' ? 'Doanh nghiệp hỏi' : 'AI Legal Copilot'}
                  </div>
                  <FormattedMessage content={m.text} isUser={m.role === 'user'} />
                </div>
              ))}

              {pending && (
                <div className="mr-auto bg-white border border-[#d8ddd9] p-3 text-xs flex items-center gap-2 text-slate-600">
                  <LoaderCircle className="w-4 h-4 animate-spin text-[#0c665f]" />
                  <span>Đang đối chiếu Nghị định 52/2024 & Thông tư 40/2024...</span>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <form onSubmit={submitChat} className="p-3 bg-white border-t border-[#d8ddd9]">
              {selectedText && (
                <div className="mb-2 p-2 bg-[#edf3f2] border-l-2 border-[#0c665f] text-[11px] flex justify-between items-center">
                  <span className="truncate max-w-[320px]">
                    Trích dẫn: &quot;{selectedText.slice(0, 60)}...&quot;
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedText('')}
                    className="text-slate-500 hover:text-red-600 font-bold ml-2"
                  >
                    Bỏ
                  </button>
                </div>
              )}
              <div className="relative">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Hỏi về thu phí, đầu lương, lợi nhuận khi chờ cấp phép, vốn 50 tỷ..."
                  rows={2}
                  className="w-full pr-10 p-2.5 text-xs border border-[#d8ddd9] focus:outline-none focus:border-[#0c665f] bg-[#fcfcfb] resize-none"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || pending}
                  className="absolute right-2 bottom-3 p-1.5 bg-[#071b2e] hover:bg-[#0c665f] text-white disabled:opacity-40 transition cursor-pointer"
                  title="Gửi câu hỏi"
                >
                  <Send className="w-3.5 h-3.5 text-[#e7c487]" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 2: Contract Clause Reviewer */}
        {activeTab === 'reviewer' && (
          <div className="flex-1 flex flex-col min-h-0 overflow-y-auto p-4 space-y-4">
            <div className="bg-white p-4 border border-[#d8ddd9]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#071b2e] flex items-center gap-1.5">
                  <FileSearch className="w-4 h-4 text-[#c89b51]" />
                  Dán điều khoản cần rà soát rủi ro:
                </span>
                <span className="text-[11px] text-slate-500">Fintech · E-Wallet</span>
              </div>

              <textarea
                value={clauseInput}
                onChange={(e) => setClauseInput(e.target.value)}
                placeholder="Dán toàn văn điều khoản bạn muốn kiểm tra (ví dụ: điều khoản miễn trừ trách nhiệm sự cố, điều khoản dữ liệu khách hàng, thời hạn đối soát)..."
                rows={4}
                className="w-full p-2.5 text-xs border border-[#d8ddd9] focus:outline-none focus:border-[#0c665f] bg-[#fdfdfb] resize-none"
              />

              {/* Sample Clause Shortcuts */}
              <div className="mt-2.5">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Thử nhanh các mẫu điều khoản thực tế:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {sampleClauses.map((sc, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setClauseInput(sc.text)}
                      className="px-2 py-1 bg-[#f7f6f1] hover:bg-[#edf3f2] text-[11px] text-slate-700 border border-[#d8ddd9] cursor-pointer"
                    >
                      {sc.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-3 flex justify-end">
                <button
                  type="button"
                  onClick={handleReviewClause}
                  disabled={!clauseInput.trim() || reviewPending}
                  className="px-4 py-2 bg-[#071b2e] hover:bg-[#0c665f] text-white text-xs font-bold flex items-center gap-2 cursor-pointer transition disabled:opacity-50"
                >
                  {reviewPending ? (
                    <>
                      <LoaderCircle className="w-3.5 h-3.5 animate-spin text-[#e7c487]" />
                      <span>Đang phân tích rủi ro...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-3.5 h-3.5 text-[#e7c487]" />
                      <span>Rà Soát Rủi Ro & Bẫy Pháp Lý</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Analysis Results Display */}
            {reviewResult && (
              <div className="space-y-3 bg-white p-4 border border-[#c89b51] shadow-md animate-in fade-in duration-300">
                {/* Risk Badge */}
                <div className="flex items-center justify-between pb-3 border-b border-[#d8ddd9]">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Kết quả đánh giá rủi ro
                  </span>
                  <span
                    className={`text-xs font-black px-2.5 py-1 uppercase rounded-xs ${
                      reviewResult.riskLevel === 'CAO'
                        ? 'bg-red-100 text-red-800 border border-red-300'
                        : reviewResult.riskLevel === 'TRUNG BÌNH'
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    }`}
                  >
                    Mức độ: {reviewResult.riskLevel}
                  </span>
                </div>

                {/* Legal Trap */}
                <div className="p-3 bg-[#fff8f8] border-l-3 border-red-500 text-xs">
                  <span className="font-bold text-red-800 flex items-center gap-1.5 mb-1">
                    <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
                    Bẫy Pháp Lý & Nguy Cơ Vi Phạm:
                  </span>
                  <p className="text-slate-800 leading-relaxed">
                    <FormattedInline text={reviewResult.legalTrap} isUser={false} />
                  </p>
                </div>

                {/* Citation */}
                <div className="p-2.5 bg-[#f7f6f1] border border-[#d8ddd9] text-xs">
                  <span className="font-bold text-[#071b2e] block mb-0.5">
                    Căn cứ pháp luật viện dẫn:
                  </span>
                  <span className="text-[#0c665f] font-semibold">
                    <FormattedInline text={reviewResult.citation} isUser={false} />
                  </span>
                </div>

                {/* Recommended Clause */}
                <div className="p-3.5 bg-[#edf3f2] border border-[#0c665f]/40 text-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-[#0c665f] flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-[#0c665f]" />
                      Điều khoản đề xuất viết lại (Chuẩn tuân thủ):
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyClause(reviewResult.recommendedClause)}
                      className="px-2 py-1 bg-white border border-[#d8ddd9] hover:border-[#0c665f] text-[11px] font-semibold text-slate-700 flex items-center gap-1 cursor-pointer"
                    >
                      {copiedRecommended ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>Đã chép</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Sao chép</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="font-serif italic text-slate-800 leading-relaxed bg-white p-3 border border-[#d8ddd9]">
                    &quot;{reviewResult.recommendedClause}&quot;
                  </div>
                </div>

                {/* Action Notes */}
                {reviewResult.actionNotes && (
                  <div className="text-xs text-slate-600 border-t border-[#d8ddd9] pt-2">
                    <span className="font-bold text-slate-800 block mb-1">
                      Khuyến nghị đàm phán:
                    </span>
                    <div className="text-slate-700">
                      <FormattedMessage content={reviewResult.actionNotes} isUser={false} />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
