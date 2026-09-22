import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  AlertTriangle,
  Award,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Coins,
  CreditCard,
  FileCheck2,
  FileText,
  HelpCircle,
  Landmark,
  Layers,
  Lock,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  Scale,
  Server,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Sparkles,
  TrendingUp,
  UserCheck,
  Users,
  Volume2,
  VolumeX,
  Zap,
  Clock,
  Ban,
  ArrowRight,
  AlertOctagon,
  Database,
  Cpu,
  RefreshCw,
  Eye,
  Key,
  Globe,
} from 'lucide-react';
import { tvpayOfficialDocs, type OfficialDocumentData } from '@/lib/tvpay-official-docs';
import { uiSound } from '@/lib/ui-sound';

// Họa tiết hoa văn góc hoàng gia mạ vàng nhạt
const RoyalFiligreeCorner = ({ className = '' }: { className?: string }) => (
  <svg
    className={`w-5 h-5 text-amber-500/35 pointer-events-none ${className}`}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.2"
  >
    <path d="M2 2h10a3 3 0 0 1 3 3v0a3 3 0 0 1-3 3H4v8a3 3 0 0 1-3 3v0a3 3 0 0 1-3-3V2z" />
    <path d="M5 5h5a1.5 1.5 0 0 1 1.5 1.5v0a1.5 1.5 0 0 1-1.5 1.5H6.5v3.5" />
    <circle cx="5" cy="5" r="1" fill="currentColor" />
  </svg>
);

// Hoa văn 4 góc màn hình khi ở chế độ Fullscreen
const RoyalScreenCorner = ({ position }: { position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' }) => {
  const rotationClass = {
    'top-left': '',
    'top-right': 'rotate-90',
    'bottom-right': 'rotate-180',
    'bottom-left': '-rotate-90',
  }[position];

  return (
    <svg
      className={`w-14 h-14 sm:w-20 sm:h-20 text-amber-500/25 pointer-events-none absolute z-20 ${rotationClass} ${
        position.includes('top') ? 'top-3' : 'bottom-3'
      } ${position.includes('left') ? 'left-3' : 'right-3'}`}
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
    >
      <path d="M4 4h28a8 8 0 0 1 8 8v0a8 8 0 0 1-8 8H12v20a8 8 0 0 1-8 8v0a8 8 0 0 1-8-8V4z" />
      <path d="M10 10h18a4 4 0 0 1 4 4v0a4 4 0 0 1-4 4H14v14" />
      <circle cx="10" cy="10" r="2.5" fill="currentColor" />
      <circle cx="28" cy="10" r="1.5" fill="currentColor" />
      <circle cx="10" cy="28" r="1.5" fill="currentColor" />
    </svg>
  );
};

// Hoa văn vân sóng bảo an chìm hoàng gia
const RoyalWatermark = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.035] flex items-center justify-center z-0">
    <svg className="w-[720px] h-[720px] text-amber-900" viewBox="0 0 200 200" fill="none" stroke="currentColor">
      <circle cx="100" cy="100" r="92" strokeWidth="1" strokeDasharray="4 4" />
      <circle cx="100" cy="100" r="78" strokeWidth="1.5" />
      <circle cx="100" cy="100" r="62" strokeWidth="0.8" strokeDasharray="2 2" />
      <circle cx="100" cy="100" r="46" strokeWidth="1.2" />
      <circle cx="100" cy="100" r="30" strokeWidth="0.8" />
      <polygon points="100,15 110,85 180,85 125,120 145,185 100,145 55,185 75,120 20,85 90,85" strokeWidth="0.8" />
    </svg>
  </div>
);

interface TvpayPresentationSlidesProps {
  slug: string;
  className?: string;
}

interface SlideItem {
  id: string;
  badge: string;
  category: string;
  title: string;
  subtitle: string;
  renderContent: (docData: OfficialDocumentData) => React.ReactNode;
}

export function TvpayPresentationSlides({ slug, className = '' }: TvpayPresentationSlidesProps) {
  const docData = tvpayOfficialDocs[slug] || tvpayOfficialDocs['dieu-le-cong-ty-co-phan'];
  const isCharter = slug === 'dieu-le-cong-ty-co-phan';

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'forward' | 'backward'>('forward');
  const [soundActive, setSoundActive] = useState(() => uiSound.isEnabled());
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsub = uiSound.subscribe((enabled) => setSoundActive(enabled));
    return () => {
      unsub();
    };
  }, []);

  // =========================================================================
  // BỘ SLIDE 1: ĐIỀU LỆ CÔNG TY CP CUNG ỨNG VÍ ĐIỆN TỬ (06 SLIDES)
  // Xây dựng 100% bám sát nội dung Google Doc 2, không vượt ngoài phạm vi
  // =========================================================================
  const charterSlides: SlideItem[] = [
    // SLIDE 1: MỞ ĐẦU & BẢN CHẤT ĐIỀU LỆ ("BỘ GEN" CỦA CƠ THỂ SỐNG CÔNG TY)
    {
      id: 'charter-1',
      badge: 'SLIDE 01 / 06 · BẢN CHẤT ĐIỀU LỆ',
      category: 'ĐIỀU LỆ CÔNG TY · KHÁI NIỆM & ĐỊNH VỊ CỐT LÕI',
      title: 'ĐIỀU LỆ CÔNG TY: "BỘ GEN" VẬN HÀNH DOANH NGHIỆP',
      subtitle: 'Văn bản pháp lý quan trọng nhất quyết định cách tổ chức, vận hành và quản trị rủi ro công ty',
      renderContent: () => (
        <div className="space-y-4">
          <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-100/90 via-amber-50 to-white rounded-2xl border-2 border-amber-300 shadow-xs">
            <span className="font-mono text-xs uppercase font-bold text-[#8C6B18] tracking-wider block mb-1.5">
              Ẩn dụ cốt lõi từ Kịch bản thuyết trình
            </span>
            <p className="text-base sm:text-lg md:text-xl font-serif text-slate-900 font-bold leading-relaxed m-0 italic">
              "Nếu ví một công ty cổ phần như một cơ thể sống, thì Điều lệ chính là bộ gen quyết định cách cơ thể đó vận hành từ cách các cơ quan phối hợp với nhau, đến cách xử lý khi có khủng hoảng xảy ra."
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 sm:p-5 bg-white/95 rounded-2xl border-2 border-amber-300 shadow-xs relative overflow-hidden flex flex-col justify-between">
              <RoyalFiligreeCorner className="absolute top-2 right-2" />
              <div>
                <div className="flex items-center gap-2 mb-2 text-[#8C6B18]">
                  <Scale className="w-5 h-5 text-amber-700" />
                  <h4 className="text-base sm:text-lg font-bold text-slate-900 m-0">Văn bản pháp lý quan trọng</h4>
                </div>
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed m-0">
                  Điều lệ là văn bản pháp lý bắt buộc và có giá trị cao nhất trong công ty, quy định toàn diện tổ chức và hoạt động của doanh nghiệp.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-amber-200 text-xs sm:text-sm font-semibold text-[#8C6B18]">
                Không chỉ là thủ tục thành lập mà là công cụ bảo vệ DN
              </div>
            </div>

            <div className="p-4 sm:p-5 bg-white/95 rounded-2xl border-2 border-amber-300 shadow-xs relative overflow-hidden flex flex-col justify-between">
              <RoyalFiligreeCorner className="absolute top-2 right-2" />
              <div>
                <div className="flex items-center gap-2 mb-2 text-[#8C6B18]">
                  <FileText className="w-5 h-5 text-amber-700" />
                  <h4 className="text-base sm:text-lg font-bold text-slate-900 m-0">Nội dung chủ yếu gồm:</h4>
                </div>
                <ul className="space-y-1.5 text-sm sm:text-base text-slate-700 m-0 p-0 list-none">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                    <span>Tên công ty và địa chỉ trụ sở chính</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                    <span>Ngành nghề kinh doanh và vốn điều lệ</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                    <span>Thông tin thành viên / cổ đông công ty</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                    <span>Quyền và nghĩa vụ của các bên &amp; cơ cấu quản lý</span>
                  </li>
                </ul>
              </div>
              <div className="mt-3 pt-2 border-t border-amber-200 text-xs sm:text-sm font-semibold text-[#8C6B18]">
                Theo quy chuẩn bắt buộc của Luật Doanh nghiệp
              </div>
            </div>
          </div>
        </div>
      ),
    },

    // SLIDE 2: 04 NGUYÊN TẮC CẦN LƯU Ý KHI SOẠN THẢO ĐIỀU LỆ
    {
      id: 'charter-2',
      badge: 'SLIDE 02 / 06 · NGUYÊN TẮC SOẠN THẢO',
      category: 'ĐIỀU LỆ CÔNG TY · 04 NGUYÊN TẮC VÀNG',
      title: '04 NGUYÊN TẮC CẦN LƯU Ý KHI SOẠN THẢO ĐIỀU LỆ',
      subtitle: 'Tóm gọn trong 4 chữ vàng: "Đúng Luật – Đầy Đủ – Tự Nguyện – Thống Nhất"',
      renderContent: () => (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div className="p-4 sm:p-5 bg-white/95 rounded-2xl border-2 border-amber-300 shadow-xs relative overflow-hidden flex flex-col justify-between">
              <RoyalFiligreeCorner className="absolute top-1.5 right-1.5" />
              <div>
                <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-amber-100 text-[#7A5B10] inline-block mb-2 border border-amber-300">
                  Thứ nhất
                </span>
                <h4 className="text-base sm:text-lg font-bold text-slate-900 m-0 mb-2">ĐÚNG LUẬT</h4>
                <p className="text-sm sm:text-base text-slate-700 m-0 leading-relaxed">
                  Điều lệ phải tuân thủ pháp luật, không được xâm phạm quyền và lợi ích hợp pháp của bên thứ ba.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-amber-200 text-xs sm:text-sm font-semibold text-emerald-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Không trái luật định</span>
              </div>
            </div>

            <div className="p-4 sm:p-5 bg-white/95 rounded-2xl border-2 border-amber-300 shadow-xs relative overflow-hidden flex flex-col justify-between">
              <RoyalFiligreeCorner className="absolute top-1.5 right-1.5" />
              <div>
                <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-amber-100 text-[#7A5B10] inline-block mb-2 border border-amber-300">
                  Thứ hai
                </span>
                <h4 className="text-base sm:text-lg font-bold text-slate-900 m-0 mb-2">ĐẦY ĐỦ</h4>
                <p className="text-sm sm:text-base text-slate-700 m-0 leading-relaxed">
                  Phải đầy đủ các nội dung bắt buộc theo Luật Doanh nghiệp để làm cơ sở cho việc quản lý và điều hành công ty.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-amber-200 text-xs sm:text-sm font-semibold text-emerald-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Đủ nội dung luật định</span>
              </div>
            </div>

            <div className="p-4 sm:p-5 bg-white/95 rounded-2xl border-2 border-amber-300 shadow-xs relative overflow-hidden flex flex-col justify-between">
              <RoyalFiligreeCorner className="absolute top-1.5 right-1.5" />
              <div>
                <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-amber-100 text-[#7A5B10] inline-block mb-2 border border-amber-300">
                  Thứ ba
                </span>
                <h4 className="text-base sm:text-lg font-bold text-slate-900 m-0 mb-2">TỰ NGUYỆN</h4>
                <p className="text-sm sm:text-base text-slate-700 m-0 leading-relaxed">
                  Các thành viên được tự nguyện, tự do thỏa thuận theo ý chí chung, nhưng tuyệt đối không được trái pháp luật.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-amber-200 text-xs sm:text-sm font-semibold text-emerald-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Tự do thỏa thuận hợp pháp</span>
              </div>
            </div>

            <div className="p-4 sm:p-5 bg-white/95 rounded-2xl border-2 border-amber-300 shadow-xs relative overflow-hidden flex flex-col justify-between">
              <RoyalFiligreeCorner className="absolute top-1.5 right-1.5" />
              <div>
                <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-amber-100 text-[#7A5B10] inline-block mb-2 border border-amber-300">
                  Thứ tư
                </span>
                <h4 className="text-base sm:text-lg font-bold text-slate-900 m-0 mb-2">THỐNG NHẤT</h4>
                <p className="text-sm sm:text-base text-slate-700 m-0 leading-relaxed">
                  Điều lệ phải có sự đồng thuận và chữ ký của các thành viên hoặc cổ đông sáng lập theo quy định.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-amber-200 text-xs sm:text-sm font-semibold text-emerald-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Đồng thuận &amp; đủ chữ ký</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-amber-100/80 rounded-xl border border-amber-300 text-center">
            <span className="text-sm sm:text-base font-bold text-amber-950 font-serif">
              =&gt; Tóm lại: Điều lệ cần đảm bảo ĐÚNG LUẬT – ĐẦY ĐỦ – TỰ NGUYỆN – THỐNG NHẤT.
            </span>
          </div>
        </div>
      ),
    },

    // SLIDE 3: 05 VAI TRÒ CỦA ĐIỀU LỆ TRONG SUỐT VÒNG ĐỜI DOANH NGHIỆP
    {
      id: 'charter-3',
      badge: 'SLIDE 03 / 06 · VAI TRÒ ĐIỀU LỆ',
      category: 'ĐIỀU LỆ CÔNG TY · 05 VAI TRÒ CHÍNH',
      title: '05 VAI TRÒ CỦA ĐIỀU LỆ TRONG SUỐT QUÁ TRÌNH HOẠT ĐỘNG',
      subtitle: 'Không chỉ là thủ tục khi thành lập mà có vai trò quan trọng trong suốt vòng đời doanh nghiệp',
      renderContent: () => (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5">
            <div className="p-4 bg-white/95 rounded-2xl border-2 border-amber-300 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 font-bold mb-2">
                  1
                </div>
                <h4 className="text-sm sm:text-base font-bold text-slate-900 m-0 mb-1.5">Cách thức tổ chức &amp; hoạt động</h4>
                <p className="text-xs sm:text-sm text-slate-700 m-0 leading-relaxed">
                  Quy định cách thức tổ chức và hoạt động của công ty, bao gồm quyền hạn và trách nhiệm của các bộ phận.
                </p>
              </div>
              <span className="text-xs font-mono text-[#8C6B18] font-bold mt-2">Phân định rõ ràng</span>
            </div>

            <div className="p-4 bg-white/95 rounded-2xl border-2 border-amber-300 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 font-bold mb-2">
                  2
                </div>
                <h4 className="text-sm sm:text-base font-bold text-slate-900 m-0 mb-1.5">Tài liệu pháp lý chính thức</h4>
                <p className="text-xs sm:text-sm text-slate-700 m-0 leading-relaxed">
                  Là tài liệu pháp lý chính thức, giúp công ty luôn hoạt động đúng chuẩn quy định của pháp luật.
                </p>
              </div>
              <span className="text-xs font-mono text-[#8C6B18] font-bold mt-2">Cơ sở pháp lý</span>
            </div>

            <div className="p-4 bg-white/95 rounded-2xl border-2 border-amber-300 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 font-bold mb-2">
                  3
                </div>
                <h4 className="text-sm sm:text-base font-bold text-slate-900 m-0 mb-1.5">Cơ sở giải quyết tranh chấp</h4>
                <p className="text-xs sm:text-sm text-slate-700 m-0 leading-relaxed">
                  Là cơ sở giải quyết tranh chấp khi có vấn đề phát sinh hoặc mâu thuẫn giữa các bên liên quan.
                </p>
              </div>
              <span className="text-xs font-mono text-[#8C6B18] font-bold mt-2">Xử lý mâu thuẫn</span>
            </div>

            <div className="p-4 bg-white/95 rounded-2xl border-2 border-amber-300 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 font-bold mb-2">
                  4
                </div>
                <h4 className="text-sm sm:text-base font-bold text-slate-900 m-0 mb-1.5">Định hướng thành viên &amp; nhân sự</h4>
                <p className="text-xs sm:text-sm text-slate-700 m-0 leading-relaxed">
                  Giúp định hướng thành viên và nhân viên về mục tiêu, trách nhiệm và văn hóa hoạt động của công ty.
                </p>
              </div>
              <span className="text-xs font-mono text-[#8C6B18] font-bold mt-2">Mục tiêu chung</span>
            </div>

            <div className="p-4 bg-white/95 rounded-2xl border-2 border-amber-300 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 font-bold mb-2">
                  5
                </div>
                <h4 className="text-sm sm:text-base font-bold text-slate-900 m-0 mb-1.5">Hỗ trợ quản lý &amp; điều hành</h4>
                <p className="text-xs sm:text-sm text-slate-700 m-0 leading-relaxed">
                  Hỗ trợ quản lý và điều hành, giúp các quyết định được thực hiện theo những nguyên tắc đã thống nhất.
                </p>
              </div>
              <span className="text-xs font-mono text-[#8C6B18] font-bold mt-2">Nguyên tắc nhất quán</span>
            </div>
          </div>

          <div className="p-4 bg-amber-50 rounded-xl border border-amber-300 text-center">
            <span className="text-sm sm:text-base font-serif font-bold text-amber-950">
              =&gt; Tóm lại: Điều lệ là nền tảng pháp lý quan trọng giúp công ty hoạt động rõ ràng, minh bạch và hiệu quả.
            </span>
          </div>
        </div>
      ),
    },

    // SLIDE 4: GIẢI PHÁP CỐT LÕI CHO FINTECH VÍ ĐIỆN TỬ (GIẢI PHÁP 1 & 2)
    {
      id: 'charter-4',
      badge: 'SLIDE 04 / 06 · GIẢI PHÁP FINTECH (PHẦN 1)',
      category: 'ĐIỀU LỆ FINTECH VÍ ĐIỆN TỬ · CÔNG CỤ CHỦ ĐỘNG BẢO VỆ DOANH NGHIỆP',
      title: 'GIẢI PHÁP CỐT LÕI CHO FINTECH VÍ ĐIỆN TỬ: ỔN ĐỊNH CỔ ĐÔNG & THẨM QUYỀN',
      subtitle: 'Điều lệ không dừng ở "tuân thủ cho đủ", mà là công cụ chủ động bảo vệ doanh nghiệp trước rủi ro đặc thù',
      renderContent: () => (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 bg-white/95 rounded-2xl border-2 border-amber-300 shadow-xs relative overflow-hidden flex flex-col justify-between">
              <RoyalFiligreeCorner className="absolute top-2 right-2" />
              <div>
                <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-amber-100 text-[#7A5B10] inline-block mb-2 border border-amber-300">
                  Giải pháp cốt lõi 01
                </span>
                <h4 className="text-base sm:text-lg font-bold text-slate-900 m-0 mb-2 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-amber-700" />
                  Bảo vệ sự ổn định cổ đông
                </h4>
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed m-0 mb-3">
                  Với giao dịch có thể làm thay đổi cơ cấu sở hữu đặc biệt là chuyển nhượng cho nhà đầu tư nước ngoài.
                </p>
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-sm sm:text-base text-slate-800 font-medium">
                  • Điều lệ phải thiết lập cơ chế thông báo và quyền ưu tiên rõ ràng, tránh xáo trộn đột ngột trong quản trị.
                </div>
              </div>
              <div className="mt-4 pt-2 border-t border-amber-200 text-xs sm:text-sm font-semibold text-[#8C6B18]">
                Kiểm soát biến động chủ sở hữu
              </div>
            </div>

            <div className="p-5 bg-white/95 rounded-2xl border-2 border-amber-300 shadow-xs relative overflow-hidden flex flex-col justify-between">
              <RoyalFiligreeCorner className="absolute top-2 right-2" />
              <div>
                <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-amber-100 text-[#7A5B10] inline-block mb-2 border border-amber-300">
                  Giải pháp cốt lõi 02
                </span>
                <h4 className="text-base sm:text-lg font-bold text-slate-900 m-0 mb-2 flex items-center gap-2">
                  <Scale className="w-5 h-5 text-amber-700" />
                  Phân định rạch ròi thẩm quyền
                </h4>
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed m-0 mb-3">
                  Phân định rạch ròi thẩm quyền giữa Đại hội đồng cổ đông, Hội đồng quản trị và Tổng Giám đốc.
                </p>
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-sm sm:text-base text-slate-800 font-medium">
                  • Để không xảy ra chồng chéo, dẫn tới tranh chấp hay lạm quyền trong quá trình điều hành.
                </div>
              </div>
              <div className="mt-4 pt-2 border-t border-amber-200 text-xs sm:text-sm font-semibold text-[#8C6B18]">
                Phòng ngừa lạm quyền &amp; xung đột lợi ích
              </div>
            </div>
          </div>
        </div>
      ),
    },

    // SLIDE 5: GIẢI PHÁP CỐT LÕI CHO FINTECH VÍ ĐIỆN TỬ (GIẢI PHÁP 3, 4 & 5)
    {
      id: 'charter-5',
      badge: 'SLIDE 05 / 06 · GIẢI PHÁP FINTECH (PHẦN 2)',
      category: 'ĐIỀU LỆ FINTECH VÍ ĐIỆN TỬ · TÀI CHÍNH, TRÍ TUỆ & KHỦNG HOẢNG',
      title: 'GIẢI PHÁP CỐT LÕI: QUẢN LÝ TÀI CHÍNH, TÀI SẢN TRÍ TUỆ & ỨNG PHÓ KHỦNG HOẢNG',
      subtitle: 'Bộ đệm giữ giấy phép NHNN, bảo vệ mã nguồn thuật toán và cơ chế ra quyết định trong tích tắc',
      renderContent: () => (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            <div className="p-4 sm:p-5 bg-white/95 rounded-2xl border-2 border-amber-300 shadow-xs flex flex-col justify-between">
              <div>
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-amber-100 text-[#7A5B10] inline-block mb-2 border border-amber-300">
                  Giải pháp 03 · Rất riêng ngành ví
                </span>
                <h4 className="text-sm sm:text-base font-bold text-slate-900 m-0 mb-1.5 flex items-center gap-1.5">
                  <Coins className="w-4 h-4 text-amber-700 shrink-0" />
                  Quản lý tài chính chặt chẽ
                </h4>
                <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700 m-0 p-0 list-none">
                  <li>• Pháp luật yêu cầu duy trì vốn điều lệ tối thiểu 50 tỷ đồng.</li>
                  <li>• Điều lệ cần bắt buộc trích lập Quỹ dự phòng rủi ro, Quỹ bảo đảm an toàn hệ thống trước cả khi chia cổ tức.</li>
                  <li>• Đây chính là "bộ đệm" giúp công ty giữ được giấy phép của NHNN và có nguồn lực bồi thường khi sự cố xảy ra.</li>
                </ul>
              </div>
              <span className="text-[11px] font-mono text-[#8C6B18] font-bold mt-2">Duy trì giấy phép NHNN</span>
            </div>

            <div className="p-4 sm:p-5 bg-white/95 rounded-2xl border-2 border-amber-300 shadow-xs flex flex-col justify-between">
              <div>
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-amber-100 text-[#7A5B10] inline-block mb-2 border border-amber-300">
                  Giải pháp 04
                </span>
                <h4 className="text-sm sm:text-base font-bold text-slate-900 m-0 mb-1.5 flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-amber-700 shrink-0" />
                  Bảo vệ tài sản trí tuệ
                </h4>
                <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700 m-0 p-0 list-none">
                  <li>• Với Fintech, tài sản lớn nhất không phải nhà xưởng mà là mã nguồn, thuật toán, dữ liệu khách hàng.</li>
                  <li>• Điều lệ cần khẳng định rõ quyền sở hữu của công ty với các tài sản này.</li>
                  <li>• Kèm nghĩa vụ bảo mật và hạn chế cạnh tranh sau khi nhân sự chủ chốt rời đi.</li>
                </ul>
              </div>
              <span className="text-[11px] font-mono text-[#8C6B18] font-bold mt-2">Sở hữu độc quyền</span>
            </div>

            <div className="p-4 sm:p-5 bg-white/95 rounded-2xl border-2 border-amber-300 shadow-xs flex flex-col justify-between">
              <div>
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-amber-100 text-[#7A5B10] inline-block mb-2 border border-amber-300">
                  Giải pháp 05
                </span>
                <h4 className="text-sm sm:text-base font-bold text-slate-900 m-0 mb-1.5 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-700 shrink-0" />
                  Cơ chế ứng phó khủng hoảng
                </h4>
                <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700 m-0 p-0 list-none">
                  <li>• Khi xảy ra tấn công mạng hay sự cố hệ thống, công ty cần ra quyết định trong tích tắc.</li>
                  <li>• Điều lệ phải trao sẵn thẩm quyền họp khẩn, biểu quyết từ xa, ủy quyền đặc biệt.</li>
                  <li>• Để bộ máy hành động hợp pháp và kịp thời, giữ vững niềm tin người dùng ví điện tử.</li>
                </ul>
              </div>
              <span className="text-[11px] font-mono text-[#8C6B18] font-bold mt-2">Hành động trong tích tắc</span>
            </div>
          </div>
        </div>
      ),
    },

    // SLIDE 6: ĐIỀU LỆ THỰC TẾ ĐƯỢC "MAY ĐO" THEO RỦI RO ĐẶC THÙ NGÀNH NGHỀ
    {
      id: 'charter-6',
      badge: 'SLIDE 06 / 06 · ĐIỀU LỆ MAY ĐO',
      category: 'ĐIỀU LỆ FINTECH VÍ ĐIỆN TỬ · THỰC TIỄN & KẾT LUẬN',
      title: 'ĐIỀU LỆ THỰC TẾ: ĐƯỢC "MAY ĐO" THEO RỦI RO ĐẶC THÙ NGÀNH NGHỀ',
      subtitle: 'Không phải bản sao khuôn mẫu, mà được thiết kế chuyên biệt theo rủi ro ngành ví điện tử',
      renderContent: () => (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            <div className="p-4 sm:p-5 bg-white/95 rounded-2xl border-2 border-amber-300 shadow-xs text-center flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 mx-auto mb-2.5">
                  <Globe className="w-6 h-6 text-amber-700" />
                </div>
                <h4 className="text-base sm:text-lg font-bold text-slate-900 m-0 mb-2">Quy định riêng cho cổ đông nước ngoài</h4>
                <p className="text-sm sm:text-base text-slate-700 m-0 leading-relaxed">
                  Thiết lập cơ chế kiểm soát chuyển nhượng, tỷ lệ sở hữu gián tiếp và tuân thủ các quy định quản lý ngoại hối.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-amber-200 text-xs font-semibold text-[#8C6B18]">
                Kiểm soát dòng vốn ngoại
              </div>
            </div>

            <div className="p-4 sm:p-5 bg-white/95 rounded-2xl border-2 border-amber-300 shadow-xs text-center flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 mx-auto mb-2.5">
                  <Server className="w-6 h-6 text-amber-700" />
                </div>
                <h4 className="text-base sm:text-lg font-bold text-slate-900 m-0 mb-2">Bảo lưu kiểm soát hạ tầng bảo mật</h4>
                <p className="text-sm sm:text-base text-slate-700 m-0 leading-relaxed">
                  Cơ chế bảo lưu quyền kiểm soát tuyệt đối hạ tầng công nghệ bảo mật và dữ liệu thanh toán tại Việt Nam.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-amber-200 text-xs font-semibold text-[#8C6B18]">
                Bảo vệ an toàn dữ liệu
              </div>
            </div>

            <div className="p-4 sm:p-5 bg-white/95 rounded-2xl border-2 border-amber-300 shadow-xs text-center flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 mx-auto mb-2.5">
                  <UserCheck className="w-6 h-6 text-amber-700" />
                </div>
                <h4 className="text-base sm:text-lg font-bold text-slate-900 m-0 mb-2">Đối chiếu sinh trắc học chuyển nhượng</h4>
                <p className="text-sm sm:text-base text-slate-700 m-0 leading-relaxed">
                  Yêu cầu đối chiếu sinh trắc học khi chuyển nhượng cổ phần giữa các cổ đông, ngăn chặn giả mạo chữ ký.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-amber-200 text-xs font-semibold text-[#8C6B18]">
                Định danh cổ đông số
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 rounded-2xl text-white text-center shadow-md">
            <h3 className="text-base sm:text-lg md:text-xl font-serif font-bold m-0 mb-1">
              "ĐIỀU LỆ KHÔNG PHẢI BẢN SAO KHUÔN MẪU, MÀ PHẢI ĐƯỢC MAY ĐO THEO ĐÚNG RỦI RO ĐẶC THÙ NGÀNH NGHỀ."
            </h3>
            <p className="text-xs sm:text-sm text-amber-100 m-0">
              Bộ gen pháp lý vững chắc kiến tạo sự minh bạch, bảo vệ quyền lợi doanh nghiệp và phát triển bền vững.
            </p>
          </div>
        </div>
      ),
    },
  ];

  // =========================================================================
  // BỘ SLIDE 2: HỢP ĐỒNG MỞ VÀ CUNG ỨNG DỊCH VỤ VÍ ĐIỆN TỬ (07 SLIDES)
  // Xây dựng 100% bám sát nội dung Google Doc 1, phần các điều luật chỉ ghi Tiêu đề
  // =========================================================================
  const walletSlides: SlideItem[] = [
    // SLIDE 1: MỞ ĐẦU & BẢN CHẤT HỢP ĐỒNG VÍ (HỆ THẦN KINH & TUYẾN PHÒNG THỦ TUYẾN ĐẦU)
    {
      id: 'wallet-1',
      badge: 'SLIDE 01 / 07 · BẢN CHẤT HỢP ĐỒNG VÍ',
      category: 'HỢP ĐỒNG VÍ ĐIỆN TỬ · HỆ THẦN KINH & TUYẾN PHÒNG THỦ TUYẾN ĐẦU',
      title: 'HỢP ĐỒNG VÍ ĐIỆN TỬ: TUYẾN PHÒNG THỦ Ở TUYẾN ĐẦU',
      subtitle: 'Nơi doanh nghiệp trực tiếp đối mặt hàng triệu giao dịch mỗi ngày. Trả lời: "Ai chịu trách nhiệm gì?"',
      renderContent: () => (
        <div className="space-y-3">
          <div className="p-3 sm:p-3.5 bg-gradient-to-r from-amber-100/90 via-amber-50 to-white rounded-xl border border-amber-300 shadow-2xs">
            <span className="font-mono text-[11px] uppercase font-bold text-[#8C6B18] tracking-wider block mb-1">
              Ẩn dụ cốt lõi từ Kịch bản thuyết trình
            </span>
            <p className="text-xs sm:text-sm md:text-base font-serif text-slate-900 font-bold leading-relaxed m-0 italic">
              "Nếu Điều lệ công ty là 'bộ gen' và khung xương quyết định cách doanh nghiệp vận hành ở tầm quản trị nội bộ, thì Hợp đồng ví điện tử chính là hệ thần kinh &amp; tuyến phòng thủ ở tuyến đầu - nơi mọi tương tác với hàng triệu khách hàng được ghi nhận và kiểm soát."
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3.5 bg-white/95 rounded-xl border border-amber-300 shadow-2xs relative overflow-hidden flex flex-col justify-between">
              <RoyalFiligreeCorner className="absolute top-2 right-2" />
              <div>
                <span className="font-mono text-[11px] font-bold text-[#8C6B18] uppercase tracking-wider block mb-1">
                  So sánh tầm vóc
                </span>
                <h4 className="text-sm sm:text-base font-bold text-slate-900 m-0 mb-1.5">ĐIỀU LỆ vs HỢP ĐỒNG VÍ</h4>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed m-0">
                  Nếu Điều lệ trả lời câu hỏi <em>"công ty được tổ chức và quản trị như thế nào"</em>, thì Hợp đồng ví điện tử trả lời câu hỏi sát sườn hơn:
                </p>
                <div className="mt-2 p-2 bg-amber-50 rounded-lg border border-amber-200 text-xs sm:text-sm font-bold text-amber-950">
                  "KHI KHÁCH HÀNG VÀ DOANH NGHIỆP GIAO DỊCH VỚI NHAU, AI CHỊU TRÁCH NHIỆM GÌ?"
                </div>
              </div>
              <div className="mt-2 pt-1.5 border-t border-amber-200 text-xs font-semibold text-[#8C6B18]">
                Tuyến đầu tiếp xúc người dùng
              </div>
            </div>

            <div className="p-3.5 bg-white/95 rounded-xl border border-amber-300 shadow-2xs relative overflow-hidden flex flex-col justify-between">
              <RoyalFiligreeCorner className="absolute top-2 right-2" />
              <div>
                <span className="font-mono text-[11px] font-bold text-[#8C6B18] uppercase tracking-wider block mb-1">
                  Mục tiêu tối thượng
                </span>
                <h4 className="text-sm sm:text-base font-bold text-slate-900 m-0 mb-1.5">CÔNG CỤ PHÂN BỔ RỦI RO</h4>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed m-0 mb-1.5">
                  Một hợp đồng soạn thảo tốt không chỉ là "văn bản cho có", mà là công cụ chủ động phân bổ rủi ro một cách công bằng và hợp pháp:
                </p>
                <ul className="space-y-1 text-xs text-slate-600 m-0 p-0 list-none">
                  <li>• Minh bạch về điều kiện, quyền hạn và nghĩa vụ các bên.</li>
                  <li>• Bảo vệ doanh nghiệp trước rủi ro tài chính không giới hạn.</li>
                  <li>• Giữ vững niềm tin người dùng và tuân thủ chặt chẽ pháp luật.</li>
                </ul>
              </div>
              <div className="mt-2 pt-1.5 border-t border-amber-200 text-xs font-semibold text-[#8C6B18]">
                Công bằng, hợp pháp &amp; minh bạch
              </div>
            </div>
          </div>
        </div>
      ),
    },

    // SLIDE 2: 04 NHÓM NỘI DUNG CỐT LÕI CỦA HỢP ĐỒNG VÍ
    {
      id: 'wallet-2',
      badge: 'SLIDE 02 / 07 · 04 NỘI DUNG CỐT LÕI',
      category: 'HỢP ĐỒNG VÍ ĐIỆN TỬ · 04 NHÓM NỘI DUNG CỐT LÕI',
      title: '04 NHÓM NỘI DUNG CỐT LÕI CỦA HỢP ĐỒNG VÍ ĐIỆN TỬ',
      subtitle: 'Quy chuẩn mạch lạc về điều kiện, cách thức giao dịch, biểu phí và bảo mật giải quyết khiếu nại',
      renderContent: () => (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            <div className="p-3 sm:p-3.5 bg-white/95 rounded-xl border border-amber-300 shadow-2xs relative overflow-hidden flex flex-col justify-between">
              <RoyalFiligreeCorner className="absolute top-1.5 right-1.5" />
              <div>
                <span className="font-mono text-[10.5px] font-bold px-2 py-0.5 rounded bg-amber-100 text-[#7A5B10] inline-block mb-1.5 border border-amber-300">
                  Thứ nhất
                </span>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 m-0 mb-1.5">ĐIỀU KIỆN MỞ &amp; DÙNG VÍ</h4>
                <ul className="space-y-1 text-[11px] sm:text-xs text-slate-700 m-0 p-0 list-none leading-snug">
                  <li>• Xác định quyền và nghĩa vụ của doanh nghiệp.</li>
                  <li>• Quy định điều kiện mở ví &amp; thông tin cần cung cấp.</li>
                  <li>• Quy định phương thức xác thực an toàn.</li>
                  <li>• Trường hợp từ chối hoặc tạm dừng cung ứng dịch vụ.</li>
                  <li>• Trách nhiệm KH: Bảo quản thông tin xác thực, mã PIN, thiết bị.</li>
                </ul>
              </div>
              <div className="mt-2 pt-1.5 border-t border-amber-200 text-[10.5px] font-semibold text-emerald-800">
                Hạn chế nguy cơ bị chiếm đoạt
              </div>
            </div>

            <div className="p-3 sm:p-3.5 bg-white/95 rounded-xl border border-amber-300 shadow-2xs relative overflow-hidden flex flex-col justify-between">
              <RoyalFiligreeCorner className="absolute top-1.5 right-1.5" />
              <div>
                <span className="font-mono text-[10.5px] font-bold px-2 py-0.5 rounded bg-amber-100 text-[#7A5B10] inline-block mb-1.5 border border-amber-300">
                  Thứ hai
                </span>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 m-0 mb-1.5">CÁCH THỨC THỰC HIỆN GD</h4>
                <ul className="space-y-1 text-[11px] sm:text-xs text-slate-700 m-0 p-0 list-none leading-snug">
                  <li>• Quy định cách thức khách hàng thực hiện GD qua ví.</li>
                  <li>• Xác định thời điểm giao dịch được xác lập.</li>
                  <li>• Quy định phương thức xác nhận giao dịch.</li>
                  <li>• Quy định hạn mức giao dịch (100 Tr/tháng).</li>
                  <li>• Xử lý khi giao dịch không thành công.</li>
                </ul>
              </div>
              <div className="mt-2 pt-1.5 border-t border-amber-200 text-[10.5px] font-semibold text-[#8C6B18]">
                Chuẩn hóa quy trình giao dịch
              </div>
            </div>

            <div className="p-3 sm:p-3.5 bg-white/95 rounded-xl border border-amber-300 shadow-2xs relative overflow-hidden flex flex-col justify-between">
              <RoyalFiligreeCorner className="absolute top-1.5 right-1.5" />
              <div>
                <span className="font-mono text-[10.5px] font-bold px-2 py-0.5 rounded bg-amber-100 text-[#7A5B10] inline-block mb-1.5 border border-amber-300">
                  Thứ ba
                </span>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 m-0 mb-1.5">PHÍ DỊCH VỤ</h4>
                <ul className="space-y-1 text-[11px] sm:text-xs text-slate-700 m-0 p-0 list-none leading-snug">
                  <li>• Quy định các loại phí khách hàng phải thanh toán.</li>
                  <li>• Thời điểm thu phí minh bạch.</li>
                  <li>• Phương thức cấn trừ / thu phí tự động.</li>
                </ul>
              </div>
              <div className="mt-2 pt-1.5 border-t border-amber-200 text-[10.5px] font-semibold text-[#8C6B18]">
                Minh bạch tài chính
              </div>
            </div>

            <div className="p-3 sm:p-3.5 bg-white/95 rounded-xl border border-amber-300 shadow-2xs relative overflow-hidden flex flex-col justify-between">
              <RoyalFiligreeCorner className="absolute top-1.5 right-1.5" />
              <div>
                <span className="font-mono text-[10.5px] font-bold px-2 py-0.5 rounded bg-amber-100 text-[#7A5B10] inline-block mb-1.5 border border-amber-300">
                  Thứ tư
                </span>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 m-0 mb-1.5">BẢO MẬT &amp; KHIẾU NẠI</h4>
                <ul className="space-y-1 text-[11px] sm:text-xs text-slate-700 m-0 p-0 list-none leading-snug">
                  <li>• Quy định về bảo vệ dữ liệu cá nhân theo Luật 91/2025.</li>
                  <li>• Bảo mật tuyệt đối thông tin khách hàng.</li>
                  <li>• Cơ chế tiếp nhận &amp; giải quyết khiếu nại tranh chấp.</li>
                </ul>
              </div>
              <div className="mt-2 pt-1.5 border-t border-amber-200 text-[10.5px] font-semibold text-[#8C6B18]">
                An toàn &amp; Quyền riêng tư
              </div>
            </div>
          </div>
        </div>
      ),
    },

    // SLIDE 3: 06 VAI TRÒ TRỌNG YẾU CỦA HỢP ĐỒNG VÍ
    {
      id: 'wallet-3',
      badge: 'SLIDE 03 / 07 · 06 VAI TRÒ TRỌNG YẾU',
      category: 'HỢP ĐỒNG VÍ ĐIỆN TỬ · 06 VAI TRÒ TRỌNG YẾU',
      title: '06 VAI TRÒ TRỌNG YẾU CỦA HỢP ĐỒNG MỞ VÀ CUNG ỨNG DỊCH VỤ VÍ',
      subtitle: 'Thiết lập trật tự vận hành, phân bổ rủi ro công bằng, bảo vệ người dùng và đảm bảo tuân thủ pháp luật',
      renderContent: () => (
        <div className="space-y-2.5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
            <div className="p-3 bg-white/95 rounded-xl border border-amber-300 shadow-2xs">
              <span className="font-mono text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">Vai trò 01</span>
              <h4 className="text-xs sm:text-[13px] font-bold text-slate-900 mt-1 mb-1">Cơ sở pháp lý xác lập quan hệ</h4>
              <p className="text-[11px] sm:text-xs text-slate-700 m-0 leading-relaxed">
                Xác lập quan hệ giữa tổ chức cung ứng và khách hàng; xác định phạm vi dịch vụ, điều kiện mở ví, phương thức giao dịch, quyền/nghĩa vụ của KH và bên cung ứng.
              </p>
            </div>

            <div className="p-3 bg-white/95 rounded-xl border border-amber-300 shadow-2xs">
              <span className="font-mono text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">Vai trò 02</span>
              <h4 className="text-xs sm:text-[13px] font-bold text-slate-900 mt-1 mb-1">Công cụ quy định cơ chế vận hành</h4>
              <p className="text-[11px] sm:text-xs text-slate-700 m-0 leading-relaxed">
                Quy định nạp tiền, rút tiền, chuyển tiền, thanh toán; hạn mức, phương thức xác thực, thời điểm ghi nhận, phí dịch vụ, xử lý giao dịch lỗi, tạm khóa/đóng ví.
              </p>
            </div>

            <div className="p-3 bg-white/95 rounded-xl border border-amber-300 shadow-2xs">
              <span className="font-mono text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">Vai trò 03</span>
              <h4 className="text-xs sm:text-[13px] font-bold text-slate-900 mt-1 mb-1">Phân bổ và kiểm soát rủi ro</h4>
              <p className="text-[11px] sm:text-xs text-slate-700 m-0 leading-relaxed">
                Trong môi trường điện tử (mất thiết bị, lộ OTP, giả mạo, gian lận): Xác định trách nhiệm bảo mật của KH vs trách nhiệm an toàn hệ thống và tra soát của bên cung ứng.
              </p>
            </div>

            <div className="p-3 bg-white/95 rounded-xl border border-amber-300 shadow-2xs">
              <span className="font-mono text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">Vai trò 04</span>
              <h4 className="text-xs sm:text-[13px] font-bold text-slate-900 mt-1 mb-1">Bảo vệ quyền &amp; lợi ích khách hàng</h4>
              <p className="text-[11px] sm:text-xs text-slate-700 m-0 leading-relaxed">
                Minh bạch mức phí, điều kiện sử dụng, quyền tạm ngừng, xử lý dữ liệu. Khi sự cố kỹ thuật không do lỗi người dùng, điều khoản tra soát là căn cứ bảo vệ quyền lợi.
              </p>
            </div>

            <div className="p-3 bg-white/95 rounded-xl border border-amber-300 shadow-2xs">
              <span className="font-mono text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">Vai trò 05</span>
              <h4 className="text-xs sm:text-[13px] font-bold text-slate-900 mt-1 mb-1">Bảo đảm tuân thủ pháp luật</h4>
              <p className="text-[11px] sm:text-xs text-slate-700 m-0 leading-relaxed">
                Gắn với yêu cầu nhận biết và xác minh khách hàng (eKYC), phòng chống rửa tiền (AML), quản lý thông tin khách hàng và kiểm soát các giao dịch bất thường.
              </p>
            </div>

            <div className="p-3 bg-white/95 rounded-xl border border-amber-300 shadow-2xs">
              <span className="font-mono text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">Vai trò 06</span>
              <h4 className="text-xs sm:text-[13px] font-bold text-slate-900 mt-1 mb-1">Căn cứ giải quyết tranh chấp</h4>
              <p className="text-[11px] sm:text-xs text-slate-700 m-0 leading-relaxed">
                Căn cứ xác định trách nhiệm khi có tranh chấp về giao dịch, số dư, phí, giao dịch trái phép; quy định thời hạn thông báo, hòa giải và bồi thường thiệt hại.
              </p>
            </div>
          </div>
        </div>
      ),
    },

    // SLIDE 4: 05 GIẢI PHÁP BẢO VỆ DN FINTECH (GIẢI PHÁP 1 & 2)
    {
      id: 'wallet-4',
      badge: 'SLIDE 04 / 07 · GIẢI PHÁP DN (PHẦN 1)',
      category: 'HỢP ĐỒNG VÍ ĐIỆN TỬ · 05 GIẢI PHÁP BẢO VỆ DOANH NGHIỆP',
      title: '05 GIẢI PHÁP BẢO VỆ DOANH NGHIỆP: QUY TRÌNH MỞ VÍ & THỎA THUẬN RÕ RÀNG',
      subtitle: 'Hạn chế rủi ro pháp lý ngay từ đầu vào và thiết lập hợp đồng cân bằng, minh bạch',
      renderContent: () => (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3.5 sm:p-4 bg-white/95 rounded-xl border border-amber-300 shadow-2xs flex flex-col justify-between">
              <div>
                <span className="font-mono text-[10.5px] font-bold px-2 py-0.5 rounded bg-amber-100 text-[#7A5B10] inline-block mb-1.5 border border-amber-300">
                  Giải pháp 01
                </span>
                <h4 className="text-sm sm:text-base font-bold text-slate-900 m-0 mb-1.5">
                  Hoàn thiện và chuẩn hóa quy trình mở &amp; sử dụng ví
                </h4>
                <ul className="space-y-1 text-xs text-slate-700 m-0 p-0 list-none leading-relaxed">
                  <li>• Hạn chế rủi ro pháp lý ngay từ khi thiết lập quan hệ với khách hàng.</li>
                  <li>• Kiểm soát các rủi ro: Giả mạo danh tính, chiếm quyền tài khoản, GD trái phép.</li>
                  <li>• Xây dựng quy trình nhận biết và xác minh khách hàng chặt chẽ (eKYC).</li>
                  <li>• Xác minh giấy tờ, đối chiếu dữ liệu, áp dụng xác thực phù hợp &amp; rà soát định kỳ.</li>
                  <li>• Quy định trách nhiệm KH cung cấp thông tin chính xác, kịp thời cập nhật.</li>
                </ul>
              </div>
              <div className="mt-2 pt-1.5 border-t border-amber-200 text-xs font-semibold text-emerald-800">
                Tuân thủ pháp luật &amp; giảm thiểu tổn thất tài chính
              </div>
            </div>

            <div className="p-3.5 sm:p-4 bg-white/95 rounded-xl border border-amber-300 shadow-2xs flex flex-col justify-between">
              <div>
                <span className="font-mono text-[10.5px] font-bold px-2 py-0.5 rounded bg-amber-100 text-[#7A5B10] inline-block mb-1.5 border border-amber-300">
                  Giải pháp 02
                </span>
                <h4 className="text-sm sm:text-base font-bold text-slate-900 m-0 mb-1.5">
                  Xây dựng thỏa thuận mở và sử dụng ví rõ ràng, đầy đủ
                </h4>
                <ul className="space-y-1 text-xs text-slate-700 m-0 p-0 list-none leading-relaxed">
                  <li>• Hợp đồng là cơ sở xác định quyền và nghĩa vụ các bên.</li>
                  <li>• Quy định toàn diện: Điều kiện mở/dùng ví, xác thực, hạn mức, bảo mật, xử lý GD gian lận.</li>
                  <li>• Điều khoản tạm ngừng/chấm dứt có cơ sở pháp luật, tránh quyền đơn phương quá lớn.</li>
                  <li>• Hợp đồng chặt chẽ giúp phân định trách nhiệm rõ ràng và bảo vệ DN khi có tranh chấp.</li>
                </ul>
              </div>
              <div className="mt-2 pt-1.5 border-t border-amber-200 text-xs font-semibold text-[#8C6B18]">
                Minh bạch &amp; giữ vững niềm tin người dùng
              </div>
            </div>
          </div>
        </div>
      ),
    },

    // SLIDE 5: 05 GIẢI PHÁP BẢO VỆ DN FINTECH (GIẢI PHÁP 3, 4 & 5)
    {
      id: 'wallet-5',
      badge: 'SLIDE 05 / 07 · GIẢI PHÁP DN (PHẦN 2)',
      category: 'HỢP ĐỒNG VÍ ĐIỆN TỬ · BẢO MẬT, CHỨNG CỨ & KIỂM SOÁT TUÂN THỦ',
      title: '05 GIẢI PHÁP: BẢO MẬT GIAN LẬN, LƯU TRỮ CHỨNG CỨ & QUẢN TRỊ TUÂN THỦ',
      subtitle: 'Đầu tư công nghệ phòng ngừa, lưu trữ chứng cứ điện tử trước Tòa và kiểm soát tuân thủ đa luật',
      renderContent: () => (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
            <div className="p-3 sm:p-3.5 bg-white/95 rounded-xl border border-amber-300 shadow-2xs flex flex-col justify-between">
              <div>
                <span className="font-mono text-[10.5px] font-bold px-2 py-0.5 rounded bg-amber-100 text-[#7A5B10] inline-block mb-1.5 border border-amber-300">
                  Giải pháp 03
                </span>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 m-0 mb-1">An toàn, bảo mật &amp; phòng gian lận</h4>
                <ul className="space-y-1 text-[11px] sm:text-xs text-slate-700 m-0 p-0 list-none leading-snug">
                  <li>• Kiểm soát giả mạo, đánh cắp thông tin, chiếm quyền tài khoản.</li>
                  <li>• Phát hiện cảnh báo GD bất thường; xác thực nhiều lớp với GD rủi ro.</li>
                  <li>• Ràng buộc trách nhiệm KH bảo mật OTP, thiết bị; thông báo ngay khi lộ.</li>
                </ul>
              </div>
              <span className="text-[10.5px] font-mono text-[#8C6B18] font-bold mt-2">Phản ứng nhanh với gian lận</span>
            </div>

            <div className="p-3 sm:p-3.5 bg-white/95 rounded-xl border border-amber-300 shadow-2xs flex flex-col justify-between">
              <div>
                <span className="font-mono text-[10.5px] font-bold px-2 py-0.5 rounded bg-amber-100 text-[#7A5B10] inline-block mb-1.5 border border-amber-300">
                  Giải pháp 04
                </span>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 m-0 mb-1">Tra soát &amp; lưu trữ chứng cứ điện tử</h4>
                <ul className="space-y-1 text-[11px] sm:text-xs text-slate-700 m-0 p-0 list-none leading-snug">
                  <li>• Quy trình tiếp nhận, xử lý, thời hạn và trách nhiệm khi tranh chấp.</li>
                  <li>• Lưu trữ log giao dịch, IP đăng nhập, xác thực để xác định chủ thể GD.</li>
                  <li>• Là "bằng chứng sống" bảo vệ doanh nghiệp trước Tòa án.</li>
                </ul>
              </div>
              <span className="text-[10.5px] font-mono text-[#8C6B18] font-bold mt-2">Chứng cứ pháp lý điện tử</span>
            </div>

            <div className="p-3 sm:p-3.5 bg-white/95 rounded-xl border border-amber-300 shadow-2xs flex flex-col justify-between">
              <div>
                <span className="font-mono text-[10.5px] font-bold px-2 py-0.5 rounded bg-amber-100 text-[#7A5B10] inline-block mb-1.5 border border-amber-300">
                  Giải pháp 05
                </span>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 m-0 mb-1">Quản trị &amp; kiểm soát tuân thủ</h4>
                <ul className="space-y-1 text-[11px] sm:text-xs text-slate-700 m-0 p-0 list-none leading-snug">
                  <li>• Đồng bộ đa luật: TT không tiền mặt, GD điện tử, AML, Bảo vệ DLCN.</li>
                  <li>• Kiểm soát tuân thủ định kỳ, đào tạo nhân viên nhận diện rủi ro.</li>
                  <li>• Quy định rõ cơ chế sửa đổi, chấm dứt và xử lý số dư trên ví.</li>
                </ul>
              </div>
              <span className="text-[10.5px] font-mono text-[#8C6B18] font-bold mt-2">Kiểm soát tuân thủ đa luật</span>
            </div>
          </div>
        </div>
      ),
    },

    // SLIDE 6: DANH MỤC CÁC ĐIỀU LUẬT QUAN TRỌNG TRONG HỢP ĐỒNG (CHỈ GHI TÊN ĐIỀU & TIÊU ĐỀ)
    {
      id: 'wallet-6',
      badge: 'SLIDE 06 / 07 · CÁC ĐIỀU LUẬT QUAN TRỌNG',
      category: 'HỢP ĐỒNG VÍ ĐIỆN TỬ · CÁC ĐIỀU KHOẢN TRỌNG TÂM',
      title: 'DANH MỤC CÁC ĐIỀU LUẬT QUAN TRỌNG TRONG THỎA THUẬN VÍ',
      subtitle: 'Hệ thống các điều khoản trọng yếu thể chế hóa quyền, nghĩa vụ và chế tài bảo vệ doanh nghiệp',
      renderContent: () => (
        <div className="space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div className="p-2 sm:p-2.5 bg-white rounded-lg border border-amber-300 shadow-2xs">
              <span className="font-mono text-[9.5px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded">Điều 2</span>
              <h4 className="text-xs sm:text-[13px] font-bold text-slate-900 mt-0.5 mb-0.5 truncate">
                Nguyên tắc mở, sử dụng tài khoản ví điện tử
              </h4>
              <p className="text-[10.5px] text-slate-600 m-0 leading-tight line-clamp-2">
                (Đối tượng, liên kết NH, 5 hình thức nạp, 5 hình thức rút/thanh toán, hồ sơ eKYC &amp; Hạn mức 100 Tr/tháng)
              </p>
            </div>

            <div className="p-2 sm:p-2.5 bg-white rounded-lg border border-amber-300 shadow-2xs">
              <span className="font-mono text-[9.5px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded">Điều 6</span>
              <h4 className="text-xs sm:text-[13px] font-bold text-slate-900 mt-0.5 mb-0.5 truncate">
                Các hành vi bị cấm khi sử dụng ví điện tử
              </h4>
              <p className="text-[10.5px] text-slate-600 m-0 leading-tight line-clamp-2">
                (Hành vi cấm đối với khách hàng &amp; Cấm TVPAY cấp tín dụng, cấm trả lãi trên số dư ví)
              </p>
            </div>

            <div className="p-2 sm:p-2.5 bg-white rounded-lg border border-amber-300 shadow-2xs">
              <span className="font-mono text-[9.5px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded">Điều 7</span>
              <h4 className="text-xs sm:text-[13px] font-bold text-slate-900 mt-0.5 mb-0.5 truncate">
                Quyền và nghĩa vụ của khách hàng
              </h4>
              <p className="text-[10.5px] text-slate-600 m-0 leading-tight line-clamp-2">
                (11 Quyền &amp; 24 Nghĩa vụ; khách hàng tự chịu trách nhiệm lộ OTP; hoàn trả tiền ghi Có nhầm)
              </p>
            </div>

            <div className="p-2 sm:p-2.5 bg-white rounded-lg border border-amber-300 shadow-2xs">
              <span className="font-mono text-[9.5px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded">Điều 10</span>
              <h4 className="text-xs sm:text-[13px] font-bold text-slate-900 mt-0.5 mb-0.5 truncate">
                Phong tỏa tài khoản ví điện tử
              </h4>
              <p className="text-[10.5px] text-slate-600 m-0 leading-tight line-clamp-2">
                (4 Trường hợp phong tỏa, 5 điều kiện mở phong tỏa; nguyên tắc chỉ phong tỏa số tiền tranh chấp)
              </p>
            </div>

            <div className="p-2 sm:p-2.5 bg-white rounded-lg border border-amber-300 shadow-2xs">
              <span className="font-mono text-[9.5px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded">Điều 11</span>
              <h4 className="text-xs sm:text-[13px] font-bold text-slate-900 mt-0.5 mb-0.5 truncate">
                Chính sách hoàn tiền
              </h4>
              <p className="text-[10.5px] text-slate-600 m-0 leading-tight line-clamp-2">
                (Hoàn tiền trong 05 ngày làm việc khi giao dịch bị lỗi hệ thống; hoàn toàn không thu phí)
              </p>
            </div>

            <div className="p-2 sm:p-2.5 bg-white rounded-lg border border-amber-300 shadow-2xs">
              <span className="font-mono text-[9.5px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded">Điều 12</span>
              <h4 className="text-xs sm:text-[13px] font-bold text-slate-900 mt-0.5 mb-0.5 truncate">
                Đóng tài khoản ví điện tử
              </h4>
              <p className="text-[10.5px] text-slate-600 m-0 leading-tight line-clamp-2">
                (08 Căn cứ đóng ví, nghiệp vụ hủy lệnh và phương án xử lý số dư còn lại trên tài khoản)
              </p>
            </div>

            <div className="p-2 sm:p-2.5 bg-white rounded-lg border border-amber-300 shadow-2xs">
              <span className="font-mono text-[9.5px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded">Điều 13</span>
              <h4 className="text-xs sm:text-[13px] font-bold text-slate-900 mt-0.5 mb-0.5 truncate">
                Tra soát, giải quyết khiếu nại
              </h4>
              <p className="text-[10.5px] text-slate-600 m-0 leading-tight line-clamp-2">
                (Thời hạn khiếu nại tối đa 60 ngày, thời hạn xử lý không quá 30 ngày, bồi hoàn trong 5 ngày)
              </p>
            </div>

            <div className="p-2 sm:p-2.5 bg-amber-50/90 rounded-lg border border-amber-400 shadow-2xs">
              <span className="font-mono text-[9.5px] font-bold text-amber-900 bg-amber-200 px-1.5 py-0.2 rounded">Điều 16 · Lá chắn</span>
              <h4 className="text-xs sm:text-[13px] font-bold text-amber-950 mt-0.5 mb-0.5 truncate">
                Giới hạn trách nhiệm
              </h4>
              <p className="text-[10.5px] text-slate-700 m-0 leading-tight line-clamp-2">
                (Trách nhiệm bồi thường của TVPAY giới hạn tối đa không vượt quá số dư ví ngay trước thiệt hại)
              </p>
            </div>

            <div className="p-2 sm:p-2.5 bg-white rounded-lg border border-amber-300 shadow-2xs">
              <span className="font-mono text-[9.5px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded">Điều 18</span>
              <h4 className="text-xs sm:text-[13px] font-bold text-slate-900 mt-0.5 mb-0.5 truncate">
                Điều khoản chung
              </h4>
              <p className="text-[10.5px] text-slate-600 m-0 leading-tight line-clamp-2">
                (Sửa đổi thông báo trước, tiếp tục dùng là chấp thuận ngầm định; giá trị chứng từ điện tử)
              </p>
            </div>
          </div>
        </div>
      ),
    },

    // SLIDE 7: THỂ CHẾ HÓA THỰC TẾ & KẾT LUẬN 04 TRỤ CỘT BẢO VỆ DN FINTECH
    {
      id: 'wallet-7',
      badge: 'SLIDE 07 / 07 · KẾT LUẬN & 04 TRỤ CỘT',
      category: 'HỢP ĐỒNG VÍ ĐIỆN TỬ · THỂ CHẾ HÓA & ĐỒNG BỘ 04 TRỤ CỘT',
      title: 'THỂ CHẾ HÓA THỰC TẾ & KẾT HỢP ĐỒNG BỘ 04 TRỤ CỘT BẢO VỆ FINTECH',
      subtitle: 'Chuyển từ tư duy "xử lý sau tranh chấp" sang chủ động "nhận diện và phòng ngừa rủi ro từ đầu"',
      renderContent: () => (
        <div className="space-y-2.5">
          <div className="p-3 bg-white/95 rounded-xl border border-amber-300 shadow-2xs">
            <span className="font-mono text-[10px] font-bold text-[#8C6B18] uppercase tracking-wider block mb-1">
              4 Điểm thể chế hóa cụ thể trong Hợp đồng thực tế TVPAY
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
              <div className="p-2 bg-amber-50/80 rounded-lg border border-amber-200">
                <strong className="block text-slate-900 text-[11px] mb-0.5">Hạn mức giao dịch rõ ràng:</strong>
                <span className="text-slate-700 text-[10.5px] leading-tight block">Tối đa 100 Tr/tháng cho cá nhân, công khai khi thay đổi.</span>
              </div>
              <div className="p-2 bg-amber-50/80 rounded-lg border border-amber-200">
                <strong className="block text-slate-900 text-[11px] mb-0.5">Phong tỏa có căn cứ:</strong>
                <span className="text-slate-700 text-[10.5px] leading-tight block">Theo yêu cầu cơ quan NN, phát hiện gian lận hoặc tranh chấp.</span>
              </div>
              <div className="p-2 bg-amber-50/80 rounded-lg border border-amber-200">
                <strong className="block text-slate-900 text-[11px] mb-0.5">Thời hạn tra soát cụ thể:</strong>
                <span className="text-slate-700 text-[10.5px] leading-tight block">60 ngày khiếu nại, 30 ngày xử lý, 5 ngày bồi hoàn nếu lỗi.</span>
              </div>
              <div className="p-2 bg-amber-100/90 rounded-xl border border-amber-300">
                <strong className="block text-amber-950 text-[11px] mb-0.5">Điều 16 Giới hạn trách nhiệm:</strong>
                <span className="text-slate-800 text-[10.5px] font-medium leading-tight block">Bồi thường tối đa không quá số dư ví ngay trước thiệt hại.</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 rounded-xl text-white text-center shadow-xs">
            <h3 className="text-xs sm:text-sm font-serif font-bold m-0 mb-1">
              KẾT HỢP ĐỒNG BỘ: PHÁP LÝ – HỢP ĐỒNG – CÔNG NGHỆ – QUẢN TRỊ
            </h3>
            <p className="text-[11px] sm:text-xs text-amber-100 m-0 max-w-3xl mx-auto leading-relaxed">
              "Bảo vệ quyền lợi hợp pháp của doanh nghiệp Fintech cần kết hợp đồng bộ 4 trụ cột: Chuyển từ tư duy 'xử lý rủi ro sau khi đã xảy ra tranh chấp' sang chủ động 'nhận diện và phòng ngừa rủi ro ngay từ đầu'."
            </p>
          </div>
        </div>
      ),
    },
  ];

  const slides = isCharter ? charterSlides : walletSlides;
  const totalSlides = slides.length;

  const goToSlide = useCallback(
    (index: number) => {
      if (index >= 0 && index < totalSlides && index !== currentSlide) {
        setSlideDirection(index > currentSlide ? 'forward' : 'backward');
        setCurrentSlide(index);
        uiSound.playTransition();
      }
    },
    [currentSlide, totalSlides]
  );

  const nextSlide = useCallback(() => {
    if (currentSlide < totalSlides - 1) {
      setSlideDirection('forward');
      setCurrentSlide((prev) => prev + 1);
      uiSound.playNext();
    } else {
      setSlideDirection('forward');
      setCurrentSlide(0);
      uiSound.playNext();
    }
  }, [currentSlide, totalSlides]);

  const prevSlide = useCallback(() => {
    if (currentSlide > 0) {
      setSlideDirection('backward');
      setCurrentSlide((prev) => prev - 1);
      uiSound.playPrev();
    } else {
      setSlideDirection('backward');
      setCurrentSlide(totalSlides - 1);
      uiSound.playPrev();
    }
  }, [currentSlide, totalSlides]);

  const toggleFullscreen = useCallback(async () => {
    uiSound.playClick();
    if (!isFullscreen) {
      setIsFullscreen(true);
      try {
        if (typeof document !== 'undefined' && !document.fullscreenElement && document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        }
      } catch (err) {
        console.warn('Native requestFullscreen denied or failed:', err);
      }
    } else {
      setIsFullscreen(false);
      try {
        if (typeof document !== 'undefined' && document.fullscreenElement && document.exitFullscreen) {
          await document.exitFullscreen();
        }
      } catch (err) {
        console.warn('Exit fullscreen failed:', err);
      }
    }
  }, [isFullscreen]);

  // Sync state if user exits via browser native controls or Esc
  useEffect(() => {
    const handleFsChange = () => {
      if (typeof document !== 'undefined' && !document.fullscreenElement && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, [isFullscreen]);

  // Lock body scroll when fullscreen is active to hide website navigation bar completely
  useEffect(() => {
    if (isFullscreen && typeof document !== 'undefined') {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [isFullscreen]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || (e.key === ' ' && !e.shiftKey)) {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp' || (e.key === ' ' && e.shiftKey)) {
        e.preventDefault();
        prevSlide();
      } else if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
        if (typeof document !== 'undefined' && document.fullscreenElement && document.exitFullscreen) {
          document.exitFullscreen().catch(() => {});
        }
      } else if (e.key.toLowerCase() === 'f' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const target = e.target as HTMLElement;
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          e.preventDefault();
          toggleFullscreen();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide, isFullscreen, toggleFullscreen]);

  // Autoplay handler
  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 8000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, nextSlide]);

  const activeSlide = slides[currentSlide];

  // Helper for slide pill labels
  const getSlideLabel = (idx: number) => {
    if (isCharter) {
      const labels = [
        '01 · Bộ Gen bản chất',
        '02 · 4 Nguyên tắc',
        '03 · 5 Vai trò',
        '04 · GP 1 & 2',
        '05 · GP 3, 4 & 5',
        '06 · Điều lệ may đo',
      ];
      return labels[idx] || `Slide ${idx + 1}`;
    }
    const labels = [
      '01 · Tuyến đầu',
      '02 · 4 Nội dung',
      '03 · 6 Vai trò',
      '04 · GP 1 & 2',
      '05 · GP 3, 4 & 5',
      '06 · Các Điều luật',
      '07 · 4 Trụ cột',
    ];
    return labels[idx] || `Slide ${idx + 1}`;
  };

  // =========================================================================
  // TRUE FULLSCREEN VIEW (No speaker notes, fixed frame without vertical scroll)
  // Mounted directly into document.body to fully mask the site header navigation
  // =========================================================================
  if (isFullscreen && typeof document !== 'undefined') {
    return createPortal(
      <div
        ref={containerRef}
        className="tvpay-fullscreen-mode tvpay-presentation-fullscreen fixed inset-0 z-[99999999] w-screen h-screen bg-gradient-to-br from-[#FFFDF9] via-[#FAF6EE] to-[#F5ECE0] flex flex-col justify-between overflow-hidden select-none p-3 sm:p-5 md:p-6 lg:p-7 animate-in fade-in duration-300"
      >
        {/* Ornate Gold Filigree Corners */}
        <RoyalScreenCorner position="top-left" />
        <RoyalScreenCorner position="top-right" />
        <RoyalScreenCorner position="bottom-left" />
        <RoyalScreenCorner position="bottom-right" />

        {/* Guilloché Watermark in Center Background */}
        <RoyalWatermark />

        {/* Fullscreen Top Gold Navigation Bar */}
        <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-wrap items-center justify-between pb-2 sm:pb-3 border-b border-amber-300/80 gap-2 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="p-2 rounded-xl bg-gradient-to-br from-[#FFF8E7] to-[#F3E5BE] border border-[#D4AF37]/80 text-[#8C6B18] shadow-xs shrink-0">
              <FileCheck2 className="w-5 h-5" />
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] sm:text-xs uppercase font-bold tracking-wider text-[#8C6B18] font-mono bg-amber-100/90 border border-amber-300/80 px-2 py-0.5 rounded truncate">
                  {isCharter
                    ? `BÁO CÁO ĐIỀU LỆ CÔNG TY CP CUNG ỨNG VÍ ĐIỆN TỬ · ${totalSlides} SLIDES`
                    : `BÁO CÁO HỢP ĐỒNG MỞ VÀ SỬ DỤNG VÍ ĐIỆN TỬ · ${totalSlides} SLIDES`}
                </span>
                <span className="text-[11px] sm:text-xs font-mono font-bold text-[#7A5B10] bg-amber-200/80 px-2 py-0.5 rounded border border-amber-300 shadow-2xs">
                  SLIDE {currentSlide + 1} / {totalSlides}
                </span>
              </div>
              <h2 className="font-serif text-base sm:text-xl md:text-2xl font-bold text-slate-900 m-0 mt-0.5 truncate">
                {activeSlide.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Keyboard hints */}
            <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-600 bg-white/95 px-2.5 py-1.5 rounded-xl border border-amber-200/80 shadow-2xs">
              <kbd className="px-1.5 py-0.5 bg-amber-50 border border-amber-300 rounded text-[#8C6B18] font-mono text-[11px] font-bold">
                ←
              </kbd>
              <kbd className="px-1.5 py-0.5 bg-amber-50 border border-amber-300 rounded text-[#8C6B18] font-mono text-[11px] font-bold">
                →
              </kbd>
              <span className="text-slate-400">hoặc</span>
              <kbd className="px-1.5 py-0.5 bg-amber-50 border border-amber-300 rounded text-[#8C6B18] font-mono text-[11px] font-bold">
                Space
              </kbd>
              <span className="text-slate-600 font-medium">chuyển slide</span>
            </div>

            {/* Auto-play toggle */}
            <button
              type="button"
              onClick={() => {
                uiSound.playClick();
                setIsAutoPlaying(!isAutoPlaying);
              }}
              className={`px-3 py-1.5 rounded-xl border text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                isAutoPlaying
                  ? 'bg-[#C59B27] text-white border-amber-500 shadow-xs'
                  : 'bg-white hover:bg-amber-50 text-slate-700 border-amber-300 shadow-2xs'
              }`}
              title={isAutoPlaying ? 'Tạm dừng tự chạy' : 'Tự chạy 8s/slide'}
            >
              {isAutoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span className="hidden sm:inline">{isAutoPlaying ? 'Tạm dừng' : 'Tự chạy'}</span>
            </button>

            {/* Exit Fullscreen button */}
            <button
              type="button"
              onClick={toggleFullscreen}
              className="px-3.5 py-1.5 rounded-xl border border-amber-300/90 bg-white hover:bg-amber-50 text-[#8C6B18] hover:text-[#7A5B10] text-xs sm:text-sm font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs hover:border-amber-400"
              title="Thoát toàn màn hình (Phím Esc)"
            >
              <Minimize2 className="w-4 h-4 text-[#C59B27]" />
              <span>Thoát Toàn Màn Hình (Esc)</span>
            </button>
          </div>
        </div>

        {/* Fullscreen Slide Content Stage - FIXED FRAME WITHOUT VERTICAL SCROLL */}
        <div className="relative z-10 w-full max-w-7xl mx-auto flex-1 flex flex-col justify-center overflow-hidden py-2 px-1">
          <div className="w-full flex flex-col justify-center">
            {/* Slide Category Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-1.5 mb-1.5 border-b border-amber-200/80 shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-[11px] sm:text-xs font-mono font-extrabold uppercase px-2 py-0.5 rounded bg-white text-[#8C6B18] border border-amber-300 shadow-2xs">
                  {activeSlide.badge}
                </span>
                <span className="text-xs sm:text-sm font-bold text-[#8C6B18] uppercase tracking-wide">
                  {activeSlide.category}
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm md:text-base text-slate-800 font-medium leading-normal mb-2 shrink-0">
              {activeSlide.subtitle}
            </p>

            {/* Morphing animated content */}
            <div
              key={`fs-${activeSlide.id}-${currentSlide}`}
              className={`tvpay-slide-content ${
                slideDirection === 'forward' ? 'slide-morph-forward' : 'slide-morph-backward'
              }`}
            >
              {activeSlide.renderContent(docData)}
            </div>
          </div>
        </div>

        {/* Fullscreen Bottom Navigation Controls */}
        <div className="relative z-10 w-full max-w-7xl mx-auto pt-2.5 sm:pt-3 border-t border-amber-300/80 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
          <button
            type="button"
            onClick={prevSlide}
            className="px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-bold bg-white hover:bg-amber-50 text-[#7A5B10] border border-amber-300 rounded-xl transition flex items-center gap-2 cursor-pointer shadow-xs hover:border-amber-400"
          >
            <ChevronLeft className="w-4 h-4 text-[#C59B27]" />
            <span>Trang trước</span>
          </button>

          <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-[65vw] sm:max-w-none scrollbar-none">
            {slides.map((s, idx) => {
              const isActive = idx === currentSlide;
              return (
                <button
                  key={`fs-pill-${s.id}`}
                  type="button"
                  onClick={() => goToSlide(idx)}
                  className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 cursor-pointer shrink-0 ${
                    isActive
                      ? 'bg-[#C59B27] text-white shadow-sm font-bold border border-amber-500 ring-2 ring-amber-300/60'
                      : 'bg-white/90 text-slate-700 hover:text-slate-900 border border-amber-200/80 hover:bg-amber-50'
                  }`}
                  title={s.title}
                >
                  <span className="font-mono text-xs opacity-90">{idx + 1 < 10 ? `0${idx + 1}` : idx + 1}</span>
                  <span className="hidden lg:inline text-xs truncate max-w-[140px]">
                    {getSlideLabel(idx)}
                  </span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={nextSlide}
            className="px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-bold bg-gradient-to-r from-[#D4AF37] via-[#C59B27] to-[#A87B15] hover:brightness-105 text-white border border-amber-300 rounded-xl transition flex items-center gap-2 cursor-pointer shadow-md"
          >
            <span>Trang tiếp</span>
            <ChevronRight className="w-4 h-4 text-amber-100" />
          </button>
        </div>
      </div>,
      document.body
    );
  }

  // =========================================================================
  // INLINE PRESENTATION CARD (No speaker notes, clean layout, large cards)
  // =========================================================================
  return (
    <div
      ref={containerRef}
      className={`tvpay-presentation-slides-wrapper relative w-full my-8 ${className}`}
    >
      <div className="relative bg-gradient-to-br from-[#FFFDF9] via-[#FAF5EA] to-[#F5ECDA] rounded-2xl border-2 border-amber-300/80 shadow-[0_12px_36px_rgba(197,155,39,0.14)] overflow-hidden transition-all duration-300">
        {/* Top Progress Gold Bar */}
        <div className="w-full h-1.5 bg-amber-200/50 shrink-0">
          <div
            className="h-full bg-gradient-to-r from-[#D4AF37] via-[#C59B27] to-[#8C6B18] transition-all duration-500"
            style={{ width: `${((currentSlide + 1) / totalSlides) * 100}%` }}
          />
        </div>

        {/* Header Toolbar */}
        <div className="px-5 py-3.5 sm:px-7 sm:py-4 bg-white/85 border-b border-amber-200/80 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="p-2 rounded-xl bg-amber-100/90 border border-amber-300/80 text-[#8C6B18] shrink-0 shadow-xs">
              <FileCheck2 className="w-4 h-4" />
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold tracking-wider text-[#8C6B18] font-mono bg-amber-100/90 border border-amber-300/80 px-2 py-0.5 rounded truncate">
                  {isCharter
                    ? `BÁO CÁO ĐIỀU LỆ CÔNG TY CP CUNG ỨNG VÍ ĐIỆN TỬ · ${totalSlides} SLIDES`
                    : `BÁO CÁO HỢP ĐỒNG MỞ VÀ SỬ DỤNG VÍ ĐIỆN TỬ · ${totalSlides} SLIDES`}
                </span>
                <span className="text-xs text-slate-500 hidden sm:inline">
                  · {docData.officialTitle}
                </span>
              </div>
              <h3 className="font-serif text-sm sm:text-base font-bold text-slate-900 m-0 mt-0.5 truncate">
                {activeSlide.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Slide Index Pill */}
            <span className="px-2.5 py-1 text-xs font-mono font-bold text-[#7A5B10] bg-amber-100/80 border border-amber-300/80 rounded-lg shadow-xs">
              {currentSlide + 1} / {totalSlides}
            </span>

            {/* Auto Play Toggle */}
            <button
              type="button"
              onClick={() => {
                uiSound.playClick();
                setIsAutoPlaying(!isAutoPlaying);
              }}
              className={`p-1.5 rounded-lg border transition text-xs flex items-center gap-1 cursor-pointer ${
                isAutoPlaying
                  ? 'bg-amber-100 text-[#7A5B10] border-amber-300 shadow-xs'
                  : 'bg-white text-slate-600 border-amber-200 hover:bg-amber-50'
              }`}
              title={isAutoPlaying ? 'Tạm dừng tự động chuyển slide' : 'Bật tự động chuyển slide sau 8s'}
            >
              {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span className="hidden md:inline text-xs font-semibold">
                {isAutoPlaying ? 'Đang chạy' : 'Tự chạy'}
              </span>
            </button>

            {/* Fullscreen Toggle */}
            <button
              type="button"
              onClick={toggleFullscreen}
              className="p-1.5 rounded-lg transition cursor-pointer shadow-xs flex items-center gap-1 border bg-white hover:bg-amber-50 text-slate-700 border-amber-200"
              title="Phóng to toàn màn hình (Phím F hoặc click)"
            >
              <Maximize2 className="w-3.5 h-3.5 text-[#C59B27]" />
              <span className="hidden md:inline text-xs font-semibold">
                Toàn màn hình (F)
              </span>
            </button>
          </div>
        </div>

        {/* Slide Main Body Presentation Area */}
        <div className="p-5 sm:p-7 min-h-[380px] sm:min-h-[440px] flex flex-col justify-between relative">
          <div>
            {/* Slide Category Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 mb-3.5 border-b border-amber-200/60">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-extrabold uppercase px-2 py-0.5 rounded bg-white text-[#8C6B18] border border-amber-300 shadow-2xs">
                  {activeSlide.badge}
                </span>
                <span className="text-xs sm:text-sm font-bold text-[#8C6B18] uppercase tracking-wide">
                  {activeSlide.category}
                </span>
              </div>
              <span className="text-xs text-slate-500 italic hidden sm:inline">
                Dùng phím ← và → trên bàn phím để chuyển slide
              </span>
            </div>

            {/* Slide Subtitle */}
            <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed mb-4">
              {activeSlide.subtitle}
            </p>

            {/* Dynamic Slide Content with Morph Transition */}
            <div
              key={`${activeSlide.id}-${currentSlide}`}
              className={`tvpay-slide-content ${
                slideDirection === 'forward' ? 'slide-morph-forward' : 'slide-morph-backward'
              }`}
            >
              {activeSlide.renderContent(docData)}
            </div>
          </div>

          {/* Bottom Interactive Navigation & Thumbnails */}
          <div className="mt-6 pt-4 border-t border-amber-200/80 flex flex-wrap items-center justify-between gap-3 shrink-0">
            {/* Prev Button */}
            <button
              type="button"
              onClick={prevSlide}
              className="px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-bold bg-white hover:bg-amber-50 text-[#7A5B10] border border-amber-300 rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-xs hover:border-amber-400"
            >
              <ChevronLeft className="w-4 h-4 text-[#C59B27]" />
              <span>Trang trước</span>
            </button>

            {/* Step Indicators / Dot Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-[65vw] sm:max-w-none scrollbar-none">
              {slides.map((s, idx) => {
                const isActive = idx === currentSlide;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => goToSlide(idx)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1 cursor-pointer shrink-0 ${
                      isActive
                        ? 'bg-[#C59B27] text-white shadow-sm font-bold border border-amber-500'
                        : 'bg-white/80 text-slate-600 hover:text-slate-900 border border-amber-200/60 hover:bg-white'
                    }`}
                    title={s.title}
                  >
                    <span className="font-mono text-xs opacity-90">{idx + 1 < 10 ? `0${idx + 1}` : idx + 1}</span>
                    <span className="hidden md:inline text-xs truncate max-w-[120px]">
                      {getSlideLabel(idx)}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Next Button */}
            <button
              type="button"
              onClick={nextSlide}
              className="px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-bold bg-gradient-to-r from-[#D4AF37] via-[#C59B27] to-[#A87B15] hover:brightness-105 text-white border border-amber-300 rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <span>Trang tiếp</span>
              <ChevronRight className="w-4 h-4 text-amber-100" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
