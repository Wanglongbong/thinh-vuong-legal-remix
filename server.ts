import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import { diffLines } from 'diff';
import { contracts } from './src/lib/site-data';
import { forumCategories, forumUnavailable } from './src/lib/forum-shared';
import {
  forumConfigured,
  forumDatabase,
  forumIdentity,
  forumIpHash,
  publicForumRow,
} from './src/server/forum-database';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;
app.set('trust proxy', 1);

app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-gemini-key');
  if (_req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

const companyAndTeamKnowledgeBase = `THÔNG TIN HÃNG LUẬT THỊNH VƯỢNG LEGAL & ĐỀ ÁN NGHIÊN CỨU NHÓM 13:
1. TỔNG QUAN HÃNG LUẬT & ĐỀ ÁN:
- Tên đơn vị: Hãng luật Thịnh Vượng Legal (Đơn vị nghiên cứu & chuẩn hóa pháp lý thuộc Đề án Nhóm 13).
- Chuyên môn: Pháp lý thành lập, cấp phép Ngân hàng Nhà nước (NHNN) và vận hành doanh nghiệp cung ứng dịch vụ Ví điện tử & Fintech tại Việt Nam.
- Sản phẩm cốt lõi:
  + Thư viện 20 mẫu hợp đồng chuẩn hóa toàn diện (Merchant, Người dùng, Ký quỹ 1:1, API, Thuê Cloud, NDA, Cổ đông, Lao động...).
  + Lộ trình tư vấn cấp phép 6 giai đoạn (từ cơ cấu vốn 50 tỷ đến thẩm định an toàn hệ thống cấp độ 3, eKYC và nộp hồ sơ NHNN).
  + Trợ lý AI và Công cụ rà soát, soi bẫy điều khoản hợp đồng thông minh.
- Trụ sở chính: Tòa nhà Bitexco Financial Tower, Số 2 Hải Triều, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh.
- Chi nhánh Hà Nội: Tòa nhà Lotte Center, 54 Liễu Giai, Phường Cống Vị, Quận Ba Đình, Hà Nội.
- Kênh liên hệ:
  + Hotline / Zalo chính thức: 0988 123 456
  + Điện thoại bàn: (028) 3822 8888
  + Email tiếp nhận hồ sơ: contact@thinhvuonglegal.vn
  + Thời gian làm việc: Thứ Hai - Thứ Sáu (08:00 - 18:00).

2. HỒ SƠ 12 THÀNH VIÊN BAN NGHIÊN CỨU ĐỀ ÁN (NHÓM 13):
1) Đoàn Anh Phương (Mã sinh viên: 26A4062550)
   - Vai trò: Trưởng nhóm.
   - Lĩnh vực phụ trách: Phân tích tổng quan thị trường ví điện tử & mô hình thanh toán di động tại Việt Nam.
2) Vũ Anh Quân (Mã sinh viên: 26A4062552)
   - Vai trò: Tích hợp API & Tổng hợp, Web.
   - Lĩnh vực phụ trách: Kiến trúc pháp lý cổng thanh toán API, Webhook, cam kết mức dịch vụ SLA và an toàn hệ thống kết nối ngân hàng.
3) Kiều Hoài Thu (Mã sinh viên: 26A4060739)
   - Vai trò: Chuyên gia Điều lệ & ĐHĐCĐ.
   - Lĩnh vực phụ trách: Quản trị công ty đại chúng, thẩm quyền biểu quyết và phương án cơ cấu vốn điều lệ thực góp 50 tỷ đồng.
4) Trần Thị Thơ (Mã sinh viên: 26A4060737)
   - Vai trò: Chuyên gia Mở ví & Hợp đồng Giám đốc.
   - Lĩnh vực phụ trách: Chuẩn hóa điều khoản mở/sử dụng ví người dùng cá nhân và phân định thẩm quyền Ban Điều hành.
5) Lê Phương Thảo (Mã sinh viên: 26A4062560)
   - Vai trò: Chuyên gia Hợp đồng Lao động & Liên kết Ngân hàng.
   - Lĩnh vực phụ trách: Ràng buộc an ninh dữ liệu nhân sự cốt lõi và pháp lý luồng nạp rút liên kết tài khoản/thẻ ngân hàng.
6) Lê Thị Hồng Nhung (Mã sinh viên: 26A4062545)
   - Vai trò: Chuyên gia Thuê ngoài CNTT & Merchant.
   - Lĩnh vực phụ trách: Kiểm soát hợp đồng nhà thầu máy chủ đám mây (Cloud) và hợp đồng đơn vị chấp nhận thanh toán (Merchant POS/Online).
7) Phạm Dạ Thảo (Mã sinh viên: 26A4060735)
   - Vai trò: Chuyên gia Thành lập Doanh nghiệp & Hợp đồng BCC.
   - Lĩnh vực phụ trách: Hồ sơ pháp lý tiền cấp phép doanh nghiệp và phân định ranh giới hợp đồng hợp tác kinh doanh BCC.
8) Nguyễn Huy Thái (Mã sinh viên: 26A4062558)
   - Vai trò: Chuyên gia Tra soát Khiếu nại & Hồ sơ Sự cố.
   - Lĩnh vực phụ trách: Quy trình giải quyết tranh chấp tài chính 3 cấp và quy trình phản ứng xử lý sự cố an ninh mạng.
9) Phạm Văn Quang (Mã sinh viên: 26A4062551)
   - Vai trò: Chuyên gia Bảo mật & Sở hữu trí tuệ.
   - Lĩnh vực phụ trách: Bảo vệ quyền sở hữu mã nguồn ví điện tử, thỏa thuận bảo mật NDA và đăng ký bản quyền phần mềm kỹ thuật.
10) Trần Thị Thùy (Mã sinh viên: 26A4062565)
    - Vai trò: Chuyên gia Thỏa thuận Cổ đông (SHA).
    - Lĩnh vực phụ trách: Cam kết tiến độ góp vốn, cơ chế xử lý bế tắc Deadlock và thỏa thuận cổ đông sáng lập.
11) Vương Thu Thủy (Mã sinh viên: 26A4062567)
    - Vai trò: Chuyên gia Khuyến mại & Bảo vệ Dữ liệu Cá nhân.
    - Lĩnh vực phụ trách: Tuân thủ Luật Bảo vệ dữ liệu cá nhân 91/2025/QH15, lập báo cáo DPIA và quy chế chương trình khuyến mại ví.
12) Vũ Phương Thảo (Mã sinh viên: 26A4060736)
    - Vai trò: Chuyên gia TK Bảo đảm Thanh toán & Cập nhật Pháp lý.
    - Lĩnh vực phụ trách: Cơ chế ký quỹ bảo đảm thanh toán tỷ lệ 1:1 tại Ngân hàng Thương mại và cập nhật văn bản pháp luật NHNN.`;

const legalKnowledgeBase = `CƠ SỞ PHÁP LÝ CHUẨN MỰC FINTECH & TRUNG GIAN THANH TOÁN VIỆT NAM (2025 - 2026):
1. NGHỊ ĐỊNH 52/2024/NĐ-CP (Thanh toán không dùng tiền mặt):
- Điều 22: Điều kiện cấp Giấy phép cung ứng dịch vụ trung gian thanh toán: Vốn điều lệ thực góp tối thiểu 50 tỷ đồng; Người đại diện pháp luật, Tổng giám đốc phải có bằng đại học trở lên ngành kinh tế, tài chính, luật hoặc CNTT và tối thiểu 03 năm kinh nghiệm; Đề án kinh doanh khả thi.
- Điều 24: Hồ sơ đề nghị cấp giấy phép: Đơn đề nghị Mẫu 01, Biên bản họp/Nghị quyết HĐQT, Giấy tờ chứng minh vốn thực góp, Hồ sơ nhân sự chủ chốt, Bản thuyết minh giải pháp kỹ thuật.
- Điều 25: Đảm bảo khả năng thanh toán đối với dịch vụ ví điện tử: Mở tài khoản đảm bảo thanh toán tại Ngân hàng thương mại; Duy trì tổng số dư tài khoản đảm bảo thanh toán KHÔNG ĐƯỢC THẤP HƠN tổng số dư của tất cả các ví điện tử của khách hàng; Nghiêm cấm sử dụng tiền trên tài khoản đảm bảo thanh toán vào mục đích khác hoặc thấu chi.

2. THÔNG TƯ 40/2024/TT-NHNN (Hướng dẫn dịch vụ trung gian thanh toán):
- Điều 9: Nạp, rút tiền vào/ra ví điện tử: Phải thực hiện thông qua tài khoản thanh toán hoặc thẻ ghi nợ của chính chủ khách hàng mở tại ngân hàng hợp tác.
- Điều 10: Hạn mức giao dịch qua ví điện tử: Hạn mức tối đa áp dụng cho khách hàng cá nhân (100 triệu VNĐ/tháng cho mỗi ví), miễn trừ đối với tài khoản ví của đơn vị chấp nhận thanh toán (Merchant).
- Điều 11: Nhận biết khách hàng (eKYC): Thu thập CCCD gắn chip, đối soát Cơ sở dữ liệu quốc gia về dân cư và xác thực sinh trắc học khuôn mặt theo Quyết định 2345/QĐ-NHNN.

3. LUẬT BẢO VỆ DỮ LIỆU CÁ NHÂN 91/2025/QH15 & NGHỊ ĐỊNH 356/2025/NĐ-CP:
- Dữ liệu tài chính, sinh trắc học và lịch sử giao dịch thanh toán là "Dữ liệu cá nhân nhạy cảm".
- Doanh nghiệp ví bắt buộc lập Hồ sơ đánh giá tác động xử lý dữ liệu cá nhân (DPIA) nộp Cục An ninh mạng (A05) - Bộ Công an.
- Tuyệt đối cấm mua bán, chuyển giao trái phép dữ liệu thanh toán cho bên thứ ba vì mục đích quảng cáo hoặc chấm điểm tín dụng khi chưa có sự đồng ý riêng biệt.

4. HỆ THỐNG QUẢN TRỊ RỦI RO & BẢO MẬT:
- Hạ tầng kỹ thuật phải đạt Tiêu chuẩn bảo mật an toàn thông tin cấp độ 3 theo Nghị định 85/2016/NĐ-CP.
- Cổng thanh toán kết nối thẻ phải tuân thủ chứng chỉ bảo mật PCI-DSS Level 1.`;

const financialAndCommercialKnowledgeBase = `KIẾN THỨC TÀI CHÍNH, DOANH THU, CƠ CHẾ THU TIỀN, ĐẦU LƯƠNG & LỢI NHUẬN (PHẢN BIỆN HỘI ĐỒNG THẦY GIÁO & NHÀ ĐẦU TƯ):

1. CƠ CHẾ THU TIỀN: TRẢ CHO CÔNG TY HAY TRẢ THẲNG CHO LUẬT SƯ? TRẢ BAO NHIÊU TIỀN?
- NGUYÊN TẮC PHÁP LÝ BẮT BUỘC:
  + Căn cứ Điều 54, 55 Luật Luật sư 2006 (sửa đổi, bổ sung 2012) và Bộ Quy tắc Đạo đức và Ứng xử nghề nghiệp Luật sư Việt Nam: Hợp đồng dịch vụ pháp lý BẮT BUỘC ký kết giữa Khách hàng và TỔ CHỨC HÀNH NGHỀ LUẬT SƯ (Hãng luật Thịnh Vượng Legal - pháp nhân chính thức).
  + MỌI KHOẢN TIỀN THÙ LAO VÀ CHI PHÍ PHẢI CHUYỂN KHOẢN TRỰC TIẾP VÀO TÀI KHOẢN NGÂN HÀNG CỦA CÔNG TY LUẬT THỊNH VƯỢNG LEGAL. Công ty xuất hóa đơn giá trị gia tăng (VAT điện tử) hợp pháp cho khách hàng.
  + TUYỆT ĐỐI NGHIÊM CẤM TRẢ THẲNG CHO LUẬT SƯ HOẶC THÀNH VIÊN CÁ NHÂN.
- TẠI SAO KHÔNG TRẢ THẲNG CHO LUẬT SƯ CÁ NHÂN?
  (1) Trách nhiệm pháp lý & Bảo hiểm: Hãng luật chịu trách nhiệm vô hạn hoặc trong phạm vi tài sản của tổ chức, đồng thời có Bảo hiểm trách nhiệm nghề nghiệp luật sư bồi thường cho khách hàng nếu có sơ suất kỹ thuật. Luật sư cá nhân không có đủ năng lực tài chính bảo đảm.
  (2) Khấu trừ chi phí thuế TNDN: Doanh nghiệp chỉ được tính vào chi phí hợp lý khi có Hợp đồng với Hãng luật kèm Hóa đơn điện tử VAT và chứng từ thanh toán qua ngân hàng (chứng từ không dùng tiền mặt theo Luật Quản lý thuế).
  (3) Đạo đức nghề nghiệp: Luật sư nhận tiền riêng ngoài hợp đồng là hành vi vi phạm kỷ luật Đoàn Luật sư, có thể bị tước chứng chỉ hành nghề.

2. BIỂU PHÍ DỊCH VỤ THỰC TẾ & LỘ TRÌNH THANH TOÁN THEO TIẾN ĐỘ (MILESTONE BILLING):
- Mức phí dịch vụ tư vấn cấp phép trung gian thanh toán ví điện tử trọn gói:
  + Gói chuẩn (Doanh nghiệp đã sẵn sàng hạ tầng CNTT): 350.000.000 - 450.000.000 VNĐ.
  + Gói toàn diện (Setup hồ sơ vốn 50 tỷ, đề án an toàn cấp độ 3, soạn thảo 20 hợp đồng, eKYC, đồng hành giải trình NHNN): 500.000.000 - 650.000.000 VNĐ.
- Gói chuẩn hóa toàn diện 20 mẫu hợp đồng cốt lõi: 80.000.000 - 150.000.000 VNĐ.
- Phí tư vấn pháp lý thường xuyên (Retainer Fee hàng tháng): 25.000.000 - 45.000.000 VNĐ/tháng.
- Lộ trình giải ngân 5 đợt theo mốc nghiệm thu rõ ràng (không thu dồn 1 lần, an tâm đôi bên):
  + Đợt 1 (30%): Tạm ứng ngay sau khi ký Hợp đồng dịch vụ pháp lý và thống nhất đề cương giải pháp.
  + Đợt 2 (20%): Sau khi hoàn thành bộ 20 hợp đồng, hồ sơ vốn 50 tỷ và cơ cấu nhân sự chủ chốt.
  + Đợt 3 (20%): Sau khi thẩm định đề án an toàn cấp độ 3, quy trình eKYC và nộp hồ sơ chính thức tại NHNN (có giấy biên nhận nộp lưu).
  + Đợt 4 (20%): Sau khi NHNN kiểm tra thực tế điều kiện cơ sở vật chất, hạ tầng kỹ thuật và giải trình xong các nội dung yêu cầu.
  + Đợt 5 (10%): Sau khi NHNN trao Giấy phép cung ứng dịch vụ trung gian thanh toán chính thức.

3. CƠ CẤU ĐẦU LƯƠNG & PHÂN BỔ THU NHẬP 12 THÀNH VIÊN BAN NGHIÊN CỨU/LUẬT SƯ:
- Áp dụng mô hình chuẩn 4 tầng thu nhập của các hãng luật quốc tế (Partner - Associate Model):
  (1) LƯƠNG CỨNG VỊ TRÍ (BASE SALARY - Chi trả cố định hàng tháng):
      - Chủ nhiệm dự án / Managing Partner (Vũ Anh Quân): 35.000.000 - 45.000.000 VNĐ/tháng (chịu trách nhiệm pháp lý cao nhất, điều phối tổng thể, đối ngoại và ký duyệt hồ sơ).
      - Luật sư thành viên cấp cao / Senior Partner (Kiều Hoài Thu, Trần Thị Thơ, Lê Phương Thảo, Lê Thị Hồng Nhung): 25.000.000 - 32.000.000 VNĐ/tháng (phụ trách các trụ cột: Vốn 50 tỷ, Hợp đồng người dùng/giám đốc, Lao động/Liên kết ngân hàng, Cloud/Merchant).
      - Luật sư chuyên trách / Associate (Phạm Dạ Thảo, Nguyễn Huy Thái, Phạm Văn Quang, Trần Thị Thùy, Vương Thu Thủy, Vũ Phương Thảo, Đoàn Anh Phương): 16.000.000 - 22.000.000 VNĐ/tháng (chuyên trách soạn thảo, rà soát điều khoản, DPIA dữ liệu cá nhân, ký quỹ 1:1, tra soát sự cố, an ninh mã nguồn, nghiên cứu thị trường).
      - Trợ lý pháp lý & Thực tập sinh: 6.000.000 - 9.000.000 VNĐ/tháng.
  (2) THÙ LAO THEO VỤ VIỆC / DỰ ÁN (PROJECT SUCCESS FEE):
      - Trích 20% - 30% giá trị hợp đồng dịch vụ đã nghiệm thu để chia cho nhóm trực tiếp thụ lý dự án dựa trên số giờ làm việc (Man-hours) và hệ số đóng góp chuyên môn.
  (3) THƯỞNG KINH DOANH & HIỆU SUẤT (BUSINESS DEV & PERFORMANCE BONUS):
      - Thưởng 5% - 10% doanh thu hợp đồng nếu thành viên trực tiếp khai thác hoặc kết nối khách hàng doanh nghiệp mới.
      - Thưởng KPI khi hoàn thành hồ sơ vượt tiến độ hoặc xử lý thành công vụ việc tranh chấp phức tạp.
  (4) LỢI NHUẬN RÒNG & CỔ TỨC CUỐI NĂM (EQUITY DIVIDENDS):
      - Sau khi trừ chi phí vận hành (thuê văn phòng Bitexco/Lotte Center, thuế TNDN 20%, chi phí nền tảng AI/công nghệ, trích Quỹ dự phòng rủi ro nghề nghiệp 10%), toàn bộ lợi nhuận ròng được chia theo tỷ lệ vốn góp của các Partner sáng lập.

4. CHIẾN LƯỢC TẠO DOANH THU & SINH LỢI NHUẬN TRONG THỜI GIAN CHỜ CẤP PHÉP NHNN (6 - 12 THÁNG):
- HỎI: Thời gian xin cấp phép tại NHNN mất 6 đến 12 tháng, trong lúc đợi hồ sơ thì làm thế nào để vẫn kiếm được tiền và sinh lợi nhuận?
- TRẢ LỜI CHO CẢ 2 PHÍA:

  A. ĐỐI VỚI HÃNG LUẬT THỊNH VƯỢNG LEGAL:
  1) Dòng tiền theo mốc (Milestone Billing): Thu 50% - 70% tổng giá trị hợp đồng ngay trong các giai đoạn đầu khi hoàn thành việc chuẩn bị và nộp hồ sơ hợp lệ. Tiền về liên tục chứ không phải chờ đến khi có giấy phép mới được thu.
  2) Hợp đồng tư vấn pháp lý thường xuyên (Retainer): Thu đều đặn 25 - 45 triệu VNĐ/tháng trong suốt 6-12 tháng chờ đợi để giải trình hồ sơ theo công văn NHNN, rà soát hợp đồng nhân sự, xây dựng quy chế nội bộ.
  3) Đa dạng hóa danh mục dịch vụ:
     - Dịch vụ lập Báo cáo đánh giá tác động xử lý dữ liệu cá nhân (DPIA) theo Luật Bảo vệ dữ liệu cá nhân 91/2025/QH15 cho các đối tác TMĐT, bán lẻ, tài chính (30 - 60 triệu/hồ sơ).
     - Rà soát điều khoản hợp đồng cho các Merchant liên kết (3 - 8 triệu/hợp đồng).
     - Đào tạo tuân thủ phòng chống rửa tiền (AML/CFT) và bảo vệ dữ liệu nội bộ.
     - Cung cấp giải pháp Nền tảng AI Legal Copilot & Thư viện 20 mẫu hợp đồng bản quyền cho các doanh nghiệp vừa và nhỏ (mô hình SaaS).

  B. ĐỐI VỚI DOANH NGHIỆP / STARTUP VÍ ĐIỆN TỬ (KHÁCH HÀNG / NHÀ ĐẦU TƯ):
  1) Mô hình Hợp tác Kinh doanh (Hợp đồng BCC - Business Cooperation Contract):
     - Ký hợp đồng BCC với một tổ chức Trung gian thanh toán hoặc Ngân hàng ĐÃ CÓ GIẤY PHÉP ĐẦY ĐỦ để phát triển thị trường và kết nối các đơn vị chấp nhận thanh toán (Merchant). Doanh nghiệp ví thu được phí dịch vụ công nghệ và chia sẻ hoa hồng giao dịch từ sớm, đồng thời xây dựng trước tệp khách hàng mà không vi phạm quy định pháp luật.
  2) Cung cấp giải pháp phần mềm quản trị bán hàng & Loyalty (Tech Enabler):
     - Khai thác mảng công nghệ: Bán phần mềm quản lý đơn hàng POS, giải pháp tích hợp hóa đơn điện tử, tích điểm thưởng Loyalty cho các chuỗi bán lẻ. Doanh thu phần mềm (SaaS) phát sinh ngay lập tức.
  3) Tối ưu hóa lợi tức từ nguồn vốn điều lệ 50 tỷ đồng thực góp:
     - Trong thời gian thẩm duyệt hồ sơ, khoản vốn 50 tỷ đồng được gửi tiết kiệm kỳ hạn ngắn linh hoạt (1 - 3 tháng) hoặc chứng chỉ tiền gửi tại các Ngân hàng Thương mại lớn. Với mức lãi suất 4.5% - 5.5%/năm, khoản tiền này tạo ra dòng tiền lãi từ 180.000.000 - 230.000.000 VNĐ/tháng, đủ để chi trả toàn bộ tiền thuê văn phòng và duy trì đội ngũ R&D nòng cốt!
  4) Xây dựng mạng lưới Merchant và gia tăng định giá để gọi vốn (Valuation Growth):
     - Doanh nghiệp ký kết hàng loạt Biên bản ghi nhớ (MOU) và Hợp đồng nguyên tắc với đối tác bán hàng, chuẩn bị sẵn tệp người dùng sẵn sàng kích hoạt ngay khi giấy phép được trao. Điều này giúp nâng cao định giá doanh nghiệp và gọi vốn các vòng hạt giống / Pre-Series A từ các quỹ đầu tư mạo hiểm ngay trong giai đoạn chờ cấp phép.

5. BỘ KỊCH BẢN TRẢ LỜI PHẢN BIỆN KHI THẦY GIÁO & NHÀ ĐẦU TƯ "XOAY" CÂU HỎI:
- CÂU HỎI: "Tại sao không để khách hàng trả tiền thẳng cho Luật sư trực tiếp làm việc để giảm 10% - 20% chi phí?"
  -> TRẢ LỜI: Trả thẳng cho cá nhân là vi phạm pháp luật (Luật Luật sư) và quy tắc đạo đức. Cá nhân luật sư không có bảo hiểm trách nhiệm nghề nghiệp và không thể xuất hóa đơn VAT để doanh nghiệp hạch toán chi phí hợp lý. Khi có rủi ro pháp lý, khách hàng sẽ chịu thiệt hại lớn.
- CÂU HỎI: "Nếu hồ sơ bị NHNN yêu cầu sửa đổi, bổ sung 2 - 3 lần kéo dài cả năm thì chi phí phát sinh ai chịu?"
  -> TRẢ LỜI: Hợp đồng của Thịnh Vượng Legal cam kết "Đồng hành trọn gói đến khi có kết quả cuối cùng". Mọi văn bản giải trình, bổ sung theo yêu cầu chính thức của NHNN đều nằm trong phạm vi dịch vụ trọn gói đã thỏa thuận, không phát sinh phụ phí bất hợp lý.
- CÂU HỎI: "Điểm hòa vốn (Break-even point) của Hãng luật đạt được sau bao lâu?"
  -> TRẢ LỜI: Với chi phí cố định khoảng 180 - 250 triệu/tháng (lương cứng cơ bản + thuê văn phòng Bitexco/Lotte Center), Hãng luật chỉ cần duy trì 01 hợp đồng cấp phép trọn gói/quý kết hợp 04-06 khách hàng tư vấn thường xuyên (Retainer) là đã đạt điểm hòa vốn ngay từ tháng thứ 4 vận hành.`;

// Helper: extract API key from headers or body
function getReqApiKey(req: express.Request): string | undefined {
  const headerKey = req.headers['x-gemini-key'];
  if (typeof headerKey === 'string' && headerKey.trim().length > 8) {
    return headerKey.trim();
  }
  const bodyKey = (req.body as Record<string, unknown>)?.apiKey;
  if (typeof bodyKey === 'string' && bodyKey.trim().length > 8) {
    return bodyKey.trim();
  }
  return undefined;
}

// Track OpenAI quota status to avoid repeated 429 errors
let openaiQuotaExhausted = false;

// Helper: Call AI (Gemini primary, OpenAI fallback, then static knowledge)
async function callLegalAI(systemPrompt: string, userPrompt: string, customApiKey?: string) {
  // 1. Primary: Google Gemini API (native to AI Studio environment or user-provided)
  const geminiKey = customApiKey || process.env.GEMINI_API_KEY;
  if (geminiKey && geminiKey.trim() !== '' && geminiKey !== 'MY_GEMINI_API_KEY') {
    try {
      const ai = new GoogleGenAI({
        apiKey: geminiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
      const modelsToTry = [
        'gemini-3.6-flash',
        'gemini-3.8-flash',
        'gemini-2.5-flash',
        'gemini-3.1-flash-lite',
        'gemini-flash-latest',
      ];

      for (const model of modelsToTry) {
        try {
          const response = await ai.models.generateContent({
            model,
            contents: `${systemPrompt}\n\n---\n\n${userPrompt}`,
          });
          if (response && response.text) {
            return response.text;
          }
        } catch {
          // Try next Gemini model variant
          continue;
        }
      }
    } catch (err) {
      console.warn('Gemini call encountered issue, attempting secondary fallback:', err);
    }
  }

  // 2. Secondary: OpenAI API (only if Gemini failed and OpenAI has not exceeded quota)
  const openaiKey = process.env.OPENAI_API_KEY;
  if (openaiKey && openaiKey.trim() !== '' && !openaiQuotaExhausted) {
    try {
      const openai = new OpenAI({ apiKey: openaiKey });
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.2,
      });
      const content = completion.choices[0]?.message?.content;
      if (content) return content;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      if (errorMessage.includes('429') || errorMessage.includes('credits') || errorMessage.includes('quota')) {
        // OpenAI account has no credits remaining - disable further attempts
        openaiQuotaExhausted = true;
      }
    }
  }

  return null;
}

// Helper: Stream AI results via SSE (Google Gemini stream, falling back to simulated progressive stream)
async function streamLegalAI(
  res: express.Response,
  systemPrompt: string,
  userPrompt: string,
  fallbackText: string,
  customApiKey?: string,
) {
  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  const geminiKey = customApiKey || process.env.GEMINI_API_KEY;
  if (geminiKey && geminiKey.trim() !== '' && geminiKey !== 'MY_GEMINI_API_KEY') {
    try {
      const ai = new GoogleGenAI({
        apiKey: geminiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
      const modelsToTry = [
        'gemini-3.6-flash',
        'gemini-3.8-flash',
        'gemini-2.5-flash',
        'gemini-3.1-flash-lite',
        'gemini-flash-latest',
      ];
      for (const model of modelsToTry) {
        try {
          const stream = await ai.models.generateContentStream({
            model,
            contents: `${systemPrompt}\n\n---\n\n${userPrompt}`,
          });
          let hasChunk = false;
          for await (const chunk of stream) {
            const chunkText = chunk.text;
            if (chunkText) {
              hasChunk = true;
              res.write(`data: ${JSON.stringify({ chunk: chunkText, mode: 'ai' })}\n\n`);
            }
          }
          if (hasChunk) {
            res.write(`data: ${JSON.stringify({ done: true, mode: 'ai' })}\n\n`);
            return res.end();
          }
        } catch {
          continue;
        }
      }
    } catch (err) {
      console.warn('Gemini stream error, falling back:', err);
    }
  }

  // Progressive streaming fallback (simulating natural human/AI typing in real-time)
  const words = fallbackText.split(' ');
  for (let i = 0; i < words.length; i += 3) {
    const slice = words.slice(i, i + 3).join(' ') + (i + 3 < words.length ? ' ' : '');
    res.write(`data: ${JSON.stringify({ chunk: slice, mode: 'demo' })}\n\n`);
    await new Promise((r) => setTimeout(r, 20));
  }
  res.write(`data: ${JSON.stringify({ done: true, mode: 'demo' })}\n\n`);
  return res.end();
}

// 0. Endpoints: AI Connection Status & Test Ping
app.get('/api/ai-status', async (req, res) => {
  const reqKey = getReqApiKey(req);
  const geminiKey = reqKey || process.env.GEMINI_API_KEY;
  const isKeyConfigured = Boolean(geminiKey && geminiKey.trim() !== '' && geminiKey !== 'MY_GEMINI_API_KEY');
  res.json({
    connected: isKeyConfigured,
    provider: 'Google Gemini',
    model: 'gemini-3.6-flash',
    isCustomKey: Boolean(reqKey),
    status: isKeyConfigured ? 'online' : 'unconfigured',
    message: isKeyConfigured
      ? 'Đã kết nối Google Gemini API chính thức (Sẵn sàng phục vụ)'
      : 'Chưa cấu hình khóa API trong môi trường',
  });
});

app.post('/api/ai-ping', async (req, res) => {
  const reqKey = getReqApiKey(req);
  const geminiKey = reqKey || process.env.GEMINI_API_KEY;
  if (!geminiKey || geminiKey.trim() === '' || geminiKey === 'MY_GEMINI_API_KEY') {
    return res.status(400).json({ ok: false, error: 'Chưa có khóa Gemini API trong hệ thống.' });
  }
  const startTime = Date.now();
  try {
    const ai = new GoogleGenAI({
      apiKey: geminiKey,
      httpOptions: {
        headers: { 'User-Agent': 'aistudio-build' },
      },
    });
    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: 'Trả lời đúng 3 từ: "Kết nối thành công"',
    });
    const latencyMs = Date.now() - startTime;
    return res.json({
      ok: true,
      model: 'gemini-3.6-flash',
      latencyMs,
      reply: response.text?.trim() || 'Kết nối thành công',
      provider: 'Google Gemini API (Official)',
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return res.status(500).json({ ok: false, error: msg });
  }
});

// 1. Endpoint: Legal Assistant Q&A
app.post('/api/legal-assistant', async (req, res) => {
  try {
    const reqKey = getReqApiKey(req);
    const { message, selectedText } = req.body || {};
    const textMsg = typeof message === 'string' ? message.trim() : '';
    const textSelected =
      typeof selectedText === 'string' ? selectedText.trim().slice(0, 3000) : '';

    if (!textMsg || textMsg.length > 1500) {
      return res.status(400).json({ error: 'Câu hỏi phải có từ 1 đến 1.500 ký tự.' });
    }

    const systemPrompt = `Bạn là Trợ lý AI Pháp lý & Đại diện Tư vấn cấp cao của Hãng luật Thịnh Vượng Legal (thuộc Đề án Nghiên cứu Pháp lý Fintech & Ví điện tử - Nhóm 13).
Nhiệm vụ và phạm vi giải đáp của bạn:
1. TƯ VẤN THỰC CHIẾN VỀ TÀI CHÍNH, TIỀN BẠC, THÙ LAO & LỢI NHUẬN (PHẢN BIỆN HỘI ĐỒNG THẦY GIÁO & NHÀ ĐẦU TƯ):
   - Khi thầy giáo hoặc nhà đầu tư hỏi về TIỀN, BIỂU PHÍ, DÒNG TIỀN, HÃY TRẢ LỜI CỰC KỲ SẮC BÉN VÀ CHẮC CHẮN:
     + Trả tiền cho ai: Khách hàng BẮT BUỘC ký hợp đồng với Hãng luật (pháp nhân) và chuyển khoản vào TÀI KHOẢN CỦA CÔNG TY LUẬT THỊNH VƯỢNG LEGAL, có xuất hóa đơn VAT điện tử theo Điều 54, 55 Luật Luật sư 2006 (sửa đổi 2012). TUYỆT ĐỐI KHÔNG ĐƯỢC TRẢ THẲNG CHO LUẬT SƯ/THÀNH VIÊN CÁ NHÂN (vi phạm đạo đức, rủi ro không có bảo hiểm trách nhiệm nghề nghiệp và không được trừ thuế).
     + Trả bao nhiêu tiền: Gói cấp phép trọn gói 350 - 650 triệu VNĐ (chia 5 đợt theo mốc tiến độ: 30% - 20% - 20% - 20% - 10%); Gói 20 hợp đồng chuẩn hóa 80 - 150 triệu; Tư vấn thường xuyên retainer 25 - 45 triệu/tháng.
     + Các đầu lương của 12 thành viên: Mô hình 4 tầng (Lương cứng Base Salary 35-45tr cho Chủ nhiệm Vũ Anh Quân, 25-32tr cho 4 Senior Partner, 16-22tr cho 7 Associate, 6-9tr trợ lý; Thù lao vụ việc Case Fee 20-30% doanh thu dự án; Thưởng kinh doanh Business Dev 5-10%; Cổ tức lợi nhuận ròng cuối năm).
     + Trong 6 - 12 tháng đợi cấp phép NHNN, làm thế nào để có lợi nhuận:
       * Về phía Hãng luật: Đã thu 50-70% theo mốc milestone billing, thu phí duy trì retainer 25-45tr/tháng để giải trình hồ sơ, bán dịch vụ báo cáo DPIA dữ liệu cá nhân (30-60tr/hồ sơ), rà soát hợp đồng merchant và bản quyền AI Copilot.
       * Về phía Doanh nghiệp Ví: Hợp tác BCC với đơn vị đã có giấy phép để hưởng chia sẻ phí giao dịch và lấy tệp người dùng sớm; Khai thác mảng phần mềm POS/Loyalty bán cho chuỗi bán lẻ thu tiền SaaS; Tối ưu 50 tỷ vốn điều lệ gửi ngắn hạn tại ngân hàng sinh lãi 180 - 230 triệu/tháng nuôi bộ máy R&D; Ký MOU mở rộng mạng lưới merchant nâng định giá gọi vốn Pre-Series A.
2. TƯ VẤN PHÁP LUẬT FINTECH & VÍ ĐIỆN TỬ:
   - Giải đáp chuyên sâu về điều kiện cấp phép ví điện tử, vốn thực 50 tỷ, tài khoản đảm bảo thanh toán 1:1, quy trình nạp/rút, eKYC sinh trắc học, thẩm quyền ký kết, bảo vệ dữ liệu cá nhân (Luật 91/2025/QH15), chứng chỉ bảo mật cấp độ 3 / PCI-DSS...
   - Trích dẫn điều khoản chính xác từ Nghị định 52/2024/NĐ-CP, Thông tư 40/2024/TT-NHNN và các văn bản liên quan.
3. CUNG CẤP THÔNG TIN TOÀN DIỆN VỀ THỊNH VƯỢNG LEGAL & ĐỘI NGŨ NHÓM 13:
   - Giới thiệu 12 thành viên, Chủ nhiệm Vũ Anh Quân, địa chỉ văn phòng Bitexco TP.HCM và Lotte Center Hà Nội, hotline, Zalo, 20 hợp đồng mẫu, lộ trình 6 giai đoạn.
4. VĂN PHONG VÀ TRÌNH BÀY:
   - Tiếng Việt chuẩn mực, cấu trúc rõ ràng (dùng gạch đầu dòng, in đậm các luận điểm và số liệu thực tế), mang phong thái luật sư tư vấn tài chính cấp cao.

--- THÔNG TIN DOANH NGHIỆP & ĐỘI NGŨ NHÓM 13 ---
${companyAndTeamKnowledgeBase}

--- KIẾN THỨC TÀI CHÍNH, DOANH THU, CƠ CHẾ THU TIỀN, ĐẦU LƯƠNG & LỢI NHUẬN ---
${financialAndCommercialKnowledgeBase}

--- CƠ SỞ PHÁP LUẬT VÍ ĐIỆN TỬ ---
${legalKnowledgeBase}`;

    const userPrompt = `${textSelected ? `Ngữ cảnh / Điều khoản đang đọc:\n"""\n${textSelected}\n"""\n\n` : ''}Câu hỏi của người dùng: ${textMsg}`;

    const { stream } = req.body || {};
    const isStream = stream || req.query.stream === 'true' || req.headers.accept?.includes('text/event-stream');

    const lowerQ = textMsg.toLowerCase();
    const isPaymentQuery = lowerQ.includes('trả tiền') || lowerQ.includes('bao nhiêu tiền') || lowerQ.includes('trả cho ai') || lowerQ.includes('trả thẳng') || lowerQ.includes('cho công ty hay') || lowerQ.includes('thu tiền') || lowerQ.includes('biểu phí') || lowerQ.includes('giá dịch vụ') || lowerQ.includes('thanh toán');
    const isSalaryQuery = lowerQ.includes('lương') || lowerQ.includes('đầu lương') || lowerQ.includes('thu nhập') || lowerQ.includes('thù lao') || lowerQ.includes('chia tiền') || lowerQ.includes('thưởng') || lowerQ.includes('cổ tức');
    const isProfitWaitQuery = lowerQ.includes('lợi nhuận') || lowerQ.includes('đợi hồ sơ') || lowerQ.includes('chờ cấp phép') || lowerQ.includes('chờ giấy phép') || lowerQ.includes('trong quá trình đợi') || lowerQ.includes('kiếm tiền') || lowerQ.includes('dòng tiền') || lowerQ.includes('nhà đầu tư') || lowerQ.includes('thầy giáo') || lowerQ.includes('hội đồng') || lowerQ.includes('phản biện') || lowerQ.includes('hòa vốn') || lowerQ.includes('kinh doanh');
    const isTeamQuery = lowerQ.includes('thành viên') || lowerQ.includes('nhóm 13') || lowerQ.includes('ai là') || lowerQ.includes('chủ nhiệm') || lowerQ.includes('quân') || lowerQ.includes('đội ngũ') || lowerQ.includes('tác giả');
    const isCompanyQuery = lowerQ.includes('thịnh vượng') || lowerQ.includes('công ty') || lowerQ.includes('hãng luật') || lowerQ.includes('địa chỉ') || lowerQ.includes('liên hệ') || lowerQ.includes('hotline') || lowerQ.includes('zalo') || lowerQ.includes('dịch vụ');

    let defaultFallback = '';
    if (isPaymentQuery) {
      defaultFallback = `[Thịnh Vượng Legal · Cơ Chế Thu Phí & Quy Định Trả Tiền]\n\n` +
        `• **Trả cho ai?**: Căn cứ Điều 54, 55 Luật Luật sư 2006 (sửa đổi 2012), khách hàng **BẮT BUỘC PHẢI CHUYỂN KHOẢN VÀO TÀI KHOẢN PHÁP NHÂN CỦA CÔNG TY LUẬT THỊNH VƯỢNG LEGAL**, có xuất hóa đơn VAT điện tử hợp pháp.\n` +
        `• **Tuyệt đối KHÔNG trả thẳng cho Luật sư/thành viên cá nhân**: Luật pháp nghiêm cấm luật sư tự ý nhận tiền riêng ngoài hợp đồng. Trả qua công ty giúp khách hàng được bảo vệ bởi Bảo hiểm trách nhiệm nghề nghiệp và được tính chi phí hợp lý khi trừ thuế TNDN.\n` +
        `• **Mức phí & Lộ trình**: Gói tư vấn cấp phép trọn gói từ 350 - 650 triệu VNĐ, chia làm 5 đợt giải ngân theo mốc tiến độ (30% khi ký HĐ -> 20% khi xong 20 hợp đồng & vốn 50 tỷ -> 20% khi nộp hồ sơ NHNN -> 20% khi NHNN kiểm tra thực tế -> 10% khi nhận giấy phép).`;
    } else if (isSalaryQuery) {
      defaultFallback = `[Thịnh Vượng Legal · Cơ Cấu Đầu Lương & Thù Lao 12 Thành Viên]\n\n` +
        `Hãng luật áp dụng mô hình thu nhập 4 tầng chuyên nghiệp:\n` +
        `1. **Lương cứng (Base Salary)**: Chủ nhiệm dự án Vũ Anh Quân (35 - 45 tr/tháng); 4 Senior Partner (25 - 32 tr/tháng); 7 Associate chuyên trách (16 - 22 tr/tháng); Trợ lý pháp lý (6 - 9 tr/tháng).\n` +
        `2. **Thù lao theo vụ việc (Case Fee)**: Trích 20% - 30% giá trị hợp đồng dịch vụ đã nghiệm thu để chia cho nhóm thụ lý trực tiếp.\n` +
        `3. **Thưởng kinh doanh & KPI**: Thưởng 5% - 10% doanh thu khi kết nối khách hàng mới; thưởng tiến độ hồ sơ.\n` +
        `4. **Cổ tức cuối năm (Dividends)**: Phân chia toàn bộ lợi nhuận ròng cho các thành viên sáng lập theo tỷ lệ góp vốn sau khi trừ chi phí vận hành và trích quỹ rủi ro nghề nghiệp 10%.`;
    } else if (isProfitWaitQuery) {
      defaultFallback = `[Thịnh Vượng Legal · Chiến Lược Tạo Lợi Nhuận Trong 6-12 Tháng Đợi Cấp Phép NHNN]\n\n` +
        `Quá trình xin giấy phép NHNN thường kéo dài 6-12 tháng. Cả Hãng luật và Doanh nghiệp ví đều có chiến lược tạo dòng tiền bền vững:\n\n` +
        `A. **Đối với Hãng luật Thịnh Vượng Legal**:\n` +
        `• **Thu theo mốc (Milestone Billing)**: Đã thu 50% - 70% giá trị hợp đồng ngay khi hoàn thiện hồ sơ và nộp tại NHNN.\n` +
        `• **Phí tư vấn thường xuyên (Retainer)**: Thu đều đặn 25 - 45 tr/tháng trong suốt thời gian chờ để hỗ trợ giải trình văn bản theo yêu cầu NHNN.\n` +
        `• **Dịch vụ phụ trợ**: Lập Báo cáo đánh giá tác động dữ liệu cá nhân (DPIA) theo Luật 91/2025/QH15 (30-60 tr/hồ sơ), rà soát hợp đồng merchant, đào tạo AML.\n\n` +
        `B. **Đối với Doanh nghiệp Ví điện tử**:\n` +
        `• **Hợp đồng BCC**: Bắt tay hợp tác kinh doanh với Trung gian thanh toán/Ngân hàng ĐÃ CÓ GIẤY PHÉP để chia sẻ phí giao dịch và thu hút người dùng từ sớm.\n` +
        `• **Bán phần mềm POS/Loyalty (SaaS)**: Khai thác mảng công nghệ bán cho các chuỗi cửa lẻ để tạo dòng tiền ngay.\n` +
        `• **Tối ưu lãi từ vốn 50 tỷ**: Gửi ngắn hạn 1-3 tháng tại ngân hàng với lãi suất ~5%/năm, sinh lãi 180 - 230 triệu/tháng, đủ bù đắp toàn bộ tiền thuê văn phòng và nuôi đội ngũ R&D.\n` +
        `• **Ký MOU mạng lưới Merchant**: Gia tăng định giá công ty để gọi vốn các vòng hạt giống / Pre-Series A.`;
    } else if (isTeamQuery) {
      defaultFallback = `[Thịnh Vượng Legal · Đội ngũ Ban Nghiên cứu Nhóm 13]\n\n` +
        `Đề án được thực hiện bởi **12 thành viên Ban Nghiên cứu chuyên đề** dưới sự điều phối của **Chủ nhiệm dự án Vũ Anh Quân**:\n\n` +
        `1. **Vũ Anh Quân** (MSV: 26A4062552) - Chủ nhiệm dự án · Tích hợp API & Tổng hợp đề án.\n` +
        `2. **Đoàn Anh Phương** (MSV: 26A4062550) - Phân tích tổng quan thị trường ví & mô hình thanh toán di động.\n` +
        `3. **Kiều Hoài Thu** (MSV: 26A4060739) - Chuyên gia Điều lệ & ĐHĐCĐ (cơ cấu vốn 50 tỷ).\n` +
        `4. **Trần Thị Thơ** (MSV: 26A4060737) - Chuyên gia Hợp đồng mở ví người dùng & Hợp đồng Giám đốc.\n` +
        `5. **Lê Phương Thảo** (MSV: 26A4062560) - Chuyên gia Hợp đồng Lao động & Liên kết Ngân hàng.\n` +
        `6. **Lê Thị Hồng Nhung** (MSV: 26A4062545) - Chuyên gia Thuê ngoài CNTT (Cloud) & Hợp đồng Merchant.\n` +
        `7. **Phạm Dạ Thảo** (MSV: 26A4060735) - Chuyên gia Thành lập Doanh nghiệp & Hợp đồng BCC.\n` +
        `8. **Nguyễn Huy Thái** (MSV: 26A4062558) - Chuyên gia Tra soát Khiếu nại & Hồ sơ Sự cố tài chính.\n` +
        `9. **Phạm Văn Quang** (MSV: 26A4062551) - Chuyên gia Bảo mật, NDA & Bản quyền phần mềm.\n` +
        `10. **Trần Thị Thùy** (MSV: 26A4062565) - Chuyên gia Thỏa thuận Cổ đông (SHA) & Deadlock.\n` +
        `11. **Vương Thu Thủy** (MSV: 26A4062567) - Chuyên gia Khuyến mại & Dữ liệu Cá nhân (Luật 91/2025).\n` +
        `12. **Vũ Phương Thảo** (MSV: 26A4060736) - Chuyên gia Tài khoản Bảo đảm Thanh toán (Ký quỹ 1:1) & NHNN.\n\n` +
        `*(Bạn có thể vào trang **"Đội ngũ"** trên menu để xem hình ảnh và hồ sơ chi tiết của từng thành viên).*`;
    } else if (isCompanyQuery) {
      defaultFallback = `[Hãng luật Thịnh Vượng Legal · Thông tin Doanh nghiệp]\n\n` +
        `• **Về chúng tôi**: Hãng luật Thịnh Vượng Legal (Đề án Nhóm 13) chuyên sâu về Pháp lý thành lập, cấp phép và vận hành Ví điện tử & Fintech tại Việt Nam.\n` +
        `• **Trụ sở chính**: Tòa nhà Bitexco Financial Tower, Số 2 Hải Triều, P. Bến Nghé, Quận 1, TP. HCM.\n` +
        `• **Chi nhánh Hà Nội**: Tòa nhà Lotte Center, 54 Liễu Giai, P. Cống Vị, Q. Ba Đình, Hà Nội.\n` +
        `• **Hotline / Zalo**: 0988 123 456 | **Email**: contact@thinhvuonglegal.vn\n` +
        `• **Sản phẩm chính**: Thư viện 20 mẫu hợp đồng chuẩn hóa, Lộ trình cấp phép 6 giai đoạn và Trợ lý AI soi bẫy điều khoản.`;
    } else {
      defaultFallback = `[Tư Vấn Tự Động · Thịnh Vượng Legal]\n\n` +
        `• **Về vấn đề**: ${textMsg}\n` +
        (textSelected ? `• **Điều khoản đang xem xét**: "${textSelected.slice(0, 150)}..."\n\n` : '\n') +
        `• **Căn cứ pháp lý cốt lõi**: \n` +
        `  - **Điều 22 & 25 Nghị định 52/2024/NĐ-CP**: Tổ chức cung ứng ví điện tử phải có vốn điều lệ thực góp tối thiểu 50 tỷ đồng và bắt buộc mở tài khoản đảm bảo thanh toán tại Ngân hàng Thương mại với tỷ lệ 100% tổng số dư ví của khách hàng.\n` +
        `  - **Thông tư 40/2024/TT-NHNN**: Khách hàng mở ví phải thực hiện eKYC đối soát với dữ liệu dân cư và nạp/rút qua tài khoản ngân hàng chính chủ.\n` +
        `  - **Luật Bảo vệ dữ liệu cá nhân 91/2025/QH15**: Dữ liệu tài chính là dữ liệu nhạy cảm, phải thực hiện đánh giá tác động DPIA.\n\n` +
        `• **Khuyến nghị**: Cần rà soát kỹ các điều khoản về SLA kết nối API ngân hàng, phân định trách nhiệm bồi thường tra soát và thỏa thuận xử lý dữ liệu cá nhân.\n\n` +
        `*(Thông tin hỗ trợ chuyên môn từ Thịnh Vượng Legal, không thay thế ý kiến tư vấn cho từng hợp đồng cụ thể).*`;
    }

    if (isStream) {
      return await streamLegalAI(res, systemPrompt, userPrompt, defaultFallback, reqKey);
    }

    const aiResponse = await callLegalAI(systemPrompt, userPrompt, reqKey);

    if (aiResponse) {
      return res.json({ answer: aiResponse, text: aiResponse, mode: 'ai' });
    }

    return res.json({ answer: defaultFallback, text: defaultFallback, mode: 'demo' });
  } catch (error) {
    console.error('Legal assistant error:', error);
    return res.status(500).json({ error: 'Không thể xử lý yêu cầu lúc này.' });
  }
});

// Helper for document sanitization
function sanitizeDocumentText(value: unknown) {
  if (typeof value !== 'string') return '';
  return value.split(String.fromCharCode(0)).join('').trim().slice(0, 50_000);
}

const reviewAreas = [
  ['Phạm vi và giấy phép', ['phạm vi', 'giấy phép']],
  ['Phí và đối soát', ['phí', 'đối soát']],
  ['Nghiệm thu và SLA', ['nghiệm thu', 'sla']],
  ['Dữ liệu và bảo mật', ['dữ liệu', 'bảo mật']],
  ['Tra soát và hoàn tiền', ['tra soát', 'hoàn tiền']],
  ['Chấm dứt và chuyển tiếp', ['chấm dứt', 'tạm ngừng']],
] as const;

function fallbackReview(text: string) {
  const normalized = text.toLocaleLowerCase('vi');
  const lines = reviewAreas.map(([title, terms], index) => {
    const present = terms.some((term) => normalized.includes(term));
    return `${index + 1}. ${title} — ${present ? 'XANH' : 'VÀNG'}\n${
      present
        ? 'Đã nhận diện nội dung liên quan; cần kiểm tra tính đầy đủ, thẩm quyền và sự thống nhất giữa hợp đồng với phụ lục.'
        : 'Chưa nhận diện rõ nội dung này. Cần bổ sung hoặc xác định vị trí điều khoản trước khi ký.'
    }`;
  });
  return `TÓM TẮT RÀ SOÁT\nBản phân tích quy tắc đã kiểm tra các nhóm điều khoản cốt lõi của hợp đồng ví điện tử.\n\n${lines.join(
    '\n\n',
  )}\n\nKẾT LUẬN\nĐây là chế độ dữ liệu mẫu, chưa thay thế rà soát của luật sư và chưa xác nhận hiệu lực từng căn cứ cho giao dịch cụ thể.`;
}

// 3. Endpoint: Contract Draft (Tạo dự thảo hợp đồng)
app.post('/api/contract-draft', async (req, res) => {
  try {
    const reqKey = getReqApiKey(req);
    const { description: rawDesc, referenceText, contractSlug, stream } = req.body || {};
    const description = sanitizeDocumentText(rawDesc).slice(0, 5000);
    const reference = sanitizeDocumentText(referenceText);
    const selected = contracts.find((item) => item.slug === contractSlug);

    const effectiveDesc =
      description ||
      reference ||
      (selected
        ? `Lập dự thảo ${selected.title} chuẩn hóa theo quy định Nghị định 52/2024/NĐ-CP và Thông tư 40/2024/TT-NHNN.`
        : 'Lập dự thảo hợp đồng cung ứng dịch vụ trung gian thanh toán ví điện tử.');

    const fallback = `CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
Độc lập - Tự do - Hạnh phúc
---------------

${selected?.title ? selected.title.toUpperCase() : 'HỢP ĐỒNG DỊCH VỤ VÍ ĐIỆN TỬ'}
Số: [Số hợp đồng]/2026/TVL-FINTECH

- Căn cứ Bộ luật Dân sự số 91/2015/QH13;
- Căn cứ Luật Các tổ chức tín dụng số 32/2024/QH15;
- Căn cứ Nghị định 52/2024/NĐ-CP của Chính phủ quy định về thanh toán không dùng tiền mặt;
- Căn cứ Thông tư 40/2024/TT-NHNN của Ngân hàng Nhà nước hướng dẫn dịch vụ trung gian thanh toán;
- Căn cứ Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15;
- Căn cứ nhu cầu và khả năng của hai Bên.

Hôm nay, ngày [Ngày] tháng [Tháng] năm 2026, tại [Địa điểm ký kết], chúng tôi gồm:

BÊN A (BÊN CUNG ỨNG DỊCH VỤ VÍ ĐIỆN TỬ):
- Tên tổ chức: [Tên Công ty Ví điện tử]
- Giấy phép hoạt động: Số [Số GP]/GP-NHNN do Ngân hàng Nhà nước Việt Nam cấp.
- Mã số doanh nghiệp: [Mã số thuế / MSDN]
- Địa chỉ trụ sở: [Địa chỉ trụ sở chính]
- Đại diện bởi: Ông/Bà [Họ và tên đại diện] - Chức vụ: [Tổng Giám đốc / Đại diện theo pháp luật]
- Tài khoản đảm bảo thanh toán: [Số tài khoản] mở tại Ngân hàng TMCP [Tên Ngân hàng]

BÊN B (ĐƠN VỊ HỢP TÁC / KHÁCH HÀNG):
- Tên tổ chức/cá nhân: [Tên Bên B]
- Mã số thuế / CCCD: [Số MST / Số thẻ CCCD gắn chip]
- Địa chỉ: [Địa chỉ liên hệ chính thức]
- Đại diện bởi: Ông/Bà [Họ và tên] - Chức vụ: [Chức vụ đại diện]

Hai Bên thống nhất ký kết Hợp đồng với các điều khoản cụ thể sau đây:

Điều 1: Phạm vi hợp tác và Cung ứng dịch vụ
1.1. Bên A đồng ý cung cấp giải pháp trung gian thanh toán ví điện tử cho Bên B để xử lý các giao dịch hợp pháp phát sinh theo đúng quy định pháp luật.
1.2. Mọi luồng tiền giao dịch qua ví điện tử phải được bảo đảm 100% bằng số dư tiền gửi tại Tài khoản đảm bảo thanh toán của Bên A mở tại Ngân hàng Thương mại hợp tác theo Điều 25 Nghị định 52/2024/NĐ-CP.

Điều 2: Tiêu chuẩn kỹ thuật, eKYC và An toàn thông tin
2.1. Bên A chịu trách nhiệm duy trì hệ thống kỹ thuật đạt tiêu chuẩn bảo mật an toàn thông tin cấp độ 3 và chuẩn bảo mật thanh toán quốc tế PCI-DSS Level 1.
2.2. Quy trình nhận biết khách hàng (eKYC) và xác thực sinh trắc học khuôn mặt được thực hiện nghiêm ngặt theo Thông tư 40/2024/TT-NHNN và Quyết định 2345/QĐ-NHNN.

Điều 3: Bảo vệ Dữ liệu cá nhân và Bí mật tài chính
3.1. Dữ liệu giao dịch, số dư tài khoản và định danh sinh trắc học được phân loại là Dữ liệu cá nhân nhạy cảm theo Luật Bảo vệ dữ liệu cá nhân 91/2025/QH15.
3.2. Các Bên cam kết lập Hồ sơ đánh giá tác động DPIA, không tiết lộ, mua bán hay chuyển giao dữ liệu thanh toán cho bất kỳ bên thứ ba nào khi chưa có sự đồng ý hợp lệ.

Điều 4: Đối soát, Biểu phí và Quyết toán
4.1. Dữ liệu giao dịch được đối soát tự động hàng ngày (T+1) qua kênh API an toàn giữa hai hệ thống.
4.2. Biểu phí dịch vụ: Áp dụng mức phí [Mức phí % hoặc cố định]/giao dịch thành công.

Điều 5: Cam kết và Hiệu lực thi hành
5.1. Hợp đồng này có hiệu lực kể từ ngày ký và có giá trị trong thời hạn [01 năm / Thời hạn thỏa thuận].
5.2. Hợp đồng được lập thành [02] bản có giá trị pháp lý như nhau, mỗi Bên giữ [01] bản để thực hiện.

ĐẠI DIỆN BÊN A                                      ĐẠI DIỆN BÊN B
(Ký, ghi rõ họ tên và đóng dấu)                    (Ký, ghi rõ họ tên và đóng dấu)`;

    const prompt = `Soạn dự thảo ${
      selected?.title || 'hợp đồng phục vụ ví điện tử'
    } bằng tiếng Việt, có quốc hiệu, thông tin chủ thể để trống trong ngoặc vuông, căn cứ tham chiếu (Nghị định 52/2024/NĐ-CP, Thông tư 40/2024/TT-NHNN, Luật Bảo vệ dữ liệu cá nhân 91/2025/QH15), điều khoản đánh số, chữ ký và lưu ý cần rà soát. Chỉ đưa điều khoản gắn trực tiếp với ví điện tử; không tự điền giấy phép, giá hoặc dữ kiện chưa được cung cấp.\n\nYêu cầu người dùng:\n${effectiveDesc}\n\nNội dung tham khảo nếu có:\n${reference}`;

    const systemPrompt = `Bạn là chuyên gia soạn thảo hợp đồng thương mại và Fintech của Thịnh Vượng Legal. Hãy soạn thảo hợp đồng chi tiết, chuẩn chỉnh theo pháp luật Việt Nam. Trình bày rõ ràng theo cấu trúc hợp đồng kinh tế chuẩn.`;

    const isStream = stream || req.query.stream === 'true' || req.headers.accept?.includes('text/event-stream');
    if (isStream) {
      return await streamLegalAI(res, systemPrompt, prompt, fallback, reqKey);
    }

    const aiResponse = await callLegalAI(systemPrompt, prompt, reqKey);
    if (aiResponse) {
      return res.json({ text: aiResponse, mode: 'ai' });
    }
    return res.json({ text: fallback, mode: 'demo' });
  } catch (error) {
    console.error('Contract draft error:', error);
    return res.status(500).json({ error: 'Không thể tạo hợp đồng lúc này.' });
  }
});

// 4. Endpoint: Contract Review (Rà soát hợp đồng)
app.post('/api/contract-review', async (req, res) => {
  try {
    const reqKey = getReqApiKey(req);
    const { text: rawText, fileName, sources, stream } = req.body || {};
    let text = sanitizeDocumentText(rawText);
    if (text.length < 20) {
      text = `HỢP ĐỒNG CUNG ỨNG DỊCH VỤ TRUNG GIAN THANH TOÁN VÍ ĐIỆN TỬ
Căn cứ Nghị định số 52/2024/NĐ-CP của Chính phủ về thanh toán không dùng tiền mặt;
Căn cứ Thông tư số 40/2024/TT-NHNN hướng dẫn về dịch vụ trung gian thanh toán;
Căn cứ Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15.

Điều 1: Phạm vi cung ứng dịch vụ
Bên A đồng ý cấp quyền kết nối cổng ví điện tử cho Bên B để xử lý giao dịch nạp tiền, rút tiền và thanh toán đơn hàng. Mọi luồng tiền phải được bảo đảm 1:1 qua tài khoản mở tại Ngân hàng Thương mại.

Điều 2: Biểu phí và đối soát
Phí dịch vụ xử lý giao dịch là 1.8% trên tổng giá trị giao dịch thành công. Việc đối soát số liệu giao dịch được chốt vào thứ Hai hàng tuần.

Điều 3: Xử lý tra soát và hoàn tiền
Bên A có trách nhiệm tiếp nhận và giải quyết yêu cầu tra soát khiếu nại của khách hàng trong thời hạn 03 ngày làm việc kể từ thời điểm nhận được thông báo.

Điều 4: An toàn bảo mật và bảo vệ dữ liệu cá nhân
Hai Bên cam kết duy trì hệ thống bảo mật tiêu chuẩn PCI-DSS và thực hiện bảo vệ dữ liệu khách hàng theo Luật 91/2025/QH15.`;
    }

    const sourceList = Array.isArray(sources)
      ? sources.filter((item): item is string => typeof item === 'string')
      : [];
    const name = typeof fileName === 'string' ? fileName.slice(0, 240) : 'Hợp đồng dịch vụ ví điện tử';

    const fallback = fallbackReview(text);
    const systemPrompt = `Bạn là luật sư chuyên gia rà soát hợp đồng của Thịnh Vượng Legal. Hãy rà soát hợp đồng theo chuẩn pháp lý ví điện tử Việt Nam.`;
    const prompt = `Rà soát hợp đồng dưới đây theo văn phong luật học. Trình bày rõ:
1. TÓM TẮT TỔNG QUAN
2. VẤN ĐỀ ĐỎ (Rủi ro nghiêm trọng cần sửa ngay trước khi ký)
3. VẤN ĐỀ VÀNG (Điểm mập mờ, bẫy pháp lý cần đàm phán lại)
4. NỘI DUNG XANH (Điều khoản an toàn, phù hợp thông lệ)
5. THÔNG TIN CÒN THIẾU
6. KIẾN NGHỊ VÀ ĐỀ XUẤT CÂU CHỮ THAY THẾ
Với từng vấn đề ghi rõ điều khoản, tác động kinh doanh, căn cứ pháp lý (Nghị định 52/2024/NĐ-CP, Thông tư 40/2024/TT-NHNN, Luật 91/2025/QH15).

Nguồn tham chiếu:
${sourceList.join('\n')}

Tệp: ${name}
---
${text}
---`;

    const isStream = stream || req.query.stream === 'true' || req.headers.accept?.includes('text/event-stream');
    if (isStream) {
      return await streamLegalAI(res, systemPrompt, prompt, fallback, reqKey);
    }

    const aiResponse = await callLegalAI(systemPrompt, prompt, reqKey);
    if (aiResponse) {
      return res.json({ text: aiResponse, mode: 'ai' });
    }
    return res.json({ text: fallback, mode: 'demo' });
  } catch (error) {
    console.error('Contract review error:', error);
    return res.status(500).json({ error: 'Không thể rà soát hợp đồng lúc này.' });
  }
});

// 5. Endpoint: Contract Compare (So sánh hợp đồng)
app.post('/api/contract-compare', async (req, res) => {
  try {
    const reqKey = getReqApiKey(req);
    const { left: rawLeft, right: rawRight, leftName, rightName, stream } = req.body || {};
    let left = sanitizeDocumentText(rawLeft);
    let right = sanitizeDocumentText(rawRight);
    const nameA = typeof leftName === 'string' ? leftName.slice(0, 240) : 'Bản gốc (V1)';
    const nameB = typeof rightName === 'string' ? rightName.slice(0, 240) : 'Bản đề xuất sửa đổi (V2)';

    if (left.length < 20) {
      left = `HỢP ĐỒNG CUNG ỨNG DỊCH VỤ VÍ ĐIỆN TỬ (BẢN GỐC - V1)
Điều 1: Bên A cung cấp dịch vụ cổng thanh toán và ví điện tử cho Bên B.
Điều 2: Biểu phí giao dịch là 1.5% tính trên tổng giá trị giao dịch thành công.
Điều 3: Chu kỳ đối soát số liệu là thứ Hai hàng tuần. Thời hạn thanh toán T+3.
Điều 4: Bên A chịu trách nhiệm bảo mật thông tin và bồi thường thiệt hại trực tiếp nếu lỗi do hệ thống ví.`;
    }
    if (right.length < 20) {
      right = `HỢP ĐỒNG CUNG ỨNG DỊCH VỤ VÍ ĐIỆN TỬ (BẢN ĐỀ XUẤT MỚI - V2)
Điều 1: Bên A cung cấp dịch vụ cổng thanh toán, ví điện tử và dịch vụ thu hộ chi hộ cho Bên B.
Điều 2: Biểu phí giao dịch giảm xuống 1.1% tính trên tổng giá trị giao dịch thành công, áp dụng cố định trong 24 tháng.
Điều 3: Chu kỳ đối soát rút ngắn hàng ngày (T+1). Thời hạn thanh toán tự động trong 24 giờ.
Điều 4: Miễn trừ trách nhiệm bồi thường cho Bên B khi phát sinh gian lận từ người dùng cuối; Bên A chịu trách nhiệm hoàn toàn.
Điều 5: Bổ sung điều khoản phạt vi phạm hợp đồng mức 8% giá trị phần nghĩa vụ bị vi phạm và bồi thường toàn bộ thiệt hại thực tế phát sinh.`;
    }

    const changes = diffLines(left, right)
      .filter((part) => part.added || part.removed)
      .slice(0, 30)
      .map((part) => `${part.added ? 'THÊM' : 'BỎ'}: ${part.value.slice(0, 700)}`)
      .join('\n');

    const fallback = `TÓM TẮT SO SÁNH
Đã phát hiện các đoạn được thêm hoặc loại bỏ giữa hai phiên bản hợp đồng.

THAY ĐỔI CHÍNH
${changes || 'Không phát hiện khác biệt theo dòng.'}

ĐÁNH GIÁ TÁC ĐỘNG PHÁP LÝ
- Chế độ đối chiếu phân tích chi tiết các điều khoản bổ sung và loại bỏ.
- Cần chú ý các điều khoản về phân định trách nhiệm khi phát sinh sự cố giao dịch và nghĩa vụ bảo mật dữ liệu nhạy cảm theo Luật Bảo vệ dữ liệu cá nhân 91/2025/QH15.`;

    const systemPrompt = `Bạn là chuyên gia đối chiếu so sánh hợp đồng của Thịnh Vượng Legal.`;
    const prompt = `So sánh hai phiên bản hợp đồng ví điện tử. Phân loại các thay đổi thành THÊM, BỎ hoặc SỬA; đánh giá tác động là TĂNG RỦI RO, GIẢM RỦI RO hoặc TRUNG TÍNH. Ưu tiên phạm vi giấy phép, phí và đối soát, SLA, dữ liệu, bảo mật, trách nhiệm, chấm dứt và tranh chấp. Kết thúc bằng phiên bản được khuyến nghị và thông tin còn thiếu.

Hợp đồng A (${nameA}):
---
${left}
---
Hợp đồng B (${nameB}):
---
${right}
---`;

    const isStream = stream || req.query.stream === 'true' || req.headers.accept?.includes('text/event-stream');
    if (isStream) {
      return await streamLegalAI(res, systemPrompt, prompt, fallback, reqKey);
    }

    const aiResponse = await callLegalAI(systemPrompt, prompt, reqKey);
    if (aiResponse) {
      return res.json({ text: aiResponse, mode: 'ai', diff: changes });
    }
    return res.json({ text: fallback, mode: 'demo', diff: changes });
  } catch (error) {
    console.error('Contract compare error:', error);
    return res.status(500).json({ error: 'Không thể so sánh hợp đồng lúc này.' });
  }
});

// 2. Endpoint: Contract Clause Reviewer (Rà soát điều khoản hợp đồng)
app.post('/api/review-clause', async (req, res) => {
  try {
    const reqKey = getReqApiKey(req);
    const { clauseText, contractType } = req.body || {};
    const text = typeof clauseText === 'string' ? clauseText.trim() : '';

    if (!text || text.length < 10) {
      return res.status(400).json({ error: 'Vui lòng cung cấp điều khoản tối thiểu 10 ký tự.' });
    }

    const systemPrompt = `Bạn là Trưởng ban Rà soát Hợp đồng cấp cao (Senior Contract Reviewer) của Hãng luật Thịnh Vượng Legal.
Nhiệm vụ của bạn là rà soát một điều khoản hợp đồng liên quan đến Fintech, Ví điện tử hoặc Trung gian thanh toán.
Hãy phân tích cực kỳ sắc bén và trả về định dạng JSON sau:
{
  "riskLevel": "CAO" hoặc "TRUNG BÌNH" hoặc "THẤP",
  "legalTrap": "Chỉ rõ bẫy pháp lý, sự bất cân xứng nghĩa vụ, hoặc nguy cơ vi phạm Nghị định 52/2024/NĐ-CP, Thông tư 40/2024/TT-NHNN hoặc Luật 91/2025/QH15",
  "citation": "Trích dẫn chính xác Điều, Khoản của quy định pháp luật liên quan",
  "recommendedClause": "Soạn thảo lại nguyên văn điều khoản này theo chuẩn mực chặt chẽ, bảo vệ tối đa quyền lợi doanh nghiệp và tuân thủ 100% luật pháp",
  "actionNotes": "3 gạch đầu dòng các điểm cần đàm phán lại ngay với đối tác"
}
Chỉ trả về JSON thuần túy, không bọc markdown khác ngoài code block json nếu cần.`;

    const userPrompt = `Loại hợp đồng: ${contractType || 'Hợp đồng trung gian thanh toán / API / Ví điện tử'}
Điều khoản cần rà soát:
"""
${text}
"""`;

    const aiResponse = await callLegalAI(systemPrompt, userPrompt, reqKey);

    if (aiResponse) {
      try {
        const cleaned = aiResponse.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleaned);
        return res.json(parsed);
      } catch (parseErr) {
        // Return structured object if JSON parsing failed
        return res.json({
          riskLevel: 'TRUNG BÌNH',
          legalTrap: aiResponse.slice(0, 300),
          citation: 'Nghị định 52/2024/NĐ-CP & Luật Giao dịch điện tử 20/2023',
          recommendedClause: text,
          actionNotes: 'Cần thương lượng bổ sung giới hạn trách nhiệm bồi thường và cam kết mức dịch vụ SLA.',
        });
      }
    }

    // Static Analysis Fallback based on keywords
    let riskLevel = 'TRUNG BÌNH';
    let trap = 'Điều khoản chưa phân định rõ ranh giới trách nhiệm khi phát sinh lỗi kết nối bên thứ ba hoặc giao dịch gian lận.';
    let citation = 'Điều 23 Nghị định 52/2024/NĐ-CP & Thông tư 40/2024/TT-NHNN';
    let recommended = text;

    if (text.toLowerCase().includes('miễn trừ') || text.toLowerCase().includes('không chịu trách nhiệm')) {
      riskLevel = 'CAO';
      trap = 'Bẫy pháp lý: Điều khoản miễn trừ trách nhiệm vô điều kiện có nguy cơ bị Tòa án tuyên vô hiệu theo Luật Bảo vệ quyền lợi người tiêu dùng 2023 hoặc vi phạm nghĩa vụ bảo đảm thanh toán theo NĐ 52/2024.';
      citation = 'Điều 25 Nghị định 52/2024/NĐ-CP & Điều 10 Luật Bảo vệ quyền lợi người tiêu dùng 2023';
      recommended = `Trong mọi trường hợp xảy ra sự cố gián đoạn hoặc sai sót thanh toán, Bên cung cấp dịch vụ có trách nhiệm áp dụng ngay các biện pháp khắc phục trong thời hạn SLA cam kết, đồng thời phối hợp với Ngân hàng đối soát và hoàn tiền cho khách hàng hợp pháp theo đúng quy trình tra soát quy định tại Thông tư 40/2024/TT-NHNN.`;
    } else if (text.toLowerCase().includes('dữ liệu') || text.toLowerCase().includes('data')) {
      riskLevel = 'TRUNG BÌNH';
      trap = 'Nguy cơ vi phạm Luật Bảo vệ dữ liệu cá nhân 91/2025/QH15 nếu chia sẻ dữ liệu lịch sử giao dịch cho đối tác mà không có sự đồng ý riêng biệt của chủ thể dữ liệu.';
      citation = 'Luật Bảo vệ dữ liệu cá nhân 91/2025/QH15 & Nghị định 356/2025/NĐ-CP';
    }

    return res.json({
      riskLevel,
      legalTrap: trap,
      citation,
      recommendedClause: recommended,
      actionNotes: '1. Đàm phán làm rõ trách nhiệm bồi thường thiệt hại trực tiếp.\n2. Ràng buộc thời hạn SLA xử lý sự cố tối đa 02-04 giờ.\n3. Đối soát khớp số dư tài khoản ký quỹ hằng ngày.',
    });
  } catch (error) {
    console.error('Review clause error:', error);
    return res.status(500).json({ error: 'Không thể rà soát điều khoản lúc này.' });
  }
});

// Forum API routes. The remix deployment reuses the durable forum backend from
// the primary site when no direct database connection is configured.
async function proxyForumRequest(req: express.Request, res: express.Response) {
  const backendOrigin = 'https://thinh-vuong-legal.vercel.app';
  const query = req.originalUrl.includes('?')
    ? req.originalUrl.slice(req.originalUrl.indexOf('?'))
    : '';
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (req.headers.cookie) headers.Cookie = req.headers.cookie;
  if (req.method === 'POST') {
    headers['Content-Type'] = 'application/json';
    headers.Origin = backendOrigin;
  }
  const upstream = await fetch(`${backendOrigin}/api/forum${query}`, {
    method: req.method,
    headers,
    body: req.method === 'POST' ? JSON.stringify(req.body || {}) : undefined,
    cache: 'no-store',
  });
  const setCookies = upstream.headers.getSetCookie?.() || [];
  if (setCookies.length) res.setHeader('Set-Cookie', setCookies);
  res.status(upstream.status);
  res.setHeader(
    'Content-Type',
    upstream.headers.get('content-type') || 'application/json; charset=utf-8',
  );
  res.setHeader('Cache-Control', 'private, no-store');
  return res.send(Buffer.from(await upstream.arrayBuffer()));
}

app.get('/api/forum', async (req, res) => {
  res.setHeader('Cache-Control', 'private, no-store');
  if (!forumConfigured()) {
    try {
      return await proxyForumRequest(req, res);
    } catch {
      return res.status(503).json({ ready: false, error: forumUnavailable });
    }
  }
  try {
    const { post: postId, q, category, page } = req.query;
    const identity = forumIdentity(req, res);
    const db = forumDatabase();

    if (req.query.admin === '1' && !identity.admin) {
      return res.status(403).json({ error: 'Tài khoản quản trị chưa được cấu hình.' });
    }

    if (postId && typeof postId === 'string') {
      if (!/^[0-9a-f-]{36}$/i.test(postId)) {
        return res.status(400).json({ error: 'Bài viết không hợp lệ.' });
      }
      const postResult = await db.query(
        'select id,title,body,category,nickname,created_at,updated_at,status,locked,author_id from public.forum_posts where id = $1',
        [postId],
      );
      const post = postResult.rows[0];
      if (!post || (post.status !== 'published' && !identity.admin)) {
        return res.status(404).json({ error: 'Bài viết không tồn tại hoặc đã bị gỡ.' });
      }
      const commentPage = Math.max(
        1,
        Math.min(10_000, Math.floor(Number(req.query.commentPage)) || 1),
      );
      const comments = await db.query(
        `select id,post_id,body,nickname,created_at,status,author_id from public.forum_comments where post_id = $1 ${identity.admin ? '' : "and status = 'published'"} order by created_at asc, id asc limit 51 offset $2`,
        [postId, (commentPage - 1) * 50],
      );
      return res.json({
        ready: true,
        admin: identity.admin,
        post: publicForumRow(post, identity.id || undefined),
        comments: comments.rows
          .slice(0, 50)
          .map((row) => publicForumRow(row, identity.id || undefined)),
        hasMoreComments: comments.rows.length > 50,
      });
    }

    const pageNum = Math.max(
      1,
      Math.min(10_000, Math.floor(Number(page)) || 1),
    );
    const conditions = ["status = 'published'"];
    const values: unknown[] = [];
    if (
      typeof category === 'string' &&
      forumCategories.includes(category as (typeof forumCategories)[number])
    ) {
      values.push(category);
      conditions.push(`category = $${values.length}`);
    }
    const search = (typeof q === 'string' ? q : '')
      .slice(0, 160)
      .replace(/[\\%_]/g, '\\$&');
    if (search) {
      values.push(`%${search}%`);
      conditions.push(`title ilike $${values.length} escape '\\'`);
    }
    const where = `where ${conditions.join(' and ')}`;
    const countResult = await db.query(
      `select count(*)::int as count from public.forum_posts ${where}`,
      values,
    );
    const listResult = await db.query(
      `select id,title,body,category,nickname,created_at,updated_at,status,locked,author_id from public.forum_posts ${where} order by created_at desc, id desc limit $${values.length + 1} offset $${values.length + 2}`,
      [...values, 12, (pageNum - 1) * 12],
    );
    return res.json({
      ready: true,
      admin: identity.admin,
      posts: listResult.rows.map((row) =>
        publicForumRow(row, identity.id || undefined),
      ),
      total: countResult.rows[0]?.count || 0,
      page: pageNum,
      flags: [],
    });
  } catch (err) {
    console.error('Forum GET error:', err);
    return res.status(503).json({
      ready: false,
      error: 'Không kết nối được diễn đàn. Vui lòng thử lại sau.',
    });
  }
});

app.post('/api/forum', async (req, res) => {
  res.setHeader('Cache-Control', 'private, no-store');
  const origin = req.get('origin');
  if (!origin || new URL(origin).host !== req.get('host')) {
    return res.status(403).json({ error: 'Nguồn yêu cầu không hợp lệ.' });
  }
  if (!forumConfigured()) {
    try {
      return await proxyForumRequest(req, res);
    } catch {
      return res.status(503).json({ error: forumUnavailable });
    }
  }
  try {
    const input = req.body;
    const { action, target } = input || {};

    if (!action) {
      return res.status(400).json({ error: 'Thiếu trường action.' });
    }
    if (action === 'login') {
      return res.status(503).json({
        error: 'Tài khoản quản trị chưa được cấu hình. Diễn đàn công khai vẫn hoạt động bình thường.',
      });
    }
    if (action === 'logout') return res.json({ ok: true });
    const allowed = [
      'create_post',
      'edit_post',
      'remove_post',
      'create_comment',
      'edit_comment',
      'remove_comment',
      'flag',
    ];
    if (!allowed.includes(action)) {
      return res.status(400).json({ error: 'Thao tác không hợp lệ.' });
    }
    if (
      action !== 'create_post' &&
      (typeof target !== 'string' || !/^[0-9a-f-]{36}$/i.test(target))
    ) {
      return res.status(400).json({ error: 'Mã nội dung không hợp lệ.' });
    }
    const payload: Record<string, string> = {};
    for (const key of ['title', 'body', 'nickname', 'category', 'reason', 'kind']) {
      if (typeof input[key] === 'string') payload[key] = input[key].trim();
    }
    if (action === 'create_post' || action === 'edit_post') {
      if (
        !payload.title ||
        payload.title.length < 5 ||
        payload.title.length > 160 ||
        !forumCategories.includes(payload.category as (typeof forumCategories)[number])
      ) {
        return res.status(400).json({ error: 'Nội dung cần ít nhất 5 ký tự.' });
      }
    }
    if (['create_post', 'edit_post', 'create_comment', 'edit_comment'].includes(action)) {
      const max = action.includes('comment') ? 2_000 : 10_000;
      if (
        !payload.body ||
        payload.body.length < 5 ||
        payload.body.length > max ||
        (payload.nickname && payload.nickname.length > 50)
      ) {
        return res.status(400).json({
          error: `Nội dung cần 5–${max} ký tự; tên hiển thị tối đa 50 ký tự.`,
        });
      }
    }
    if (
      action === 'flag' &&
      (!payload.reason ||
        payload.reason.length < 5 ||
        payload.reason.length > 500 ||
        !['post', 'comment'].includes(payload.kind))
    ) {
      return res.status(400).json({ error: 'Lý do báo cáo cần 5–500 ký tự.' });
    }
    const identity = forumIdentity(
      req,
      res,
      ['create_post', 'create_comment', 'flag'].includes(action),
    );
    if (!identity.id) {
      return res.status(403).json({ error: 'Bạn không có quyền sửa nội dung này.' });
    }
    try {
      const result = await forumDatabase().query(
        'select public.forum_mutate($1,$2,$3,$4,$5,$6) as id',
        [
          identity.id,
          forumIpHash(req),
          action,
          target || null,
          payload,
          false,
        ],
      );
      return res.json({ ok: true, success: true, id: result.rows[0].id });
    } catch (error) {
      const message = error instanceof Error ? error.message : '';
      if (message.includes('RATE_LIMIT')) {
        return res.status(429).json({ error: 'Bạn đã đạt giới hạn đăng trong một giờ.' });
      }
      if (message.includes('FORBIDDEN')) {
        return res.status(403).json({ error: 'Bạn không có quyền thực hiện thao tác này.' });
      }
      if (message.includes('UNAVAILABLE')) {
        return res.status(409).json({ error: 'Bài viết đã bị gỡ hoặc đã khóa bình luận.' });
      }
      if (message.includes('INVALID')) {
        return res.status(400).json({ error: 'Nội dung không hợp lệ.' });
      }
      throw error;
    }
  } catch (err: unknown) {
    console.error('Forum POST error:', err);
    return res.status(503).json({ error: 'Chưa lưu được nội dung. Vui lòng thử lại sau.' });
  }
});

// Avatar upload & storage endpoint
app.post('/api/team/upload', async (req, res) => {
  try {
    const { slug, imageBase64 } = req.body;
    if (!slug || !imageBase64) {
      return res.status(400).json({ error: 'Thiếu slug hoặc dữ liệu ảnh.' });
    }

    const fs = await import('fs');
    const teamDir = path.join(process.cwd(), 'public', 'assets', 'team');
    if (!fs.existsSync(teamDir)) {
      fs.mkdirSync(teamDir, { recursive: true });
    }

    // Clean base64 prefix
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    const targetFile = path.join(teamDir, `${slug}.jpg`);
    fs.writeFileSync(targetFile, buffer);

    return res.json({
      success: true,
      url: `/assets/team/${slug}.jpg?t=${Date.now()}`,
    });
  } catch (error) {
    console.error('Save avatar error:', error);
    return res.status(500).json({ error: 'Không thể lưu ảnh đại diện.' });
  }
});

// List available uploaded team photos
app.get('/api/team/photos', async (_req, res) => {
  try {
    const fs = await import('fs');
    const teamDir = path.join(process.cwd(), 'public', 'assets', 'team');
    if (!fs.existsSync(teamDir)) {
      return res.json({ photos: [] });
    }
    const files = fs.readdirSync(teamDir);
    return res.json({ photos: files });
  } catch (error) {
    return res.json({ photos: [] });
  }
});

// Handle entity too large and body parsing errors
app.use((err: any, _req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err && (err.type === 'entity.too.large' || err.status === 413)) {
    console.warn('PayloadTooLargeError caught:', err.message);
    return res.status(413).json({
      error: 'Dung lượng tệp hoặc văn bản quá lớn (vượt quá 50MB). Vui lòng chọn tệp nhỏ hơn hoặc rút gọn nội dung.',
    });
  }
  next(err);
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Thịnh Vượng Legal server running at http://0.0.0.0:${PORT}`);
  });
}

// Only launch standalone web server when NOT running inside Vercel Serverless environment
if (process.env.VERCEL !== '1' && !process.env.NOW_REGION) {
  startServer();
}

export default app;
