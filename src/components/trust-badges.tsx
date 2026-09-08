import { Award, CheckCircle2, FileCheck, Lock, Shield, ShieldCheck } from 'lucide-react';

export function TrustBadges() {
  const badges = [
    {
      icon: ShieldCheck,
      code: 'NĐ 52/2024/NĐ-CP',
      title: 'Chuẩn Mực Nghị Định 52/2024',
      subtitle: 'Quy chuẩn Trung gian thanh toán & Vốn thực góp tối thiểu ≥ 50 Tỷ VNĐ',
      tag: 'Bắt buộc NHNN',
    },
    {
      icon: Lock,
      code: 'LUẬT 91/2025/QH15',
      title: 'Bảo Vệ Dữ Liệu Cá Nhân',
      subtitle: 'Đánh giá tác động DPIA & Bảo mật dữ liệu thanh toán, sinh trắc học eKYC',
      tag: 'An ninh dữ liệu',
    },
    {
      icon: Award,
      code: 'ISO/IEC 27001:2022',
      title: 'Hệ Thống Quản Lý Rủi Ro',
      subtitle: 'Chứng nhận kiểm soát an ninh thông tin, phòng máy chủ & hạ tầng mạng Cấp 3',
      tag: 'Chuẩn quốc tế',
    },
    {
      icon: FileCheck,
      code: 'TT 40/2024/TT-NHNN',
      title: 'Tài Khoản Đảm Bảo 1:1',
      subtitle: 'Cam kết 100% số dư nạp ví ký quỹ tại Ngân hàng Thương mại, đối soát hằng ngày',
      tag: 'Bảo chứng vốn',
    },
  ];

  return (
    <div className="w-full bg-[#f7f6f1] border-y border-[#d8ddd9] py-10">
      <div className="site-shell">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-[#0c665f] text-xs font-extrabold uppercase tracking-widest flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-[#c89b51]" />
              Cam Kết Chuẩn Mực Pháp Lý & Kỹ Thuật
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#071b2e] font-medium mt-1">
              Bảo Chứng Tuân Thủ Cho Hệ Thống Fintech
            </h2>
          </div>
          <div className="text-xs text-slate-600 max-w-md">
            Mọi mẫu hợp đồng và quy chế vận hành do Thịnh Vượng Legal biên soạn đều được kiểm định chéo theo các khung tiêu chuẩn pháp lý mới nhất có hiệu lực thi hành.
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {badges.map((badge, idx) => {
            const Icon = badge.icon;
            return (
              <div
                key={idx}
                className="bg-white p-5 border border-[#d8ddd9] hover:border-[#c89b51] transition-all duration-200 shadow-xs hover:shadow-md flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-9 h-9 rounded-sm bg-[#071b2e] text-[#e7c487] flex items-center justify-center group-hover:bg-[#0c665f] group-hover:text-white transition">
                      <Icon className="w-5 h-5" />
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-[#edf3f2] text-[#0c665f] rounded-xs">
                      {badge.tag}
                    </span>
                  </div>
                  <div className="text-xs font-mono font-bold text-[#c89b51] mb-1">
                    {badge.code}
                  </div>
                  <h3 className="font-serif text-base font-semibold text-[#071b2e] leading-snug">
                    {badge.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {badge.subtitle}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#d8ddd9] flex items-center gap-1.5 text-[11px] font-bold text-[#0c665f]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0c665f]" />
                  <span>Đã kiểm định tuân thủ</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
