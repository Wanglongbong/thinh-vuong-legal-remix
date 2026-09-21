import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Award,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Expand,
  FileCheck2,
  FileText,
  Landmark,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  Scale,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
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
  renderContent: (docData: OfficialDocumentData) => React.ReactNode;
}

export function TvpayPresentationSlides({ slug, className = '' }: TvpayPresentationSlidesProps) {
  const docData = tvpayOfficialDocs[slug] || tvpayOfficialDocs['dieu-le-cong-ty-co-phan'];
  const isCharter = slug === 'dieu-le-cong-ty-co-phan';

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [soundActive, setSoundActive] = useState(() => uiSound.isEnabled());
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsub = uiSound.subscribe((enabled) => setSoundActive(enabled));
    return () => {
      unsub();
    };
  }, []);

  // Slide definitions grounded in official dossier & team leader instructions
  const slides: SlideItem[] = isCharter
    ? [
        // SLIDE 1: TỔNG QUAN BÁO CÁO & CĂN CỨ PHÁP LÝ
        {
          id: 'slide-1',
          badge: 'SLIDE 01 / 05 · TỔNG QUAN',
          category: 'BÁO CÁO PHÁP LÝ NHÓM 13 · KHOA LUẬT HVNH',
          title: 'ĐIỀU LỆ CÔNG TY CỔ PHẦN THANH TOÁN THỊNH VƯỢNG (TVPAY)',
          subtitle: 'Hồ sơ pháp lý nền tảng xác lập tư cách pháp nhân và điều kiện cấp phép trung gian thanh toán',
          renderContent: () => (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                <div className="p-4 bg-white/95 rounded-xl border border-amber-300/80 shadow-xs">
                  <div className="flex items-center gap-2 mb-2 text-[#8C6B18]">
                    <Landmark className="w-4 h-4" />
                    <span className="text-[11px] font-bold uppercase tracking-wider">Tư cách pháp nhân</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 m-0 mb-1">Công ty Cổ phần TVPAY</h4>
                  <p className="text-[11.5px] text-slate-600 leading-relaxed m-0">
                    Thành lập theo Luật Doanh nghiệp 2020. Hoạt động cung ứng dịch vụ trung gian thanh toán theo Giấy phép của NHNN.
                  </p>
                </div>

                <div className="p-4 bg-white/95 rounded-xl border border-amber-300/80 shadow-xs">
                  <div className="flex items-center gap-2 mb-2 text-[#8C6B18]">
                    <Award className="w-4 h-4" />
                    <span className="text-[11px] font-bold uppercase tracking-wider">Vốn điều lệ &amp; Cổ đông</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 m-0 mb-1">50.000.000.000 VNĐ</h4>
                  <p className="text-[11.5px] text-slate-600 leading-relaxed m-0">
                    Gồm 03 Cổ đông sáng lập: Nguyễn Văn Thịnh (40%), Lê Quang Tùng (35%), Trần Thanh Mai (25%) góp đủ 100% bằng tiền đồng.
                  </p>
                </div>

                <div className="p-4 bg-white/95 rounded-xl border border-amber-300/80 shadow-xs">
                  <div className="flex items-center gap-2 mb-2 text-[#8C6B18]">
                    <Scale className="w-4 h-4" />
                    <span className="text-[11px] font-bold uppercase tracking-wider">Căn cứ pháp lý then chốt</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 m-0 mb-1">Luật DN 2020 &amp; NĐ 52/2024</h4>
                  <p className="text-[11.5px] text-slate-600 leading-relaxed m-0">
                    Tuân thủ Luật Doanh nghiệp số 59/2020, NĐ 52/2024/NĐ-CP về thanh toán không dùng tiền mặt và TT 40/2024/TT-NHNN.
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-amber-50/80 rounded-xl border border-amber-200/90 flex items-start gap-3 text-xs text-[#7A5B10]">
                <Sparkles className="w-4 h-4 text-[#8C6B18] shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong>🎯 Trọng tâm trình bày theo chỉ đạo Nhóm trưởng:</strong> Báo cáo gồm 2 phần trọng tâm cốt lõi: 
                  (1) <em>Nội dung &amp; Vai trò quan trọng</em> đối với sự tồn tại và cấp phép của doanh nghiệp; 
                  (2) <em>Ý tưởng/giải pháp pháp lý bảo vệ quyền và lợi ích hợp pháp của DN</em>. Toàn bộ cơ cấu chương mục chỉ nêu tên, không dàn trải.
                </div>
              </div>
            </div>
          ),
        },

        // SLIDE 2: CẤU TRÚC CHƯƠNG TOÀN VĂN (CHỈ NÊU TÊN CHƯƠNG THEO YÊU CẦU NHÓM TRƯỞNG)
        {
          id: 'slide-2',
          badge: 'SLIDE 02 / 05 · MỤC LỤC TOÀN VĂN',
          category: 'CẤU TRÚC 9 CHƯƠNG TOÀN VĂN (GHI DANH MỤC TÊN CHƯƠNG)',
          title: 'HỆ THỐNG CẤU TRÚC CHƯƠNG ĐIỀU LỆ TVPAY',
          subtitle: 'Ghi rõ tên 9 Chương theo đúng chuẩn định hướng tinh gọn của nhóm trưởng',
          renderContent: () => (
            <div className="space-y-3">
              <div className="p-2.5 bg-amber-50/70 border border-amber-200/80 rounded-lg text-xs text-[#7A5B10] flex items-center justify-between">
                <span>📋 Danh mục chuẩn 09 Chương theo văn bản pháp lý chính thức (gồm 86 Điều):</span>
                <span className="font-mono font-bold text-[11px] bg-white px-2 py-0.5 rounded border border-amber-300">Nhóm 13 · HVNH</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {[
                  { num: 'Chương I', name: 'Quy định chung', sub: 'Tên, trụ sở, tư cách pháp nhân, mục tiêu & phạm vi hoạt động' },
                  { num: 'Chương II', name: 'Vốn điều lệ, cổ phần, cổ đông sáng lập', sub: 'Quy mô 50 tỷ VNĐ, loại cổ phần, chuyển nhượng & mua lại' },
                  { num: 'Chương III', name: 'Quyền và nghĩa vụ của Cổ đông', sub: 'Quyền biểu quyết, cổ tức, nghĩa vụ thanh toán & bảo mật' },
                  { num: 'Chương IV', name: 'Cơ cấu tổ chức quản lý', sub: 'Đại hội đồng cổ đông, Hội đồng quản trị, Ban Kiểm soát, Tổng Giám đốc' },
                  { num: 'Chương V', name: 'Người đại diện theo pháp luật & Quản lý', sub: 'Tiêu chuẩn, thẩm quyền, trách nhiệm cá nhân & thù lao' },
                  { num: 'Chương VI', name: 'Năm tài chính, Kế toán & Phân phối lợi nhuận', sub: 'Chế độ kế toán, trích lập các quỹ dự trữ bắt buộc, kiểm toán' },
                  { num: 'Chương VII', name: 'Giải quyết tranh chấp nội bộ', sub: 'Thương lượng hòa giải nội bộ, Trọng tài thương mại & Tòa án' },
                  { num: 'Chương VIII', name: 'Tổ chức lại, Giải thể và Phá sản', sub: 'Chia tách, sáp nhập, hợp nhất, thủ tục giải thể theo luật định' },
                  { num: 'Chương IX', name: 'Điều khoản thi hành & Hiệu lực', sub: 'Hiệu lực thực thi, sửa đổi bổ sung và chữ ký cổ đông sáng lập' },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-white rounded-xl border border-amber-200/70 shadow-2xs hover:border-amber-400 hover:shadow-xs transition"
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-amber-100 text-[#7A5B10] rounded-md border border-amber-300/60">
                        {item.num}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">0{idx + 1}</span>
                    </div>
                    <h5 className="text-xs font-bold text-slate-900 m-0 mb-1 leading-snug">{item.name}</h5>
                    <p className="text-[11px] text-slate-500 m-0 line-clamp-1">{item.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          ),
        },

        // SLIDE 3: MỤC 1 - NỘI DUNG & VAI TRÒ QUAN TRỌNG
        {
          id: 'slide-3',
          badge: 'SLIDE 03 / 05 · NỘI DUNG & VAI TRÒ',
          category: 'MỤC 1 THEO YÊU CẦU NHÓM TRƯỞNG',
          title: 'NỘI DUNG CỐT LÕI & VAI TRÒ CHIẾN LƯỢC CỦA ĐIỀU LỆ TVPAY',
          subtitle: '4 Trụ cột chiến lược quyết định sự hợp pháp và năng lực vận hành bền vững của DN',
          renderContent: () => (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div className="p-3.5 bg-white rounded-xl border border-amber-300/80 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-[#7A5B10] border border-amber-300">
                      Trụ cột 01 · Pháp lý sống còn
                    </span>
                    <span className="text-[11px] font-mono font-bold text-[#8C6B18]">Điều 4, 5, 22</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 m-0 mb-1.5">
                    Điều kiện tiên quyết để NHNN cấp Giấy phép Trung gian thanh toán
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed m-0">
                    Xác lập vốn điều lệ 50 tỷ đồng (vốn pháp định tối thiểu), đăng ký đúng mã ngành 6499/6619 và phương án kinh doanh đáp ứng khắt khe Nghị định 52/2024/NĐ-CP.
                  </p>
                </div>
                <div className="mt-2.5 pt-2 border-t border-amber-100 text-[11px] font-semibold text-[#8C6B18]">
                  ★ Không có Điều lệ chuẩn = Không thể xin cấp phép NHNN
                </div>
              </div>

              <div className="p-3.5 bg-white rounded-xl border border-amber-300/80 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-[#7A5B10] border border-amber-300">
                      Trụ cột 02 · Quản trị minh bạch
                    </span>
                    <span className="text-[11px] font-mono font-bold text-[#8C6B18]">Điều 15-55</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 m-0 mb-1.5">
                    Phân định rành mạch quyền lực ĐHĐCĐ - HĐQT - Ban Kiểm soát - TGĐ
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed m-0">
                    Thiết lập cơ chế kiểm soát chéo và đối trọng quyền lực. Tách biệt tuyệt đối quyền định hướng chiến lược (HĐQT) và quyền điều hành tác nghiệp tài khoản tiền gửi (TGĐ).
                  </p>
                </div>
                <div className="mt-2.5 pt-2 border-t border-amber-100 text-[11px] font-semibold text-[#8C6B18]">
                  ★ Ngăn ngừa lạm quyền &amp; xung đột lợi ích nội bộ
                </div>
              </div>

              <div className="p-3.5 bg-white rounded-xl border border-amber-300/80 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-[#7A5B10] border border-amber-300">
                      Trụ cột 03 · Bảo toàn vốn
                    </span>
                    <span className="text-[11px] font-mono font-bold text-[#8C6B18]">Điều 69, 71</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 m-0 mb-1.5">
                    Quỹ dự trữ bắt buộc &amp; Kiểm toán độc lập thường niên
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed m-0">
                    Quy định trích lập 5% lợi nhuận vào Quỹ dự trữ bổ sung vốn điều lệ và Quỹ dự phòng tài chính. Bắt buộc kiểm toán độc lập định kỳ bảo vệ an toàn thanh khoản ví.
                  </p>
                </div>
                <div className="mt-2.5 pt-2 border-t border-amber-100 text-[11px] font-semibold text-[#8C6B18]">
                  ★ Tấm đệm hấp thụ rủi ro tài chính &amp; rò rỉ thanh khoản
                </div>
              </div>

              <div className="p-3.5 bg-white rounded-xl border border-amber-300/80 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-[#7A5B10] border border-amber-300">
                      Trụ cột 04 · Ổn định pháp lý
                    </span>
                    <span className="text-[11px] font-mono font-bold text-[#8C6B18]">Điều 21, 73</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 m-0 mb-1.5">
                    Giải quyết tranh chấp nội bộ &amp; Chống bế tắc quản trị (Deadlock)
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed m-0">
                    Cơ chế thương lượng hòa giải nội bộ bắt buộc trước khi khởi kiện. Quy định tỷ lệ biểu quyết minh bạch và bảo vệ quyền biểu quyết của cổ đông thiểu số.
                  </p>
                </div>
                <div className="mt-2.5 pt-2 border-t border-amber-100 text-[11px] font-semibold text-[#8C6B18]">
                  ★ Giữ ổn định bộ máy doanh nghiệp khi xảy ra bất đồng
                </div>
              </div>
            </div>
          ),
        },

        // SLIDE 4: MỤC 2 - GIẢI PHÁP BẢO VỆ QUYỀN VÀ LỢI ÍCH HỢP PHÁP CỦA DN
        {
          id: 'slide-4',
          badge: 'SLIDE 04 / 05 · GIẢI PHÁP PHÒNG VỆ DN',
          category: 'MỤC 2 THEO YÊU CẦU NHÓM TRƯỞNG',
          title: 'Ý TƯỞNG & GIẢI PHÁP PHÁP LÝ BẢO VỆ QUYỀN LỢI HỢP PHÁP TVPAY',
          subtitle: 'Hệ thống lá chắn phòng vệ bảo vệ an toàn vốn, chống thâu tóm và ngăn chặn thất thoát',
          renderContent: () => (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div className="p-3.5 bg-white rounded-xl border border-emerald-300/90 shadow-xs">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300">
                    Lá chắn 01 · Chống thâu tóm
                  </span>
                  <span className="text-[11px] font-mono font-bold text-emerald-800">Điều 6, 7</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 m-0 mb-1.5">
                  Quyền ưu tiên mua cổ phần &amp; Kiểm soát chuyển nhượng bên ngoài
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed m-0">
                  Cổ đông sáng lập có quyền ưu tiên mua cổ phần phát hành thêm theo tỷ lệ tương ứng. Cổ phần của cổ đông sáng lập trong 03 năm đầu bị giới hạn chuyển nhượng cho người ngoài.
                </p>
                <div className="mt-2.5 p-2 bg-emerald-50/70 rounded-lg text-[11px] text-emerald-900">
                  <strong>Ý nghĩa:</strong> Ngăn chặn đối thủ thù địch nhảy vào thâu tóm quyền kiểm soát TVPAY.
                </div>
              </div>

              <div className="p-3.5 bg-white rounded-xl border border-emerald-300/90 shadow-xs">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300">
                    Lá chắn 02 · Trách nhiệm cá nhân
                  </span>
                  <span className="text-[11px] font-mono font-bold text-emerald-800">Điều 56-58</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 m-0 mb-1.5">
                  Buộc Người quản lý (HĐQT, TGĐ) chịu trách nhiệm bồi thường cá nhân
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed m-0">
                  Quy định nghĩa vụ trung thực, cẩn trọng và bảo mật. Bất kỳ quyết định nào vượt thẩm quyền hoặc tư lợi gây tổn thất cho công ty đều phải bồi thường bằng tài sản cá nhân.
                </p>
                <div className="mt-2.5 p-2 bg-emerald-50/70 rounded-lg text-[11px] text-emerald-900">
                  <strong>Ý nghĩa:</strong> Tránh tình trạng người điều hành làm liều rồi công ty phải gánh nợ.
                </div>
              </div>

              <div className="p-3.5 bg-white rounded-xl border border-emerald-300/90 shadow-xs">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300">
                    Lá chắn 03 · Chống rút ruột vốn
                  </span>
                  <span className="text-[11px] font-mono font-bold text-emerald-800">Điều 62</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 m-0 mb-1.5">
                  Kiểm soát giao dịch với người có liên quan (Arm's Length)
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed m-0">
                  Mọi hợp đồng, giao dịch với thành viên HĐQT, TGĐ hoặc người thân phải được thông qua với đa số tán thành độc lập. Người có quyền lợi liên quan không được quyền biểu quyết.
                </p>
                <div className="mt-2.5 p-2 bg-emerald-50/70 rounded-lg text-[11px] text-emerald-900">
                  <strong>Ý nghĩa:</strong> Triệt tiêu nguy cơ rút ruột tài sản TVPAY thông qua các công ty sân sau.
                </div>
              </div>

              <div className="p-3.5 bg-white rounded-xl border border-emerald-300/90 shadow-xs">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300">
                    Lá chắn 04 · Khóa quyền biểu quyết ảo
                  </span>
                  <span className="text-[11px] font-mono font-bold text-emerald-800">Điều 12</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 m-0 mb-1.5">
                  Đình chỉ quyền biểu quyết nếu cổ đông chưa thanh toán đủ tiền góp vốn
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed m-0">
                  Cổ đông chưa thanh toán đủ tiền mua cổ phần theo cam kết sẽ bị đình chỉ quyền biểu quyết và nhận cổ tức tương ứng với phần vốn chưa nộp.
                </p>
                <div className="mt-2.5 p-2 bg-emerald-50/70 rounded-lg text-[11px] text-emerald-900">
                  <strong>Ý nghĩa:</strong> Bảo vệ quyền lợi của những cổ đông đã nộp tiền thật, không bị thao túng bởi vốn ảo.
                </div>
              </div>
            </div>
          ),
        },

        // SLIDE 5: KẾT LUẬN & ĐỀ XUẤT NÂNG CẤP
        {
          id: 'slide-5',
          badge: 'SLIDE 05 / 05 · TỔNG KẾT & KIẾN NGHỊ',
          category: 'KẾT LUẬN HỒ SƠ PHÁP LÝ NHÓM 13',
          title: 'ĐÁNH GIÁ TỔNG THỂ & ĐỀ XUẤT HOÀN THIỆN ĐIỀU LỆ TVPAY',
          subtitle: 'Khẳng định giá trị thực tiễn và lộ trình số hóa quản trị doanh nghiệp fintech',
          renderContent: () => (
            <div className="space-y-3.5">
              <div className="p-4 bg-white rounded-xl border border-amber-300/90 shadow-xs">
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#8C6B18]" />
                  <span>Kết luận về Bộ Điều lệ Công ty TVPAY</span>
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed m-0">
                  Bộ Điều lệ đã hoàn thiện đầy đủ 86 Điều, bao quát trọn vẹn từ cơ chế quản trị công ty cổ phần đến các quy chuẩn kỹ thuật chuyên ngành thanh toán. Văn bản đóng vai trò như bản <strong>"Hiến pháp tối cao"</strong> của TVPAY, vừa thỏa mãn 100% điều kiện thẩm định của Ngân hàng Nhà nước, vừa thiết lập mạng lưới lá chắn phòng thủ vững chắc cho các cổ đông và doanh nghiệp.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 bg-amber-50/70 rounded-xl border border-amber-200/80">
                  <span className="text-[10px] font-bold uppercase text-[#8C6B18] block mb-1">
                    💡 Kiến nghị hoàn thiện 01:
                  </span>
                  <h5 className="text-xs font-bold text-slate-900 m-0 mb-1">Ứng dụng biểu quyết điện tử &amp; Chữ ký số</h5>
                  <p className="text-[11.5px] text-slate-600 m-0 leading-relaxed">
                    Sửa đổi bổ sung Điều 20 cho phép tổ chức ĐHĐCĐ hoàn toàn trực tuyến và biểu quyết bằng chữ ký số cá nhân để tăng tính linh hoạt.
                  </p>
                </div>

                <div className="p-3.5 bg-amber-50/70 rounded-xl border border-amber-200/80">
                  <span className="text-[10px] font-bold uppercase text-[#8C6B18] block mb-1">
                    💡 Kiến nghị hoàn thiện 02:
                  </span>
                  <h5 className="text-xs font-bold text-slate-900 m-0 mb-1">Tích hợp chế tài bảo vệ dữ liệu số</h5>
                  <p className="text-[11.5px] text-slate-600 m-0 leading-relaxed">
                    Cập nhật quy định trách nhiệm bồi hoàn của cán bộ nhân viên nếu làm lộ lọt dữ liệu bí mật người dùng theo Nghị định 13/2023/NĐ-CP.
                  </p>
                </div>
              </div>
            </div>
          ),
        },
      ]
    : [
        // =========================================================================
        // SLIDES FOR THỎA THUẬN VÍ ĐIỆN TỬ TVPAY
        // =========================================================================
        // SLIDE 1: TỔNG QUAN HỢP ĐỒNG VÍ
        {
          id: 'slide-1',
          badge: 'SLIDE 01 / 05 · TỔNG QUAN HỢP ĐỒNG',
          category: 'BÁO CÁO PHÁP LÝ NHÓM 13 · KHOA LUẬT HVNH',
          title: 'THỎA THUẬN MỞ VÀ SỬ DỤNG VÍ ĐIỆN TỬ TVPAY',
          subtitle: 'Hợp đồng dịch vụ trung gian thanh toán chuẩn mực giữa TVPAY và Người dùng',
          renderContent: () => (
            <div className="space-y-4">
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

              <div className="p-3.5 bg-amber-50/80 rounded-xl border border-amber-200/90 flex items-start gap-3 text-xs text-[#7A5B10]">
                <Sparkles className="w-4 h-4 text-[#8C6B18] shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong>🎯 Trọng tâm trình bày theo chỉ đạo Nhóm trưởng:</strong> Tập trung vào 2 phần nội dung cốt lõi: 
                  (1) <em>Nội dung cơ bản &amp; Vai trò quan trọng</em> của Thỏa thuận mở Ví; 
                  (2) <em>Ý tưởng/giải pháp bảo vệ quyền và lợi ích hợp pháp của TVPAY</em> trước các vụ tranh chấp, lỗi ngân hàng và khiếu nại quá hạn.
                </div>
              </div>
            </div>
          ),
        },

        // SLIDE 2: CẤU TRÚC 18 ĐIỀU KHOẢN (CHỈ NÊU TÊN THEO CHỈ ĐẠO NHÓM TRƯỞNG)
        {
          id: 'slide-2',
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

        // SLIDE 3: MỤC 1 - NỘI DUNG & VAI TRÒ THỎA THUẬN VÍ
        {
          id: 'slide-3',
          badge: 'SLIDE 03 / 05 · NỘI DUNG & VAI TRÒ',
          category: 'MỤC 1 THEO YÊU CẦU NHÓM TRƯỞNG',
          title: 'NỘI DUNG CƠ BẢN & VAI TRÒ QUAN TRỌNG CỦA THỎA THUẬN VÍ',
          subtitle: 'Hành lang pháp lý đảm bảo an toàn giao dịch số và tuân thủ chuẩn thanh toán quốc gia',
          renderContent: () => (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
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

        // SLIDE 4: MỤC 2 - GIẢI PHÁP BẢO VỆ TVPAY KHI MỞ VÍ
        {
          id: 'slide-4',
          badge: 'SLIDE 04 / 05 · LÁ CHẮN BẢO VỆ DN',
          category: 'MỤC 2 THEO YÊU CẦU NHÓM TRƯỞNG',
          title: 'Ý TƯỞNG & GIẢI PHÁP PHÁP LÝ BẢO VỆ QUYỀN LỢI TVPAY KHI MỞ VÍ',
          subtitle: '4 Đối sách pháp lý giải quyết triệt để rủi ro bồi thường, lỗi ngân hàng và khiếu nại gian lận',
          renderContent: () => (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
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

        // SLIDE 5: KẾT LUẬN THỎA THUẬN VÍ
        {
          id: 'slide-5',
          badge: 'SLIDE 05 / 05 · TỔNG KẾT & AN TOÀN',
          category: 'KẾT LUẬN HỒ SƠ PHÁP LÝ NHÓM 13',
          title: 'ĐÁNH GIÁ TỔNG QUAN VỀ THỎA THUẬN MỞ & SỬ DỤNG VÍ TVPAY',
          subtitle: 'Cân bằng hoàn hảo giữa trải nghiệm người dùng mượt mà và lá chắn bảo vệ TVPAY',
          renderContent: () => (
            <div className="space-y-3.5">
              <div className="p-4 bg-white rounded-xl border border-amber-300/90 shadow-xs">
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#8C6B18]" />
                  <span>Cán cân pháp lý: Trải nghiệm khách hàng &amp; An toàn Doanh nghiệp</span>
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed m-0">
                  Thỏa thuận mở ví điện tử TVPAY được xây dựng chuẩn mực trên nền tảng pháp lý của Nghị định 52/2024/NĐ-CP và Luật Bảo vệ quyền lợi người tiêu dùng 2023. Văn bản vừa đảm bảo tính minh bạch, thân thiện để người dùng yên tâm thanh toán, vừa dựng nên hệ thống phòng vệ 4 lớp bảo vệ TVPAY trước rủi ro khiếu nại ác ý và gian lận công nghệ cao.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-200/80">
                  <span className="text-[10px] font-bold uppercase text-emerald-800 block mb-1">
                    🛡️ Tự động hóa phòng ngừa:
                  </span>
                  <h5 className="text-xs font-bold text-slate-900 m-0 mb-1">Ký kết số bằng mã OTP xác thực</h5>
                  <p className="text-[11.5px] text-slate-600 m-0 leading-relaxed">
                    Lưu trữ nhật ký điện tử (Log trail) có dấu thời gian làm chứng cứ không thể chối cãi khi xảy ra tranh chấp tra soát.
                  </p>
                </div>

                <div className="p-3.5 bg-amber-50/70 rounded-xl border border-amber-200/80">
                  <span className="text-[10px] font-bold uppercase text-[#8C6B18] block mb-1">
                    ⚖️ Cam kết tuân thủ:
                  </span>
                  <h5 className="text-xs font-bold text-slate-900 m-0 mb-1">Cơ chế giám sát của NHNN</h5>
                  <p className="text-[11.5px] text-slate-600 m-0 leading-relaxed">
                    Sẵn sàng kết nối cơ sở dữ liệu quốc gia về dân cư để ngăn ngừa tình trạng tài khoản ví rác và lừa đảo xuyên biên giới.
                  </p>
                </div>
              </div>
            </div>
          ),
        },
      ];

  const totalSlides = slides.length;

  const nextSlide = useCallback(() => {
    try {
      uiSound.playClick();
    } catch {}
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    try {
      uiSound.playClick();
    } catch {}
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const goToSlide = (idx: number) => {
    try {
      uiSound.playClick();
    } catch {}
    setCurrentSlide(idx);
  };

  // Auto-play timer
  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 8000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, totalSlides]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      } else if (e.key.toLowerCase() === 'f' && !e.metaKey && !e.ctrlKey) {
        // Toggle fullscreen
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
          ? 'fixed inset-0 z-50 p-4 sm:p-8 bg-[#FAF6EE] flex flex-col justify-center overflow-y-auto'
          : 'w-full my-10'
      } ${className}`}
    >
      {/* Container Frame with Royal White & Gold palette */}
      <div className="relative bg-gradient-to-br from-[#FFFDF9] via-[#FAF5EA] to-[#F5ECDA] rounded-2xl border-2 border-amber-300/80 shadow-[0_12px_36px_rgba(197,155,39,0.14)] overflow-hidden transition-all duration-300">
        {/* Top Progress Gold Bar */}
        <div className="w-full h-1.5 bg-amber-200/50">
          <div
            className="h-full bg-gradient-to-r from-[#D4AF37] via-[#C59B27] to-[#8C6B18] transition-all duration-500"
            style={{ width: `${((currentSlide + 1) / totalSlides) * 100}%` }}
          />
        </div>

        {/* Header Toolbar */}
        <div className="px-5 py-3.5 sm:px-7 sm:py-4 bg-white/80 border-b border-amber-200/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="p-2 rounded-xl bg-amber-100/90 border border-amber-300/80 text-[#8C6B18] shrink-0 shadow-xs">
              <FileCheck2 className="w-4 h-4" />
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#8C6B18] font-mono bg-amber-100/90 border border-amber-300/80 px-2 py-0.5 rounded">
                  SLIDE BÁO CÁO THUYẾT TRÌNH · NHÓM 13
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
              className="p-1.5 bg-white hover:bg-amber-50 text-slate-700 border border-amber-200 rounded-lg transition cursor-pointer shadow-xs flex items-center gap-1"
              title={isFullscreen ? 'Thoát toàn màn hình (Esc)' : 'Mở toàn màn hình để thuyết trình (F)'}
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              <span className="hidden md:inline text-[11px] font-semibold">
                {isFullscreen ? 'Thu nhỏ' : 'Toàn màn hình'}
              </span>
            </button>
          </div>
        </div>

        {/* Slide Main Body Presentation Area */}
        <div className="p-5 sm:p-8 min-h-[360px] sm:min-h-[420px] flex flex-col justify-between relative">
          <div>
            {/* Slide Category Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-4 border-b border-amber-200/60">
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
            <p className="text-xs sm:text-[13px] text-slate-600 font-medium leading-relaxed mb-5">
              {activeSlide.subtitle}
            </p>

            {/* Dynamic Slide Content */}
            <div className="tvpay-slide-content animate-in fade-in duration-300">
              {activeSlide.renderContent(docData)}
            </div>
          </div>

          {/* Bottom Interactive Navigation & Thumbnails */}
          <div className="mt-8 pt-4 border-t border-amber-200/80 flex flex-wrap items-center justify-between gap-4">
            {/* Prev Button */}
            <button
              type="button"
              onClick={prevSlide}
              className="px-3.5 py-2 text-xs font-bold bg-white hover:bg-amber-50 text-[#7A5B10] border border-amber-300 rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-xs hover:border-amber-400"
            >
              <ChevronLeft className="w-4 h-4 text-[#C59B27]" />
              <span>Trang trước</span>
            </button>

            {/* Step Indicators / Dot Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-1">
              {slides.map((s, idx) => {
                const isActive = idx === currentSlide;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => goToSlide(idx)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer ${
                      isActive
                        ? 'bg-[#C59B27] text-white shadow-sm font-bold border border-amber-500'
                        : 'bg-white/80 text-slate-600 hover:text-slate-900 border border-amber-200/60 hover:bg-white'
                    }`}
                  >
                    <span className="font-mono text-[10px] opacity-80">0{idx + 1}</span>
                    <span className="hidden md:inline text-[11px] truncate max-w-[120px]">
                      {idx === 0
                        ? 'Tổng quan'
                        : idx === 1
                        ? 'Mục lục'
                        : idx === 2
                        ? 'Nội dung & Vai trò'
                        : idx === 3
                        ? 'Giải pháp bảo vệ'
                        : 'Kết luận'}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Next Button */}
            <button
              type="button"
              onClick={nextSlide}
              className="px-4 py-2 text-xs font-bold bg-gradient-to-r from-[#D4AF37] via-[#C59B27] to-[#A87B15] hover:brightness-105 text-white border border-amber-300 rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-md"
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
