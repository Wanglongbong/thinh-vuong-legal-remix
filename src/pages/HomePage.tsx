import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from '@/router';
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Camera,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  FileCheck2,
  FileCode2,
  FileText,
  Landmark,
  Layers,
  LayoutGrid,
  Lock,
  MessageCircle,
  MessageSquare,
  Network,
  Scale,
  Search,
  ShieldAlert,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Upload,
  Wand2,
} from 'lucide-react';
import { contracts, legalSources, services, team, teamMembers } from '@/lib/site-data';
import { safeStorage } from '@/lib/storage';
import { compressImageFile } from '@/lib/image-utils';
import { RoyalCornerDecor, RoyalDivider, RoyalHeroWings } from '@/components/royal-flank-decor';

export function HomePage() {
  const [activeTab, setActiveTab] = useState<'all' | 'minimum' | 'advanced'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [avatars, setAvatars] = useState<Record<string, string>>(() => {
    try {
      const saved = safeStorage.getItem('thinh_vuong_team_avatars');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [teamNotification, setTeamNotification] = useState<string | null>(null);
  const teamBatchInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    fetch('/api/team/photos')
      .then((res) => res.json())
      .then((data) => {
        if (data.photos && Array.isArray(data.photos)) {
          setAvatars((prev) => {
            const next = { ...prev };
            data.photos.forEach((file: string) => {
              const slug = file.replace(/\.jpg$/, '');
              if (!next[slug]) {
                next[slug] = `/assets/team/${file}`;
              }
            });
            return next;
          });
        }
      })
      .catch(() => {});
  }, []);

  const saveAvatar = async (slug: string, base64: string) => {
    setAvatars((prev) => {
      const updated = { ...prev, [slug]: base64 };
      try {
        safeStorage.setItem('thinh_vuong_team_avatars', JSON.stringify(updated));
      } catch (err) {
        console.warn('LocalStorage limit exceeded:', err);
      }
      return updated;
    });

    try {
      await fetch('/api/team/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, imageBase64: base64 }),
      });
    } catch {
      // LocalStorage fallback
    }
  };

  const handleBatchTeamUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    let matchedCount = 0;
    const fileList = Array.from(files) as File[];
    for (const file of fileList) {
      const fileNameLower = file.name.toLowerCase().normalize('NFC');

      const matched = teamMembers.find((m) => {
        const normTarget = m.uploadedFileName.toLowerCase().normalize('NFC');
        const normSlug = m.slug.toLowerCase();
        const normName = m.name.toLowerCase().normalize('NFC');

        return (
          fileNameLower.includes(normTarget.replace('.jpg', '')) ||
          fileNameLower.includes(normSlug) ||
          fileNameLower.includes(normName) ||
          normTarget.includes(fileNameLower.replace('.jpg', ''))
        );
      });

      if (matched) {
        matchedCount++;
        try {
          const base64 = await compressImageFile(file);
          if (base64) {
            await saveAvatar(matched.slug, base64);
          }
        } catch (err) {
          console.error('Error compressing batch image:', err);
        }
      }
    }

    setTeamNotification(`Đã nhận diện và cập nhật ${matchedCount} ảnh thành viên thành công!`);
    setTimeout(() => setTeamNotification(null), 4000);
  };

  const [teamViewMode, setTeamViewMode] = useState<'grid' | 'carousel'>('grid');
  const [isTeamExpanded, setIsTeamExpanded] = useState<boolean>(true);
  const carouselContainerRef = useRef<HTMLDivElement | null>(null);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselContainerRef.current) {
      const scrollAmount = direction === 'left' ? -280 : 280;
      carouselContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const filteredContracts = useMemo(() => {
    return contracts.filter((item) => {
      const matchTab =
        activeTab === 'all'
          ? true
          : activeTab === 'minimum'
            ? item.minimum
            : !item.minimum;

      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchTab;

      const matchSearch =
        item.title.toLowerCase().includes(q) ||
        item.shortTitle.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        item.solves.toLowerCase().includes(q) ||
        item.owner.toLowerCase().includes(q);

      return matchTab && matchSearch;
    });
  }, [activeTab, searchQuery]);

  return (
    <main>
      {/* 1. HERO SECTION - PURE WHITE & WARM IMPERIAL GOLD WITH LADY JUSTICE */}
      <section className="home-hero relative">
        <div className="hero-overlay" />
        <RoyalCornerDecor />
        <RoyalHeroWings />

        {/* TƯỢNG NỮ THẦN CÔNG LÝ NỬA THÂN TRÊN PHÓNG TO CỰC ĐẠI (NÉT VIỀN VÀNG DỊU NHẸ) */}
        <div className="themis-grand-backdrop" aria-hidden="true">
          <img
            src="/themis-half-body.png"
            alt="Nữ thần Công lý Themis bán thân nét vẽ viền vàng kim dịu nhẹ"
            className="themis-grand-backdrop-img"
          />
        </div>

        <div className="site-shell hero-content">
          <div className="hero-copy">
            <span className="eyebrow">
              <Scale className="w-4 h-4 text-[#8C6B18]" />
              Hệ thống Pháp lý Ví điện tử &amp; Trung gian Thanh toán
            </span>
            <h1>
              Nền tảng pháp lý chuẩn mực cho{' '}
              <em className="text-gold-gradient font-normal not-italic">
                Ví điện tử vươn xa.
              </em>
            </h1>
            <p>
              Đồng bộ toàn diện từ mô hình cấp phép theo Nghị định 52/2024/NĐ-CP,
              tài khoản bảo đảm thanh toán đến 20 mẫu hợp đồng API và chính sách
              bảo vệ dữ liệu cá nhân theo chuẩn 2024–2026.
            </p>
            <div className="hero-actions">
              <Link className="gold-button" href="/cong-cu/tao-hop-dong">
                <Wand2 className="w-4 h-4" /> Tạo hợp đồng <ArrowRight className="w-4 h-4" />
              </Link>
              <Link className="ghost-button" href="/hop-dong">
                <FileText className="w-4 h-4 text-[#8C6B18]" /> Tra cứu 20 hồ sơ
              </Link>
              <Link className="ghost-button" href="/cong-cu">
                <Sparkles className="w-4 h-4 text-[#8C6B18]" /> Nền tảng AI
              </Link>
            </div>

            <div className="flex flex-wrap gap-8 mt-10 pt-8 border-t border-[rgba(197,155,39,0.25)]">
              <div>
                <strong className="block font-serif text-3xl font-normal text-[#8C6B18]">
                  20
                </strong>
                <span className="text-xs text-slate-600 font-medium">
                  Hợp đồng &amp; bộ hồ sơ chuẩn
                </span>
              </div>
              <div>
                <strong className="block font-serif text-3xl font-normal text-[#8C6B18]">
                  06
                </strong>
                <span className="text-xs text-slate-600 font-medium">
                  Lớp bảo vệ dự án xuyên suốt
                </span>
              </div>
              <div>
                <strong className="block font-serif text-3xl font-normal text-[#8C6B18]">
                  100%
                </strong>
                <span className="text-xs text-slate-600 font-medium">
                  Cập nhật luật mới 2024–2026
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. QUICK COMMAND & SEARCH BAR */}
      <section className="site-shell quick-command-wrap">
        <div className="quick-command-bar">
          <Search className="w-5 h-5 text-[#8c6b18] shrink-0" />
          <input
            type="text"
            placeholder="Tra cứu nhanh 20 hợp đồng: gõ 'API', 'eKYC', 'bảo đảm', 'cổ đông', 'dữ liệu', 'sự cố'..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="text-xs text-slate-400 hover:text-slate-600 px-2 py-1 font-semibold cursor-pointer"
            >
              Xóa
            </button>
          )}
        </div>
        <div className="quick-tags">
          <span>Gợi ý tìm kiếm:</span>
          {[
            'Tích hợp API',
            'Điều lệ công ty',
            'Tài khoản bảo đảm',
            'Bảo vệ dữ liệu',
            'Khiếu nại tra soát',
            'Thuê ngoài CNTT',
          ].map((tag) => (
            <button
              key={tag}
              type="button"
              className="quick-tag-btn"
              onClick={() => setSearchQuery(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </section>

      {/* 3. SECTION 1: 6-PILLAR ARCHITECTURE (BENTO GRID) */}
      <section className="services-section">
        <div className="site-shell">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Hành trình pháp lý toàn diện</span>
              <h2>Sáu lớp bảo vệ dự án Ví điện tử</h2>
            </div>
            <p>
              Tổ chức theo trình tự logic chặt chẽ: kết quả pháp lý của giai đoạn
              trước là đầu vào kỹ thuật và vận hành cho giai đoạn tiếp theo.
            </p>
          </div>

          <RoyalDivider className="my-8" />

          <div className="bento-pillar-grid">
            {services.map((service, index) => {
              const icons = [
                <Layers key="0" />,
                <Landmark key="1" />,
                <Lock key="2" />,
                <FileCode2 key="3" />,
                <ShieldCheck key="4" />,
                <ShieldAlert key="5" />,
              ];
              return (
                <article className="bento-pillar-card" key={service.id}>
                  <div className="bento-pillar-head">
                    <span className="bento-pillar-num">{service.number}</span>
                    <div className="bento-pillar-icon">{icons[index]}</div>
                  </div>
                  <div>
                    {service.minimum && (
                      <span className="tier minimum mb-2">Tối thiểu (*)</span>
                    )}
                    {service.advanced && (
                      <span className="tier advanced mb-2">Nâng cao</span>
                    )}
                    <h3>{service.title}</h3>
                  </div>
                  <p>{service.description}</p>
                  <div className="bento-outcome-box">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-[#8c6b18]" />
                    <span>
                      <strong>Bàn giao:</strong> {service.outcome}
                    </span>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-8 flex justify-end">
            <Link className="text-link" href="/dich-vu">
              Xem chi tiết lộ trình 6 lớp dịch vụ <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. SECTION 2: 20 CONTRACTS & ESSENTIAL DOCUMENTS VAULT */}
      <section className="positioning-section">
        <div className="site-shell">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Kho hồ sơ cốt lõi</span>
              <h2>20 Hợp đồng &amp; Văn bản Pháp chế Then chốt</h2>
            </div>
            <p>
              Thiết kế chuẩn hóa cho toàn bộ các mối quan hệ: Nhà sáng lập, Ngân
              hàng liên kết, Đơn vị chấp nhận, Nhà thầu công nghệ và Người dùng.
            </p>
          </div>

          <div className="vault-filter-tabs">
            <button
              type="button"
              className={`vault-tab ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              Tất cả ({contracts.length})
            </button>
            <button
              type="button"
              className={`vault-tab ${activeTab === 'minimum' ? 'active' : ''}`}
              onClick={() => setActiveTab('minimum')}
            >
              Bắt buộc tối thiểu (
              {contracts.filter((c) => c.minimum).length})
            </button>
            <button
              type="button"
              className={`vault-tab ${activeTab === 'advanced' ? 'active' : ''}`}
              onClick={() => setActiveTab('advanced')}
            >
              Nâng cao &amp; Mở rộng (
              {contracts.filter((c) => !c.minimum).length})
            </button>
          </div>

          <div className="vault-grid">
            {filteredContracts.slice(0, 9).map((item, idx) => (
              <article className="vault-card" key={item.slug}>
                <div className="vault-card-top">
                  <span className="vault-card-num">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span
                    className={`tier ${item.minimum ? 'minimum' : 'advanced'}`}
                  >
                    {item.minimum ? 'TỐI THIỂU (*)' : 'NÂNG CAO'}
                  </span>
                </div>
                <h3>{item.shortTitle}</h3>
                <p>{item.summary}</p>
                <div className="vault-solves">
                  <strong>Giải quyết rủi ro:</strong>
                  <span>{item.solves}</span>
                </div>
                <div className="flex items-center justify-between mt-5 pt-3 border-t border-slate-100">
                  <Link
                    href={`/hop-dong/${item.slug}`}
                    className="vault-card-cta"
                  >
                    Xem chi tiết <ArrowUpRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href={`/cong-cu/tao-hop-dong?mau=${item.slug}`}
                    className="text-xs font-semibold text-[#8c6b18] hover:text-[#c59b27] flex items-center gap-1"
                  >
                    <Wand2 className="w-3.5 h-3.5" /> Tạo hợp đồng
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link className="gold-button inline-flex" href="/hop-dong">
              Khám phá toàn bộ 20 tài liệu trong Thư viện <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. SECTION 3: AI DIGITAL LEGAL SUITE */}
      <section className="ai-suite-section">
        <div className="site-shell">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Công nghệ hỗ trợ pháp chế</span>
              <h2>Nền tảng AI Pháp lý Số 1-Chạm</h2>
            </div>
            <p>
              Tự động hóa công tác rà soát, soạn thảo và tra cứu pháp luật chuyên
              ngành ví điện tử với tốc độ vượt trội và độ chính xác cao.
            </p>
          </div>

          <div className="ai-suite-grid">
            <div className="ai-suite-card">
              <span className="ai-suite-badge">Tự động 60s</span>
              <div className="ai-suite-icon">
                <Wand2 className="w-6 h-6" />
              </div>
              <h3>Trình Tạo Hợp Đồng Thông Minh</h3>
              <p>
                Điền tham số dự án 4 bước, tự động tính toán tỷ lệ vốn, thẩm
                quyền phê duyệt và xuất file DOCX chuẩn thể thức văn bản Việt Nam.
              </p>
              <Link className="ai-suite-btn primary" href="/cong-cu/tao-hop-dong">
                Tạo hợp đồng ngay <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="ai-suite-card">
              <span className="ai-suite-badge">Phân tích rủi ro</span>
              <div className="ai-suite-icon">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <h3>So Sánh &amp; Rà Soát Điều Khoản</h3>
              <p>
                Tải lên hợp đồng đối tác, phân tích chéo các điều khoản bất lợi
                về tài khoản bảo đảm, bồi thường thiệt hại và ranh giới API.
              </p>
              <Link className="ai-suite-btn secondary" href="/cong-cu">
                Rà soát điều khoản <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="ai-suite-card">
              <span className="ai-suite-badge">Trợ lý 24/7</span>
              <div className="ai-suite-icon">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3>Trợ Lý AI Luật Ví Điện Tử</h3>
              <p>
                Hỏi đáp tức thì về điều kiện cấp phép trung gian thanh toán, quy
                trình đối soát, định danh eKYC và Luật Bảo vệ dữ liệu cá nhân mới
                nhất.
              </p>
              <Link className="ai-suite-btn secondary" href="/cong-cu">
                Hỏi đáp với AI <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5.5. Academic Publications & Legal Community Hub */}
      <section className="py-16 bg-[#faf9f6] border-t border-[#e3e7eb]">
        <div className="site-shell">
          <div className="section-heading mb-10">
            <div>
              <span className="eyebrow">Học thuật &amp; Phản biện</span>
              <h2 className="text-2xl sm:text-3xl font-heading text-[#0a131e] font-semibold">
                Nội dung nghiên cứu &amp; Diễn đàn thảo luận
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#5f6e7c] max-w-xl">
              Cung cấp trọn vẹn báo cáo sơ bộ 6 chương đề án và không gian phản biện học thuật cho cộng đồng sinh viên, giảng viên và luật sư Fintech.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1: Báo cáo sơ bộ */}
            <article className="p-8 bg-white border border-[#e3e7eb] hover:border-[#c59b27] transition-all shadow-xs hover:shadow-md flex flex-col justify-between group rounded-sm">
              <div>
                <div className="w-12 h-12 rounded-sm bg-gradient-to-br from-[#FFFDF7] to-[#FAF1D7] border border-[#c59b27] text-[#8C6B18] flex items-center justify-center mb-5 group-hover:scale-105 transition-transform shadow-xs">
                  <BookOpen className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-mono font-bold text-[#8c6b18] uppercase tracking-wider block mb-1">
                  ĐỀ ÁN NHÓM 13 · 2 PHIÊN BẢN
                </span>
                <h3 className="font-heading text-2xl text-[#0a131e] font-bold mb-3 group-hover:text-[#8c6b18] transition-colors">
                  Báo cáo sơ bộ đề án
                </h3>
                <p className="text-xs sm:text-sm text-[#5f6e7c] leading-relaxed mb-6">
                  Đầy đủ sáu chương phân tích cơ sở pháp lý, cấu trúc dịch vụ và bộ 20 tài liệu hợp đồng mô phỏng. Hỗ trợ đọc trực tuyến phân mục và tải bản Word (.docx) gốc.
                </p>
              </div>

              <div className="pt-4 border-t border-[#e3e7eb] flex items-center justify-between">
                <Link
                  href="/bao-cao-so-bo"
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#0a131e] group-hover:text-[#8c6b18] transition"
                >
                  <span>Khám phá báo cáo sơ bộ</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <span className="text-[11px] font-semibold text-[#8c6b18] bg-[#fbf6ea] px-2.5 py-1 rounded-sm border border-[#c59b27]/30">
                  82 &amp; 21 trang
                </span>
              </div>
            </article>

            {/* Card 2: Diễn đàn thảo luận */}
            <article className="p-8 bg-white border border-[#e3e7eb] hover:border-[#c59b27] transition-all shadow-xs hover:shadow-md flex flex-col justify-between group rounded-sm">
              <div>
                <div className="w-12 h-12 rounded-sm bg-gradient-to-br from-[#FFFDF7] to-[#FAF1D7] border border-[#c59b27] text-[#8C6B18] flex items-center justify-center mb-5 group-hover:scale-105 transition-transform shadow-xs">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-mono font-bold text-[#8c6b18] uppercase tracking-wider block mb-1">
                  CỘNG ĐỒNG TRAO ĐỔI HỌC THUẬT
                </span>
                <h3 className="font-heading text-2xl text-[#0a131e] font-bold mb-3 group-hover:text-[#8c6b18] transition-colors">
                  Diễn đàn thảo luận
                </h3>
                <p className="text-xs sm:text-sm text-[#5f6e7c] leading-relaxed mb-6">
                  Không gian đặt câu hỏi, phản biện và thảo luận tình huống thực tế về cấp phép trung gian thanh toán, điều khoản ký quỹ 1:1 và an toàn dữ liệu eKYC.
                </p>
              </div>

              <div className="pt-4 border-t border-[#e3e7eb] flex items-center justify-between">
                <Link
                  href="/dien-dan"
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#0a131e] group-hover:text-[#8c6b18] transition"
                >
                  <span>Tham gia Diễn đàn thảo luận</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <span className="text-[11px] font-semibold text-[#8c6b18] bg-[#fbf6ea] px-2.5 py-1 rounded-sm border border-[#c59b27]/30">
                  Thảo luận mở
                </span>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* 6. SECTION 4: 4 CORE PRINCIPLES & 2024-2026 LEGAL BASIS */}
      <section className="principles-section">
        <div className="site-shell principles-grid">
          <div>
            <span className="eyebrow">Nguyên tắc triển khai</span>
            <h2>Bốn câu hỏi phải trả lời trước khi ký kết.</h2>
            <p className="text-slate-600 mt-4 leading-relaxed text-sm">
              Mỗi thỏa thuận trong hệ sinh thái ví điện tử phải được bảo đảm bằng
              chứng cứ kiểm tra, ranh giới trách nhiệm và cơ chế bảo toàn quyền lợi
              khách hàng.
            </p>

            <div className="mt-8 p-6 bg-white border border-[#e3e7eb] rounded-lg shadow-sm">
              <span className="text-xs uppercase font-bold tracking-wider text-[#8c6b18] block mb-2">
                Bảo chứng pháp lý
              </span>
              <p className="text-xs text-slate-500 m-0">
                Toàn bộ hồ sơ được xây dựng và đối chiếu trực tiếp với các văn
                bản quy phạm pháp luật đang có hiệu lực thi hành của Quốc hội,
                Chính phủ và Ngân hàng Nhà nước Việt Nam.
              </p>
            </div>
          </div>

          <div className="principle-list">
            <div>
              <Landmark className="w-5 h-5 text-[#8c6b18]" />
              <span>
                <strong>Chủ thể nào có giấy phép?</strong> Tên gọi “nền tảng
                công nghệ” hay “ứng dụng liên kết” không làm thay đổi bản chất
                pháp lý của dịch vụ trung gian thanh toán.
              </span>
            </div>
            <div>
              <Network className="w-5 h-5 text-[#8c6b18]" />
              <span>
                <strong>Tiền và dữ liệu đi đâu?</strong> Phạm vi pháp lý trong
                hợp đồng phải khớp chính xác với luồng kỹ thuật API, tài khoản bảo
                đảm và quyền truy cập thực tế.
              </span>
            </div>
            <div>
              <FileText className="w-5 h-5 text-[#8c6b18]" />
              <span>
                <strong>Hồ sơ nào chứng minh tuân thủ?</strong> Mọi nghĩa vụ pháp
                lý phải gắn liền với đầu mối chịu trách nhiệm, biểu mẫu ban hành
                và dấu vết kiểm tra lưu vết hệ thống.
              </span>
            </div>
            <div>
              <ShieldCheck className="w-5 h-5 text-[#8c6b18]" />
              <span>
                <strong>Khi có sự cố, ai quyết định?</strong> Quy trình khẩn cấp
                phải quy định rõ thẩm quyền xử lý, phương án bảo toàn chứng cứ và
                thời hạn bắt buộc báo cáo cơ quan quản lý.
              </span>
            </div>
          </div>
        </div>

        {/* Legal citations cards */}
        <div className="site-shell mt-12 pt-10 border-t border-[#e3e7eb]">
          <span className="text-xs font-bold uppercase tracking-wider text-[#8c6b18] block mb-4">
            Căn cứ pháp lý cốt lõi (2024–2026)
          </span>
          <div className="legal-laws-strip">
            {legalSources.slice(0, 4).map(([title, time, url]) => (
              <a
                key={title}
                href={url}
                target="_blank"
                rel="noreferrer"
                className="legal-law-card"
              >
                <div>
                  <strong>{title}</strong>
                  <span>{time}</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-[#8c6b18]" />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 7. SECTION 5: TEAM & EXECUTIVE CTA */}
      <section className="border-t border-[#e3e7eb] bg-white py-10 md:py-14" id="doi-ngu-section">
        <div className="site-shell">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-5">
            <div>
              <span className="eyebrow">Minh bạch học thuật</span>
              <h2 className="text-2xl md:text-3xl font-serif text-[#0a131e] mt-1 mb-1">
                Đội ngũ Chuyên trách Dự án
              </h2>
              <p className="text-xs md:text-sm text-[#4A5868] max-w-xl">
                12 thành viên phụ trách chuyên sâu từng mảng: từ thành lập doanh
                nghiệp, hợp đồng thương mại đến tuân thủ dữ liệu cá nhân.
              </p>
            </div>

            <div className="flex items-center flex-wrap gap-2">
              {/* Chế độ xem: Lưới 2 hàng hoặc Băng trượt 1 hàng */}
              <div className="flex items-center bg-[#f4f6f8] p-1 rounded-md border border-[#e3e7eb]">
                <button
                  type="button"
                  onClick={() => setTeamViewMode('grid')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-sm transition cursor-pointer ${
                    teamViewMode === 'grid'
                      ? 'bg-white text-[#0a131e] shadow-xs border border-[#c59b27]/40 font-bold'
                      : 'text-[#5f6e7c] hover:text-[#0a131e]'
                  }`}
                  title="Hiển thị lưới gọn (2 hàng trên màn hình lớn)"
                >
                  <LayoutGrid className="w-3.5 h-3.5 text-[#8c6b18]" />
                  <span>Lưới 2 hàng</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTeamViewMode('carousel')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-sm transition cursor-pointer ${
                    teamViewMode === 'carousel'
                      ? 'bg-white text-[#0a131e] shadow-xs border border-[#c59b27]/40 font-bold'
                      : 'text-[#5f6e7c] hover:text-[#0a131e]'
                  }`}
                  title="Hiển thị thanh trượt 1 hàng ngang duy nhất"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#8c6b18]" />
                  <span>Băng trượt 1 hàng</span>
                </button>
              </div>

              {/* Nút lướt nếu ở chế độ Băng trượt */}
              {teamViewMode === 'carousel' && (
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => scrollCarousel('left')}
                    className="p-1.5 bg-white border border-[#c59b27] hover:bg-[#c59b27] text-[#0a131e] hover:text-white rounded-sm transition cursor-pointer shadow-xs"
                    title="Lướt sang trái"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollCarousel('right')}
                    className="p-1.5 bg-white border border-[#c59b27] hover:bg-[#c59b27] text-[#0a131e] hover:text-white rounded-sm transition cursor-pointer shadow-xs"
                    title="Lướt sang phải"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Nút cập nhật ảnh hàng loạt */}
              <input
                ref={teamBatchInputRef}
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleBatchTeamUpload}
              />
              <button
                type="button"
                onClick={() => teamBatchInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#c59b27] text-[#0a131e] hover:bg-[#c59b27] hover:text-[#2a1f04] text-xs font-bold transition shadow-xs cursor-pointer rounded-sm"
              >
                <Upload className="w-3.5 h-3.5 text-[#8c6b18]" />
                <span>Cập nhật ảnh</span>
              </button>
            </div>
          </div>

          {teamNotification && (
            <div className="mb-4 p-2.5 bg-[#fcf8ed] text-[#684f0e] border border-[#c59b27] text-xs font-semibold flex items-center justify-between shadow-xs rounded-sm">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#8c6b18]" />
                <span>{teamNotification}</span>
              </div>
              <button
                onClick={() => setTeamNotification(null)}
                className="text-slate-500 hover:text-black cursor-pointer font-bold px-2"
              >
                ✕
              </button>
            </div>
          )}

          {teamViewMode === 'grid' ? (
            <div className="team-strip">
              {(isTeamExpanded ? teamMembers : teamMembers.slice(0, 6)).map((member) => {
                const initials = member.name
                  .split(' ')
                  .slice(-2)
                  .map((w) => w[0])
                  .join('');
                const avatarSrc = avatars[member.slug] || member.avatarUrl;

                return (
                  <div className="team-member-card group relative" key={member.id}>
                    <div className="team-member-avatar relative overflow-hidden flex-shrink-0">
                      <img
                        src={avatarSrc}
                        alt={member.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover rounded-full"
                        onError={(e) => {
                          const target = e.currentTarget;
                          target.style.display = 'none';
                          const fallback = target.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = 'grid';
                        }}
                      />
                      <div
                        style={{ display: 'none' }}
                        className="absolute inset-0 bg-gradient-to-br from-[#FFFFFF] to-[#FAF1D7] text-[#8C6B18] font-serif font-bold text-sm grid place-items-center rounded-full"
                      >
                        {initials}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <strong className="truncate">{member.name}</strong>
                        {member.role.includes('Trưởng nhóm') && (
                          <span className="bg-[#8c6b18]/10 text-[#8c6b18] text-[9px] font-bold px-1.5 py-0.2 rounded-xs whitespace-nowrap">
                            Trưởng nhóm
                          </span>
                        )}
                      </div>
                      <span className="truncate block text-slate-500 text-[11px]" title={member.role}>
                        {member.role}
                      </span>
                    </div>

                    {/* Quick upload icon on card hover */}
                    <label
                      title={`Đổi ảnh cho ${member.name}`}
                      className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-1.5 right-1.5 p-1 bg-white/95 hover:bg-[#c59b27] text-[#8c6b18] hover:text-[#2a1f04] rounded-full border border-[#c59b27]/40 shadow-xs cursor-pointer"
                    >
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const base64 = await compressImageFile(file);
                            if (base64) {
                              await saveAvatar(member.slug, base64);
                              setTeamNotification(`Đã cập nhật ảnh thành viên ${member.name}`);
                              setTimeout(() => setTeamNotification(null), 3000);
                            }
                          }
                        }}
                      />
                      <Camera className="w-3 h-3" />
                    </label>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="relative">
              <div ref={carouselContainerRef} className="team-carousel-strip">
                {teamMembers.map((member) => {
                  const initials = member.name
                    .split(' ')
                    .slice(-2)
                    .map((w) => w[0])
                    .join('');
                  const avatarSrc = avatars[member.slug] || member.avatarUrl;

                  return (
                    <div className="team-carousel-item" key={member.id}>
                      <div className="team-member-card group relative">
                        <div className="team-member-avatar relative overflow-hidden flex-shrink-0">
                          <img
                            src={avatarSrc}
                            alt={member.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover rounded-full"
                            onError={(e) => {
                              const target = e.currentTarget;
                              target.style.display = 'none';
                              const fallback = target.nextElementSibling as HTMLElement;
                              if (fallback) fallback.style.display = 'grid';
                            }}
                          />
                          <div
                            style={{ display: 'none' }}
                            className="absolute inset-0 bg-gradient-to-br from-[#FFFFFF] to-[#FAF1D7] text-[#8C6B18] font-serif font-bold text-sm grid place-items-center rounded-full"
                          >
                            {initials}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <strong className="truncate">{member.name}</strong>
                            {member.role.includes('Trưởng nhóm') && (
                              <span className="bg-[#8c6b18]/10 text-[#8c6b18] text-[9px] font-bold px-1.5 py-0.2 rounded-xs whitespace-nowrap">
                                Trưởng nhóm
                              </span>
                            )}
                          </div>
                          <span className="truncate block text-slate-500 text-[11px]" title={member.role}>
                            {member.role}
                          </span>
                        </div>

                        {/* Quick upload icon on card hover */}
                        <label
                          title={`Đổi ảnh cho ${member.name}`}
                          className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-1.5 right-1.5 p-1 bg-white/95 hover:bg-[#c59b27] text-[#8c6b18] hover:text-[#2a1f04] rounded-full border border-[#c59b27]/40 shadow-xs cursor-pointer"
                        >
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const base64 = await compressImageFile(file);
                                if (base64) {
                                  await saveAvatar(member.slug, base64);
                                  setTeamNotification(`Đã cập nhật ảnh thành viên ${member.name}`);
                                  setTimeout(() => setTeamNotification(null), 3000);
                                }
                              }
                            }}
                          />
                          <Camera className="w-3 h-3" />
                        </label>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Footer bar của Section đội ngũ */}
          <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-[#f0f2f4] pt-4">
            {teamViewMode === 'grid' ? (
              <button
                type="button"
                onClick={() => setIsTeamExpanded(!isTeamExpanded)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#8c6b18] bg-[#fbf9f2] border border-[#c59b27]/40 rounded-sm hover:bg-[#c59b27] hover:text-[#2a1f04] transition cursor-pointer"
              >
                {isTeamExpanded ? (
                  <>
                    <span>Thu gọn (hiển thị 6 thành viên)</span>
                    <ChevronUp className="w-3.5 h-3.5" />
                  </>
                ) : (
                  <>
                    <span>Xem đủ 12 thành viên (2 hàng)</span>
                    <ChevronDown className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            ) : (
              <span className="text-xs text-[#5f6e7c]">
                ← Lướt ngang hoặc dùng 2 nút mũi tên bên trên để xem 12 thành viên →
              </span>
            )}

            <Link className="gold-button inline-flex text-xs py-2 px-4" href="/doi-ngu">
              Xem chi tiết hồ sơ 12 thành viên Ban nghiên cứu <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* 8. FINAL CTA */}
      <section className="cta-section relative overflow-hidden">
        <RoyalCornerDecor />
        <div className="site-shell cta-inner relative z-10">
          <div>
            <span className="eyebrow">Khởi đầu vững chắc từ mô hình</span>
            <h2>Biến yêu cầu pháp luật thành lộ trình có thể thực hiện.</h2>
            <p className="text-[#4A5868] text-sm mt-3 max-w-xl">
              Hệ thống tài liệu và công cụ của Thịnh Vượng Legal giúp rút ngắn thời
              gian chuẩn bị hồ sơ từ vài tháng xuống vài giờ.
            </p>
          </div>
          <div className="flex flex-col items-center gap-3">
            <a
              className="gold-button w-full justify-center"
              href="https://zalo.me/0961621602"
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle className="w-4 h-4" /> Trao đổi trực tiếp qua Zalo
            </a>
            <span className="text-xs text-[#8C6B18] font-semibold">
              Dự án mô phỏng phục vụ nghiên cứu &amp; học tập
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}
