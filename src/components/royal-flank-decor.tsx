import React from 'react';

/**
 * RoyalThemeProvider: Bọc gọn ứng dụng, duy trì tính tương thích sạch sẽ
 */
export function RoyalThemeProvider({ children }: { children: React.ReactNode }) {
  return <div className="royal-theme-wrapper">{children}</div>;
}

/**
 * RoyalHeroDecor:
 * KHUNG HOA VĂN 4 GÓC CHỨNG CHỈ PHÁP LÝ (Certificate Corner Filigree)
 * Lấy cảm hứng trực tiếp từ Giấy chứng nhận Khoa Luật - Học viện Ngân hàng.
 * Tọa lạc đối xứng tại 4 góc của Hero Section, thanh lịch, tinh tế và không che lấp chữ.
 */
export function RoyalHeroDecor() {
  return (
    <div className="certificate-corner-container pointer-events-none" aria-hidden="true">
      {/* Góc trên bên trái */}
      <div className="certificate-corner-item top-left">
        <CertificateCornerSvg />
      </div>

      {/* Góc trên bên phải (đối xứng ngang) */}
      <div className="certificate-corner-item top-right">
        <CertificateCornerSvg />
      </div>

      {/* Góc dưới bên trái (đối xứng dọc) */}
      <div className="certificate-corner-item bottom-left">
        <CertificateCornerSvg />
      </div>

      {/* Góc dưới bên phải (đối xứng tâm 2 chiều) */}
      <div className="certificate-corner-item bottom-right">
        <CertificateCornerSvg />
      </div>
    </div>
  );
}

/**
 * SVG Hoa văn góc chứng chỉ hàn lâm / pháp lý (Academic Certificate Corner Filigree)
 * Nét vẽ vàng đồng hoàng gia thanh mảnh, gồm viền đôi góc và dây lá cuốn mềm mại.
 */
function CertificateCornerSvg() {
  return (
    <svg
      width="120"
      height="120"
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="certificate-corner-svg"
    >
      <defs>
        <linearGradient id="certGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#785910" />
          <stop offset="35%" stopColor="#C59B27" />
          <stop offset="70%" stopColor="#8C6B18" />
          <stop offset="88%" stopColor="#FFFDF8" />
          <stop offset="100%" stopColor="#B38A22" />
        </linearGradient>
        <linearGradient id="certGoldLight" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#C59B27" />
          <stop offset="50%" stopColor="#FFFDF8" />
          <stop offset="100%" stopColor="#8C6B18" />
        </linearGradient>
      </defs>

      {/* 1. Viền ngoài góc (Outer corner bracket) */}
      <path
        d="M 6 52 L 6 6 L 52 6"
        stroke="url(#certGold)"
        strokeWidth="1.4"
        strokeLinecap="round"
      />

      {/* 2. Viền trong góc mảnh mai (Inner hairline corner bracket) */}
      <path
        d="M 13 42 L 13 13 L 42 13"
        stroke="#8C6B18"
        strokeWidth="0.8"
        strokeLinecap="round"
      />

      {/* 3. Dây leo lá nằm dọc theo cạnh trên (Horizontal filigree branch) */}
      <path
        d="M 16 16 C 30 10, 48 20, 68 12 C 84 6, 96 16, 114 13"
        stroke="url(#certGold)"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
      />
      {/* Lá trên nhánh ngang */}
      <path
        d="M 36 12 C 40 6, 50 7, 46 13 C 42 16, 38 15, 36 12 Z"
        fill="url(#certGoldLight)"
        stroke="#8C6B18"
        strokeWidth="0.6"
      />
      <path
        d="M 72 11 C 76 5, 86 6, 82 12 C 78 15, 74 14, 72 11 Z"
        fill="url(#certGoldLight)"
        stroke="#8C6B18"
        strokeWidth="0.6"
      />
      {/* Cuộn xoắn ốc phụ (Tendril curl) */}
      <path
        d="M 54 16 C 60 22, 66 20, 64 15 C 62 12, 57 13, 59 17"
        stroke="#8C6B18"
        strokeWidth="0.9"
        fill="none"
      />
      <circle cx="114" cy="13" r="2.2" fill="#FFFDF8" stroke="#8C6B18" strokeWidth="0.8" />
      <circle cx="114" cy="13" r="1.1" fill="#C59B27" />

      {/* 4. Dây leo lá nằm dọc theo cạnh trái (Vertical filigree branch) */}
      <path
        d="M 16 16 C 10 30, 20 48, 12 68 C 6 84, 16 96, 13 114"
        stroke="url(#certGold)"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
      />
      {/* Lá trên nhánh dọc */}
      <path
        d="M 12 36 C 6 40, 7 50, 13 46 C 16 42, 15 38, 12 36 Z"
        fill="url(#certGoldLight)"
        stroke="#8C6B18"
        strokeWidth="0.6"
      />
      <path
        d="M 11 72 C 5 76, 6 86, 12 82 C 15 78, 14 74, 11 72 Z"
        fill="url(#certGoldLight)"
        stroke="#8C6B18"
        strokeWidth="0.6"
      />
      {/* Cuộn xoắn ốc phụ (Tendril curl) */}
      <path
        d="M 16 54 C 22 60, 20 66, 15 64 C 12 62, 13 57, 17 59"
        stroke="#8C6B18"
        strokeWidth="0.9"
        fill="none"
      />
      <circle cx="13" cy="114" r="2.2" fill="#FFFDF8" stroke="#8C6B18" strokeWidth="0.8" />
      <circle cx="13" cy="114" r="1.1" fill="#C59B27" />

      {/* 5. Điểm nhấn hoa hoàng gia / ngọc góc (Corner Floral Rosette) */}
      <g transform="translate(24, 24)">
        {/* Cánh hoa chữ thập tinh xảo */}
        <path
          d="M 0 -7 C 2 -3, 3 -2, 7 0 C 3 2, 2 3, 0 7 C -2 3, -3 2, -7 0 C -3 -2, -2 -3, 0 -7 Z"
          fill="url(#certGold)"
          stroke="#785910"
          strokeWidth="0.6"
        />
        <circle cx="0" cy="0" r="3.2" fill="#FFFDF8" stroke="#8C6B18" strokeWidth="0.8" />
        <circle cx="0" cy="0" r="1.6" fill="#C59B27" />
      </g>
    </svg>
  );
}

/**
 * Họa tiết dải phân cách hoàng gia (Dùng phân đoạn các phần trong trang)
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
          fill="#C59B27"
          stroke="#8C6B18"
          strokeWidth="0.75"
        />
        <circle cx="55" cy="13" r="2" fill="#FFFDF8" />
        <path
          d="M44 12C38 6 30 7 24 12C18 17 10 16 2 12"
          stroke="#C59B27"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="24" cy="12" r="1.8" fill="#C59B27" />
        <path
          d="M66 12C72 6 80 7 86 12C92 17 100 16 108 12"
          stroke="#C59B27"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="86" cy="12" r="1.8" fill="#C59B27" />
      </svg>
      <div className="royal-divider-line right" />
    </div>
  );
}
