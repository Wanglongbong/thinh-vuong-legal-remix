import React from 'react';

/**
 * RoyalFlankDecor:
 * Hệ thống hoa văn hoàng gia sườn dọc đối xứng 2 bên (Bilateral Imperial Flank Pillars & Filigree).
 * Thiết kế chuẩn vector SVG mạ vàng kim đậm (#684F0E, #8C6B18, #C59B27) hòa sắc trắng ngà (#FFFDF8, #FAF4E6).
 * Phản chiếu gương hoàn hảo giữa mép trái và mép phải, không cản trở tương tác hay che chữ.
 */
export function RoyalFlankDecor() {
  return (
    <div className="royal-flank-container" aria-hidden="true">
      {/* Sườn trái hoa văn hoàng gia */}
      <div className="royal-flank-pillar left">
        <RoyalPillarSvg />
      </div>

      {/* Sườn phải hoa văn hoàng gia (đối xứng gương hoàn hảo) */}
      <div className="royal-flank-pillar right">
        <RoyalPillarSvg />
      </div>
    </div>
  );
}

/**
 * RoyalCornerDecor:
 * Cụm hoa văn góc hoàng gia (Royal Corner Filigree) dùng cho các khối giao diện như Hero Section, Card v.v.
 */
export function RoyalCornerDecor({ className = '' }: { className?: string }) {
  return (
    <div className={`royal-corner-wrapper pointer-events-none select-none ${className}`} aria-hidden="true">
      {/* Góc trên trái */}
      <div className="royal-corner top-left">
        <RoyalCornerSvg />
      </div>
      {/* Góc trên phải (đối xứng ngang) */}
      <div className="royal-corner top-right">
        <RoyalCornerSvg />
      </div>
      {/* Góc dưới trái (đối xứng dọc) */}
      <div className="royal-corner bottom-left">
        <RoyalCornerSvg />
      </div>
      {/* Góc dưới phải (đối xứng 2 chiều) */}
      <div className="royal-corner bottom-right">
        <RoyalCornerSvg />
      </div>
    </div>
  );
}

/**
 * RoyalDivider:
 * Họa tiết phân cách hoàng gia đối xứng trung tâm (Symmetrical Palmette Crest Divider).
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
        {/* Cánh hoa văn uốn lượn trái */}
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

        {/* Cánh hoa văn uốn lượn phải (đối xứng) */}
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
 * Cột hoa văn hoàng gia Baroque / Neoclassical Filigree lặp lại theo chiều dọc.
 */
function RoyalPillarSvg() {
  return (
    <svg
      width="140"
      height="1200"
      viewBox="0 0 140 1200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="royal-pillar-svg"
      preserveAspectRatio="xMinYMin slice"
    >
      <defs>
        {/* Gradient vàng đậm kết hợp vàng kim và trắng sáng */}
        <linearGradient id="imperialGoldMain" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#684F0E" />
          <stop offset="25%" stopColor="#8C6B18" />
          <stop offset="50%" stopColor="#C59B27" />
          <stop offset="70%" stopColor="#FFFDF8" stopOpacity="0.9" />
          <stop offset="85%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#7D5D0D" />
        </linearGradient>

        <linearGradient id="goldStrokeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#C59B27" />
          <stop offset="30%" stopColor="#FFFDF8" />
          <stop offset="70%" stopColor="#8C6B18" />
          <stop offset="100%" stopColor="#684F0E" />
        </linearGradient>

        <linearGradient id="goldGlowGrad" x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="#C59B27" stopOpacity="0.45" />
          <stop offset="50%" stopColor="#FFFDF8" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#8C6B18" stopOpacity="0" />
        </linearGradient>

        {/* Pattern khối hoa văn hoàng gia lặp lại theo chu kỳ 300px */}
        <pattern id="royalAcanthusUnit" width="140" height="300" patternUnits="userSpaceOnUse">
          {/* Đường biên dọc chính với hạt ngọc hoàng gia (Beaded Border) */}
          <line x1="8" y1="0" x2="8" y2="300" stroke="#8C6B18" strokeWidth="1.5" />
          <line x1="14" y1="0" x2="14" y2="300" stroke="url(#imperialGoldMain)" strokeWidth="0.8" strokeDasharray="2 4" />

          {/* Dãy chuỗi hạt ngọc mạ vàng và trắng ngà dọc đường biên */}
          {[15, 45, 75, 105, 135, 165, 195, 225, 255, 285].map((y) => (
            <g key={y}>
              <circle cx="8" cy={y} r="2.2" fill="#FFFDF8" stroke="#8C6B18" strokeWidth="0.75" />
              <circle cx="8" cy={y} r="0.9" fill="#C59B27" />
            </g>
          ))}

          {/* Cụm vòm cuộn hoa văn Acanthus thứ nhất (0 - 150px) */}
          <path
            d="M8 30 C35 30 75 42 75 75 C75 105 40 115 25 110 C15 106 10 95 18 85 C26 75 42 78 40 92 C38 100 28 102 24 96"
            stroke="url(#imperialGoldMain)"
            strokeWidth="1.8"
            strokeLinecap="round"
            fill="none"
          />
          {/* Nhánh lá nhỏ uốn lượn phụ trợ */}
          <path
            d="M38 46 C48 38 65 42 70 54 C74 65 62 76 50 72"
            stroke="#8C6B18"
            strokeWidth="1.2"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M20 35 C28 20 50 18 64 26"
            stroke="url(#imperialGoldMain)"
            strokeWidth="1"
            strokeLinecap="round"
            fill="none"
          />

          {/* Điểm nhấn hoa hoàng gia (Fleur / Rosette) tại tọa độ (75, 75) */}
          <circle cx="75" cy="75" r="4.5" fill="#FFFDF8" stroke="#8C6B18" strokeWidth="1" />
          <circle cx="75" cy="75" r="2.5" fill="#C59B27" />
          <path
            d="M75 66 V84 M66 75 H84"
            stroke="url(#imperialGoldMain)"
            strokeWidth="0.8"
          />

          {/* Họa tiết lá vươn ra rìa giữa (Acanthus Tip) */}
          <path
            d="M75 75 C95 70 125 82 128 105 C129 116 118 126 105 124 C90 121 82 105 92 94 C98 87 108 89 107 98"
            stroke="url(#imperialGoldMain)"
            strokeWidth="1.6"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M88 82 C104 80 120 90 118 104"
            stroke="#C59B27"
            strokeWidth="0.9"
            strokeLinecap="round"
            fill="none"
          />

          {/* Nút thắt hoa văn trung tâm (Palmette node tại y = 150) */}
          <g transform="translate(8, 150)">
            <path
              d="M0 0 C25 -15 50 -10 65 0 C50 10 25 15 0 0Z"
              fill="url(#imperialGoldMain)"
              stroke="#684F0E"
              strokeWidth="0.8"
            />
            <circle cx="35" cy="0" r="3" fill="#FFFDF8" stroke="#8C6B18" strokeWidth="1" />
            <circle cx="35" cy="0" r="1.5" fill="#C59B27" />
            {/* Tia sáng hoàng gia */}
            <path d="M35 -8 V-4 M35 4 V8 M28 -5 L30 -3 M40 3 L42 5" stroke="#C59B27" strokeWidth="0.8" />
          </g>

          {/* Cụm vòm cuộn hoa văn Acanthus thứ hai (150 - 300px, đảo nhịp điệu) */}
          <path
            d="M8 270 C35 270 75 258 75 225 C75 195 40 185 25 190 C15 194 10 205 18 215 C26 225 42 222 40 208 C38 200 28 198 24 204"
            stroke="url(#imperialGoldMain)"
            strokeWidth="1.8"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M38 254 C48 262 65 258 70 246 C74 235 62 224 50 228"
            stroke="#8C6B18"
            strokeWidth="1.2"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M20 265 C28 280 50 282 64 274"
            stroke="url(#imperialGoldMain)"
            strokeWidth="1"
            strokeLinecap="round"
            fill="none"
          />

          {/* Hoa hoàng gia tại y = 225 */}
          <circle cx="75" cy="225" r="4.5" fill="#FFFDF8" stroke="#8C6B18" strokeWidth="1" />
          <circle cx="75" cy="225" r="2.5" fill="#C59B27" />
          <path
            d="M75 216 V234 M66 225 H84"
            stroke="url(#imperialGoldMain)"
            strokeWidth="0.8"
          />

          <path
            d="M75 225 C95 230 125 218 128 195 C129 184 118 174 105 176 C90 179 82 195 92 206 C98 213 108 211 107 202"
            stroke="url(#imperialGoldMain)"
            strokeWidth="1.6"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M88 218 C104 220 120 210 118 196"
            stroke="#C59B27"
            strokeWidth="0.9"
            strokeLinecap="round"
            fill="none"
          />
        </pattern>
      </defs>

      {/* Nền phản chiếu hào quang vàng nhạt dịu */}
      <rect x="0" y="0" width="140" height="1200" fill="url(#goldGlowGrad)" />

      {/* Lớp hoa văn acanthus lặp lại theo chiều dọc */}
      <rect x="0" y="0" width="140" height="1200" fill="url(#royalAcanthusUnit)" />
    </svg>
  );
}

/**
 * Cụm hoa văn góc Baroque (Royal Corner Filigree)
 */
function RoyalCornerSvg() {
  return (
    <svg
      width="100"
      height="100"
      viewBox="0 0 100 100"
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

      {/* Viền góc ngoài đôi */}
      <path d="M4 60 V12 C4 7.578 7.578 4 12 4 H60" stroke="url(#cornerGoldGrad)" strokeWidth="1.8" fill="none" />
      <path d="M10 50 V16 C10 12.686 12.686 10 16 10 H50" stroke="#8C6B18" strokeWidth="0.8" strokeDasharray="1.5 3" fill="none" />

      {/* Hạt ngọc ở góc bo */}
      <circle cx="8" cy="8" r="3" fill="#FFFDF8" stroke="#8C6B18" strokeWidth="1" />
      <circle cx="8" cy="8" r="1.5" fill="#C59B27" />

      {/* Cuộn lá Baroque uốn vào tâm */}
      <path
        d="M8 8 C25 25 35 48 32 68 C30 76 22 80 16 75 C11 70 14 60 22 58 C28 57 32 64 28 70"
        stroke="url(#cornerGoldGrad)"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M8 8 C25 25 48 35 68 32 C76 30 80 22 75 16 C70 11 60 14 58 22 C57 28 64 32 70 28"
        stroke="url(#cornerGoldGrad)"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Hoa điểm xuyết trung tâm góc */}
      <circle cx="34" cy="34" r="3.5" fill="#FFFDF8" stroke="#8C6B18" strokeWidth="0.8" />
      <circle cx="34" cy="34" r="1.8" fill="#C59B27" />
      <path d="M34 26 V42 M26 34 H42" stroke="#8C6B18" strokeWidth="0.75" />
    </svg>
  );
}
