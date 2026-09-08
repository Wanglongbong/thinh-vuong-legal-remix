import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { Check, Copy, Download, QrCode as QrIcon, Smartphone, X } from 'lucide-react';

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
        dark: '#0A131E', // Brand charcoal navy
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
        className={`flex items-center justify-center bg-white border border-[rgba(197,155,39,0.4)] animate-pulse text-xs text-[#8C6B18] ${className}`}
      >
        <QrIcon className="w-8 h-8 text-[#8C6B18]/50 animate-spin" />
      </div>
    );
  }

  return (
    <div className={`p-3 bg-white rounded-xl border-2 border-[rgba(197,155,39,0.5)] shadow-xl inline-block ${className}`}>
      <img
        src={dataUrl}
        alt="Mã QR Website Thịnh Vượng Legal"
        width={size}
        height={size}
        className="block rounded-lg"
        loading="lazy"
      />
    </div>
  );
}

export function QrCodeModal({
  isOpen,
  onClose,
  url,
}: {
  isOpen: boolean;
  onClose: () => void;
  url?: string;
}) {
  const [copied, setCopied] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleDownload = () => {
    QRCode.toDataURL(currentUrl, {
      width: 800,
      margin: 2,
      color: {
        dark: '#0A131E',
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl bg-gradient-to-br from-[#FFFDF8] via-[#FAF3DE] to-[#F5E5BA] text-[#0A131E] border-2 border-[rgba(197,155,39,0.55)] shadow-2xl rounded-2xl p-6 sm:p-8 md:p-10"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          aria-label="Đóng cửa sổ mã QR"
          className="absolute top-4 right-4 text-[#8C6B18] hover:text-[#2A1F04] p-1.5 transition cursor-pointer rounded-full hover:bg-black/5"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#FAF1D7] border border-[rgba(197,155,39,0.4)] text-[#8C6B18] text-xs font-bold rounded-full mb-3 shadow-xs">
            <Smartphone className="w-3.5 h-3.5 text-[#8C6B18]" />
            <span>Trải nghiệm di động &amp; Báo cáo đề án</span>
          </div>
          <h3 id="qr-modal-title" className="font-serif text-2xl font-bold text-[#0A131E] tracking-tight">
            QUÉT MÃ QR TRUY CẬP WEBSITE
          </h3>
          <p className="text-sm text-[#556070] mt-1.5 max-w-md mx-auto leading-relaxed">
            Dùng Camera điện thoại hoặc Zalo quét mã để mở website trực tiếp trên điện thoại, máy tính bảng
          </p>
        </div>

        {/* QR Display */}
        <div className="flex flex-col items-center justify-center my-5">
          <QrCodeImage url={currentUrl} size={280} />
          <span className="text-xs text-[#7D5D0D] font-mono mt-3.5 text-center break-all px-4 py-1.5 bg-white/85 border border-[rgba(197,155,39,0.35)] rounded-lg shadow-xs max-w-full font-medium">
            {currentUrl}
          </span>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-white hover:bg-[#FAF5E8] border-1.5 border-[rgba(197,155,39,0.4)] text-[#7D5D0D] text-xs font-bold transition cursor-pointer shadow-xs rounded-xl"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Đã chép link!' : 'Sao chép liên kết'}</span>
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#D4AF37] via-[#F7EBB8] to-[#C59B27] hover:opacity-95 text-[#2A1F04] text-xs font-bold transition cursor-pointer shadow-md rounded-xl border border-[rgba(197,155,39,0.5)]"
          >
            <Download className="w-4 h-4" />
            <span>Tải ảnh mã QR</span>
          </button>
        </div>

        <div className="mt-5 pt-4 border-t border-[rgba(197,155,39,0.25)] text-center">
          <p className="text-xs text-[#5F6E7C]">
            Hãng luật Thịnh Vượng Legal · Đề án Pháp lý Fintech &amp; Ví điện tử (Nhóm 13)
          </p>
        </div>
      </div>
    </div>
  );
}
