"use client";

import { Link } from "@/router";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  ClipboardCheck,
  Download,
  ExternalLink,
  FilePlus2,
  FileSearch,
  FileSignature,
  Files,
  FolderKanban,
  GitCompareArrows,
  Key,
  LoaderCircle,
  LockKeyhole,
  Search,
  ShieldCheck,
  Sparkles,
  Trash2,
  UploadCloud,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState, type SyntheticEvent } from "react";
import { AiConfigModal } from "@/components/ai-config-modal";
import {
  useDemoSession,
  type DemoFile,
} from "@/components/demo-session-provider";
import { downloadLegalDocx } from "@/lib/download-docx";
import { formatFileSize, readLegalDocument } from "@/lib/client-document";
import { safeStorage } from "@/lib/storage";
import {
  demoChapters,
  platformSources,
  platformStats,
  reviewPlaybook,
  sampleQuestions,
} from "@/lib/platform-data";
import { contracts } from "@/lib/site-data";
import { useCustomerName } from "@/hooks/use-customer-name";

const SAMPLE_CONTRACT_DOCX = {
  name: "Hop-dong-cung-ung-dich-vu-vi-dien-tu-2026.docx",
  text: `CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
Độc lập - Tự do - Hạnh phúc
---------------

HỢP ĐỒNG CUNG ỨNG DỊCH VỤ TRUNG GIAN THANH TOÁN VÍ ĐIỆN TỬ
Số: 86/2026/HĐ-FINTECH/TVL

- Căn cứ Bộ luật Dân sự số 91/2015/QH13;
- Căn cứ Luật Các tổ chức tín dụng số 32/2024/QH15;
- Căn cứ Nghị định số 52/2024/NĐ-CP của Chính phủ quy định về thanh toán không dùng tiền mặt;
- Căn cứ Thông tư số 40/2024/TT-NHNN của Ngân hàng Nhà nước Việt Nam hướng dẫn dịch vụ trung gian thanh toán;
- Căn cứ Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15;
- Căn cứ nhu cầu và năng lực hợp tác của hai Bên.

Hôm nay, ngày 15 tháng 03 năm 2026, tại Trụ sở Công ty Cổ phần Fintech Thịnh Vượng, chúng tôi gồm:

BÊN A (BÊN CUNG CẤP DỊCH VỤ VÍ):
- Tên đơn vị: CÔNG TY CỔ PHẦN DỊCH VỤ THANH TOÁN FINTECH VIỆT NAM
- Giấy phép số: 45/GP-NHNN cấp bởi Ngân hàng Nhà nước Việt Nam
- Đại diện: Ông Nguyễn Văn An - Chức vụ: Tổng Giám đốc
- Tài khoản đảm bảo thanh toán: 1029384756 tại Ngân hàng TMCP Ngoại Thương Việt Nam (Vietcombank)

BÊN B (ĐƠN VỊ CHẤP NHẬN THANH TOÁN):
- Tên đơn vị: CÔNG TY CỔ PHẦN THƯƠNG MẠI ĐIỆN TỬ SAO KIM
- Đại diện: Bà Trần Thị Mai - Chức vụ: Giám đốc Điều hành
- Mã số doanh nghiệp: 0109876543

Hai Bên cùng thống nhất ký kết Hợp đồng dịch vụ ví điện tử với các điều khoản sau:

Điều 1. Phạm vi dịch vụ và Cổng kết nối
1.1. Bên A cung cấp giải pháp kết nối API ví điện tử để khách hàng của Bên B thực hiện thanh toán mua sắm hàng hóa, dịch vụ hợp pháp.
1.2. Bên A cam kết duy trì số dư ký quỹ đảm bảo khả năng thanh toán tỷ lệ 1:1 theo đúng quy định tại Điều 25 Nghị định 52/2024/NĐ-CP.

Điều 2. Biểu phí và Chu kỳ đối soát
2.1. Phí xử lý giao dịch: 1.6% trên tổng giá trị giao dịch thành công phát sinh qua cổng ví điện tử.
2.2. Thời hạn đối soát: Hai Bên chốt biên bản đối soát vào thứ Hai hàng tuần. Bên A thực hiện quyết toán chuyển tiền về tài khoản ngân hàng của Bên B trong vòng T+2 ngày làm việc.

Điều 3. Cam kết an toàn thông tin và bảo mật dữ liệu
3.1. Hệ thống ví điện tử của Bên A đạt chuẩn bảo mật quốc tế PCI-DSS Level 1 và cấp độ 3 về an toàn hệ thống thông tin theo Nghị định 85/2016/NĐ-CP.
3.2. Thu thập, xử lý và lưu trữ dữ liệu người dùng tuân thủ Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15.

Điều 4. Xử lý tra soát, khiếu nại và tranh chấp
4.1. Thời hạn tiếp nhận và xử lý tra soát khiếu nại không quá 03 ngày làm việc đối với giao dịch nội địa.
4.2. Mọi tranh chấp phát sinh được ưu tiên giải quyết qua thương lượng; trường hợp không đạt thỏa thuận sẽ đưa ra Tòa án nhân dân có thẩm quyền tại Hà Nội.`
};

const SAMPLE_COMPARE_V1 = {
  name: "Hop-dong-Vi-Dien-Tu-Ban-Goc-V1.docx",
  text: `HỢP ĐỒNG CUNG CẤP DỊCH VỤ VÍ ĐIỆN TỬ (BẢN GỐC - V1)
Căn cứ Nghị định 52/2024/NĐ-CP về thanh toán không dùng tiền mặt.
Điều 1: Bên A cung ứng kết nối ví điện tử cho Bên B để xử lý thanh toán trực tuyến.
Điều 2: Biểu phí giao dịch là 1.8% tính trên tổng giá trị mỗi giao dịch thành công.
Điều 3: Chu kỳ đối soát giao dịch định kỳ vào thứ Hai hàng tuần. Thanh toán chuyển tiền sau T+3 ngày làm việc.
Điều 4: Bên A chịu trách nhiệm bồi thường thiệt hại trực tiếp nếu lỗi do sự cố kỹ thuật của hệ thống ví điện tử.
Điều 5: Hợp đồng có hiệu lực trong thời hạn 12 tháng kể từ ngày ký kết.`
};

const SAMPLE_COMPARE_V2 = {
  name: "Hop-dong-Vi-Dien-Tu-Ban-Sua-Doi-V2.docx",
  text: `HỢP ĐỒNG CUNG CẤP DỊCH VỤ VÍ ĐIỆN TỬ VÀ CỔNG THANH TOÁN (BẢN ĐỀ XUẤT MỚI - V2)
Căn cứ Nghị định 52/2024/NĐ-CP và Thông tư 40/2024/TT-NHNN về dịch vụ trung gian thanh toán.
Điều 1: Bên A cung ứng giải pháp ví điện tử, cổng thanh toán trực tuyến và dịch vụ thu hộ/chi hộ cho Bên B.
Điều 2: Biểu phí giao dịch giảm xuống 1.2% tính trên tổng giá trị giao dịch thành công, áp dụng cố định trong 24 tháng.
Điều 3: Chu kỳ đối soát rút ngắn hàng ngày (T+1) vào 09h00 sáng. Tiền quyết toán tự động giải ngân trong 24 giờ.
Điều 4: Miễn trừ trách nhiệm bồi thường cho Bên B trong mọi trường hợp phát sinh tranh chấp hoặc gian lận từ người dùng cuối; Bên A chịu hoàn toàn chi phí bồi hoàn.
Điều 5: Bổ sung chế tài phạt vi phạm hợp đồng mức 8% giá trị phần nghĩa vụ bị vi phạm và bồi thường toàn bộ thiệt hại gián tiếp phát sinh.
Điều 6: Hợp đồng tự động gia hạn thêm 24 tháng nếu hai Bên không có thông báo chấm dứt trước 60 ngày.`
};

function FormattedInline({ text }: { text: string }) {
  if (!text) return null;
  const parts = text.split(/(\*\*.*?\*\*|\*[^*\n]+?\*|\[[^\]\n]+\])/g);
  return (
    <>
      {parts.map((part, idx) => {
        if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
          const inner = part.slice(2, -2).replace(/\*\*/g, '');
          return (
            <strong key={idx} className="font-semibold text-[#071b2e]">
              {inner}
            </strong>
          );
        }
        if (part.startsWith('*') && part.endsWith('*') && part.length >= 3 && !part.startsWith('**')) {
          const inner = part.slice(1, -1).replace(/\*/g, '');
          return (
            <em key={idx} className="italic opacity-90">
              {inner}
            </em>
          );
        }
        if (part.startsWith('[') && part.endsWith(']') && part.length >= 3) {
          return (
            <span key={idx} className="legal-placeholder">
              {part}
            </span>
          );
        }
        const cleaned = part.replace(/\*\*/g, '').replace(/\*/g, '');
        return <span key={idx}>{cleaned}</span>;
      })}
    </>
  );
}

function FormattedLegalText({ content }: { content: string }) {
  const lines = content.split('\n');
  return (
    <div className="space-y-1.5 leading-relaxed">
      {lines.map((rawLine, idx) => {
        const line = rawLine.trim();
        if (!line) return <div key={idx} className="h-1" />;
        if (line === '---' || line === '***' || line === '___') {
          return <hr key={idx} className="my-2 border-t border-[#d8ddd9]" />;
        }
        if (line.startsWith('### ')) {
          return (
            <h4 key={idx} className="font-bold text-sm pt-1 text-[#071b2e]">
              <FormattedInline text={line.slice(4)} />
            </h4>
          );
        }
        if (line.startsWith('## ')) {
          return (
            <h3 key={idx} className="font-bold text-base pt-1.5 text-[#071b2e]">
              <FormattedInline text={line.slice(3)} />
            </h3>
          );
        }
        if (line.startsWith('# ')) {
          return (
            <h2 key={idx} className="font-bold text-lg pt-2 text-[#071b2e]">
              <FormattedInline text={line.slice(2)} />
            </h2>
          );
        }
        if (line.startsWith('- ') || line.startsWith('• ')) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-2">
              <span className="text-[#a07c3a] font-bold select-none">•</span>
              <div className="flex-1">
                <FormattedInline text={line.slice(2)} />
              </div>
            </div>
          );
        }
        const numMatch = line.match(/^(\d+[\.\)])\s+(.*)/);
        if (numMatch) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-2">
              <span className="text-[#a07c3a] font-semibold select-none min-w-[20px]">{numMatch[1]}</span>
              <div className="flex-1">
                <FormattedInline text={numMatch[2]} />
              </div>
            </div>
          );
        }
        return (
          <p key={idx}>
            <FormattedInline text={line} />
          </p>
        );
      })}
    </div>
  );
}

function renderDocInline(text: string) {
  if (!text) return null;
  // Match bold (**...**), italic (*...*), and placeholders ([...])
  const parts = text.split(/(\*\*.*?\*\*|\*[^*\n]+?\*|\[[^\]\n]+\])/g);
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      const inner = part.slice(2, -2).replace(/\*\*/g, '');
      return (
        <strong key={idx} className="font-bold text-[#071b2e]">
          {renderDocInline(inner)}
        </strong>
      );
    }
    if (part.startsWith('*') && part.endsWith('*') && part.length >= 3 && !part.startsWith('**')) {
      const inner = part.slice(1, -1).replace(/\*/g, '');
      return (
        <em key={idx} className="italic text-slate-700">
          {renderDocInline(inner)}
        </em>
      );
    }
    if (part.startsWith('[') && part.endsWith(']') && part.length >= 3) {
      return (
        <span key={idx} className="legal-placeholder">
          {part}
        </span>
      );
    }
    // Clean out any accidental residual double or single asterisks
    const cleaned = part.replace(/\*\*/g, '').replace(/\*/g, '');
    return <span key={idx}>{cleaned}</span>;
  });
}

function FormattedLegalDocument({
  content,
  isStreaming = false,
}: {
  content: string;
  isStreaming?: boolean;
}) {
  if (!content && isStreaming) {
    return (
      <div className="py-12 text-center text-slate-500 flex flex-col items-center justify-center gap-3">
        <span className="mode-badge pending">Đang kết nối AI và khởi tạo dự thảo...</span>
        <div className="text-xs text-[#0c665f] font-medium tracking-wide">AI đang phân tích và chuẩn bị viết dự thảo...</div>
      </div>
    );
  }
  if (!content) return null;

  const lines = content.split('\n');

  return (
    <div className="legal-doc-content space-y-2">
      {lines.map((rawLine, idx) => {
        const isLastLine = idx === lines.length - 1;
        const line = rawLine.trim();

        if (!line) return <div key={idx} className="h-2" />;

        if (line === '---' || line === '***' || line === '___' || line.startsWith('------')) {
          return <hr key={idx} className="my-3 border-t border-[#cbd5e1]" />;
        }

        // Center Quốc hiệu / Tiêu ngữ
        if (
          line.includes('CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM') ||
          line.includes('Độc lập - Tự do - Hạnh phúc')
        ) {
          return (
            <div key={idx} className="text-center font-bold text-[#071b2e] tracking-wide text-sm md:text-base">
              {renderDocInline(line)}
              {line.includes('Độc lập - Tự do - Hạnh phúc') && (
                <div className="w-28 h-[1px] bg-[#071b2e] mx-auto mt-1 mb-3" />
              )}
            </div>
          );
        }

        // Main Title
        const isMainTitle =
          (line.startsWith('# ') ||
            line.toUpperCase().startsWith('HỢP ĐỒNG') ||
            line.toUpperCase().startsWith('PHIẾU YÊU CẦU') ||
            line.toUpperCase().startsWith('TÓM TẮT') ||
            line.toUpperCase().startsWith('BÁO CÁO')) &&
          line.length < 130 &&
          !line.includes(':');

        if (isMainTitle) {
          const clean = line.replace(/^#+\s*/, '');
          return (
            <div
              key={idx}
              className="text-center font-bold text-base md:text-lg text-[#071b2e] tracking-wide uppercase mt-4 mb-2"
            >
              {renderDocInline(clean)}
            </div>
          );
        }

        // Subheaders ###
        if (line.startsWith('### ')) {
          return (
            <h4 key={idx} className="font-bold text-base text-[#071b2e] mt-3 mb-1">
              {renderDocInline(line.slice(4))}
            </h4>
          );
        }

        // Subheaders ##
        if (line.startsWith('## ')) {
          return (
            <h3 key={idx} className="font-bold text-lg text-[#071b2e] mt-4 mb-1">
              {renderDocInline(line.slice(3))}
            </h3>
          );
        }

        // Articles: "Điều 1: ..." or "ĐIỀU 1. ..."
        const isArticle = /^(ĐIỀU|Điều)\s+\d+[\.:]/i.test(line);
        if (isArticle) {
          return (
            <div key={idx} className="font-bold text-[#071b2e] mt-3 mb-1">
              {renderDocInline(line)}
              {isStreaming && isLastLine && <span className="typing-cursor" />}
            </div>
          );
        }

        // Bullet list: - or • or *
        if (line.startsWith('- ') || line.startsWith('• ') || line.startsWith('* ')) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-3 my-1">
              <span className="text-[#a07c3a] font-bold select-none">•</span>
              <div className="flex-1">
                {renderDocInline(line.slice(2))}
                {isStreaming && isLastLine && <span className="typing-cursor" />}
              </div>
            </div>
          );
        }

        // Numbered list: 1.1 or 1. or a)
        const numMatch = line.match(/^(\d+(\.\d+)*[\.\)]|[a-zA-Z][\.\)])\s+(.*)/);
        if (numMatch) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-3 my-1">
              <span className="font-bold text-[#071b2e] select-none min-w-[22px]">
                {numMatch[1]}
              </span>
              <div className="flex-1">
                {renderDocInline(numMatch[3])}
                {isStreaming && isLastLine && <span className="typing-cursor" />}
              </div>
            </div>
          );
        }

        return (
          <p key={idx} className="my-1.5 leading-[1.85]">
            {renderDocInline(line)}
            {isStreaming && isLastLine && <span className="typing-cursor" />}
          </p>
        );
      })}
    </div>
  );
}

// SSE stream helper
async function streamSSEFetch(
  url: string,
  body: Record<string, unknown>,
  onChunk: (text: string, mode: "ai" | "demo") => void
): Promise<{ text: string; mode: "ai" | "demo" }> {
  const customKey = safeStorage.getItem("tvl_custom_gemini_key");
  const reqHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "text/event-stream, application/json",
  };
  if (customKey && customKey.trim().length > 8) {
    reqHeaders["x-gemini-key"] = customKey.trim();
  }

  const res = await fetch(url, {
    method: "POST",
    headers: reqHeaders,
    body: JSON.stringify({ ...body, stream: true }),
  });

  if (!res.ok) {
    let errMsg = "Có lỗi xảy ra khi xử lý.";
    if (res.status === 413) {
      errMsg = "Dung lượng tệp hoặc yêu cầu gửi đi quá lớn. Vui lòng rút gọn nội dung hoặc chọn tệp nhỏ hơn.";
    }
    try {
      const errData = await res.json();
      if (errData?.error) errMsg = errData.error;
    } catch {}
    throw new Error(errMsg);
  }

  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("text/event-stream") && res.body) {
    const reader = res.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";
    let accumulated = "";
    let finalMode: "ai" | "demo" = "demo";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith("data:")) {
          const jsonStr = trimmed.slice(5).trim();
          if (!jsonStr) continue;
          try {
            const data = JSON.parse(jsonStr);
            if (data.mode) finalMode = data.mode;
            if (data.chunk) {
              accumulated += data.chunk;
              onChunk(accumulated, finalMode);
            }
            if (data.done) {
              return { text: accumulated, mode: finalMode };
            }
          } catch {
            // continue parsing
          }
        }
      }
    }
    return { text: accumulated, mode: finalMode };
  } else {
    const data = await res.json();
    return { text: data.text || data.answer || "", mode: data.mode || "demo" };
  }
}

type Tool =
  | "tong-quan"
  | "hoi-dap"
  | "tao-hop-dong"
  | "review"
  | "so-sanh"
  | "ho-so"
  | "tep";
type ToolResponse = { text?: string; mode?: "ai" | "demo"; error?: string };
type ChatMessage = {
  role: "user" | "assistant";
  text: string;
  citationSourceIds?: string[];
};

function relatesToWallet(text: string) {
  const normalized = text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
  return /vi dien tu|e-wallet|trung gian thanh toan|api|webhook|kyc|aml|doi soat|tai khoan bao dam/.test(
    normalized,
  );
}

const toolMeta: Record<Tool, [string, string]> = {
  "tong-quan": [
    "Trung tâm pháp lý ví điện tử",
    "Làm việc trực tiếp với bộ hồ sơ sáu chương, hợp đồng và nguồn luật đã chọn lọc.",
  ],
  "hoi-dap": [
    "Hỏi đáp pháp luật",
    "Hỏi các lĩnh vực pháp luật Việt Nam; ví điện tử là kho kiến thức chuyên sâu nhất.",
  ],
  "tao-hop-dong": [
    "Tạo hợp đồng pháp lý",
    "Bắt đầu từ mẫu, mô tả yêu cầu hoặc một văn bản tham khảo.",
  ],
  review: [
    "Review hợp đồng",
    "Nhận diện điều khoản thiếu, rủi ro và phương án sửa trong bối cảnh ví điện tử.",
  ],
  "so-sanh": [
    "So sánh hợp đồng",
    "Đối chiếu hai phiên bản và đánh giá thay đổi làm tăng hay giảm rủi ro.",
  ],
  "ho-so": [
    "Bộ hồ sơ sáu chương",
    "Theo dõi tài liệu tối thiểu, tài liệu bổ sung và căn cứ của dự án.",
  ],
  tep: [
    "Quản lý tệp trong phiên",
    "Tệp không được lưu vào tài khoản hoặc cơ sở dữ liệu của website.",
  ],
};

function ToolHeader({ tool }: { tool: Tool }) {
  const [title, description] = toolMeta[tool];
  return (
    <header className="tool-header">
      <div>
        <span className="tool-kicker">THỊNH VƯỢNG LEGAL · DEMO</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      <div className="header-actions flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() =>
            window.dispatchEvent(new CustomEvent("tv:open-ai-settings"))
          }
          className="ai-status-pill group flex items-center gap-2.5 px-3.5 py-2 bg-white border border-[#ccd4d1] hover:border-[#0c665f] transition cursor-pointer shadow-xs"
          title="Bấm để kiểm tra kết nối API & cấu hình khóa AI"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
          </span>
          <span className="flex flex-col text-left">
            <strong className="text-xs font-bold text-[#071b2e] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#c89b51]" />
              <span>Gemini 3.6 AI</span>
            </strong>
            <small className="text-[10px] text-emerald-700 font-medium">
              Đã kết nối API
            </small>
          </span>
          <span className="ml-1 px-1.5 py-0.5 rounded bg-[#f3f6f5] group-hover:bg-[#edf3f2] text-slate-500 group-hover:text-[#0c665f] text-[10px] font-semibold flex items-center gap-1 border border-slate-200">
            <Key className="w-3 h-3 text-[#c89b51]" />
            <span>Khóa AI</span>
          </span>
        </button>

        <div className="privacy-pill">
          <LockKeyhole />
          <span>
            <strong>Không lưu hồ sơ</strong>
            <small>Dữ liệu xóa khi kết thúc phiên</small>
          </span>
        </div>
      </div>
    </header>
  );
}

function DocumentPicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value?: DemoFile;
  onChange: (file: DemoFile) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { addFile } = useDemoSession();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function pick(file?: File) {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const parsed = await readLegalDocument(file);
      addFile(parsed);
      onChange(parsed);
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : "Không đọc được tệp.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="document-picker">
      <span className="document-picker-label">{label}</span>
      <input
        ref={inputRef}
        className="sr-only"
        type="file"
        accept=".pdf,.docx"
        onChange={(event) => pick(event.target.files?.[0])}
      />
      <button
        type="button"
        className="drop-zone"
        onClick={() => inputRef.current?.click()}
      >
        {busy ? (
          <LoaderCircle className="spin" />
        ) : value ? (
          <FileSearch />
        ) : (
          <UploadCloud />
        )}
        <strong>
          {busy ? "Đang đọc tệp…" : value?.name || "Chọn PDF hoặc DOCX"}
        </strong>
        <span>
          {value
            ? `${formatFileSize(value.size)} · đã đọc ${value.text.length.toLocaleString("vi-VN")} ký tự`
            : "Tối đa 20 MB · nội dung xử lý tạm thời"}
        </span>
      </button>
      <div className="flex items-center justify-between text-xs mt-1.5 px-0.5">
        <button
          type="button"
          onClick={() => {
            const isCompareRight = label.toLowerCase().includes("so sánh") || label.toLowerCase().includes("bản b");
            const sampleDoc: DemoFile = {
              id: `sample-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
              name: isCompareRight ? SAMPLE_COMPARE_V2.name : SAMPLE_CONTRACT_DOCX.name,
              format: "docx",
              size: (isCompareRight ? SAMPLE_COMPARE_V2.text : SAMPLE_CONTRACT_DOCX.text).length,
              addedAt: new Date().toISOString(),
              text: isCompareRight ? SAMPLE_COMPARE_V2.text : SAMPLE_CONTRACT_DOCX.text,
            };
            addFile(sampleDoc);
            onChange(sampleDoc);
            setError("");
          }}
          className="text-[#0c665f] hover:text-[#071b2e] font-semibold underline cursor-pointer inline-flex items-center gap-1"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#c89b51]" />
          <span>Dùng văn bản mẫu sẵn</span>
        </button>
        {value && (
          <button
            type="button"
            onClick={() => {
              onChange(undefined as any);
            }}
            className="text-slate-400 hover:text-red-600 cursor-pointer text-[11px]"
          >
            Đổi tệp
          </button>
        )}
      </div>
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}

function SourceSelector({
  selected,
  setSelected,
}: {
  selected: string[];
  setSelected: (value: string[]) => void;
}) {
  return (
    <details className="source-selector">
      <summary>
        <ShieldCheck /> Nguồn luật áp dụng <span>{selected.length}/10</span>
      </summary>
      <div className="source-selector-list">
        {platformSources.map((source) => (
          <label key={source.id}>
            <input
              aria-label={source.title}
              type="checkbox"
              checked={selected.includes(source.id)}
              onChange={(event) => {
                if (event.target.checked && selected.length >= 10) return;
                setSelected(
                  event.target.checked
                    ? [...selected, source.id]
                    : selected.filter((id) => id !== source.id),
                );
              }}
            />
            <span>
              <strong>{source.title}</strong>
              <small>
                {source.status} · kiểm tra {source.lastChecked}
              </small>
            </span>
          </label>
        ))}
      </div>
    </details>
  );
}

function Dashboard() {
  const tools = [
    [
      "Hỏi đáp theo nguồn",
      "Chọn luật và hỏi trong bộ hồ sơ ví điện tử.",
      "/cong-cu/hoi-dap",
      Bot,
    ],
    [
      "Tạo hợp đồng",
      "Dùng 20 mẫu hoặc mô tả yêu cầu riêng.",
      "/cong-cu/tao-hop-dong",
      FileSignature,
    ],
    [
      "Review hợp đồng",
      "Phân loại đỏ, vàng, xanh và đề xuất sửa.",
      "/cong-cu/review",
      ClipboardCheck,
    ],
    [
      "So sánh phiên bản",
      "Đọc khác biệt nguyên văn và tác động pháp lý.",
      "/cong-cu/so-sanh",
      GitCompareArrows,
    ],
    [
      "Hồ sơ sáu chương",
      "Đi từ mô hình đến xử lý sự cố.",
      "/cong-cu/ho-so",
      FolderKanban,
    ],
    [
      "Quản lý tệp",
      "Dùng lại tài liệu trong phiên hiện tại.",
      "/cong-cu/tep",
      Files,
    ],
  ] as const;
  return (
    <>
      <ToolHeader tool="tong-quan" />

      {/* AI Connection Banner */}
      <section className="ai-connection-banner my-4 p-4.5 bg-gradient-to-r from-[#FFFDF8] via-[#FAF3DE] to-[#F5E5BA] text-[#0A131E] border-1.5 border-[rgba(197,155,39,0.45)] border-l-4 border-l-[#c59b27] shadow-md flex flex-wrap items-center justify-between gap-4 rounded-md">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-sm bg-gradient-to-br from-[#FFFDF7] to-[#FAF1D7] flex items-center justify-center text-[#8C6B18] border border-[rgba(197,155,39,0.4)] shadow-xs shrink-0">
            <Sparkles className="w-5 h-5 text-[#8C6B18]" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-sm font-bold text-[#0A131E] tracking-wide">
                Google Gemini 3.6 AI Đã Kết Nối Trực Tuyến
              </h2>
              <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-xs bg-[#EBF7EE] text-[#1E7E34] border border-[#A3D9A5] flex items-center gap-1.5 shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#28A745] animate-pulse"></span>
                Active API
              </span>
            </div>
            <p className="text-xs text-[#556070] mt-0.5">
              Tất cả 4 công cụ (Hỏi đáp, Soạn hợp đồng, Rà soát bẫy điều khoản, So sánh phiên bản) đang hoạt động với mô hình{" "}
              <code className="text-[#7D5D0D] font-mono text-[11px] bg-[#FAF1D7] border border-[rgba(197,155,39,0.35)] px-1.5 py-0.5 rounded font-semibold">
                gemini-3.6-flash
              </code>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() =>
              window.dispatchEvent(new CustomEvent("tv:open-ai-settings"))
            }
            className="px-4 py-2.5 bg-gradient-to-r from-[#D4AF37] via-[#F7EBB8] to-[#C59B27] hover:opacity-95 text-[#2A1F04] font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs rounded-xs border border-[rgba(197,155,39,0.5)]"
          >
            <Key className="w-3.5 h-3.5 text-[#2A1F04]" />
            <span>Kiểm tra &amp; Cấu hình Khóa AI</span>
          </button>
        </div>
      </section>

      <section className="platform-stats">
        <div>
          <strong>{platformStats.chapters}</strong>
          <span>chương dịch vụ</span>
        </div>
        <div>
          <strong>{platformStats.contracts}</strong>
          <span>hợp đồng và hồ sơ</span>
        </div>
        <div>
          <strong>{platformStats.sources}</strong>
          <span>nguồn chính thức</span>
        </div>
        <div>
          <strong>{platformStats.minimum}</strong>
          <span>tài liệu tối thiểu (*)</span>
        </div>
      </section>
      <section className="tool-grid">
        {tools.map(([title, description, href, Icon]) => (
          <Link href={href} className="tool-card" key={href}>
            <span>
              <Icon />
            </span>
            <h2>{title}</h2>
            <p>{description}</p>
            <strong>
              Mở công cụ <ArrowRight />
            </strong>
          </Link>
        ))}
      </section>
      <section className="workspace-preview">
        <div>
          <span className="tool-kicker">KHÔNG GIAN MẪU</span>
          <h2>Bộ hồ sơ pháp lý doanh nghiệp ví điện tử</h2>
          <p>
            Sáu chương được nối với 20 hợp đồng, chính sách và quy trình từ báo
            cáo tổng hợp.
          </p>
        </div>
        <Link href="/cong-cu/ho-so">
          Mở hồ sơ <ArrowRight />
        </Link>
      </section>
    </>
  );
}

function FullChat() {
  const { files } = useDemoSession();
  const { name, ready, remember } = useCustomerName();
  const [nameInput, setNameInput] = useState("");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [fileId, setFileId] = useState("");
  const [consent, setConsent] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [responseMode, setResponseMode] = useState<"ai" | "demo" | "">("");
  const [selectedSources, setSelectedSources] = useState(
    platformSources.slice(0, 4).map((x) => x.id),
  );
  const selectedFile = files.find((file) => file.id === fileId);

  async function submit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!input.trim() || pending) return;
    if (selectedFile && !consent) {
      setError("Cần xác nhận trước khi gửi nội dung tệp tới AI.");
      return;
    }
    const question = input.trim();
    const walletContext = relatesToWallet(
      `${question}\n${selectedFile?.text.slice(0, 2000) || ""}`,
    );
    const citationSourceIds = walletContext ? [...selectedSources] : [];
    setMessages((old) => [...old, { role: "user", text: question }]);
    setInput("");
    setPending(true);
    setError("");
    setMessages((old) => [
      ...old,
      { role: "assistant", text: "", citationSourceIds },
    ]);
    try {
      const res = await streamSSEFetch(
        "/api/legal-assistant",
        {
          message: question,
          selectedText: selectedFile?.text,
          sources: citationSourceIds,
          customerName: name,
        },
        (chunkText, mode) => {
          setResponseMode(mode);
          setMessages((old) =>
            old.map((item, index) =>
              index === old.length - 1 ? { ...item, text: chunkText } : item,
            ),
          );
        }
      );
      setResponseMode(res.mode);
      setMessages((old) =>
        old.map((item, index) =>
          index === old.length - 1 ? { ...item, text: res.text } : item,
        ),
      );
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Có lỗi khi hỏi AI.");
      setMessages((old) => old.filter((item) => item.text));
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <ToolHeader tool="hoi-dap" />
      {ready && !name && (
        <section className="customer-name-gate">
          <span className="demo-avatar">TV</span>
          <div>
            <span className="tool-kicker">LẦN ĐẦU GẶP BẠN</span>
            <h2>Chúng tôi nên gọi bạn là gì?</h2>
            <p>
              Tên gọi được lưu trên trình duyệt này để trợ lý ghi nhớ ở lần sau.
              Không cần tài khoản.
            </p>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                remember(nameInput);
              }}
            >
              <input
                value={nameInput}
                maxLength={60}
                onChange={(event) => setNameInput(event.target.value)}
                placeholder="Nhập tên của bạn"
                aria-label="Tên khách hàng"
              />
              <button disabled={!nameInput.trim()}>
                Ghi nhớ tên <ArrowRight />
              </button>
            </form>
          </div>
        </section>
      )}
      <div className="chat-workspace">
        <section className="chat-panel">
          <div className="chat-messages">
            {!messages.length && (
              <div className="chat-empty">
                <Bot />
                <h2>
                  {name
                    ? `Chào ${name}, bạn cần làm rõ vấn đề nào?`
                    : "Bạn cần làm rõ vấn đề nào?"}
                </h2>
                <p>
                  Trợ lý giải thích pháp luật Việt Nam bằng văn phong luật học
                  dễ hiểu; ví điện tử là lĩnh vực có dữ liệu chuyên sâu.
                </p>
                <div>
                  {sampleQuestions.map((q) => (
                    <button type="button" key={q} onClick={() => setInput(q)}>
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((message, index) => (
              <article
                className={`chat-bubble ${message.role}`}
                key={`${message.role}-${index}`}
              >
                {message.text ? (
                  message.role === "assistant" ? (
                    <FormattedLegalText content={message.text} />
                  ) : (
                    <p>{message.text}</p>
                  )
                ) : (
                  <LoaderCircle className="spin" />
                )}
                {message.role === "assistant" &&
                  message.text &&
                  Boolean(message.citationSourceIds?.length) && (
                    <div className="chat-citations">
                      <strong>Nguồn đang áp dụng</strong>
                      {platformSources
                        .filter((source) =>
                          message.citationSourceIds?.includes(source.id),
                        )
                        .map((source) => (
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noreferrer"
                            key={source.id}
                          >
                            {source.title}
                            <ExternalLink />
                          </a>
                        ))}
                    </div>
                  )}
              </article>
            ))}
          </div>
          <form className="full-chat-form" onSubmit={submit}>
            <textarea
              maxLength={5000}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Nhập câu hỏi pháp luật của bạn…"
              disabled={!name}
            />
            <div className="chat-form-row">
              <select
                value={fileId}
                onChange={(event) => {
                  setFileId(event.target.value);
                  setConsent(false);
                }}
              >
                <option value="">Không dùng tệp</option>
                {files.map((file) => (
                  <option value={file.id} key={file.id}>
                    @ {file.name}
                  </option>
                ))}
              </select>
              <button disabled={!name || pending || !input.trim()}>
                {pending ? <LoaderCircle className="spin" /> : <ArrowRight />}{" "}
                Gửi câu hỏi
              </button>
            </div>
            {selectedFile && (
              <label className="consent-line">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                />{" "}
                Tôi đồng ý gửi tạm nội dung tệp này tới dịch vụ AI để phân tích;
                website không lưu hồ sơ.
              </label>
            )}
            {error && <p className="field-error">{error}</p>}
          </form>
        </section>
        <aside className="chat-sources">
          {responseMode && (
            <div className={`assistant-status ${responseMode}`}>
              <span>
                {responseMode === "ai"
                  ? "AI đang hoạt động"
                  : "Chế độ dữ liệu mẫu"}
              </span>
              <small>
                {responseMode === "ai"
                  ? "Yêu cầu dùng chế độ không lưu"
                  : "Chưa có khóa AI trong môi trường này"}
              </small>
            </div>
          )}
          <SourceSelector
            selected={selectedSources}
            setSelected={setSelectedSources}
          />
          <Link href="/cong-cu/tep">
            <FilePlus2 /> Thêm tệp vào phiên
          </Link>
          <div className="legal-boundary">
            <ShieldCheck />
            <p>
              Phản hồi phục vụ học tập và chuẩn bị hồ sơ; không phải ý kiến pháp
              lý cho vụ việc cụ thể.
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}

function DraftTool() {
  const { files } = useDemoSession();
  const [mode, setMode] = useState<"describe" | "edit">(
    "describe",
  );
  const [contractSlug, setContractSlug] = useState("tich-hop-api-vi-dien-tu");
  const [description, setDescription] = useState("");
  const [fileId, setFileId] = useState("");
  const [consent, setConsent] = useState(false);
  const [result, setResult] = useState("");
  const [aiMode, setAiMode] = useState<"ai" | "demo" | "">("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    const requestedSlug = new URLSearchParams(window.location.search).get("mau");
    if (requestedSlug && contracts.some((item) => item.slug === requestedSlug)) {
      setContractSlug(requestedSlug);
    }
  }, []);
  const selected =
    contracts.find((item) => item.slug === contractSlug) || contracts[0];
  const selectedFile = files.find((item) => item.id === fileId);
  async function generate() {
    if (selectedFile && !consent) {
      setError("Cần xác nhận trước khi gửi nội dung tệp tới AI.");
      return;
    }
    setPending(true);
    setError("");
    setResult("");
    setAiMode("");
    try {
      const res = await streamSSEFetch(
        "/api/contract-draft",
        {
          description,
          referenceText: selectedFile?.text,
          contractSlug,
        },
        (chunkText, mode) => {
          setResult(chunkText);
          setAiMode(mode);
        }
      );
      setResult(res.text);
      setAiMode(res.mode);
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : "Không thể tạo dự thảo.",
      );
    } finally {
      setPending(false);
    }
  }
  return (
    <>
      <ToolHeader tool="tao-hop-dong" />
      <div className="mode-tabs" role="tablist">
        {(
          [
            ["describe", "Tạo từ yêu cầu"],
            ["edit", "Sửa bản sẵn"],
          ] as const
        ).map(([id, label]) => (
          <button
            role="tab"
            aria-selected={mode === id}
            className={mode === id ? "active" : ""}
            key={id}
            onClick={() => {
              setMode(id);
              setResult("");
            }}
          >
            {label}
          </button>
        ))}
      </div>
      <section className="draft-workspace">
        <div className="draft-form">
          <label>
            Loại hợp đồng
            <select
              value={contractSlug}
              onChange={(e) => setContractSlug(e.target.value)}
            >
              {contracts.map((item) => (
                <option value={item.slug} key={item.slug}>
                  {item.title}
                </option>
              ))}
            </select>
          </label>
          {mode === "edit" && (
            <label>
              Tệp đã thêm
              <select
                value={fileId}
                onChange={(e) => {
                  setFileId(e.target.value);
                  setConsent(false);
                }}
              >
                <option value="">Chọn tệp trong phiên</option>
                {files.map((file) => (
                  <option value={file.id} key={file.id}>
                    {file.name}
                  </option>
                ))}
              </select>
            </label>
          )}
          <label>
            Yêu cầu
            <textarea
              value={description}
              maxLength={5000}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={
                mode === "edit"
                  ? "Ví dụ: giữ nguyên cách hành văn, sửa phạm vi dịch vụ API…"
                  : "Mô tả chủ thể, mục tiêu, phạm vi và yêu cầu đặc biệt…"
              }
            />
          </label>
          {selectedFile && (
            <label className="consent-line">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
              />{" "}
              Tôi đồng ý gửi tạm nội dung tệp tới AI.
            </label>
          )}
          <button
            className="platform-primary"
            type="button"
            disabled={pending}
            onClick={generate}
          >
            {pending ? <LoaderCircle className="spin" /> : <Bot />} Tạo dự
            thảo
          </button>
          {error && <p className="field-error">{error}</p>}
        </div>
        <div className="result-document">
          {result || pending ? (
            <>
              <div className="result-toolbar">
                <span className={`mode-badge ${pending ? "pending" : aiMode}`}>
                  {pending
                    ? "Đang soạn thảo trực tiếp..."
                    : aiMode === "ai"
                    ? "AI đang hoạt động"
                    : "Chế độ dữ liệu mẫu"}
                </span>
                <button
                  disabled={pending || !result}
                  onClick={() =>
                    downloadLegalDocx(selected.shortTitle, result)
                  }
                >
                  <Download /> Tải DOCX
                </button>
              </div>
              <div className="legal-doc-view">
                <FormattedLegalDocument content={result} isStreaming={pending} />
              </div>
            </>
          ) : (
            <div className="result-empty">
              <FileSignature />
              <h2>Dự thảo sẽ xuất hiện tại đây</h2>
              <p>
                Thông tin chưa có sẽ được để trong ngoặc vuông để tiếp tục xác
                nhận.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function ReviewTool() {
  const { addFile } = useDemoSession();
  const [file, setFile] = useState<DemoFile>();
  const [consent, setConsent] = useState(true);
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState("");
  const [mode, setMode] = useState("");
  const [error, setError] = useState("");
  const [sources, setSources] = useState(
    platformSources.slice(0, 4).map((x) => x.id),
  );

  async function review(targetFile?: DemoFile) {
    const fileToReview = targetFile || file;
    if (!fileToReview) {
      setError("Hãy chọn tệp từ máy tính hoặc bấm 'Nạp hợp đồng mẫu thử nghiệm'.");
      return;
    }
    setPending(true);
    setError("");
    setResult("");
    setMode("");
    try {
      const res = await streamSSEFetch(
        "/api/contract-review",
        {
          text: fileToReview.text,
          fileName: fileToReview.name,
          sources: platformSources
            .filter((x) => sources.includes(x.id))
            .map((x) => x.title),
        },
        (chunkText, chunkMode) => {
          setResult(chunkText);
          setMode(chunkMode);
        }
      );
      setResult(res.text);
      setMode(res.mode);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Không thể review.");
    } finally {
      setPending(false);
    }
  }

  function loadSampleAndReview() {
    const sample: DemoFile = {
      id: `sample-rev-${Date.now()}`,
      name: SAMPLE_CONTRACT_DOCX.name,
      format: "docx",
      size: SAMPLE_CONTRACT_DOCX.text.length,
      addedAt: new Date().toISOString(),
      text: SAMPLE_CONTRACT_DOCX.text,
    };
    addFile(sample);
    setFile(sample);
    setConsent(true);
    setError("");
    review(sample);
  }

  return (
    <>
      <ToolHeader tool="review" />
      <div className="analysis-layout">
        <section className="analysis-input">
          <div className="bg-[#f0f6f5] border border-[#c89b51]/40 p-3 mb-4 rounded flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
            <div className="flex items-center gap-2 text-[#071b2e] font-medium">
              <Sparkles className="w-4 h-4 text-[#c89b51] shrink-0" />
              <span>Chưa có tệp trên máy? Nạp hợp đồng mẫu chuẩn Fintech 2026.</span>
            </div>
            <button
              type="button"
              onClick={loadSampleAndReview}
              className="px-3 py-1.5 bg-[#071b2e] text-[#e7c487] hover:bg-[#0c665f] hover:text-white font-bold transition rounded shadow-xs cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
            >
              <ClipboardCheck className="w-3.5 h-3.5" />
              <span>⚡ Rà soát hợp đồng mẫu</span>
            </button>
          </div>

          <DocumentPicker
            label="Hợp đồng cần review"
            value={file}
            onChange={(value) => {
              setFile(value);
              setConsent(true);
              setError("");
              setResult("");
            }}
          />
          <SourceSelector selected={sources} setSelected={setSources} />
          <label className="consent-line">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
            />{" "}
            Tôi đồng ý gửi tạm nội dung đã trích xuất tới AI; website không lưu tệp.
          </label>
          <button
            className="platform-primary"
            disabled={pending}
            onClick={() => review()}
          >
            {pending ? <LoaderCircle className="spin" /> : <ClipboardCheck />}{" "}
            Bắt đầu review
          </button>
          {error && <p className="field-error">{error}</p>}
          <details className="review-playbook">
            <summary>Tiêu chí rà soát</summary>
            <ol>
              {reviewPlaybook.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </details>
        </section>
        <section className="analysis-result">
          {result || pending ? (
            <>
              <div className="result-toolbar">
                <span className={`mode-badge ${pending ? "pending" : mode}`}>
                  {pending
                    ? "Đang rà soát và phân tích..."
                    : mode === "ai"
                    ? "AI đang hoạt động"
                    : "Chế độ dữ liệu mẫu"}
                </span>
                <button
                  disabled={pending || !result}
                  onClick={() =>
                    downloadLegalDocx(
                      `Bao-cao-review-${file?.name || "hop-dong"}`,
                      result,
                    )
                  }
                >
                  <Download />
                  Tải báo cáo
                </button>
              </div>
              <div className="legal-doc-view">
                <FormattedLegalDocument content={result} isStreaming={pending} />
              </div>
            </>
          ) : (
            <div className="result-empty">
              <ClipboardCheck />
              <h2>Chưa có kết quả review</h2>
              <p>
                Kết quả sẽ phân nhóm đỏ, vàng, xanh và nêu thông tin còn thiếu.
              </p>
            </div>
          )}
        </section>
      </div>
    </>
  );
}

function CompareTool() {
  const { addFile } = useDemoSession();
  const [left, setLeft] = useState<DemoFile>();
  const [right, setRight] = useState<DemoFile>();
  const [consent, setConsent] = useState(true);
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState("");
  const [mode, setMode] = useState("");
  const [error, setError] = useState("");

  async function compare(customLeft?: DemoFile, customRight?: DemoFile) {
    const fileA = customLeft || left;
    const fileB = customRight || right;
    if (!fileA || !fileB) {
      setError("Cần chọn đủ hai văn bản trước khi so sánh hoặc bấm 'Nạp 2 bản mẫu đối chiếu ngay'.");
      return;
    }
    setPending(true);
    setError("");
    setResult("");
    setMode("");
    try {
      const res = await streamSSEFetch(
        "/api/contract-compare",
        {
          left: fileA.text,
          right: fileB.text,
          leftName: fileA.name,
          rightName: fileB.name,
        },
        (chunkText, chunkMode) => {
          setResult(chunkText);
          setMode(chunkMode);
        }
      );
      setResult(res.text);
      setMode(res.mode);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Không thể so sánh.");
    } finally {
      setPending(false);
    }
  }

  function loadSampleAndCompare() {
    const v1: DemoFile = {
      id: `sample-v1-${Date.now()}`,
      name: SAMPLE_COMPARE_V1.name,
      format: "docx",
      size: SAMPLE_COMPARE_V1.text.length,
      addedAt: new Date().toISOString(),
      text: SAMPLE_COMPARE_V1.text,
    };
    const v2: DemoFile = {
      id: `sample-v2-${Date.now()}`,
      name: SAMPLE_COMPARE_V2.name,
      format: "docx",
      size: SAMPLE_COMPARE_V2.text.length,
      addedAt: new Date().toISOString(),
      text: SAMPLE_COMPARE_V2.text,
    };
    addFile(v1);
    addFile(v2);
    setLeft(v1);
    setRight(v2);
    setConsent(true);
    setError("");
    compare(v1, v2);
  }

  return (
    <>
      <ToolHeader tool="so-sanh" />

      {/* Quick Test Demo Bar */}
      <div className="bg-[#f0f6f5] border border-[#c89b51]/40 p-3 mb-5 rounded flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-[#071b2e] font-medium">
          <Sparkles className="w-4 h-4 text-[#c89b51] shrink-0" />
          <span>Chưa có sẵn 2 tệp? Nạp ngay 2 phiên bản mẫu (V1 gốc vs V2 đối tác sửa đổi) để xem AI đối chiếu trực tiếp.</span>
        </div>
        <button
          type="button"
          onClick={loadSampleAndCompare}
          className="px-3.5 py-2 bg-[#071b2e] text-[#e7c487] hover:bg-[#0c665f] hover:text-white font-bold transition rounded shadow-xs cursor-pointer flex items-center justify-center gap-2 shrink-0"
        >
          <GitCompareArrows className="w-4 h-4" />
          <span>⚡ Đối chiếu 2 bản mẫu ngay</span>
        </button>
      </div>

      <section className="compare-inputs">
        <DocumentPicker label="Hợp đồng gốc (Bản A)" value={left} onChange={setLeft} />
        <div className="compare-mark">VS</div>
        <DocumentPicker
          label="Hợp đồng so sánh (Bản B)"
          value={right}
          onChange={setRight}
        />
      </section>
      <div className="compare-actions">
        <label className="consent-line">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
          />{" "}
          Tôi đồng ý gửi tạm nội dung hai tệp tới AI; website không lưu tệp.
        </label>
        <button
          className="platform-primary"
          disabled={pending}
          onClick={() => compare()}
        >
          {pending ? <LoaderCircle className="spin" /> : <GitCompareArrows />}{" "}
          So sánh hai bản
        </button>
        {error && <p className="field-error">{error}</p>}
      </div>
      <section className="analysis-result compare-result">
        {result || pending ? (
          <>
            <div className="result-toolbar">
              <span className={`mode-badge ${pending ? "pending" : mode}`}>
                {pending
                  ? "Đang đối chiếu và phân tích..."
                  : mode === "ai"
                  ? "AI đang hoạt động"
                  : "Chế độ dữ liệu mẫu"}
              </span>
              <button
                disabled={pending || !result}
                onClick={() =>
                  downloadLegalDocx("Bao-cao-so-sanh-hop-dong", result)
                }
              >
                <Download />
                Tải báo cáo
              </button>
            </div>
            <div className="legal-doc-view">
              <FormattedLegalDocument content={result} isStreaming={pending} />
            </div>
          </>
        ) : (
          <div className="result-empty">
            <GitCompareArrows />
            <h2>Chưa có kết quả so sánh</h2>
            <p>
              Hệ thống sẽ chỉ ra nội dung thêm, bỏ, sửa và tác động tới rủi ro.
            </p>
          </div>
        )}
      </section>
    </>
  );
}

function WorkspaceTool() {
  const [query, setQuery] = useState("");
  const filtered = demoChapters
    .map((chapter) => ({
      ...chapter,
      documents: chapter.documents.filter((item) =>
        `${item.title} ${item.summary}`
          .toLocaleLowerCase("vi")
          .includes(query.toLocaleLowerCase("vi")),
      ),
    }))
    .filter((chapter) => !query || chapter.documents.length);
  return (
    <>
      <ToolHeader tool="ho-so" />
      <div className="workspace-toolbar">
        <label>
          <Search />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm hợp đồng, quy trình hoặc chính sách…"
          />
        </label>
        <span>
          {demoChapters.length} chương · {contracts.length} tài liệu
        </span>
      </div>
      <section className="chapter-list">
        {filtered.map((chapter) => (
          <details key={chapter.id} open={chapter.number === 4}>
            <summary>
              <span>{String(chapter.number).padStart(2, "0")}</span>
              <div>
                <h2>
                  Chương {chapter.number}. {chapter.title}
                  {chapter.minimum ? " (*)" : ""}
                </h2>
                <p>{chapter.description}</p>
              </div>
              <strong>{chapter.documents.length} tài liệu</strong>
            </summary>
            <div className="chapter-documents">
              {chapter.documents.length ? (
                chapter.documents.map((item) => (
                  <Link href={`/hop-dong/${item.slug}`} key={item.slug}>
                    <span
                      className={`tier ${item.minimum ? "minimum" : "advanced"}`}
                    >
                      {item.minimum ? "Tối thiểu (*)" : "Bổ sung"}
                    </span>
                    <h3>{item.title}</h3>
                    <p>{item.summary}</p>
                    <strong>
                      Xem nội dung <ArrowRight />
                    </strong>
                  </Link>
                ))
              ) : (
                <div className="chapter-empty">
                  Nội dung chương được trình bày trong báo cáo tổng hợp.
                </div>
              )}
            </div>
          </details>
        ))}
      </section>
    </>
  );
}

function FilesTool() {
  const { files, removeFile } = useDemoSession();
  const [picked, setPicked] = useState<DemoFile>();
  const [query, setQuery] = useState("");
  const filtered = files.filter((file) =>
    file.name.toLocaleLowerCase("vi").includes(query.toLocaleLowerCase("vi")),
  );
  return (
    <>
      <ToolHeader tool="tep" />
      <div className="file-manager">
        <section>
          <DocumentPicker
            label="Thêm tệp vào phiên"
            value={picked}
            onChange={setPicked}
          />
          <div className="file-search">
            <Search />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm theo tên tệp…"
            />
          </div>
          <div className="file-list">
            {filtered.length ? (
              filtered.map((file) => (
                <div
                  className={`file-row ${picked?.id === file.id ? "active" : ""}`}
                  key={file.id}
                >
                  <button
                    className="file-select"
                    onClick={() => setPicked(file)}
                  >
                    <FileSearch />
                    <span>
                      <strong>{file.name}</strong>
                      <small>
                        {file.format.toUpperCase()} ·{" "}
                        {formatFileSize(file.size)} · {file.addedAt}
                      </small>
                    </span>
                  </button>
                  <button
                    className="file-delete"
                    aria-label={`Xóa ${file.name}`}
                    onClick={() => {
                      removeFile(file.id);
                      if (picked?.id === file.id) setPicked(undefined);
                    }}
                  >
                    <Trash2 />
                  </button>
                </div>
              ))
            ) : (
              <div className="result-empty compact">
                <Files />
                <h2>Chưa có tệp nào</h2>
                <p>
                  Tệp PDF hoặc DOCX sẽ xuất hiện ở đây trong phiên hiện tại.
                </p>
              </div>
            )}
          </div>
        </section>
        <aside className="file-preview">
          {picked ? (
            <>
              <div>
                <strong>{picked.name}</strong>
                <span>
                  {picked.text.length.toLocaleString("vi-VN")} ký tự đã trích
                  xuất
                </span>
              </div>
              <pre>{picked.text.slice(0, 12000)}</pre>
            </>
          ) : (
            <div className="result-empty">
              <FileSearch />
              <h2>Xem trước nội dung</h2>
              <p>Chọn một tệp để kiểm tra phần chữ đã trích xuất.</p>
            </div>
          )}
        </aside>
      </div>
    </>
  );
}

export function LegalPlatform({ tool }: { tool: Tool }) {
  const [aiModalOpen, setAiModalOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => setAiModalOpen(true);
    window.addEventListener("tv:open-ai-settings", handleOpen);
    return () => window.removeEventListener("tv:open-ai-settings", handleOpen);
  }, []);

  return (
    <main className="platform-content">
      {tool === "tong-quan" ? (
        <Dashboard />
      ) : tool === "hoi-dap" ? (
        <FullChat />
      ) : tool === "tao-hop-dong" ? (
        <DraftTool />
      ) : tool === "review" ? (
        <ReviewTool />
      ) : tool === "so-sanh" ? (
        <CompareTool />
      ) : tool === "ho-so" ? (
        <WorkspaceTool />
      ) : (
        <FilesTool />
      )}
      <AiConfigModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
      />
    </main>
  );
}
