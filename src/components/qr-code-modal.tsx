import { useEffect, useState, useRef } from 'react';
import QRCode from 'qrcode';
import { Check, Copy, Download, ExternalLink, QrCode as QrIcon, Smartphone, X } from 'lucide-react';

interface QrProps {
  url?: string;
  size?: number;
  className?: string;
}

export function QrCodeImage({ url, size = 180, className = '' }: QrProps) {
  const [dataUrl, setDataUrl] = useState<string>('');
  const targetUrl = url || (typeof window !== 'undefined' ? window.location.href : 'https://thinhvuonglegal.vn');

  useEffect(() => {
    let isMounted = true;
    QRCode.toDataURL(targetUrl, {
      width: size * 2, // High resolution for crisp rendering
      margin: 1.5,
      color: {
        dark: '#071b2e', // Brand dark blue
        light: '#ffffff',
      },
      errorCorrectionLevel: 'M',
    })
      .then((url) => {
        if (isMounted) setDataUrl(url);
      })
      .catch((err) => {
        console.error('Error generating QR code:', err);
      });
    return () => {
      isMounted = false;
    };
  }, [targetUrl, size]);

  if (!dataUrl) {
    return (
      <div
        style={{ width: size, height: size }}
        className={`flex items-center justify-center bg-white border border-[#c89b51]/40 animate-pulse text-xs text-slate-400 ${className}`}
      >
        <QrIcon className="w-8 h-8 text-[#c89b51]/50 animate-spin" />
      </div>
    );
  }

  return (
    <div className={`p-2 bg-white rounded-xs border-2 border-[#c89b51] shadow-md inline-block ${className}`}>
      <img
        src={dataUrl}
        alt="Mã QR Website Thịnh Vượng Legal"
        width={size}
        height={size}
        className="block"
        loading="lazy"
      />
    </div>
  );
}

export function QrCodeModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleDownload = () => {
    QRCode.toDataURL(currentUrl, {
      width: 600,
      margin: 2,
      color: {
        dark: '#071b2e',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'H',
    }).then((data) => {
      const a = document.createElement('a');
      a.href = data;
      a.download = 'thinh-vuong-legal-qr.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="qr-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-[#071b2e] text-white border-2 border-[#c89b51] shadow-2xl p-6 md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Đóng cửa sổ mã QR"
          className="absolute top-4 right-4 text-slate-400 hover:text-[#e7c487] p-1 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0c665f]/30 border border-[#0c665f] text-[#e7c487] text-xs font-semibold mb-3">
            <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
            <span>Trải nghiệm di động &amp; Báo cáo đề án</span>
          </div>
          <h3 id="qr-modal-title" className="font-display text-xl font-bold text-white tracking-wide">
            QUÉT MÃ QR TRUY CẬP WEBSITE
          </h3>
          <p className="text-xs text-slate-300 mt-1 max-w-xs mx-auto">
            Dùng Camera điện thoại hoặc Zalo quét mã để mở website trực tiếp trên điện thoại, máy tính bảng
          </p>
        </div>

        {/* QR Display */}
        <div className="flex flex-col items-center justify-center my-4">
          <QrCodeImage url={currentUrl} size={210} />
          <span className="text-[11px] text-[#e7c487] font-mono mt-3 text-center break-all px-4 max-w-full">
            {currentUrl}
          </span>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center justify-center gap-2 px-3 py-2.5 bg-[#0e2a44] hover:bg-[#13395c] border border-[#c89b51]/50 text-[#e7c487] text-xs font-semibold transition cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Đã chép link!' : 'Sao chép liên kết'}</span>
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="flex items-center justify-center gap-2 px-3 py-2.5 bg-[#0c665f] hover:bg-[#107d75] border border-[#0c665f] text-white text-xs font-semibold transition cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Tải ảnh mã QR</span>
          </button>
        </div>

        <div className="mt-4 pt-4 border-t border-white/10 text-center">
          <p className="text-[11px] text-slate-400">
            Hãng luật Thịnh Vượng Legal · Đề án Pháp lý Fintech &amp; Ví điện tử (Nhóm 13)
          </p>
        </div>
      </div>
    </div>
  );
}
