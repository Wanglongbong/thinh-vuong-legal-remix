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

  // =========================================================================
  // 10 SLIDES CHUYÊN SÂU THEO FILE "PHẦN NỘI DUNG KHÁC" (GOOGLE DOC CHÍNH THỨC)
  // Phân công: Lê Phương Thảo, Vũ Thảo, Dạ Thảo, Nhung, Thu, AP
  // =========================================================================
  const charterSlides: SlideItem[] = [
    // SLIDE 1: BÌA BÁO CÁO & PHÂN CÔNG THUYẾT TRÌNH NHÓM 13
    {
      id: 'slide-1',
      badge: 'SLIDE 01 / 10 · BÌA & PHÂN CÔNG',
      category: 'HỒ SƠ BÁO CÁO PHÁP LÝ NHÓM 13 · KHOA LUẬT HVNH',
      title: 'ĐIỀU LỆ CÔNG TY CỔ PHẦN THANH TOÁN THỊNH VƯỢNG (TVPAY)',
      subtitle: 'Hồ sơ pháp lý nền tảng xác lập tư cách pháp nhân và điều kiện cấp phép trung gian thanh toán',
      renderContent: () => (
        <div className="space-y-3.5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3.5 bg-white/95 rounded-xl border border-amber-300/80 shadow-2xs">
              <div className="flex items-center gap-2 mb-1.5 text-[#8C6B18]">
                <Landmark className="w-4 h-4" />
                <span className="text-[11px] font-bold uppercase tracking-wider">Pháp nhân &amp; Trụ sở</span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 m-0 mb-1">CÔNG TY CỔ PHẦN TVPAY</h4>
              <p className="text-[11.5px] text-slate-600 leading-relaxed m-0">
                Số 89 Láng Hạ, Phường Đống Đa, Hà Nội. Thời hạn hoạt động: 40 năm. Người đại diện theo pháp luật: Tổng Giám đốc Lê Quang Tùng.
              </p>
            </div>

            <div className="p-3.5 bg-white/95 rounded-xl border border-amber-300/80 shadow-2xs">
              <div className="flex items-center gap-2 mb-1.5 text-[#8C6B18]">
                <Award className="w-4 h-4" />
                <span className="text-[11px] font-bold uppercase tracking-wider">Vốn điều lệ &amp; Cổ phần</span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 m-0 mb-1">50.000.000.000 VNĐ (50 Tỷ)</h4>
              <p className="text-[11.5px] text-slate-600 leading-relaxed m-0">
                500.000 cổ phần phổ thông (100.000 đ/CP). Gồm 05 cổ đông sáng lập: Lê Quang Tùng (40%), Trịnh Hoàng Sơn (20%), Nguyễn Minh Lân (16%), Phạm Phương Hà (14%), Lê Thu Minh (10%).
              </p>
            </div>

            <div className="p-3.5 bg-white/95 rounded-xl border border-amber-300/80 shadow-2xs">
              <div className="flex items-center gap-2 mb-1.5 text-[#8C6B18]">
                <Scale className="w-4 h-4" />
                <span className="text-[11px] font-bold uppercase tracking-wider">Căn cứ pháp lý then chốt</span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 m-0 mb-1">Luật DN 2020 &amp; NĐ 52/2024</h4>
              <p className="text-[11.5px] text-slate-600 leading-relaxed m-0">
                Tuân thủ Luật Doanh nghiệp 2020 (sửa đổi bổ sung 2025), Nghị định 52/2024/NĐ-CP và Thông tư 40/2024/TT-NHNN về trung gian thanh toán.
              </p>
            </div>
          </div>

          <div className="p-3.5 bg-gradient-to-r from-amber-100/70 via-amber-50 to-amber-100/70 rounded-xl border border-amber-300/80">
            <div className="flex items-center gap-2 mb-2 text-[#7A5B10] font-bold text-xs uppercase tracking-wide">
              <Users className="w-4 h-4 text-[#8C6B18]" />
              <span>Phân công nhiệm vụ thuyết trình chính thức của Nhóm 13:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div className="p-2 bg-white rounded-lg border border-amber-200 shadow-2xs">
                <strong className="text-[#8C6B18] block text-[11px] uppercase">Phần 1: Nội dung &amp; Vai trò</strong>
                <span className="text-slate-800 font-semibold">Lê Phương Thảo</span>
                <span className="text-[10px] text-slate-500 block">Trình bày Slide 02 &amp; 03</span>
              </div>
              <div className="p-2 bg-white rounded-lg border border-emerald-200 shadow-2xs">
                <strong className="text-emerald-800 block text-[11px] uppercase">Phần 2: Giải pháp bảo vệ DN</strong>
                <span className="text-slate-800 font-semibold">Vũ Thảo + Dạ Thảo</span>
                <span className="text-[10px] text-slate-500 block">Trình bày Slide 05, 06 &amp; 07</span>
              </div>
              <div className="p-2 bg-white rounded-lg border border-blue-200 shadow-2xs">
                <strong className="text-blue-800 block text-[11px] uppercase">Phần 3: Rủi ro &amp; Xử lý (Q&amp;A)</strong>
                <span className="text-slate-800 font-semibold">Nhung + Thu + AP (hỗ trợ)</span>
                <span className="text-[10px] text-slate-500 block">Trình bày Slide 08, 09 &amp; 10</span>
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
      title: 'BẢN CHẤT PHÁP LÝ & 4 NGUYÊN TẮC VÀNG KHI XÂY DỰNG ĐIỀU LỆ',
      subtitle: 'Căn cứ Khoản 2 Điều 22 và Khoản 2 Điều 24 Luật Doanh nghiệp 2020 (sửa đổi bổ sung 2025)',
      renderContent: () => (
        <div className="space-y-3">
          <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200/90 text-xs text-[#7A5B10]">
            <strong>📖 Bản chất pháp lý:</strong> Điều lệ là tài liệu bắt buộc trong hồ sơ đăng ký kinh doanh của Công ty cổ phần (Khoản 2 Điều 22 Luật DN). Đây là văn bản quy phạm nội bộ cao nhất, được các cổ đông sáng lập thỏa thuận bình đẳng và nhất trí thông qua.
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 bg-white rounded-xl border border-amber-200/80 shadow-2xs">
              <div className="flex items-center gap-1.5 font-bold text-[#8C6B18] mb-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Nguyên tắc 1: Không trái luật, không xâm phạm bên thứ ba</span>
              </div>
              <p className="text-[11.5px] text-slate-600 m-0 leading-relaxed">
                Xây dựng nghiêm ngặt trong khuôn khổ Luật Doanh nghiệp, Luật Thuế, Luật Kế toán và Bộ luật Lao động. Tuyệt đối không xâm hại quyền lợi của đối tác và khách hàng ví điện tử.
              </p>
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-amber-200/80 shadow-2xs">
              <div className="flex items-center gap-1.5 font-bold text-[#8C6B18] mb-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Nguyên tắc 2: Đảm bảo đầy đủ nội dung bắt buộc</span>
              </div>
              <p className="text-[11.5px] text-slate-600 m-0 leading-relaxed">
                Đầy đủ các thông tin cốt lõi theo Khoản 2 Điều 24: tên, trụ sở, ngành nghề, vốn điều lệ, loại cổ phần, tỷ lệ sở hữu của 05 cổ đông sáng lập, quyền và nghĩa vụ cổ đông.
              </p>
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-amber-200/80 shadow-2xs">
              <div className="flex items-center gap-1.5 font-bold text-[#8C6B18] mb-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Nguyên tắc 3: Tự nguyện và tự do thỏa thuận hợp pháp</span>
              </div>
              <p className="text-[11.5px] text-slate-600 m-0 leading-relaxed">
                Mọi quy định quản trị và phân chia quyền lực đều xuất phát từ sự thảo luận dân chủ, đồng thuận và bảo vệ sự công bằng giữa các nhóm cổ đông lớn và nhỏ.
              </p>
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-amber-200/80 shadow-2xs">
              <div className="flex items-center gap-1.5 font-bold text-[#8C6B18] mb-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Nguyên tắc 4: Đồng thuận &amp; Chữ ký 100% cổ đông sáng lập</span>
              </div>
              <p className="text-[11.5px] text-slate-600 m-0 leading-relaxed">
                Bắt buộc phải có chữ ký của đầy đủ 05 cổ đông sáng lập và Người đại diện theo pháp luật. Là cam kết pháp lý ràng buộc vô điều kiện trong suốt quá trình hoạt động.
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
      title: '5 VAI TRÒ NỀN TẢNG CỦA ĐIỀU LỆ ĐỐI VỚI VẬN HÀNH DOANH NGHIỆP',
      subtitle: 'Điều lệ không chỉ là thủ tục thành lập mà là công cụ pháp lý sống còn xuyên suốt vòng đời TVPAY',
      renderContent: () => (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 bg-white rounded-xl border border-amber-200/80 shadow-2xs">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-100 text-[#7A5B10] block w-fit mb-1.5">
              Vai trò 01
            </span>
            <h4 className="text-xs font-bold text-slate-900 m-0 mb-1">Quy định cách thức hoạt động</h4>
            <p className="text-[11.5px] text-slate-600 m-0 leading-relaxed">
              Cung cấp quy chế về mục đích, phạm vi kinh doanh, phân định quyền hạn các bộ phận, giúp công ty hoạt động có hệ thống.
            </p>
          </div>

          <div className="p-3.5 bg-white rounded-xl border border-amber-200/80 shadow-2xs">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-100 text-[#7A5B10] block w-fit mb-1.5">
              Vai trò 02
            </span>
            <h4 className="text-xs font-bold text-slate-900 m-0 mb-1">Tài liệu pháp lý chính thức</h4>
            <p className="text-[11.5px] text-slate-600 m-0 leading-relaxed">
              Được pháp luật và cơ quan nhà nước (NHNN, Sở KH&amp;ĐT) công nhận, làm căn cứ thẩm định tính hợp pháp của mọi giao dịch.
            </p>
          </div>

          <div className="p-3.5 bg-white rounded-xl border border-amber-200/80 shadow-2xs">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-100 text-[#7A5B10] block w-fit mb-1.5">
              Vai trò 03
            </span>
            <h4 className="text-xs font-bold text-slate-900 m-0 mb-1">Cơ sở giải quyết tranh chấp</h4>
            <p className="text-[11.5px] text-slate-600 m-0 leading-relaxed">
              Căn cứ pháp lý đầu tiên và quan trọng nhất để các cơ quan tài phán giải quyết bất đồng nội bộ một cách công bằng, minh bạch.
            </p>
          </div>

          <div className="p-3.5 bg-white rounded-xl border border-amber-200/80 shadow-2xs">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-100 text-[#7A5B10] block w-fit mb-1.5">
              Vai trò 04
            </span>
            <h4 className="text-xs font-bold text-slate-900 m-0 mb-1">Tạo động lực &amp; Giá trị cốt lõi</h4>
            <p className="text-[11.5px] text-slate-600 m-0 leading-relaxed">
              Nền tảng thể hiện mục tiêu, tôn chỉ và văn hóa công ty, giúp thành viên và nhân sự hiểu rõ trách nhiệm và định hướng phát triển.
            </p>
          </div>

          <div className="p-3.5 bg-white rounded-xl border border-amber-200/80 shadow-2xs sm:col-span-2 md:col-span-2">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-100 text-[#7A5B10] block w-fit mb-1.5">
              Vai trò 05 · Trọng tâm quản trị
            </span>
            <h4 className="text-xs font-bold text-slate-900 m-0 mb-1">Hỗ trợ quản lý và điều hành minh bạch</h4>
            <p className="text-[11.5px] text-slate-600 m-0 leading-relaxed">
              Thiết lập quy trình ra quyết định rõ ràng, chuẩn hóa cơ chế phê duyệt các khoản chi tiêu lớn và đầu tư công nghệ, ngăn ngừa lạm quyền và củng cố uy tín với các đối tác ngân hàng.
            </p>
          </div>
        </div>
      ),
    },

    // SLIDE 4: CẤU TRÚC 9 CHƯƠNG TOÀN VĂN (CHỈ GHI TÊN THEO CHỈ ĐẠO NHÓM TRƯỞNG)
    {
      id: 'slide-4',
      badge: 'SLIDE 04 / 10 · MỤC LỤC 9 CHƯƠNG',
      category: 'CẤU TRÚC TOÀN VĂN ĐIỀU LỆ (CHỈ GHI TÊN CÁC CHƯƠNG)',
      title: 'HỆ THỐNG DANH MỤC 09 CHƯƠNG ĐIỀU LỆ TVPAY',
      subtitle: 'Tuân thủ đúng chỉ đạo của nhóm trưởng: Chỉ ghi tên các chương, súc tích và dễ nhớ',
      renderContent: () => (
        <div className="space-y-3">
          <div className="p-2.5 bg-amber-50/70 border border-amber-200/80 rounded-lg text-xs text-[#7A5B10] flex items-center justify-between">
            <span>📋 Danh mục chuẩn 09 Chương theo văn bản Điều lệ chính thức của TVPAY:</span>
            <span className="font-mono font-bold text-[11px] bg-white px-2 py-0.5 rounded border border-amber-300">Tổng cộng 86 Điều</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {[
              { num: 'Chương I', name: 'Quy định chung', sub: 'Tên, trụ sở, tư cách pháp nhân, mục tiêu & phạm vi hoạt động' },
              { num: 'Chương II', name: 'Vốn điều lệ, cổ đông sáng lập, quyền và nghĩa vụ cổ đông sáng lập', sub: 'Quy mô vốn 50 tỷ VNĐ, các loại cổ phần và thời hạn góp vốn' },
              { num: 'Chương III', name: 'Quyền và nghĩa vụ của Cổ đông', sub: 'Quyền tiếp cận thông tin, quyền biểu quyết, nhận cổ tức' },
              { num: 'Chương IV', name: 'Cơ cấu tổ chức quản lý', sub: 'Đại hội đồng cổ đông, Hội đồng quản trị, Ban Kiểm soát, Tổng Giám đốc' },
              { num: 'Chương V', name: 'Người đại diện theo pháp luật & Quản lý', sub: 'Tiêu chuẩn, thẩm quyền, trách nhiệm và thù lao người quản lý' },
              { num: 'Chương VI', name: 'Năm tài chính, Kế toán & Phân phối lợi nhuận', sub: 'Chế độ kế toán, trích lập quỹ dự phòng rủi ro và chia cổ tức' },
              { num: 'Chương VII', name: 'Giải quyết tranh chấp nội bộ', sub: 'Hòa giải nội bộ, Trọng tài thương mại và Tòa án có thẩm quyền' },
              { num: 'Chương VIII', name: 'Tổ chức lại, Giải thể và Phá sản', sub: 'Thủ tục sáp nhập, hợp nhất, chia tách, giải thể theo luật định' },
              { num: 'Chương IX', name: 'Điều khoản thi hành & Hiệu lực', sub: 'Quy trình sửa đổi bổ sung và chữ ký các cổ đông sáng lập' },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-3 bg-white rounded-xl border border-amber-200/70 shadow-2xs hover:border-amber-400 transition"
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

    // SLIDE 5: GIẢI PHÁP 1 & 2: BẢO VỆ CỔ ĐÔNG & PHÂN ĐỊNH THẨM QUYỀN
    {
      id: 'slide-5',
      badge: 'SLIDE 05 / 10 · GIẢI PHÁP PHÒNG VỆ (1 & 2)',
      category: 'PHẦN 2 · VŨ THẢO + DẠ THẢO PHỤ TRÁCH',
      title: 'BẢO VỆ QUYỀN LỢI CỔ ĐÔNG & PHÂN ĐỊNH RÀNH MẠCH QUYỀN LỰC QUẢN TRỊ',
      subtitle: 'Giải pháp phòng vệ nhằm hạn chế biến động cổ đông đột ngột và ngăn ngừa lạm quyền nội bộ',
      renderContent: () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
          <div className="p-4 bg-white rounded-xl border border-emerald-300/90 shadow-2xs">
            <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-emerald-100">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300">
                Giải pháp 01 · Ổn định cơ cấu sở hữu
              </span>
              <span className="font-mono text-[11px] text-emerald-800 font-bold">Điều 6, 7</span>
            </div>
            <h4 className="text-xs font-bold text-slate-900 m-0 mb-2">
              Bảo vệ quyền lợi cổ đông &amp; Sự ổn định của doanh nghiệp
            </h4>
            <ul className="text-slate-600 space-y-1.5 pl-4 list-disc m-0 leading-relaxed text-[11.5px]">
              <li>Quy định rõ ràng quyền biểu quyết, quyền tiếp cận thông tin tài chính và quyền hưởng cổ tức của từng cổ đông.</li>
              <li>Thiết lập cơ chế thông báo nội bộ và quyền ưu tiên mua cổ phần của cổ đông hiện hữu khi có phát hành mới.</li>
              <li>Giới hạn chuyển nhượng cổ phần ra bên ngoài trong giai đoạn đầu, hạn chế nguy cơ thâu tóm thù địch và thay đổi cơ cấu sở hữu đột ngột.</li>
            </ul>
            <div className="mt-3 p-2 bg-emerald-50/70 rounded-lg text-[11px] text-emerald-900">
              <strong>Mục tiêu:</strong> Tạo sự ổn định tuyệt đối trong quản trị và định hướng phát triển dài hạn của TVPAY.
            </div>
          </div>

          <div className="p-4 bg-white rounded-xl border border-emerald-300/90 shadow-2xs">
            <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-emerald-100">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300">
                Giải pháp 02 · Đối trọng quyền lực
              </span>
              <span className="font-mono text-[11px] text-emerald-800 font-bold">Điều 15-55</span>
            </div>
            <h4 className="text-xs font-bold text-slate-900 m-0 mb-2">
              Phân định rõ thẩm quyền và trách nhiệm trong cơ cấu quản trị
            </h4>
            <ul className="text-slate-600 space-y-1.5 pl-4 list-disc m-0 leading-relaxed text-[11.5px]">
              <li>Xóa bỏ triệt để tình trạng chồng chéo giữa ĐHĐCĐ (quyết sách chiến lược), HĐQT (giám sát đầu tư) và Tổng Giám đốc (điều hành tài khoản ví).</li>
              <li>Thiết lập quy trình xem xét, thẩm định và tỷ lệ biểu quyết khắt khe đối với các quyết định định đoạt tài sản lớn.</li>
              <li>Ràng buộc trách nhiệm bồi thường tài sản cá nhân của người quản lý nếu ra quyết định vượt thẩm quyền gây tổn thất cho công ty.</li>
            </ul>
            <div className="mt-3 p-2 bg-emerald-50/70 rounded-lg text-[11px] text-emerald-900">
              <strong>Mục tiêu:</strong> Ngăn chặn lạm quyền và có căn cứ pháp lý rõ ràng để truy cứu trách nhiệm khi có sai phạm.
            </div>
          </div>
        </div>
      ),
    },

    // SLIDE 6: GIẢI PHÁP 3 & 4: BỘ ĐỆM TÀI CHÍNH 50 TỶ & XUNG ĐỘT LỢI ÍCH (ARM'S LENGTH)
    {
      id: 'slide-6',
      badge: 'SLIDE 06 / 10 · GIẢI PHÁP PHÒNG VỆ (3 & 4)',
      category: 'PHẦN 2 · VŨ THẢO + DẠ THẢO PHỤ TRÁCH',
      title: 'QUẢN LÝ TÀI CHÍNH DUY TRÌ VỐN 50 TỶ & KIỂM SOÁT XUNG ĐỘT LỢI ÍCH',
      subtitle: 'Đáp ứng điều kiện cấp phép khắt khe của NHNN và chống thất thoát tài sản qua các giao dịch thân hữu',
      renderContent: () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
          <div className="p-4 bg-white rounded-xl border border-emerald-300/90 shadow-2xs">
            <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-emerald-100">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300">
                Giải pháp 03 · Bộ đệm an toàn vốn
              </span>
              <span className="font-mono text-[11px] text-emerald-800 font-bold">Điều 69, 71</span>
            </div>
            <h4 className="text-xs font-bold text-slate-900 m-0 mb-2">
              Quản lý tài chính &amp; Trích lập các quỹ dự phòng rủi ro đặc thù
            </h4>
            <ul className="text-slate-600 space-y-1.5 pl-4 list-disc m-0 leading-relaxed text-[11.5px]">
              <li>Duy trì vốn điều lệ thực góp không thấp hơn 50 tỷ đồng theo yêu cầu cấp phép trung gian thanh toán của NHNN.</li>
              <li>Bắt buộc trích lập Quỹ dự phòng rủi ro tài chính, Quỹ an toàn hệ thống và Quỹ phát triển công nghệ trước khi chia cổ tức.</li>
              <li>Cơ chế kiểm toán độc lập định kỳ bảo đảm minh bạch số dư tiền gửi đảm bảo thanh toán tại ngân hàng liên kết.</li>
            </ul>
            <div className="mt-3 p-2 bg-emerald-50/70 rounded-lg text-[11px] text-emerald-900">
              <strong>Mục tiêu:</strong> Tạo "bộ đệm" tài chính sẵn sàng hấp thụ rủi ro sự cố giao dịch và duy trì hiệu lực Giấy phép NHNN.
            </div>
          </div>

          <div className="p-4 bg-white rounded-xl border border-emerald-300/90 shadow-2xs">
            <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-emerald-100">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300">
                Giải pháp 04 · Chống rút ruột vốn
              </span>
              <span className="font-mono text-[11px] text-emerald-800 font-bold">Điều 62</span>
            </div>
            <h4 className="text-xs font-bold text-slate-900 m-0 mb-2">
              Kiểm soát xung đột lợi ích &amp; Giao dịch với người có liên quan
            </h4>
            <ul className="text-slate-600 space-y-1.5 pl-4 list-disc m-0 leading-relaxed text-[11.5px]">
              <li>Nghĩa vụ công khai, minh bạch toàn bộ các mối quan hệ sở hữu và lợi ích của thành viên HĐQT, Ban Giám đốc và người thân.</li>
              <li>Áp dụng nguyên tắc thị trường (Arm's length): Mọi hợp đồng giao dịch nội bộ phải được HĐQT hoặc ĐHĐCĐ chấp thuận độc lập.</li>
              <li>Cổ đông hoặc thành viên HĐQT có lợi ích liên quan bị tước quyền biểu quyết đối với giao dịch đó.</li>
            </ul>
            <div className="mt-3 p-2 bg-emerald-50/70 rounded-lg text-[11px] text-emerald-900">
              <strong>Mục tiêu:</strong> Triệt tiêu nguy cơ chuyển giá, thất thoát tài sản sang các công ty "sân sau" của người quản lý.
            </div>
          </div>
        </div>
      ),
    },

    // SLIDE 7: GIẢI PHÁP 5, 6 & 7: QUẢN TRỊ FINTECH, BẢN QUYỀN MÃ NGUỒN & ỨNG PHÓ KHỦNG HOẢNG
    {
      id: 'slide-7',
      badge: 'SLIDE 07 / 10 · GIẢI PHÁP PHÒNG VỆ (5, 6 & 7)',
      category: 'PHẦN 2 · VŨ THẢO + DẠ THẢO PHỤ TRÁCH',
      title: 'QUẢN TRỊ FINTECH, BẢO VỆ MÃ NGUỒN & ỨNG PHÓ AN NINH MẠNG',
      subtitle: 'Bộ ba giải pháp đặc thù bảo vệ công nghệ cốt lõi, bí mật kinh doanh và tính liên tục của Ví',
      renderContent: () => (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 bg-white rounded-xl border border-emerald-300/80 shadow-2xs">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 block w-fit mb-1.5">
              Giải pháp 05
            </span>
            <h4 className="text-xs font-bold text-slate-900 m-0 mb-1.5">Quản trị đặc thù Fintech</h4>
            <p className="text-[11.5px] text-slate-600 m-0 leading-relaxed mb-2">
              Xác lập nguyên tắc trách nhiệm người quản lý đối với bảo mật dữ liệu khách hàng, an toàn hạ tầng thanh toán điện tử theo Nghị định 13/2023/NĐ-CP.
            </p>
            <span className="text-[10.5px] text-emerald-800 font-semibold block">Tuân thủ pháp luật chuyên ngành</span>
          </div>

          <div className="p-3.5 bg-white rounded-xl border border-emerald-300/80 shadow-2xs">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 block w-fit mb-1.5">
              Giải pháp 06
            </span>
            <h4 className="text-xs font-bold text-slate-900 m-0 mb-1.5">Bảo vệ tài sản trí tuệ</h4>
            <p className="text-[11.5px] text-slate-600 m-0 leading-relaxed mb-2">
              Quy định rõ mã nguồn, thuật toán ví, kiến trúc hạ tầng và cơ sở dữ liệu do nhân sự sáng tạo đều thuộc sở hữu tuyệt đối của TVPAY. Ràng buộc cấm cạnh tranh sau khi nghỉ việc.
            </p>
            <span className="text-[10.5px] text-emerald-800 font-semibold block">Chống chảy máu công nghệ</span>
          </div>

          <div className="p-3.5 bg-white rounded-xl border border-emerald-300/80 shadow-2xs">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 block w-fit mb-1.5">
              Giải pháp 07
            </span>
            <h4 className="text-xs font-bold text-slate-900 m-0 mb-1.5">Ứng phó khủng hoảng mạng</h4>
            <p className="text-[11.5px] text-slate-600 m-0 leading-relaxed mb-2">
              Cơ chế họp khẩn cấp, biểu quyết từ xa và ủy quyền đặc biệt cho TGĐ tạm ngưng giao dịch khi xảy ra tấn công mạng hoặc nghẽn mạch thanh khoản ngân hàng liên kết.
            </p>
            <span className="text-[10.5px] text-emerald-800 font-semibold block">Hành động nhanh, hợp pháp</span>
          </div>
        </div>
      ),
    },

    // SLIDE 8: MA TRẬN RỦI RO PHÁP LÝ THỰC TIỄN (PHẦN 1: HỢP PHÁP, THẨM QUYỀN & HỌP)
    {
      id: 'slide-8',
      badge: 'SLIDE 08 / 10 · RỦI RO & XỬ LÝ (PHẦN 1)',
      category: 'PHẦN 3 · NHUNG + THU + AP PHỤ TRÁCH',
      title: 'MA TRẬN RỦI RO PHÁP LÝ: TÍNH HỢP PHÁP, THẨM QUYỀN & THỂ THỨC HỌP',
      subtitle: 'Đối chiếu rủi ro thực tế, hậu quả pháp lý phát sinh và phương án kiểm soát tuân thủ',
      renderContent: () => (
        <div className="overflow-x-auto rounded-xl border border-amber-200/80 shadow-2xs">
          <table className="min-w-full text-xs text-left divide-y divide-amber-200/60">
            <thead className="bg-amber-100/70 font-serif font-bold text-slate-900">
              <tr>
                <th className="px-3 py-2 border-r border-amber-200/50">STT</th>
                <th className="px-3 py-2 border-r border-amber-200/50 w-1/4">Rủi ro pháp lý</th>
                <th className="px-3 py-2 border-r border-amber-200/50 w-1/3">Hậu quả có thể xảy ra</th>
                <th className="px-3 py-2">Cách xử lý chuẩn xác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-100 bg-white text-[11.5px] text-slate-700">
              <tr className="hover:bg-amber-50/40">
                <td className="px-3 py-2 font-bold font-mono text-[#8C6B18] border-r border-amber-100">01</td>
                <td className="px-3 py-2 font-semibold text-slate-900 border-r border-amber-100">Điều lệ chứa nội dung trái luật hoặc không rõ ràng</td>
                <td className="px-3 py-2 border-r border-amber-100">Tranh chấp quyền cổ đông, quyết định nội bộ có nguy cơ bị Tòa án tuyên vô hiệu.</td>
                <td className="px-3 py-2 text-[#7A5B10] font-medium">Rà soát toàn bộ Điều lệ, đối chiếu Luật Doanh nghiệp 2020 và các quy chuẩn chuyên ngành thanh toán.</td>
              </tr>
              <tr className="bg-amber-50/20 hover:bg-amber-50/40">
                <td className="px-3 py-2 font-bold font-mono text-[#8C6B18] border-r border-amber-100">02</td>
                <td className="px-3 py-2 font-semibold text-slate-900 border-r border-amber-100">Không phân định rõ cơ cấu và thẩm quyền quản trị</td>
                <td className="px-3 py-2 border-r border-amber-100">Chồng chéo quyền hạn giữa ĐHĐCĐ, HĐQT và TGĐ; bế tắc khi ra quyết định kinh doanh.</td>
                <td className="px-3 py-2 text-[#7A5B10] font-medium">Quy định cụ thể chức năng, quyền hạn, phạm vi quyết định và tỷ lệ biểu quyết của từng chức danh.</td>
              </tr>
              <tr className="hover:bg-amber-50/40">
                <td className="px-3 py-2 font-bold font-mono text-[#8C6B18] border-r border-amber-100">03</td>
                <td className="px-3 py-2 font-semibold text-slate-900 border-r border-amber-100">Quy định người đại diện pháp luật không rõ ràng</td>
                <td className="px-3 py-2 border-r border-amber-100">Hợp đồng liên kết ngân hàng bị vô hiệu do người ký không đủ thẩm quyền đại diện.</td>
                <td className="px-3 py-2 text-[#7A5B10] font-medium">Quy định rõ TGĐ là người đại diện duy nhất, giới hạn hạn mức ký kết và cơ chế ủy quyền bằng văn bản.</td>
              </tr>
              <tr className="bg-amber-50/20 hover:bg-amber-50/40">
                <td className="px-3 py-2 font-bold font-mono text-[#8C6B18] border-r border-amber-100">04</td>
                <td className="px-3 py-2 font-semibold text-slate-900 border-r border-amber-100">Thể thức triệu tập họp và biểu quyết không chuẩn</td>
                <td className="px-3 py-2 border-r border-amber-100">Nghị quyết ĐHĐCĐ bị khiếu kiện yêu cầu hủy bỏ vì sai phạm trình tự triệu tập.</td>
                <td className="px-3 py-2 text-[#7A5B10] font-medium">Quy định chi tiết thời hạn gửi thông báo mời họp, điều kiện tiến hành họp và biên bản kiểm phiếu.</td>
              </tr>
            </tbody>
          </table>
        </div>
      ),
    },

    // SLIDE 9: MA TRẬN RỦI RO PHÁP LÝ THỰC TIỄN (PHẦN 2: CHUYỂN NHƯỢNG, VỐN & SỬA ĐỔI)
    {
      id: 'slide-9',
      badge: 'SLIDE 09 / 10 · RỦI RO & XỬ LÝ (PHẦN 2)',
      category: 'PHẦN 3 · NHUNG + THU + AP PHỤ TRÁCH',
      title: 'MA TRẬN RỦI RO PHÁP LÝ: CHUYỂN NHƯỢNG CỔ PHẦN, MỞ RỘNG VỐN & SỬA ĐỔI',
      subtitle: 'Đối sách phòng ngừa tranh chấp khi đón nhận nhà đầu tư mới và khi thay đổi pháp luật',
      renderContent: () => (
        <div className="overflow-x-auto rounded-xl border border-amber-200/80 shadow-2xs">
          <table className="min-w-full text-xs text-left divide-y divide-amber-200/60">
            <thead className="bg-amber-100/70 font-serif font-bold text-slate-900">
              <tr>
                <th className="px-3 py-2 border-r border-amber-200/50">STT</th>
                <th className="px-3 py-2 border-r border-amber-200/50 w-1/4">Rủi ro pháp lý</th>
                <th className="px-3 py-2 border-r border-amber-200/50 w-1/3">Hậu quả có thể xảy ra</th>
                <th className="px-3 py-2">Cách xử lý chuẩn xác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-100 bg-white text-[11.5px] text-slate-700">
              <tr className="hover:bg-amber-50/40">
                <td className="px-3 py-2 font-bold font-mono text-[#8C6B18] border-r border-amber-100">05</td>
                <td className="px-3 py-2 font-semibold text-slate-900 border-r border-amber-100">Chuyển nhượng cổ phần trong công ty khép kín</td>
                <td className="px-3 py-2 border-r border-amber-100">Xâm nhập của cổ đông ngoài ý muốn, tranh chấp về việc mua lại cổ phần ưu tiên.</td>
                <td className="px-3 py-2 text-[#7A5B10] font-medium">Quy định quy trình chào bán nội bộ trước 30 ngày, quyền ưu tiên mua của cổ đông sáng lập.</td>
              </tr>
              <tr className="bg-amber-50/20 hover:bg-amber-50/40">
                <td className="px-3 py-2 font-bold font-mono text-[#8C6B18] border-r border-amber-100">06</td>
                <td className="px-3 py-2 font-semibold text-slate-900 border-r border-amber-100">Điều lệ không dự liệu cơ chế mở rộng vốn &amp; Quỹ ngoại</td>
                <td className="px-3 py-2 border-r border-amber-100">Bị động khi gọi vốn đầu tư công nghệ, thủ tục sửa đổi Điều lệ phức tạp kéo dài.</td>
                <td className="px-3 py-2 text-[#7A5B10] font-medium">Quy định sẵn cơ chế chào bán cổ phần riêng lẻ, điều kiện tiếp cận thị trường của nhà đầu tư nước ngoài.</td>
              </tr>
              <tr className="hover:bg-amber-50/40">
                <td className="px-3 py-2 font-bold font-mono text-[#8C6B18] border-r border-amber-100">07</td>
                <td className="px-3 py-2 font-semibold text-slate-900 border-r border-amber-100">Sửa đổi Điều lệ &amp; Hiệu lực khi pháp luật thay đổi</td>
                <td className="px-3 py-2 border-r border-amber-100">Điều lệ mâu thuẫn với thông tư mới của NHNN, tranh chấp về hiệu lực văn bản sửa đổi.</td>
                <td className="px-3 py-2 text-[#7A5B10] font-medium">Bổ sung nguyên tắc định kỳ rà soát Điều lệ khi luật thay đổi, xác định rõ thẩm quyền ĐHĐCĐ thông qua.</td>
              </tr>
              <tr className="bg-amber-50/20 hover:bg-amber-50/40">
                <td className="px-3 py-2 font-bold font-mono text-[#8C6B18] border-r border-amber-100">08</td>
                <td className="px-3 py-2 font-semibold text-slate-900 border-r border-amber-100">Giải thể và thanh lý tài sản không rõ ràng</td>
                <td className="px-3 py-2 border-r border-amber-100">Tranh chấp thứ tự thanh toán công nợ và quyền lợi cổ đông khi chấm dứt hoạt động.</td>
                <td className="px-3 py-2 text-[#7A5B10] font-medium">Ghi nhận nguyên tắc thanh lý tài sản, ưu tiên nghĩa vụ hoàn trả số dư ví cho khách hàng trước cổ đông.</td>
              </tr>
            </tbody>
          </table>
        </div>
      ),
    },

    // SLIDE 10: KỊCH BẢN Q&A PHẢN BIỆN & TỔNG KẾT BÁO CÁO
    {
      id: 'slide-10',
      badge: 'SLIDE 10 / 10 · Q&A & TỔNG KẾT',
      category: 'TỔNG KẾT & THẢO LUẬN · NHÓM 13',
      title: 'KỊCH BẢN HỎI - ĐÁP PHẢN BIỆN (Q&A) & ĐỀ XUẤT NÂNG CẤP ĐIỀU LỆ SỐ HÓA',
      subtitle: 'Sẵn sàng giải đáp chất vấn từ giảng viên, đối tác và hội đồng chuyên môn Khoa Luật HVNH',
      renderContent: () => (
        <div className="space-y-3.5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 bg-white rounded-xl border border-blue-200 shadow-2xs">
              <div className="flex items-center gap-1.5 text-blue-900 font-bold mb-1">
                <HelpCircle className="w-4 h-4 text-blue-600" />
                <span>Câu hỏi chất vấn 01 (Thường gặp):</span>
              </div>
              <p className="font-semibold text-slate-800 mb-1.5 leading-snug">
                "Tại sao TVPAY lại bắt buộc phải duy trì quỹ dự phòng tài chính khắt khe hơn công ty cổ phần thông thường?"
              </p>
              <div className="p-2 bg-blue-50/60 rounded-lg text-blue-950 leading-relaxed text-[11px]">
                <strong>Trả lời:</strong> Vì TVPAY là tổ chức trung gian thanh toán, nắm giữ số dư ví điện tử của khách hàng. Bộ đệm tài chính này đảm bảo nguyên tắc bảo toàn thanh khoản 1:1, ngăn ngừa nguy cơ mất khả năng chi trả khi xảy ra sự cố nghẽn mạng ngân hàng đối tác.
              </div>
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-blue-200 shadow-2xs">
              <div className="flex items-center gap-1.5 text-blue-900 font-bold mb-1">
                <HelpCircle className="w-4 h-4 text-blue-600" />
                <span>Câu hỏi chất vấn 02 (Thường gặp):</span>
              </div>
              <p className="font-semibold text-slate-800 mb-1.5 leading-snug">
                "Cơ chế nào trong Điều lệ giúp bảo vệ quyền lợi của các cổ đông sáng lập trước nguy cơ bị pha loãng cổ phần?"
              </p>
              <div className="p-2 bg-blue-50/60 rounded-lg text-blue-950 leading-relaxed text-[11px]">
                <strong>Trả lời:</strong> Điều lệ trao quyền ưu tiên mua cổ phần chào bán mới tương ứng với tỷ lệ sở hữu hiện có (Điều 6), đồng thời quy định tỷ lệ biểu quyết tối thiểu 65% đối với các quyết định tăng vốn hoặc chuyển nhượng cổ phần cho nhà đầu tư ngoại.
              </div>
            </div>
          </div>

          <div className="p-3 bg-gradient-to-r from-amber-50 via-white to-amber-50 rounded-xl border border-amber-300/80 flex items-center justify-between gap-3 text-xs text-slate-700">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#8C6B18] shrink-0" />
              <span><strong>Đề xuất nâng cấp số hóa:</strong> Bổ sung quy chế biểu quyết ĐHĐCĐ bằng chữ ký số cá nhân và chứng thực hợp đồng điện tử theo Luật Giao dịch điện tử 2023.</span>
            </div>
            <span className="font-mono text-[10px] font-bold px-2 py-0.5 bg-amber-100 text-[#7A5B10] rounded border border-amber-300 shrink-0">
              KHOA LUẬT · HVNH
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
          : 'w-full my-8'
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
        <div className="px-5 py-3.5 sm:px-7 sm:py-4 bg-white/85 border-b border-amber-200/80 flex flex-wrap items-center justify-between gap-3">
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
        <div className="p-5 sm:p-7 min-h-[380px] sm:min-h-[440px] flex flex-col justify-between relative">
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

            {/* Dynamic Slide Content */}
            <div className="tvpay-slide-content animate-in fade-in duration-300">
              {activeSlide.renderContent(docData)}
            </div>
          </div>

          {/* Bottom Interactive Navigation & Thumbnails */}
          <div className="mt-6 pt-4 border-t border-amber-200/80 flex flex-wrap items-center justify-between gap-3">
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
