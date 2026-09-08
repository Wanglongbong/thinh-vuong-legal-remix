import { useState } from 'react';
import {
  AlertCircle,
  Award,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Coins,
  FileCheck2,
  FileText,
  HelpCircle,
  Landmark,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

interface TimelineStage {
  id: string;
  monthRange: string;
  title: string;
  duration: string;
  description: string;
  deliverables: string[];
  regulations: string;
  statusText: string;
}

interface ServiceLicenseType {
  id: 'e-wallet' | 'payment-gateway' | 'collection-disbursement';
  name: string;
  minCapital: string;
  estimatedMonths: string;
  governingLaw: string;
  stages: TimelineStage[];
}

const licenseTypes: ServiceLicenseType[] = [
  {
    id: 'e-wallet',
    name: 'Ví Điện Tử Độc Lập (E-Wallet)',
    minCapital: '50.000.000.000 VNĐ (50 Tỷ Đồng)',
    estimatedMonths: '08 - 10 Tháng',
    governingLaw: 'Nghị định 52/2024/NĐ-CP & Thông tư 40/2024/TT-NHNN',
    stages: [
      {
        id: 'stage-1',
        monthRange: 'Tháng 1 - 2',
        title: 'Thành lập & Tăng vốn điều lệ thực góp ≥ 50 Tỷ VNĐ',
        duration: '60 Ngày',
        description:
          'Hoàn thiện thủ tục đăng ký kinh doanh ngành nghề trung gian thanh toán, góp đủ vốn bằng tiền đồng Việt Nam và chuẩn bị chứng minh nguồn gốc vốn.',
        deliverables: [
          'Giấy chứng nhận đăng ký doanh nghiệp với ngành mã 6619 (Trung gian thanh toán).',
          'Văn bản xác nhận phong tỏa vốn điều lệ thực góp ≥ 50 tỷ VNĐ tại NHTM.',
          'Bổ nhiệm Tổng giám đốc/Giám đốc và nhân sự lãnh đạo đáp ứng tiêu chuẩn chuyên môn.',
          'Lý lịch tư pháp của người đại diện theo pháp luật và các cổ đông sáng lập.',
        ],
        regulations: 'Điều 22 & Điều 24 Nghị định 52/2024/NĐ-CP',
        statusText: 'Giai đoạn nền tảng pháp lý',
      },
      {
        id: 'stage-2',
        monthRange: 'Tháng 3 - 4',
        title: 'Xây dựng Đề án kinh doanh & Kiểm thử Kỹ thuật Cấp độ 3',
        duration: '60 Ngày',
        description:
          'Soạn thảo đề án thuyết minh giải pháp công nghệ, quy trình vận hành và kiểm thử an toàn bảo mật phòng máy chủ trung tâm dữ liệu.',
        deliverables: [
          'Đề án kinh doanh dịch vụ ví điện tử (kế hoạch tài chính 03 năm đầu).',
          'Bản thuyết minh giải pháp kỹ thuật, sơ đồ mạng và phương án dự phòng thảm họa (DR).',
          'Chứng nhận đánh giá an toàn thông tin hệ thống đạt cấp độ 3 trở lên theo NĐ 85/2016.',
          'Quy chế kiểm soát nội bộ, phòng chống rửa tiền (AML) và quy trình tra soát bồi thường.',
        ],
        regulations: 'Điều 23 Nghị định 52/2024/NĐ-CP',
        statusText: 'Hồ sơ kỹ thuật & Quy chế',
      },
      {
        id: 'stage-3',
        monthRange: 'Tháng 5 - 7',
        title: 'Nộp hồ sơ NHNN & Thanh tra Thực tế Trụ sở',
        duration: '90 Ngày',
        description:
          'Nộp 01 bộ hồ sơ chính thức tới Ngân hàng Nhà nước Việt Nam; giải trình các yêu cầu bổ sung và tiếp đón đoàn kiểm tra thực tế cơ sở vật chất.',
        deliverables: [
          'Biên nhận tiếp nhận hồ sơ từ Vụ Thanh toán - Ngân hàng Nhà nước.',
          'Văn bản giải trình, chỉnh sửa bổ sung tài liệu theo ý kiến thẩm định chuyên môn.',
          'Biên bản kiểm tra thực tế hệ thống máy chủ, quy trình vận hành tại trụ sở công ty.',
          'Thỏa thuận nguyên tắc với Ngân hàng hợp tác về mở tài khoản bảo đảm thanh toán.',
        ],
        regulations: 'Điều 24 & Điều 25 Nghị định 52/2024/NĐ-CP',
        statusText: 'Thẩm định cơ quan nhà nước',
      },
      {
        id: 'stage-4',
        monthRange: 'Tháng 8',
        title: 'Nhận Giấy phép chính thức & Ký Hợp đồng Bảo đảm',
        duration: '30 Ngày',
        description:
          'Thống đốc Ngân hàng Nhà nước ký Quyết định cấp Giấy phép hoạt động trung gian thanh toán; ký hợp đồng mở tài khoản đảm bảo và công bố thông tin.',
        deliverables: [
          'Giấy phép hoạt động cung ứng dịch vụ trung gian thanh toán (Thời hạn 10 năm).',
          'Hợp đồng chính thức về Tài khoản bảo đảm thanh toán với Ngân hàng thương mại.',
          'Công bố thông tin trên Cổng thông tin điện tử NHNN và các phương tiện truyền thông.',
          'Chính thức nghiệm thu kết nối và tiếp nhận người dùng đăng ký ví.',
        ],
        regulations: 'Điều 26-28 Nghị định 52/2024/NĐ-CP',
        statusText: 'Cấp phép & Vận hành',
      },
    ],
  },
  {
    id: 'payment-gateway',
    name: 'Cổng Thanh Toán Điện Tử (Payment Gateway)',
    minCapital: '50.000.000.000 VNĐ (50 Tỷ Đồng)',
    estimatedMonths: '06 - 08 Tháng',
    governingLaw: 'Nghị định 52/2024/NĐ-CP & Luật Các TCTD 2024',
    stages: [
      {
        id: 'stage-1',
        monthRange: 'Tháng 1 - 2',
        title: 'Tổ chức bộ máy & Đảm bảo vốn pháp định 50 tỷ VNĐ',
        duration: '60 Ngày',
        description:
          'Xác nhận tiền gửi ký quỹ phong tỏa vốn, kiện toàn cơ cấu hội đồng quản trị và ban điều hành có kinh nghiệm ngân hàng/thanh toán.',
        deliverables: [
          'Đăng ký kinh doanh cập nhật bổ sung mã ngành 6619.',
          'Bằng cấp, chứng chỉ và lý lịch chuyên môn của Giám đốc kỹ thuật (CTO), Giám đốc rủi ro.',
          'Báo cáo kiểm toán vốn điều lệ nếu là doanh nghiệp chuyển đổi.',
        ],
        regulations: 'Điều 22 Nghị định 52/2024/NĐ-CP',
        statusText: 'Điều kiện tổ chức & Vốn',
      },
      {
        id: 'stage-2',
        monthRange: 'Tháng 3 - 4',
        title: 'Thiết kế Cổng API, Bảo mật PCI-DSS & Đề án Cung ứng',
        duration: '60 Ngày',
        description:
          'Xây dựng tài liệu kỹ thuật kết nối API thanh toán, chứng chỉ bảo mật dữ liệu thẻ quốc tế PCI-DSS Level 1 và quy trình đối soát giao dịch.',
        deliverables: [
          'Chứng chỉ bảo mật thẻ quốc tế PCI-DSS Level 1 cho hạ tầng cổng thanh toán.',
          'Thuyết minh kiến trúc kết nối chuyển mạch với NAPAS / Tổ chức thẻ quốc tế (Visa/Mastercard).',
          'Bộ hợp đồng mẫu đại lý thanh toán và quy chế xử lý giao dịch nghi ngờ gian lận.',
        ],
        regulations: 'Điều 23 Nghị định 52/2024/NĐ-CP',
        statusText: 'Hạ tầng kỹ thuật & API',
      },
      {
        id: 'stage-3',
        monthRange: 'Tháng 5 - 6',
        title: 'Nộp hồ sơ thẩm định NHNN & Thử nghiệm kết nối',
        duration: '60 Ngày',
        description:
          'Phối hợp các vụ cục của NHNN (Vụ Thanh toán, Cục CNTT, Cơ quan Thanh tra Giám sát) để thẩm định và kiểm tra thực địa.',
        deliverables: [
          'Hồ sơ cấp phép cổng thanh toán theo Mẫu số 01 NĐ 52/2024.',
          'Báo cáo kết quả thử nghiệm xử lý giao dịch mẫu (Sandbox testing).',
          'Biên bản nghiệm thu an ninh thông tin phòng máy chủ.',
        ],
        regulations: 'Điều 24 Nghị định 52/2024/NĐ-CP',
        statusText: 'Thẩm tra & Nghiệm thu',
      },
      {
        id: 'stage-4',
        monthRange: 'Tháng 7',
        title: 'Nhận Giấy phép & Triển khai Merchant',
        duration: '30 Ngày',
        description:
          'Nhận Giấy phép từ Thống đốc NHNN và bắt đầu ký kết với các sàn thương mại điện tử, chuỗi bán lẻ.',
        deliverables: [
          'Giấy phép cung ứng dịch vụ Cổng thanh toán điện tử.',
          'Ký kết thỏa thuận hợp tác thương mại chính thức với các Ngân hàng liên minh.',
        ],
        regulations: 'Điều 26 Nghị định 52/2024/NĐ-CP',
        statusText: 'Cấp phép chính thức',
      },
    ],
  },
  {
    id: 'collection-disbursement',
    name: 'Hỗ Trợ Thu Hộ, Chi Hộ (Collection & Disbursement)',
    minCapital: '50.000.000.000 VNĐ (50 Tỷ Đồng)',
    estimatedMonths: '06 - 08 Tháng',
    governingLaw: 'Nghị định 52/2024/NĐ-CP',
    stages: [
      {
        id: 'stage-1',
        monthRange: 'Tháng 1 - 2',
        title: 'Vốn điều lệ 50 tỷ & Thỏa thuận Hợp tác Ngân hàng mở đầu',
        duration: '60 Ngày',
        description:
          'Góp đủ 50 tỷ vốn điều lệ và đàm phán hợp tác với ít nhất 01 ngân hàng thương mại để triển khai cơ chế thu hộ/chi hộ.',
        deliverables: [
          'Giấy phép kinh doanh bổ sung mã 6619.',
          'Văn bản chứng minh vốn thực góp 50 tỷ đồng.',
          'Biên bản ghi nhớ hợp tác (MOU) triển khai dịch vụ thu chi hộ với ngân hàng đối tác.',
        ],
        regulations: 'Điều 22 Nghị định 52/2024/NĐ-CP',
        statusText: 'Chuẩn bị vốn & Ngân hàng',
      },
      {
        id: 'stage-2',
        monthRange: 'Tháng 3 - 4',
        title: 'Xây dựng Cơ chế Quản trị Luồng tiền & Đối soát',
        duration: '60 Ngày',
        description:
          'Xây dựng phần mềm đối soát tự động, phân định rõ tiền của khách hàng và tiền phí dịch vụ của công ty, hạn chế rủi ro thất thoát.',
        deliverables: [
          'Đề án kinh doanh dịch vụ hỗ trợ thu hộ, chi hộ.',
          'Quy chế đối soát T+0/T+1 và phương án phòng ngừa rủi ro chậm chuyển tiền.',
          'Chứng thư bảo lãnh ngân hàng hoặc tài khoản giữ tiền chuyên biệt.',
        ],
        regulations: 'Điều 23 Nghị định 52/2024/NĐ-CP',
        statusText: 'Quy trình kiểm soát tiền',
      },
      {
        id: 'stage-3',
        monthRange: 'Tháng 5 - 6',
        title: 'Nộp Hồ sơ & Trực tiếp Bảo vệ Đề án tại NHNN',
        duration: '60 Ngày',
        description:
          'Trình bày trực tiếp trước hội đồng thẩm định về năng lực kiểm soát rủi ro và cam kết hạn mức thu chi hộ.',
        deliverables: [
          'Hồ sơ đăng ký cấp phép theo Nghị định 52/2024/NĐ-CP.',
          'Báo cáo giải trình quy trình phòng chống rửa tiền và nhận biết đối tác (KYB).',
        ],
        regulations: 'Điều 24 Nghị định 52/2024/NĐ-CP',
        statusText: 'Bảo vệ hồ sơ',
      },
      {
        id: 'stage-4',
        monthRange: 'Tháng 7',
        title: 'Nhận Giấy phép & Tích hợp Doanh nghiệp lớn',
        duration: '30 Ngày',
        description:
          'Nhận Giấy phép trung gian thanh toán và mở rộng mạng lưới điểm thu chi hộ cho điện, nước, viễn thông và bảo hiểm.',
        deliverables: [
          'Giấy phép cung ứng dịch vụ hỗ trợ thu hộ, chi hộ.',
          'Hợp đồng thương mại kết nối thu hộ với các nhà cung cấp dịch vụ công/doanh nghiệp.',
        ],
        regulations: 'Điều 26 Nghị định 52/2024/NĐ-CP',
        statusText: 'Hoàn tất thủ tục',
      },
    ],
  },
];

export function LicensingTimeline() {
  const [selectedType, setSelectedType] = useState<'e-wallet' | 'payment-gateway' | 'collection-disbursement'>('e-wallet');
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({
    'stage-1': true,
  });

  const currentLicense = licenseTypes.find((t) => t.id === selectedType) || licenseTypes[0];

  const toggleStep = (id: string) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const completedCount = currentLicense.stages.filter((s) => completedSteps[s.id]).length;
  const progressPercent = Math.round((completedCount / currentLicense.stages.length) * 100);

  return (
    <div className="w-full bg-white border border-[#d8ddd9] shadow-sm overflow-hidden my-8">
      {/* Header */}
      <div className="bg-[#071b2e] text-white p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-[#c89b51]/30">
        <div>
          <span className="text-[#e7c487] text-xs uppercase tracking-widest font-bold flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#e7c487]" />
            Công Cụ Hoạch Định Pháp Lý 2025 - 2026
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-white mt-1 font-medium">
            Máy Tính Lộ Trình & Thời Gian Cấp Phép NHNN
          </h2>
          <p className="text-slate-300 text-sm mt-1 max-w-2xl">
            Ước tính tiến độ theo chuẩn <strong>Nghị định 52/2024/NĐ-CP</strong>. Lựa chọn loại hình giấy phép trung gian thanh toán để xem biểu đồ Gantt và danh mục hồ sơ bắt buộc.
          </p>
        </div>

        {/* Quick Stats Pill */}
        <div className="bg-[#0d2b3e] border border-[#c89b51]/40 p-4 rounded-sm flex items-center gap-6">
          <div>
            <div className="text-[11px] text-[#e7c487] uppercase font-bold tracking-wider">
              Vốn Tối Thiểu
            </div>
            <div className="font-serif text-xl font-bold text-white mt-0.5">
              50 Tỷ VNĐ
            </div>
          </div>
          <div className="w-px h-8 bg-slate-700" />
          <div>
            <div className="text-[11px] text-[#e7c487] uppercase font-bold tracking-wider">
              Thời Gian Dự Kiến
            </div>
            <div className="font-serif text-xl font-bold text-white mt-0.5">
              {currentLicense.estimatedMonths}
            </div>
          </div>
        </div>
      </div>

      {/* License Type Selector Tabs */}
      <div className="bg-[#f7f6f1] p-4 sm:px-8 border-b border-[#d8ddd9] flex flex-wrap gap-2">
        {licenseTypes.map((type) => {
          const isSelected = type.id === selectedType;
          return (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`px-4 py-2.5 text-xs font-bold transition flex items-center gap-2 cursor-pointer border ${
                isSelected
                  ? 'bg-[#071b2e] text-white border-[#071b2e] shadow-sm'
                  : 'bg-white text-slate-700 border-[#d8ddd9] hover:border-slate-400'
              }`}
            >
              <Landmark className={`w-3.5 h-3.5 ${isSelected ? 'text-[#e7c487]' : 'text-[#0c665f]'}`} />
              {type.name}
            </button>
          );
        })}
      </div>

      {/* Progress Bar & Readiness Gauge */}
      <div className="p-6 sm:px-8 bg-[#edf3f2] border-b border-[#d8ddd9] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:max-w-md">
          <div className="flex justify-between text-xs font-bold text-[#071b2e] mb-1.5">
            <span>Tiến độ sẵn sàng hồ sơ ({completedCount}/{currentLicense.stages.length} giai đoạn)</span>
            <span className="text-[#0c665f]">{progressPercent}%</span>
          </div>
          <div className="w-full h-2.5 bg-[#d8ddd9] rounded-full overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-[#0c665f] to-[#c89b51] transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
        <div className="text-xs text-slate-600 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#c89b51]" />
          <span>Click vào ô kiểm để đánh dấu các mốc doanh nghiệp bạn đã hoàn thành</span>
        </div>
      </div>

      {/* Timeline Gantt Stages */}
      <div className="p-6 sm:p-8 space-y-6">
        {currentLicense.stages.map((stage, idx) => {
          const isDone = !!completedSteps[stage.id];
          return (
            <div
              key={stage.id}
              className={`relative border transition-all duration-200 ${
                isDone
                  ? 'border-[#0c665f]/50 bg-[#fafcfb]'
                  : 'border-[#d8ddd9] bg-white'
              }`}
            >
              {/* Header of Stage */}
              <div className="p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#d8ddd9]/60">
                <div className="flex items-start gap-3.5">
                  <button
                    type="button"
                    onClick={() => toggleStep(stage.id)}
                    className={`mt-0.5 w-6 h-6 rounded-sm flex items-center justify-center border cursor-pointer transition ${
                      isDone
                        ? 'bg-[#0c665f] border-[#0c665f] text-white'
                        : 'bg-white border-[#93a7ae] text-transparent hover:border-[#0c665f]'
                    }`}
                    title="Đánh dấu hoàn tất"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-mono font-bold px-2 py-0.5 bg-[#071b2e] text-[#e7c487]">
                        {stage.monthRange}
                      </span>
                      <span className="text-[11px] font-semibold text-[#0c665f] bg-[#edf3f2] px-2 py-0.5">
                        {stage.duration}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500">
                        {stage.statusText}
                      </span>
                    </div>

                    <h3 className="font-serif text-xl sm:text-2xl font-medium text-[#071b2e] mt-2">
                      {stage.title}
                    </h3>
                  </div>
                </div>

                <div className="text-left md:text-right self-start md:self-auto text-xs text-slate-500">
                  <span className="font-bold text-slate-700 block">Căn cứ:</span>
                  <span className="text-[#0c665f]">{stage.regulations}</span>
                </div>
              </div>

              {/* Body of Stage */}
              <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-5 text-sm text-slate-600 leading-relaxed">
                  <p className="font-medium text-slate-800 mb-2">Mục tiêu công việc:</p>
                  <p>{stage.description}</p>

                  <div className="mt-4 p-3 bg-[#f7f6f1] border-l-2 border-[#c89b51] text-xs text-slate-700">
                    <strong className="block text-[#071b2e] mb-1">Lưu ý chuyên gia:</strong>
                    Tuân thủ nghiêm ngặt thời hạn 60 ngày giải trình bổ sung của NHNN; quá thời hạn hồ sơ sẽ bị hủy bỏ và phải nộp lại từ đầu.
                  </div>
                </div>

                <div className="lg:col-span-7">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5 flex items-center gap-1.5">
                    <FileCheck2 className="w-4 h-4 text-[#0c665f]" />
                    Hồ sơ & Tài liệu bắt buộc phải bàn giao:
                  </p>
                  <ul className="space-y-2">
                    {stage.deliverables.map((item, dIdx) => (
                      <li
                        key={dIdx}
                        className="text-xs text-slate-700 flex items-start gap-2.5 bg-white p-2.5 border border-[#d8ddd9]"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#c89b51] mt-1.5 shrink-0" />
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Callout */}
      <div className="p-6 bg-[#071b2e] text-white border-t border-[#c89b51]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-[#e7c487] shrink-0" />
          <p className="text-xs text-slate-300">
            Thịnh Vượng Legal đồng hành trọn gói từ khâu thành lập, rà soát vốn 50 tỷ đến đại diện làm việc với Ngân hàng Nhà nước.
          </p>
        </div>
        <div className="text-xs font-mono text-[#e7c487]">
          Tỷ lệ hồ sơ được cấp phép: 100% đúng hạn
        </div>
      </div>
    </div>
  );
}
