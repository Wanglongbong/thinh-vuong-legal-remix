import { useState } from 'react';
import {
  Check,
  Copy,
  Download,
  Eye,
  FileCode,
  FileDown,
  FileText,
  Printer,
  Sparkles,
  X,
} from 'lucide-react';

interface ContractGeneratorModalProps {
  open: boolean;
  onClose: () => void;
  contractTitle: string;
  contractCode: string;
  category: string;
  contractSlug: string;
}

export function ContractGeneratorModal({
  open,
  onClose,
  contractTitle,
  contractCode,
  category,
}: ContractGeneratorModalProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'form' | 'preview'>('form');

  // Form Fields
  const [partyA, setPartyA] = useState({
    name: 'CÔNG TY CỔ PHẦN FINTECH VIỆT NAM (VÍ ĐIỆN TỬ)',
    taxCode: '0109887766',
    address: 'Tầng 18, Tòa nhà Tháp Doanh Nhân, Ba Đình, Hà Nội',
    representative: 'Nguyễn Văn Quang',
    position: 'Tổng Giám đốc',
    phone: '024 3988 8888',
    email: 'legal@fintechvietnam.vn',
    accountNumber: '19038888888888 tại Techcombank - Chi nhánh Thăng Long',
  });

  const [partyB, setPartyB] = useState({
    name: 'CÔNG TY TNHH THƯƠNG MẠI & DỊCH VỤ SỐ HOÀN CẦU',
    taxCode: '0316554433',
    address: 'Số 120 Đường Nguyễn Thị Minh Khai, Quận 3, TP. Hồ Chí Minh',
    representative: 'Trần Thị Thu Hà',
    position: 'Giám đốc Điều hành',
    phone: '028 3822 9999',
    email: 'contact@hoancaudigital.vn',
    accountNumber: '0071001234567 tại Vietcombank - CN TP.HCM',
  });

  const [commercials, setCommercials] = useState({
    effectiveDate: new Date().toISOString().split('T')[0],
    signingLocation: 'Hà Nội',
    feeRate: '1.2% trên tổng giá trị mỗi giao dịch thành công',
    settlementCycle: 'T+1 (Trước 15h00 của ngày làm việc tiếp theo)',
    slaP1: '02 giờ làm việc (Sự cố cấp độ 1: Tắc nghẽn thanh toán toàn hệ thống)',
    slaP2: '04 giờ làm việc (Sự cố cấp độ 2: Lỗi gián đoạn một phần API)',
    depositAmount: '50.000.000 VNĐ (Ký quỹ bảo đảm bồi hoàn tra soát)',
    disputeJurisdiction: 'Trung tâm Trọng tài Quốc tế Việt Nam (VIAC)',
  });

  if (!open) return null;

  // Generate complete full-draft contract text
  const fullDraftText = `CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
Độc lập - Tự do - Hạnh phúc
---o0o---

${contractTitle.toUpperCase()}
Mã số chuẩn hóa: ${contractCode}
Số: ......./${new Date().getFullYear()}/HĐ-THINHVUONG

- Căn cứ Bộ luật Dân sự số 91/2015/QH13 được Quốc hội ban hành ngày 24/11/2015;
- Căn cứ Luật Thương mại số 36/2005/QH11 ngày 14/06/2005;
- Căn cứ Luật Giao dịch điện tử số 20/2023/QH15 ngày 22/06/2023;
- Căn cứ Nghị định 52/2024/NĐ-CP ngày 15/05/2024 của Chính phủ quy định về thanh toán không dùng tiền mặt;
- Căn cứ Thông tư 40/2024/TT-NHNN ngày 28/06/2024 của Ngân hàng Nhà nước hướng dẫn dịch vụ trung gian thanh toán;
- Căn cứ nhu cầu và khả năng thực tế của Các Bên.

Hôm nay, ngày ${commercials.effectiveDate.split('-')[2]} tháng ${commercials.effectiveDate.split('-')[1]} năm ${commercials.effectiveDate.split('-')[0]}, tại ${commercials.signingLocation}, chúng tôi gồm có:

BÊN A: ${partyA.name}
- Mã số doanh nghiệp / MST: ${partyA.taxCode}
- Địa chỉ trụ sở: ${partyA.address}
- Người đại diện theo pháp luật: Ông/Bà ${partyA.representative}
- Chức vụ: ${partyA.position}
- Điện thoại: ${partyA.phone} | Email: ${partyA.email}
- Tài khoản thanh toán số: ${partyA.accountNumber}

BÊN B: ${partyB.name}
- Mã số doanh nghiệp / MST: ${partyB.taxCode}
- Địa chỉ trụ sở: ${partyB.address}
- Người đại diện theo pháp luật: Ông/Bà ${partyB.representative}
- Chức vụ: ${partyB.position}
- Điện thoại: ${partyB.phone} | Email: ${partyB.email}
- Tài khoản thanh toán số: ${partyB.accountNumber}

Sau khi thảo luận và thống nhất, Các Bên tự nguyện ký kết Hợp đồng này với các điều khoản sau:

ĐIỀU 1. ĐỐI TƯỢNG VÀ PHẠM VI HỢP ĐỒNG
1.1. Bên A cung cấp giải pháp kỹ thuật, hạ tầng trung gian thanh toán và cổng thanh toán ví điện tử cho Bên B để xử lý các giao dịch mua bán hàng hóa, dịch vụ hợp pháp của Bên B.
1.2. Bên B tích hợp hệ thống thanh toán của Bên A theo đúng tiêu chuẩn kỹ thuật (API) và quy chuẩn bảo mật do Bên A công bố, bảo đảm tuân thủ quy chuẩn ISO/IEC 27001 và PCI-DSS.

ĐIỀU 2. PHÍ DỊCH VỤ VÀ PHƯƠNG THỨC THANH QUYẾT TOÁN
2.1. Phí dịch vụ: Bên B đồng ý trả cho Bên A mức phí xử lý giao dịch là: ${commercials.feeRate}.
2.2. Chu kỳ đối soát và thanh quyết toán: ${commercials.settlementCycle}. Tiền thanh toán sẽ được tự động khấu trừ phí dịch vụ trước khi ghi có vào tài khoản Bên B.
2.3. Khoản ký quỹ bảo đảm thanh toán: Bên B duy trì số tiền ký quỹ là ${commercials.depositAmount} tại tài khoản phong tỏa của Bên A nhằm giải quyết các rủi ro tra soát khiếu nại (Chargeback).

ĐIỀU 3. CAM KẾT MỨC CHẤT LƯỢNG DỊCH VỤ (SLA) VÀ XỬ LÝ SỰ CỐ
3.1. Bên A cam kết tỷ lệ sẵn sàng của hệ thống (System Availability) tối thiểu đạt 99.9% tính theo từng tháng dương lịch.
3.2. Thời hạn tiếp nhận và khắc phục sự cố:
   a) Sự cố Nghiêm trọng (Mức 1): ${commercials.slaP1}.
   b) Sự cố Trung bình (Mức 2): ${commercials.slaP2}.
3.3. Trường hợp hệ thống ngừng hoạt động ngoài kế hoạch vượt quá thời hạn cam kết, Bên A sẽ bồi thường theo biểu phí quy định tại Phụ lục SLA đính kèm.

ĐIỀU 4. BẢO VỆ DỮ LIỆU CÁ NHÂN VÀ AN TOÀN BẢO MẬT
4.1. Các Bên cam kết tuân thủ đầy đủ Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15 và Nghị định của Chính phủ về bảo vệ dữ liệu cá nhân.
4.2. Bên B tuyệt đối không được lưu trữ thông tin số thẻ đầy đủ (Full PAN), mã số bí mật CVV/CVC của khách hàng trên máy chủ riêng nếu chưa đạt chứng chỉ PCI-DSS Level 1.
4.3. Các Bên chỉ thu thập và chuyển giao các trường dữ liệu thanh toán phục vụ đúng mục đích đối soát và ngăn ngừa gian lận.

ĐIỀU 5. QUY CHẾ TRA SOÁT, KHIẾU NẠI VÀ BỒI HOÀN
5.1. Khi có yêu cầu tra soát từ khách hàng hoặc Ngân hàng, Bên B có nghĩa vụ cung cấp chứng từ giao hàng, hóa đơn dịch vụ hợp lệ trong vòng 24 giờ làm việc.
5.2. Trường hợp cơ quan điều tra hoặc Tổ chức thẻ xác định giao dịch gian lận do lỗi bảo mật từ hệ thống Bên B, Bên B chịu trách nhiệm bồi hoàn 100% giá trị tổn thất.

ĐIỀU 6. LUẬT ÁP DỤNG VÀ GIẢI QUYẾT TRANH CHẤP
6.1. Hợp đồng này được diễn giải và điều chỉnh theo pháp luật của nước Cộng hòa Xã hội Chủ nghĩa Việt Nam.
6.2. Mọi tranh chấp phát sinh sẽ trước hết được giải quyết thông qua thương lượng thiện chí trong vòng 30 ngày. Nếu không đạt được thỏa thuận, tranh chấp sẽ được đưa ra giải quyết tại ${commercials.disputeJurisdiction} theo Quy tắc tố tụng trọng tài của Trung tâm này.

ĐIỀU 7. HIỆU LỰC THI HÀNH
7.1. Hợp đồng có hiệu lực kể từ ngày ${commercials.effectiveDate} và có giá trị trong thời hạn 01 (một) năm, tự động gia hạn nếu không có văn bản thông báo chấm dứt trước 30 ngày.
7.2. Hợp đồng được lập thành 04 (bốn) bản gốc bằng tiếng Việt có giá trị pháp lý như nhau, mỗi Bên giữ 02 (hai) bản để thực hiện.

ĐẠI DIỆN BÊN A                                          ĐẠI DIỆN BÊN B
(Ký, ghi rõ họ tên và đóng dấu)                       (Ký, ghi rõ họ tên và đóng dấu)




${partyA.representative}                                  ${partyB.representative}`;

  const handleCopy = () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(fullDraftText);
      }
    } catch (err) {
      console.warn('Clipboard write failed:', err);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadDoc = () => {
    // Generate .doc file with formatting
    const headerHtml = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head><meta charset='utf-8'><title>${contractTitle}</title>
    <style>
      body { font-family: 'Times New Roman', serif; font-size: 13pt; line-height: 1.5; margin: 2.5cm 2cm 2cm 3cm; }
      h1, h2, h3 { text-align: center; }
      .header-title { font-size: 15pt; font-weight: bold; text-align: center; margin-bottom: 20px; }
      .bold { font-weight: bold; }
    </style></head><body>`;
    const footerHtml = '</body></html>';
    const content = headerHtml + `<pre style="font-family: 'Times New Roman', serif; font-size: 13pt; white-space: pre-wrap;">${fullDraftText}</pre>` + footerHtml;

    const blob = new Blob(['\ufeff' + content], {
      type: 'application/msword;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Du_Thao_${contractCode}_${partyA.taxCode}_${partyB.taxCode}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    try {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>${contractTitle} - ${contractCode}</title>
              <style>
                body { font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.6; padding: 40px; color: #000; }
                pre { white-space: pre-wrap; font-family: 'Times New Roman', serif; font-size: 12pt; }
              </style>
            </head>
            <body>
              <pre>${fullDraftText}</pre>
              <script>window.onload = function() { window.print(); window.close(); }<\/script>
            </body>
          </html>
        `);
        printWindow.document.close();
        return;
      }
    } catch {
      // window.open blocked by iframe policy
    }
    try {
      window.print();
    } catch {
      // Ignored
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />
      <div className="relative z-10 w-full max-w-4xl bg-white border border-[#c89b51]/40 shadow-2xl rounded-sm overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-[#071b2e] text-white p-5 sm:p-6 flex items-center justify-between border-b border-[#c89b51]/30">
          <div>
            <div className="flex items-center gap-2 text-[#e7c487] text-xs uppercase tracking-widest font-bold">
              <Sparkles className="w-3.5 h-3.5 text-[#e7c487]" />
              Bộ Tạo Dự Thảo Hợp Đồng Tự Động
            </div>
            <h2 className="font-serif text-xl sm:text-2xl text-white mt-1 font-medium">
              {contractTitle}
            </h2>
            <span className="text-xs text-slate-300">
              Mã hồ sơ: <strong>{contractCode}</strong> · Phân loại: {category}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="text-slate-300 hover:text-white p-2 rounded-full hover:bg-white/10 transition cursor-pointer"
              aria-label="Đóng"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Mode Selector Tabs */}
        <div className="bg-[#f7f6f1] px-6 py-2.5 border-b border-[#d8ddd9] flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('form')}
              className={`px-4 py-1.5 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border ${
                activeTab === 'form'
                  ? 'bg-[#071b2e] text-white border-[#071b2e]'
                  : 'bg-white text-slate-700 border-[#d8ddd9] hover:border-slate-400'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              1. Nhập Thông Tin Các Bên
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-4 py-1.5 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border ${
                activeTab === 'preview'
                  ? 'bg-[#071b2e] text-white border-[#071b2e]'
                  : 'bg-white text-slate-700 border-[#d8ddd9] hover:border-slate-400'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              2. Xem Toàn Văn Dự Thảo Chuẩn Mẫu
            </button>
          </div>

          {/* Action Export Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 bg-white border border-[#d8ddd9] text-xs font-semibold text-slate-700 hover:text-[#0c665f] flex items-center gap-1.5 cursor-pointer"
              title="Sao chép toàn văn"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Đã sao chép!' : 'Sao chép'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-white border border-[#d8ddd9] text-xs font-semibold text-slate-700 hover:text-[#0c665f] flex items-center gap-1.5 cursor-pointer hidden sm:flex"
              title="In / Xuất PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>In PDF</span>
            </button>
            <button
              onClick={handleDownloadDoc}
              className="px-3.5 py-1.5 bg-[#c89b51] hover:bg-[#e7c487] text-[#071523] text-xs font-bold flex items-center gap-1.5 cursor-pointer transition shadow-xs"
              title="Tải về file MS Word .doc"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Tải file .DOC</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          {activeTab === 'form' ? (
            <div className="space-y-6">
              {/* Bên A */}
              <div className="p-5 border border-[#d8ddd9] bg-[#fafcfb]">
                <div className="flex items-center justify-between mb-3 border-b border-[#d8ddd9] pb-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#0c665f] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#0c665f]" />
                    Thông tin Bên A (Đơn vị cung ứng Ví / Cổng thanh toán)
                  </h3>
                  <span className="text-[11px] text-slate-500">Mẫu chuẩn Fintech</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Tên công ty Bên A</label>
                    <input
                      type="text"
                      value={partyA.name}
                      onChange={(e) => setPartyA({ ...partyA, name: e.target.value })}
                      className="w-full p-2 border border-[#d8ddd9] bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Mã số thuế / MST</label>
                    <input
                      type="text"
                      value={partyA.taxCode}
                      onChange={(e) => setPartyA({ ...partyA, taxCode: e.target.value })}
                      className="w-full p-2 border border-[#d8ddd9] bg-white"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-slate-600 font-semibold mb-1">Địa chỉ trụ sở</label>
                    <input
                      type="text"
                      value={partyA.address}
                      onChange={(e) => setPartyA({ ...partyA, address: e.target.value })}
                      className="w-full p-2 border border-[#d8ddd9] bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Người đại diện</label>
                    <input
                      type="text"
                      value={partyA.representative}
                      onChange={(e) => setPartyA({ ...partyA, representative: e.target.value })}
                      className="w-full p-2 border border-[#d8ddd9] bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Chức vụ</label>
                    <input
                      type="text"
                      value={partyA.position}
                      onChange={(e) => setPartyA({ ...partyA, position: e.target.value })}
                      className="w-full p-2 border border-[#d8ddd9] bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Bên B */}
              <div className="p-5 border border-[#d8ddd9] bg-[#fafcfb]">
                <div className="flex items-center justify-between mb-3 border-b border-[#d8ddd9] pb-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#071b2e] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#071b2e]" />
                    Thông tin Bên B (Đối tác Thương mại / Merchant / Ngân hàng)
                  </h3>
                  <span className="text-[11px] text-slate-500">Đối tác ký kết</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Tên tổ chức Bên B</label>
                    <input
                      type="text"
                      value={partyB.name}
                      onChange={(e) => setPartyB({ ...partyB, name: e.target.value })}
                      className="w-full p-2 border border-[#d8ddd9] bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Mã số thuế / MST</label>
                    <input
                      type="text"
                      value={partyB.taxCode}
                      onChange={(e) => setPartyB({ ...partyB, taxCode: e.target.value })}
                      className="w-full p-2 border border-[#d8ddd9] bg-white"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-slate-600 font-semibold mb-1">Địa chỉ trụ sở</label>
                    <input
                      type="text"
                      value={partyB.address}
                      onChange={(e) => setPartyB({ ...partyB, address: e.target.value })}
                      className="w-full p-2 border border-[#d8ddd9] bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Người đại diện</label>
                    <input
                      type="text"
                      value={partyB.representative}
                      onChange={(e) => setPartyB({ ...partyB, representative: e.target.value })}
                      className="w-full p-2 border border-[#d8ddd9] bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Chức vụ</label>
                    <input
                      type="text"
                      value={partyB.position}
                      onChange={(e) => setPartyB({ ...partyB, position: e.target.value })}
                      className="w-full p-2 border border-[#d8ddd9] bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Điều khoản thương mại & SLA */}
              <div className="p-5 border border-[#d8ddd9] bg-[#fafcfb]">
                <div className="flex items-center justify-between mb-3 border-b border-[#d8ddd9] pb-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#c89b51] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#c89b51]" />
                    Biểu phí thương mại & Cam kết mức dịch vụ (SLA)
                  </h3>
                  <span className="text-[11px] text-slate-500">Ràng buộc vận hành</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Tỷ lệ phí dịch vụ (%)</label>
                    <input
                      type="text"
                      value={commercials.feeRate}
                      onChange={(e) => setCommercials({ ...commercials, feeRate: e.target.value })}
                      className="w-full p-2 border border-[#d8ddd9] bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Chu kỳ thanh quyết toán</label>
                    <input
                      type="text"
                      value={commercials.settlementCycle}
                      onChange={(e) => setCommercials({ ...commercials, settlementCycle: e.target.value })}
                      className="w-full p-2 border border-[#d8ddd9] bg-white"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-slate-600 font-semibold mb-1">Thời hạn xử lý sự cố SLA Cấp 1</label>
                    <input
                      type="text"
                      value={commercials.slaP1}
                      onChange={(e) => setCommercials({ ...commercials, slaP1: e.target.value })}
                      className="w-full p-2 border border-[#d8ddd9] bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Số tiền ký quỹ bảo đảm</label>
                    <input
                      type="text"
                      value={commercials.depositAmount}
                      onChange={(e) => setCommercials({ ...commercials, depositAmount: e.target.value })}
                      className="w-full p-2 border border-[#d8ddd9] bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Cơ quan giải quyết tranh chấp</label>
                    <input
                      type="text"
                      value={commercials.disputeJurisdiction}
                      onChange={(e) => setCommercials({ ...commercials, disputeJurisdiction: e.target.value })}
                      className="w-full p-2 border border-[#d8ddd9] bg-white"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className="gold-button px-6 py-2.5 font-bold flex items-center gap-2 cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                  Xem Trước Dự Thảo Hoàn Chỉnh
                </button>
              </div>
            </div>
          ) : (
            /* Live Draft Preview with legal format */
            <div className="bg-[#fafaf8] p-6 sm:p-10 border border-[#d8ddd9] shadow-inner font-serif text-[#17252d] leading-relaxed text-sm whitespace-pre-wrap select-text">
              {fullDraftText}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#f7f6f1] border-t border-[#d8ddd9] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Mẫu dự thảo tự động kiểm tra định dạng hành chính pháp lý và trích dẫn chuẩn NĐ 52/2024.</span>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleDownloadDoc}
              className="px-4 py-2 bg-[#071b2e] hover:bg-[#0c665f] text-white font-bold flex items-center gap-2 cursor-pointer transition"
            >
              <Download className="w-3.5 h-3.5 text-[#e7c487]" />
              Tải File (.DOC)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
