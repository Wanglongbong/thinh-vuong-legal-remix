import { useState, type FormEvent } from 'react';
import { Calendar, CheckCircle2, Clock, Mail, Phone, Send, ShieldCheck, User, X } from 'lucide-react';

export function BookingModal({
  open,
  onClose,
  defaultService = 'Thành lập ví & Xin giấy phép NHNN',
}: {
  open: boolean;
  onClose: () => void;
  defaultService?: string;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    company: '',
    phone: '',
    email: '',
    service: defaultService,
    preferredDate: '',
    preferredTime: 'Sáng (09:00 - 11:30)',
    format: 'online', // 'online' | 'offline'
    notes: '',
  });

  if (!open) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative z-10 w-full max-w-2xl bg-white border border-[#c89b51]/40 shadow-2xl rounded-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#071b2e] text-white p-6 sm:p-8 flex justify-between items-start border-b border-[#c89b51]/30">
          <div>
            <span className="text-[#e7c487] text-xs uppercase tracking-widest font-bold flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#e7c487]" />
              Dịch vụ Pháp lý Cao cấp · Thịnh Vượng Legal
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-white mt-2 font-medium">
              Đặt Lịch Tư Vấn Doanh Nghiệp
            </h2>
            <p className="text-slate-300 text-sm mt-1">
              Trao đổi chuyên sâu cùng chuyên gia pháp lý và công nghệ Fintech.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white p-2 rounded-full hover:bg-white/10 transition cursor-pointer"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto">
          {submitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-[#edf3f2] text-[#0c665f] rounded-full mx-auto flex items-center justify-center mb-4">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="font-serif text-2xl text-[#071b2e] font-semibold">
                Đã tiếp nhận yêu cầu đặt lịch!
              </h3>
              <p className="text-slate-600 text-sm max-w-md mx-auto mt-2 leading-relaxed">
                Cảm ơn <strong>{formData.fullName}</strong>. Chuyên viên phụ trách dự án Fintech từ Thịnh Vượng Legal sẽ liên hệ xác nhận lịch làm việc trong vòng <strong>02 giờ làm việc</strong> qua số điện thoại <strong>{formData.phone}</strong>.
              </p>
              <div className="mt-6 p-4 bg-[#f7f6f1] border border-[#d8ddd9] text-left text-xs text-slate-700 space-y-1.5 max-w-md mx-auto">
                <div className="flex justify-between">
                  <span className="text-slate-500">Dịch vụ:</span>
                  <span className="font-semibold">{formData.service}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Hình thức:</span>
                  <span className="font-semibold">
                    {formData.format === 'online' ? 'Tư vấn trực tuyến (Google Meet)' : 'Trực tiếp tại văn phòng'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Thời gian dự kiến:</span>
                  <span className="font-semibold">
                    {formData.preferredDate || 'Sớm nhất có thể'} ({formData.preferredTime})
                  </span>
                </div>
              </div>
              <div className="mt-8">
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    onClose();
                  }}
                  className="gold-button px-8 py-2.5 font-bold cursor-pointer"
                >
                  Hoàn tất & Đóng
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Họ và tên đại diện *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                    <input
                      required
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="VD: Nguyễn Văn An"
                      className="w-full pl-9 pr-3 py-2.5 border border-[#d8ddd9] text-sm focus:border-[#0c665f] focus:outline-none bg-[#fdfdfb]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Tên doanh nghiệp / Dự án
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="VD: Fintech Pay VN JSC"
                    className="w-full px-3 py-2.5 border border-[#d8ddd9] text-sm focus:border-[#0c665f] focus:outline-none bg-[#fdfdfb]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Số điện thoại liên hệ *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                    <input
                      required
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="0988 123 456"
                      className="w-full pl-9 pr-3 py-2.5 border border-[#d8ddd9] text-sm focus:border-[#0c665f] focus:outline-none bg-[#fdfdfb]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Email công việc *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                    <input
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="contact@company.vn"
                      className="w-full pl-9 pr-3 py-2.5 border border-[#d8ddd9] text-sm focus:border-[#0c665f] focus:outline-none bg-[#fdfdfb]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Phạm vi dịch vụ tư vấn
                </label>
                <select
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  className="w-full px-3 py-2.5 border border-[#d8ddd9] text-sm focus:border-[#0c665f] focus:outline-none bg-[#fdfdfb]"
                >
                  <option value="Thành lập ví & Xin giấy phép NHNN">
                    1. Đề án thành lập ví điện tử & Giấy phép NHNN (Nghị định 52/2024)
                  </option>
                  <option value="Tài khoản đảm bảo thanh toán & Ngân hàng hợp tác">
                    2. Hợp đồng Tài khoản bảo đảm thanh toán & Kết nối Ngân hàng
                  </option>
                  <option value="Hợp đồng API & Đơn vị chấp nhận thanh toán (Merchant)">
                    3. Bộ hợp đồng tích hợp API & Thỏa thuận B2B Merchant
                  </option>
                  <option value="Bảo vệ dữ liệu cá nhân & Tuân thủ Luật 91/2025/QH15">
                    4. Hồ sơ bảo vệ dữ liệu cá nhân (DPIA) & An ninh mạng
                  </option>
                  <option value="Xử lý sự cố, Gian lận & Tra soát khiếu nại">
                    5. Quy trình tra soát, bồi thường & Xử lý rủi ro giao dịch
                  </option>
                  <option value="Rà soát toàn diện hệ thống hợp đồng hiện có">
                    6. Rà soát & Tái cấu trúc khung hợp đồng pháp lý Fintech
                  </option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Ngày mong muốn
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                    <input
                      type="date"
                      value={formData.preferredDate}
                      onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 border border-[#d8ddd9] text-sm focus:border-[#0c665f] focus:outline-none bg-[#fdfdfb]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Khung giờ phù hợp
                  </label>
                  <div className="relative">
                    <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                    <select
                      value={formData.preferredTime}
                      onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 border border-[#d8ddd9] text-sm focus:border-[#0c665f] focus:outline-none bg-[#fdfdfb]"
                    >
                      <option value="Sáng (09:00 - 11:30)">Buổi sáng: 09:00 - 11:30</option>
                      <option value="Chiều (14:00 - 17:00)">Buổi chiều: 14:00 - 17:00</option>
                      <option value="Khung giờ linh hoạt theo sắp xếp">Linh hoạt theo lịch chuyên gia</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Hình thức gặp
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label
                    className={`flex items-center gap-2 p-3 border cursor-pointer text-xs font-semibold ${
                      formData.format === 'online'
                        ? 'border-[#0c665f] bg-[#edf3f2] text-[#071b2e]'
                        : 'border-[#d8ddd9] bg-white text-slate-600'
                    }`}
                  >
                    <input
                      type="radio"
                      name="format"
                      value="online"
                      checked={formData.format === 'online'}
                      onChange={() => setFormData({ ...formData, format: 'online' })}
                      className="text-[#0c665f]"
                    />
                    Tư vấn Online (Google Meet)
                  </label>
                  <label
                    className={`flex items-center gap-2 p-3 border cursor-pointer text-xs font-semibold ${
                      formData.format === 'offline'
                        ? 'border-[#0c665f] bg-[#edf3f2] text-[#071b2e]'
                        : 'border-[#d8ddd9] bg-white text-slate-600'
                    }`}
                  >
                    <input
                      type="radio"
                      name="format"
                      value="offline"
                      checked={formData.format === 'offline'}
                      onChange={() => setFormData({ ...formData, format: 'offline' })}
                      className="text-[#0c665f]"
                    />
                    Gặp trực tiếp tại văn phòng
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Ghi chú hoặc yêu cầu trọng tâm
                </label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Nêu vắn tắt tình trạng pháp lý hiện tại hoặc câu hỏi mấu chốt bạn muốn làm rõ..."
                  className="w-full px-3 py-2 border border-[#d8ddd9] text-sm focus:border-[#0c665f] focus:outline-none bg-[#fdfdfb] resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full min-h-[48px] bg-[#071b2e] hover:bg-[#0c665f] text-white font-bold flex items-center justify-center gap-2 text-sm transition shadow-md cursor-pointer"
                >
                  <Send className="w-4 h-4 text-[#e7c487]" />
                  Xác Nhận Đặt Lịch Tư Vấn Doanh Nghiệp
                </button>
                <p className="text-center text-xs text-slate-500 mt-2">
                  Cam kết bảo mật thông tin kinh doanh và nội dung trao đổi theo thỏa thuận NDA.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
