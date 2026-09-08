import { useState } from 'react';
import { Link } from '@/router';
import {
  ShieldAlert,
  CheckCircle2,
  FileText,
  AlertTriangle,
  ArrowRight,
  Landmark,
  Scale,
  Lock,
  Network,
  BookOpen,
  ArrowUpRight,
  ShieldCheck,
  Building2,
  Cpu,
} from 'lucide-react';

interface Pillar {
  id: string;
  number: string;
  badge: string;
  title: string;
  shortDesc: string;
  legalBasis: {
    statute: string;
    articles: string;
    keyPrinciple: string;
  };
  risksAndTraps: {
    trapTitle: string;
    trapDetail: string;
    penalty: string;
  };
  deepAnalysis: string[];
  deliverables: {
    title: string;
    description: string;
    contractLink?: string;
    contractTitle?: string;
  }[];
  practicalComparison: {
    flawedApproach: string;
    compliantApproach: string;
  };
}

export const deepPillars: Pillar[] = [
  {
    id: 'licensing-capital',
    number: 'TRỤ CỘT I',
    badge: 'Nghị định 52/2024 · Bắt buộc',
    title: 'Điều kiện Vốn & Cấp Giấy phép Trung gian Thanh toán',
    shortDesc: 'Thẩm định nguồn gốc 50 tỷ vốn thực góp, cấu trúc nhân sự chủ chốt và đề án kỹ thuật khả thi bảo vệ trước Ngân hàng Nhà nước.',
    legalBasis: {
      statute: 'Nghị định số 52/2024/NĐ-CP (Thanh toán không dùng tiền mặt)',
      articles: 'Điều 22 (Điều kiện cấp phép), Điều 24 (Hồ sơ đề nghị), Mẫu 01 Phụ lục',
      keyPrinciple: 'Vốn điều lệ thực góp tối thiểu 50 tỷ đồng phải được phong tỏa tại Ngân hàng thương mại, tuyệt đối không sử dụng vốn vay hoặc vốn ủy thác.',
    },
    risksAndTraps: {
      trapTitle: 'Bẫy góp vốn ảo & Hồ sơ nhân sự không đạt chuẩn',
      trapDetail: 'Nhiều doanh nghiệp tăng vốn điều lệ trên giấy nhưng không chứng minh được dòng tiền thực nộp vào tài khoản ngân hàng phong tỏa; Người đại diện pháp luật/Tổng giám đốc không đủ 03 năm kinh nghiệm trong ngành tài chính, ngân hàng, công nghệ thông tin.',
      penalty: 'Từ chối cấp phép vĩnh viễn, xử phạt hành chính từ 200 - 500 triệu đồng theo Nghị định 88/2019/NĐ-CP và công khai vi phạm trên cổng thông tin NHNN.',
    },
    deepAnalysis: [
      'Xác lập Báo cáo kiểm toán độc lập về vốn thực góp 50 tỷ đồng, kiểm tra chứng từ ủy nhiệm chi và xác nhận số dư tài khoản phong tỏa của Ngân hàng thương mại.',
      'Soạn thảo Đề án cung ứng dịch vụ trung gian thanh toán chi tiết: Mô hình kinh doanh 3 năm, thuyết minh quy trình nghiệp vụ nạp/rút/chuyển tiền ví, phương án quản trị rủi ro thanh khoản.',
      'Chuẩn hóa hồ sơ lý lịch tư pháp, bằng cấp đại học chuyên ngành và hợp đồng lao động của Tổng giám đốc, Giám đốc CNTT (CTO) và Trưởng ban Kiểm soát.',
      'Thiết lập Điều lệ công ty phù hợp với Luật Doanh nghiệp 2020 và các hạn chế đặc thù của Luật Các tổ chức tín dụng 2024 đối với trung gian thanh toán.',
    ],
    deliverables: [
      {
        title: 'Hồ sơ xin cấp Giấy phép TGTT (Đơn Mẫu 01 + Thuyết minh)',
        description: 'Bộ hồ sơ hoàn chỉnh 12 mục theo quy chuẩn Vụ Thanh toán - Ngân hàng Nhà nước.',
        contractLink: '/hop-dong/ho-so-xin-cap-giay-phep-trung-gian-thanh-toan',
        contractTitle: 'Xem mẫu Hồ sơ cấp phép TGTT',
      },
      {
        title: 'Điều lệ Công ty Cổ phần Trung gian Thanh toán',
        description: 'Quy định thẩm quyền ĐHĐCĐ, HĐQT và cơ chế phong tỏa vốn 50 tỷ.',
        contractLink: '/hop-dong/dieu-le-cong-ty-co-phan-vi-dien-tu',
        contractTitle: 'Xem mẫu Điều lệ công ty',
      },
      {
        title: 'Biên bản thẩm tra và cam kết góp vốn thực chất',
        description: 'Cam kết trách nhiệm liên đới của các cổ đông sáng lập về tính hợp pháp của nguồn tiền.',
        contractLink: '/hop-dong/thoa-thuan-co-dong-gop-von-thanh-lap-vi-dien-tu',
        contractTitle: 'Xem Thỏa thuận cổ đông',
      },
    ],
    practicalComparison: {
      flawedApproach: 'Sử dụng giấy chứng nhận đăng ký doanh nghiệp vốn 50 tỷ nhưng tài khoản công ty không có tiền mặt thực; đi thuê người đứng tên Tổng giám đốc đối phó.',
      compliantApproach: 'Thịnh Vượng Legal thẩm định dòng tiền vào tài khoản phong tỏa, đối chiếu bằng cấp và chuẩn bị trọn gói bộ tài liệu thẩm tra nhân sự trước khi nộp hồ sơ.',
    },
  },
  {
    id: 'custody-account',
    number: 'TRỤ CỘT II',
    badge: 'Thông tư 40/2024 · Cốt lõi',
    title: 'Tài khoản Đảm bảo Thanh toán & Kiểm soát Ký quỹ 1:1',
    shortDesc: 'Thiết lập cơ chế phong tỏa độc lập tại Ngân hàng hợp tác, bảo toàn 100% tiền của khách hàng, triệt tiêu nguy cơ thấu chi.',
    legalBasis: {
      statute: 'Nghị định 52/2024/NĐ-CP & Thông tư 40/2024/TT-NHNN',
      articles: 'Điều 25 Nghị định 52 (Đảm bảo khả năng thanh toán) & Điều 9 Thông tư 40',
      keyPrinciple: 'Tổng số dư tài khoản đảm bảo thanh toán tại Ngân hàng luôn KHÔNG ĐƯỢC THẤP HƠN tổng số dư của tất cả các ví điện tử của khách hàng.',
    },
    risksAndTraps: {
      trapTitle: 'Bẫy dùng chung tài khoản & Thấu chi tiền người dùng',
      trapDetail: 'Doanh nghiệp nhập nhằng tài khoản thu phí dịch vụ với tài khoản đảm bảo thanh toán; sử dụng tiền người dùng để quay vòng vốn lưu động hoặc trả lương nhân viên. Khi khách hàng rút tiền đồng loạt, ví rơi vào tình trạng mất thanh khoản.',
      penalty: 'Hành vi vi phạm nghiêm trọng nhất trong lĩnh vực tiền tệ: Đình chỉ hoạt động ngay lập tức, truy cứu trách nhiệm hình sự về tội "Lạm dụng tín nhiệm chiếm đoạt tài sản".',
    },
    deepAnalysis: [
      'Xây dựng Hợp đồng 3 bên giữa Tổ chức cung ứng ví, Ngân hàng bảo đảm thanh toán và Tổ chức chuyển mạch tài chính (Napas).',
      'Thiết lập API đối soát tự động cuối ngày: Ngân hàng phong tỏa số dư tương ứng với tổng tiền hiển thị trên ví, định kỳ báo cáo điện tử cho Cục Giám sát Ngân hàng Nhà nước.',
      'Cơ chế nạp tiền và rút tiền ví điện tử chỉ được thực hiện qua tài khoản thanh toán hoặc thẻ ghi nợ chính chủ đã định danh eKYC theo Thông tư 40.',
      'Quy chế quản lý tách bạch tuyệt đối dòng tiền phí vận hành của công ty ví ra khỏi dòng tiền ký quỹ của người dùng.',
    ],
    deliverables: [
      {
        title: 'Hợp đồng mở và duy trì Tài khoản đảm bảo thanh toán',
        description: 'Văn bản pháp lý ràng buộc nghĩa vụ phong tỏa và giải tỏa số dư giữa Ví và Ngân hàng thương mại.',
        contractLink: '/hop-dong/hop-dong-mo-tai-khoan-dam-bao-thanh-toan',
        contractTitle: 'Xem mẫu Hợp đồng Tài khoản bảo đảm',
      },
      {
        title: 'Thỏa thuận liên kết thẻ ghi nợ & Tài khoản ngân hàng',
        description: 'Chuẩn hóa quy trình liên kết 1-1, ủy quyền trích nợ tự động và hạn mức giao dịch 100 triệu/tháng.',
        contractLink: '/hop-dong/thoa-thuan-lien-ket-vi-dien-tu-voi-tai-khoan-ngan-hang',
        contractTitle: 'Xem Thỏa thuận liên kết ngân hàng',
      },
      {
        title: 'Điều khoản và điều kiện mở, sử dụng ví điện tử (Terms of Service)',
        description: 'Bảo vệ người tiêu dùng, quy định rõ quyền hủy ví, rút tiền về tài khoản ngân hàng không bị giữ lại.',
        contractLink: '/hop-dong/dieu-khoan-su-dung-dich-vu-vi-dien-tu-b2c',
        contractTitle: 'Xem Điều khoản mở ví B2C',
      },
    ],
    practicalComparison: {
      flawedApproach: 'Chuyển tiền người dùng về tài khoản thanh toán thông thường của công ty và chi tiêu tự do; chỉ nộp tiền bảo đảm khi bị cơ quan thanh tra kiểm tra.',
      compliantApproach: 'Thịnh Vượng Legal thiết lập quy trình phong tỏa tiền 100% có cơ chế khóa tự động qua API kết nối ngân hàng, bảo đảm an toàn pháp lý tuyệt đối cho nhà đầu tư.',
    },
  },
  {
    id: 'api-merchant-security',
    number: 'TRỤ CỘT III',
    badge: 'An ninh mạng & PCI-DSS',
    title: 'Kết nối Cổng API Merchant & An toàn Hệ thống Cấp độ 3',
    shortDesc: 'Chuẩn hóa hợp đồng nhúng cổng thanh toán API, phân định trách nhiệm bồi thường khi phát sinh gián đoạn, và bảo mật PCI-DSS.',
    legalBasis: {
      statute: 'Nghị định 85/2016/NĐ-CP, Thông tư 09/2020/TT-NHNN & Tiêu chuẩn PCI-DSS Level 1',
      articles: 'Tiêu chuẩn bảo đảm an toàn hệ thống thông tin cấp độ 3 cho hệ thống thanh toán quốc gia',
      keyPrinciple: 'Hợp đồng cung ứng dịch vụ cổng thanh toán phải phân định rõ ràng thời gian phản hồi SLA, trách nhiệm bồi thường thiệt hại trực tiếp và bảo mật mã khóa API.',
    },
    risksAndTraps: {
      trapTitle: 'Bẫy miễn trừ trách nhiệm vô hiệu & Merchant gian lận',
      trapDetail: 'Hợp đồng cài cắm điều khoản "Ví hoàn toàn không chịu trách nhiệm khi cổng thanh toán sập" - điều khoản này bị Tòa án tuyên vô hiệu theo Luật Bảo vệ quyền lợi người tiêu dùng 2023. Nguy cơ Merchant lợi dụng cổng ví để rửa tiền, thanh toán hàng lậu hoặc cờ bạc trá hình.',
      penalty: 'Chịu trách nhiệm bồi thường toàn bộ thiệt hại gián đoạn cho đối tác; bị phạt đến 400 triệu đồng và tước quyền tích hợp POS/API nếu để xảy ra vi phạm rửa tiền.',
    },
    deepAnalysis: [
      'Xây dựng thỏa thuận mức dịch vụ SLA chuẩn mực: Cam kết tính sẵn sàng 99.95%, thời gian phản hồi lỗi &lt; 15 phút, thời gian khắc phục sự cố nghiêm trọng (P1) &lt; 2 giờ.',
      'Thiết lập quy trình Thẩm định nhận biết đơn vị chấp nhận thanh toán (KYC Merchant): Xác minh giấy phép kinh doanh, nguồn gốc hàng hóa, tài khoản ngân hàng thụ hưởng trước khi cấp API Key.',
      'Quy định cơ chế tạm giữ tiền (Hold Settlement) khi phát hiện dấu hiệu giao dịch bất thường hoặc vượt hạn mức nghi vấn rửa tiền.',
      'Ràng buộc an toàn thông tin với nhà thầu thuê ngoài máy chủ đám mây (AWS/GCP/VNPT/Viettel) đáp ứng tiêu chuẩn trung tâm dữ liệu dự phòng (DRP) cách xa tối thiểu 30km.',
    ],
    deliverables: [
      {
        title: 'Thỏa thuận kết nối cổng thanh toán API cho Merchant',
        description: 'Hợp đồng thương mại chuẩn hóa đối soát, thanh quyết toán T+1, phí chiết khấu MDR và cam kết SLA.',
        contractLink: '/hop-dong/thoa-thuan-ket-noi-cong-thanh-toan-api-merchant',
        contractTitle: 'Xem mẫu Hợp đồng API Merchant',
      },
      {
        title: 'Hợp đồng đại lý chấp nhận thanh toán POS/QR Code',
        description: 'Quy định trách nhiệm niêm yết mã QR, cấm thu thêm phụ phí của người mua và xử lý chargeback.',
        contractLink: '/hop-dong/hop-dong-dai-ly-chap-nhan-thanh-toan-pos-qr',
        contractTitle: 'Xem mẫu Hợp đồng Đại lý QR Code',
      },
      {
        title: 'Hợp đồng thuê ngoài hạ tầng máy chủ CNTT & Trung tâm dữ liệu',
        description: 'Ràng buộc trách nhiệm bảo mật cấp độ 3, cam kết bồi thường dữ liệu rò rỉ và quyền kiểm toán kỹ thuật.',
        contractLink: '/hop-dong/hop-dong-thue-ngoai-ha-tang-cntt-va-trung-tam-du-lieu',
        contractTitle: 'Xem Hợp đồng thuê hạ tầng Cloud',
      },
    ],
    practicalComparison: {
      flawedApproach: 'Sử dụng bản hợp đồng mẫu sơ sài tải trên mạng, không có điều khoản SLA rõ ràng, khi cổng sập hàng tỷ đồng doanh thu của đối tác thì đôi bên kiện cáo kéo dài.',
      compliantApproach: 'Thịnh Vượng Legal cung cấp khung điều khoản SLA chuyên biệt, có cơ chế trích lập quỹ bảo chứng rủi ro Merchant và phân bổ trách nhiệm minh bạch.',
    },
  },
  {
    id: 'privacy-dpi-dispute',
    number: 'TRỤ CỘT IV',
    badge: 'Luật 91/2025/QH15 & Nghị định 356',
    title: 'Bảo vệ Dữ liệu Cá nhân Nhạy cảm & Quy trình Tra soát Sự cố',
    shortDesc: 'Xây dựng hồ sơ đánh giá tác động DPIA gửi Bộ Công an (A05), eKYC khuôn mặt và quy trình xử lý tra soát khiếu nại trong 30 ngày.',
    legalBasis: {
      statute: 'Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15 & Thông tư 40/2024/TT-NHNN',
      articles: 'Điều 9 (Dữ liệu cá nhân nhạy cảm), Điều 15 (Đánh giá tác động DPIA), Điều 11 Thông tư 40 (Tra soát khiếu nại)',
      keyPrinciple: 'Thông tin tài khoản, lịch sử giao dịch và dữ liệu sinh trắc học là dữ liệu nhạy cảm đặc thù; mọi hành vi chia sẻ cho bên thứ ba vì mục đích quảng cáo hoặc chấm điểm tín dụng khi chưa có sự đồng ý riêng biệt là bất hợp pháp.',
    },
    risksAndTraps: {
      trapTitle: 'Bẫy chia sẻ dữ liệu chéo & Chậm trễ hoàn tiền tra soát',
      trapDetail: 'Ví điện tử liên kết đối tác quảng cáo, tự ý chuyển dữ liệu hành vi mua sắm của khách hàng; khi khách hàng bị hack tài khoản hoặc chuyển nhầm tiền, ví kéo dài thời gian tra soát quá 30 ngày làm việc hoặc đùn đẩy trách nhiệm sang ngân hàng.',
      penalty: 'Xử phạt lên đến 5% tổng doanh thu toàn cầu theo Luật Dữ liệu mới; đình chỉ giấy phép xử lý dữ liệu và bồi thường toàn bộ tổn thất vật chất, tinh thần cho người tiêu dùng.',
    },
    deepAnalysis: [
      'Xây dựng Hồ sơ đánh giá tác động xử lý dữ liệu cá nhân (DPIA) đầy đủ 06 nội dung bắt buộc nộp Cục An ninh mạng và phòng, chống tội phạm sử dụng công nghệ cao (A05) - Bộ Công an.',
      'Thiết kế Điều khoản Chấp thuận Xử lý Dữ liệu riêng biệt (Consent Form): Người dùng có quyền lựa chọn đồng ý hoặc từ chối từng mục đích sử dụng dữ liệu cụ thể (không được dùng cơ chế "đồng ý tất cả hoặc không được dùng ví").',
      'Quy trình xác thực sinh trắc học khuôn mặt khớp với chip thẻ CCCD theo Quyết định 2345/QĐ-NHNN cho các giao dịch trên 10 triệu đồng/lần hoặc trên 20 triệu đồng/ngày.',
      'Thiết lập Quy trình xử lý tra soát, khiếu nại 3 cấp độ: Cấp 1 (Hỗ trợ 24/7 ghi nhận), Cấp 2 (Đối soát với Ngân hàng liên kết trong 10 ngày), Cấp 3 (Hội đồng bồi thường đưa ra phán quyết tối đa 30 ngày).',
    ],
    deliverables: [
      {
        title: 'Hồ sơ đánh giá tác động DPIA & Chính sách bảo vệ dữ liệu',
        description: 'Văn bản kỹ thuật - pháp lý đạt chuẩn Cục A05 - Bộ Công an về kiểm soát dữ liệu tài chính nhạy cảm.',
        contractLink: '/hop-dong/chinh-sach-bao-ve-du-lieu-ca-nhan-khach-hang',
        contractTitle: 'Xem Chính sách Bảo vệ Dữ liệu',
      },
      {
        title: 'Quy trình tiếp nhận và xử lý tra soát khiếu nại khách hàng',
        description: 'Chuẩn hóa luồng phản ứng sự cố, biên bản giải quyết bồi thường và hoàn tiền theo Thông tư 40.',
        contractLink: '/hop-dong/quy-trinh-tiep-nhan-va-xu-ly-tra-soat-khieu-nai',
        contractTitle: 'Xem Quy trình Tra soát khiếu nại',
      },
      {
        title: 'Thỏa thuận xử lý dữ liệu cá nhân giữa Ví và Bên thứ ba',
        description: 'Ràng buộc nhà cung cấp dịch vụ phân tích dữ liệu, Cloud không được khai thác dữ liệu người dùng ví.',
        contractLink: '/hop-dong/thoa-thuan-xu-ly-du-lieu-ca-nhan-voi-ben-thu-ba',
        contractTitle: 'Xem Thỏa thuận xử lý dữ liệu bên thứ 3',
      },
    ],
    practicalComparison: {
      flawedApproach: 'Viết vài dòng chính sách quyền riêng tư chung chung, không có DPIA; khi xảy ra rò rỉ dữ liệu hoặc lộ mã OTP thì đổ lỗi cho người dùng thiếu cảnh giác.',
      compliantApproach: 'Thịnh Vượng Legal xây dựng trọn bộ hồ sơ DPIA nộp A05, chuẩn hóa luồng tra soát có nhật ký điện tử bảo vệ ví trước cả cơ quan quản lý và tòa án.',
    },
  },
];

export function DeepDivePillars() {
  const [activeTab, setActiveTab] = useState<string>('licensing-capital');
  const activePillar = deepPillars.find((p) => p.id === activeTab) || deepPillars[0];

  return (
    <section className="deep-pillars-section py-20 bg-white border-t border-[#d8ddd9]" id="tru-cot-chuyen-sau">
      <div className="site-shell">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12 pb-8 border-b border-[#d8ddd9]">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0c665f]/10 text-[#0c665f] text-xs font-bold uppercase tracking-wider mb-3">
              <Scale className="w-3.5 h-3.5" />
              <span>Thẩm định Pháp lý Chuyên sâu · Chi tiết đến từng Điều khoản</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-semibold text-[#071b2e] leading-tight">
              Bốn trụ cột pháp lý then chốt của ví điện tử
            </h2>
            <p className="text-base text-[#5b6870] mt-3 leading-relaxed">
              Thay vì liệt kê chung chung các dịch vụ tư vấn bề mặt, chúng tôi phân tích chi tiết căn cứ pháp luật, bẫy rủi ro tiềm ẩn, chế tài xử phạt và bộ hồ sơ hợp đồng thực thi cụ thể theo Nghị định 52/2024 và Thông tư 40/2024 của Ngân hàng Nhà nước.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              href="/kien-thuc"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 border border-[#071b2e] text-[#071b2e] hover:bg-[#071b2e] hover:text-[#e7c487] text-xs font-bold transition"
            >
              <BookOpen className="w-4 h-4" />
              <span>Tra cứu văn bản luật</span>
            </Link>
            <Link
              href="/hop-dong"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#0c665f] text-white hover:bg-[#084843] text-xs font-bold transition shadow-sm"
            >
              <span>Xem 20 mẫu hợp đồng</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* 4 Interactive Tabs Navigation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {deepPillars.map((pillar) => {
            const isActive = pillar.id === activeTab;
            return (
              <button
                key={pillar.id}
                type="button"
                onClick={() => setActiveTab(pillar.id)}
                className={`text-left p-4 sm:p-5 border transition-all duration-300 relative cursor-pointer ${
                  isActive
                    ? 'bg-[#071b2e] text-white border-[#c89b51] shadow-lg -translate-y-1'
                    : 'bg-[#fafaf8] text-[#071b2e] border-[#d8ddd9] hover:border-[#c89b51]/60 hover:bg-white'
                }`}
              >
                {/* Active Indicator Top Line */}
                {isActive && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#c89b51] via-[#e7c487] to-[#c89b51]" />
                )}

                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`font-display text-xs font-bold uppercase tracking-wider ${
                      isActive ? 'text-[#e7c487]' : 'text-[#c89b51]'
                    }`}
                  >
                    {pillar.number}
                  </span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-xs ${
                      isActive
                        ? 'bg-white/15 text-gray-200'
                        : 'bg-[#0c665f]/10 text-[#0c665f]'
                    }`}
                  >
                    {pillar.badge}
                  </span>
                </div>

                <h3
                  className={`font-heading text-base font-bold leading-snug mb-2 ${
                    isActive ? 'text-white' : 'text-[#071b2e]'
                  }`}
                >
                  {pillar.title}
                </h3>

                <p
                  className={`text-xs line-clamp-2 leading-relaxed ${
                    isActive ? 'text-gray-300' : 'text-[#5b6870]'
                  }`}
                >
                  {pillar.shortDesc}
                </p>
              </button>
            );
          })}
        </div>

        {/* Detailed Deep-Dive Content Panel */}
        <div className="bg-[#fafaf8] border border-[#d8ddd9] shadow-sm p-6 lg:p-10 transition-all duration-300">
          {/* Top Legal Citation Ribbon */}
          <div className="bg-white border-l-4 border-[#c89b51] border-t border-r border-b border-[#d8ddd9] p-5 mb-8 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-[#c89b51] uppercase tracking-wider mb-1">
                  <Landmark className="w-4 h-4" />
                  <span>Căn cứ pháp lý then chốt</span>
                </div>
                <h4 className="font-heading text-xl font-bold text-[#071b2e]">
                  {activePillar.legalBasis.statute}
                </h4>
                <div className="text-xs text-[#0c665f] font-mono font-semibold mt-1">
                  Điều khoản áp dụng: {activePillar.legalBasis.articles}
                </div>
              </div>

              <div className="bg-[#071b2e] text-white p-4 max-w-md border border-[#c89b51]/30">
                <span className="text-[11px] font-display text-[#e7c487] font-bold block mb-1 uppercase tracking-wider">
                  Nguyên tắc cốt lõi:
                </span>
                <p className="text-xs text-gray-300 leading-relaxed">
                  {activePillar.legalBasis.keyPrinciple}
                </p>
              </div>
            </div>
          </div>

          {/* Grid of 2 Main Analysis Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
            {/* Left: Deep Statutory Analysis & Audit Checklist */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <h4 className="font-display text-xs font-bold text-[#071b2e] uppercase tracking-wider mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0c665f]" />
                  Nội dung thẩm định chuyên sâu &amp; Biện pháp kiểm soát
                </h4>
                <div className="space-y-3">
                  {activePillar.deepAnalysis.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-white p-4 border border-[#d8ddd9] flex items-start gap-3 shadow-xs hover:border-[#0c665f] transition"
                    >
                      <span className="w-6 h-6 rounded-full bg-[#0c665f]/10 text-[#0c665f] font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        0{idx + 1}
                      </span>
                      <p className="text-sm text-[#071b2e] leading-relaxed">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Comparison Table: Flawed vs Compliant */}
              <div className="bg-white p-6 border border-[#d8ddd9] shadow-xs">
                <h5 className="font-display text-xs font-bold uppercase tracking-wider text-[#071b2e] mb-4">
                  Đối chiếu thực tiễn: Thực trạng rủi ro vs. Chuẩn mực Thịnh Vượng Legal
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="bg-red-50/70 border border-red-200 p-4">
                    <span className="font-bold text-red-800 flex items-center gap-1.5 mb-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                      Lỗi phổ biến của doanh nghiệp:
                    </span>
                    <p className="text-red-950 leading-relaxed">
                      {activePillar.practicalComparison.flawedApproach}
                    </p>
                  </div>

                  <div className="bg-emerald-50/70 border border-emerald-200 p-4">
                    <span className="font-bold text-emerald-800 flex items-center gap-1.5 mb-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Giải pháp chuẩn hóa Thịnh Vượng Legal:
                    </span>
                    <p className="text-emerald-950 leading-relaxed">
                      {activePillar.practicalComparison.compliantApproach}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Legal Traps & Associated Model Contracts */}
            <div className="lg:col-span-5 space-y-6">
              {/* Trap & Penalty Alert Box */}
              <div className="bg-[#071b2e] text-white p-6 border-l-4 border-red-500 border-t border-r border-b border-white/10 shadow-md">
                <div className="flex items-center gap-2 text-xs font-bold text-red-400 uppercase tracking-wider mb-2">
                  <ShieldAlert className="w-4 h-4 text-red-400" />
                  <span>Cảnh báo bẫy pháp lý &amp; Chế tài xử phạt</span>
                </div>
                <h5 className="font-heading text-lg font-bold text-white mb-2">
                  {activePillar.risksAndTraps.trapTitle}
                </h5>
                <p className="text-xs text-gray-300 leading-relaxed mb-4">
                  {activePillar.risksAndTraps.trapDetail}
                </p>
                <div className="pt-3 border-t border-white/10 text-xs text-[#e7c487] bg-white/5 p-3 rounded-xs">
                  <strong className="block text-red-400 mb-1">Mức chế tài xử lý:</strong>
                  {activePillar.risksAndTraps.penalty}
                </div>
              </div>

              {/* Deliverables & Model Contracts Ready */}
              <div className="bg-white p-6 border border-[#d8ddd9] shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-[#d8ddd9] mb-4">
                  <span className="font-display text-xs font-bold uppercase tracking-wider text-[#071b2e] flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-[#c89b51]" />
                    Hồ sơ &amp; Hợp đồng mẫu đối ứng
                  </span>
                  <span className="text-[10px] bg-[#c89b51]/10 text-[#071b2e] font-mono px-2 py-0.5 font-bold">
                    Có sẵn bản thảo
                  </span>
                </div>

                <div className="space-y-4">
                  {activePillar.deliverables.map((doc, docIdx) => (
                    <div
                      key={docIdx}
                      className="p-3.5 bg-gray-50 border border-gray-200 hover:border-[#c89b51] transition"
                    >
                      <h6 className="font-semibold text-sm text-[#071b2e] mb-1">
                        {doc.title}
                      </h6>
                      <p className="text-xs text-[#5b6870] leading-relaxed mb-2">
                        {doc.description}
                      </p>
                      {doc.contractLink && (
                        <Link
                          href={doc.contractLink}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0c665f] hover:text-[#071b2e] hover:underline"
                        >
                          <span>{doc.contractTitle}</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-[#d8ddd9]">
                  <Link
                    href="/hop-dong"
                    className="gold-button w-full justify-center text-xs py-2.5 font-bold shadow-xs"
                  >
                    Xem trọn bộ 20 hợp đồng mẫu <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Summary Bar */}
          <div className="pt-6 border-t border-[#d8ddd9] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#5b6870]">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#0c665f]" />
              <span>
                Toàn bộ văn bản và quy trình đều được đối soát với quy chuẩn thanh tra định kỳ của Ngân hàng Nhà nước.
              </span>
            </div>
            <Link
              href="/tu-van"
              className="font-bold text-[#071b2e] hover:text-[#0c665f] underline shrink-0"
            >
              Yêu cầu thẩm định độc lập trụ cột này →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
