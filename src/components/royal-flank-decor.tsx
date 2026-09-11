import React, { createContext, useContext, useState } from 'react';
import { Sparkles, Waves, Shield, Check, Sliders } from 'lucide-react';

export type RoyalStyle = '1' | '2' | '3';

interface RoyalThemeContextType {
  style: RoyalStyle;
  setStyle: (style: RoyalStyle) => void;
  opacity: number;
  setOpacity: (opacity: number) => void;
}

const RoyalThemeContext = createContext<RoyalThemeContextType>({
  style: '1',
  setStyle: () => {},
  opacity: 50,
  setOpacity: () => {},
});

export function useRoyalTheme() {
  return useContext(RoyalThemeContext);
}

/**
 * RoyalThemeProvider: Quản lý trạng thái phong cách và độ mờ/đậm
 */
export function RoyalThemeProvider({ children }: { children: React.ReactNode }) {
  const [style, setStyleState] = useState<RoyalStyle>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('tv_royal_decor_style');
        if (saved === '1' || saved === '2' || saved === '3') return saved;
      } catch {}
    }
    return '1'; // Mặc định là Phong cách 1
  });

  const [opacity, setOpacityState] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('tv_royal_decor_opacity');
        if (saved) return Number(saved);
      } catch {}
    }
    return 55; // Mặc định 55% nhìn rõ ràng, sang trọng
  });

  const setStyle = (s: RoyalStyle) => {
    setStyleState(s);
    try {
      localStorage.setItem('tv_royal_decor_style', s);
    } catch {}
  };

  const setOpacity = (op: number) => {
    setOpacityState(op);
    try {
      localStorage.setItem('tv_royal_decor_opacity', String(op));
    } catch {}
  };

  return (
    <RoyalThemeContext.Provider value={{ style, setStyle, opacity, setOpacity }}>
      <div className={`royal-theme-wrapper active-style-${style}`}>
        {children}
        <RoyalThemeSwitcher />
      </div>
    </RoyalThemeContext.Provider>
  );
}

/**
 * RoyalHeroDecor:
 * ĐẶT TRỰC TIẾP TRONG HERO SECTION Ở TẦNG z-index: 1
 * Nằm trên màu nền Hero, dưới lớp chữ, đảm bảo 100% mắt nhìn thấy rõ ràng!
 */
export function RoyalHeroDecor() {
  const { style, opacity } = useRoyalTheme();
  const alpha = opacity / 100;

  return (
    <div
      className="royal-hero-decor-container pointer-events-none"
      style={{ opacity: alpha }}
      aria-hidden="true"
    >
      {style === '1' && <HeroDamaskStyle />}
      {style === '2' && <HeroGuillocheStyle />}
      {style === '3' && <HeroSealStyle />}
    </div>
  );
}

/**
 * PHONG CÁCH 1: Vân Gấm Hoàng Gia Dệt Chìm (Royal Damask Flanks)
 * Hai dải hoa văn sườn Baroque mạ vàng óng ánh ôm dọc 2 bên Hero, đối xứng 100%.
 */
function HeroDamaskStyle() {
  return (
    <div className="hero-damask-wrap">
      {/* Cụm sườn hoa văn trái */}
      <div className="hero-flank-decor left">
        <DamaskFlankSvg />
      </div>
      {/* Cụm sườn hoa văn phải (đối xứng gương hoàn hảo) */}
      <div className="hero-flank-decor right">
        <DamaskFlankSvg />
      </div>
    </div>
  );
}

/**
 * PHONG CÁCH 2: Vân Vi Sóng Bảo An Champagne (Guilloche Waves)
 * Các dải sóng Guilloche uốn lượn nhịp nhàng đối xứng 2 bên sườn.
 */
function HeroGuillocheStyle() {
  return (
    <div className="hero-guilloche-wrap">
      <div className="hero-flank-decor left">
        <GuillocheFlankSvg />
      </div>
      <div className="hero-flank-decor right">
        <GuillocheFlankSvg />
      </div>
    </div>
  );
}

/**
 * PHONG CÁCH 3: Phù Hiệu Grand Seal (Cán cân & Nguyệt quế hoàng gia)
 */
function HeroSealStyle() {
  return (
    <div className="hero-seal-center-wrap">
      <GrandSealSvg />
    </div>
  );
}

/**
 * SVG Cụm sườn hoa văn Baroque phong cách 1 (Nét vẽ 1.2px, sắc sảo)
 */
function DamaskFlankSvg() {
  return (
    <svg
      width="160"
      height="620"
      viewBox="0 0 160 620"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="hero-flank-svg"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="damaskGold1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#684F0E" />
          <stop offset="30%" stopColor="#8C6B18" />
          <stop offset="60%" stopColor="#C59B27" />
          <stop offset="85%" stopColor="#FFFDF8" />
          <stop offset="100%" stopColor="#8C6B18" />
        </linearGradient>
      </defs>

      {/* Sống lưng chính uốn lượn mạ vàng */}
      <path
        d="M8 20 C18 160 18 280 14 310 C10 340 18 460 8 600"
        stroke="url(#damaskGold1)"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M16 60 C24 180 24 280 20 310 C16 340 24 440 16 560"
        stroke="#8C6B18"
        strokeWidth="0.8"
        strokeDasharray="2 4"
      />

      {/* Chuỗi hạt ngọc mạ vàng chạy dọc sống */}
      {[60, 110, 160, 210, 260, 310, 360, 410, 460, 510, 560].map((y) => (
        <g key={y}>
          <circle cx="8" cy={y} r="2.5" fill="#FFFDF8" stroke="#8C6B18" strokeWidth="0.8" />
          <circle cx="8" cy={y} r="1.2" fill="#C59B27" />
        </g>
      ))}

      {/* Cụm vòm cuộn Acanthus trên (y: 60 - 240) */}
      <path
        d="M8 100 C50 100 110 120 115 165 C118 205 80 220 60 210 C42 200 45 175 60 168 C72 160 86 170 82 184"
        stroke="url(#damaskGold1)"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M30 130 C65 135 95 155 90 185"
        stroke="#8C6B18"
        strokeWidth="1"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="115" cy="165" r="4.5" fill="#FFFDF8" stroke="#8C6B18" strokeWidth="1" />
      <circle cx="115" cy="165" r="2.5" fill="#C59B27" />

      {/* Hoa Hoàng gia Rosette trung tâm tại y = 310 */}
      <g transform="translate(8, 310)">
        <path
          d="M0 0 C35 -22 90 -18 115 0 C90 18 35 22 0 0Z"
          fill="url(#damaskGold1)"
          stroke="#684F0E"
          strokeWidth="0.8"
        />
        <circle cx="60" cy="0" r="5" fill="#FFFDF8" stroke="#8C6B18" strokeWidth="1.2" />
        <circle cx="60" cy="0" r="2.8" fill="#C59B27" />
        <path d="M60 -12 V12 M48 0 H72" stroke="#C59B27" strokeWidth="0.8" />
        <path
          d="M115 0 C135 -12 155 5 150 20 C145 30 130 25 125 15"
          stroke="url(#damaskGold1)"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
      </g>

      {/* Cụm vòm cuộn Acanthus dưới (y: 380 - 540) đối xứng */}
      <path
        d="M8 520 C50 520 110 500 115 455 C118 415 80 400 60 410 C42 420 45 445 60 452 C72 460 86 450 82 436"
        stroke="url(#damaskGold1)"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M30 490 C65 485 95 465 90 435"
        stroke="#8C6B18"
        strokeWidth="1"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="115" cy="455" r="4.5" fill="#FFFDF8" stroke="#8C6B18" strokeWidth="1" />
      <circle cx="115" cy="455" r="2.5" fill="#C59B27" />
    </svg>
  );
}

/**
 * SVG Dải vi sóng Guilloche phong cách 2
 */
function GuillocheFlankSvg() {
  return (
    <svg
      width="160"
      height="620"
      viewBox="0 0 160 620"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="hero-flank-svg"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="guillocheGold2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#684F0E" />
          <stop offset="35%" stopColor="#C59B27" />
          <stop offset="70%" stopColor="#8C6B18" />
          <stop offset="100%" stopColor="#D4AF37" />
        </linearGradient>
        <linearGradient id="guillocheIvory" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8C6B18" />
          <stop offset="50%" stopColor="#FFFDF8" />
          <stop offset="100%" stopColor="#C59B27" />
        </linearGradient>
      </defs>

      {/* Sống thẳng bảo an ngoài cùng với vạch chia vi lượng */}
      <line x1="6" y1="20" x2="6" y2="600" stroke="url(#guillocheGold2)" strokeWidth="1.6" />
      <line x1="12" y1="30" x2="12" y2="590" stroke="#8C6B18" strokeWidth="0.8" strokeDasharray="3 3" />

      {/* Vạch chia vi lượng tài chính */}
      {Array.from({ length: 30 }).map((_, i) => (
        <line key={`tick-${i}`} x1="3" y1={25 + i * 19.5} x2="9" y2={25 + i * 19.5} stroke="#8C6B18" strokeWidth="1" />
      ))}

      {/* Dải sóng sin giao thoa kép (Harmonic Guilloche Ribbons) tạo thành mắt lưới hình quả trám */}
      {[30, 70, 110, 150, 190, 230, 270, 310, 350, 390, 430, 470, 510, 550, 590].map((y, idx) => {
        const amp = 32 + (idx % 2) * 12;
        return (
          <g key={`wave-${y}`}>
            {/* Sóng uốn lượn thuận */}
            <path
              d={`M12 ${y} C${45} ${y - amp}, ${95} ${y + amp}, 152 ${y}`}
              stroke="url(#guillocheGold2)"
              strokeWidth="1.3"
              fill="none"
              opacity="0.85"
            />
            {/* Sóng uốn lượn nghịch - Giao thoa tạo mắt lưới Guilloche */}
            <path
              d={`M12 ${y} C${45} ${y + amp}, ${95} ${y - amp}, 152 ${y}`}
              stroke="url(#guillocheIvory)"
              strokeWidth="1.1"
              fill="none"
              opacity="0.75"
            />
            {/* Hạt ngọc champagne tại điểm nút giao thoa */}
            <circle cx="95" cy={y} r="2.2" fill="#FFFDF8" stroke="#8C6B18" strokeWidth="0.8" />
          </g>
        );
      })}

      {/* Cụm hoa văn Rosette bảo chứng Guilloche tại tâm (y=310) */}
      <g transform="translate(68, 310)">
        <circle cx="0" cy="0" r="54" stroke="url(#guillocheGold2)" strokeWidth="1.4" fill="none" />
        <circle cx="0" cy="0" r="42" stroke="#8C6B18" strokeWidth="1" strokeDasharray="3 3" fill="none" />
        <circle cx="0" cy="0" r="30" stroke="url(#guillocheIvory)" strokeWidth="1.2" fill="none" />
        <circle cx="0" cy="0" r="18" stroke="#8C6B18" strokeWidth="1" fill="none" />
        <circle cx="0" cy="0" r="5" fill="#FFFDF8" stroke="#8C6B18" strokeWidth="1.2" />
        <circle cx="0" cy="0" r="2.5" fill="#C59B27" />
        {/* Nan hoa đối xứng */}
        {Array.from({ length: 8 }).map((_, i) => (
          <line
            key={`spoke-${i}`}
            x1="0"
            y1="0"
            x2={38 * Math.cos((i * 45 * Math.PI) / 180)}
            y2={38 * Math.sin((i * 45 * Math.PI) / 180)}
            stroke="#8C6B18"
            strokeWidth="0.8"
            strokeDasharray="2 2"
          />
        ))}
      </g>

      {/* 2 Rosette nhỏ phụ trợ ở 2 cực (y=130 và y=490) */}
      <g transform="translate(45, 130)">
        <circle cx="0" cy="0" r="24" stroke="url(#guillocheGold2)" strokeWidth="1.2" fill="none" />
        <circle cx="0" cy="0" r="14" stroke="#8C6B18" strokeWidth="0.9" fill="none" />
        <circle cx="0" cy="0" r="3" fill="#FFFDF8" stroke="#8C6B18" strokeWidth="1" />
      </g>
      <g transform="translate(45, 490)">
        <circle cx="0" cy="0" r="24" stroke="url(#guillocheGold2)" strokeWidth="1.2" fill="none" />
        <circle cx="0" cy="0" r="14" stroke="#8C6B18" strokeWidth="0.9" fill="none" />
        <circle cx="0" cy="0" r="3" fill="#FFFDF8" stroke="#8C6B18" strokeWidth="1" />
      </g>
    </svg>
  );
}

/**
 * SVG Con dấu hoàng gia khổng lồ phong cách 3
 */
function GrandSealSvg() {
  return (
    <svg
      width="640"
      height="640"
      viewBox="0 0 640 640"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="grand-seal-svg"
    >
      <defs>
        <linearGradient id="sealGold3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#684F0E" />
          <stop offset="35%" stopColor="#8C6B18" />
          <stop offset="60%" stopColor="#C59B27" />
          <stop offset="100%" stopColor="#7D5D0D" />
        </linearGradient>
      </defs>

      {/* Vòng ngoài bảo chứng */}
      <circle cx="320" cy="320" r="310" stroke="url(#sealGold3)" strokeWidth="2" />
      <circle cx="320" cy="320" r="296" stroke="#8C6B18" strokeWidth="1" strokeDasharray="3 4" />
      <circle cx="320" cy="320" r="270" stroke="url(#sealGold3)" strokeWidth="1.4" />

      {/* Vòng hạt ngọc */}
      {Array.from({ length: 32 }).map((_, i) => {
        const angle = (i * 360) / 32;
        const rad = (angle * Math.PI) / 180;
        const cx = 320 + 283 * Math.cos(rad);
        const cy = 320 + 283 * Math.sin(rad);
        return <circle key={i} cx={cx} cy={cy} r="2.5" fill="#8C6B18" />;
      })}

      {/* Vòng Nguyệt Quế Hoàng Gia đối xứng hai bên */}
      <path
        d="M190 460 C140 380 140 250 220 170 C235 155 250 145 270 135"
        stroke="url(#sealGold3)"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M450 460 C500 380 500 250 420 170 C405 155 390 145 370 135"
        stroke="url(#sealGold3)"
        strokeWidth="2.2"
        strokeLinecap="round"
      />

      {/* Cặp lá nguyệt quế */}
      {[-70, -40, -10, 20, 50, 80].map((offset, idx) => (
        <g key={idx}>
          <ellipse cx={175 + Math.abs(offset) * 0.4} cy={310 + offset} rx="16" ry="8" transform={`rotate(${-25 + offset * 0.3}, ${175 + Math.abs(offset) * 0.4}, ${310 + offset})`} stroke="#8C6B18" strokeWidth="1.2" fill="none" />
          <ellipse cx={465 - Math.abs(offset) * 0.4} cy={310 + offset} rx="16" ry="8" transform={`rotate(${25 - offset * 0.3}, ${465 - Math.abs(offset) * 0.4}, ${310 + offset})`} stroke="#8C6B18" strokeWidth="1.2" fill="none" />
        </g>
      ))}

      {/* Cán cân Công lý & Thanh gươm bảo chứng */}
      <g transform="translate(320, 320)">
        <line x1="0" y1="-130" x2="0" y2="110" stroke="url(#sealGold3)" strokeWidth="3" />
        <circle cx="0" cy="-130" r="8" stroke="#8C6B18" strokeWidth="1.5" fill="none" />
        <line x1="-25" y1="-110" x2="25" y2="-110" stroke="url(#sealGold3)" strokeWidth="2.5" />
        
        <line x1="-110" y1="-45" x2="110" y2="-45" stroke="url(#sealGold3)" strokeWidth="2.5" />
        <circle cx="0" cy="-45" r="5.5" fill="#8C6B18" />

        {/* Đĩa cân trái */}
        <line x1="-100" y1="-45" x2="-130" y2="25" stroke="#8C6B18" strokeWidth="1" />
        <line x1="-100" y1="-45" x2="-70" y2="25" stroke="#8C6B18" strokeWidth="1" />
        <path d="M-140 25 C-140 50 -60 50 -60 25 Z" stroke="url(#sealGold3)" strokeWidth="1.5" fill="none" />

        {/* Đĩa cân phải */}
        <line x1="100" y1="-45" x2="70" y2="25" stroke="#8C6B18" strokeWidth="1" />
        <line x1="100" y1="-45" x2="130" y2="25" stroke="#8C6B18" strokeWidth="1" />
        <path d="M60 25 C60 50 140 50 140 25 Z" stroke="url(#sealGold3)" strokeWidth="1.5" fill="none" />

        {/* Chân tháp */}
        <path d="M-35 110 L35 110 L25 90 L-25 90 Z" stroke="url(#sealGold3)" strokeWidth="2" fill="none" />
      </g>
    </svg>
  );
}

/**
 * Họa tiết phân cách hoàng gia
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
 * Thanh điều khiển nổi: Chọn 3 kiểu + Kéo thanh trượt độ mờ/đậm trực tiếp
 */
export function RoyalThemeSwitcher() {
  const { style, setStyle, opacity, setOpacity } = useRoyalTheme();
  const [minimized, setMinimized] = useState(false);

  return (
    <aside
      className={`royal-switcher-panel ${minimized ? 'minimized' : ''}`}
      aria-label="Bộ điều khiển thử nghiệm 3 phong cách hoa văn hoàng gia"
    >
      <div className="switcher-header" onClick={() => setMinimized(!minimized)}>
        <div className="flex items-center gap-2">
          <span className="switcher-badge">BẬT TỨC THÌ</span>
          <span className="text-xs font-bold text-[#8C6B18]">Hoa Văn Hoàng Gia</span>
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
                <strong>1. Vân Gấm Hoàng Gia</strong>
                {style === '1' && <Check className="w-3.5 h-3.5 ml-auto text-[#8C6B18]" />}
              </div>
              <p>Hai dải hoa văn sườn Baroque mạ vàng óng ánh ở 2 bên Hero</p>
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
              <p>Dải sóng Guilloche tài chính uốn lượn sắc sảo đối xứng 2 bên</p>
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
              <p>Con dấu hoàng gia khổng lồ (Cán cân &amp; Nguyệt quế) ở tâm Hero</p>
            </button>
          </div>

          {/* THANH TRƯỢT ĐỘ ĐẬM / MỜ TRỰC TIẾP */}
          <div className="switcher-slider-box">
            <div className="flex items-center justify-between text-xs font-bold text-[#684F0E] mb-1.5">
              <span className="flex items-center gap-1">
                <Sliders className="w-3.5 h-3.5 text-[#8C6B18]" />
                Độ đậm hoa văn:
              </span>
              <span className="text-[#8C6B18] font-mono">{opacity}%</span>
            </div>
            <input
              type="range"
              min="15"
              max="100"
              step="5"
              value={opacity}
              onChange={(e) => setOpacity(Number(e.target.value))}
              className="royal-opacity-range"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-medium">
              <span>Mờ dịu (15%)</span>
              <span>Cân đối (55%)</span>
              <span>Rõ đậm (100%)</span>
            </div>
          </div>

          <div className="switcher-note">
            <span>💡 Bấm chọn 1, 2, 3 và kéo thanh trượt để thấy thay đổi trực tiếp ngay trên màn hình!</span>
          </div>
        </div>
      )}
    </aside>
  );
}
