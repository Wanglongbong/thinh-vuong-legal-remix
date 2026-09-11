import React, { createContext, useContext, useState } from 'react';
import { Sparkles, Waves, Shield, Check } from 'lucide-react';

export type RoyalStyle = '1' | '2' | '3';

interface RoyalThemeContextType {
  style: RoyalStyle;
  setStyle: (style: RoyalStyle) => void;
}

const RoyalThemeContext = createContext<RoyalThemeContextType>({
  style: '1',
  setStyle: () => {},
});

export function useRoyalTheme() {
  return useContext(RoyalThemeContext);
}

/**
 * RoyalThemeProvider: Quản lý 3 phong cách hoa văn hòa quyện nền
 * Style 1: Vân Gấm Hoàng Gia Dệt Chìm (Damask Silk Weave)
 * Style 2: Vân Vi Sóng Bảo An Champagne (Imperial Micro-Guilloche Waves)
 * Style 3: Phù Hiệu Bảo Chứng Grand Seal Chìm Mờ (Imperial Watermark Seal)
 */
export function RoyalThemeProvider({ children }: { children: React.ReactNode }) {
  const [style, setStyleState] = useState<RoyalStyle>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('tv_seamless_royal_style');
        if (saved === '1' || saved === '2' || saved === '3') return saved;
      } catch {}
    }
    return '1'; // Mặc định là Phong cách 1 (Vân gấm dệt chìm)
  });

  const setStyle = (s: RoyalStyle) => {
    setStyleState(s);
    try {
      localStorage.setItem('tv_seamless_royal_style', s);
    } catch {}
  };

  return (
    <RoyalThemeContext.Provider value={{ style, setStyle }}>
      <div className={`royal-theme-wrapper active-style-${style}`}>
        {/* Render nền hoa văn tương ứng theo phong cách được chọn */}
        {style === '1' && <RoyalDamaskCanvas />}
        {style === '2' && <RoyalGuillocheWaves />}
        {children}
        {/* Bảng điều khiển nổi thử nghiệm 3 phong cách trực tiếp */}
        <RoyalThemeSwitcher />
      </div>
    </RoyalThemeContext.Provider>
  );
}

/**
 * PHONG CÁCH 1: Vân Gấm Hoàng Gia Dệt Chìm (Royal Damask Silk Weave)
 * Họa tiết hoa acanthus và hoa huệ dệt chìm siêu mịn (nét 0.45px), kết hợp mặt nạ Radial Vignette
 * làm trong suốt 100% vùng chữ ở giữa, chỉ hiện nhẹ nhàng ở 2 bên lề và các góc.
 */
export function RoyalDamaskCanvas() {
  return (
    <div className="royal-damask-canvas pointer-events-none" aria-hidden="true">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="damaskBrocadeUnit" width="160" height="220" patternUnits="userSpaceOnUse">
            {/* Lưới mắt cáo liên kết siêu mờ */}
            <path
              d="M80 0 L160 110 L80 220 L0 110 Z"
              stroke="#B39239"
              strokeWidth="0.4"
              strokeDasharray="2 4"
              fill="none"
              opacity="0.3"
            />
            {/* Cụm hoa huệ / Fleur-de-lis trung tâm tại (80, 110) */}
            <g transform="translate(80, 110)">
              {/* Cánh giữa vươn lên */}
              <path
                d="M0 -22 C-4 -12 -5 -4 0 0 C5 -4 4 -12 0 -22 Z"
                stroke="#8C6B18"
                strokeWidth="0.5"
                fill="none"
                opacity="0.6"
              />
              {/* Cánh trái uốn cong */}
              <path
                d="M0 0 C-8 -2 -16 -6 -18 -14 C-20 -20 -12 -22 -8 -16 C-5 -12 -4 -6 0 0"
                stroke="#C59B27"
                strokeWidth="0.45"
                fill="none"
                opacity="0.5"
              />
              {/* Cánh phải uốn cong đối xứng */}
              <path
                d="M0 0 C8 -2 16 -6 18 -14 C20 -20 12 -22 8 -16 C5 -12 4 -6 0 0"
                stroke="#C59B27"
                strokeWidth="0.45"
                fill="none"
                opacity="0.5"
              />
              {/* Đai thắt nơ hoàng gia */}
              <line x1="-10" y1="2" x2="10" y2="2" stroke="#8C6B18" strokeWidth="0.6" opacity="0.6" />
              {/* Hạt ngọc cuống hoa */}
              <circle cx="0" cy="8" r="1.5" fill="#C59B27" opacity="0.4" />
            </g>

            {/* Dây leo lá Acanthus uốn lượn tại 4 góc */}
            <path
              d="M0 0 C20 15 35 35 30 55 C26 70 12 75 0 80"
              stroke="#B39239"
              strokeWidth="0.4"
              fill="none"
              opacity="0.35"
            />
            <path
              d="M160 0 C140 15 125 35 130 55 C134 70 148 75 160 80"
              stroke="#B39239"
              strokeWidth="0.4"
              fill="none"
              opacity="0.35"
            />
            <path
              d="M0 220 C20 205 35 185 30 165 C26 150 12 145 0 140"
              stroke="#B39239"
              strokeWidth="0.4"
              fill="none"
              opacity="0.35"
            />
            <path
              d="M160 220 C140 205 125 185 130 165 C134 150 148 145 160 140"
              stroke="#B39239"
              strokeWidth="0.4"
              fill="none"
              opacity="0.35"
            />

            {/* Hạt ngọc phản quang nhỏ */}
            <circle cx="80" cy="0" r="1.2" fill="#8C6B18" opacity="0.4" />
            <circle cx="80" cy="220" r="1.2" fill="#8C6B18" opacity="0.4" />
            <circle cx="0" cy="110" r="1.2" fill="#8C6B18" opacity="0.4" />
            <circle cx="160" cy="110" r="1.2" fill="#8C6B18" opacity="0.4" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#damaskBrocadeUnit)" />
      </svg>
    </div>
  );
}

/**
 * PHONG CÁCH 2: Vân Vi Sóng Bảo An Champagne (Imperial Micro-Guilloche Waves)
 * Các đường cong toán học đồng tâm cực mảnh (0.35px) đối xứng 2 bên sườn,
 * mang lại chiều sâu tài chính - pháp lý cao cấp như công trái / văn bằng hoàng gia.
 */
export function RoyalGuillocheWaves() {
  return (
    <div className="royal-guilloche-waves-canvas pointer-events-none" aria-hidden="true">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="guillocheWaveUnit" width="200" height="150" patternUnits="userSpaceOnUse">
            {/* Làn sóng sin hài hòa 1 */}
            <path
              d="M0 25 Q50 0 100 25 T200 25"
              stroke="#C59B27"
              strokeWidth="0.35"
              fill="none"
              opacity="0.35"
            />
            <path
              d="M0 35 Q50 10 100 35 T200 35"
              stroke="#8C6B18"
              strokeWidth="0.3"
              fill="none"
              opacity="0.25"
            />
            <path
              d="M0 45 Q50 20 100 45 T200 45"
              stroke="#C59B27"
              strokeWidth="0.35"
              fill="none"
              opacity="0.35"
            />
            {/* Làn sóng giao thoa ngược pha */}
            <path
              d="M0 100 Q50 125 100 100 T200 100"
              stroke="#8C6B18"
              strokeWidth="0.35"
              fill="none"
              opacity="0.35"
            />
            <path
              d="M0 110 Q50 135 100 110 T200 110"
              stroke="#C59B27"
              strokeWidth="0.3"
              fill="none"
              opacity="0.25"
            />
            <path
              d="M0 120 Q50 145 100 120 T200 120"
              stroke="#8C6B18"
              strokeWidth="0.35"
              fill="none"
              opacity="0.35"
            />
            {/* Vòng xoắn bảo an vi mô ở tâm giao thoa */}
            <circle cx="100" cy="75" r="30" stroke="#C59B27" strokeWidth="0.3" strokeDasharray="2 3" fill="none" opacity="0.25" />
            <circle cx="100" cy="75" r="18" stroke="#8C6B18" strokeWidth="0.35" fill="none" opacity="0.3" />
            <circle cx="100" cy="75" r="1.5" fill="#8C6B18" opacity="0.4" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#guillocheWaveUnit)" />
      </svg>
    </div>
  );
}

/**
 * PHONG CÁCH 3: Phù Hiệu Bảo Chứng Khổng Lồ Chìm Mờ (Grand Imperial Seal Watermark)
 * Đặt chìm sâu dưới Hero Section (độ mờ 4.5%), kết hợp Cán cân Công lý & Vòng nguyệt quế đối xứng.
 */
export function GrandImperialSeal() {
  const { style } = useRoyalTheme();
  if (style !== '3') return null;

  return (
    <div className="grand-imperial-seal-wrap pointer-events-none" aria-hidden="true">
      <svg
        width="680"
        height="680"
        viewBox="0 0 680 680"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="grand-imperial-seal-svg"
      >
        <defs>
          <linearGradient id="sealGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#684F0E" />
            <stop offset="35%" stopColor="#8C6B18" />
            <stop offset="60%" stopColor="#C59B27" />
            <stop offset="100%" stopColor="#7D5D0D" />
          </linearGradient>
        </defs>

        {/* Vành tròn ngoài đôi bảo chứng */}
        <circle cx="340" cy="340" r="330" stroke="url(#sealGoldGrad)" strokeWidth="1.5" opacity="0.5" />
        <circle cx="340" cy="340" r="316" stroke="#8C6B18" strokeWidth="0.8" strokeDasharray="3 4" opacity="0.6" />
        <circle cx="340" cy="340" r="290" stroke="url(#sealGoldGrad)" strokeWidth="1" opacity="0.4" />

        {/* Chuỗi 48 hạt ngọc La Mã quanh vành */}
        {Array.from({ length: 36 }).map((_, i) => {
          const angle = (i * 360) / 36;
          const rad = (angle * Math.PI) / 180;
          const cx = 340 + 303 * Math.cos(rad);
          const cy = 340 + 303 * Math.sin(rad);
          return <circle key={i} cx={cx} cy={cy} r="2" fill="#8C6B18" opacity="0.45" />;
        })}

        {/* Vòng Nguyệt Quế Hoàng Gia đối xứng hai bên (Laurel Wreath) */}
        {/* Nhánh nguyệt quế trái */}
        <path
          d="M200 480 C150 400 150 260 230 180 C245 165 260 155 280 145"
          stroke="url(#sealGoldGrad)"
          strokeWidth="1.8"
          strokeLinecap="round"
          opacity="0.6"
        />
        {/* Nhánh nguyệt quế phải (đối xứng) */}
        <path
          d="M480 480 C530 400 530 260 450 180 C435 165 420 155 400 145"
          stroke="url(#sealGoldGrad)"
          strokeWidth="1.8"
          strokeLinecap="round"
          opacity="0.6"
        />

        {/* Các cặp lá nguyệt quế đối xứng trái & phải */}
        {[-80, -50, -20, 10, 40, 70, 100].map((offset, idx) => (
          <g key={idx}>
            {/* Lá bên trái */}
            <ellipse cx={185 + Math.abs(offset) * 0.4} cy={330 + offset} rx="14" ry="7" transform={`rotate(${-25 + offset * 0.3}, ${185 + Math.abs(offset) * 0.4}, ${330 + offset})`} stroke="#8C6B18" strokeWidth="0.8" fill="none" opacity="0.5" />
            {/* Lá bên phải */}
            <ellipse cx={495 - Math.abs(offset) * 0.4} cy={330 + offset} rx="14" ry="7" transform={`rotate(${25 - offset * 0.3}, ${495 - Math.abs(offset) * 0.4}, ${330 + offset})`} stroke="#8C6B18" strokeWidth="0.8" fill="none" opacity="0.5" />
          </g>
        ))}

        {/* Biểu tượng Trung tâm: Cán cân Công lý & Thanh gươm bảo chứng */}
        <g transform="translate(340, 340)">
          {/* Trục đứng thanh gươm */}
          <line x1="0" y1="-140" x2="0" y2="120" stroke="url(#sealGoldGrad)" strokeWidth="2.5" opacity="0.6" />
          {/* Đốc gươm / Phù hiệu đỉnh */}
          <circle cx="0" cy="-140" r="7" stroke="#8C6B18" strokeWidth="1.2" fill="none" opacity="0.6" />
          <line x1="-25" y1="-120" x2="25" y2="-120" stroke="url(#sealGoldGrad)" strokeWidth="2" opacity="0.6" />
          
          {/* Đòn cân ngang đối xứng */}
          <line x1="-110" y1="-50" x2="110" y2="-50" stroke="url(#sealGoldGrad)" strokeWidth="2" opacity="0.6" />
          <circle cx="0" cy="-50" r="5" fill="#8C6B18" opacity="0.5" />

          {/* Dây cân & Đĩa cân trái */}
          <line x1="-100" y1="-50" x2="-130" y2="20" stroke="#8C6B18" strokeWidth="0.8" opacity="0.5" />
          <line x1="-100" y1="-50" x2="-70" y2="20" stroke="#8C6B18" strokeWidth="0.8" opacity="0.5" />
          <path d="M-140 20 C-140 45 -60 45 -60 20 Z" stroke="url(#sealGoldGrad)" strokeWidth="1.2" fill="none" opacity="0.6" />

          {/* Dây cân & Đĩa cân phải (đối xứng hoàn hảo) */}
          <line x1="100" y1="-50" x2="70" y2="20" stroke="#8C6B18" strokeWidth="0.8" opacity="0.5" />
          <line x1="100" y1="-50" x2="130" y2="20" stroke="#8C6B18" strokeWidth="0.8" opacity="0.5" />
          <path d="M60 20 C60 45 140 45 140 20 Z" stroke="url(#sealGoldGrad)" strokeWidth="1.2" fill="none" opacity="0.6" />

          {/* Đế chân tháp vững chắc */}
          <path d="M-40 120 L40 120 L30 100 L-30 100 Z" stroke="url(#sealGoldGrad)" strokeWidth="1.5" fill="none" opacity="0.6" />
        </g>
      </svg>
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
          fill="url(#crestGoldGradNew)"
          stroke="#8C6B18"
          strokeWidth="0.75"
        />
        <circle cx="55" cy="13" r="2" fill="#FFFDF8" />
        <path
          d="M44 12C38 6 30 7 24 12C18 17 10 16 2 12"
          stroke="url(#crestGoldGradNew)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="24" cy="12" r="1.8" fill="#C59B27" />
        <circle cx="2" cy="12" r="2.2" fill="url(#crestGoldGradNew)" />

        <path
          d="M66 12C72 6 80 7 86 12C92 17 100 16 108 12"
          stroke="url(#crestGoldGradNew)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="86" cy="12" r="1.8" fill="#C59B27" />
        <circle cx="108" cy="12" r="2.2" fill="url(#crestGoldGradNew)" />

        <defs>
          <linearGradient id="crestGoldGradNew" x1="0%" y1="0%" x2="100%" y2="100%">
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
 * Thanh chuyển đổi trực tiếp 3 Phong cách mới (Floating Theme Switcher)
 * Giúp người dùng click thử nghiệm tức thì giữa Phong cách 1, 2 và 3 ngay trên trang.
 */
export function RoyalThemeSwitcher() {
  const { style, setStyle } = useRoyalTheme();
  const [minimized, setMinimized] = useState(false);

  return (
    <aside
      className={`royal-switcher-panel ${minimized ? 'minimized' : ''}`}
      aria-label="Bộ điều khiển thử nghiệm 3 phong cách hoa văn hoàng gia chìm hòa nền"
    >
      <div className="switcher-header" onClick={() => setMinimized(!minimized)}>
        <div className="flex items-center gap-2">
          <span className="switcher-badge">Xem thử 3 phong cách mới</span>
          <span className="text-xs font-bold text-[#8C6B18]">Hoa Văn Hòa Nền</span>
        </div>
        <button
          type="button"
          className="text-xs text-[#8C6B18] font-semibold hover:underline"
        >
          {minimized ? 'Mở ▲' : 'Thu gọn ▼'}
        </button>
      </div>

      {!minimized && (
        <div className="switcher-body">
          <div className="switcher-options">
            <button
              type="button"
              className={`switcher-btn ${style === '1' ? 'active' : ''}`}
              onClick={() => setStyle('1')}
            >
              <div className="switcher-btn-head">
                <Sparkles className="w-4 h-4 text-[#8C6B18]" />
                <strong>1. Vân Gấm Dệt Chìm</strong>
                {style === '1' && <Check className="w-3.5 h-3.5 ml-auto text-[#8C6B18]" />}
              </div>
              <p>Họa tiết lụa gấm dệt chìm siêu mịn, trong suốt sạch vùng chữ, hiện lấp lánh ở 2 bên lề</p>
            </button>

            <button
              type="button"
              className={`switcher-btn ${style === '2' ? 'active' : ''}`}
              onClick={() => setStyle('2')}
            >
              <div className="switcher-btn-head">
                <Waves className="w-4 h-4 text-[#8C6B18]" />
                <strong>2. Vi Sóng Bảo An Champagne</strong>
                {style === '2' && <Check className="w-3.5 h-3.5 ml-auto text-[#8C6B18]" />}
              </div>
              <p>Hàng trăm đường vi sóng Guilloche toán học đối xứng như công trái &amp; văn bằng luật hoàng gia</p>
            </button>

            <button
              type="button"
              className={`switcher-btn ${style === '3' ? 'active' : ''}`}
              onClick={() => setStyle('3')}
            >
              <div className="switcher-btn-head">
                <Shield className="w-4 h-4 text-[#8C6B18]" />
                <strong>3. Phù Hiệu Grand Seal</strong>
                {style === '3' && <Check className="w-3.5 h-3.5 ml-auto text-[#8C6B18]" />}
              </div>
              <p>Con dấu hoàng gia khổng lồ chìm sâu dưới Hero (độ mờ 4.5%), không có hoa văn sườn chắn 2 bên</p>
            </button>
          </div>
          <div className="switcher-note">
            <span>💡 Bấm vào từng phong cách để màn hình lập tức chuyển đổi và so sánh trực tiếp!</span>
          </div>
        </div>
      )}
    </aside>
  );
}
