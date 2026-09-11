import React, { createContext, useContext, useEffect, useState } from 'react';
import { Sparkles, Frame, Sun, Check } from 'lucide-react';

export type RoyalStyle = 'a' | 'b' | 'c';

interface RoyalThemeContextType {
  style: RoyalStyle;
  setStyle: (style: RoyalStyle) => void;
}

const RoyalThemeContext = createContext<RoyalThemeContextType>({
  style: 'a',
  setStyle: () => {},
});

export function useRoyalTheme() {
  return useContext(RoyalThemeContext);
}

/**
 * RoyalThemeProvider: Quản lý trạng thái phong cách hoa văn hoàng gia (A, B, C)
 */
export function RoyalThemeProvider({ children }: { children: React.ReactNode }) {
  const [style, setStyleState] = useState<RoyalStyle>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('tv_royal_style');
        if (saved === 'a' || saved === 'b' || saved === 'c') return saved;
      } catch {}
    }
    return 'a'; // Mặc định là Phương án A
  });

  const setStyle = (s: RoyalStyle) => {
    setStyleState(s);
    try {
      localStorage.setItem('tv_royal_style', s);
    } catch {}
  };

  return (
    <RoyalThemeContext.Provider value={{ style, setStyle }}>
      <div className={`royal-theme-wrapper style-${style}`}>
        {/* Nền vân chìm Guilloche hoàng gia dành riêng cho Phương án A */}
        {style === 'a' && <RoyalGuillocheBg />}
        {children}
        {/* Thanh công cụ chuyển đổi thử nghiệm 3 phương án trực tiếp */}
        <RoyalThemeSwitcher />
      </div>
    </RoyalThemeContext.Provider>
  );
}

/**
 * PHƯƠNG ÁN A: Cánh hoa văn hoàng gia sườn Hero (Royal Hero Symmetrical Wings)
 * Chỉ xuất hiện ở khu vực Hero Section, chiều cao vừa vặn, vuốt nhọn 2 đầu, KHÔNG kéo dài theo trang.
 */
export function RoyalHeroWings() {
  const { style } = useRoyalTheme();
  if (style !== 'a') return null;

  return (
    <div className="royal-hero-wings-container pointer-events-none" aria-hidden="true">
      {/* Cánh trái hoàng gia */}
      <div className="royal-hero-wing left">
        <RoyalWingSvg />
      </div>

      {/* Cánh phải hoàng gia (đối xứng gương hoàn hảo qua scaleX(-1)) */}
      <div className="royal-hero-wing right">
        <RoyalWingSvg />
      </div>
    </div>
  );
}

/**
 * PHƯƠNG ÁN A: Nền vân chìm bảo an Guilloche (Royal Guilloche Watermark Pattern)
 * Chìm sâu dưới đáy trang (độ mờ 3.5%), không che lấp chữ, tạo cảm giác như giấy in sắc chỉ hoàng gia.
 */
export function RoyalGuillocheBg() {
  return (
    <div className="royal-guilloche-watermark pointer-events-none" aria-hidden="true">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="guillocheUnit" width="120" height="120" patternUnits="userSpaceOnUse">
            <circle cx="60" cy="60" r="50" stroke="#8C6B18" strokeWidth="0.5" fill="none" opacity="0.3" />
            <circle cx="60" cy="60" r="35" stroke="#C59B27" strokeWidth="0.5" fill="none" opacity="0.25" />
            <circle cx="60" cy="60" r="20" stroke="#8C6B18" strokeWidth="0.5" strokeDasharray="2 3" fill="none" opacity="0.35" />
            {/* 4 cánh hoa guilloche đối xứng */}
            <path d="M60 10 C80 35 80 85 60 110 C40 85 40 35 60 10Z" stroke="#8C6B18" strokeWidth="0.4" fill="none" opacity="0.2" />
            <path d="M10 60 C35 80 85 80 110 60 C85 40 35 40 10 60Z" stroke="#8C6B18" strokeWidth="0.4" fill="none" opacity="0.2" />
            {/* Điểm nhấn hạt ngọc tâm */}
            <circle cx="60" cy="60" r="1.5" fill="#C59B27" opacity="0.4" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#guillocheUnit)" />
      </svg>
    </div>
  );
}

/**
 * PHƯƠNG ÁN B: Cụm hoa văn góc hoàng gia (Royal Corner Filigree)
 * Dùng cho Phương án B (khung chỉ vàng và 4 góc hoàng gia), hoặc điểm xuyết cho card.
 */
export function RoyalCornerDecor({ className = '' }: { className?: string }) {
  const { style } = useRoyalTheme();
  // Ở phương án C tắt hoàn toàn hoa văn góc để đạt độ tối giản
  if (style === 'c') return null;

  return (
    <div className={`royal-corner-wrapper pointer-events-none select-none ${className}`} aria-hidden="true">
      <div className="royal-corner top-left">
        <RoyalCornerSvg />
      </div>
      <div className="royal-corner top-right">
        <RoyalCornerSvg />
      </div>
      <div className="royal-corner bottom-left">
        <RoyalCornerSvg />
      </div>
      <div className="royal-corner bottom-right">
        <RoyalCornerSvg />
      </div>
    </div>
  );
}

/**
 * Họa tiết phân cách hoàng gia đối xứng trung tâm (Symmetrical Palmette Crest Divider)
 */
export function RoyalDivider({ className = '' }: { className?: string }) {
  return (
    <div className={`royal-divider-wrap ${className}`} aria-hidden="true">
      <div className="royal-divider-line left" />
      <svg
        width="110"
        height="24"
        viewBox="0 0 110 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="royal-divider-crest"
      >
        <path
          d="M55 2L57.5 9.5H65L59 13.5L61.5 21L55 16.5L48.5 21L51 13.5L45 9.5H52.5L55 2Z"
          fill="url(#crestGoldGrad)"
          stroke="#8C6B18"
          strokeWidth="0.75"
        />
        <circle cx="55" cy="13" r="2" fill="#FFFDF8" />
        <path
          d="M44 12C38 6 30 7 24 12C18 17 10 16 2 12"
          stroke="url(#crestGoldGrad)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M40 14C34 9 28 10 22 14C17 18 11 17 5 14"
          stroke="#8C6B18"
          strokeWidth="0.75"
          strokeLinecap="round"
          strokeDasharray="1 2"
        />
        <circle cx="24" cy="12" r="1.8" fill="#C59B27" />
        <circle cx="2" cy="12" r="2.2" fill="url(#crestGoldGrad)" />

        <path
          d="M66 12C72 6 80 7 86 12C92 17 100 16 108 12"
          stroke="url(#crestGoldGrad)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M70 14C76 9 82 10 88 14C93 18 99 17 105 14"
          stroke="#8C6B18"
          strokeWidth="0.75"
          strokeLinecap="round"
          strokeDasharray="1 2"
        />
        <circle cx="86" cy="12" r="1.8" fill="#C59B27" />
        <circle cx="108" cy="12" r="2.2" fill="url(#crestGoldGrad)" />

        <defs>
          <linearGradient id="crestGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#684F0E" />
            <stop offset="35%" stopColor="#C59B27" />
            <stop offset="55%" stopColor="#FFFDF8" />
            <stop offset="75%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#8C6B18" />
          </linearGradient>
        </defs>
      </svg>
      <div className="royal-divider-line right" />
    </div>
  );
}

/**
 * Thanh chuyển đổi trực tiếp 3 Phương án (Floating Theme Preview Switcher)
 * Giúp người dùng click thử nghiệm tức thì giữa Phương án A, B và C trên website thực tế.
 */
export function RoyalThemeSwitcher() {
  const { style, setStyle } = useRoyalTheme();
  const [minimized, setMinimized] = useState(false);

  return (
    <aside
      className={`royal-switcher-panel ${minimized ? 'minimized' : ''}`}
      aria-label="Bộ điều khiển thử nghiệm phong cách hoa văn hoàng gia"
    >
      <div className="switcher-header" onClick={() => setMinimized(!minimized)}>
        <div className="flex items-center gap-2">
          <span className="switcher-badge">Xem thử 3 phong cách</span>
          <span className="text-xs font-bold text-[#8C6B18]">Hoa Văn Hoàng Gia</span>
        </div>
        <button
          type="button"
          className="text-xs text-[#8C6B18] font-semibold hover:underline"
        >
          {minimized ? 'Mở rộng ▲' : 'Thu gọn ▼'}
        </button>
      </div>

      {!minimized && (
        <div className="switcher-body">
          <div className="switcher-options">
            <button
              type="button"
              className={`switcher-btn ${style === 'a' ? 'active' : ''}`}
              onClick={() => setStyle('a')}
            >
              <div className="switcher-btn-head">
                <Sparkles className="w-4 h-4 text-[#8C6B18]" />
                <strong>Phương án A</strong>
                {style === 'a' && <Check className="w-3.5 h-3.5 ml-auto text-[#8C6B18]" />}
              </div>
              <p>Cánh hoa văn sườn Hero & Nền vân chìm Guilloche</p>
            </button>

            <button
              type="button"
              className={`switcher-btn ${style === 'b' ? 'active' : ''}`}
              onClick={() => setStyle('b')}
            >
              <div className="switcher-btn-head">
                <Frame className="w-4 h-4 text-[#8C6B18]" />
                <strong>Phương án B</strong>
                {style === 'b' && <Check className="w-3.5 h-3.5 ml-auto text-[#8C6B18]" />}
              </div>
              <p>Khung chỉ vàng đôi & 4 góc hoàng gia Baroque</p>
            </button>

            <button
              type="button"
              className={`switcher-btn ${style === 'c' ? 'active' : ''}`}
              onClick={() => setStyle('c')}
            >
              <div className="switcher-btn-head">
                <Sun className="w-4 h-4 text-[#8C6B18]" />
                <strong>Phương án C</strong>
                {style === 'c' && <Check className="w-3.5 h-3.5 ml-auto text-[#8C6B18]" />}
              </div>
              <p>Hào quang vàng ngà đối xứng & Phù hiệu tối giản</p>
            </button>
          </div>
          <div className="switcher-note">
            <span>💡 Bấm chọn từng phương án để so sánh trực tiếp trên giao diện thực tế!</span>
          </div>
        </div>
      )}
    </aside>
  );
}

/**
 * Cánh hoa văn sườn hoàng gia (Hero Wing SVG)
 * Cao vừa vặn 540px, thon nhọn 2 đầu, tỏa rộng ở giữa, không kéo dài theo trang.
 */
function RoyalWingSvg() {
  return (
    <svg
      width="140"
      height="540"
      viewBox="0 0 140 540"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="royal-wing-svg"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="heroWingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#684F0E" />
          <stop offset="25%" stopColor="#8C6B18" />
          <stop offset="50%" stopColor="#C59B27" />
          <stop offset="70%" stopColor="#FFFDF8" stopOpacity="0.95" />
          <stop offset="85%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#7D5D0D" />
        </linearGradient>

        <linearGradient id="wingGlowFade" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFDF8" stopOpacity="0" />
          <stop offset="25%" stopColor="#C59B27" stopOpacity="0.35" />
          <stop offset="50%" stopColor="#FFFDF8" stopOpacity="0.6" />
          <stop offset="75%" stopColor="#C59B27" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#FFFDF8" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Đường sống lưng vuốt nhọn hai đầu */}
      <path
        d="M6 30 Q12 180 12 270 Q12 360 6 510"
        stroke="url(#heroWingGrad)"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M12 70 Q18 190 18 270 Q18 350 12 470"
        stroke="#8C6B18"
        strokeWidth="0.8"
        strokeDasharray="2 4"
      />

      {/* Chuỗi hạt ngọc mạ vàng thưa dần ở hai đầu */}
      {[70, 110, 150, 190, 230, 270, 310, 350, 390, 430, 470].map((y) => (
        <g key={y}>
          <circle cx="6" cy={y} r="2" fill="#FFFDF8" stroke="#8C6B18" strokeWidth="0.75" />
          <circle cx="6" cy={y} r="0.8" fill="#C59B27" />
        </g>
      ))}

      {/* Cụm vòm cuộn lá Acanthus nở rộng ở trung tâm Hero (y: 180 - 360) */}
      {/* Vòm trên */}
      <path
        d="M6 130 C45 130 90 150 95 190 C98 220 70 235 55 225 C40 215 42 195 55 188 C65 182 78 190 74 202"
        stroke="url(#heroWingGrad)"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M25 155 C55 160 80 180 75 205"
        stroke="#8C6B18"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
      />

      {/* Hoa hoàng gia trung tâm cánh tại y = 270 */}
      <g transform="translate(6, 270)">
        <path
          d="M0 0 C30 -20 75 -15 95 0 C75 15 30 20 0 0Z"
          fill="url(#heroWingGrad)"
          stroke="#684F0E"
          strokeWidth="0.8"
        />
        <circle cx="50" cy="0" r="4.5" fill="#FFFDF8" stroke="#8C6B18" strokeWidth="1" />
        <circle cx="50" cy="0" r="2.5" fill="#C59B27" />
        <path d="M50 -10 V10 M40 0 H60" stroke="#C59B27" strokeWidth="0.8" />
        {/* Lá vươn ra rìa sườn */}
        <path
          d="M95 0 C115 -10 135 5 130 20 C125 30 110 25 105 15"
          stroke="url(#heroWingGrad)"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
      </g>

      {/* Vòm dưới đối xứng */}
      <path
        d="M6 410 C45 410 90 390 95 350 C98 320 70 305 55 315 C40 325 42 345 55 352 C65 358 78 350 74 338"
        stroke="url(#heroWingGrad)"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M25 385 C55 380 80 360 75 335"
        stroke="#8C6B18"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

/**
 * Cụm hoa văn góc Baroque
 */
function RoyalCornerSvg() {
  return (
    <svg
      width="90"
      height="90"
      viewBox="0 0 90 90"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="royal-corner-svg"
    >
      <defs>
        <linearGradient id="cornerGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#684F0E" />
          <stop offset="35%" stopColor="#C59B27" />
          <stop offset="60%" stopColor="#FFFDF8" />
          <stop offset="85%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#8C6B18" />
        </linearGradient>
      </defs>

      <path d="M4 55 V12 C4 7.578 7.578 4 12 4 H55" stroke="url(#cornerGoldGrad)" strokeWidth="1.6" fill="none" />
      <path d="M9 45 V15 C9 11.686 11.686 9 15 9 H45" stroke="#8C6B18" strokeWidth="0.8" strokeDasharray="1.5 3" fill="none" />

      <circle cx="8" cy="8" r="2.8" fill="#FFFDF8" stroke="#8C6B18" strokeWidth="0.8" />
      <circle cx="8" cy="8" r="1.3" fill="#C59B27" />

      <path
        d="M8 8 C22 22 30 42 28 58 C26 65 19 68 14 64 C10 60 12 52 19 50 C24 49 28 55 24 60"
        stroke="url(#cornerGoldGrad)"
        strokeWidth="1.3"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M8 8 C22 22 42 30 58 28 C65 26 68 19 64 14 C60 10 52 12 50 19 C49 24 55 28 60 24"
        stroke="url(#cornerGoldGrad)"
        strokeWidth="1.3"
        strokeLinecap="round"
        fill="none"
      />

      <circle cx="30" cy="30" r="3" fill="#FFFDF8" stroke="#8C6B18" strokeWidth="0.8" />
      <circle cx="30" cy="30" r="1.5" fill="#C59B27" />
    </svg>
  );
}
