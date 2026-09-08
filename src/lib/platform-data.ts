import { contracts, legalSources, services } from '@/lib/site-data';

export type PlatformSource = {
  id: string;
  title: string;
  status: string;
  url: string;
  topics: string[];
  lastChecked: string;
};

export const platformSources: PlatformSource[] = legalSources.map(
  ([title, status, url], index) => ({
    id: `source-${index + 1}`,
    title,
    status,
    url,
    lastChecked: '07/09/2026',
    topics:
      index === 0 || index === 1
        ? ['Ví điện tử', 'Cấp phép', 'Thanh toán']
        : index === 2
          ? ['Hợp đồng điện tử', 'Chứng cứ']
          : index === 3
            ? ['Khách hàng', 'Khiếu nại']
            : ['Dữ liệu', 'Bảo mật'],
  }),
);

export const demoChapters = services.map((service, index) => ({
  id: service.id,
  number: index + 1,
  title: service.title,
  minimum: Boolean(service.minimum),
  description: service.description,
  outcome: service.outcome,
  documents: contracts.filter((item) => item.group === service.id),
}));

export const platformStats = {
  chapters: demoChapters.length,
  contracts: contracts.length,
  sources: platformSources.length,
  minimum: contracts.filter((item) => item.minimum).length,
};

export const reviewPlaybook = [
  'Chủ thể, thẩm quyền ký và điều kiện pháp lý',
  'Đối tượng, phạm vi dịch vụ và giới hạn giấy phép',
  'Phí, đối soát, nghiệm thu và chứng từ',
  'SLA, sự cố, tra soát và hoàn tiền',
  'Bảo mật, dữ liệu cá nhân và quyền truy cập',
  'Sở hữu trí tuệ, API và tài liệu kỹ thuật',
  'Trách nhiệm, bồi thường và giới hạn trách nhiệm',
  'Thời hạn, tạm ngừng, chấm dứt và chuyển tiếp',
  'Luật áp dụng, tranh chấp, thông báo và sửa đổi',
];

export const sampleQuestions = [
  'Khách hàng trả tiền bao nhiêu và trả cho công ty hay trả thẳng cho luật sư?',
  'Các đầu lương và cơ chế chia thù lao, lợi nhuận cho 12 thành viên như thế nào?',
  'Trong 6-12 tháng đợi cấp phép NHNN, làm thế nào để vẫn kiếm được lợi nhuận?',
  'Vốn điều lệ 50 tỷ theo NĐ 52/2024 phải chứng minh và duy trì thế nào?',
  'Hợp đồng API ví điện tử và tài khoản đảm bảo thanh toán 1:1 cần những gì?',
  'Nghĩa vụ đánh giá tác động DPIA theo Luật Bảo vệ dữ liệu cá nhân 91/2025/QH15?',
];
