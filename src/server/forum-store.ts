import fs from 'fs';
import path from 'path';

export interface ForumPost {
  id: string;
  title: string;
  body: string;
  category: string;
  nickname: string;
  created_at: string;
  updated_at: string;
  status: 'published' | 'hidden' | 'deleted';
  locked: boolean;
  mine: boolean;
}

export interface ForumComment {
  id: string;
  post_id: string;
  body: string;
  nickname: string;
  created_at: string;
  status: 'published' | 'hidden' | 'deleted';
  mine: boolean;
}

export interface ForumFlag {
  id: string;
  post_id: string | null;
  comment_id: string | null;
  reason: string;
  resolved: boolean;
  created_at: string;
}

interface ForumData {
  posts: ForumPost[];
  comments: ForumComment[];
  flags: ForumFlag[];
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'forum-data.json');

const INITIAL_POSTS: ForumPost[] = [
  {
    id: 'post-nd52-cap-phep',
    title: 'Thủ tục và điều kiện cấp Giấy phép cung ứng dịch vụ ví điện tử theo Nghị định 52/2024/NĐ-CP',
    body: `Chào các luật sư và chuyên gia, theo quy định tại Điều 22 và Điều 24 Nghị định 52/2024/NĐ-CP (có hiệu lực từ 01/07/2024):
1. Vốn điều lệ thực góp tối thiểu 50 tỷ đồng cần chứng minh bằng văn bản xác nhận số dư tài khoản phong tỏa của NHTM như thế nào?
2. Phương án kỹ thuật, an toàn thông tin cấp độ 3 (theo Nghị định 85/2016/NĐ-CP) và kiểm toán hệ thống định kỳ cần những tài liệu gì trong bộ hồ sơ nộp lên Vụ Thanh toán - NHNN?
Rất mong nhận được trao đổi và kinh nghiệm thực tế từ các anh chị.`,
    category: 'Ví điện tử và Fintech',
    nickname: 'Luật sư Nguyễn Văn Thành',
    created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 48).toISOString(),
    status: 'published',
    locked: false,
    mine: false,
  },
  {
    id: 'post-tk-bao-dam',
    title: 'Cơ chế duy trì số dư tài khoản đảm bảo thanh toán tỷ lệ 1:1 theo Thông tư 40/2024/TT-NHNN',
    body: `Theo quy định tại Điều 25 Nghị định 52/2024/NĐ-CP và Thông tư 40/2024/TT-NHNN:
- Doanh nghiệp cung ứng dịch vụ ví điện tử bắt buộc phải mở tài khoản đảm bảo thanh toán tại Ngân hàng thương mại hợp tác.
- Tổng số dư trên tài khoản đảm bảo thanh toán KHÔNG ĐƯỢC THẤP HƠN tổng số dư của tất cả các ví điện tử của khách hàng tại cùng một thời điểm.
- Quy trình đối soát cuối ngày và thời hạn bổ sung ký quỹ xử lý ra sao khi có biến động giao dịch đột biến vào ban đêm hoặc ngày nghỉ cuối tuần?`,
    category: 'Hợp đồng',
    nickname: 'Trần Minh Quang · Fintech Lead',
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    status: 'published',
    locked: false,
    mine: false,
  },
  {
    id: 'post-sla-api-merchant',
    title: 'Phân định ranh giới trách nhiệm và cam kết SLA trong hợp đồng kết nối API trung gian thanh toán',
    body: `Trong các hợp đồng tích hợp cổng thanh toán / API ví điện tử giữa Tổ chức TGTT và Đơn vị chấp nhận thanh toán (Merchant):
1. Mức cam kết sẵn sàng hệ thống (SLA Uptime) thông thường là bao nhiêu (99.5% hay 99.9%)?
2. Khi phát sinh lỗi timeout giao dịch hoặc nghẽn mạng do đường truyền ngân hàng, cơ chế xử lý tra soát và miễn trừ thiệt hại gián tiếp (Loss of Profits) nên quy định như thế nào để vừa bảo vệ ví, vừa hài hòa lợi ích của Merchant?`,
    category: 'Hợp đồng',
    nickname: 'Lê Hoàng Yến · Pháp chế Doanh nghiệp',
    created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 12).toISOString(),
    status: 'published',
    locked: false,
    mine: false,
  },
  {
    id: 'post-dpia-luat-91',
    title: 'Lập Báo cáo đánh giá tác động xử lý dữ liệu cá nhân (DPIA) cho quy trình eKYC sinh trắc học',
    body: `Theo Luật Bảo vệ dữ liệu cá nhân 91/2025/QH15 và Nghị định 356/2025/NĐ-CP:
- Dữ liệu sinh trắc học (khuôn mặt, vân tay) và thông tin tài khoản thanh toán là Dữ liệu cá nhân nhạy cảm.
- Hồ sơ DPIA theo Mẫu của Cục An ninh mạng và phòng chống tội phạm sử dụng công nghệ cao (A05) - Bộ Công an cần có những biện pháp kỹ thuật và tổ chức nào để bảo vệ dữ liệu lưu trữ trên máy chủ đám mây?`,
    category: 'Doanh nghiệp và đầu tư',
    nickname: 'Phạm Thu Trang · CISO Legal Counsel',
    created_at: new Date(Date.now() - 3600000 * 6).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 6).toISOString(),
    status: 'published',
    locked: false,
    mine: false,
  },
];

const INITIAL_COMMENTS: ForumComment[] = [
  {
    id: 'cm-1',
    post_id: 'post-nd52-cap-phep',
    body: `Chào Luật sư, theo kinh nghiệm thẩm định của Nhóm 13, văn bản xác nhận vốn 50 tỷ phải do Tổng giám đốc/Giám đốc chi nhánh NHTM ký phát hành và phong tỏa tài khoản chuyên dùng. Tiền này không được rút ra sử dụng cho bất kỳ hoạt động đầu tư hay chi trả lương nào trong suốt quá trình chờ NHNN thẩm định cấp phép.`,
    nickname: 'Vũ Anh Quân · Nhóm 13',
    created_at: new Date(Date.now() - 3600000 * 36).toISOString(),
    status: 'published',
    mine: false,
  },
  {
    id: 'cm-2',
    post_id: 'post-nd52-cap-phep',
    body: `Về an toàn thông tin cấp độ 3, bạn cần Quyết định phê duyệt hồ sơ đề xuất cấp độ của Bộ Thông tin & Truyền thông hoặc cơ quan có thẩm quyền, kèm theo biên bản kiểm thử an ninh mạng (Penetration Test) không có lỗ hổng nghiêm trọng.`,
    nickname: 'Đoàn Anh Phương · Nhóm 13',
    created_at: new Date(Date.now() - 3600000 * 20).toISOString(),
    status: 'published',
    mine: false,
  },
  {
    id: 'cm-3',
    post_id: 'post-tk-bao-dam',
    body: `Chào anh Quang, Thông tư 40/2024/TT-NHNN cho phép cơ chế đối soát tự động hằng ngày. Trường hợp số dư ví vượt số dư tài khoản đảm bảo, hệ thống cảnh báo sớm (Early Alert) sẽ tự động kích hoạt lệnh nạp bổ sung từ tài khoản thanh toán vốn lưu động của tổ chức TGTT vào tài khoản ký quỹ trước 09h00 ngày làm việc kế tiếp.`,
    nickname: 'Vũ Phương Thảo · Nhóm 13',
    created_at: new Date(Date.now() - 3600000 * 18).toISOString(),
    status: 'published',
    mine: false,
  },
  {
    id: 'cm-4',
    post_id: 'post-sla-api-merchant',
    body: `Trong mẫu Hợp đồng tích hợp API của Thịnh Vượng Legal (Mẫu số 08), chúng tôi quy định rõ: Giới hạn trách nhiệm bồi thường thiệt hại trực tiếp tối đa bằng tổng giá trị phí dịch vụ trong 03 tháng liền kề trước đó; đồng thời miễn trừ hoàn toàn thiệt hại gián tiếp, cơ hội kinh doanh bị bỏ lỡ hoặc thiệt hại do bên thứ ba (đơn vị cung cấp viễn thông, mạng ngân hàng) gây ra.`,
    nickname: 'Lê Thị Hồng Nhung · Nhóm 13',
    created_at: new Date(Date.now() - 3600000 * 8).toISOString(),
    status: 'published',
    mine: false,
  },
];

class ForumStore {
  private data: ForumData;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): ForumData {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf8');
        const parsed = JSON.parse(raw);
        if (parsed.posts && Array.isArray(parsed.posts)) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not read forum-data.json, initializing defaults:', e);
    }

    const initialData: ForumData = {
      posts: INITIAL_POSTS,
      comments: INITIAL_COMMENTS,
      flags: [],
    };
    this.persist(initialData);
    return initialData;
  }

  private persist(data: ForumData) {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
    } catch (e) {
      console.warn('Failed to persist forum data:', e);
    }
  }

  public getPosts(params: { q?: string; category?: string; page?: number; admin?: boolean }) {
    const { q, category, page = 1, admin = false } = params;
    const limit = 12;

    let filtered = this.data.posts.filter((post) => {
      if (!admin && post.status !== 'published') return false;
      if (category && post.category !== category) return false;
      if (q) {
        const query = q.toLowerCase().trim();
        const matchTitle = post.title.toLowerCase().includes(query);
        const matchBody = post.body.toLowerCase().includes(query);
        const matchNick = post.nickname.toLowerCase().includes(query);
        if (!matchTitle && !matchBody && !matchNick) return false;
      }
      return true;
    });

    const total = filtered.length;
    const offset = (page - 1) * limit;
    const paginated = filtered.slice(offset, offset + limit);

    return {
      ready: true,
      posts: paginated,
      total,
      page,
      flags: admin ? this.data.flags.filter((f) => !f.resolved) : [],
      admin,
    };
  }

  public getPostById(id: string, admin = false) {
    const post = this.data.posts.find((p) => p.id === id);
    if (!post || (!admin && post.status !== 'published')) {
      return null;
    }

    const comments = this.data.comments.filter(
      (c) => c.post_id === id && (admin || c.status === 'published')
    );

    return {
      post,
      comments,
      totalComments: comments.length,
    };
  }

  public createPost(payload: { title: string; body: string; category: string; nickname?: string }) {
    const id = `post-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const newPost: ForumPost = {
      id,
      title: payload.title.trim().slice(0, 160),
      body: payload.body.trim().slice(0, 10000),
      category: payload.category || 'Ví điện tử và Fintech',
      nickname: (payload.nickname && payload.nickname.trim()) ? payload.nickname.trim().slice(0, 50) : 'Ẩn danh',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status: 'published',
      locked: false,
      mine: true,
    };

    this.data.posts.unshift(newPost);
    this.persist(this.data);
    return newPost;
  }

  public editPost(id: string, payload: { title?: string; body?: string; category?: string }) {
    const post = this.data.posts.find((p) => p.id === id);
    if (!post) return null;

    if (payload.title) post.title = payload.title.trim().slice(0, 160);
    if (payload.body) post.body = payload.body.trim().slice(0, 10000);
    if (payload.category) post.category = payload.category;
    post.updated_at = new Date().toISOString();

    this.persist(this.data);
    return post;
  }

  public removePost(id: string) {
    const post = this.data.posts.find((p) => p.id === id);
    if (post) {
      post.status = 'deleted';
      this.persist(this.data);
      return true;
    }
    return false;
  }

  public createComment(payload: { postId: string; body: string; nickname?: string }) {
    const post = this.data.posts.find((p) => p.id === payload.postId);
    if (!post || post.locked || post.status !== 'published') {
      throw new Error('Bài viết đã bị khóa hoặc không tồn tại.');
    }

    const id = `cm-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const newComment: ForumComment = {
      id,
      post_id: payload.postId,
      body: payload.body.trim().slice(0, 2000),
      nickname: (payload.nickname && payload.nickname.trim()) ? payload.nickname.trim().slice(0, 50) : 'Ẩn danh',
      created_at: new Date().toISOString(),
      status: 'published',
      mine: true,
    };

    this.data.comments.push(newComment);
    this.persist(this.data);
    return newComment;
  }

  public editComment(id: string, body: string) {
    const comment = this.data.comments.find((c) => c.id === id);
    if (!comment) return null;
    comment.body = body.trim().slice(0, 2000);
    this.persist(this.data);
    return comment;
  }

  public removeComment(id: string) {
    const comment = this.data.comments.find((c) => c.id === id);
    if (comment) {
      comment.status = 'deleted';
      this.persist(this.data);
      return true;
    }
    return false;
  }

  public flag(payload: { target: string; kind: 'post' | 'comment'; reason: string }) {
    const flag: ForumFlag = {
      id: `flag-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      post_id: payload.kind === 'post' ? payload.target : null,
      comment_id: payload.kind === 'comment' ? payload.target : null,
      reason: payload.reason.trim().slice(0, 500),
      resolved: false,
      created_at: new Date().toISOString(),
    };
    this.data.flags.push(flag);
    this.persist(this.data);
    return flag;
  }

  public resolveFlag(id: string) {
    const flag = this.data.flags.find((f) => f.id === id);
    if (flag) {
      flag.resolved = true;
      this.persist(this.data);
      return true;
    }
    return false;
  }

  public lockPost(id: string, locked: boolean) {
    const post = this.data.posts.find((p) => p.id === id);
    if (post) {
      post.locked = locked;
      this.persist(this.data);
      return true;
    }
    return false;
  }

  public moderatePost(id: string, status: 'published' | 'hidden' | 'deleted') {
    const post = this.data.posts.find((p) => p.id === id);
    if (post) {
      post.status = status;
      this.persist(this.data);
      return true;
    }
    return false;
  }
}

export const forumStore = new ForumStore();
