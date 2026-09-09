import { useState } from 'react';
import { Link, useRouter } from '@/router';
import { Mail, Menu, MessageCircle, Scale, Wand2, X } from 'lucide-react';

const nav = [
  ['Hợp đồng', '/hop-dong'],
  ['Báo cáo sơ bộ', '/bao-cao-so-bo'],
  ['Diễn đàn thảo luận', '/dien-dan'],
  ['Nền tảng AI', '/cong-cu'],
  ['Đội ngũ', '/doi-ngu'],
] as const;

export function SiteHeader() {
  const { pathname } = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Main Luxury White & Gold Site Header */}
      <header className="site-header">
        <div className="site-shell header-inner">
          <Link
            href="/"
            className="brand"
            aria-label="Thịnh Vượng Legal — Trang chủ"
          >
            <span className="brand-mark">
              <Scale aria-hidden="true" />
            </span>
            <span>
              <strong>THỊNH VƯỢNG</strong>
              <small>LEGAL · FINTECH</small>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="desktop-nav" aria-label="Điều hướng chính">
            {nav.map(([label, href]) => {
              const isActive =
                pathname === href || pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={isActive ? 'text-[#8c6b18] font-bold after:!right-0' : ''}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Header Action Buttons */}
          <div className="header-actions">
            <Link
              className="gold-button hidden md:inline-flex text-xs h-10 px-4"
              href="/cong-cu/tao-hop-dong"
            >
              <Wand2 className="w-3.5 h-3.5 mr-1" />
              Tạo hợp đồng
            </Link>
            <a
              className="icon-link"
              href="mailto:vuanhquan160205@gmail.com"
              aria-label="Gửi email"
              title="Gửi email cho Vũ Anh Quân"
            >
              <Mail />
            </a>
            <Link className="primary-link" href="/lien-he">
              <MessageCircle /> Liên hệ
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="mobile-menu md:hidden relative">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-10 h-10 border border-[#e3e7eb] flex items-center justify-center bg-white text-[#0a131e] rounded-sm cursor-pointer"
              aria-label="Mở danh mục"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {mobileMenuOpen && (
              <div className="mobile-menu-panel z-50">
                {nav.map(([label, href]) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
