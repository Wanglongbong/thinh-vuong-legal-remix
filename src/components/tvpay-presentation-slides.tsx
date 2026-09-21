import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  AlertTriangle,
  Award,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Expand,
  FileCheck2,
  FileText,
  HelpCircle,
  Landmark,
  Layers,
  Lock,
  Maximize2,
  MessageSquare,
  Minimize2,
  Pause,
  Play,
  Scale,
  Server,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Users,
  Volume2,
  VolumeX,
  Zap,
} from 'lucide-react';
import { tvpayOfficialDocs, type OfficialDocumentData } from '@/lib/tvpay-official-docs';
import { uiSound } from '@/lib/ui-sound';

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
  // 10 SLIDES CHUYÊN SÂU THEO FILE "PHẦN NỘI DUNG KHÁC" (GOOGLE DOC CHÍNH THỨC)
  // Phân công: Lê Phương Thảo, Vũ Thảo, Dạ Thảo, Nhung, Thu, AP
  // =========================================================================
  const charterSlides: SlideItem[] = [
    // SLIDE 1: BÌA BÁO CÁO & PHÂN CÔNG THUYẾT TRÌNH NHÓM 13
    {
      id: 'slide-1',
      badge: 'SLIDE 01 / 10 · BÁO CÁO TƯ VẤN',
      category: 'HỒ SƠ TƯ VẤN PHÁP LÝ · NHÓM 13 (THỊNH VƯỢNG LEGAL) · KHOA LUẬT HVNH',
      title: 'XÂY DỰNG ĐIỀU LỆ & GIẢI PHÁP BẢO VỆ 05 NHÀ ĐẦU TƯ CÔNG TY CỔ PHẦN TVPAY',
      subtitle: 'Sản phẩm tư vấn pháp lý chuyên sâu bảo vệ 50 tỷ đồng vốn góp và chuẩn hóa điều kiện cấp phép ví điện tử tại NHNN',
      speakerName: 'Đoàn Ánh Phương',
      speakerRole: 'Trưởng Nhóm 13 · Điều phối viên',
      speakerAvatar: '/assets/team/anh-phuong.jpg',
      speakerNotes:
        'Kính thưa Thầy và các bạn, hôm nay Nhóm 13 đại diện cho Thịnh Vượng Legal xin báo cáo kết quả dự án tư vấn xây dựng Điều lệ cho 05 Nhà đầu tư sáng lập của Công ty Cổ phần TVPAY (ông Lê Quang Tùng, ông Trịnh Hoàng Sơn, ông Nguyễn Minh Lân, bà Phạm Phương Hà, bà Lê Thu Minh). Với quy mô vốn 50 tỷ đồng đầu tư vào lĩnh vực ví điện tử, yêu cầu cấp thiết mà 5 nhà đầu tư đặt ra cho nhóm tư vấn là phải xây dựng một bản Điều lệ vừa đủ điều kiện cấp phép khắt khe của Ngân hàng Nhà nước, vừa là thành trì pháp lý vững chắc bảo vệ quyền kiểm soát và tài sản cho các nhà đầu tư.',
      renderContent: () => (
        <div className="space-y-3">
          {/* Top 3 Strategic Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
            <div className="stagger-1 p-3 bg-white/95 rounded-xl border border-amber-300 shadow-2xs">
              <div className="flex items-center gap-2 mb-1 text-[#8C6B18]">
                <Landmark className="w-4 h-4 text-amber-600" />
                <span className="text-[10.5px] font-bold uppercase tracking-wider">Doanh nghiệp thành lập</span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 m-0 mb-0.5">CÔNG TY CỔ PHẦN TVPAY</h4>
              <p className="text-[11px] text-slate-600 leading-relaxed m-0">
                Số 89 Láng Hạ, Đống Đa, Hà Nội. Giấy phép trung gian thanh toán NHNN. Đại diện pháp luật: Tổng Giám đốc Lê Quang Tùng.
              </p>
            </div>

            <div className="stagger-2 p-3 bg-gradient-to-br from-amber-50 to-white rounded-xl border border-amber-400 shadow-2xs">
              <div className="flex items-center gap-2 mb-1 text-amber-800">
                <Award className="w-4 h-4 text-[#C59B27]" />
                <span className="text-[10.5px] font-bold uppercase tracking-wider">Khách hàng: 05 Nhà đầu tư</span>
              </div>
              <h4 className="text-xs font-black text-amber-900 m-0 mb-0.5">50.000.000.000 VNĐ (50 Tỷ)</h4>
              <p className="text-[11px] text-slate-600 leading-relaxed m-0">
                Góp đủ 100% bằng tiền đồng Việt Nam theo Điều 24 Luật DN &amp; quy chuẩn bảo toàn vốn 1:1 của Ngân hàng Nhà nước.
              </p>
            </div>

            <div className="stagger-3 p-3 bg-white/95 rounded-xl border border-blue-300 shadow-2xs">
              <div className="flex items-center gap-2 mb-1 text-blue-800">
                <Scale className="w-4 h-4 text-blue-600" />
                <span className="text-[10.5px] font-bold uppercase tracking-wider">Đơn vị tư vấn chuyên môn</span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 m-0 mb-0.5">Nhóm 13 (Thịnh Vượng Legal)</h4>
              <p className="text-[11px] text-slate-600 leading-relaxed m-0">
                Sinh viên Khoa Luật HVNH bảo trợ pháp lý, thẩm định theo Luật Doanh nghiệp 2020 &amp; Nghị định 52/2024/NĐ-CP.
              </p>
            </div>
          </div>

          {/* Visual Capital Distribution Infographic + Photo */}
          <div className="stagger-3 p-3 bg-white rounded-xl border border-amber-200/90 shadow-2xs">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <span className="text-[11px] font-bold text-slate-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Cơ Cấu Sở Hữu Vốn Điều Lệ 50 Tỷ Đồng Giữa 05 Nhà Đầu Tư Sáng Lập:
              </span>
              <span className="text-[10.5px] font-mono font-bold text-[#8C6B18] bg-amber-100 px-2 py-0.5 rounded">
                100% VỐN NỘI BỘ KHÉP KÍN
              </span>
            </div>

            {/* Segmented Color Progress Bar */}
            <div className="w-full h-3 rounded-full overflow-hidden flex shadow-inner mb-2.5 bg-slate-100">
              <div className="h-full bg-amber-500 transition-all" style={{ width: '40%' }} title="Lê Quang Tùng: 40% (20 Tỷ)" />
              <div className="h-full bg-emerald-500 transition-all" style={{ width: '20%' }} title="Trịnh Hoàng Sơn: 20% (10 Tỷ)" />
              <div className="h-full bg-blue-500 transition-all" style={{ width: '16%' }} title="Nguyễn Minh Lân: 16% (8 Tỷ)" />
              <div className="h-full bg-pink-500 transition-all" style={{ width: '14%' }} title="Phạm Phương Hà: 14% (7 Tỷ)" />
              <div className="h-full bg-orange-500 transition-all" style={{ width: '10%' }} title="Lê Thu Minh: 10% (5 Tỷ)" />
            </div>

            {/* 5 Investor Colorful Badge Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 text-[10.5px]">
              <div className="p-1.5 bg-amber-50/80 rounded-lg border border-amber-300 text-amber-950 font-medium">
                <strong className="block text-amber-800 font-bold">1. Lê Quang Tùng</strong>
                <span>40% · 20 Tỷ VNĐ</span>
              </div>
              <div className="p-1.5 bg-emerald-50/80 rounded-lg border border-emerald-300 text-emerald-950 font-medium">
                <strong className="block text-emerald-800 font-bold">2. Trịnh Hoàng Sơn</strong>
                <span>20% · 10 Tỷ VNĐ</span>
              </div>
              <div className="p-1.5 bg-blue-50/80 rounded-lg border border-blue-300 text-blue-950 font-medium">
                <strong className="block text-blue-800 font-bold">3. Nguyễn Minh Lân</strong>
                <span>16% · 8 Tỷ VNĐ</span>
              </div>
              <div className="p-1.5 bg-pink-50/80 rounded-lg border border-pink-300 text-pink-950 font-medium">
                <strong className="block text-pink-800 font-bold">4. Phạm Phương Hà</strong>
                <span>14% · 7 Tỷ VNĐ</span>
              </div>
              <div className="p-1.5 bg-orange-50/80 rounded-lg border border-orange-300 text-orange-950 font-medium">
                <strong className="block text-orange-800 font-bold">5. Lê Thu Minh</strong>
                <span>10% · 5 Tỷ VNĐ</span>
              </div>
            </div>
          </div>

          {/* Team Presentation Roles Banner with Image */}
          <div className="stagger-4 p-3 bg-gradient-to-r from-amber-100/70 via-amber-50 to-amber-100/70 rounded-xl border border-amber-300/80 flex flex-col sm:flex-row items-center gap-3">
            <img
              src="/assets/contract-signing.jpg"
              alt="Ký kết thỏa thuận TVPAY"
              className="w-full sm:w-28 h-18 object-cover rounded-lg border border-amber-300 shadow-xs shrink-0"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 mb-1 text-[#7A5B10] font-bold text-xs">
                <Users className="w-3.5 h-3.5 text-[#8C6B18]" />
                <span>Phân công báo cáo của Tổ chuyên gia tư vấn Nhóm 13:</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 text-xs">
                <div className="p-1.5 bg-white/90 rounded-md border border-amber-200">
                  <span className="text-[#8C6B18] font-bold block text-[10px] uppercase">Phần 1 · Slide 2, 3, 4</span>
                  <span className="text-slate-800 font-semibold text-[11px]">Lê Phương Thảo</span>
                </div>
                <div className="p-1.5 bg-white/90 rounded-md border border-emerald-200">
                  <span className="text-emerald-800 font-bold block text-[10px] uppercase">Phần 2 · Slide 5, 6, 7</span>
                  <span className="text-slate-800 font-semibold text-[11px]">Vũ Thảo + Dạ Thảo</span>
                </div>
                <div className="p-1.5 bg-white/90 rounded-md border border-blue-200">
                  <span className="text-blue-800 font-bold block text-[10px] uppercase">Phần 3 · Slide 8, 9, 10</span>
                  <span className="text-slate-800 font-semibold text-[11px]">Nhung + Thu + Ánh Phương</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },

    // SLIDE 2: KHÁI NIỆM & 4 NGUYÊN TẮC VÀNG SOẠN THẢO ĐIỀU LỆ
    {
      id: 'slide-2',
      badge: 'SLIDE 02 / 10 · NGUYÊN TẮC SOẠN THẢO',
      category: 'PHẦN 1 · LÊ PHƯƠNG THẢO PHỤ TRÁCH',
      title: 'BẢN CHẤT PHÁP LÝ & 4 NGUYÊN TẮC VÀNG BẢO VỆ 5 NHÀ ĐẦU TƯ TVPAY',
      subtitle: 'Căn cứ Khoản 2 Điều 22 và Khoản 2 Điều 24 Luật Doanh nghiệp 2020 (sửa đổi bổ sung 2025)',
      speakerName: 'Lê Phương Thảo',
      speakerRole: 'Chuyên viên Quy chế & Điều lệ',
      speakerAvatar: '/assets/team/le-phuong-thao.jpg',
      speakerNotes:
        'Kính thưa Thầy và các bạn, em là Lê Phương Thảo đại diện Nhóm 13 trình bày về 4 nguyên tắc vàng khi xây dựng Điều lệ cho 5 nhà đầu tư TVPAY. Để bảo đảm an toàn cho 50 tỷ đồng vốn góp, nhóm tư vấn quán triệt: Thứ nhất, không được trái luật để văn bản không bị Tòa án tuyên vô hiệu; Thứ hai, bảo đảm đầy đủ các điều khoản bắt buộc theo Điều 24 Luật Doanh nghiệp; Thứ ba, tự do thỏa thuận trong khuôn khổ pháp luật để tối ưu hóa quyền lợi của các nhà đầu tư; và Thứ tư, bắt buộc có sự đồng thuận và chữ ký của toàn bộ 5 nhà đầu tư sáng lập theo đúng Khoản 3 Điều 24 Luật Doanh nghiệp 2020.',
      renderContent: () => (
        <div className="space-y-3">
          <div className="stagger-1 p-3 bg-gradient-to-r from-amber-100/60 via-amber-50 to-amber-100/60 rounded-xl border border-amber-300 text-xs text-[#7A5B10] flex items-center justify-between">
            <div>
              <strong>📖 Bản chất pháp lý tối cao:</strong> Điều lệ là văn bản quy phạm nội bộ cao nhất của TVPAY, xác lập "luật chơi" công bằng và bảo vệ 50 tỷ vốn góp của 05 nhà đầu tư.
            </div>
            <span className="font-mono text-[10.5px] font-bold px-2 py-0.5 bg-white text-[#8C6B18] rounded border border-amber-300 shrink-0 ml-2">
              Khoản 2 Điều 22 Luật DN
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="stagger-2 p-3.5 bg-white rounded-xl border-2 border-blue-400/80 shadow-2xs">
              <div className="flex items-center justify-between gap-1 mb-1.5 pb-1 border-b border-blue-100">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-900">
                  Nguyên tắc 01 · Thượng tôn pháp luật
                </span>
                <span className="text-[10.5px] font-mono text-blue-700 font-bold">Bắt buộc</span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 m-0 mb-1">Không trái luật, không xâm phạm quyền bên thứ ba</h4>
              <p className="text-[11.5px] text-slate-600 m-0 leading-relaxed">
                Soạn thảo chuẩn xác đối chiếu Luật DN 2020, Bộ luật Dân sự 2015 và quy định chuyên ngành ví điện tử. Tuyệt đối không để xảy ra điều khoản vô hiệu khi phát sinh tranh chấp.
              </p>
            </div>

            <div className="stagger-3 p-3.5 bg-white rounded-xl border-2 border-emerald-400/80 shadow-2xs">
              <div className="flex items-center justify-between gap-1 mb-1.5 pb-1 border-b border-emerald-100">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900">
                  Nguyên tắc 02 · Chuẩn mực nội dung
                </span>
                <span className="text-[10.5px] font-mono text-emerald-700 font-bold">Điều 24</span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 m-0 mb-1">Đảm bảo đầy đủ nội dung luật định</h4>
              <p className="text-[11.5px] text-slate-600 m-0 leading-relaxed">
                Quy định đầy đủ 14 nhóm nội dung bắt buộc: Tên, trụ sở, vốn 50 tỷ, cơ cấu cổ đông sáng lập, quyền biểu quyết, thẩm quyền ĐHĐCĐ và cơ chế quản trị rủi ro thanh khoản.
              </p>
            </div>

            <div className="stagger-4 p-3.5 bg-white rounded-xl border-2 border-amber-400/80 shadow-2xs">
              <div className="flex items-center justify-between gap-1 mb-1.5 pb-1 border-b border-amber-100">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                  Nguyên tắc 03 · Tự do thỏa thuận
                </span>
                <span className="text-[10.5px] font-mono text-amber-700 font-bold">Tối ưu NĐT</span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 m-0 mb-1">Tự nguyện và bình đẳng giữa 05 nhà đầu tư</h4>
              <p className="text-[11.5px] text-slate-600 m-0 leading-relaxed">
                Tối đa hóa các thỏa thuận nội bộ có lợi cho nhà đầu tư: Thiết lập quyền ưu tiên mua cổ phần chào bán, quyền kiểm tra chứng từ tài chính và tỷ lệ phủ quyết đa số đặc biệt.
              </p>
            </div>

            <div className="stagger-5 p-3.5 bg-white rounded-xl border-2 border-purple-400/80 shadow-2xs">
              <div className="flex items-center justify-between gap-1 mb-1.5 pb-1 border-b border-purple-100">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-900">
                  Nguyên tắc 04 · Đồng thuận 100%
                </span>
                <span className="text-[10.5px] font-mono text-purple-700 font-bold">Hiệu lực</span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 m-0 mb-1">Chữ ký đầy đủ của 05 cổ đông sáng lập</h4>
              <p className="text-[11.5px] text-slate-600 m-0 leading-relaxed">
                Khoản 3 Điều 24 Luật DN quy định Điều lệ ban đầu phải có chữ ký của toàn bộ 05 nhà đầu tư sáng lập. Đây là bằng chứng cam kết cùng chịu trách nhiệm pháp lý và bảo toàn vốn.
              </p>
            </div>
          </div>
        </div>
      ),
    },

    // SLIDE 3: 5 VAI TRÒ CỐT LÕI CỦA ĐIỀU LỆ TVPAY
    {
      id: 'slide-3',
      badge: 'SLIDE 03 / 10 · 5 VAI TRÒ CỐT LÕI',
      category: 'PHẦN 1 · LÊ PHƯƠNG THẢO PHỤ TRÁCH',
      title: '5 VAI TRÒ TRỌNG YẾU CỦA ĐIỀU LỆ ĐỐI VỚI 5 NHÀ ĐẦU TƯ VÀ TVPAY',
      subtitle: 'Điều lệ không chỉ là thủ tục thành lập mà là Hiến pháp nội bộ bảo vệ quyền kiểm soát của 5 nhà đầu tư',
      speakerName: 'Lê Phương Thảo',
      speakerRole: 'Chuyên viên Quy chế & Điều lệ',
      speakerAvatar: '/assets/team/le-phuong-thao.jpg',
      speakerNotes:
        'Em xin tiếp tục báo cáo 5 vai trò sống còn mà bản Điều lệ này mang lại cho 5 nhà đầu tư: Thứ nhất, xác lập cơ chế vận hành hệ thống mạch lạc; Thứ hai, là văn kiện pháp lý chính thức để NHNN thẩm định và cấp phép trung gian thanh toán; Thứ ba, là căn cứ pháp lý đầu tiên để giải quyết bất đồng giữa các nhà đầu tư; Thứ tư, tạo động lực gắn kết các thành viên sáng lập; và Thứ năm, là công cụ tối thượng hỗ trợ quản trị minh bạch, ngăn ngừa lạm quyền.',
      renderContent: () => (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            {/* Left 4 Roles */}
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="stagger-1 p-3 bg-white rounded-xl border border-amber-300 shadow-2xs">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-100 text-[#7A5B10] block w-fit mb-1">
                  Vai trò 01 · Cơ chế vận hành
                </span>
                <h4 className="text-xs font-bold text-slate-900 m-0 mb-1">Quy định cách thức hoạt động</h4>
                <p className="text-[11px] text-slate-600 m-0 leading-relaxed">
                  Cung cấp quy chế về mục đích, phạm vi kinh doanh, phân định thẩm quyền các bộ phận, giúp công ty hoạt động có hệ thống.
                </p>
              </div>

              <div className="stagger-2 p-3 bg-white rounded-xl border border-blue-300 shadow-2xs">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-900 block w-fit mb-1">
                  Vai trò 02 · Cấp phép NHNN
                </span>
                <h4 className="text-xs font-bold text-slate-900 m-0 mb-1">Tài liệu pháp lý chính thức</h4>
                <p className="text-[11px] text-slate-600 m-0 leading-relaxed">
                  Được cơ quan quản lý (NHNN, Sở KH&amp;ĐT) thẩm định, là điều kiện tiên quyết để được cấp Giấy phép ví điện tử.
                </p>
              </div>

              <div className="stagger-3 p-3 bg-white rounded-xl border border-emerald-300 shadow-2xs">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 block w-fit mb-1">
                  Vai trò 03 · Tài phán công bằng
                </span>
                <h4 className="text-xs font-bold text-slate-900 m-0 mb-1">Cơ sở giải quyết tranh chấp</h4>
                <p className="text-[11px] text-slate-600 m-0 leading-relaxed">
                  Căn cứ pháp lý đầu tiên để VIAC hoặc Tòa án thụ lý và giải quyết bất đồng quyền lợi giữa 05 nhà đầu tư.
                </p>
              </div>

              <div className="stagger-4 p-3 bg-white rounded-xl border border-purple-300 shadow-2xs">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-900 block w-fit mb-1">
                  Vai trò 04 · Giá trị cốt lõi
                </span>
                <h4 className="text-xs font-bold text-slate-900 m-0 mb-1">Động lực gắn kết sáng lập</h4>
                <p className="text-[11px] text-slate-600 m-0 leading-relaxed">
                  Tôn chỉ xây dựng văn hóa minh bạch, bảo đảm tinh thần đồng hành dài hạn giữa 05 nhà đầu tư và đội ngũ kỹ thuật.
                </p>
              </div>
            </div>

            {/* Right Featured Card with Scales Image */}
            <div className="stagger-5 p-3.5 bg-gradient-to-br from-amber-50 to-white rounded-xl border-2 border-amber-400 shadow-xs flex flex-col justify-between">
              <div>
                <div className="relative rounded-lg overflow-hidden border border-amber-300 mb-2.5">
                  <img
                    src="/assets/legal-scales-gavel.jpg"
                    alt="Hiến pháp nội bộ TVPAY"
                    className="w-full h-24 object-cover"
                  />
                  <span className="absolute bottom-1 right-1 text-[9px] font-bold bg-slate-900/80 text-amber-300 px-1.5 py-0.5 rounded">
                    HIẾN PHÁP NỘI BỘ
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-200/80 text-[#7A5B10] block w-fit mb-1">
                  Vai trò 05 · Trọng tâm quản trị
                </span>
                <h4 className="text-xs font-bold text-slate-900 m-0 mb-1">Ngăn chặn lạm quyền &amp; Rút ruột</h4>
                <p className="text-[11px] text-slate-600 m-0 leading-relaxed">
                  Chuẩn hóa cơ chế phê duyệt các khoản chi trên 5 tỷ đồng, bảo đảm số vốn 50 tỷ của nhà đầu tư không bị thất thoát.
                </p>
              </div>
              <span className="text-[10.5px] font-semibold text-[#8C6B18] mt-2 block border-t border-amber-200/60 pt-1.5">
                ★ Lá chắn tối cao của 05 Nhà đầu tư
              </span>
            </div>
          </div>
        </div>
      ),
    },

    // SLIDE 4: CẤU TRÚC 9 CHƯƠNG TOÀN VĂN (CHỈ GHI TÊN THEO CHỈ ĐẠO NHÓM TRƯỞNG)
    {
      id: 'slide-4',
      badge: 'SLIDE 04 / 10 · MỤC LỤC 9 CHƯƠNG',
      category: 'CẤU TRÚC TOÀN VĂN ĐIỀU LỆ (DANH MỤC 09 CHƯƠNG)',
      title: 'HỆ THỐNG DANH MỤC 09 CHƯƠNG ĐIỀU LỆ TVPAY',
      subtitle: 'Tuân thủ đúng chỉ đạo: Chỉ ghi tên danh mục 09 chương, súc tích và dồn trọng tâm vào cơ chế bảo vệ nhà đầu tư',
      speakerName: 'Lê Phương Thảo',
      speakerRole: 'Chuyên viên Quy chế & Điều lệ',
      speakerAvatar: '/assets/team/le-phuong-thao.jpg',
      speakerNotes:
        'Kính thưa Thầy và các bạn, theo đúng định hướng tư vấn và yêu cầu chỉ đạo, toàn bộ cấu trúc 09 chương của Điều lệ được chuẩn hóa theo danh mục tên ngắn gọn, tránh rườm rà, nhằm dồn toàn bộ trọng tâm vào các điều khoản then chốt bảo vệ quyền và lợi ích hợp pháp của 05 nhà đầu tư.',
      renderContent: () => (
        <div className="space-y-3">
          <div className="stagger-1 p-2.5 bg-amber-50/80 border border-amber-300 rounded-lg text-xs text-[#7A5B10] flex items-center justify-between">
            <span className="font-semibold flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-amber-600" />
              Danh mục 09 Chương theo chuẩn Điều lệ công ty cổ phần TVPAY:
            </span>
            <span className="font-mono font-bold text-[11px] bg-white text-[#8C6B18] px-2.5 py-0.5 rounded border border-amber-300">
              Tổng cộng 86 Điều khoản
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {[
              { num: 'Chương I', name: 'Quy định chung', sub: 'Tên, trụ sở, tư cách pháp lý & ngành nghề ví điện tử', color: 'border-amber-300 bg-amber-50/30' },
              { num: 'Chương II', name: 'Vốn điều lệ, cổ phần & 05 NĐT', sub: 'Quy mô 50 tỷ VNĐ, loại cổ phần & cam kết góp đủ vốn', color: 'border-amber-400 bg-amber-50/40' },
              { num: 'Chương III', name: 'Quyền & Nghĩa vụ của Cổ đông', sub: 'Quyền biểu quyết, kiểm tra sổ sách & nhận cổ tức', color: 'border-amber-300 bg-amber-50/30' },
              { num: 'Chương IV', name: 'Cơ cấu tổ chức quản trị', sub: 'Đại hội đồng cổ đông, HĐQT & Tổng Giám đốc', color: 'border-blue-300 bg-blue-50/30' },
              { num: 'Chương V', name: 'Người đại diện theo pháp luật', sub: 'Tiêu chuẩn, hạn mức ký duyệt & trách nhiệm bồi thường', color: 'border-blue-400 bg-blue-50/40' },
              { num: 'Chương VI', name: 'Ban Kiểm soát & Giám sát', sub: 'Kiểm soát độc lập báo cáo tài chính & dòng tiền ví', color: 'border-blue-300 bg-blue-50/30' },
              { num: 'Chương VII', name: 'Tài chính, Quỹ rủi ro 1:1', sub: 'Trích lập quỹ an toàn thanh toán trước khi chia cổ tức', color: 'border-emerald-300 bg-emerald-50/30' },
              { num: 'Chương VIII', name: 'Giải quyết tranh chấp & VIAC', sub: 'Hòa giải nội bộ & Trọng tài thương mại quốc tế', color: 'border-purple-300 bg-purple-50/30' },
              { num: 'Chương IX', name: 'Sửa đổi điều lệ & Giải thể', sub: 'Thủ tục sáp nhập, giải thể & chữ ký 05 NĐT sáng lập', color: 'border-pink-300 bg-pink-50/30' },
            ].map((item, idx) => (
              <div
                key={idx}
                className={`stagger-2 p-3 rounded-xl border shadow-2xs hover:border-amber-500 transition bg-white`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-slate-100 text-slate-800 rounded-md border border-slate-200">
                    {item.num}
                  </span>
                  <span className="text-[10px] text-amber-700 font-mono font-bold">Mục 0{idx + 1}</span>
                </div>
                <h5 className="text-xs font-bold text-slate-900 m-0 mb-1 leading-snug">{item.name}</h5>
                <p className="text-[11px] text-slate-500 m-0 line-clamp-1">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      ),
    },

    // SLIDE 5: GIẢI PHÁP 1 & 2: BẢO VỆ CỔ ĐÔNG & PHÂN ĐỊNH THẨM QUYỀN
    {
      id: 'slide-5',
      badge: 'SLIDE 05 / 10 · GIẢI PHÁP PHÒNG VỆ (1 & 2)',
      category: 'PHẦN 2 · VŨ PHƯƠNG THẢO PHỤ TRÁCH',
      title: 'BẢO VỆ QUYỀN LỢI 5 NHÀ ĐẦU TƯ & PHÂN ĐỊNH RÀNH MẠCH QUYỀN LỰC QUẢN TRỊ',
      subtitle: 'Giải pháp phòng vệ của Nhóm 13 giúp bảo toàn tỷ lệ sở hữu, chống pha loãng và ngăn ngừa lạm quyền nội bộ',
      speakerName: 'Vũ Phương Thảo',
      speakerRole: 'Chuyên viên Doanh nghiệp & Vốn',
      speakerAvatar: '/assets/team/phuong-thao.jpg',
      speakerNotes:
        'Kính thưa Thầy và các bạn, em là Vũ Thảo. Xuất phát từ quyền lợi cốt lõi của 5 nhà đầu tư khi rót 50 tỷ đồng, nhóm tư vấn đã thiết kế các lá chắn phòng vệ đặc thù: Lá chắn 1 khóa chuyển nhượng trong 3 năm đầu để đảm bảo các nhà đầu tư đồng hành phát triển; đồng thời trao quyền ưu tiên mua cổ phần phát hành mới để tỷ lệ sở hữu của 5 nhà đầu tư không bị pha loãng khi công ty tăng vốn. Lá chắn 2 phân định rành mạch quyền lực ĐHĐCĐ, HĐQT và TGĐ, buộc cá nhân người quản lý phải bồi thường nếu lạm quyền.',
      renderContent: () => (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
            <div className="stagger-1 p-4 bg-white rounded-xl border-2 border-emerald-400 shadow-2xs">
              <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-emerald-100">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300">
                  Lá chắn 01 · Ổn định cơ cấu sở hữu 50 Tỷ
                </span>
                <span className="font-mono text-[11px] text-emerald-800 font-bold">Điều 6, 7</span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 m-0 mb-2">
                Khóa chuyển nhượng 3 năm &amp; Quyền ưu tiên mua (Pre-emption Rights)
              </h4>
              <ul className="text-slate-600 space-y-1.5 pl-4 list-disc m-0 leading-relaxed text-[11.5px]">
                <li>Khóa chuyển nhượng cổ phần ra bên ngoài trong 03 năm đầu (Khoản 3 Điều 120 Luật DN), ngăn ngừa đối thủ thâu tóm thù địch.</li>
                <li>Quy trình chào bán nội bộ bắt buộc trước 30 ngày: 05 nhà đầu tư được quyền ưu tiên mua theo tỷ lệ sở hữu tương ứng.</li>
                <li>Bảo toàn tỷ lệ quyền lực của 05 nhà đầu tư khi công ty phát hành thêm cổ phần để mở rộng quy mô.</li>
              </ul>
              <div className="mt-3 p-2 bg-emerald-50/80 rounded-lg text-[11px] text-emerald-900 border border-emerald-200">
                <strong>Hiệu quả bảo vệ:</strong> Triệt tiêu nguy cơ bị pha loãng tỷ lệ sở hữu của 05 cổ đông sáng lập ban đầu.
              </div>
            </div>

            <div className="stagger-2 p-4 bg-white rounded-xl border-2 border-blue-400 shadow-2xs">
              <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-blue-100">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-300">
                  Lá chắn 02 · Đối trọng quyền lực quản trị
                </span>
                <span className="font-mono text-[11px] text-blue-800 font-bold">Điều 15-55</span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 m-0 mb-2">
                Tam quyền phân lập: ĐHĐCĐ - HĐQT - Ban Điều hành TVPAY
              </h4>
              <ul className="text-slate-600 space-y-1.5 pl-4 list-disc m-0 leading-relaxed text-[11.5px]">
                <li>Phân định thẩm quyền phê duyệt: Hợp đồng từ 5 tỷ đồng trở lên bắt buộc phải được HĐQT hoặc ĐHĐCĐ thông qua.</li>
                <li>Tổng Giám đốc là Người đại diện theo pháp luật nhưng bị giới hạn hạn mức ký kết độc lập để kiểm soát rủi ro.</li>
                <li>Ràng buộc trách nhiệm bồi thường tài sản cá nhân nếu người điều hành vượt thẩm quyền gây thiệt hại cho công ty.</li>
              </ul>
              <div className="mt-3 p-2 bg-blue-50/80 rounded-lg text-[11px] text-blue-900 border border-blue-200">
                <strong>Hiệu quả bảo vệ:</strong> Ngăn chặn lạm quyền và bảo vệ an toàn tối đa cho dòng vốn của 05 nhà đầu tư.
              </div>
            </div>
          </div>
        </div>
      ),
    },

    // SLIDE 6: GIẢI PHÁP 3 & 4: BỘ ĐỆM TÀI CHÍNH 50 TỶ & XUNG ĐỘT LỢI ÍCH (ARM'S LENGTH)
    {
      id: 'slide-6',
      badge: 'SLIDE 06 / 10 · GIẢI PHÁP PHÒNG VỆ (3 & 4)',
      category: 'PHẦN 2 · PHẠM DẠ THẢO PHỤ TRÁCH',
      title: 'QUẢN LÝ TÀI CHÍNH DUY TRÌ VỐN 50 TỶ & KIỂM SOÁT XUNG ĐỘT LỢI ÍCH',
      subtitle: 'Bảo đảm an toàn dòng vốn cho 5 nhà đầu tư và chống nguy cơ rút ruột tài sản công ty',
      speakerName: 'Phạm Dạ Thảo',
      speakerRole: 'Chuyên viên Quản trị rủi ro & Tài chính',
      speakerAvatar: '/assets/team/pham-da-thao.jpg',
      speakerNotes:
        'Em là Dạ Thảo xin tiếp tục trình bày: Lá chắn 3 thiết lập cơ chế trích lập các quỹ dự phòng tài chính trước khi chia cổ tức, giúp duy trì vững chắc điều kiện vốn 50 tỷ của NHNN và bảo toàn thanh khoản 1:1. Lá chắn 4 áp dụng nguyên tắc thị trường Arm\'s length đối với mọi giao dịch nội bộ và tước quyền biểu quyết của bên có lợi ích liên quan, triệt tiêu hoàn toàn nguy cơ rút ruột tài sản công ty.',
      renderContent: () => (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="stagger-1 p-3.5 bg-white rounded-xl border-2 border-emerald-400 shadow-2xs">
              <div className="flex items-center justify-between gap-2 mb-2 pb-1 border-b border-emerald-100">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900">
                  Lá chắn 03 · Bảo toàn vốn 1:1
                </span>
                <span className="font-mono text-[10.5px] text-emerald-800 font-bold">Điều 69, 71</span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 m-0 mb-1.5">Bộ đệm tài chính &amp; Quỹ dự phòng rủi ro</h4>
              <p className="text-[11.5px] text-slate-600 leading-relaxed m-0 mb-2">
                Duy trì vốn thực góp không thấp hơn 50 tỷ đồng theo giấy phép NHNN. Mở tài khoản bảo đảm thanh toán độc lập bảo toàn 100% số dư ví.
              </p>
              <div className="p-2 bg-emerald-50 rounded-lg text-[11px] text-emerald-900 font-medium">
                Cấm dùng tiền ví đầu tư rủi ro.
              </div>
            </div>

            <div className="stagger-2 p-3.5 bg-white rounded-xl border-2 border-rose-400 shadow-2xs">
              <div className="flex items-center justify-between gap-2 mb-2 pb-1 border-b border-rose-100">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-900">
                  Lá chắn 04 · Chống rút ruột
                </span>
                <span className="font-mono text-[10.5px] text-rose-800 font-bold">Điều 62</span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 m-0 mb-1.5">Nguyên tắc thị trường (Arm's length)</h4>
              <p className="text-[11.5px] text-slate-600 leading-relaxed m-0 mb-2">
                Công khai toàn bộ quan hệ sở hữu của HĐQT &amp; Ban Giám đốc. Giao dịch nội bộ phải được ĐHĐCĐ thông qua; bên liên quan bị tước quyền biểu quyết.
              </p>
              <div className="p-2 bg-rose-50 rounded-lg text-[11px] text-rose-900 font-medium">
                Ngăn chặn tuồn vốn sang sân sau.
              </div>
            </div>

            {/* Featured Image Card */}
            <div className="stagger-3 p-3 bg-gradient-to-br from-emerald-50 to-white rounded-xl border-2 border-emerald-400 shadow-xs flex flex-col justify-between">
              <div>
                <div className="relative rounded-lg overflow-hidden border border-emerald-300 mb-2">
                  <img
                    src="/assets/fintech-security-vault.jpg"
                    alt="Kho quỹ thanh khoản 50 tỷ TVPAY"
                    className="w-full h-24 object-cover"
                  />
                  <span className="absolute bottom-1 right-1 text-[9px] font-bold bg-slate-900/80 text-emerald-300 px-1.5 py-0.5 rounded">
                    QUỸ BẢO TOÀN 1:1
                  </span>
                </div>
                <h5 className="text-xs font-bold text-slate-900 m-0 mb-1">Kiểm toán số dư độc lập</h5>
                <p className="text-[11px] text-slate-600 leading-relaxed m-0">
                  Báo cáo kiểm toán định kỳ bảo đảm tiền ví của khách hàng và 50 tỷ vốn điều lệ luôn được quản lý tách bạch tại ngân hàng liên kết.
                </p>
              </div>
              <span className="text-[10px] font-bold text-emerald-800 mt-2 block border-t border-emerald-200 pt-1">
                Tuân thủ Nghị định 52/2024/NĐ-CP
              </span>
            </div>
          </div>
        </div>
      ),
    },

    // SLIDE 7: GIẢI PHÁP 5, 6 & 7: QUẢN TRỊ FINTECH, BẢN QUYỀN MÃ NGUỒN & ỨNG PHÓ KHỦNG HOẢNG
    {
      id: 'slide-7',
      badge: 'SLIDE 07 / 10 · GIẢI PHÁP PHÒNG VỆ (5, 6 & 7)',
      category: 'PHẦN 2 · PHẠM DẠ THẢO PHỤ TRÁCH',
      title: 'QUẢN TRỊ FINTECH, BẢO VỆ BẢN QUYỀN CORE WALLET & ỨNG PHÓ KHỦNG HOẢNG',
      subtitle: 'Bộ ba giải pháp bảo vệ tài sản vô hình có giá trị nhất của 5 nhà đầu tư và tính liên tục của hệ thống Ví',
      speakerName: 'Phạm Dạ Thảo',
      speakerRole: 'Chuyên viên Sở hữu trí tuệ & Công nghệ',
      speakerAvatar: '/assets/team/pham-da-thao.jpg',
      speakerNotes:
        'Đối với tài sản công nghệ, nhóm tư vấn xác lập nguyên tắc mã nguồn, thuật toán và cơ sở dữ liệu đều thuộc quyền sở hữu tuyệt đối của TVPAY, ngăn ngừa việc nhân sự chủ chốt mang công nghệ ra ngoài mở công ty đối thủ. Đồng thời, Điều lệ quy định cơ chế ủy quyền khẩn cấp để xử lý nhanh sự cố an ninh mạng mà vẫn hoàn toàn hợp pháp.',
      renderContent: () => (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="stagger-1 p-3.5 bg-white rounded-xl border-2 border-indigo-400 shadow-2xs">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-900 block w-fit mb-1.5">
                Lá chắn 05 · NĐ 13/2023
              </span>
              <h4 className="text-xs font-bold text-slate-900 m-0 mb-1.5">Bảo vệ dữ liệu người dùng</h4>
              <p className="text-[11.5px] text-slate-600 m-0 leading-relaxed mb-2">
                Trách nhiệm người quản lý đối với dữ liệu eKYC khách hàng, tuân thủ nghiêm ngặt quy định bảo mật thông tin tài chính và an ninh thanh toán.
              </p>
              <span className="text-[10.5px] text-indigo-800 font-bold block">Chuẩn dữ liệu số</span>
            </div>

            <div className="stagger-2 p-3.5 bg-white rounded-xl border-2 border-emerald-400 shadow-2xs">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 block w-fit mb-1.5">
                Lá chắn 06 · Độc quyền IP
              </span>
              <h4 className="text-xs font-bold text-slate-900 m-0 mb-1.5">Bảo vệ độc quyền Core Wallet</h4>
              <p className="text-[11.5px] text-slate-600 m-0 leading-relaxed mb-2">
                Mã nguồn ví, thuật toán đối soát và kiến trúc hạ tầng do nhân sự sáng tạo đều thuộc quyền sở hữu độc quyền của TVPAY. Ràng buộc cấm cạnh tranh.
              </p>
              <span className="text-[10.5px] text-emerald-800 font-bold block">Chống chảy máu công nghệ</span>
            </div>

            <div className="stagger-3 p-3.5 bg-white rounded-xl border-2 border-amber-400 shadow-2xs">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 block w-fit mb-1.5">
                Lá chắn 07 · Khẩn cấp
              </span>
              <h4 className="text-xs font-bold text-slate-900 m-0 mb-1.5">Ứng phó khủng hoảng mạng</h4>
              <p className="text-[11.5px] text-slate-600 m-0 leading-relaxed mb-2">
                Cơ chế họp trực tuyến khẩn cấp và ủy quyền đặc biệt cho TGĐ tạm ngưng giao dịch khi xảy ra tấn công DDoS hoặc nghẽn mạch ngân hàng liên kết.
              </p>
              <span className="text-[10.5px] text-amber-800 font-bold block">Phản ứng nhanh &amp; Hợp pháp</span>
            </div>
          </div>

          {/* Infrastructure Image Banner */}
          <div className="stagger-4 p-2.5 bg-gradient-to-r from-indigo-50 via-white to-amber-50 rounded-xl border border-indigo-200 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <img
                src="/assets/fintech-headquarters.jpg"
                alt="Hạ tầng TVPAY"
                className="w-16 h-10 object-cover rounded-md border border-indigo-200 shrink-0"
              />
              <div>
                <strong className="text-slate-900 block text-[11px]">Hạ tầng công nghệ thông tin &amp; An ninh mạng TVPAY</strong>
                <span className="text-slate-600 text-[10.5px]">Được bảo hộ toàn diện bởi Điều lệ, thỏa mãn tiêu chuẩn kỹ thuật cấp phép của Ngân hàng Nhà nước.</span>
              </div>
            </div>
            <span className="font-mono text-[10px] font-bold px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded shrink-0 hidden sm:inline">
              ISO/IEC 27001
            </span>
          </div>
        </div>
      ),
    },

    // SLIDE 8: MA TRẬN RỦI RO PHÁP LÝ THỰC TIỄN (PHẦN 1: HỢP PHÁP, THẨM QUYỀN & HỌP)
    {
      id: 'slide-8',
      badge: 'SLIDE 08 / 10 · RỦI RO & XỬ LÝ (PHẦN 1)',
      category: 'PHẦN 3 · LÊ THỊ HỒNG NHUNG PHỤ TRÁCH',
      title: 'MA TRẬN RỦI RO PHÁP LÝ: TÍNH HỢP PHÁP, THẨM QUYỀN & THỂ THỨC HỌP',
      subtitle: 'Tư vấn đối sách phòng ngừa 04 rủi ro nội bộ cấp bách cho 05 Nhà đầu tư sáng lập TVPAY',
      speakerName: 'Lê Thị Hồng Nhung',
      speakerRole: 'Chuyên viên Tuân thủ & Trọng tài · Nhóm 13',
      speakerAvatar: '/assets/team/hong-nhung.jpg',
      speakerNotes: 'Thưa thầy và hội đồng, khi nhận đề bài tư vấn bảo vệ quyền lợi cho 05 nhà đầu tư TVPAY với số vốn 50 tỷ đồng, nhóm em nhận diện ngay 4 rủi ro pháp lý cơ bản có thể làm tê liệt hoặc vô hiệu hoạt động doanh nghiệp. Rủi ro số 1 là Điều lệ trái luật, chúng em đã chuẩn hóa đối chiếu Luật Doanh nghiệp 2020 và Nghị định 52/2024. Rủi ro số 2 và 3 là tranh chấp quyền lực và thẩm quyền người đại diện, Điều lệ đã phân quyền rành mạch giữa 5 cổ đông và Tổng Giám đốc. Rủi ro số 4 là thể thức triệu tập họp, nhóm quy định chặt chẽ thời hạn thông báo để mọi nghị quyết của ĐHĐCĐ luôn có hiệu lực pháp lý vững chắc.',
      renderContent: () => (
        <div className="space-y-3.5">
          <div className="stagger-1 overflow-x-auto rounded-xl border border-amber-300/80 shadow-2xs bg-white">
            <table className="min-w-full text-xs text-left divide-y divide-amber-200/60">
              <thead className="bg-gradient-to-r from-amber-100 via-amber-50 to-amber-100 font-serif font-bold text-slate-900">
                <tr>
                  <th className="px-3 py-2.5 border-r border-amber-200/50 text-center w-12">STT</th>
                  <th className="px-3.5 py-2.5 border-r border-amber-200/50 w-28 text-center">Mức độ</th>
                  <th className="px-3.5 py-2.5 border-r border-amber-200/50 w-1/4">Rủi ro nhận diện</th>
                  <th className="px-3.5 py-2.5 border-r border-amber-200/50 w-1/3">Hậu quả đối với 05 Nhà đầu tư</th>
                  <th className="px-3.5 py-2.5">Phương án xử lý chuẩn tắc của Nhóm 13</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-100 text-[11.5px] text-slate-700">
                <tr className="hover:bg-red-50/40 transition">
                  <td className="px-3 py-2.5 font-bold font-mono text-center text-rose-700 border-r border-amber-100">01</td>
                  <td className="px-3 py-2.5 text-center border-r border-amber-100">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-red-100 text-red-800 border border-red-300">
                      NGHIÊM TRỌNG
                    </span>
                  </td>
                  <td className="px-3.5 py-2.5 font-semibold text-slate-900 border-r border-amber-100">
                    Điều lệ chứa nội dung trái luật hoặc thiếu quy chuẩn NHNN
                  </td>
                  <td className="px-3.5 py-2.5 border-r border-amber-100 text-rose-900">
                    Tranh chấp cổ đông, nguy cơ bị Tòa án tuyên vô hiệu, bị NHNN từ chối hoặc thu hồi giấy phép trung gian thanh toán.
                  </td>
                  <td className="px-3.5 py-2.5 text-emerald-800 font-medium bg-emerald-50/30">
                    Rà soát toàn diện 86 điều khoản, đối chiếu song song Luật Doanh nghiệp 2020 và Nghị định 52/2024/NĐ-CP.
                  </td>
                </tr>
                <tr className="bg-amber-50/20 hover:bg-amber-50/50 transition">
                  <td className="px-3 py-2.5 font-bold font-mono text-center text-amber-700 border-r border-amber-100">02</td>
                  <td className="px-3 py-2.5 text-center border-r border-amber-100">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800 border border-amber-300">
                      RỦI RO CAO
                    </span>
                  </td>
                  <td className="px-3.5 py-2.5 font-semibold text-slate-900 border-r border-amber-100">
                    Không phân định rõ cơ cấu và thẩm quyền quản trị
                  </td>
                  <td className="px-3.5 py-2.5 border-r border-amber-100 text-amber-950">
                    Chồng chéo quyền hạn giữa ĐHĐCĐ, HĐQT và TGĐ; bế tắc nội bộ khi phát sinh quyết định đầu tư công nghệ lớn.
                  </td>
                  <td className="px-3.5 py-2.5 text-emerald-800 font-medium bg-emerald-50/30">
                    Quy định cụ thể chức năng, thẩm quyền phê duyệt ngân sách và tỷ lệ biểu quyết tối thiểu (65% ĐHĐCĐ) của từng chức danh.
                  </td>
                </tr>
                <tr className="hover:bg-amber-50/50 transition">
                  <td className="px-3 py-2.5 font-bold font-mono text-center text-amber-700 border-r border-amber-100">03</td>
                  <td className="px-3 py-2.5 text-center border-r border-amber-100">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800 border border-amber-300">
                      RỦI RO CAO
                    </span>
                  </td>
                  <td className="px-3.5 py-2.5 font-semibold text-slate-900 border-r border-amber-100">
                    Quy định người đại diện theo pháp luật không rõ ràng
                  </td>
                  <td className="px-3.5 py-2.5 border-r border-amber-100 text-amber-950">
                    Hợp đồng kết nối cổng thanh toán ngân hàng bị vô hiệu do người ký vượt quá thẩm quyền hoặc xung đột lợi ích.
                  </td>
                  <td className="px-3.5 py-2.5 text-emerald-800 font-medium bg-emerald-50/30">
                    Quy định rõ TGĐ là người đại diện theo pháp luật duy nhất, ràng buộc hạn mức giao dịch và ủy quyền bằng văn bản.
                  </td>
                </tr>
                <tr className="bg-amber-50/20 hover:bg-amber-50/50 transition">
                  <td className="px-3 py-2.5 font-bold font-mono text-center text-blue-700 border-r border-amber-100">04</td>
                  <td className="px-3 py-2.5 text-center border-r border-amber-100">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-800 border border-blue-300">
                      TRUNG BÌNH
                    </span>
                  </td>
                  <td className="px-3.5 py-2.5 font-semibold text-slate-900 border-r border-amber-100">
                    Thể thức triệu tập họp và biểu quyết sai quy trình
                  </td>
                  <td className="px-3.5 py-2.5 border-r border-amber-100 text-slate-700">
                    Nghị quyết ĐHĐCĐ bị cổ đông thiểu số khởi kiện yêu cầu Tòa án hủy bỏ do vi phạm trình tự thông báo.
                  </td>
                  <td className="px-3.5 py-2.5 text-emerald-800 font-medium bg-emerald-50/30">
                    Quy định chi tiết thời hạn gửi giấy mời 21 ngày, điều kiện tiến hành họp 50% và cơ chế biểu quyết điện tử có xác thực.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Photo banner: Executive Boardroom */}
          <div className="stagger-4 p-2.5 bg-gradient-to-r from-amber-50 via-white to-amber-50 rounded-xl border border-amber-300/80 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <img
                src="/assets/executive-boardroom.jpg"
                alt="Phòng họp HĐQT TVPAY"
                className="w-16 h-10 object-cover rounded-md border border-amber-300 shrink-0 shadow-2xs"
              />
              <div>
                <strong className="text-slate-900 block text-[11px]">Cơ chế biểu quyết và điều hành phòng họp HĐQT TVPAY</strong>
                <span className="text-slate-600 text-[10.5px]">Được chuẩn hóa nhằm giải tỏa bế tắc (Deadlock) giữa 5 nhà đầu tư sáng lập, bảo đảm vận hành thông suốt.</span>
              </div>
            </div>
            <span className="font-mono text-[10px] font-bold px-2 py-0.5 bg-amber-100 text-[#7A5B10] rounded border border-amber-300 shrink-0 hidden sm:inline">
              ĐIỀU 28 - 34 ĐIỀU LỆ
            </span>
          </div>
        </div>
      ),
    },

    // SLIDE 9: MA TRẬN RỦI RO PHÁP LÝ THỰC TIỄN (PHẦN 2: CHUYỂN NHƯỢNG, VỐN & SỬA ĐỔI)
    {
      id: 'slide-9',
      badge: 'SLIDE 09 / 10 · RỦI RO & XỬ LÝ (PHẦN 2)',
      category: 'PHẦN 3 · KIỀU HOÀI THU PHỤ TRÁCH',
      title: 'MA TRẬN RỦI RO PHÁP LÝ: CHUYỂN NHƯỢNG CỔ PHẦN, MỞ RỘNG VỐN & SỬA ĐỔI',
      subtitle: 'Đối sách bảo vệ 05 Nhà đầu tư khi mở rộng vốn gọi quỹ ngoại và điều chỉnh luật chuyên ngành',
      speakerName: 'Kiều Hoài Thu',
      speakerRole: 'Chuyên viên M&A & Pháp lý Fintech · Nhóm 13',
      speakerAvatar: '/assets/team/kieu-hoai-thu.jpg',
      speakerNotes: 'Tiếp theo, ở giai đoạn mở rộng và vận hành thực tế, 4 rủi ro lớn nhất mà 5 nhà đầu tư TVPAY đối mặt là: chuyển nhượng cổ phần nội bộ bị người ngoài thâm nhập, bị động khi quỹ ngoại muốn rót vốn công nghệ, luật chuyên ngành thay đổi, và cơ chế xử lý tài sản khi phát sinh rủi ro thanh khoản ví. Nhóm 13 đã thiết lập cơ chế quyền ưu tiên mua 30 ngày cho 5 cổ đông sáng lập, quy định sẵn khung chào bán cổ phần riêng lẻ, và đặc biệt ưu tiên số 1 cho việc hoàn trả số dư ví của khách hàng trước khi thanh lý tài sản cho cổ đông, đảm bảo uy tín và trách nhiệm của các nhà đầu tư sáng lập.',
      renderContent: () => (
        <div className="space-y-3.5">
          <div className="stagger-1 overflow-x-auto rounded-xl border border-amber-300/80 shadow-2xs bg-white">
            <table className="min-w-full text-xs text-left divide-y divide-amber-200/60">
              <thead className="bg-gradient-to-r from-amber-100 via-amber-50 to-amber-100 font-serif font-bold text-slate-900">
                <tr>
                  <th className="px-3 py-2.5 border-r border-amber-200/50 text-center w-12">STT</th>
                  <th className="px-3.5 py-2.5 border-r border-amber-200/50 w-28 text-center">Mức độ</th>
                  <th className="px-3.5 py-2.5 border-r border-amber-200/50 w-1/4">Rủi ro mở rộng &amp; thoái vốn</th>
                  <th className="px-3.5 py-2.5 border-r border-amber-200/50 w-1/3">Hậu quả đối với 05 Nhà đầu tư</th>
                  <th className="px-3.5 py-2.5">Phương án bảo vệ của Nhóm 13</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-100 text-[11.5px] text-slate-700">
                <tr className="hover:bg-amber-50/50 transition">
                  <td className="px-3 py-2.5 font-bold font-mono text-center text-amber-700 border-r border-amber-100">05</td>
                  <td className="px-3 py-2.5 text-center border-r border-amber-100">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800 border border-amber-300">
                      RỦI RO CAO
                    </span>
                  </td>
                  <td className="px-3.5 py-2.5 font-semibold text-slate-900 border-r border-amber-100">
                    Chuyển nhượng cổ phần trong công ty khép kín
                  </td>
                  <td className="px-3.5 py-2.5 border-r border-amber-100 text-amber-950">
                    Bên thứ ba thâm nhập thao túng hoạt động công ty, phá vỡ khối liên kết của 05 cổ đông sáng lập.
                  </td>
                  <td className="px-3.5 py-2.5 text-emerald-800 font-medium bg-emerald-50/30">
                    Khóa chuyển nhượng 03 năm đầu (Khoản 3 Điều 120 Luật DN), quy trình chào bán nội bộ 30 ngày và quyền ưu tiên mua (ROFR).
                  </td>
                </tr>
                <tr className="bg-amber-50/20 hover:bg-amber-50/50 transition">
                  <td className="px-3 py-2.5 font-bold font-mono text-center text-blue-700 border-r border-amber-100">06</td>
                  <td className="px-3 py-2.5 text-center border-r border-amber-100">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-800 border border-blue-300">
                      TRUNG BÌNH
                    </span>
                  </td>
                  <td className="px-3.5 py-2.5 font-semibold text-slate-900 border-r border-amber-100">
                    Không dự liệu cơ chế mở rộng vốn &amp; Quỹ ngoại
                  </td>
                  <td className="px-3.5 py-2.5 border-r border-amber-100 text-slate-700">
                    Bị động khi tiếp cận quỹ đầu tư mạo hiểm fintech (Series A/B), thủ tục sửa đổi Điều lệ phức tạp kéo dài làm mất cơ hội.
                  </td>
                  <td className="px-3.5 py-2.5 text-emerald-800 font-medium bg-emerald-50/30">
                    Quy định sẵn khung chào bán cổ phần riêng lẻ, điều kiện tiếp cận thị trường và giới hạn tỷ lệ sở hữu nhà đầu tư nước ngoài.
                  </td>
                </tr>
                <tr className="hover:bg-amber-50/50 transition">
                  <td className="px-3 py-2.5 font-bold font-mono text-center text-blue-700 border-r border-amber-100">07</td>
                  <td className="px-3 py-2.5 text-center border-r border-amber-100">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-800 border border-blue-300">
                      TRUNG BÌNH
                    </span>
                  </td>
                  <td className="px-3.5 py-2.5 font-semibold text-slate-900 border-r border-amber-100">
                    Sửa đổi Điều lệ khi pháp luật chuyên ngành thay đổi
                  </td>
                  <td className="px-3.5 py-2.5 border-r border-amber-100 text-slate-700">
                    Điều lệ xung đột với thông tư mới của NHNN về an toàn thanh toán trực tuyến, rủi ro bị xử phạt hành chính.
                  </td>
                  <td className="px-3.5 py-2.5 text-emerald-800 font-medium bg-emerald-50/30">
                    Thiết lập nguyên tắc định kỳ rà soát Điều lệ hàng năm, cơ chế ủy quyền HĐQT cập nhật các nội dung kỹ thuật do luật ấn định.
                  </td>
                </tr>
                <tr className="bg-amber-50/20 hover:bg-red-50/40 transition">
                  <td className="px-3 py-2.5 font-bold font-mono text-center text-rose-700 border-r border-amber-100">08</td>
                  <td className="px-3 py-2.5 text-center border-r border-amber-100">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-red-100 text-red-800 border border-red-300">
                      NGHIÊM TRỌNG
                    </span>
                  </td>
                  <td className="px-3.5 py-2.5 font-semibold text-slate-900 border-r border-amber-100">
                    Giải thể &amp; Thanh lý tài sản không rõ ràng
                  </td>
                  <td className="px-3.5 py-2.5 border-r border-amber-100 text-rose-900">
                    Tranh chấp thứ tự thanh toán nghĩa vụ nợ; rủi ro pháp lý với số dư tiền ví của hàng triệu khách hàng khi chấm dứt hoạt động.
                  </td>
                  <td className="px-3.5 py-2.5 text-emerald-800 font-medium bg-emerald-50/30">
                    Xác lập nguyên tắc thanh lý tài sản nghiêm ngặt: Tuyệt đối ưu tiên hoàn trả số dư ví người dùng trước khi phân chia cho cổ đông.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Key Strategic Pillars Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-0.5">
            <div className="stagger-2 p-2.5 bg-white rounded-xl border border-amber-300 shadow-2xs">
              <span className="text-[10px] font-bold text-[#8C6B18] block uppercase">Đối sách 1 · Giữ ổn định</span>
              <strong className="text-xs text-slate-900 block mt-0.5">Quyền ưu tiên mua 30 ngày</strong>
              <p className="text-[11px] text-slate-600 m-0 mt-1">
                Bảo đảm 05 nhà đầu tư sáng lập luôn có quyền giữ vững tỷ lệ chi phối trước bất kỳ đề nghị chuyển nhượng nào.
              </p>
            </div>
            <div className="stagger-3 p-2.5 bg-white rounded-xl border border-blue-300 shadow-2xs">
              <span className="text-[10px] font-bold text-blue-700 block uppercase">Đối sách 2 · Mở rộng vốn</span>
              <strong className="text-xs text-slate-900 block mt-0.5">Tiếp nhận Quỹ Ngoại M&amp;A</strong>
              <p className="text-[11px] text-slate-600 m-0 mt-1">
                Quy chế chào bán riêng lẻ chuẩn hóa, định giá tài sản vô hình và bảo lưu quyền phủ quyết công nghệ.
              </p>
            </div>
            <div className="stagger-4 p-2.5 bg-white rounded-xl border border-emerald-300 shadow-2xs">
              <span className="text-[10px] font-bold text-emerald-700 block uppercase">Đối sách 3 · Uy tín tài chính</span>
              <strong className="text-xs text-slate-900 block mt-0.5">Ưu tiên số dư ví người dùng</strong>
              <p className="text-[11px] text-slate-600 m-0 mt-1">
                Tách biệt tài khoản ký quỹ bảo toàn số dư 100% tại ngân hàng, không thể bị kê biên hay cấn trừ nợ doanh nghiệp.
              </p>
            </div>
          </div>
        </div>
      ),
    },

    // SLIDE 10: KỊCH BẢN Q&A PHẢN BIỆN & TỔNG KẾT BÁO CÁO
    {
      id: 'slide-10',
      badge: 'SLIDE 10 / 10 · Q&A & TỔNG KẾT',
      category: 'TỔNG KẾT & PHẢN BIỆN · ĐOÀN ÁNH PHƯƠNG (TRƯỞNG NHÓM)',
      title: 'KỊCH BẢN HỎI - ĐÁP PHẢN BIỆN (Q&A) & ĐỀ XUẤT NÂNG CẤP ĐIỀU LỆ SỐ HÓA',
      subtitle: 'Nhóm 13 sẵn sàng giải đáp chất vấn từ Giảng viên & Hội đồng chuyên môn Khoa Luật HVNH',
      speakerName: 'Đoàn Ánh Phương',
      speakerRole: 'Trưởng Nhóm 13 · Phản biện chuyên sâu',
      speakerAvatar: '/assets/team/anh-phuong.jpg',
      speakerNotes: 'Để kết lại phần trình bày hồ sơ tư vấn Điều lệ TVPAY, Nhóm 13 đã chuẩn bị sẵn kịch bản phản biện cho 2 vấn đề trọng yếu mà Giảng viên thường đặt câu hỏi: (1) Vì sao TVPAY phải duy trì quỹ thanh khoản nghiêm ngặt hơn công ty thường, và (2) Cơ chế nào bảo vệ 5 nhà đầu tư sáng lập trước nguy cơ pha loãng vốn. Đồng thời, nhóm đề xuất bước tiến số hóa Điều lệ với chữ ký số cá nhân và hợp đồng điện tử theo Luật Giao dịch điện tử 2023. Xin trân trọng cảm ơn Thầy và các bạn đã lắng nghe!',
      renderContent: () => (
        <div className="space-y-3.5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="stagger-1 p-3.5 bg-white rounded-xl border-2 border-emerald-400 shadow-2xs">
              <div className="flex items-center gap-1.5 text-emerald-900 font-bold mb-1.5">
                <HelpCircle className="w-4 h-4 text-emerald-600" />
                <span className="text-[11px] uppercase tracking-wide">Chất vấn 01 (Thường gặp từ Giảng viên)</span>
              </div>
              <p className="font-bold text-slate-900 mb-2 leading-snug">
                "Tại sao TVPAY lại bắt buộc phải duy trì quỹ dự phòng tài chính khắt khe hơn công ty cổ phần thông thường?"
              </p>
              <div className="p-2.5 bg-emerald-50 rounded-lg text-emerald-950 leading-relaxed text-[11px] border border-emerald-200">
                <strong className="text-emerald-900">Tư vấn của Nhóm 13:</strong> Vì TVPAY là tổ chức trung gian thanh toán, nắm giữ số dư ví điện tử của hàng trăm ngàn khách hàng. Bộ đệm tài chính này đảm bảo nguyên tắc bảo toàn thanh khoản 1:1 theo quy định NHNN (Nghị định 52/2024), ngăn ngừa nguy cơ mất khả năng chi trả khi xảy ra sự cố nghẽn mạng ngân hàng đối tác.
              </div>
            </div>

            <div className="stagger-2 p-3.5 bg-white rounded-xl border-2 border-blue-400 shadow-2xs">
              <div className="flex items-center gap-1.5 text-blue-900 font-bold mb-1.5">
                <HelpCircle className="w-4 h-4 text-blue-600" />
                <span className="text-[11px] uppercase tracking-wide">Chất vấn 02 (Thường gặp từ Giảng viên)</span>
              </div>
              <p className="font-bold text-slate-900 mb-2 leading-snug">
                "Cơ chế nào trong Điều lệ giúp bảo vệ 05 nhà đầu tư sáng lập trước nguy cơ bị các nhà đầu tư vòng sau pha loãng?"
              </p>
              <div className="p-2.5 bg-blue-50 rounded-lg text-blue-950 leading-relaxed text-[11px] border border-blue-200">
                <strong className="text-blue-900">Tư vấn của Nhóm 13:</strong> Điều lệ trao quyền ưu tiên mua cổ phần chào bán mới tương ứng với tỷ lệ sở hữu hiện có (Điều 6), đồng thời quy định tỷ lệ biểu quyết tối thiểu 65% đối với các quyết định tăng vốn hoặc chào bán cổ phần riêng lẻ cho nhà đầu tư ngoại, ngăn chặn việc ép giá pha loãng.
              </div>
            </div>
          </div>

          {/* Corporate Counsel Banner & Digital Proposal */}
          <div className="stagger-3 p-3 bg-gradient-to-r from-amber-50 via-white to-amber-50 rounded-xl border border-amber-300 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-700">
            <div className="flex items-center gap-3">
              <img
                src="/assets/corporate-counsel.jpg"
                alt="Tổ chuyên gia tư vấn pháp lý Nhóm 13"
                className="w-16 h-11 object-cover rounded-md border border-amber-300 shrink-0 shadow-2xs"
              />
              <div>
                <strong className="text-slate-900 block text-[11.5px] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#C59B27]" />
                  Đề xuất số hóa Điều lệ TVPAY · Nâng tầm văn kiện pháp lý
                </strong>
                <span className="text-slate-600 text-[11px]">
                  Tích hợp biểu quyết ĐHĐCĐ bằng chữ ký số cá nhân và chứng thực hợp đồng điện tử theo Luật Giao dịch điện tử 2023.
                </span>
              </div>
            </div>
            <span className="font-mono text-[10px] font-bold px-2.5 py-1 bg-amber-100 text-[#7A5B10] rounded-lg border border-amber-300 shrink-0">
              NHÓM 13 · KHOA LUẬT HVNH
            </span>
          </div>
        </div>
      ),
    },
  ];

  // =========================================================================
  // SLIDES FOR THỎA THUẬN MỞ & SỬ DỤNG VÍ ĐIỆN TỬ TVPAY
  // =========================================================================
  const walletSlides: SlideItem[] = [
    {
      id: 'w-slide-1',
      badge: 'SLIDE 01 / 05 · TỔNG QUAN',
      category: 'BÁO CÁO PHÁP LÝ NHÓM 13 · KHOA LUẬT HVNH',
      title: 'THỎA THUẬN MỞ VÀ SỬ DỤNG VÍ ĐIỆN TỬ TVPAY',
      subtitle: 'Hợp đồng dịch vụ trung gian thanh toán chuẩn mực giữa TVPAY và Người dùng',
      renderContent: () => (
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            <div className="p-4 bg-white/95 rounded-xl border border-amber-300/80 shadow-xs">
              <div className="flex items-center gap-2 mb-2 text-[#8C6B18]">
                <FileText className="w-4 h-4" />
                <span className="text-[11px] font-bold uppercase tracking-wider">Bản chất pháp lý</span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 m-0 mb-1">Hợp đồng gia nhập (Adhesion)</h4>
              <p className="text-[11.5px] text-slate-600 leading-relaxed m-0">
                Xác lập quyền và nghĩa vụ giữa TVPAY và khách hàng khi đăng ký kích hoạt dịch vụ ví điện tử trên ứng dụng di động.
              </p>
            </div>

            <div className="p-4 bg-white/95 rounded-xl border border-amber-300/80 shadow-xs">
              <div className="flex items-center gap-2 mb-2 text-[#8C6B18]">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-[11px] font-bold uppercase tracking-wider">Chuẩn eKYC &amp; Bảo toàn 1:1</span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 m-0 mb-1">Nghị định 52/2024/NĐ-CP</h4>
              <p className="text-[11.5px] text-slate-600 leading-relaxed m-0">
                Bắt buộc liên kết tài khoản ngân hàng chính chủ và ký quỹ bảo toàn số dư 100% tại ngân hàng liên kết.
              </p>
            </div>

            <div className="p-4 bg-white/95 rounded-xl border border-amber-300/80 shadow-xs">
              <div className="flex items-center gap-2 mb-2 text-[#8C6B18]">
                <Scale className="w-4 h-4" />
                <span className="text-[11px] font-bold uppercase tracking-wider">Cơ chế chấp thuận</span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 m-0 mb-1">Chấp thuận trực tuyến (Opt-in)</h4>
              <p className="text-[11.5px] text-slate-600 leading-relaxed m-0">
                Người dùng tích chọn đồng ý điều khoản trước khi kích hoạt. Giá trị pháp lý tương đương văn bản ký kết trực tiếp.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'w-slide-2',
      badge: 'SLIDE 02 / 05 · MỤC LỤC TOÀN VĂN',
      category: 'CẤU TRÚC TOÀN VĂN THỎA THUẬN VÍ (CHỈ NÊU TÊN MỤC)',
      title: 'HỆ THỐNG CÁC ĐIỀU KHOẢN THỎA THUẬN MỞ VÍ TVPAY',
      subtitle: 'Danh mục Phần A, 18 Điều khoản và Phần C tinh gọn theo đúng yêu cầu',
      renderContent: () => (
        <div className="space-y-3">
          <div className="p-2.5 bg-amber-50/70 border border-amber-200/80 rounded-lg text-xs text-[#7A5B10] flex items-center justify-between">
            <span>📋 Danh mục 18 Điều khoản chính thức + Phần A (Chủ thể) &amp; Phần C (Cam kết):</span>
            <span className="font-mono font-bold text-[11px] bg-white px-2 py-0.5 rounded border border-amber-300">Thỏa thuận Ví TVPAY</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            {[
              { tag: 'Phần A', name: 'Chủ thể & Phạm vi áp dụng' },
              { tag: 'Điều 1', name: 'Đối tượng & Chấp thuận' },
              { tag: 'Điều 2', name: 'Giải thích từ ngữ kỹ thuật' },
              { tag: 'Điều 3', name: 'Điều kiện mở Ví điện tử' },
              { tag: 'Điều 4', name: 'Định danh eKYC & CCCD' },
              { tag: 'Điều 5', name: 'Nạp, rút & Chuyển tiền' },
              { tag: 'Điều 6', name: 'Hạn mức giao dịch quy định' },
              { tag: 'Điều 7', name: 'Biểu phí & Thu phí dịch vụ' },
              { tag: 'Điều 8', name: 'Quyền và nghĩa vụ Khách hàng' },
              { tag: 'Điều 9', name: 'Quyền và nghĩa vụ TVPAY' },
              { tag: 'Điều 10', name: 'Tạm khóa, phong tỏa & Đóng ví' },
              { tag: 'Điều 11', name: 'Bảo mật & Dữ liệu cá nhân' },
              { tag: 'Điều 12', name: 'Sở hữu trí tuệ & Bản quyền' },
              { tag: 'Điều 13', name: 'Tra soát, khiếu nại & Bồi thường' },
              { tag: 'Điều 14', name: 'Sự kiện Bất khả kháng' },
              { tag: 'Điều 15', name: 'Chấm dứt thỏa thuận dịch vụ' },
              { tag: 'Điều 16', name: 'Miễn trừ trách nhiệm TVPAY' },
              { tag: 'Điều 17', name: 'Giải quyết tranh chấp' },
              { tag: 'Điều 18', name: 'Điều khoản thi hành & Hiệu lực' },
              { tag: 'Phần C', name: 'Cam kết & Xác nhận Khách hàng' },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-2 bg-white rounded-lg border border-amber-200/70 shadow-2xs hover:border-amber-400 transition"
              >
                <span className="font-mono font-bold text-[10px] text-[#8C6B18] block">{item.tag}</span>
                <strong className="text-[11.5px] text-slate-800 font-semibold truncate block">{item.name}</strong>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 'w-slide-3',
      badge: 'SLIDE 03 / 05 · NỘI DUNG & VAI TRÒ',
      category: 'MỤC 1 THEO YÊU CẦU NHÓM TRƯỞNG',
      title: 'NỘI DUNG CƠ BẢN & VAI TRÒ QUAN TRỌNG CỦA THỎA THUẬN VÍ',
      subtitle: 'Hành lang pháp lý đảm bảo an toàn giao dịch số và tuân thủ chuẩn thanh toán quốc gia',
      renderContent: () => (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs">
          <div className="p-4 bg-white rounded-xl border border-amber-300/80 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-[#8C6B18] font-bold text-xs mb-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Vai trò 01 · Cơ sở pháp lý</span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 m-0 mb-1.5">
                Xác lập quyền &amp; nghĩa vụ ràng buộc người dùng
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed m-0">
                Ngăn chặn tranh chấp dân sự. Khách hàng sử dụng dịch vụ đồng nghĩa với việc cam kết tuân thủ các quy chuẩn giao dịch, hạn mức và bảo mật tài khoản.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-amber-100 text-[11px] font-semibold text-[#8C6B18]">
              Căn cứ Điều 1, 8, 9 Thỏa thuận
            </div>
          </div>

          <div className="p-4 bg-white rounded-xl border border-amber-300/80 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-[#8C6B18] font-bold text-xs mb-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Vai trò 02 · Phòng chống rửa tiền (AML)</span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 m-0 mb-1.5">
                Tuân thủ bắt buộc chuẩn eKYC &amp; Hạn mức thanh toán
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed m-0">
                Thiết lập định danh điện tử, đối soát CCCD gắn chip và kiểm soát hạn mức giao dịch tháng theo đúng quy chuẩn nghiêm ngặt của NHNN và Bộ Công an.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-amber-100 text-[11px] font-semibold text-[#8C6B18]">
              Căn cứ Điều 3, 4, 6 Thỏa thuận
            </div>
          </div>

          <div className="p-4 bg-white rounded-xl border border-amber-300/80 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-[#8C6B18] font-bold text-xs mb-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Vai trò 03 · An toàn tài sản</span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 m-0 mb-1.5">
                Cơ chế bảo toàn 1:1 qua tài khoản đảm bảo thanh toán
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed m-0">
                Khẳng định tiền trong Ví được bảo chứng 100% bằng tiền đồng gửi tại ngân hàng liên kết, đảm bảo khả năng thanh toán và rút tiền 24/7 của khách hàng.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-amber-100 text-[11px] font-semibold text-[#8C6B18]">
              Căn cứ Điều 5 Thỏa thuận
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'w-slide-4',
      badge: 'SLIDE 04 / 05 · LÁ CHẮN BẢO VỆ DN',
      category: 'MỤC 2 THEO YÊU CẦU NHÓM TRƯỞNG',
      title: 'Ý TƯỞNG & GIẢI PHÁP PHÁP LÝ BẢO VỆ QUYỀN LỢI TVPAY KHI MỞ VÍ',
      subtitle: '4 Đối sách pháp lý giải quyết triệt để rủi ro bồi thường, lỗi ngân hàng và khiếu nại gian lận',
      renderContent: () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
          <div className="p-3.5 bg-white rounded-xl border border-emerald-300/90 shadow-xs">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300">
                Lá chắn 01 · Bất khả hủy ngang
              </span>
              <span className="text-[11px] font-mono font-bold text-emerald-800">Điều 5 Khoản 2</span>
            </div>
            <h4 className="text-xs font-bold text-slate-900 m-0 mb-1.5">
              Giao dịch đã thực hiện thành công không thể hủy ngang
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed m-0">
              Một khi lệnh chuyển tiền đã được hệ thống xử lý khớp lệnh thành công theo mã xác thực OTP của khách hàng, TVPAY không có nghĩa vụ rút lại tiền nếu không có lệnh của cơ quan công an.
            </p>
            <div className="mt-2.5 p-2 bg-emerald-50/70 rounded-lg text-[11px] text-emerald-900">
              <strong>Ý nghĩa:</strong> Chặn đứng hành vi gian lận đòi hoàn tiền giả mạo (chargeback fraud).
            </div>
          </div>

          <div className="p-3.5 bg-white rounded-xl border border-emerald-300/90 shadow-xs">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300">
                Lá chắn 02 · Miễn trừ trách nhiệm
              </span>
              <span className="text-[11px] font-mono font-bold text-emerald-800">Điều 16</span>
            </div>
            <h4 className="text-xs font-bold text-slate-900 m-0 mb-1.5">
              Miễn trừ tuyệt đối khi lỗi từ phía ngân hàng hoặc người dùng lộ OTP
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed m-0">
              TVPAY được miễn trừ bồi thường trong trường hợp: nghẽn mạng ngân hàng đối tác, người dùng để lộ mật khẩu, điện thoại bị nhiễm mã độc hoặc bị hacker tấn công thiết bị cá nhân.
            </p>
            <div className="mt-2.5 p-2 bg-emerald-50/70 rounded-lg text-[11px] text-emerald-900">
              <strong>Ý nghĩa:</strong> Không phải chịu trách nhiệm tài chính thay cho sự bất cẩn của khách hàng.
            </div>
          </div>

          <div className="p-3.5 bg-white rounded-xl border border-emerald-300/90 shadow-xs">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300">
                Lá chắn 03 · Khóa ví khẩn cấp
              </span>
              <span className="text-[11px] font-mono font-bold text-emerald-800">Điều 10 Khoản 1</span>
            </div>
            <h4 className="text-xs font-bold text-slate-900 m-0 mb-1.5">
              Quyền chủ động phong tỏa tài khoản khi có dấu hiệu gian lận
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed m-0">
              TVPAY có toàn quyền tạm khóa hoặc đóng băng ví ngay lập tức khi thuật toán AI phát hiện dấu hiệu rửa tiền, giao dịch bất thường hoặc khi nhận yêu cầu bằng văn bản từ cơ quan công an.
            </p>
            <div className="mt-2.5 p-2 bg-emerald-50/70 rounded-lg text-[11px] text-emerald-900">
              <strong>Ý nghĩa:</strong> Bảo toàn dòng tiền, tránh bị quy kết đồng lõa với tội phạm công nghệ cao.
            </div>
          </div>

          <div className="p-3.5 bg-white rounded-xl border border-emerald-300/90 shadow-xs">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300">
                Lá chắn 04 · Thời hiệu khiếu nại
              </span>
              <span className="text-[11px] font-mono font-bold text-emerald-800">Điều 13</span>
            </div>
            <h4 className="text-xs font-bold text-slate-900 m-0 mb-1.5">
              Giới hạn thời hạn tra soát &amp; Nghĩa vụ cung cấp chứng cứ của người dùng
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed m-0">
              Khách hàng có nghĩa vụ khiếu nại trong vòng 24 - 48 giờ kể từ lúc giao dịch phát sinh. Quá thời hạn này, giao dịch được coi là mặc nhiên hợp lệ và không thể khiếu kiện.
            </p>
            <div className="mt-2.5 p-2 bg-emerald-50/70 rounded-lg text-[11px] text-emerald-900">
              <strong>Ý nghĩa:</strong> Tránh các vụ kiện tụng kéo dài nhiều tháng sau khi sự việc đã nguội.
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'w-slide-5',
      badge: 'SLIDE 05 / 05 · TỔNG KẾT & AN TOÀN',
      category: 'KẾT LUẬN HỒ SƠ PHÁP LÝ NHÓM 13',
      title: 'ĐÁNH GIÁ TỔNG QUAN VỀ THỎA THUẬN MỞ & SỬ DỤNG VÍ TVPAY',
      subtitle: 'Cân bằng hoàn hảo giữa trải nghiệm người dùng mượt mà và lá chắn bảo vệ TVPAY',
      renderContent: () => (
        <div className="space-y-3.5 text-xs">
          <div className="p-4 bg-white rounded-xl border border-amber-300/90 shadow-xs">
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
              <Award className="w-4 h-4 text-[#8C6B18]" />
              <span>Cán cân pháp lý: Trải nghiệm khách hàng &amp; An toàn Doanh nghiệp</span>
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed m-0">
              Thỏa thuận mở ví điện tử TVPAY được xây dựng chuẩn mực trên nền tảng pháp lý của Nghị định 52/2024/NĐ-CP và Luật Bảo vệ quyền lợi người tiêu dùng 2023. Văn bản vừa đảm bảo tính minh bạch, thân thiện để người dùng yên tâm thanh toán, vừa dựng nên hệ thống phòng vệ 4 lớp bảo vệ TVPAY trước rủi ro khiếu nại ác ý và gian lận công nghệ cao.
            </p>
          </div>
        </div>
      ),
    },
  ];

  const slides = isCharter ? charterSlides : walletSlides;
  const totalSlides = slides.length;

  const nextSlide = useCallback(() => {
    try {
      uiSound.playClick();
    } catch {}
    setSlideDirection('forward');
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    try {
      uiSound.playClick();
    } catch {}
    setSlideDirection('backward');
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const goToSlide = (idx: number) => {
    try {
      uiSound.playClick();
    } catch {}
    setSlideDirection(idx >= currentSlide ? 'forward' : 'backward');
    setCurrentSlide(idx);
  };

  // Auto-play timer
  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      setSlideDirection('forward');
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 8000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, totalSlides]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      if (
        activeEl &&
        (activeEl.tagName === 'INPUT' ||
          activeEl.tagName === 'TEXTAREA' ||
          (activeEl as HTMLElement).isContentEditable)
      ) {
        return;
      }

      if (e.key === 'ArrowRight' || (isFullscreen && e.key === ' ')) {
        if (e.key === ' ') e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      } else if (e.key.toLowerCase() === 'f' && !e.metaKey && !e.ctrlKey) {
        setIsFullscreen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide, isFullscreen]);

  const activeSlide = slides[currentSlide];

  return (
    <div
      ref={containerRef}
      className={`tvpay-presentation-slides-wrapper relative ${
        isFullscreen
          ? 'fixed inset-0 z-[9999] bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center p-2 sm:p-5 md:p-8 overflow-y-auto animate-in fade-in duration-300'
          : 'w-full my-8'
      } ${className}`}
    >
      {/* Cinema Theater Mode Top Floating Bar */}
      {isFullscreen && (
        <div className="w-full max-w-6xl mb-2.5 flex items-center justify-between px-4 py-2 bg-slate-900/90 border border-amber-400/40 rounded-xl backdrop-blur-md text-amber-200 text-xs shadow-2xl shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="font-bold tracking-wider uppercase font-serif text-amber-300 text-[11px] sm:text-xs">
              RẠP CHIẾU THUYẾT TRÌNH · TVPAY CINEMA MODE
            </span>
            <span className="text-slate-500 hidden sm:inline">|</span>
            <span className="text-slate-300 hidden sm:inline text-[11px]">
              Học viện Ngân hàng · Nhóm 13
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-1.5 text-[11px] text-slate-300">
              <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-amber-300 font-mono text-[10px]">
                ←
              </kbd>
              <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-amber-300 font-mono text-[10px]">
                →
              </kbd>
              <span className="text-slate-400">hoặc</span>
              <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-amber-300 font-mono text-[10px]">
                Space
              </kbd>
              <span className="text-slate-400">chuyển slide</span>
            </div>
            <button
              type="button"
              onClick={() => {
                try {
                  uiSound.playClick();
                } catch {}
                setIsFullscreen(false);
              }}
              className="px-3 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/50 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <Minimize2 className="w-3.5 h-3.5" />
              <span>Thoát Rạp Chiếu (Esc)</span>
            </button>
          </div>
        </div>
      )}

      {/* Container Frame with Royal White & Gold palette */}
      <div
        className={`relative bg-gradient-to-br from-[#FFFDF9] via-[#FAF5EA] to-[#F5ECDA] rounded-2xl border-2 border-amber-300/80 shadow-[0_12px_36px_rgba(197,155,39,0.14)] overflow-hidden transition-all duration-300 ${
          isFullscreen
            ? 'w-full max-w-6xl max-h-[88vh] flex flex-col border-amber-400/90 shadow-[0_0_50px_rgba(212,175,55,0.35)]'
            : ''
        }`}
      >
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
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#8C6B18] font-mono bg-amber-100/90 border border-amber-300/80 px-2 py-0.5 rounded">
                  {isCharter ? 'BÁO CÁO ĐIỀU LỆ TVPAY · 10 SLIDE CHUYÊN SÂU' : 'SLIDE BÁO CÁO THUYẾT TRÌNH VÍ TVPAY'}
                </span>
                <span className="text-[11px] text-slate-500 hidden sm:inline">
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
            <span className="px-2.5 py-1 text-[11px] font-mono font-bold text-[#7A5B10] bg-amber-100/80 border border-amber-300/80 rounded-lg shadow-xs">
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
              <span className="hidden md:inline text-[11px] font-semibold">
                {isAutoPlaying ? 'Đang chạy' : 'Tự chạy'}
              </span>
            </button>

            {/* Fullscreen Toggle */}
            <button
              type="button"
              onClick={() => {
                uiSound.playClick();
                setIsFullscreen(!isFullscreen);
              }}
              className={`p-1.5 rounded-lg transition cursor-pointer shadow-xs flex items-center gap-1 border ${
                isFullscreen
                  ? 'bg-amber-100 text-[#7A5B10] border-amber-300'
                  : 'bg-white hover:bg-amber-50 text-slate-700 border-amber-200'
              }`}
              title={isFullscreen ? 'Thoát rạp chiếu toàn màn hình (Esc)' : 'Mở rạp chiếu toàn màn hình (F)'}
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              <span className="hidden md:inline text-[11px] font-semibold">
                {isFullscreen ? 'Thu nhỏ' : 'Rạp chiếu (F)'}
              </span>
            </button>
          </div>
        </div>

        {/* Slide Main Body Presentation Area */}
        <div
          className={`p-5 sm:p-7 min-h-[380px] sm:min-h-[440px] flex flex-col justify-between relative ${
            isFullscreen ? 'overflow-y-auto slide-theater-scroll flex-1' : ''
          }`}
        >
          <div>
            {/* Slide Category Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 mb-3.5 border-b border-amber-200/60">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-extrabold uppercase px-2 py-0.5 rounded bg-white text-[#8C6B18] border border-amber-300 shadow-2xs">
                  {activeSlide.badge}
                </span>
                <span className="text-xs font-bold text-[#8C6B18] uppercase tracking-wide">
                  {activeSlide.category}
                </span>
              </div>
              <span className="text-[11px] text-slate-500 italic hidden sm:inline">
                Dùng phím ← và → trên bàn phím để chuyển slide
              </span>
            </div>

            {/* Slide Subtitle */}
            <p className="text-xs sm:text-[13px] text-slate-600 font-medium leading-relaxed mb-4">
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
              <div className="mt-4 p-3 sm:p-3.5 bg-gradient-to-r from-amber-50/95 via-white to-amber-50/95 rounded-xl border border-amber-300/80 shadow-2xs flex items-start gap-3">
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
                      <strong className="text-xs text-slate-900 font-bold">
                        {activeSlide.speakerName || 'Thành viên Nhóm 13 (Thịnh Vượng Legal)'}
                      </strong>
                      {activeSlide.speakerRole && (
                        <span className="text-[10.5px] px-2 py-0.5 rounded bg-amber-100/90 text-[#7A5B10] font-medium border border-amber-200/60 hidden sm:inline">
                          {activeSlide.speakerRole}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">
                      Speaker Script · Nhóm 13
                    </span>
                  </div>
                  <p className="text-[11.5px] text-slate-700 leading-relaxed m-0 italic bg-amber-50/40 p-2 rounded-lg border border-amber-200/50">
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
              className="px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs font-bold bg-white hover:bg-amber-50 text-[#7A5B10] border border-amber-300 rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-xs hover:border-amber-400"
            >
              <ChevronLeft className="w-4 h-4 text-[#C59B27]" />
              <span>Trang trước</span>
            </button>

            {/* Step Indicators / Dot Pills (1 to 10) */}
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
                    <span className="font-mono text-[10px] opacity-90">{idx + 1 < 10 ? `0${idx + 1}` : idx + 1}</span>
                    <span className="hidden xl:inline text-[11px] truncate max-w-[90px]">
                      {idx === 0
                        ? 'Tổng quan'
                        : idx === 1
                        ? 'Nguyên tắc'
                        : idx === 2
                        ? 'Vai trò'
                        : idx === 3
                        ? '9 Chương'
                        : idx === 4
                        ? 'Cổ đông'
                        : idx === 5
                        ? 'Vốn & Xung đột'
                        : idx === 6
                        ? 'Fintech & ATTT'
                        : idx === 7
                        ? 'Rủi ro 1'
                        : idx === 8
                        ? 'Rủi ro 2'
                        : 'Q&A'}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Next Button */}
            <button
              type="button"
              onClick={nextSlide}
              className="px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs font-bold bg-gradient-to-r from-[#D4AF37] via-[#C59B27] to-[#A87B15] hover:brightness-105 text-white border border-amber-300 rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-md"
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
