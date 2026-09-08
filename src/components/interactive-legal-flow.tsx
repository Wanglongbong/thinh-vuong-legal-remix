import { useState } from 'react';
import {
  ArrowRight,
  ArrowRightLeft,
  Banknote,
  Building2,
  CheckCircle2,
  FileCheck,
  Globe2,
  Info,
  Landmark,
  Layers,
  Lock,
  Network,
  ShieldAlert,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { Link } from '@/router';

interface NodeData {
  id: string;
  name: string;
  subtitle: string;
  role: string;
  icon: typeof Users;
  accentColor: string;
  badge: string;
  legalRequirements: string[];
  applicableContracts: { title: string; slug: string; code: string }[];
  criticalRisks: string[];
  keyRegulation: string;
}

const nodes: NodeData[] = [
  {
    id: 'user',
    name: '1. Khách Hàng (Người Dùng Ví)',
    subtitle: 'Chủ tài khoản ví điện tử cá nhân / hộ kinh doanh',
    role: 'Bên sử dụng dịch vụ thanh toán, nạp/rút tiền và thanh toán hóa đơn',
    icon: Users,
    accentColor: '#0c665f',
    badge: 'Chủ thể được bảo vệ quyền lợi',
    legalRequirements: [
      'Xác thực định danh điện tử (eKYC) và sinh trắc học theo Quyết định 2345/QĐ-NHNN & Thông tư 40/2024/TT-NHNN.',
      'Chấp thuận Điều khoản dịch vụ mở và sử dụng ví trước khi kích hoạt tài khoản.',
      'Đồng ý minh bạch về việc thu thập, lưu trữ dữ liệu cá nhân theo Luật Bảo vệ dữ liệu cá nhân 91/2025/QH15.',
      'Ràng buộc hạn mức giao dịch ví điện tử theo quy định của Ngân hàng Nhà nước.',
    ],
    applicableContracts: [
      {
        title: 'Điều khoản sử dụng ví điện tử (B2C)',
        slug: 'dieu-khoan-su-dung-vi-dien-tu-b2c',
        code: 'TV-HD-09',
      },
      {
        title: 'Chính sách bảo vệ dữ liệu cá nhân khách hàng',
        slug: 'chinh-sach-bao-ve-du-lieu-ca-nhan-khach-hang',
        code: 'TV-HD-10',
      },
      {
        title: 'Quy trình tiếp nhận và xử lý khiếu nại, tra soát',
        slug: 'quy-trinh-tiep-nhan-va-xu-ly-khieu-nai-tra-soat',
        code: 'TV-HD-11',
      },
    ],
    criticalRisks: [
      'Bị chiếm đoạt tài khoản do lừa đảo OTP / phishing hoặc mã độc sinh trắc học.',
      'Tranh chấp khiếu nại giao dịch gian lận và trách nhiệm hoàn tiền.',
      'Thu thập vượt mức dữ liệu nhạy cảm dẫn đến phạt vi phạm hành chính.',
    ],
    keyRegulation: 'Khoản 2 Điều 23 NĐ 52/2024/NĐ-CP & Điều 9-11 Thông tư 40/2024/TT-NHNN',
  },
  {
    id: 'wallet',
    name: '2. Doanh Nghiệp Ví Điện Tử (Fintech)',
    subtitle: 'Tổ chức trung gian thanh toán được NHNN cấp phép',
    role: 'Cung cấp hạ tầng ví, quản lý số dư, xử lý lệnh và đảm bảo tuân thủ',
    icon: Landmark,
    accentColor: '#071b2e',
    badge: 'Trung tâm điều phối & Chịu trách nhiệm pháp lý',
    legalRequirements: [
      'Vốn điều lệ thực góp tối thiểu 50 tỷ VNĐ duy trì trong suốt thời gian hoạt động.',
      'Được Ngân hàng Nhà nước cấp Giấy phép cung ứng dịch vụ trung gian thanh toán.',
      'Người đại diện pháp luật, Tổng giám đốc đáp ứng đủ tiêu chuẩn chuyên môn & đạo đức theo luật.',
      'Hạ tầng công nghệ thông tin đáp ứng tiêu chuẩn an toàn hệ thống cấp độ 3 trở lên.',
      'Duy trì tỷ lệ bảo đảm thanh toán 100% số dư ví tại Ngân hàng Hợp tác.',
    ],
    applicableContracts: [
      {
        title: 'Điều lệ công ty cung ứng ví điện tử',
        slug: 'dieu-le-cong-ty-cung-ung-vi-dien-tu',
        code: 'TV-HD-04',
      },
      {
        title: 'Hồ sơ xin cấp Giấy phép trung gian thanh toán',
        slug: 'ho-so-xin-cap-giay-phep-trung-gian-thanh-toan',
        code: 'TV-HD-03',
      },
      {
        title: 'Quy chế kiểm soát nội bộ và quản trị rủi ro',
        slug: 'quy-che-kiem-soat-noi-bo-va-quan-tri-rui-ro',
        code: 'TV-HD-06',
      },
      {
        title: 'Hồ sơ đánh giá tác động bảo vệ dữ liệu (DPIA)',
        slug: 'ho-so-danh-gia-tac-dong-bao-ve-du-lieu-dpia',
        code: 'TV-HD-16',
      },
    ],
    criticalRisks: [
      'Bị thu hồi giấy phép nếu để thiếu hụt tiền trên tài khoản bảo đảm thanh toán.',
      'Rủi ro gián đoạn hệ thống (SLA < 99.9%) gây thiệt hại hàng loạt cho đối tác và người dùng.',
      'Trách nhiệm liên đới phòng chống rửa tiền (AML) và tài trợ khủng bố.',
    ],
    keyRegulation: 'Điều 22-25 Nghị định 52/2024/NĐ-CP & Luật Phòng chống rửa tiền',
  },
  {
    id: 'bank',
    name: '3. Ngân Hàng Hợp Tác (Partner Bank)',
    subtitle: 'Ngân hàng thương mại mở tài khoản bảo đảm & liên kết thẻ',
    role: 'Lưu giữ 100% số dư tiền nạp ví của khách hàng, nạp/rút tiền và bù trừ',
    icon: Building2,
    accentColor: '#c89b51',
    badge: 'Két sắt bảo chứng thanh toán',
    legalRequirements: [
      'Mở Tài khoản đảm bảo thanh toán chuyên dụng theo quy định bắt buộc của NHNN.',
      'Không được phép cho vay hoặc thấu chi trên tài khoản bảo đảm thanh toán của ví.',
      'Kết nối cổng API nạp tiền tự động (Auto-debit) và liên kết tài khoản ngân hàng chính chủ.',
      'Đối soát số dư hằng ngày (Daily Reconciliation) giữa số dư ví và số dư tài khoản ngân hàng.',
    ],
    applicableContracts: [
      {
        title: 'Hợp đồng mở tài khoản đảm bảo thanh toán',
        slug: 'hop-dong-mo-tai-khoan-dam-bao-thanh-toan',
        code: 'TV-HD-07',
      },
      {
        title: 'Hợp đồng liên kết tài khoản thanh toán và nạp/rút tiền',
        slug: 'hop-dong-lien-ket-tai-khoan-thanh-toan-va-nap-rut-tien',
        code: 'TV-HD-08',
      },
      {
        title: 'Thỏa thuận mức cam kết dịch vụ kỹ thuật (SLA Ngân hàng)',
        slug: 'thoa-thuan-muc-cam-ket-dich-vu-ky-thuat-sla',
        code: 'TV-HD-14',
      },
    ],
    criticalRisks: [
      'Lệch số dư bù trừ (Reconciliation mismatch) dẫn đến phong tỏa luồng tiền.',
      'Rủi ro lỗi cổng thanh toán khi cao điểm khiến giao dịch nạp/rút bị treo.',
      'Nguy cơ pháp lý khi cơ quan điều tra yêu cầu phong tỏa tài khoản bảo đảm thanh toán.',
    ],
    keyRegulation: 'Điều 25 Nghị định 52/2024/NĐ-CP & Thông tư 40/2024/TT-NHNN',
  },
  {
    id: 'merchant',
    name: '4. Đơn Vị Chấp Nhận Thanh Toán (Merchant)',
    subtitle: 'Sàn TMĐT, chuỗi bán lẻ, nhà cung cấp dịch vụ trực tuyến',
    role: 'Nhận thanh toán hàng hóa dịch vụ qua mã QR, SDK hoặc Cổng API ví',
    icon: Globe2,
    accentColor: '#16877e',
    badge: 'Mắt xích doanh thu & Tuân thủ giao dịch B2B',
    legalRequirements: [
      'Thẩm định pháp lý và nhận biết đơn vị kinh doanh (KYB) trước khi cấp cổng API.',
      'Cam kết kinh doanh hàng hóa hợp pháp, không nằm trong danh mục cấm.',
      'Thực hiện đối soát giao dịch và chịu trách nhiệm bảo mật khóa bí mật API (Secret Key).',
      'Quy định rõ tỷ lệ phí dịch vụ (MDR), chu kỳ thanh quyết toán tiền bán hàng (T+1, T+2).',
      'Duy trì tỷ lệ ký quỹ hoặc giữ tiền bảo chứng rủi ro tra soát.',
    ],
    applicableContracts: [
      {
        title: 'Hợp đồng đại lý chấp nhận thanh toán (B2B Merchant)',
        slug: 'hop-dong-dai-ly-chap-nhan-thanh-toan-b2b',
        code: 'TV-HD-12',
      },
      {
        title: 'Hợp đồng tích hợp cổng thanh toán và API',
        slug: 'hop-dong-tich-hop-cong-thanh-toan-va-api',
        code: 'TV-HD-13',
      },
      {
        title: 'Thỏa thuận bảo mật thông tin kinh doanh (B2B NDA)',
        slug: 'thoa-thuan-bao-mat-thong-tin-kinh-doanh-b2b-nda',
        code: 'TV-HD-15',
      },
    ],
    criticalRisks: [
      'Merchant thông đồng gian lận rút tiền mặt từ thẻ tín dụng (Cash Advance).',
      'Lộ mã bảo mật API dẫn đến bị kẻ xấu giả mạo tạo đơn hàng giả thanh toán.',
      'Merchant phá sản hoặc bỏ trốn để lại các khoản hoàn trả hàng chưa giải quyết.',
    ],
    keyRegulation: 'Điều 15-18 Nghị định 52/2024/NĐ-CP & Luật Giao dịch điện tử 20/2023/QH15',
  },
];

export function InteractiveLegalFlow() {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('wallet');
  const [activeFlowType, setActiveFlowType] = useState<'money' | 'data' | 'legal'>('legal');

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || nodes[1];

  return (
    <div className="w-full bg-white border border-[#d8ddd9] shadow-sm overflow-hidden my-8">
      {/* Top Header */}
      <div className="bg-[#071b2e] text-white p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#c89b51]/30">
        <div>
          <div className="flex items-center gap-2 text-[#e7c487] text-xs uppercase tracking-widest font-bold">
            <Layers className="w-4 h-4 text-[#e7c487]" />
            Sơ Đồ Kiến Trúc Pháp Lý Tương Tác
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-white mt-1 font-medium">
            Luồng Pháp Lý & Vận Hành Ví Điện Tử
          </h2>
          <p className="text-slate-300 text-sm mt-1 max-w-2xl">
            Mô phỏng chính xác 4 mắt xích cốt lõi: Khách hàng, Ví điện tử, Ngân hàng và Đơn vị chấp nhận thanh toán. Click vào từng chủ thể để kiểm tra điều kiện pháp lý, rủi ro và các hợp đồng bắt buộc.
          </p>
        </div>

        {/* Flow Type Toggle */}
        <div className="flex bg-[#0d2b3e] p-1 border border-[#c89b51]/40 rounded-sm self-start md:self-auto">
          <button
            onClick={() => setActiveFlowType('legal')}
            className={`px-3 py-1.5 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeFlowType === 'legal'
                ? 'bg-[#c89b51] text-[#071b2e]'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Luồng Pháp Lý
          </button>
          <button
            onClick={() => setActiveFlowType('money')}
            className={`px-3 py-1.5 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeFlowType === 'money'
                ? 'bg-[#c89b51] text-[#071b2e]'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Banknote className="w-3.5 h-3.5" />
            Luồng Dòng Tiền
          </button>
          <button
            onClick={() => setActiveFlowType('data')}
            className={`px-3 py-1.5 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeFlowType === 'data'
                ? 'bg-[#c89b51] text-[#071b2e]'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            Luồng Dữ Liệu
          </button>
        </div>
      </div>

      {/* Interactive Diagram Canvas */}
      <div className="p-6 sm:p-8 bg-[#f7f6f1] border-b border-[#d8ddd9]">
        <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-4 flex items-center justify-between">
          <span>Click chọn chủ thể để xem cấu trúc chi tiết:</span>
          <span className="text-[#0c665f] hidden sm:inline-flex items-center gap-1">
            <Info className="w-3.5 h-3.5" /> Chế độ hiển thị: {activeFlowType === 'legal' ? 'Cam kết & Thẩm quyền pháp lý' : activeFlowType === 'money' ? 'Bảo đảm thanh toán 1:1' : 'Bảo mật & Quyền riêng tư'}
          </span>
        </div>

        {/* 4 Nodes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {nodes.map((node) => {
            const Icon = node.icon;
            const isSelected = node.id === selectedNodeId;
            return (
              <div
                key={node.id}
                onClick={() => setSelectedNodeId(node.id)}
                className={`relative p-5 cursor-pointer transition-all duration-200 border text-left flex flex-col justify-between min-h-[160px] ${
                  isSelected
                    ? 'bg-white border-[#c89b51] ring-2 ring-[#c89b51]/30 shadow-lg -translate-y-1'
                    : 'bg-white/80 border-[#d8ddd9] hover:bg-white hover:border-slate-400 hover:shadow-md'
                }`}
              >
                {isSelected && (
                  <div className="absolute -top-2.5 right-4 bg-[#c89b51] text-[#071b2e] text-[10px] font-black uppercase px-2 py-0.5 tracking-wider rounded-xs">
                    Đang chọn
                  </div>
                )}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className="w-10 h-10 rounded-sm flex items-center justify-center text-white"
                      style={{ backgroundColor: node.accentColor }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-semibold px-2 py-0.5 bg-[#edf3f2] text-[#0c665f]">
                      {node.applicableContracts.length} hợp đồng
                    </span>
                  </div>
                  <h3 className="font-serif text-lg font-semibold text-[#071b2e] leading-snug">
                    {node.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {node.subtitle}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#d8ddd9] flex items-center justify-between text-xs font-bold text-[#0c665f]">
                  <span>Xem hồ sơ tuân thủ</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Flow Connector Visualizer */}
        <div className="mt-6 p-4 bg-white border border-[#d8ddd9] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 text-slate-700">
            <ArrowRightLeft className="w-4 h-4 text-[#c89b51]" />
            <span className="font-semibold text-[#071b2e]">Nguyên tắc luân chuyển ({activeFlowType.toUpperCase()}):</span>
          </div>
          <div className="text-slate-600 flex-1 text-center sm:text-left">
            {activeFlowType === 'legal' && (
              <span>
                Ví điện tử là trung tâm kết nối pháp lý: Ký kết <strong>Điều khoản B2C</strong> với khách hàng, <strong>Hợp đồng B2B</strong> với Merchant, và <strong>Hợp đồng Ký quỹ</strong> với Ngân hàng theo NĐ 52/2024.
              </span>
            )}
            {activeFlowType === 'money' && (
              <span>
                Tiền từ Khách hàng nạp vào <strong>Tài khoản bảo đảm tại Ngân hàng (100%)</strong>. Ví điện tử chỉ lưu trữ bản ghi số dư điện tử, tuyệt đối không được phép chiếm dụng vốn hay đầu tư sinh lời.
              </span>
            )}
            {activeFlowType === 'data' && (
              <span>
                Khách hàng xác thực sinh trắc học eKYC $\rightarrow$ Dữ liệu mã hóa truyền qua API an toàn $\rightarrow$ Ngân hàng đối soát $\rightarrow$ Không chia sẻ dữ liệu nhạy cảm ra ngoài mục đích thanh toán (Luật 91/2025).
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Selected Node Detailed Inspector */}
      <div className="p-6 sm:p-8 bg-white">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#d8ddd9]">
          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-[#0c665f] bg-[#edf3f2] px-2.5 py-1">
              {selectedNode.badge}
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-[#071b2e] font-semibold mt-2">
              {selectedNode.name}
            </h3>
            <p className="text-slate-600 text-sm mt-1">{selectedNode.role}</p>
          </div>
          <div className="bg-[#f7f6f1] p-3 border-l-3 border-[#c89b51] text-xs text-slate-700 max-w-md">
            <span className="font-bold text-[#071b2e] block mb-0.5">Căn cứ pháp lý then chốt:</span>
            <span>{selectedNode.keyRegulation}</span>
          </div>
        </div>

        {/* 3 Columns Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {/* Column 1: Điều kiện pháp lý bắt buộc */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-[#071b2e] uppercase tracking-wider pb-2 border-b border-[#d8ddd9]">
              <CheckCircle2 className="w-4 h-4 text-[#0c665f]" />
              Điều kiện pháp lý bắt buộc
            </div>
            <ul className="space-y-2.5 text-xs text-slate-700">
              {selectedNode.legalRequirements.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-[#f7f6f1] p-3 border border-[#d8ddd9]">
                  <span className="font-serif font-bold text-[#c89b51] text-sm leading-none mt-0.5">
                    {idx + 1}.
                  </span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Rủi ro trọng tâm & Tranh chấp */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-[#a52222] uppercase tracking-wider pb-2 border-b border-[#d8ddd9]">
              <ShieldAlert className="w-4 h-4 text-[#a52222]" />
              Rủi ro & Điểm tranh chấp chính
            </div>
            <ul className="space-y-2.5 text-xs text-slate-700">
              {selectedNode.criticalRisks.map((risk, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-[#fff8f8] p-3 border border-[#f5c6c6]">
                  <span className="font-bold text-[#a52222] text-sm leading-none mt-0.5">!</span>
                  <span className="leading-relaxed text-slate-800">{risk}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Bộ hợp đồng áp dụng */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-[#071b2e] uppercase tracking-wider pb-2 border-b border-[#d8ddd9]">
              <FileCheck className="w-4 h-4 text-[#c89b51]" />
              Bộ hợp đồng & Hồ sơ cần chuẩn bị
            </div>
            <div className="space-y-2">
              {selectedNode.applicableContracts.map((contract) => (
                <Link
                  key={contract.slug}
                  href={`/hop-dong/${contract.slug}`}
                  className="group flex flex-col justify-between p-3 border border-[#d8ddd9] hover:border-[#0c665f] bg-white hover:bg-[#edf3f2] transition"
                >
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-mono font-bold text-[#c89b51] group-hover:text-[#0c665f]">
                      {contract.code}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0c665f] group-hover:translate-x-0.5 transition" />
                  </div>
                  <strong className="text-xs font-serif text-[#071b2e] group-hover:text-[#0c665f] mt-1 line-clamp-2">
                    {contract.title}
                  </strong>
                  <span className="text-[11px] text-slate-500 mt-2 flex items-center gap-1 font-sans">
                    Xem điều khoản mẫu <ArrowRight className="w-3 h-3" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
