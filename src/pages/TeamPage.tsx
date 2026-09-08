import React, { useState, useEffect, useRef } from 'react';
import { SectionHero } from '@/components/section-hero';
import { teamMembers, TeamMember } from '@/lib/site-data';
import { safeStorage } from '@/lib/storage';
import { CheckCircle, Camera, Upload, Sparkles, RefreshCw } from 'lucide-react';

function compressImageFile(file: File, maxDimension = 900, quality = 0.85): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      if (!src) return resolve('');
      const img = new window.Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        } else {
          resolve(src);
        }
      };
      img.onerror = () => resolve(src);
      img.src = src;
    };
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
}

export function TeamPage() {
  const [avatars, setAvatars] = useState<Record<string, string>>(() => {
    try {
      const saved = safeStorage.getItem('thinh_vuong_team_avatars');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [uploadingSlug, setUploadingSlug] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const batchInputRef = useRef<HTMLInputElement | null>(null);

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
      // LocalStorage backup
    }
  };

  const handleSingleUpload = async (member: TeamMember, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingSlug(member.slug);
    try {
      const base64 = await compressImageFile(file);
      if (base64) {
        await saveAvatar(member.slug, base64);
        setNotification(`Đã cập nhật ảnh thành viên ${member.name}`);
        setTimeout(() => setNotification(null), 3000);
      }
    } catch (err) {
      console.error('Error processing avatar:', err);
    } finally {
      setUploadingSlug(null);
    }
  };

  const handleBatchUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

    setNotification(`Đã nhận diện và cập nhật ${matchedCount} ảnh thành viên thành công!`);
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <main>
      <SectionHero
        eyebrow="Hội đồng Nghiên cứu &amp; Đề án Pháp lý Fintech"
        title="Đội ngũ xây dựng nội dung chuyên sâu"
        description="Mười hai thành viên cùng phát triển hệ thống dịch vụ pháp lý mô phỏng cho dự án ví điện tử Việt Nam. Cấu trúc phối hợp chặt chẽ giữa Pháp luật Tài chính - Ngân hàng và Quản trị Rủi ro An ninh mạng."
      >
        <div className="hero-stat bg-white/95 border-l-2 border-[#c59b27] p-4 text-[#0a131e] shadow-xs">
          <strong className="text-3xl font-serif text-[#8c6b18] block">12</strong>
          <span className="text-xs text-slate-600 font-medium">chuyên đề nghiên cứu đồng bộ</span>
        </div>
      </SectionHero>

      {/* Principles Overview */}
      <section className="bg-white py-12 border-b border-[#e3e7eb]">
        <div className="site-shell">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#faf9f5] border border-[#e3e7eb] p-6 lg:p-8 rounded-sm">
            <div className="lg:col-span-12">
              <span className="eyebrow text-[#8c6b18] text-xs font-bold uppercase tracking-wider mb-2 block">
                Nguyên tắc làm việc nhóm
              </span>
              <h3 className="font-serif text-2xl lg:text-3xl text-[#0a131e] font-semibold mb-3">
                Chuẩn hóa hồ sơ theo tiêu chuẩn Ngân hàng Nhà nước
              </h3>
              <p className="text-sm text-[#5f6e7c] leading-relaxed mb-6">
                Mỗi thành viên phụ trách một mảng chuyên đề độc lập nhưng đồng bộ: từ thẩm định nguồn gốc vốn điều lệ, hợp đồng hợp tác tài khoản đảm bảo thanh toán, thỏa thuận dịch vụ Merchant, đến bảo vệ dữ liệu cá nhân khách hàng.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-[#e3e7eb]">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#0a131e]">
                  <CheckCircle className="w-4 h-4 text-[#8c6b18]" /> NĐ 52/2024/NĐ-CP
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-[#0a131e]">
                  <CheckCircle className="w-4 h-4 text-[#8c6b18]" /> TT 40/2024/TT-NHNN
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-[#0a131e]">
                  <CheckCircle className="w-4 h-4 text-[#8c6b18]" /> Luật 91/2025/QH15
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-[#0a131e]">
                  <CheckCircle className="w-4 h-4 text-[#8c6b18]" /> ISO/IEC 27001
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Member Cards Grid with Photos */}
      <section className="content-section py-16 bg-[#faf9f5]">
        <div className="site-shell">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-[#e3e7eb]">
            <div>
              <span className="eyebrow">Hồ sơ nhân sự đề án</span>
              <h2 className="text-3xl font-serif text-[#0a131e]">
                12 Thành viên Ban Nghiên cứu &amp; Chuyên đề
              </h2>
              <p className="text-sm text-[#5f6e7c] mt-1">
                Nhóm 13 · Hệ thống dịch vụ pháp lý và hợp đồng mô phỏng cho ví điện tử Việt Nam
              </p>
            </div>

            {/* Batch Upload Action */}
            <div className="flex items-center gap-3">
              <input
                ref={batchInputRef}
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleBatchUpload}
              />
              <button
                type="button"
                onClick={() => batchInputRef.current?.click()}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-[#c59b27] text-[#0a131e] hover:bg-[#c59b27] hover:text-[#2a1f04] text-xs font-bold transition shadow-xs cursor-pointer rounded-sm"
              >
                <Upload className="w-4 h-4 text-[#8c6b18]" />
                <span>Tải lên hàng loạt 12 ảnh</span>
              </button>
            </div>
          </div>

          {/* Toast Notification */}
          {notification && (
            <div className="mb-6 p-3.5 bg-[#fcf8ed] text-[#684f0e] border border-[#c59b27] text-xs font-semibold flex items-center justify-between shadow-xs rounded-sm">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#8c6b18]" />
                <span>{notification}</span>
              </div>
              <button
                onClick={() => setNotification(null)}
                className="text-slate-500 hover:text-black cursor-pointer font-bold px-2"
              >
                ✕
              </button>
            </div>
          )}

          {/* Grid of Members */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => {
              const avatarSrc = avatars[member.slug] || member.avatarUrl;

              return (
                <article
                  className="bg-white border border-[#e3e7eb] shadow-xs hover:shadow-lg hover:border-[#c59b27] transition-all duration-300 flex flex-col justify-between overflow-hidden group relative rounded-sm"
                  key={member.id}
                >
                  {/* Photo Container */}
                  <div className="relative h-60 w-full bg-[#f5f0e3] overflow-hidden border-b border-[#e3e7eb]">
                    <img
                      src={avatarSrc}
                      alt={member.name}
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.style.display = 'none';
                        const fallback = target.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Styled Fallback Avatar if file not yet available */}
                    <div
                      style={{ display: 'none' }}
                      className="absolute inset-0 bg-gradient-to-br from-[#fffdf7] via-[#faf2dc] to-[#f5ecd2] flex flex-col items-center justify-center text-center p-4"
                    >
                      <div className="w-16 h-16 rounded-full bg-white border-2 border-[#c59b27] flex items-center justify-center text-xl font-serif font-bold text-[#8c6b18] mb-2 shadow-xs">
                        {member.name
                          .split(' ')
                          .slice(-2)
                          .map((part) => part[0])
                          .join('')}
                      </div>
                      <span className="text-[11px] text-[#684f0e] font-semibold">
                        {member.name}
                      </span>
                      <span className="text-[10px] text-slate-500 mt-1">
                        Bấm biểu tượng camera để tải ảnh
                      </span>
                    </div>

                    {/* Member Number Badge */}
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs border border-[#c59b27]/40 text-[#8c6b18] font-mono text-[11px] font-bold px-2.5 py-0.5 shadow-xs rounded-xs">
                      #{String(index + 1).padStart(2, '0')}
                    </div>

                    {/* Individual Upload Trigger */}
                    <label className="absolute top-3 right-3 w-8 h-8 bg-white/90 hover:bg-[#c59b27] text-[#684f0e] hover:text-[#2a1f04] border border-[#c59b27]/40 rounded-full flex items-center justify-center cursor-pointer transition shadow-xs group/btn">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleSingleUpload(member, e)}
                      />
                      <Camera className="w-4 h-4" />
                      <span className="sr-only">Tải ảnh cho {member.name}</span>
                    </label>

                    {/* Loading State Overlay */}
                    {uploadingSlug === member.slug && (
                      <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex items-center justify-center text-[#8c6b18] text-xs font-bold gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Đang lưu ảnh...</span>
                      </div>
                    )}
                  </div>

                  {/* Member Meta */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-serif text-lg font-bold text-[#0a131e] group-hover:text-[#8c6b18] transition-colors leading-snug">
                          {member.name}
                        </h3>
                        {member.role.includes('Trưởng nhóm') && (
                          <span className="bg-[#8c6b18]/10 text-[#8c6b18] border border-[#c59b27]/30 text-[10px] font-bold px-2 py-0.5 rounded-xs whitespace-nowrap">
                            Trưởng nhóm
                          </span>
                        )}
                      </div>

                      <p className="text-xs font-semibold text-[#8c6b18] mb-2 leading-relaxed">
                        {member.role}
                      </p>

                      <p className="text-[11px] text-[#5f6e7c] leading-normal line-clamp-2 mb-4 bg-[#fbf9f5] p-2 rounded-xs border border-[#e3e7eb]">
                        {member.expertise}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#e3e7eb] flex items-center justify-between text-[11px] text-[#5f6e7c]">
                      <span className="text-slate-400">Mã sinh viên:</span>
                      <span className="font-mono font-bold text-[#0a131e] bg-[#f0ede4] px-2 py-0.5 rounded-xs">
                        {member.id}
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
