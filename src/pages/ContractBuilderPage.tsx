import { useEffect, useState } from 'react';
import { FileSignature, ShieldCheck } from 'lucide-react';
import { ContractBuilder } from '@/components/contract-builder';
import { SectionHero } from '@/components/section-hero';
import { useRouter } from '@/router';

export function ContractBuilderPage() {
  const { pathname } = useRouter();
  const [mau, setMau] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const mauParam = params.get('mau');
      if (mauParam) {
        setMau(mauParam);
      }
    }
  }, [pathname]);

  return (
    <main>
      <SectionHero
        eyebrow="Công cụ dành cho nhà đầu tư"
        title="Tạo dự thảo hợp đồng pháp lý"
        description="Chọn một dịch vụ ví điện tử, nhập thông tin các bên và nhận bản dự thảo có cấu trúc để tiếp tục rà soát với luật sư."
      >
        <div className="hero-note">
          <ShieldCheck aria-hidden="true" />
          <span>
            <strong>20</strong> mẫu theo đúng nhóm dịch vụ trong báo cáo
          </span>
        </div>
      </SectionHero>
      <section className="builder-section">
        <div className="site-shell">
          <div className="builder-heading">
            <FileSignature aria-hidden="true" />
            <div>
              <h2>Thông tin lập dự thảo</h2>
              <p>
                Các trường chưa nhập sẽ được đánh dấu để hoàn thiện trước khi ký.
              </p>
            </div>
          </div>
          <ContractBuilder initialContractSlug={mau} />
        </div>
      </section>
    </main>
  );
}
