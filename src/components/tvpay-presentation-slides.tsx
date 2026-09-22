import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  AlertTriangle,
  Award,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Coins,
  CreditCard,
  Expand,
  FileCheck2,
  FileText,
  Gift,
  HelpCircle,
  Landmark,
  Layers,
  Lock,
  Maximize2,
  MessageSquare,
  Minimize2,
  Pause,
  Play,
  QrCode,
  Scale,
  Server,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Star,
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
  Search,
  Database,
  Cpu,
  RefreshCw,
  Eye,
  Key,
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

// Đường kẻ phân cách hoàng gia tinh tế
const RoyalDivider = ({ title }: { title?: string }) => (
  <div className="flex items-center justify-center gap-2.5 my-2.5 opacity-75">
    <div className="h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent flex-1" />
    {title ? (
      <span className="text-[11px] sm:text-xs font-mono uppercase font-bold text-[#8C6B18] tracking-widest px-2">
        {title}
      </span>
    ) : (
      <div className="w-1.5 h-1.5 rotate-45 bg-amber-500/80" />
    )}
    <div className="h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent flex-1" />
  </div>
);


// Biểu tượng quả cầu quốc tế mạ vàng
const GlobeIcon = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
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
  speakerNotes?: string;
  speakerName?: string;
  speakerRole?: string;
  speakerAvatar?: string;
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
  // BỘ SLIDE 1: ĐIỀU LỆ CÔNG TY CP CUNG ỨNG VÍ ĐIỆN TỬ TVPAY (12 SLIDES)
  // Chuẩn hóa 100% theo Google Doc 2: "Bộ Gen của doanh nghiệp" & 5 Giải pháp Fintech
  // =========================================================================
  const charterSlides: SlideItem[] = [
    // SLIDE 1: BÌA BÁO CÁO & ĐỊNH VỊ "BỘ GEN CỦA DOANH NGHIỆP"
    {
      id: 'charter-slide-1',
      badge: 'SLIDE 01 / 12 · BÁO CÁO TƯ VẤN',
      category: 'HỒ SƠ TƯ VẤN PHÁP LÝ · NHÓM 13 (THỊNH VƯỢNG LEGAL) · KHOA LUẬT HVNH',
      title: 'ĐIỀU LỆ CÔNG TY CỔ PHẦN CUNG ỨNG VÍ ĐIỆN TỬ TVPAY',
      subtitle: 'Bản "Bộ Gen" pháp lý tối cao định hình tổ chức, quản trị rủi ro và bảo vệ 05 Nhà đầu tư sáng lập (50 Tỷ VNĐ)',
      speakerName: 'Đoàn Ánh Phương',
      speakerRole: 'Trưởng Nhóm 13 · Điều phối viên',
      speakerAvatar: '/assets/team/anh-phuong.jpg',
      speakerNotes:
        'Kính thưa Thầy và các bạn, nếu ví một công ty cổ phần như một cơ thể sống, thì Điều lệ chính là "bộ gen" quyết định cách cơ thể đó vận hành - từ cách các cơ quan phối hợp với nhau, đến cách xử lý khi khủng hoảng xảy ra. Hôm nay, Nhóm 13 đại diện cho Thịnh Vượng Legal xin báo cáo toàn diện bản Điều lệ công ty TVPAY: không chỉ dưới góc độ một văn bản pháp lý bắt buộc khi thành lập, mà thực sự là công cụ chủ động bảo vệ quyền lợi doanh nghiệp và bảo toàn nguồn vốn 50 tỷ đồng của 05 nhà đầu tư sáng lập trong lĩnh vực ví điện tử.',
      renderContent: () => (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            <div className="stagger-1 p-4 bg-white/95 rounded-2xl border-2 border-amber-300/80 shadow-xs relative overflow-hidden">
              <RoyalFiligreeCorner className="absolute top-2 right-2" />
              <div className="flex items-center gap-2 mb-2 text-[#8C6B18]">
                <div className="p-2 rounded-xl bg-amber-100/80 border border-amber-300">
                  <Landmark className="w-5 h-5 text-amber-700" />
                </div>
                <span className="text-xs sm:text-sm font-bold uppercase tracking-wider">Doanh nghiệp thành lập</span>
              </div>
              <h4 className="text-sm sm:text-base font-bold text-slate-900 m-0 mb-1">CÔNG TY CP CUNG ỨNG VÍ ĐIỆN TỬ TVPAY</h4>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed m-0">
                Trụ sở: Số 89 Láng Hạ, Đống Đa, Hà Nội. Giấy phép trung gian thanh toán NHNN. Đại diện pháp luật: Tổng Giám đốc Lê Quang Tùng.
              </p>
            </div>

            <div className="stagger-2 p-4 bg-gradient-to-br from-amber-50/90 to-white rounded-2xl border-2 border-amber-400 shadow-xs relative overflow-hidden">
              <RoyalFiligreeCorner className="absolute top-2 right-2" />
              <div className="flex items-center gap-2 mb-2 text-amber-800">
                <div className="p-2 rounded-xl bg-amber-200/70 border border-amber-400">
                  <Coins className="w-5 h-5 text-amber-800" />
                </div>
                <span className="text-xs sm:text-sm font-bold uppercase tracking-wider">Vốn điều lệ cam kết</span>
              </div>
              <h4 className="text-sm sm:text-base font-black text-amber-900 m-0 mb-1">50.000.000.000 VNĐ (50 TỶ ĐỒNG)</h4>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed m-0">
                05 Cổ đông sáng lập góp đủ 100% bằng tiền đồng Việt Nam. Đạt điều kiện duy trì vốn pháp định tối thiểu theo Nghị định 52/2024/NĐ-CP.
              </p>
            </div>

            <div className="stagger-3 p-4 bg-white/95 rounded-2xl border-2 border-amber-300/80 shadow-xs relative overflow-hidden">
              <RoyalFiligreeCorner className="absolute top-2 right-2" />
              <div className="flex items-center gap-2 mb-2 text-[#8C6B18]">
                <div className="p-2 rounded-xl bg-amber-100/80 border border-amber-300">
                  <Scale className="w-5 h-5 text-amber-700" />
                </div>
                <span className="text-xs sm:text-sm font-bold uppercase tracking-wider">Căn cứ pháp lý chuẩn mực</span>
              </div>
              <h4 className="text-sm sm:text-base font-bold text-slate-900 m-0 mb-1">Luật DN 2020 &amp; NĐ 52/2024/NĐ-CP</h4>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed m-0">
                Tích hợp Thông tư 40/2024/TT-NHNN, Luật GDĐT 2023, thiết lập cơ chế biểu quyết 65% bảo vệ quyền kiểm soát của nhóm sáng lập.
              </p>
            </div>
          </div>

          <div className="stagger-4 p-4 bg-amber-50/80 rounded-2xl border-2 border-amber-300/80 shadow-xs">
            <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-amber-200">
              <span className="text-xs sm:text-sm font-bold text-[#7A5B10] uppercase flex items-center gap-2 font-mono">
                <Users className="w-4 h-4 text-[#8C6B18]" />
                Cơ cấu 05 Cổ đông sáng lập TVPAY (100% Cổ phần phổ thông - 50 Tỷ đồng)
              </span>
              <span className="text-xs font-mono font-bold text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded border border-amber-300">
                Khóa chuyển nhượng 03 năm (Điều 120 Luật DN)
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              <div className="p-3 bg-white rounded-xl border border-amber-300 text-center shadow-2xs">
                <strong className="block text-slate-900 text-xs sm:text-sm">Lê Quang Tùng</strong>
                <span className="text-[#8C6B18] font-bold font-mono text-xs sm:text-sm">30% · 15 Tỷ</span>
                <span className="text-[11px] sm:text-xs text-slate-500 block mt-0.5">Chủ tịch HĐQT &amp; TGĐ</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-amber-300 text-center shadow-2xs">
                <strong className="block text-slate-900 text-xs sm:text-sm">Trịnh Hoàng Sơn</strong>
                <span className="text-[#8C6B18] font-bold font-mono text-xs sm:text-sm">25% · 12.5 Tỷ</span>
                <span className="text-[11px] sm:text-xs text-slate-500 block mt-0.5">Thành viên HĐQT</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-amber-300 text-center shadow-2xs">
                <strong className="block text-slate-900 text-xs sm:text-sm">Nguyễn Minh Lân</strong>
                <span className="text-[#8C6B18] font-bold font-mono text-xs sm:text-sm">20% · 10 Tỷ</span>
                <span className="text-[11px] sm:text-xs text-slate-500 block mt-0.5">Thành viên HĐQT</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-amber-300 text-center shadow-2xs">
                <strong className="block text-slate-900 text-xs sm:text-sm">Phạm Phương Hà</strong>
                <span className="text-[#8C6B18] font-bold font-mono text-xs sm:text-sm">15% · 7.5 Tỷ</span>
                <span className="text-[11px] sm:text-xs text-slate-500 block mt-0.5">Cổ đông sáng lập</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-amber-300 text-center shadow-2xs col-span-2 sm:col-span-1">
                <strong className="block text-slate-900 text-xs sm:text-sm">Lê Thu Minh</strong>
                <span className="text-[#8C6B18] font-bold font-mono text-xs sm:text-sm">10% · 5 Tỷ</span>
                <span className="text-[11px] sm:text-xs text-slate-500 block mt-0.5">Cổ đông sáng lập</span>
              </div>
            </div>
          </div>
        </div>
      ),
    },

    // SLIDE 2: 04 NGUYÊN TẮC VÀNG SOẠN THẢO ĐIỀU LỆ
    {
      id: 'charter-slide-2',
      badge: 'SLIDE 02 / 12 · NGUYÊN TẮC VÀNG',
      category: 'PHẦN 1 · NGUYÊN TẮC SOẠN THẢO · LÊ PHƯƠNG THẢO PHỤ TRÁCH',
      title: '04 NGUYÊN TẮC VÀNG KHI SOẠN THẢO ĐIỀU LỆ FINTECH',
      subtitle: '"Đúng Luật – Đầy Đủ – Tự Nguyện – Thống Nhất" theo chuẩn mực Luật Doanh nghiệp 2020',
      speakerName: 'Lê Phương Thảo',
      speakerRole: 'Phó Nhóm 13 · Nghiên cứu cấu trúc',
      speakerAvatar: '/assets/team/le-phuong-thao.jpg',
      speakerNotes:
        'Kính thưa Thầy và các bạn, khi bắt tay vào soạn thảo Điều lệ TVPAY, Nhóm 13 luôn khắc ghi 4 nguyên tắc vàng được đúc kết từ thực tiễn: Đúng luật, Đầy đủ, Tự nguyện và Thống nhất. Đúng luật để không xâm phạm quyền lợi bên thứ ba và được cơ quan cấp phép chấp thuận; Đầy đủ nội dung theo Luật Doanh nghiệp để tạo cơ sở vận hành mạch lạc; Tự nguyện trong khuôn khổ pháp lý tôn trọng cam kết nhà đầu tư; và Thống nhất tuyệt đối với chữ ký của 5 cổ đông sáng lập. Bốn nguyên tắc này chính là nền móng để một công ty ví điện tử vận hành an toàn.',
      renderContent: () => (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div className="stagger-1 p-4 bg-white/95 rounded-2xl border-2 border-amber-300 shadow-xs relative overflow-hidden flex flex-col justify-between">
              <RoyalFiligreeCorner className="absolute top-1.5 right-1.5" />
              <div>
                <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-amber-100 text-[#7A5B10] inline-block mb-2 border border-amber-300">
                  Nguyên tắc 01
                </span>
                <h4 className="text-sm sm:text-base font-bold text-slate-900 m-0 mb-1.5">ĐÚNG LUẬT</h4>
                <p className="text-xs sm:text-sm text-slate-700 m-0 leading-relaxed">
                  Tuân thủ tuyệt đối pháp luật chuyên ngành, không trái luật, không xâm phạm quyền và lợi ích hợp pháp của bất kỳ bên thứ ba nào.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-amber-200/70 text-[11px] sm:text-xs font-semibold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>Không có điều khoản vô hiệu</span>
              </div>
            </div>

            <div className="stagger-2 p-4 bg-white/95 rounded-2xl border-2 border-amber-300 shadow-xs relative overflow-hidden flex flex-col justify-between">
              <RoyalFiligreeCorner className="absolute top-1.5 right-1.5" />
              <div>
                <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-amber-100 text-[#7A5B10] inline-block mb-2 border border-amber-300">
                  Nguyên tắc 02
                </span>
                <h4 className="text-sm sm:text-base font-bold text-slate-900 m-0 mb-1.5">ĐẦY ĐỦ</h4>
                <p className="text-xs sm:text-sm text-slate-700 m-0 leading-relaxed">
                  Phải bao hàm đầy đủ các nội dung bắt buộc theo Luật Doanh nghiệp (tên, trụ sở, vốn, cổ đông, quyền hạn, cơ cấu quản lý).
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-amber-200/70 text-[11px] sm:text-xs font-semibold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>Cơ sở vững chắc cho quản trị</span>
              </div>
            </div>

            <div className="stagger-3 p-4 bg-white/95 rounded-2xl border-2 border-amber-300 shadow-xs relative overflow-hidden flex flex-col justify-between">
              <RoyalFiligreeCorner className="absolute top-1.5 right-1.5" />
              <div>
                <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-amber-100 text-[#7A5B10] inline-block mb-2 border border-amber-300">
                  Nguyên tắc 03
                </span>
                <h4 className="text-sm sm:text-base font-bold text-slate-900 m-0 mb-1.5">TỰ NGUYỆN</h4>
                <p className="text-xs sm:text-sm text-slate-700 m-0 leading-relaxed">
                  Các cổ đông được tự do, tự nguyện thỏa thuận các cơ chế quản trị và phân chia lợi ích đặc thù, miễn không trái luật định.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-amber-200/70 text-[11px] sm:text-xs font-semibold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>Tôn trọng cam kết cổ đông</span>
              </div>
            </div>

            <div className="stagger-4 p-4 bg-white/95 rounded-2xl border-2 border-amber-300 shadow-xs relative overflow-hidden flex flex-col justify-between">
              <RoyalFiligreeCorner className="absolute top-1.5 right-1.5" />
              <div>
                <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-amber-100 text-[#7A5B10] inline-block mb-2 border border-amber-300">
                  Nguyên tắc 04
                </span>
                <h4 className="text-sm sm:text-base font-bold text-slate-900 m-0 mb-1.5">THỐNG NHẤT</h4>
                <p className="text-xs sm:text-sm text-slate-700 m-0 leading-relaxed">
                  Điều lệ phải đạt sự đồng thuận tuyệt đối và có đủ chữ ký của 05 cổ đông sáng lập trước khi nộp hồ sơ xin cấp phép NHNN.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-amber-200/70 text-[11px] sm:text-xs font-semibold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>100% Chữ ký cổ đông sáng lập</span>
              </div>
            </div>
          </div>

          <div className="p-3.5 bg-gradient-to-r from-amber-100/90 via-amber-50/90 to-amber-100/90 rounded-xl border border-amber-300 flex items-center justify-between text-xs sm:text-sm">
            <span className="font-serif font-bold text-[#7A5B10] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#C59B27]" />
              Quy tắc cốt lõi: "Đúng Luật – Đầy Đủ – Tự Nguyện – Thống Nhất"
            </span>
            <span className="text-slate-600 hidden md:inline">
              Áp dụng xuyên suốt quá trình tư vấn và thiết lập bộ máy TVPAY
            </span>
          </div>
        </div>
      ),
    },

    // SLIDE 3: 05 VAI TRÒ PHÁP LÝ CỐT LÕI SUỐT VÒNG ĐỜI DOANH NGHIỆP
    {
      id: 'charter-slide-3',
      badge: 'SLIDE 03 / 12 · VAI TRÒ ĐIỀU LỆ',
      category: 'PHẦN 1 · VAI TRÒ DOANH NGHIỆP · LÊ PHƯƠNG THẢO PHỤ TRÁCH',
      title: '05 VAI TRÒ PHÁP LÝ CỐT LÕI CỦA ĐIỀU LỆ TRONG SUỐT VÒNG ĐỜI DN',
      subtitle: 'Nền tảng pháp lý giúp TVPAY hoạt động rõ ràng, minh bạch, kiểm soát rủi ro và phát triển bền vững',
      speakerName: 'Lê Phương Thảo',
      speakerRole: 'Phó Nhóm 13 · Nghiên cứu cấu trúc',
      speakerAvatar: '/assets/team/le-phuong-thao.jpg',
      speakerNotes:
        'Kính thưa quý vị, Điều lệ công ty không chỉ là thủ tục hành chính khi thành lập doanh nghiệp, mà nó mang trên mình 5 vai trò sống còn trong suốt vòng đời: Thứ nhất, quy định cách thức tổ chức và phân định quyền hạn, trách nhiệm giữa các bộ phận; Thứ hai, là tài liệu pháp lý chính thức giúp công ty hoạt động chuẩn chỉ; Thứ ba, là cơ sở tối cao để giải quyết tranh chấp khi có mâu thuẫn nội bộ; Thứ tư, định hướng thành viên và nhân viên về mục tiêu chung; Và thứ năm, hỗ trợ quản lý điều hành minh bạch, giúp mọi quyết định được thực hiện theo nguyên tắc đã thống nhất.',
      renderContent: () => (
        <div className="space-y-3.5">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <div className="stagger-1 p-3.5 bg-white/95 rounded-2xl border-2 border-amber-300 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 rounded-lg bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 font-bold mb-2">
                  1
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 m-0 mb-1">Cách thức tổ chức &amp; hoạt động</h4>
                <p className="text-xs sm:text-sm text-slate-600 m-0 leading-relaxed">
                  Phân định quyền hạn và trách nhiệm giữa ĐHĐCĐ, HĐQT, Ban Giám đốc và Ban Kiểm soát.
                </p>
              </div>
              <span className="text-[11px] font-mono text-[#8C6B18] font-bold mt-2">Trật tự tổ chức</span>
            </div>

            <div className="stagger-2 p-3.5 bg-white/95 rounded-2xl border-2 border-amber-300 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 rounded-lg bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 font-bold mb-2">
                  2
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 m-0 mb-1">Tài liệu pháp lý chính thức</h4>
                <p className="text-xs sm:text-sm text-slate-600 m-0 leading-relaxed">
                  Văn bản có giá trị pháp lý cao nhất trong doanh nghiệp, giúp công ty hoạt động đúng quy định pháp luật.
                </p>
              </div>
              <span className="text-[11px] font-mono text-[#8C6B18] font-bold mt-2">Chuẩn mực pháp lý</span>
            </div>

            <div className="stagger-3 p-3.5 bg-white/95 rounded-2xl border-2 border-amber-300 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 rounded-lg bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 font-bold mb-2">
                  3
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 m-0 mb-1">Cơ sở giải quyết tranh chấp</h4>
                <p className="text-xs sm:text-sm text-slate-600 m-0 leading-relaxed">
                  Căn cứ giải quyết mâu thuẫn giữa các cổ đông sáng lập, giữa cổ đông với người quản lý công ty.
                </p>
              </div>
              <span className="text-[11px] font-mono text-[#8C6B18] font-bold mt-2">Hòa giải nội bộ</span>
            </div>

            <div className="stagger-4 p-3.5 bg-white/95 rounded-2xl border-2 border-amber-300 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 rounded-lg bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 font-bold mb-2">
                  4
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 m-0 mb-1">Định hướng thành viên &amp; nhân sự</h4>
                <p className="text-xs sm:text-sm text-slate-600 m-0 leading-relaxed">
                  Tạo sự thống nhất về mục tiêu, trách nhiệm nghề nghiệp và quy chuẩn đạo đức trong ngành ví điện tử.
                </p>
              </div>
              <span className="text-[11px] font-mono text-[#8C6B18] font-bold mt-2">Đồng thuận văn hóa</span>
            </div>

            <div className="stagger-5 p-3.5 bg-white/95 rounded-2xl border-2 border-amber-300 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 rounded-lg bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 font-bold mb-2">
                  5
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 m-0 mb-1">Hỗ trợ quản lý &amp; điều hành</h4>
                <p className="text-xs sm:text-sm text-slate-600 m-0 leading-relaxed">
                  Đảm bảo mọi quyết định kinh doanh và giải ngân tài chính được thực thi theo đúng nguyên tắc đã thống nhất.
                </p>
              </div>
              <span className="text-[11px] font-mono text-[#8C6B18] font-bold mt-2">Minh bạch điều hành</span>
            </div>
          </div>

          <div className="p-3 bg-amber-50 rounded-xl border border-amber-300/80 text-center">
            <span className="text-xs sm:text-sm font-bold text-amber-900 font-serif">
              "Tóm lại: Điều lệ là nền tảng pháp lý giúp doanh nghiệp hoạt động rõ ràng, minh bạch và hiệu quả."
            </span>
          </div>
        </div>
      ),
    },

    // SLIDE 4: CẤU TRÚC TOÀN VĂN 09 CHƯƠNG ĐIỀU LỆ
    {
      id: 'charter-slide-4',
      badge: 'SLIDE 04 / 12 · CẤU TRÚC ĐIỀU LỆ',
      category: 'PHẦN 1 · CẤU TRÚC 09 CHƯƠNG · LÊ PHƯƠNG THẢO PHỤ TRÁCH',
      title: 'HỆ THỐNG CẤU TRÚC 09 CHƯƠNG TOÀN VĂN ĐIỀU LỆ MẪU TVPAY',
      subtitle: 'Khung pháp lý hoàn chỉnh thiết lập trật tự quản trị, thẩm quyền và bảo vệ quyền lợi cổ đông',
      speakerName: 'Lê Phương Thảo',
      speakerRole: 'Phó Nhóm 13 · Nghiên cứu cấu trúc',
      speakerAvatar: '/assets/team/le-phuong-thao.jpg',
      speakerNotes:
        'Thưa Thầy và các bạn, Điều lệ TVPAY được cấu trúc thành 9 chương mạch lạc, tuân thủ Luật Doanh nghiệp 2020 và may đo theo đặc thù ví điện tử. Trong đó, 4 chương trọng tâm nhất là Chương II về cơ cấu vốn 50 tỷ; Chương IV về thẩm quyền chiến lược của ĐHĐCĐ; Chương V về phân định quyền hạn HĐQT và TGĐ để chống lạm quyền; và Chương VII về quản trị tài chính, bắt buộc trích lập Quỹ dự phòng an toàn hệ thống trước khi chia cổ tức.',
      renderContent: () => (
        <div className="space-y-3.5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs sm:text-sm">
            <div className="p-3.5 bg-white rounded-xl border border-amber-300 shadow-2xs">
              <span className="font-mono text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">Chương I</span>
              <h4 className="font-bold text-slate-900 mt-1 mb-0.5">Quy định chung</h4>
              <p className="text-slate-600 m-0 text-xs sm:text-[13px] leading-relaxed">
                Tên công ty, trụ sở chính tại 89 Láng Hạ, ngành nghề kinh doanh ví điện tử, tư cách pháp nhân và đại diện pháp luật.
              </p>
            </div>

            <div className="p-3.5 bg-amber-50/90 rounded-xl border-2 border-amber-400 shadow-2xs">
              <span className="font-mono text-xs font-bold text-amber-900 bg-amber-200 px-2 py-0.5 rounded">Chương II · Trọng tâm</span>
              <h4 className="font-bold text-amber-950 mt-1 mb-0.5">Vốn điều lệ, cổ phần &amp; cổ đông</h4>
              <p className="text-slate-700 m-0 text-xs sm:text-[13px] leading-relaxed">
                Vốn 50 tỷ đồng, 5 cổ đông sáng lập, quyền ưu tiên mua cổ phần, chuyển nhượng và kiểm soát nhà đầu tư nước ngoài.
              </p>
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-amber-300 shadow-2xs">
              <span className="font-mono text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">Chương III</span>
              <h4 className="font-bold text-slate-900 mt-1 mb-0.5">Quyền &amp; nghĩa vụ cổ đông</h4>
              <p className="text-slate-600 m-0 text-xs sm:text-[13px] leading-relaxed">
                Quyền biểu quyết, nhận cổ tức, tiếp cận thông tin báo cáo tài chính và nghĩa vụ thanh toán đủ vốn góp.
              </p>
            </div>

            <div className="p-3.5 bg-amber-50/90 rounded-xl border-2 border-amber-400 shadow-2xs">
              <span className="font-mono text-xs font-bold text-amber-900 bg-amber-200 px-2 py-0.5 rounded">Chương IV · Trọng tâm</span>
              <h4 className="font-bold text-amber-950 mt-1 mb-0.5">Đại hội đồng cổ đông</h4>
              <p className="text-slate-700 m-0 text-xs sm:text-[13px] leading-relaxed">
                Cơ quan quyền lực tối cao, thẩm quyền thông qua sửa đổi Điều lệ, tái cấu trúc và tỷ lệ biểu quyết thông qua 65%.
              </p>
            </div>

            <div className="p-3.5 bg-amber-50/90 rounded-xl border-2 border-amber-400 shadow-2xs">
              <span className="font-mono text-xs font-bold text-amber-900 bg-amber-200 px-2 py-0.5 rounded">Chương V · Trọng tâm</span>
              <h4 className="font-bold text-amber-950 mt-1 mb-0.5">HĐQT &amp; Ban Tổng Giám đốc</h4>
              <p className="text-slate-700 m-0 text-xs sm:text-[13px] leading-relaxed">
                Phân định thẩm quyền phê duyệt hợp đồng &gt;5 tỷ đồng, nhiệm kỳ 5 năm, ngăn ngừa lạm quyền và xung đột lợi ích.
              </p>
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-amber-300 shadow-2xs">
              <span className="font-mono text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">Chương VI</span>
              <h4 className="font-bold text-slate-900 mt-1 mb-0.5">Ban Kiểm soát</h4>
              <p className="text-slate-600 m-0 text-xs sm:text-[13px] leading-relaxed">
                Bộ máy giám sát độc lập, kiểm tra sổ sách kế toán, quy trình an toàn thông tin và báo cáo trực tiếp ĐHĐCĐ.
              </p>
            </div>

            <div className="p-3.5 bg-amber-50/90 rounded-xl border-2 border-amber-400 shadow-2xs">
              <span className="font-mono text-xs font-bold text-amber-900 bg-amber-200 px-2 py-0.5 rounded">Chương VII · Trọng tâm</span>
              <h4 className="font-bold text-amber-950 mt-1 mb-0.5">Tài chính, Quỹ rủi ro &amp; Cổ tức</h4>
              <p className="text-slate-700 m-0 text-xs sm:text-[13px] leading-relaxed">
                Bắt buộc trích lập Quỹ dự phòng rủi ro &amp; Quỹ an toàn hệ thống trước khi chia cổ tức để bảo toàn giấy phép NHNN.
              </p>
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-amber-300 shadow-2xs">
              <span className="font-mono text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">Chương VIII</span>
              <h4 className="font-bold text-slate-900 mt-1 mb-0.5">Giải quyết tranh chấp &amp; Khủng hoảng</h4>
              <p className="text-slate-600 m-0 text-xs sm:text-[13px] leading-relaxed">
                Cơ chế thương lượng hòa giải nội bộ, trọng tài VIAC hoặc Tòa án, và quy trình họp khẩn cấp khi bị tấn công mạng.
              </p>
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-amber-300 shadow-2xs">
              <span className="font-mono text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">Chương IX</span>
              <h4 className="font-bold text-slate-900 mt-1 mb-0.5">Điều khoản thi hành &amp; Hiệu lực</h4>
              <p className="text-slate-600 m-0 text-xs sm:text-[13px] leading-relaxed">
                Sửa đổi bổ sung điều lệ, cam kết tuân thủ của toàn thể cổ đông và chữ ký chứng thực của 5 cổ đông sáng lập.
              </p>
            </div>
          </div>
        </div>
      ),
    },

    // SLIDE 5: CƠ CẤU 05 CỔ ĐÔNG SÁNG LẬP & 50 TỶ VỐN ĐIỀU LỆ
    {
      id: 'charter-slide-5',
      badge: 'SLIDE 05 / 12 · CƠ CẤU VỐN SÁNG LẬP',
      category: 'PHẦN 2 · VỐN & CỔ ĐÔNG · VŨ PHƯƠNG THẢO PHỤ TRÁCH',
      title: 'CƠ CẤU 05 CỔ ĐÔNG SÁNG LẬP & DUY TRÌ VỐN ĐIỀU LỆ 50 TỶ ĐỒNG',
      subtitle: 'Cơ chế biểu quyết bảo vệ 65% và cam kết khóa chuyển nhượng 3 năm đầu cho nhà đầu tư',
      speakerName: 'Vũ Phương Thảo',
      speakerRole: 'Chuyên viên Quản trị Cổ đông',
      speakerAvatar: '/assets/team/phuong-thao.jpg',
      speakerNotes:
        'Kính thưa Thầy và các bạn, 50 tỷ đồng là điều kiện pháp định tối thiểu sống còn để duy trì giấy phép ví điện tử theo Nghị định 52/2024. Nhóm tư vấn đã thiết kế cơ cấu cổ phần đảm bảo 100% bằng tiền VNĐ, phân bổ cho 5 nhà đầu tư sáng lập: ông Lê Quang Tùng nắm 30%, ông Trịnh Hoàng Sơn 25%, ông Nguyễn Minh Lân 20%, bà Phạm Phương Hà 15% và bà Lê Thu Minh 10%. Với tỷ lệ biểu quyết 65% theo Luật Doanh nghiệp, các quyết định lớn bắt buộc phải có sự đồng thuận của nhóm sáng lập, triệt tiêu nguy cơ bị thâu tóm.',
      renderContent: () => (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-white/95 rounded-2xl border-2 border-amber-300 shadow-xs">
              <h4 className="text-sm sm:text-base font-bold text-slate-900 m-0 mb-3 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-600" />
                Cơ chế bảo vệ biểu quyết 65% cổ đông sáng lập
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700 m-0 p-0 list-none">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Quyết định trọng yếu:</strong> Sửa đổi điều lệ, thay đổi vốn, sáp nhập cần tối thiểu 65% tổng số phiếu biểu quyết.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Khóa cổ phần 03 năm:</strong> Theo Điều 120 Luật Doanh nghiệp 2020, cổ đông sáng lập chỉ được tự do chuyển nhượng cho nhau.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Quyền ưu tiên mua (ROFR):</strong> Khi chào bán ra ngoài, cổ đông còn lại có quyền ưu tiên mua tương ứng tỷ lệ sở hữu.</span>
                </li>
              </ul>
            </div>

            <div className="p-4 bg-gradient-to-br from-amber-50 to-white rounded-2xl border-2 border-amber-400 shadow-xs">
              <h4 className="text-sm sm:text-base font-bold text-amber-950 m-0 mb-3 flex items-center gap-2">
                <Scale className="w-5 h-5 text-amber-700" />
                Bảo toàn điều kiện cấp phép ví điện tử tại NHNN
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700 m-0 p-0 list-none">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span><strong>Vốn thực góp 100%:</strong> Góp đủ trong 90 ngày kể từ ngày cấp GCN đăng ký doanh nghiệp.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span><strong>Không được dùng vốn ủy thác:</strong> Cổ đông cam kết nguồn vốn hợp pháp, không dùng tiền vay hoặc tiền rửa.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span><strong>Duy trì liên tục:</strong> Không để vốn chủ sở hữu tụt dưới mức 50 tỷ đồng trong mọi thời kỳ hoạt động.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },

    // SLIDE 6: GIẢI PHÁP 1: ỔN ĐỊNH CƠ CẤU CỔ ĐÔNG & KIỂM SOÁT NĐT NGOẠI
    {
      id: 'charter-slide-6',
      badge: 'SLIDE 06 / 12 · GIẢI PHÁP FINTECH 1',
      category: 'PHẦN 3 · 05 GIẢI PHÁP ĐẶC THÙ VÍ ĐIỆN TỬ · PHẠM DẠ THẢO PHỤ TRÁCH',
      title: 'GIẢI PHÁP 1: BẢO VỆ SỰ ỔN ĐỊNH CƠ CẤU CỔ ĐÔNG SÁNG LẬP',
      subtitle: 'Cơ chế thông báo chuyển nhượng, quyền ưu tiên mua và kiểm soát nhà đầu tư nước ngoài',
      speakerName: 'Phạm Dạ Thảo',
      speakerRole: 'Chuyên viên Pháp chế Đầu tư',
      speakerAvatar: '/assets/team/pham-da-thao.jpg',
      speakerNotes:
        'Kính thưa Thầy và các bạn, với một công ty Fintech kinh doanh ví điện tử, sự ổn định của cơ cấu cổ đông là yếu tố quyết định sự sống còn. Google Doc 2 đã nhấn mạnh giải pháp then chốt: Với các giao dịch có thể làm thay đổi cơ cấu sở hữu - đặc biệt là chuyển nhượng cho nhà đầu tư nước ngoài - Điều lệ TVPAY thiết lập cơ chế thông báo trước và quyền ưu tiên mua cổ phần rõ ràng, tránh nguy cơ xáo trộn đột ngột hoặc thâu tóm thù địch từ bên ngoài.',
      renderContent: () => (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            <div className="stagger-1 p-4 bg-white/95 rounded-2xl border-2 border-amber-300 shadow-xs">
              <div className="flex items-center gap-2 mb-2 text-[#8C6B18]">
                <Clock className="w-5 h-5 text-amber-600" />
                <h4 className="text-sm sm:text-base font-bold text-slate-900 m-0">Quy trình thông báo trước 30 ngày</h4>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed m-0">
                Bất kỳ cổ đông nào muốn chuyển nhượng cổ phần phải gửi thông báo bằng văn bản đến HĐQT trước ít nhất 30 ngày, nêu rõ số lượng và giá chào bán.
              </p>
            </div>

            <div className="stagger-2 p-4 bg-white/95 rounded-2xl border-2 border-amber-300 shadow-xs">
              <div className="flex items-center gap-2 mb-2 text-[#8C6B18]">
                <ShieldCheck className="w-5 h-5 text-amber-600" />
                <h4 className="text-sm sm:text-base font-bold text-slate-900 m-0">Quyền ưu tiên mua (ROFR)</h4>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed m-0">
                Các cổ đông sáng lập còn lại được quyền ưu tiên mua lại cổ phần đó theo điều kiện ngang bằng, bảo đảm tỷ lệ chi phối thuộc về nhóm sáng lập.
              </p>
            </div>

            <div className="stagger-3 p-4 bg-white/95 rounded-2xl border-2 border-amber-300 shadow-xs">
              <div className="flex items-center gap-2 mb-2 text-[#8C6B18]">
                <GlobeIcon className="w-5 h-5 text-amber-600" />
                <h4 className="text-sm sm:text-base font-bold text-slate-900 m-0">Kiểm soát nhà đầu tư ngoại</h4>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed m-0">
                Chuyển nhượng cho nhà đầu tư nước ngoài bắt buộc phải tuân thủ trần sở hữu (room ngoại), phê duyệt của NHNN và không làm gián đoạn hạ tầng ví.
              </p>
            </div>
          </div>

          <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-300 text-xs sm:text-sm text-slate-800">
            <strong>Trích dẫn kịch bản Google Doc 2:</strong> "Điều lệ phải thiết lập cơ chế thông báo và quyền ưu tiên rõ ràng, tránh xáo trộn đột ngột trong quản trị khi đón nhận dòng vốn đầu tư mới."
          </div>
        </div>
      ),
    },

    // SLIDE 7: GIẢI PHÁP 2: PHÂN ĐỊNH THẨM QUYỀN ĐHĐCĐ - HĐQT - TỔNG GIÁM ĐỐC
    {
      id: 'charter-slide-7',
      badge: 'SLIDE 07 / 12 · GIẢI PHÁP FINTECH 2',
      category: 'PHẦN 3 · 05 GIẢI PHÁP ĐẶC THÙ VÍ ĐIỆN TỬ · PHẠM DẠ THẢO PHỤ TRÁCH',
      title: 'GIẢI PHÁP 2: PHÂN ĐỊNH THẨM QUYỀN ĐHĐCĐ - HĐQT - TỔNG GIÁM ĐỐC',
      subtitle: 'Ngăn chặn chồng chéo, lạm quyền và cơ chế kiểm soát hợp đồng trọng yếu trên 5 tỷ đồng',
      speakerName: 'Phạm Dạ Thảo',
      speakerRole: 'Chuyên viên Pháp chế Đầu tư',
      speakerAvatar: '/assets/team/pham-da-thao.jpg',
      speakerNotes:
        'Kính thưa Thầy và các bạn, giải pháp cốt lõi thứ hai được nêu trong Google Doc 2 là phân định rạch ròi thẩm quyền giữa Đại hội đồng cổ đông, Hội đồng quản trị và Tổng Giám đốc. Trong công ty Fintech, tốc độ ra quyết định rất cao nhưng nếu thiếu cơ chế kiểm soát sẽ dẫn tới lạm quyền hoặc thất thoát tài sản. Điều lệ TVPAY quy định: TGĐ quyết định các hợp đồng vận hành dưới 5 tỷ; HĐQT phê duyệt từ 5 đến 20 tỷ; và trên 20 tỷ hoặc trên 35% tài sản phải do ĐHĐCĐ thông qua.',
      renderContent: () => (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            <div className="p-4 bg-white/95 rounded-2xl border-2 border-amber-300 shadow-xs">
              <span className="font-mono text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">Cấp 1 · Tối cao</span>
              <h4 className="text-sm sm:text-base font-bold text-slate-900 mt-2 mb-1">ĐẠI HỘI ĐỒNG CỔ ĐÔNG</h4>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed m-0 mb-2">
                Quyết định chiến lược phát triển, thay đổi vốn điều lệ, sửa đổi Điều lệ, giao dịch &gt;35% tổng tài sản hoặc &gt;20 tỷ đồng.
              </p>
              <span className="text-[11px] font-mono text-emerald-700 font-bold">Biểu quyết 65% thông qua</span>
            </div>

            <div className="p-4 bg-amber-50/90 rounded-2xl border-2 border-amber-400 shadow-xs">
              <span className="font-mono text-xs font-bold text-amber-900 bg-amber-200 px-2 py-0.5 rounded">Cấp 2 · Quản trị &amp; Giám sát</span>
              <h4 className="text-sm sm:text-base font-bold text-amber-950 mt-2 mb-1">HỘI ĐỒNG QUẢN TRỊ (03 TV)</h4>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed m-0 mb-2">
                Phê duyệt hợp đồng mua sắm hạ tầng CNTT, giải pháp ví từ 5 đến 20 tỷ đồng; bổ nhiệm, giám sát và bãi nhiệm Tổng Giám đốc.
              </p>
              <span className="text-[11px] font-mono text-amber-800 font-bold">Quyết định tập thể đa số</span>
            </div>

            <div className="p-4 bg-white/95 rounded-2xl border-2 border-amber-300 shadow-xs">
              <span className="font-mono text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">Cấp 3 · Điều hành tác nghiệp</span>
              <h4 className="text-sm sm:text-base font-bold text-slate-900 mt-2 mb-1">TỔNG GIÁM ĐỐC</h4>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed m-0 mb-2">
                Đại diện pháp luật, điều hành hoạt động kinh doanh hàng ngày, ký hợp đồng &lt;5 tỷ đồng trong hạn mức kế hoạch ngân sách đã duyệt.
              </p>
              <span className="text-[11px] font-mono text-blue-700 font-bold">Chịu trách nhiệm cá nhân</span>
            </div>
          </div>

          <div className="p-3.5 bg-white rounded-xl border border-amber-300 text-xs sm:text-sm text-slate-700">
            <strong>Ngăn ngừa lạm quyền &amp; rút ruột:</strong> Bất kỳ hợp đồng nào ký kết giữa công ty với cổ đông, người quản trị hoặc người có liên quan đều phải báo cáo và được HĐQT/ĐHĐCĐ chấp thuận theo quy định tại Điều 167 Luật DN.
          </div>
        </div>
      ),
    },

    // SLIDE 8: GIẢI PHÁP 3: DUY TRÌ VỐN 50 TỶ & BẮT BUỘC TRÍCH LẬP QUỸ RỦI RO
    {
      id: 'charter-slide-8',
      badge: 'SLIDE 08 / 12 · GIẢI PHÁP FINTECH 3',
      category: 'PHẦN 3 · 05 GIẢI PHÁP ĐẶC THÙ VÍ ĐIỆN TỬ · NGUYỄN HỒNG NHUNG PHỤ TRÁCH',
      title: 'GIẢI PHÁP 3: DUY TRÌ VỐN 50 TỶ & BẮT BUỘC TRÍCH LẬP QUỸ RỦI RO',
      subtitle: 'Điểm cốt lõi ngành ví điện tử: Trích lập Quỹ dự phòng rủi ro & Quỹ an toàn hệ thống trước khi chia cổ tức',
      speakerName: 'Nguyễn Hồng Nhung',
      speakerRole: 'Chuyên viên Pháp chế Tài chính',
      speakerAvatar: '/assets/team/hong-nhung.jpg',
      speakerNotes:
        'Kính thưa Thầy và các bạn, đây chính là điểm rất riêng và đắt giá nhất của ngành ví điện tử được nhấn mạnh trong Google Doc 2. Quản lý tài chính ở TVPAY chặt chẽ hơn nhiều so với doanh nghiệp thông thường. Pháp luật yêu cầu duy trì vốn điều lệ tối thiểu 50 tỷ đồng, nên Điều lệ TVPAY bắt buộc phải trích lập Quỹ dự phòng rủi ro và Quỹ bảo đảm an toàn hệ thống TRƯỚC CẢ KHI CHIA CỔ TỨC. Đây chính là "bộ đệm" tài chính sống còn giúp công ty giữ được giấy phép của NHNN và có nguồn lực bồi thường ngay lập tức khi xảy ra sự cố kỹ thuật.',
      renderContent: () => (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-white/95 rounded-2xl border-2 border-amber-300 shadow-xs">
              <div className="flex items-center gap-2 mb-2 text-[#8C6B18]">
                <ShieldAlert className="w-5 h-5 text-amber-600" />
                <h4 className="text-sm sm:text-base font-bold text-slate-900 m-0">Quỹ dự phòng rủi ro &amp; An toàn hệ thống</h4>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700 m-0 p-0 list-none">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Trích lập bắt buộc:</strong> Hàng năm trích tối thiểu 5% lợi nhuận sau thuế vào Quỹ dự phòng rủi ro cho đến khi đạt 10% vốn điều lệ.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Ưu tiên trước cổ tức:</strong> Tuyệt đối không được chia cổ tức nếu chưa bù đắp lỗ lũy kế và chưa trích lập đủ quỹ rủi ro.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Nguồn bồi hoàn tức thì:</strong> Quỹ là nguồn vốn sẵn sàng chi trả bồi thường cho khách hàng khi lỗi kỹ thuật phát sinh.</span>
                </li>
              </ul>
            </div>

            <div className="p-4 bg-gradient-to-br from-amber-50 to-white rounded-2xl border-2 border-amber-400 shadow-xs">
              <div className="flex items-center gap-2 mb-2 text-amber-800">
                <Landmark className="w-5 h-5 text-amber-700" />
                <h4 className="text-sm sm:text-base font-bold text-amber-950 m-0">Tài khoản đảm bảo thanh toán (Bảo toàn 1:1)</h4>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700 m-0 p-0 list-none">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span><strong>Tách biệt 100%:</strong> Tài khoản đảm bảo thanh toán tại ngân hàng liên kết tách biệt hoàn toàn với tài khoản chi phí của TVPAY.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span><strong>Không được thấu chi:</strong> Cấm tuyệt đối việc sử dụng tiền trong tài khoản ví người dùng để cho vay hoặc kinh doanh.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span><strong>Kiểm toán độc lập:</strong> Định kỳ kiểm toán số dư đảm bảo và báo cáo số liệu hàng ngày về Ngân hàng Nhà nước.</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="p-3 bg-amber-100/80 rounded-xl border border-amber-300 text-center text-xs sm:text-sm font-semibold text-amber-950">
            Bộ đệm giữ giấy phép NHNN: "Không có quỹ rủi ro vững chắc - Không có an toàn hoạt động cho ví điện tử."
          </div>
        </div>
      ),
    },

    // SLIDE 9: GIẢI PHÁP 4: BẢO VỆ TÀI SẢN TRÍ TUỆ & NON-COMPETE FINTECH
    {
      id: 'charter-slide-9',
      badge: 'SLIDE 09 / 12 · GIẢI PHÁP FINTECH 4',
      category: 'PHẦN 3 · 05 GIẢI PHÁP ĐẶC THÙ VÍ ĐIỆN TỬ · KIỀU HOÀI THU PHỤ TRÁCH',
      title: 'GIẢI PHÁP 4: BẢO VỆ TÀI SẢN TRÍ TUỆ & NON-COMPETE TRONG FINTECH',
      subtitle: 'Khẳng định quyền sở hữu tuyệt đối với mã nguồn, thuật toán và cam kết bảo mật sau khi thôi việc',
      speakerName: 'Kiều Hoài Thu',
      speakerRole: 'Chuyên viên Sở hữu Trí tuệ Fintech',
      speakerAvatar: '/assets/team/kieu-hoai-thu.jpg',
      speakerNotes:
        'Kính thưa Thầy và các bạn, với doanh nghiệp Fintech, tài sản lớn nhất không phải nhà xưởng hay máy móc, mà chính là mã nguồn phần mềm, thuật toán thanh toán và cơ sở dữ liệu khách hàng. Google Doc 2 khẳng định giải pháp thứ tư: Điều lệ TVPAY quy định rõ quyền sở hữu tuyệt đối của công ty đối với toàn bộ tài sản trí tuệ do nhân sự sáng tạo trong thời gian làm việc; đồng thời thiết lập nghĩa vụ bảo mật thông tin và cam kết hạn chế cạnh tranh (Non-Compete) không được đầu quân cho đối thủ trực tiếp trong vòng 24 tháng sau khi rời đi.',
      renderContent: () => (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            <div className="p-4 bg-white/95 rounded-2xl border-2 border-amber-300 shadow-xs">
              <div className="flex items-center gap-2 mb-2 text-[#8C6B18]">
                <Cpu className="w-5 h-5 text-amber-600" />
                <h4 className="text-sm sm:text-base font-bold text-slate-900 m-0">Sở hữu mã nguồn &amp; Thuật toán</h4>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed m-0">
                100% mã nguồn ví TVPAY, API tích hợp, cơ chế mã hóa token và giải pháp bảo mật sinh trắc học thuộc quyền sở hữu độc quyền của pháp nhân TVPAY.
              </p>
            </div>

            <div className="p-4 bg-white/95 rounded-2xl border-2 border-amber-300 shadow-xs">
              <div className="flex items-center gap-2 mb-2 text-[#8C6B18]">
                <Database className="w-5 h-5 text-amber-600" />
                <h4 className="text-sm sm:text-base font-bold text-slate-900 m-0">Bảo mật dữ liệu người dùng</h4>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed m-0">
                Dữ liệu định danh eKYC và lịch sử giao dịch được bảo vệ theo Luật An ninh mạng và Luật Bảo vệ dữ liệu cá nhân. Nghiêm cấm trích xuất trái phép.
              </p>
            </div>

            <div className="p-4 bg-white/95 rounded-2xl border-2 border-amber-300 shadow-xs">
              <div className="flex items-center gap-2 mb-2 text-[#8C6B18]">
                <Lock className="w-5 h-5 text-amber-600" />
                <h4 className="text-sm sm:text-base font-bold text-slate-900 m-0">Cam kết Non-Compete (24 tháng)</h4>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed m-0">
                Cổ đông sáng lập và nhân sự công nghệ chủ chốt cam kết không làm việc cho các tổ chức ví điện tử đối thủ trong 24 tháng sau khi thôi nhiệm.
              </p>
            </div>
          </div>

          <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-300 text-xs sm:text-sm text-slate-700 flex items-center justify-between">
            <span><strong>Chế tài nghiêm khắc:</strong> Vi phạm bảo mật bí mật kinh doanh phải bồi thường toàn bộ thiệt hại và chịu trách nhiệm hình sự.</span>
            <span className="font-mono text-amber-800 font-bold hidden sm:inline">Điều 42 Điều lệ TVPAY</span>
          </div>
        </div>
      ),
    },

    // SLIDE 10: GIẢI PHÁP 5: CƠ CHẾ KHẨN CẤP ỨNG PHÓ KHỦNG HOẢNG AN NINH MẠNG
    {
      id: 'charter-slide-10',
      badge: 'SLIDE 10 / 12 · GIẢI PHÁP FINTECH 5',
      category: 'PHẦN 3 · 05 GIẢI PHÁP ĐẶC THÙ VÍ ĐIỆN TỬ · KIỀU HOÀI THU PHỤ TRÁCH',
      title: 'GIẢI PHÁP 5: CƠ CHẾ ỨNG PHÓ KHỦNG HOẢNG MẠNG & HỌP KHẨN CẤP',
      subtitle: 'Ra quyết định trong tích tắc: Họp trực tuyến khẩn, biểu quyết từ xa và ủy quyền cách ly hệ thống',
      speakerName: 'Kiều Hoài Thu',
      speakerRole: 'Chuyên viên An toàn Thông tin',
      speakerAvatar: '/assets/team/kieu-hoai-thu.jpg',
      speakerNotes:
        'Kính thưa quý vị, giải pháp thứ năm giải quyết bài toán sống còn: Khi xảy ra tấn công mạng DDoS hoặc sự cố nghẽn hệ thống, công ty cần ra quyết định trong tích tắc chứ không thể chờ họp ĐHĐCĐ kéo dài cả tuần. Điều lệ TVPAY trao sẵn thẩm quyền: Cho phép họp khẩn cấp trực tuyến trong vòng 2 giờ, biểu quyết từ xa bằng chữ ký số, và ủy quyền đặc biệt cho Tổng Giám đốc tạm thời ngắt kết nối an toàn để bảo vệ số dư tài khoản người dùng, sau đó báo cáo NHNN và cơ quan an ninh mạng quốc gia.',
      renderContent: () => (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            <div className="p-4 bg-white/95 rounded-2xl border-2 border-amber-300 shadow-xs">
              <span className="font-mono text-xs font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded border border-red-300">Tác chiến 01</span>
              <h4 className="text-sm sm:text-base font-bold text-slate-900 mt-2 mb-1">Ủy quyền ngắt kết nối an toàn</h4>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed m-0">
                Tổng Giám đốc có quyền ban bố tình trạng khẩn cấp, tạm ngắt cổng API kết nối liên ngân hàng để ngăn chặn hacker rút tiền tự động.
              </p>
            </div>

            <div className="p-4 bg-white/95 rounded-2xl border-2 border-amber-300 shadow-xs">
              <span className="font-mono text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">Tác chiến 02</span>
              <h4 className="text-sm sm:text-base font-bold text-slate-900 mt-2 mb-1">Họp trực tuyến khẩn &amp; Ký số</h4>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed m-0">
                HĐQT triệu tập họp trực tuyến khẩn trong vòng 02 giờ. Các quyết nghị thông qua bằng chữ ký số hoặc biểu quyết điện tử có giá trị thi hành ngay.
              </p>
            </div>

            <div className="p-4 bg-white/95 rounded-2xl border-2 border-amber-300 shadow-xs">
              <span className="font-mono text-xs font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded border border-blue-300">Tác chiến 03</span>
              <h4 className="text-sm sm:text-base font-bold text-slate-900 mt-2 mb-1">Kích hoạt quy trình NCSC &amp; NHNN</h4>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed m-0">
                Kích hoạt hợp tác với Trung tâm Giám sát an toàn không gian mạng Quốc gia (NCSC) và báo cáo khẩn cấp Cục CNTT - Ngân hàng Nhà nước.
              </p>
            </div>
          </div>

          <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-300 text-xs sm:text-sm text-slate-800">
            <strong>Nguyên tắc Google Doc 2:</strong> "Điều lệ phải trao sẵn thẩm quyền họp khẩn, biểu quyết từ xa, ủy quyền đặc biệt để bộ máy hành động hợp pháp và kịp thời, giữ vững niềm tin người dùng ví điện tử."
          </div>
        </div>
      ),
    },

    // SLIDE 11: ĐIỀU LỆ "MAY ĐO" THEO RỦI RO ĐẶC THÙ NGÀNH VÍ ĐIỆN TỬ
    {
      id: 'charter-slide-11',
      badge: 'SLIDE 11 / 12 · MAY ĐO NGÀNH VÍ',
      category: 'PHẦN 4 · THỰC TIỄN MAY ĐO · ĐOÀN ÁNH PHƯƠNG PHỤ TRÁCH',
      title: 'ĐIỀU LỆ "MAY ĐO" THEO RỦI RO ĐẶC THÙ NGÀNH VÍ ĐIỆN TỬ',
      subtitle: 'Minh chứng Điều lệ TVPAY không sao chép khuôn mẫu, tích hợp sâu quy chuẩn an toàn số',
      speakerName: 'Đoàn Ánh Phương',
      speakerRole: 'Trưởng Nhóm 13 · Điều phối viên',
      speakerAvatar: '/assets/team/anh-phuong.jpg',
      speakerNotes:
        'Kính thưa Thầy và các bạn, nhìn vào Điều lệ TVPAY, chúng ta thấy rõ một bản Điều lệ được "may đo" tỉ mỉ theo đúng rủi ro đặc thù ngành ví điện tử chứ không hề sao chép các mẫu Điều lệ chung chung trên mạng. Cụ thể: chúng tôi thiết kế quy định riêng cho cổ đông nước ngoài; cơ chế bảo lưu quyền kiểm soát hạ tầng an ninh mạng tại Việt Nam; và yêu cầu đối chiếu sinh trắc học khi chuyển nhượng cổ phần giữa các cổ đông sáng lập. Đó là minh chứng rõ nhất cho chất lượng tư vấn của Nhóm 13.',
      renderContent: () => (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            <div className="p-4 bg-white/95 rounded-2xl border-2 border-amber-300 shadow-xs">
              <div className="flex items-center gap-2 mb-2 text-[#8C6B18]">
                <GlobeIcon className="w-5 h-5 text-amber-600" />
                <h4 className="text-sm sm:text-base font-bold text-slate-900 m-0">Cơ chế cổ đông nước ngoài</h4>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed m-0">
                Quy định chi tiết về giới hạn sở hữu gián tiếp, nghĩa vụ tuân thủ kiểm soát ngoại hối và cam kết không chuyển dữ liệu tài chính người dùng ra nước ngoài.
              </p>
            </div>

            <div className="p-4 bg-white/95 rounded-2xl border-2 border-amber-300 shadow-xs">
              <div className="flex items-center gap-2 mb-2 text-[#8C6B18]">
                <Server className="w-5 h-5 text-amber-600" />
                <h4 className="text-sm sm:text-base font-bold text-slate-900 m-0">Bảo lưu kiểm soát hạ tầng</h4>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed m-0">
                Toàn bộ máy chủ chính và hệ thống dự phòng thảm họa (Disaster Recovery) bắt buộc đặt trên lãnh thổ Việt Nam theo Nghị định 52/2024.
              </p>
            </div>

            <div className="p-4 bg-white/95 rounded-2xl border-2 border-amber-300 shadow-xs">
              <div className="flex items-center gap-2 mb-2 text-[#8C6B18]">
                <UserCheck className="w-5 h-5 text-amber-600" />
                <h4 className="text-sm sm:text-base font-bold text-slate-900 m-0">Đối chiếu sinh trắc học nội bộ</h4>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed m-0">
                Hợp đồng chuyển nhượng cổ phần và các biên bản biểu quyết ĐHĐCĐ được xác thực sinh trắc học CCCD gắn chip để loại trừ rủi ro giả mạo chữ ký.
              </p>
            </div>
          </div>

          <div className="p-3.5 bg-gradient-to-r from-amber-100 to-amber-50 rounded-xl border border-amber-300 text-center text-xs sm:text-sm font-serif font-bold text-[#7A5B10]">
            "Điều lệ không phải bản sao khuôn mẫu – mà phải được may đo theo đúng rủi ro đặc thù của công nghệ và dòng tiền ví điện tử."
          </div>
        </div>
      ),
    },

    // SLIDE 12: TỔNG KẾT BÁO CÁO ĐIỀU LỆ
    {
      id: 'charter-slide-12',
      badge: 'SLIDE 12 / 12 · TỔNG KẾT ĐIỀU LỆ',
      category: 'PHẦN 4 · KẾT LUẬN & ĐỀ XUẤT THI HÀNH · ĐOÀN ÁNH PHƯƠNG PHỤ TRÁCH',
      title: 'TỔNG KẾT BÁO CÁO ĐIỀU LỆ: BẢO VỆ NHÀ ĐẦU TƯ & ĐỒNG BỘ THANH TRA NHNN',
      subtitle: 'Điều lệ là bộ gen sống kiến tạo tổ chức vững mạnh, sẵn sàng mở rộng quy mô thị trường',
      speakerName: 'Đoàn Ánh Phương',
      speakerRole: 'Trưởng Nhóm 13 · Điều phối viên',
      speakerAvatar: '/assets/team/anh-phuong.jpg',
      speakerNotes:
        'Kính thưa Thầy và các bạn, tổng kết lại phần Điều lệ: Nhóm 13 đã thành công trong việc xây dựng một bản Điều lệ mẫu toàn diện, vừa là "bộ gen" kiến tạo tổ chức minh bạch, vừa là thành trì pháp lý bảo vệ 50 tỷ đồng vốn góp của 5 cổ đông sáng lập. Bản Điều lệ này sẵn sàng đáp ứng mọi yêu cầu thẩm định khắt khe của Ngân hàng Nhà nước Việt Nam để đưa ví điện tử TVPAY vào vận hành chính thức. Xin trân trọng cảm ơn Thầy và các bạn!',
      renderContent: () => (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div className="p-4 bg-white/95 rounded-2xl border-2 border-amber-300 shadow-xs text-center">
              <div className="w-10 h-10 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 mx-auto mb-2">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 m-0 mb-1">Cấp phép thuận lợi</h4>
              <p className="text-[11px] sm:text-xs text-slate-600 m-0">Đáp ứng 100% tiêu chí pháp lý theo Nghị định 52/2024 tại Ngân hàng Nhà nước.</p>
            </div>

            <div className="p-4 bg-white/95 rounded-2xl border-2 border-amber-300 shadow-xs text-center">
              <div className="w-10 h-10 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 mx-auto mb-2">
                <Shield className="w-6 h-6 text-amber-600" />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 m-0 mb-1">An toàn cổ đông</h4>
              <p className="text-[11px] sm:text-xs text-slate-600 m-0">Tỷ lệ 65% và khóa chuyển nhượng bảo vệ quyền kiểm soát của nhóm sáng lập.</p>
            </div>

            <div className="p-4 bg-white/95 rounded-2xl border-2 border-amber-300 shadow-xs text-center">
              <div className="w-10 h-10 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 mx-auto mb-2">
                <Coins className="w-6 h-6 text-amber-700" />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 m-0 mb-1">Quản lý vốn 50 Tỷ</h4>
              <p className="text-[11px] sm:text-xs text-slate-600 m-0">Quỹ dự phòng an toàn hệ thống trích lập trước khi chia cổ tức.</p>
            </div>

            <div className="p-4 bg-white/95 rounded-2xl border-2 border-amber-300 shadow-xs text-center">
              <div className="w-10 h-10 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 mx-auto mb-2">
                <Zap className="w-6 h-6 text-amber-600" />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 m-0 mb-1">Tác chiến tức thì</h4>
              <p className="text-[11px] sm:text-xs text-slate-600 m-0">Cơ chế họp khẩn trực tuyến và ủy quyền TGĐ ứng phó khủng hoảng trong 02 giờ.</p>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 rounded-2xl text-white text-center shadow-md">
            <h3 className="text-sm sm:text-base font-bold m-0 mb-1">ĐIỀU LỆ TVPAY · LÁ CHẮN TỐI CAO BẢO VỆ 50 TỶ ĐỒNG VỐN ĐẦU TƯ</h3>
            <p className="text-xs sm:text-sm text-amber-100 m-0">
              Kiến tạo cơ chế quản trị chuẩn mực, minh bạch và phát triển bền vững trong kỷ nguyên thanh toán số.
            </p>
          </div>
        </div>
      ),
    },
  ];

  // =========================================================================
  // BỘ SLIDE 2: HỢP ĐỒNG MỞ & CUNG ỨNG DỊCH VỤ VÍ ĐIỆN TỬ TVPAY (14 SLIDES)
  // Chuẩn hóa 100% theo Google Doc 1: "Hệ thần kinh & Tuyến phòng thủ tuyến đầu"
  // =========================================================================
  const walletSlides: SlideItem[] = [
    // SLIDE 1: BÌA BÁO CÁO & ĐỊNH VỊ "HỆ THẦN KINH TUYẾN ĐẦU"
    {
      id: 'wallet-slide-1',
      badge: 'SLIDE 01 / 14 · BÁO CÁO HỢP ĐỒNG VÍ',
      category: 'HỒ SƠ TƯ VẤN PHÁP LÝ · NHÓM 13 (THỊNH VƯỢNG LEGAL) · KHOA LUẬT HVNH',
      title: 'HỢP ĐỒNG MỞ VÀ CUNG ỨNG DỊCH VỤ VÍ ĐIỆN TỬ TVPAY',
      subtitle: 'Tuyến phòng thủ tuyến đầu trực tiếp đối mặt hàng triệu giao dịch mỗi ngày. Trả lời câu hỏi: "Khi giao dịch, ai chịu trách nhiệm gì?"',
      speakerName: 'Trần Thị Thơ',
      speakerRole: 'Chuyên viên Pháp chế Hợp đồng',
      speakerAvatar: '/assets/team/tran-thi-tho.jpg',
      speakerNotes:
        'Kính thưa Thầy và các bạn, nếu ở phần trước Điều lệ được định vị là "bộ gen" và khung xương quản trị nội bộ của doanh nghiệp, thì ở cấp độ vận hành hàng ngày - nơi doanh nghiệp trực tiếp chạm tới hàng triệu người dùng - văn bản pháp lý quan trọng bậc nhất chính là Hợp đồng mở và cung ứng dịch vụ ví điện tử. Nếu Điều lệ trả lời câu hỏi "công ty được tổ chức và quản trị như thế nào", thì Hợp đồng ví trả lời câu hỏi sát sườn hơn: "Khi khách hàng và doanh nghiệp giao dịch với nhau, ai chịu trách nhiệm gì?"',
      renderContent: () => (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            <div className="stagger-1 p-4 bg-white/95 rounded-2xl border-2 border-amber-300 shadow-xs relative overflow-hidden">
              <RoyalFiligreeCorner className="absolute top-2 right-2" />
              <div className="flex items-center gap-2 mb-2 text-[#8C6B18]">
                <div className="p-2 rounded-xl bg-amber-100 border border-amber-300">
                  <Smartphone className="w-5 h-5 text-amber-700" />
                </div>
                <span className="text-xs sm:text-sm font-bold uppercase tracking-wider">Tuyến đầu vận hành</span>
              </div>
              <h4 className="text-sm sm:text-base font-bold text-slate-900 m-0 mb-1">Giao dịch chạm tới hàng triệu User</h4>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed m-0">
                Hợp đồng điện tử ký kết trực tuyến 1-Touch, thiết lập quyền, nghĩa vụ và chế tài pháp lý ràng buộc giữa TVPAY và từng khách hàng mở ví.
              </p>
            </div>

            <div className="stagger-2 p-4 bg-gradient-to-br from-amber-50 to-white rounded-2xl border-2 border-amber-400 shadow-xs relative overflow-hidden">
              <RoyalFiligreeCorner className="absolute top-2 right-2" />
              <div className="flex items-center gap-2 mb-2 text-amber-800">
                <div className="p-2 rounded-xl bg-amber-200 border border-amber-400">
                  <Scale className="w-5 h-5 text-amber-800" />
                </div>
                <span className="text-xs sm:text-sm font-bold uppercase tracking-wider">Câu hỏi cốt lõi</span>
              </div>
              <h4 className="text-sm sm:text-base font-black text-amber-950 m-0 mb-1">"AI CHỊU TRÁCH NHIỆM GÌ?"</h4>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed m-0">
                Phân bổ rủi ro công bằng khi lộ OTP, mất thiết bị, giao dịch gian lận hay lỗi hệ thống viễn thông liên ngân hàng.
              </p>
            </div>

            <div className="stagger-3 p-4 bg-white/95 rounded-2xl border-2 border-amber-300 shadow-xs relative overflow-hidden">
              <RoyalFiligreeCorner className="absolute top-2 right-2" />
              <div className="flex items-center gap-2 mb-2 text-[#8C6B18]">
                <div className="p-2 rounded-xl bg-amber-100 border border-amber-300">
                  <ShieldCheck className="w-5 h-5 text-amber-700" />
                </div>
                <span className="text-xs sm:text-sm font-bold uppercase tracking-wider">Hệ thần kinh doanh nghiệp</span>
              </div>
              <h4 className="text-sm sm:text-base font-bold text-slate-900 m-0 mb-1">Phòng thủ từ sớm, từ xa</h4>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed m-0">
                Kết hợp chặt chẽ giữa Luật Giao dịch điện tử 2023, Nghị định 52/2024/NĐ-CP và Luật Bảo vệ dữ liệu cá nhân 2025.
              </p>
            </div>
          </div>

          <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-300 text-center">
            <span className="text-xs sm:text-sm font-serif font-bold text-[#7A5B10]">
              "Nếu Điều lệ là khung xương của doanh nghiệp, thì Hợp đồng ví điện tử chính là hệ thần kinh - nơi mọi tương tác với khách hàng được ghi nhận và kiểm soát."
            </span>
          </div>
        </div>
      ),
    },

    // SLIDE 2: 04 NHÓM NỘI DUNG CỐT LÕI CỦA HỢP ĐỒNG VÍ
    {
      id: 'wallet-slide-2',
      badge: 'SLIDE 02 / 14 · NỘI DUNG HỢP ĐỒNG',
      category: 'PHẦN 1 · NỘI DUNG & VAI TRÒ · TRẦN THỊ THƠ PHỤ TRÁCH',
      title: '04 NHÓM NỘI DUNG CỐT LÕI CỦA HỢP ĐỒNG VÍ ĐIỆN TỬ',
      subtitle: 'Bốn trụ cột nội dung thiết lập quy chuẩn pháp lý minh bạch giữa TVPAY và Khách hàng',
      speakerName: 'Trần Thị Thơ',
      speakerRole: 'Chuyên viên Pháp chế Hợp đồng',
      speakerAvatar: '/assets/team/tran-thi-tho.jpg',
      speakerNotes:
        'Kính thưa Thầy và các bạn, theo tài liệu chính thức của nhóm tại Mục I.1, Hợp đồng ví điện tử TVPAY bao gồm 4 nhóm nội dung cốt lõi: Thứ nhất, Điều kiện mở và sử dụng ví - xác định quyền hạn doanh nghiệp, phương thức xác thực eKYC và đặc biệt là trách nhiệm bảo quản mật khẩu, mã PIN của khách hàng; Thứ hai, Cách thức thực hiện giao dịch - thời điểm xác lập, hạn mức và cách xử lý lỗi; Thứ ba, Biểu phí dịch vụ minh bạch; Và thứ tư, Bảo mật dữ liệu cá nhân và cơ chế xử lý khiếu nại tranh chấp.',
      renderContent: () => (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div className="p-4 bg-white/95 rounded-2xl border-2 border-amber-300 shadow-xs relative overflow-hidden flex flex-col justify-between">
              <RoyalFiligreeCorner className="absolute top-1.5 right-1.5" />
              <div>
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-amber-100 text-[#7A5B10] inline-block mb-2 border border-amber-300">
                  Nhóm 01
                </span>
                <h4 className="text-sm sm:text-base font-bold text-slate-900 m-0 mb-1.5">ĐIỀU KIỆN MỞ &amp; DÙNG VÍ</h4>
                <p className="text-xs sm:text-sm text-slate-700 m-0 leading-relaxed">
                  Quy định điều kiện đối tượng (đủ 18 tuổi), hồ sơ giấy tờ, quyền từ chối mở ví và trách nhiệm tự bảo quản OTP, PIN, thiết bị xác thực của khách hàng.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-amber-200 text-[11px] sm:text-xs text-amber-800 font-semibold">
                Hạn chế nguy cơ chiếm đoạt ví
              </div>
            </div>

            <div className="p-4 bg-white/95 rounded-2xl border-2 border-amber-300 shadow-xs relative overflow-hidden flex flex-col justify-between">
              <RoyalFiligreeCorner className="absolute top-1.5 right-1.5" />
              <div>
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-amber-100 text-[#7A5B10] inline-block mb-2 border border-amber-300">
                  Nhóm 02
                </span>
                <h4 className="text-sm sm:text-base font-bold text-slate-900 m-0 mb-1.5">CÁCH THỨC GIAO DỊCH</h4>
                <p className="text-xs sm:text-sm text-slate-700 m-0 leading-relaxed">
                  Xác định thời điểm giao dịch được ghi nhận thành công, phương thức xác nhận đa nhân tố, hạn mức theo ngày/tháng và quy trình xử lý lỗi kỹ thuật.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-amber-200 text-[11px] sm:text-xs text-amber-800 font-semibold">
                Chuẩn hóa luồng thanh toán
              </div>
            </div>

            <div className="p-4 bg-white/95 rounded-2xl border-2 border-amber-300 shadow-xs relative overflow-hidden flex flex-col justify-between">
              <RoyalFiligreeCorner className="absolute top-1.5 right-1.5" />
              <div>
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-amber-100 text-[#7A5B10] inline-block mb-2 border border-amber-300">
                  Nhóm 03
                </span>
                <h4 className="text-sm sm:text-base font-bold text-slate-900 m-0 mb-1.5">BIỂU PHÍ DỊCH VỤ</h4>
                <p className="text-xs sm:text-sm text-slate-700 m-0 leading-relaxed">
                  Minh bạch các loại phí (nạp, rút, chuyển khoản, xử lý tranh chấp), thời điểm thu phí và phương thức trích nợ tự động trên số dư ví hợp pháp.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-amber-200 text-[11px] sm:text-xs text-amber-800 font-semibold">
                Công khai, không phí ẩn
              </div>
            </div>

            <div className="p-4 bg-white/95 rounded-2xl border-2 border-amber-300 shadow-xs relative overflow-hidden flex flex-col justify-between">
              <RoyalFiligreeCorner className="absolute top-1.5 right-1.5" />
              <div>
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-amber-100 text-[#7A5B10] inline-block mb-2 border border-amber-300">
                  Nhóm 04
                </span>
                <h4 className="text-sm sm:text-base font-bold text-slate-900 m-0 mb-1.5">BẢO MẬT &amp; KHIẾU NẠI</h4>
                <p className="text-xs sm:text-sm text-slate-700 m-0 leading-relaxed">
                  Bảo vệ dữ liệu cá nhân theo Luật 91/2025, cơ chế tiếp nhận tra soát 24/7 và giải quyết bồi hoàn thiệt hại theo đúng kết luận phân định lỗi.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-amber-200 text-[11px] sm:text-xs text-amber-800 font-semibold">
                Thành trì bảo vệ quyền lợi
              </div>
            </div>
          </div>
        </div>
      ),
    },

    // SLIDE 3: 06 VAI TRÒ PHÁP LÝ TRỌNG YẾU CỦA HỢP ĐỒNG VÍ
    {
      id: 'wallet-slide-3',
      badge: 'SLIDE 03 / 14 · VAI TRÒ HỢP ĐỒNG',
      category: 'PHẦN 1 · NỘI DUNG & VAI TRÒ · TRẦN THỊ THƠ PHỤ TRÁCH',
      title: '06 VAI TRÒ PHÁP LÝ TRỌNG YẾU CỦA HỢP ĐỒNG VÍ ĐIỆN TỬ',
      subtitle: 'Phân bổ rủi ro công bằng, bảo vệ người dùng và đảm bảo tuân thủ chuẩn mực thanh toán quốc gia',
      speakerName: 'Trần Thị Thơ',
      speakerRole: 'Chuyên viên Pháp chế Hợp đồng',
      speakerAvatar: '/assets/team/tran-thi-tho.jpg',
      speakerNotes:
        'Kính thưa quý vị, từ 4 nhóm nội dung cốt lõi trên, Hợp đồng ví TVPAY đảm nhận 6 vai trò trọng yếu theo Google Doc 1: Thứ nhất, là cơ sở pháp lý xác lập quan hệ đôi bên; Thứ hai, là công cụ vận hành dịch vụ từ nạp, rút, chuyển tiền đến thanh toán; Thứ ba, là công cụ phân bổ và kiểm soát rủi ro - xác định rõ ai chịu trách nhiệm khi mất thiết bị hay lộ OTP; Thứ tư, bảo vệ quyền lợi người dùng bằng biểu phí minh bạch; Thứ năm, đảm bảo tuân thủ phòng chống rửa tiền AML; Và thứ sáu, là căn cứ giải quyết mọi tranh chấp trước Trọng tài và Tòa án.',
      renderContent: () => (
        <div className="space-y-3.5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs sm:text-sm">
            <div className="p-3.5 bg-white/95 rounded-2xl border-2 border-amber-300 shadow-xs">
              <span className="font-mono text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">Vai trò 01</span>
              <h4 className="font-bold text-slate-900 mt-1.5 mb-1">Xác lập quan hệ pháp lý</h4>
              <p className="text-slate-600 m-0 leading-relaxed text-xs sm:text-[13px]">
                Xác định phạm vi dịch vụ, quyền và nghĩa vụ của khách hàng cũng như trách nhiệm bên cung ứng trong toàn bộ quá trình.
              </p>
            </div>

            <div className="p-3.5 bg-white/95 rounded-2xl border-2 border-amber-300 shadow-xs">
              <span className="font-mono text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">Vai trò 02</span>
              <h4 className="font-bold text-slate-900 mt-1.5 mb-1">Cơ chế vận hành dịch vụ</h4>
              <p className="text-slate-600 m-0 leading-relaxed text-xs sm:text-[13px]">
                Quy định mạch lạc các luồng nạp, rút, chuyển tiền, thanh toán hóa đơn, hạn mức và điều kiện tạm khóa hoặc đóng ví.
              </p>
            </div>

            <div className="p-3.5 bg-amber-50/90 rounded-2xl border-2 border-amber-400 shadow-xs">
              <span className="font-mono text-xs font-bold text-amber-900 bg-amber-200 px-2 py-0.5 rounded">Vai trò 03 · Cốt lõi</span>
              <h4 className="font-bold text-amber-950 mt-1.5 mb-1">Phân bổ &amp; kiểm soát rủi ro</h4>
              <p className="text-slate-700 m-0 leading-relaxed text-xs sm:text-[13px]">
                Xác định rạch ròi bên chịu trách nhiệm khi phát sinh mất thiết bị, lộ OTP, mã độc hay giao dịch gian lận.
              </p>
            </div>

            <div className="p-3.5 bg-white/95 rounded-2xl border-2 border-amber-300 shadow-xs">
              <span className="font-mono text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">Vai trò 04</span>
              <h4 className="font-bold text-slate-900 mt-1.5 mb-1">Bảo vệ quyền lợi khách hàng</h4>
              <p className="text-slate-600 m-0 leading-relaxed text-xs sm:text-[13px]">
                Minh bạch mức phí, cam kết bảo vệ dữ liệu cá nhân và quy định thời hạn xử lý tra soát bồi hoàn khi hệ thống lỗi.
              </p>
            </div>

            <div className="p-3.5 bg-white/95 rounded-2xl border-2 border-amber-300 shadow-xs">
              <span className="font-mono text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">Vai trò 05</span>
              <h4 className="font-bold text-slate-900 mt-1.5 mb-1">Bảo đảm tuân thủ pháp luật</h4>
              <p className="text-slate-600 m-0 leading-relaxed text-xs sm:text-[13px]">
                Công cụ thể chế hóa quy định phòng, chống rửa tiền (AML), định danh eKYC và kiểm soát giao dịch đáng ngờ theo NHNN.
              </p>
            </div>

            <div className="p-3.5 bg-amber-50/90 rounded-2xl border-2 border-amber-400 shadow-xs">
              <span className="font-mono text-xs font-bold text-amber-900 bg-amber-200 px-2 py-0.5 rounded">Vai trò 06 · Tố tụng</span>
              <h4 className="font-bold text-amber-950 mt-1.5 mb-1">Căn cứ giải quyết tranh chấp</h4>
              <p className="text-slate-700 m-0 leading-relaxed text-xs sm:text-[13px]">
                Chứng cứ điện tử và điều khoản giới hạn trách nhiệm là căn cứ xử lý thống nhất, tránh tranh chấp kéo dài tại Tòa án.
              </p>
            </div>
          </div>
        </div>
      ),
    },

    // SLIDE 4: 05 GIẢI PHÁP BẢO VỆ TOÀN DIỆN CHO DOANH NGHIỆP FINTECH
    {
      id: 'wallet-slide-4',
      badge: 'SLIDE 04 / 14 · GIẢI PHÁP BẢO VỆ',
      category: 'PHẦN 2 · 05 GIẢI PHÁP FINTECH · TRẦN THỊ THƠ PHỤ TRÁCH',
      title: '05 GIẢI PHÁP BẢO VỆ QUYỀN VÀ LỢI ÍCH HỢP PHÁP DOANH NGHIỆP',
      subtitle: 'Chuyển đổi tư duy từ "bị động xử lý sự vụ sau tranh chấp" sang "chủ động nhận diện phòng ngừa từ sớm"',
      speakerName: 'Trần Thị Thơ',
      speakerRole: 'Chuyên viên Pháp chế Hợp đồng',
      speakerAvatar: '/assets/team/tran-thi-tho.jpg',
      speakerNotes:
        'Thưa quý vị, để Hợp đồng thực sự trở thành lá chắn bảo vệ doanh nghiệp Fintech chứ không phải thủ tục hình thức, Mục II của tài liệu đề xuất 5 giải pháp then chốt: Một là chuẩn hóa quy trình mở ví eKYC ngăn chặn giả mạo ngay từ cửa ngõ; Hai là xây dựng hợp đồng rõ ràng, không tạo quyền đơn phương quá lớn để giữ niềm tin khách hàng; Ba là tăng cường bảo mật và AI phát hiện gian lận; Bốn là lưu trữ chứng cứ điện tử để làm bằng chứng sống trước Tòa; Và năm là quản trị tuân thủ thường xuyên đa luật.',
      renderContent: () => (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs sm:text-sm">
            <div className="p-3.5 bg-white rounded-2xl border-2 border-amber-300 shadow-xs flex flex-col justify-between">
              <div>
                <span className="font-mono text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">Giải pháp 1</span>
                <h4 className="font-bold text-slate-900 mt-2 mb-1">Chuẩn hóa mở ví eKYC</h4>
                <p className="text-slate-600 m-0 leading-relaxed text-xs sm:text-[13px]">
                  Xác minh CCCD chip NFC, sinh trắc học khuôn mặt, loại bỏ tài khoản ảo, rác và nặc danh ngay từ đầu vào.
                </p>
              </div>
              <span className="text-[11px] font-mono text-[#8C6B18] font-bold mt-2">Ngăn chặn từ gốc</span>
            </div>

            <div className="p-3.5 bg-white rounded-2xl border-2 border-amber-300 shadow-xs flex flex-col justify-between">
              <div>
                <span className="font-mono text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">Giải pháp 2</span>
                <h4 className="font-bold text-slate-900 mt-2 mb-1">Hợp đồng rõ ràng, đầy đủ</h4>
                <p className="text-slate-600 m-0 leading-relaxed text-xs sm:text-[13px]">
                  Quy định minh bạch điều kiện tạm khóa, xử lý gian lận, tránh trao quyền đơn phương quá mức gây mất niềm tin.
                </p>
              </div>
              <span className="text-[11px] font-mono text-[#8C6B18] font-bold mt-2">Cân bằng lợi ích</span>
            </div>

            <div className="p-3.5 bg-white rounded-2xl border-2 border-amber-300 shadow-xs flex flex-col justify-between">
              <div>
                <span className="font-mono text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">Giải pháp 3</span>
                <h4 className="font-bold text-slate-900 mt-2 mb-1">Bảo mật &amp; AI cảnh báo</h4>
                <p className="text-slate-600 m-0 leading-relaxed text-xs sm:text-[13px]">
                  Hệ thống AI giám sát dòng tiền bất thường, xác thực đa tầng với giao dịch rủi ro cao và phản ứng nhanh trong 15s.
                </p>
              </div>
              <span className="text-[11px] font-mono text-[#8C6B18] font-bold mt-2">Công nghệ chủ động</span>
            </div>

            <div className="p-3.5 bg-white rounded-2xl border-2 border-amber-300 shadow-xs flex flex-col justify-between">
              <div>
                <span className="font-mono text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">Giải pháp 4</span>
                <h4 className="font-bold text-slate-900 mt-2 mb-1">Lưu trữ chứng cứ điện tử</h4>
                <p className="text-slate-600 m-0 leading-relaxed text-xs sm:text-[13px]">
                  Lưu log server, địa chỉ IP, OTP, thời gian thực làm "bằng chứng sống" bảo vệ TVPAY khi xảy ra tranh chấp tại Tòa.
                </p>
              </div>
              <span className="text-[11px] font-mono text-[#8C6B18] font-bold mt-2">Bằng chứng pháp lý</span>
            </div>

            <div className="p-3.5 bg-white rounded-2xl border-2 border-amber-300 shadow-xs flex flex-col justify-between">
              <div>
                <span className="font-mono text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">Giải pháp 5</span>
                <h4 className="font-bold text-slate-900 mt-2 mb-1">Quản trị tuân thủ đa luật</h4>
                <p className="text-slate-600 m-0 leading-relaxed text-xs sm:text-[13px]">
                  Kiểm soát tuân thủ định kỳ đa ngành: Thanh toán số, giao dịch điện tử, AML, an toàn thông tin và dữ liệu cá nhân.
                </p>
              </div>
              <span className="text-[11px] font-mono text-[#8C6B18] font-bold mt-2">Tuân thủ toàn diện</span>
            </div>
          </div>

          <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-300 text-center text-xs sm:text-sm font-semibold text-amber-950">
            "Chuyển đổi từ tư duy bị động xử lý sự vụ sau khi đã phát sinh tranh chấp sang tư duy chủ động nhận diện và phòng ngừa rủi ro ngay từ đầu."
          </div>
        </div>
      ),
    },

    // SLIDE 5: ĐIỀU 2: NGUYÊN TẮC MỞ, VẬN HÀNH & 10 KÊNH NẠP / RÚT TIỀN
    {
      id: 'wallet-slide-5',
      badge: 'SLIDE 05 / 14 · ĐIỀU 2: VẬN HÀNH',
      category: 'PHẦN 3 · ĐIỀU KHOẢN MẪU TRỌNG YẾU · TRẦN THỊ THÙY PHỤ TRÁCH',
      title: 'ĐIỀU 2: NGUYÊN TẮC MỞ, SỬ DỤNG & CÁC KÊNH NẠP / RÚT TIỀN',
      subtitle: 'Đối tượng thụ hưởng, bắt buộc liên kết tài khoản ngân hàng chính chủ và 10 kênh giao dịch',
      speakerName: 'Trần Thị Thùy',
      speakerRole: 'Chuyên viên Vận hành Dịch vụ Ví',
      speakerAvatar: '/assets/team/tran-thuy.jpg',
      speakerNotes:
        'Kính thưa Thầy và các bạn, Điều 2 trong bản Thỏa thuận là điều khoản mở đầu then chốt quy định nguyên tắc sử dụng ví TVPAY. Khoản 1 xác định đối tượng: cá nhân đủ 18 tuổi có đầy đủ năng lực hành vi và doanh nghiệp hợp pháp. Khoản 2 đặt ra điều kiện tiên quyết: bắt buộc phải liên kết tài khoản ngân hàng chính chủ bằng VNĐ. Và các khoản 3, 4 phân định rõ 5 kênh nạp tiền hợp lệ và 5 hình thức rút tiền, thanh toán dịch vụ công theo đúng quy định của Nghị định 52/2024.',
      renderContent: () => (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="p-4 bg-white/95 rounded-2xl border-2 border-amber-300 shadow-xs">
              <h4 className="font-bold text-slate-900 m-0 mb-2.5 flex items-center gap-2 text-sm sm:text-base">
                <Coins className="w-5 h-5 text-emerald-600" />
                05 Kênh nạp tiền vào ví TVPAY (Khoản 3)
              </h4>
              <ul className="space-y-2 text-slate-700 m-0 p-0 list-none">
                <li className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[10px]">1</span>
                  <span>Nộp tiền mặt vào TK đảm bảo thanh toán tại NH hợp tác</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[10px]">2</span>
                  <span>Nhận tiền từ TK VNĐ của khách hàng tại NH liên kết chính chủ</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[10px]">3</span>
                  <span>Nhận tiền từ TK VNĐ mở tại các ngân hàng/chi nhánh NH nước ngoài</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[10px]">4</span>
                  <span>Nhận tiền từ các ví điện tử khác ngoài hệ thống</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[10px]">5</span>
                  <span>Nhận tiền từ các tài khoản ví TVPAY khác (chuyển tiền nội bộ)</span>
                </li>
              </ul>
            </div>

            <div className="p-4 bg-white/95 rounded-2xl border-2 border-amber-300 shadow-xs">
              <h4 className="font-bold text-slate-900 m-0 mb-2.5 flex items-center gap-2 text-sm sm:text-base">
                <ArrowRight className="w-5 h-5 text-amber-600" />
                05 Kênh rút tiền &amp; Thanh toán (Khoản 4)
              </h4>
              <ul className="space-y-2 text-slate-700 m-0 p-0 list-none">
                <li className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-[10px]">1</span>
                  <span>Rút tiền về TK VNĐ của khách hàng tại Ngân hàng liên kết</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-[10px]">2</span>
                  <span>Chuyển tiền đến TK VNĐ tại ngân hàng, chi nhánh NH nước ngoài</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-[10px]">3</span>
                  <span>Chuyển tiền đến ví điện tử TVPAY khác (P2P miễn phí)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-[10px]">4</span>
                  <span>Chuyển tiền đến ví điện tử khác ngoài hệ thống theo chuẩn NHNN</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-[10px]">5</span>
                  <span>Thanh toán hàng hóa, dịch vụ, nộp phí lệ phí dịch vụ công hợp pháp</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="p-3 bg-amber-50 rounded-xl border border-amber-300 text-xs sm:text-sm text-slate-700">
            <strong>Bắt buộc liên kết ngân hàng:</strong> Không mở ví cho khách hàng chưa hoàn tất liên kết tài khoản ngân hàng chính chủ nhằm tuân thủ quy chuẩn bảo đảm thanh toán 1:1.
          </div>
        </div>
      ),
    },

    // SLIDE 6: ĐIỀU 2: QUY CHUẨN HỒ SƠ eKYC & HẠN MỨC GIAO DỊCH 100 TRIỆU/THÁNG
    {
      id: 'wallet-slide-6',
      badge: 'SLIDE 06 / 14 · ĐIỀU 2: eKYC & HẠN MỨC',
      category: 'PHẦN 3 · ĐIỀU KHOẢN MẪU TRỌNG YẾU · TRẦN THỊ THÙY PHỤ TRÁCH',
      title: 'ĐIỀU 2: QUY CHUẨN HỒ SƠ eKYC & HẠN MỨC GIAO DỊCH 100 TRIỆU/THÁNG',
      subtitle: 'Phân tầng hồ sơ công dân Việt Nam, Nước ngoài, 2 quốc tịch và cơ chế hạn mức rủi ro',
      speakerName: 'Trần Thị Thùy',
      speakerRole: 'Chuyên viên Vận hành Dịch vụ Ví',
      speakerAvatar: '/assets/team/tran-thuy.jpg',
      speakerNotes:
        'Kính thưa Thầy và các bạn, Khoản 5 Điều 2 thiết lập quy chuẩn hồ sơ eKYC hết sức chi tiết chia làm 3 nhóm đối tượng: Người Việt Nam (CCCD chip NFC, dữ liệu sinh trắc học); Người nước ngoài (hộ chiếu còn hạn, thị thực, nơi cư trú tại VN); và Người có từ hai quốc tịch trở lên. TVPAY kiên quyết từ chối cung cấp dịch vụ nếu không đủ hồ sơ. Đồng thời, Khoản 10 ấn định hạn mức giao dịch cá nhân tối đa là 100 triệu đồng/tháng theo Thông tư 40 của NHNN, kèm cơ chế thông báo công khai khi có điều chỉnh.',
      renderContent: () => (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs sm:text-sm">
            <div className="p-4 bg-white/95 rounded-2xl border-2 border-amber-300 shadow-xs">
              <span className="font-mono text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">Nhóm 1</span>
              <h4 className="font-bold text-slate-900 mt-2 mb-1">Công dân Việt Nam</h4>
              <p className="text-slate-600 m-0 leading-relaxed text-xs sm:text-[13px]">
                Họ tên, ngày sinh, CCCD/thẻ căn cước gắn chip còn hạn, địa chỉ thường trú, email, số điện thoại chính chủ và dữ liệu sinh trắc học khuôn mặt đối chiếu Bộ Công an.
              </p>
            </div>

            <div className="p-4 bg-white/95 rounded-2xl border-2 border-amber-300 shadow-xs">
              <span className="font-mono text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">Nhóm 2</span>
              <h4 className="font-bold text-slate-900 mt-2 mb-1">Người nước ngoài</h4>
              <p className="text-slate-600 m-0 leading-relaxed text-xs sm:text-[13px]">
                Hộ chiếu còn hạn, ngày hết hạn, số định danh người nước ngoài, số thị thực nhập cảnh hợp pháp, đăng ký tạm trú tại Việt Nam, email, SĐT và thông tin sinh trắc học.
              </p>
            </div>

            <div className="p-4 bg-white/95 rounded-2xl border-2 border-amber-300 shadow-xs">
              <span className="font-mono text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">Nhóm 3</span>
              <h4 className="font-bold text-slate-900 mt-2 mb-1">Từ 02 Quốc tịch trở lên</h4>
              <p className="text-slate-600 m-0 leading-relaxed text-xs sm:text-[13px]">
                Bao gồm đầy đủ các thông tin tại Nhóm 1 và 2, kèm theo số hộ chiếu, ngày cấp, nơi cấp, quốc tịch và địa chỉ thường trú ở các quốc gia mang quốc tịch còn lại.
              </p>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-r from-amber-50 to-white rounded-2xl border-2 border-amber-400 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
            <div>
              <span className="font-mono text-xs font-bold text-amber-900 uppercase tracking-wider block">Hạn mức giao dịch cá nhân tối đa (Khoản 10)</span>
              <strong className="text-base sm:text-xl font-mono text-[#8C6B18]">100.000.000 VNĐ / THÁNG / KHÁCH HÀNG</strong>
            </div>
            <div className="text-slate-600 text-xs sm:text-[13px] max-w-md">
              Áp dụng cho thanh toán hàng hóa dịch vụ và chuyển tiền. Không áp dụng đối với Đơn vị chấp nhận thanh toán (Merchant) có hợp đồng riêng.
            </div>
          </div>
        </div>
      ),
    },

    // SLIDE 7: ĐIỀU 6: DANH MỤC CÁC HÀNH VI BỊ CẤM TUYỆT ĐỐI (USER & TVPAY)
    {
      id: 'wallet-slide-7',
      badge: 'SLIDE 07 / 14 · ĐIỀU 6: CÁC ĐIỀU CẤM',
      category: 'PHẦN 3 · ĐIỀU KHOẢN MẪU TRỌNG YẾU · VƯƠNG THU THỦY PHỤ TRÁCH',
      title: 'ĐIỀU 6: DANH MỤC CÁC HÀNH VI BỊ CẤM TUYỆT ĐỐI KHI DÙNG VÍ',
      subtitle: 'Ranh giới đỏ pháp lý bảo vệ hệ thống, chống rửa tiền và cam kết không cấp tín dụng',
      speakerName: 'Vương Thu Thủy',
      speakerRole: 'Chuyên viên Kiểm soát Tuân thủ',
      speakerAvatar: '/assets/team/vuong-thu-thuy.jpg',
      speakerNotes:
        'Kính thưa Thầy và các bạn, Điều 6 thiết lập "ranh giới đỏ" pháp lý phân định cho cả hai chủ thể: Về phía khách hàng: nghiêm cấm mở ví hộ, nặc danh, phát tán mã độc virus, mua bán chuyển nhượng ví, và sử dụng ví để rửa tiền, tài trợ khủng bố; Về phía TVPAY: Thỏa thuận khẳng định 2 điều cấm sống còn theo Nghị định 52: Cấm mở ví khi chưa thu thập đủ eKYC và CẤM TUYỆT ĐỐI CẤP TÍN DỤNG, CẤM TRẢ LÃI TRÊN SỐ DƯ VÍ. Điều này bảo đảm ví điện tử giữ đúng bản chất là phương tiện thanh toán trung gian.',
      renderContent: () => (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="p-4 bg-white/95 rounded-2xl border-2 border-red-300 shadow-xs">
              <h4 className="font-bold text-red-900 m-0 mb-2.5 flex items-center gap-2 text-sm sm:text-base">
                <Ban className="w-5 h-5 text-red-600" />
                06 Hành vi bị cấm đối với Khách hàng (Khoản 1)
              </h4>
              <ul className="space-y-2 text-slate-700 m-0 p-0 list-none">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">✕</span>
                  <span>Mở hộ ví điện tử hoặc duy trì ví nặc danh, mạo danh thông tin người khác.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">✕</span>
                  <span>Mua, bán, cho thuê, cho mượn tài khoản ví hoặc chuyển nhượng thông tin đăng nhập.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">✕</span>
                  <span>Phát tán phần mềm độc hại, virus tấn công làm gián đoạn hạ tầng mạng TVPAY.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">✕</span>
                  <span>Cung cấp thông tin gian dối, giả mạo chứng từ giao dịch thanh toán.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">✕</span>
                  <span>Sử dụng ví vào mục đích rửa tiền, tài trợ khủng bố, lừa đảo chiếm đoạt tài sản.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">✕</span>
                  <span>Xâm phạm quyền sở hữu trí tuệ đối với ứng dụng và nhãn hiệu TVPAY.</span>
                </li>
              </ul>
            </div>

            <div className="p-4 bg-gradient-to-br from-amber-50 to-white rounded-2xl border-2 border-amber-400 shadow-xs">
              <h4 className="font-bold text-amber-950 m-0 mb-2.5 flex items-center gap-2 text-sm sm:text-base">
                <ShieldAlert className="w-5 h-5 text-amber-700" />
                02 Điều cấm đối với Tổ chức cung ứng TVPAY (Khoản 2)
              </h4>
              <div className="space-y-3">
                <div className="p-3 bg-white rounded-xl border border-amber-300">
                  <strong className="block text-slate-900 mb-1">1. Cấm mở ví khi chưa đủ eKYC &amp; Chưa liên kết NH:</strong>
                  <p className="text-slate-600 m-0 leading-relaxed text-xs sm:text-[13px]">
                    Tuyệt đối không cấp tài khoản khi chưa thu thập đủ thông tin nhận biết khách hàng theo Khoản 5 Điều 2 hoặc chưa liên kết TK ngân hàng chính chủ.
                  </p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-amber-300">
                  <strong className="block text-slate-900 mb-1">2. CẤM CẤP TÍN DỤNG &amp; CẤM TRẢ LÃI SỐ DƯ VÍ:</strong>
                  <p className="text-slate-600 m-0 leading-relaxed text-xs sm:text-[13px]">
                    Nghiêm cấm cấp tín dụng cho khách hàng sử dụng ví, cấm trả lãi trên số dư ví hoặc bất kỳ hành vi nào làm tăng giá trị tiền tệ so với số tiền thực nạp vào.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },

    // SLIDE 8: ĐIỀU 7: CÂN BẰNG PHÁP LÝ: 11 QUYỀN VÀ 24 NGHĨA VỤ KHÁCH HÀNG
    {
      id: 'wallet-slide-8',
      badge: 'SLIDE 08 / 14 · ĐIỀU 7: QUYỀN & NGHĨA VỤ',
      category: 'PHẦN 3 · ĐIỀU KHOẢN MẪU TRỌNG YẾU · VƯƠNG THU THỦY PHỤ TRÁCH',
      title: 'ĐIỀU 7: CÂN BẰNG PHÁP LÝ: 11 QUYỀN VÀ 24 NGHĨA VỤ KHÁCH HÀNG',
      subtitle: 'Trách nhiệm tự bảo mật OTP, nghĩa vụ hoàn tiền ghi Có nhầm và quyền dữ liệu cá nhân',
      speakerName: 'Vương Thu Thủy',
      speakerRole: 'Chuyên viên Kiểm soát Tuân thủ',
      speakerAvatar: '/assets/team/vuong-thu-thuy.jpg',
      speakerNotes:
        'Kính thưa quý vị, Điều 7 là điều khoản đồ sộ nhất với 11 quyền và 24 nghĩa vụ của khách hàng. Điểm mấu chốt bảo vệ TVPAY nằm ở: Khoản 2.3 và 2.5: Khách hàng tự chịu trách nhiệm toàn bộ thiệt hại nếu để lộ OTP, PIN hoặc thiết bị mà không có lỗi của TVPAY; Khoản 2.12: Nghĩa vụ hoàn trả ngay lập tức và vô điều kiện các khoản tiền do TVPAY ghi Có nhầm, cho phép TVPAY tự động trích nợ thu hồi; Đồng thời tôn trọng quyền xem, sửa và phản đối xử lý dữ liệu cá nhân theo Luật Bảo vệ dữ liệu cá nhân 2025.',
      renderContent: () => (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs sm:text-sm">
            <div className="p-4 bg-white/95 rounded-2xl border-2 border-amber-300 shadow-xs">
              <span className="font-mono text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">Điểm then chốt 1</span>
              <h4 className="font-bold text-slate-900 mt-2 mb-1">Tự chịu rủi ro bảo mật OTP</h4>
              <p className="text-slate-600 m-0 leading-relaxed text-xs sm:text-[13px]">
                Nếu thông tin đăng nhập, OTP, mã PIN bị lộ do lỗi của khách hàng, khách hàng chịu toàn bộ chi phí và tổn thất tài chính phát sinh (Khoản 2.3 &amp; 2.5).
              </p>
            </div>

            <div className="p-4 bg-amber-50/90 rounded-2xl border-2 border-amber-400 shadow-xs">
              <span className="font-mono text-xs font-bold text-amber-900 bg-amber-200 px-2 py-0.5 rounded">Điểm then chốt 2</span>
              <h4 className="font-bold text-amber-950 mt-2 mb-1">Tự động trích tiền ghi Có nhầm</h4>
              <p className="text-slate-700 m-0 leading-relaxed text-xs sm:text-[13px]">
                Khách hàng ủy quyền vô điều kiện cho TVPAY tự động trích nợ thu hồi các khoản tiền ghi Có nhầm hoặc giao dịch có bằng chứng gian lận (Khoản 2.12).
              </p>
            </div>

            <div className="p-4 bg-white/95 rounded-2xl border-2 border-amber-300 shadow-xs">
              <span className="font-mono text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">Điểm then chốt 3</span>
              <h4 className="font-bold text-slate-900 mt-2 mb-1">Bảo vệ dữ liệu cá nhân</h4>
              <p className="text-slate-600 m-0 leading-relaxed text-xs sm:text-[13px]">
                Khách hàng có đầy đủ 11 quyền: Xem, chỉnh sửa, yêu cầu hạn chế xử lý dữ liệu và phản đối chia sẻ dữ liệu phục vụ mục đích quảng cáo (Khoản 1.8 - 1.10).
              </p>
            </div>
          </div>

          <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-300 text-xs sm:text-sm text-slate-800">
            <strong>Cân bằng quyền lợi:</strong> Minh chứng hợp đồng TVPAY vừa là khiên chắn bảo vệ tài chính cho công ty trước các vụ hack của người dùng, vừa tôn trọng tuyệt đối quyền riêng tư dữ liệu theo chuẩn mực pháp luật mới nhất.
          </div>
        </div>
      ),
    },

    // SLIDE 9: ĐIỀU 10 & 11: CƠ CHẾ PHONG TỎA TÀI KHOẢN VÀ CHÍNH SÁCH HOÀN TIỀN LỖI
    {
      id: 'wallet-slide-9',
      badge: 'SLIDE 09 / 14 · ĐIỀU 10 & 11: PHONG TỎA & LỖI',
      category: 'PHẦN 3 · ĐIỀU KHOẢN MẪU TRỌNG YẾU · LÊ PHƯƠNG THẢO PHỤ TRÁCH',
      title: 'ĐIỀU 10 & 11: CƠ CHẾ PHONG TỎA TÀI KHOẢN VÀ CHÍNH SÁCH HOÀN TIỀN LỖI',
      subtitle: '4 căn cứ phong tỏa, 5 điều kiện mở khóa và cam kết hoàn tiền lỗi giao dịch trong 05 ngày',
      speakerName: 'Lê Phương Thảo',
      speakerRole: 'Phó Nhóm 13 · Giải quyết tranh chấp',
      speakerAvatar: '/assets/team/le-phuong-thao.jpg',
      speakerNotes:
        'Kính thưa Thầy và các bạn, Điều 10 và Điều 11 xử lý các tình huống nhạy cảm nhất trong thanh toán số: phong tỏa tài khoản và hoàn tiền lỗi. TVPAY chỉ phong tỏa ví trong 4 trường hợp luật định: Có văn bản của cơ quan nhà nước; Theo yêu cầu tra soát đối tác; Khi phát hiện ghi Có nhầm; Hoặc có dấu hiệu gian lận vi phạm pháp luật. Đặc biệt Khoản 10.3 nêu rõ: chỉ phong tỏa số tiền tranh chấp, phần số dư hợp pháp còn lại vẫn được giao dịch bình thường. Đồng thời Điều 11 cam kết hoàn tiền giao dịch lỗi trong 05 ngày làm việc và hoàn toàn miễn phí.',
      renderContent: () => (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="p-4 bg-white/95 rounded-2xl border-2 border-amber-300 shadow-xs">
              <h4 className="font-bold text-slate-900 m-0 mb-2.5 flex items-center gap-2 text-sm sm:text-base">
                <Lock className="w-5 h-5 text-amber-600" />
                Cơ chế phong tỏa tài khoản ví (Điều 10)
              </h4>
              <ul className="space-y-2 text-slate-700 m-0 p-0 list-none">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span><strong>04 Trường hợp phong tỏa:</strong> Văn bản CQNN có thẩm quyền; Yêu cầu từ đối tác tra soát; Phát hiện ghi Có nhầm; Nghi ngờ gian lận lừa đảo.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span><strong>Nguyên tắc phong tỏa một phần:</strong> Số tiền phong tỏa không vượt quá số tiền tranh chấp. Phần số dư còn lại khách hàng vẫn sử dụng bình thường.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span><strong>05 Điều kiện mở khóa:</strong> Hết thời hạn phong tỏa; CQNN yêu cầu giải tỏa; Xử lý xong nhầm lẫn; Xác minh không vi phạm; Giải quyết xong khiếu nại.</span>
                </li>
              </ul>
            </div>

            <div className="p-4 bg-gradient-to-br from-amber-50 to-white rounded-2xl border-2 border-amber-400 shadow-xs">
              <h4 className="font-bold text-amber-950 m-0 mb-2.5 flex items-center gap-2 text-sm sm:text-base">
                <RefreshCw className="w-5 h-5 text-amber-700" />
                Chính sách hoàn tiền lỗi giao dịch (Điều 11)
              </h4>
              <ul className="space-y-2 text-slate-700 m-0 p-0 list-none">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Lỗi trừ tiền không ghi nhận:</strong> Khách hàng bị trừ tiền trong ví nhưng hệ thống merchant không ghi nhận giao dịch thành công.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Thời hạn hoàn trả 05 ngày:</strong> TVPAY thực hiện báo Có ví của khách hàng trong vòng 05 ngày làm việc kể từ khi có kết quả xác minh.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Cam kết không thu phí:</strong> Toàn bộ quá trình đối soát và hoàn tiền lỗi giao dịch được thực hiện miễn phí 100%.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },

    // SLIDE 10: ĐIỀU 12: QUY TRÌNH ĐÓNG TÀI KHOẢN VÍ & XỬ LÝ SỐ DƯ TỒN ĐỌNG
    {
      id: 'wallet-slide-10',
      badge: 'SLIDE 10 / 14 · ĐIỀU 12: ĐÓNG VÍ & SỐ DƯ',
      category: 'PHẦN 3 · ĐIỀU KHOẢN MẪU TRỌNG YẾU · LÊ PHƯƠNG THẢO PHỤ TRÁCH',
      title: 'ĐIỀU 12: QUY TRÌNH ĐÓNG TÀI KHOẢN VÍ & XỬ LÝ SỐ DƯ TỒN ĐỌNG',
      subtitle: '8 căn cứ đóng ví, giải pháp thừa kế và khắc phục rủi ro điều khoản "hủy sau 5 năm"',
      speakerName: 'Lê Phương Thảo',
      speakerRole: 'Phó Nhóm 13 · Giải quyết tranh chấp',
      speakerAvatar: '/assets/team/le-phuong-thao.jpg',
      speakerNotes:
        'Kính thưa Thầy và các bạn, Điều 12 quy định 8 căn cứ đóng tài khoản ví và các nghiệp vụ xác minh hủy lệnh. Điểm đặc sắc trong nghiên cứu của Nhóm 13 là nhận diện rủi ro tại Khoản 12.3.6: Quy định "sau 5 năm đóng ví thì hủy số dư và không hoàn trả" có nguy cơ xâm phạm quyền sở hữu tài sản của công dân theo Bộ luật Dân sự. Do đó, nhóm đã hoàn thiện giải pháp tư vấn: TVPAY tiếp tục theo dõi treo công nợ, thông báo định kỳ và chuyển số dư theo quy định pháp luật thừa kế/Tòa án, bảo đảm tuyệt đối tuân thủ Nghị định 52/2024.',
      renderContent: () => (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="p-4 bg-white/95 rounded-2xl border-2 border-amber-300 shadow-xs">
              <h4 className="font-bold text-slate-900 m-0 mb-2.5 flex items-center gap-2 text-sm sm:text-base">
                <AlertOctagon className="w-5 h-5 text-amber-600" />
                08 Căn cứ đóng tài khoản ví (Khoản 1)
              </h4>
              <p className="text-slate-700 m-0 leading-relaxed text-xs sm:text-[13px]">
                1. Theo yêu cầu của chủ tài khoản; 2. Cá nhân chết/mất tích; 3. TVPAY chấm dứt hoạt động; 4. Vi phạm cam kết thỏa thuận; 5. Dùng giấy tờ giả mạo eKYC; 6. Dùng ví lừa đảo; 7. Không liên kết ngân hàng sau thông báo; 8. Theo quyết định cơ quan nhà nước.
              </p>
            </div>

            <div className="p-4 bg-white/95 rounded-2xl border-2 border-amber-300 shadow-xs">
              <h4 className="font-bold text-slate-900 m-0 mb-2.5 flex items-center gap-2 text-sm sm:text-base">
                <Coins className="w-5 h-5 text-emerald-600" />
                Phương án xử lý số dư còn lại (Khoản 3)
              </h4>
              <p className="text-slate-700 m-0 leading-relaxed text-xs sm:text-[13px]">
                Chủ động rút về tài khoản ngân hàng chính chủ trước khi đóng; Chi trả cho người thừa kế hợp pháp nếu chủ ví qua đời; Chi trả theo bản án quyết định của Tòa án; Hoặc tiếp tục theo dõi treo công nợ nếu chưa liên lạc được với chủ tài khoản.
              </p>
            </div>
          </div>

          <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-300 text-xs sm:text-sm text-slate-800">
            <strong>Khắc phục bẫy pháp lý sau 5 năm:</strong> "Không tịch thu tài sản của khách hàng – Duy trì tài khoản treo công nợ và thông báo công khai theo luật định, bảo vệ an toàn pháp lý cho TVPAY trước nguy cơ kiện tụng."
          </div>
        </div>
      ),
    },

    // SLIDE 11: ĐIỀU 13: CƠ CHẾ TRA SOÁT, KHIẾU NẠI & GIÁ TRỊ CHỨNG CỨ ĐIỆN TỬ
    {
      id: 'wallet-slide-11',
      badge: 'SLIDE 11 / 14 · ĐIỀU 13: TRA SOÁT & CHỨNG CỨ',
      category: 'PHẦN 3 · ĐIỀU KHOẢN MẪU TRỌNG YẾU · PHẠM VĂN QUANG PHỤ TRÁCH',
      title: 'ĐIỀU 13: CƠ CHẾ TRA SOÁT, KHIẾU NẠI & GIÁ TRỊ CHỨNG CỨ ĐIỆN TỬ',
      subtitle: 'Các mốc thời gian vàng: 60 ngày khiếu nại, 30 ngày xử lý, 5 ngày bồi hoàn và lưu trữ log hệ thống',
      speakerName: 'Phạm Văn Quang',
      speakerRole: 'Chuyên viên Tố tụng & Tra soát Số',
      speakerAvatar: '/assets/team/quang-pham.jpg',
      speakerNotes:
        'Kính thưa Thầy và các bạn, Điều 13 là điều khoản thực chiến thiết lập quy trình giải quyết tra soát khiếu nại mẫu mực theo Thông tư 40/2024 của NHNN. Các mốc thời gian vàng gồm: Khách hàng được quyền khiếu nại trong vòng 60 ngày; TVPAY xử lý tối đa trong 30 ngày làm việc; Bồi hoàn tổn thất trong 5 ngày nếu có kết quả lỗi thuộc về ví; Hòa giải trong 15 ngày tiếp theo nếu chưa rõ lỗi; và báo cáo cơ quan công an nếu có dấu hiệu tội phạm. Toàn bộ lịch sử log, địa chỉ IP và mã OTP được lưu trữ làm chứng cứ điện tử vững chắc trước Tòa án.',
      renderContent: () => (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 text-xs sm:text-sm">
            <div className="p-4 bg-white/95 rounded-2xl border-2 border-amber-300 shadow-xs text-center">
              <span className="font-mono text-xl sm:text-2xl font-black text-amber-800 block mb-1">60 NGÀY</span>
              <strong className="block text-slate-900 mb-1">Thời hạn khiếu nại</strong>
              <p className="text-slate-600 m-0 text-xs sm:text-[13px]">Kể từ ngày phát sinh giao dịch đề nghị tra soát khiếu nại lần đầu.</p>
            </div>

            <div className="p-4 bg-white/95 rounded-2xl border-2 border-amber-300 shadow-xs text-center">
              <span className="font-mono text-xl sm:text-2xl font-black text-amber-800 block mb-1">30 NGÀY</span>
              <strong className="block text-slate-900 mb-1">Thời hạn xử lý tối đa</strong>
              <p className="text-slate-600 m-0 text-xs sm:text-[13px]">Làm việc kể từ ngày tiếp nhận yêu cầu, phối hợp với ngân hàng liên kết.</p>
            </div>

            <div className="p-4 bg-white/95 rounded-2xl border-2 border-amber-300 shadow-xs text-center">
              <span className="font-mono text-xl sm:text-2xl font-black text-emerald-700 block mb-1">05 NGÀY</span>
              <strong className="block text-slate-900 mb-1">Thời hạn bồi hoàn</strong>
              <p className="text-slate-600 m-0 text-xs sm:text-[13px]">Bồi hoàn ngay số tiền tổn thất vào ví khách hàng nếu lỗi thuộc về TVPAY.</p>
            </div>

            <div className="p-4 bg-white/95 rounded-2xl border-2 border-amber-300 shadow-xs text-center">
              <span className="font-mono text-xl sm:text-2xl font-black text-blue-700 block mb-1">15 NGÀY</span>
              <strong className="block text-slate-900 mb-1">Hòa giải chưa rõ lỗi</strong>
              <p className="text-slate-600 m-0 text-xs sm:text-[13px]">Thỏa thuận phương án bồi hoàn tạm thời trong khi chờ kết luận CQNN.</p>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-br from-amber-50 to-white rounded-2xl border-2 border-amber-400 text-xs sm:text-sm text-slate-700">
            <h4 className="font-bold text-amber-950 m-0 mb-1.5 flex items-center gap-2">
              <Database className="w-5 h-5 text-amber-700" />
              Giá trị chứng cứ điện tử trước Tòa án theo Luật GDĐT 2023
            </h4>
            <p className="m-0 leading-relaxed">
              Hệ thống TVPAY tự động sao lưu dữ liệu giao dịch, địa chỉ IP truy cập, thời gian phát sinh tính đến mili-giây, nhật ký xác thực OTP và chữ ký số. Đây là nguồn chứng cứ hợp pháp chứng minh doanh nghiệp đã thực hiện đúng thỏa thuận khi phát sinh tranh chấp tại Tòa.
            </p>
          </div>
        </div>
      ),
    },

    // SLIDE 12: ĐIỀU 16 & 18: GIỚI HẠN TRÁCH NHIỆM BỒI THƯỜNG & CHẤP THUẬN NGẦM ĐỊNH
    {
      id: 'wallet-slide-12',
      badge: 'SLIDE 12 / 14 · ĐIỀU 16 & 18: LÁ CHẮN',
      category: 'PHẦN 3 · ĐIỀU KHOẢN MẪU TRỌNG YẾU · PHẠM VĂN QUANG PHỤ TRÁCH',
      title: 'ĐIỀU 16 & 18: GIỚI HẠN TRÁCH NHIỆM BỒI THƯỜNG & CHẤP THUẬN NGẦM ĐỊNH',
      subtitle: 'Lá chắn tài chính: Bồi thường tối đa bằng số dư ví và cơ chế sửa đổi điều khoản thông báo trước',
      speakerName: 'Phạm Văn Quang',
      speakerRole: 'Chuyên viên Tố tụng & Tra soát Số',
      speakerAvatar: '/assets/team/quang-pham.jpg',
      speakerNotes:
        'Kính thưa quý vị, nếu phải chọn ra hai điều khoản mang tính "khiên chắn sinh tử" bảo vệ nguồn vốn 50 tỷ của công ty thì đó chính là Điều 16 và Điều 18. Khoản 16.5 nêu rõ: Trong mọi trường hợp phải bồi thường thiệt hại, toàn bộ trách nhiệm của TVPAY được giới hạn tối đa không vượt quá số dư ví của khách hàng ngay trước thời điểm phát sinh thiệt hại. Điều này chặn đứng nguy cơ đối mặt các khoản bồi thường vô hạn hàng chục tỷ đồng. Đồng thời Điều 18 xác lập cơ chế: TVPAY đăng tải sửa đổi trên website/app, nếu khách hàng tiếp tục sử dụng thì mặc nhiên được coi là đồng ý chấp thuận.',
      renderContent: () => (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="p-4 bg-white/95 rounded-2xl border-2 border-amber-300 shadow-xs">
              <span className="font-mono text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">Điều 16 · Giới hạn trách nhiệm</span>
              <h4 className="font-bold text-slate-900 mt-2 mb-2 text-sm sm:text-base">Mức bồi thường tối đa bằng số dư ví</h4>
              <ul className="space-y-2 text-slate-700 m-0 p-0 list-none">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Giới hạn tài chính:</strong> Trách nhiệm bồi thường không vượt quá số dư ví ngay trước thời điểm phát sinh tổn thất.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Miễn trừ bất khả kháng:</strong> Miễn trừ trách nhiệm khi nghẽn mạng viễn thông quốc gia, lỗi từ bên thứ ba hoặc thiên tai.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Không bù đắp rủi ro vĩ mô:</strong> Không chịu trách nhiệm về lạm phát, khấu hao tiền tệ hay thay đổi chính sách kinh tế.</span>
                </li>
              </ul>
            </div>

            <div className="p-4 bg-gradient-to-br from-amber-50 to-white rounded-2xl border-2 border-amber-400 shadow-xs">
              <span className="font-mono text-xs font-bold text-amber-900 bg-amber-200 px-2 py-0.5 rounded">Điều 18 · Chấp thuận ngầm định</span>
              <h4 className="font-bold text-amber-950 mt-2 mb-2 text-sm sm:text-base">Cơ chế sửa đổi điều khoản linh hoạt</h4>
              <ul className="space-y-2 text-slate-700 m-0 p-0 list-none">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span><strong>Phương thức thông báo:</strong> Thông báo trên website www.tvpay.com.vn, ứng dụng hoặc qua SMS/Email đã đăng ký.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span><strong>Chấp thuận ngầm định (Khoản 18.2):</strong> Nếu khách hàng tiếp tục dùng ví sau ngày thông báo, mặc nhiên được hiểu là chấp thuận toàn bộ.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span><strong>Quyền đơn phương chấm dứt:</strong> Khách hàng không đồng ý có quyền đóng ví và rút hết số dư về tài khoản ngân hàng.</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="p-3 bg-amber-100/80 rounded-xl border border-amber-300 text-center text-xs sm:text-sm font-semibold text-amber-950">
            Lá chắn kép: "Hạn chế tối đa rủi ro tài chính phát sinh – Giữ vững sự chủ động linh hoạt cập nhật quy chuẩn theo đà phát triển công nghệ."
          </div>
        </div>
      ),
    },

    // SLIDE 13: PHẦN C: HỆ SINH THÁI TIỆN ÍCH, LOYALTY & BÁNH ĐÀ DOANH THU NĐT
    {
      id: 'wallet-slide-13',
      badge: 'SLIDE 13 / 14 · PHẦN C: HỆ SINH THÁI',
      category: 'PHẦN 4 · HỆ SINH THÁI & TĂNG TRƯỞNG · ĐOÀN ÁNH PHƯƠNG PHỤ TRÁCH',
      title: 'PHẦN C: HỆ SINH THÁI TIỆN ÍCH, LOYALTY & BÁNH ĐÀ DOANH THU NĐT',
      subtitle: '4 Điều khoản mở rộng: Onboarding < 2 phút, QR Code toàn quốc, Cashback và giữ chân người dùng',
      speakerName: 'Đoàn Ánh Phương',
      speakerRole: 'Trưởng Nhóm 13 · Chiến lược sản phẩm',
      speakerAvatar: '/assets/team/anh-phuong.jpg',
      speakerNotes:
        'Kính thưa Thầy và các bạn, một hợp đồng pháp lý hoàn hảo không chỉ dừng ở phòng ngừa rủi ro, mà còn phải tạo động lực thương mại thúc đẩy doanh số. Phần C của Hợp đồng TVPAY tích hợp 4 điều khoản thực chiến mang lại doanh thu đột phá cho 5 nhà đầu tư: Điều C1: Onboarding định danh eKYC siêu tốc dưới 2 phút; Điều C2: Kết nối mạng lưới QR Code liên ngân hàng toàn quốc; Điều C3: Hệ sinh thái Cashback và Hội viên VIP 4 hạng giữ chân người dùng; Và Điều C4: Cơ chế bánh đà doanh thu từ phí xử lý thanh toán Merchant 1-2%, biến lượng người dùng tích cực thành dòng tiền lợi nhuận bền vững.',
      renderContent: () => (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 text-xs sm:text-sm">
            <div className="p-4 bg-white/95 rounded-2xl border-2 border-amber-300 shadow-xs">
              <span className="font-mono text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">Điều C1</span>
              <h4 className="font-bold text-slate-900 mt-2 mb-1">Onboarding eKYC &lt; 2p</h4>
              <p className="text-slate-600 m-0 leading-relaxed text-xs sm:text-[13px]">
                Ứng dụng công nghệ đọc chip NFC và so khớp sinh trắc học trực tiếp với Cơ sở dữ liệu Quốc gia về dân cư, mở ví thành công dưới 2 phút.
              </p>
            </div>

            <div className="p-4 bg-white/95 rounded-2xl border-2 border-amber-300 shadow-xs">
              <span className="font-mono text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">Điều C2</span>
              <h4 className="font-bold text-slate-900 mt-2 mb-1">Mạng lưới VietQR toàn quốc</h4>
              <p className="text-slate-600 m-0 leading-relaxed text-xs sm:text-[13px]">
                Quét mã thanh toán tại hơn 100.000 điểm chấp nhận thanh toán, siêu thị, nhà hàng, cây xăng và thanh toán dịch vụ công trực tuyến.
              </p>
            </div>

            <div className="p-4 bg-white/95 rounded-2xl border-2 border-amber-300 shadow-xs">
              <span className="font-mono text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">Điều C3</span>
              <h4 className="font-bold text-slate-900 mt-2 mb-1">Cashback &amp; Loyalty 4 Hạng</h4>
              <p className="text-slate-600 m-0 leading-relaxed text-xs sm:text-[13px]">
                Cơ chế hoàn tiền tự động, tích lũy điểm thưởng và phân hạng thành viên (Đồng, Bạc, Vàng, Kim Cương), gia tăng tần suất giao dịch hàng ngày.
              </p>
            </div>

            <div className="p-4 bg-amber-50/90 rounded-2xl border-2 border-amber-400 shadow-xs">
              <span className="font-mono text-xs font-bold text-amber-900 bg-amber-200 px-2 py-0.5 rounded">Điều C4</span>
              <h4 className="font-bold text-amber-950 mt-2 mb-1">Bánh đà doanh thu NĐT</h4>
              <p className="text-slate-700 m-0 leading-relaxed text-xs sm:text-[13px]">
                Mô hình doanh thu đa nguồn: Phí xử lý giao dịch Merchant (1-2%), phí dịch vụ giá trị gia tăng, hoa hồng bảo hiểm và dòng tiền số dư thặng dư.
              </p>
            </div>
          </div>

          <div className="p-3.5 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 rounded-xl text-white text-center shadow-xs">
            <span className="text-xs sm:text-sm font-bold">
              Bánh đà tăng trưởng TVPAY: Người dùng hài lòng → GMV bùng nổ → Doanh thu Merchant tăng tốc → Lợi nhuận cổ đông bền vững.
            </span>
          </div>
        </div>
      ),
    },

    // SLIDE 14: TỔNG KẾT BÁO CÁO: KẾT HỢP ĐỒNG BỘ 04 TRỤ CỘT
    {
      id: 'wallet-slide-14',
      badge: 'SLIDE 14 / 14 · TỔNG KẾT HỢP ĐỒNG',
      category: 'PHẦN 4 · CHIẾN LƯỢC TỔNG THỂ · ĐOÀN ÁNH PHƯƠNG PHỤ TRÁCH',
      title: 'TỔNG KẾT BÁO CÁO: KẾT HỢP ĐỒNG BỘ 04 TRỤ CỘT BẢO VỆ FINTECH',
      subtitle: 'Chuyển dịch mô hình phòng thủ chủ động: Pháp lý – Hợp đồng – Công nghệ – Quản trị',
      speakerName: 'Đoàn Ánh Phương',
      speakerRole: 'Trưởng Nhóm 13 · Tổng kết 4 trụ cột',
      speakerAvatar: '/assets/team/anh-phuong.jpg',
      speakerNotes:
        'Kính thưa Thầy và các bạn, để khép lại bài thuyết trình, Nhóm 13 xin khẳng định: Bảo vệ quyền và lợi ích hợp pháp của doanh nghiệp Fintech ví điện tử không thể chỉ dựa vào một văn bản đơn lẻ, mà đòi hỏi sự kết hợp đồng bộ 4 trụ cột: Pháp lý vững vàng - Hợp đồng chặt chẽ - Công nghệ an toàn - và Quản trị tuân thủ thường xuyên. Nếu Điều lệ là nền tảng quản trị nội bộ thì Hợp đồng ví chính là tuyến phòng thủ tuyến đầu. Đó là con đường duy nhất để TVPAY chuyển từ bị động xử lý sự vụ sang chủ động nhận diện và phòng ngừa rủi ro từ sớm. Xin cảm ơn Thầy và các bạn đã chú ý lắng nghe!',
      renderContent: () => (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 text-xs sm:text-sm">
            <div className="p-4 bg-white/95 rounded-2xl border-2 border-amber-300 shadow-xs text-center">
              <div className="w-10 h-10 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 mx-auto mb-2">
                <Scale className="w-6 h-6 text-amber-700" />
              </div>
              <h4 className="font-bold text-slate-900 m-0 mb-1 text-sm sm:text-base">1. TRỤ CỘT PHÁP LÝ</h4>
              <p className="text-slate-600 m-0 text-xs sm:text-[13px]">
                Nền tảng Luật Doanh nghiệp 2020 &amp; Nghị định 52/2024 đảm bảo tính hợp pháp tối cao cho mọi giao dịch.
              </p>
            </div>

            <div className="p-4 bg-white/95 rounded-2xl border-2 border-amber-300 shadow-xs text-center">
              <div className="w-10 h-10 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 mx-auto mb-2">
                <FileCheck2 className="w-6 h-6 text-amber-700" />
              </div>
              <h4 className="font-bold text-slate-900 m-0 mb-1 text-sm sm:text-base">2. TRỤ CỘT HỢP ĐỒNG</h4>
              <p className="text-slate-600 m-0 text-xs sm:text-[13px]">
                Điều khoản mẫu chuẩn hóa, giới hạn trách nhiệm tài chính và cơ chế giải quyết khiếu nại minh bạch.
              </p>
            </div>

            <div className="p-4 bg-white/95 rounded-2xl border-2 border-amber-300 shadow-xs text-center">
              <div className="w-10 h-10 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 mx-auto mb-2">
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
              </div>
              <h4 className="font-bold text-slate-900 m-0 mb-1 text-sm sm:text-base">3. TRỤ CỘT CÔNG NGHỆ</h4>
              <p className="text-slate-600 m-0 text-xs sm:text-[13px]">
                AI giám sát dòng tiền bất thường, sinh trắc học eKYC và lưu trữ chứng cứ điện tử sẵn sàng trước Tòa.
              </p>
            </div>

            <div className="p-4 bg-white/95 rounded-2xl border-2 border-amber-300 shadow-xs text-center">
              <div className="w-10 h-10 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 mx-auto mb-2">
                <Landmark className="w-6 h-6 text-blue-700" />
              </div>
              <h4 className="font-bold text-slate-900 m-0 mb-1 text-sm sm:text-base">4. TRỤ CỘT QUẢN TRỊ</h4>
              <p className="text-slate-600 m-0 text-xs sm:text-[13px]">
                Kiểm soát tuân thủ liên tục đa luật, trích lập Quỹ dự phòng rủi ro bảo toàn vốn 50 tỷ của nhà đầu tư.
              </p>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 rounded-2xl text-white text-center shadow-md">
            <h3 className="text-sm sm:text-base md:text-lg font-bold m-0 mb-1">
              TVPAY: CHỦ ĐỘNG NHẬN DIỆN &amp; PHÒNG NGỪA RỦI RO TỪ SỚM
            </h3>
            <p className="text-xs sm:text-sm text-amber-100 m-0">
              Bộ đôi Điều lệ &amp; Hợp đồng ví tạo nên hệ thống quản trị pháp lý toàn diện, vững vàng phát triển bền vững.
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

  const toggleFullscreen = useCallback(() => {
    uiSound.playClick();
    setIsFullscreen((prev) => !prev);
  }, []);

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
        '01 · Bìa & Định vị',
        '02 · 4 Nguyên tắc',
        '03 · 5 Vai trò',
        '04 · 9 Chương',
        '05 · Cổ đông 50 Tỷ',
        '06 · Ổn định CĐ',
        '07 · Thẩm quyền',
        '08 · Vốn & Quỹ rủi ro',
        '09 · Sở hữu trí tuệ',
        '10 · Khủng hoảng mạng',
        '11 · May đo ngành ví',
        '12 · Tổng kết Điều lệ',
      ];
      return labels[idx] || `Slide ${idx + 1}`;
    }
    const labels = [
      '01 · Bìa & Tuyến đầu',
      '02 · 4 Nội dung',
      '03 · 6 Vai trò',
      '04 · 5 Giải pháp',
      '05 · Đ.2 Nạp rút tiền',
      '06 · Đ.2 eKYC 100 Tr',
      '07 · Đ.6 Lằn ranh cấm',
      '08 · Đ.7 Quyền & Nghĩa vụ',
      '09 · Đ.10-11 Phong tỏa',
      '10 · Đ.12 Đóng ví 5 năm',
      '11 · Đ.13 Tra soát Tòa',
      '12 · Đ.16-18 Lá chắn',
      '13 · Phần C Hệ sinh thái',
      '14 · Tổng kết 4 Trụ cột',
    ];
    return labels[idx] || `Slide ${idx + 1}`;
  };

  // =========================================================================
  // TRUE FULLSCREEN VIEW (Projector-Grade Typography, Gold & Ivory Theme)
  // =========================================================================
  if (isFullscreen) {
    return (
      <div
        ref={containerRef}
        className="tvpay-fullscreen-mode tvpay-presentation-fullscreen fixed inset-0 z-[9999] w-screen h-screen bg-gradient-to-br from-[#FFFDF9] via-[#FAF6EE] to-[#F5ECE0] flex flex-col justify-between overflow-hidden select-none p-4 sm:p-6 md:p-8 lg:p-10 animate-in fade-in duration-300"
      >
        {/* Ornate Gold Filigree Corners */}
        <RoyalScreenCorner position="top-left" />
        <RoyalScreenCorner position="top-right" />
        <RoyalScreenCorner position="bottom-left" />
        <RoyalScreenCorner position="bottom-right" />

        {/* Guilloché Watermark in Center Background */}
        <RoyalWatermark />

        {/* Fullscreen Top Gold Navigation Bar */}
        <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-wrap items-center justify-between pb-3.5 border-b border-amber-300/80 gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <span className="p-2.5 rounded-2xl bg-gradient-to-br from-[#FFF8E7] to-[#F3E5BE] border border-[#D4AF37]/80 text-[#8C6B18] shadow-xs shrink-0">
              <FileCheck2 className="w-6 h-6" />
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs uppercase font-bold tracking-wider text-[#8C6B18] font-mono bg-amber-100/90 border border-amber-300/80 px-2.5 py-1 rounded truncate">
                  {isCharter
                    ? `BÁO CÁO ĐIỀU LỆ CÔNG TY CP CUNG ỨNG VÍ ĐIỆN TỬ TVPAY · ${totalSlides} SLIDES`
                    : `BÁO CÁO HỢP ĐỒNG MỞ VÀ SỬ DỤNG VÍ ĐIỆN TỬ TVPAY · ${totalSlides} SLIDES`}
                </span>
                <span className="text-xs sm:text-sm font-mono font-bold text-[#7A5B10] bg-amber-200/80 px-2.5 py-1 rounded border border-amber-300 shadow-2xs">
                  SLIDE {currentSlide + 1} / {totalSlides}
                </span>
              </div>
              <h2 className="font-serif text-lg sm:text-2xl md:text-3xl font-bold text-slate-900 m-0 mt-1 truncate">
                {activeSlide.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {/* Keyboard hints */}
            <div className="hidden lg:flex items-center gap-1.5 text-xs sm:text-sm text-slate-600 bg-white/95 px-3 py-1.5 rounded-xl border border-amber-200/80 shadow-2xs">
              <kbd className="px-2 py-0.5 bg-amber-50 border border-amber-300 rounded text-[#8C6B18] font-mono text-xs font-bold">
                ←
              </kbd>
              <kbd className="px-2 py-0.5 bg-amber-50 border border-amber-300 rounded text-[#8C6B18] font-mono text-xs font-bold">
                →
              </kbd>
              <span className="text-slate-400">hoặc</span>
              <kbd className="px-2 py-0.5 bg-amber-50 border border-amber-300 rounded text-[#8C6B18] font-mono text-xs font-bold">
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

        {/* Fullscreen Slide Content Stage */}
        <div className="relative z-10 w-full max-w-7xl mx-auto flex-1 flex flex-col justify-between overflow-y-auto slide-theater-scroll py-3 px-1">
          <div>
            {/* Slide Category Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-amber-200/80">
              <div className="flex items-center gap-2.5">
                <span className="text-xs sm:text-sm font-mono font-extrabold uppercase px-2.5 py-1 rounded bg-white text-[#8C6B18] border border-amber-300 shadow-2xs">
                  {activeSlide.badge}
                </span>
                <span className="text-xs sm:text-sm md:text-base font-bold text-[#8C6B18] uppercase tracking-wide">
                  {activeSlide.category}
                </span>
              </div>
            </div>

            <p className="text-sm sm:text-base md:text-lg text-slate-800 font-medium leading-relaxed mb-4">
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

            {/* Speaker Notes Callout */}
            {activeSlide.speakerNotes && (
              <div className="tvpay-speaker-box mt-4 p-4 sm:p-5 bg-gradient-to-r from-amber-50/95 via-white to-amber-50/95 rounded-2xl border-2 border-amber-300/90 shadow-xs flex items-start gap-4">
                {activeSlide.speakerAvatar ? (
                  <div className="relative shrink-0 mt-0.5">
                    <img
                      src={activeSlide.speakerAvatar}
                      alt={activeSlide.speakerName || 'Thành viên Nhóm 13'}
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-amber-400 shadow-sm"
                    />
                    <span
                      className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center text-[9px] text-white font-bold"
                      title="Diễn giả sẵn sàng"
                    >
                      ✓
                    </span>
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 font-bold shrink-0 mt-0.5">
                    13
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <MessageSquare className="w-4 h-4 text-[#C59B27] shrink-0" />
                      <strong className="text-sm sm:text-base text-slate-900 font-bold">
                        {activeSlide.speakerName || 'Thành viên Nhóm 13 (Thịnh Vượng Legal)'}
                      </strong>
                      {activeSlide.speakerRole && (
                        <span className="text-xs sm:text-sm px-2.5 py-0.5 rounded bg-amber-100/90 text-[#7A5B10] font-medium border border-amber-200/80 hidden sm:inline">
                          {activeSlide.speakerRole}
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-mono text-slate-400 uppercase font-semibold">
                      Speaker Notes
                    </span>
                  </div>
                  <p className="text-sm sm:text-base text-slate-700 leading-relaxed m-0 italic bg-amber-50/50 p-3 rounded-xl border border-amber-200/60">
                    "{activeSlide.speakerNotes}"
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Fullscreen Bottom Navigation Controls */}
        <div className="relative z-10 w-full max-w-7xl mx-auto pt-3.5 border-t border-amber-300/80 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={prevSlide}
            className="px-4 py-2 text-xs sm:text-sm font-bold bg-white hover:bg-amber-50 text-[#7A5B10] border border-amber-300 rounded-xl transition flex items-center gap-2 cursor-pointer shadow-xs hover:border-amber-400"
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
                  className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 cursor-pointer shrink-0 ${
                    isActive
                      ? 'bg-[#C59B27] text-white shadow-sm font-bold border border-amber-500 ring-2 ring-amber-300/60'
                      : 'bg-white/90 text-slate-700 hover:text-slate-900 border border-amber-200/80 hover:bg-amber-50'
                  }`}
                  title={s.title}
                >
                  <span className="font-mono text-xs opacity-90">{idx + 1 < 10 ? `0${idx + 1}` : idx + 1}</span>
                  <span className="hidden xl:inline text-xs truncate max-w-[110px]">
                    {getSlideLabel(idx)}
                  </span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={nextSlide}
            className="px-4 py-2 text-xs sm:text-sm font-bold bg-gradient-to-r from-[#D4AF37] via-[#C59B27] to-[#A87B15] hover:brightness-105 text-white border border-amber-300 rounded-xl transition flex items-center gap-2 cursor-pointer shadow-md"
          >
            <span>Trang tiếp</span>
            <ChevronRight className="w-4 h-4 text-amber-100" />
          </button>
        </div>
      </div>
    );
  }

  // =========================================================================
  // INLINE PRESENTATION CARD (Regal Gold & Ivory)
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
                    ? `BÁO CÁO ĐIỀU LỆ CÔNG TY CP CUNG ỨNG VÍ ĐIỆN TỬ TVPAY · ${totalSlides} SLIDES`
                    : `BÁO CÁO HỢP ĐỒNG MỞ VÀ SỬ DỤNG VÍ ĐIỆN TỬ TVPAY · ${totalSlides} SLIDES`}
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

            {/* Speaker Notes Callout with Real Team Member Avatar */}
            {activeSlide.speakerNotes && (
              <div className="mt-4 p-3.5 sm:p-4 bg-gradient-to-r from-amber-50/95 via-white to-amber-50/95 rounded-xl border border-amber-300/80 shadow-2xs flex items-start gap-3">
                {activeSlide.speakerAvatar ? (
                  <div className="relative shrink-0 mt-0.5">
                    <img
                      src={activeSlide.speakerAvatar}
                      alt={activeSlide.speakerName || 'Thành viên Nhóm 13'}
                      className="w-11 h-11 rounded-full object-cover border-2 border-amber-400 shadow-sm"
                    />
                    <span
                      className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center text-[8px] text-white font-bold"
                      title="Diễn giả sẵn sàng"
                    >
                      ✓
                    </span>
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 font-bold shrink-0 mt-0.5">
                    13
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <MessageSquare className="w-3.5 h-3.5 text-[#C59B27] shrink-0" />
                      <strong className="text-xs sm:text-sm text-slate-900 font-bold">
                        {activeSlide.speakerName || 'Thành viên Nhóm 13 (Thịnh Vượng Legal)'}
                      </strong>
                      {activeSlide.speakerRole && (
                        <span className="text-xs px-2 py-0.5 rounded bg-amber-100/90 text-[#7A5B10] font-medium border border-amber-200/60 hidden sm:inline">
                          {activeSlide.speakerRole}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] sm:text-xs font-mono text-slate-400 uppercase font-semibold">
                      Speaker Script · Nhóm 13
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed m-0 italic bg-amber-50/40 p-2.5 rounded-lg border border-amber-200/50">
                    "{activeSlide.speakerNotes}"
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Interactive Navigation & Thumbnails */}
          <div className="mt-6 pt-4 border-t border-amber-200/80 flex flex-wrap items-center justify-between gap-3 shrink-0">
            {/* Prev Button */}
            <button
              type="button"
              onClick={prevSlide}
              className="px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs sm:text-sm font-bold bg-white hover:bg-amber-50 text-[#7A5B10] border border-amber-300 rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-xs hover:border-amber-400"
            >
              <ChevronLeft className="w-4 h-4 text-[#C59B27]" />
              <span>Trang trước</span>
            </button>

            {/* Step Indicators / Dot Pills */}
            <div className="flex items-center gap-1 overflow-x-auto py-1 max-w-[65vw] sm:max-w-none scrollbar-none">
              {slides.map((s, idx) => {
                const isActive = idx === currentSlide;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => goToSlide(idx)}
                    className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1 cursor-pointer shrink-0 ${
                      isActive
                        ? 'bg-[#C59B27] text-white shadow-sm font-bold border border-amber-500'
                        : 'bg-white/80 text-slate-600 hover:text-slate-900 border border-amber-200/60 hover:bg-white'
                    }`}
                    title={s.title}
                  >
                    <span className="font-mono text-xs opacity-90">{idx + 1 < 10 ? `0${idx + 1}` : idx + 1}</span>
                    <span className="hidden xl:inline text-xs truncate max-w-[95px]">
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
