import { useState } from 'react';
import { Link } from '@/router';
import { ArrowRight, CalendarCheck, CheckCircle2 } from 'lucide-react';
import { SectionHero } from '@/components/section-hero';
import { contracts, services } from '@/lib/site-data';
import { LicensingTimeline } from '@/components/licensing-timeline';
import { DeepDivePillars } from '@/components/deep-dive-pillars';
import { BookingModal } from '@/components/booking-modal';

export function ServicesPage() {
  const [bookingOpen, setBookingOpen] = useState(false);

  return (
    <main>
      <SectionHero
        eyebrow="Dịch vụ pháp lý"
        title="Một lộ trình, sáu nhóm công việc"
        description="Dịch vụ được xếp theo vòng đời dự án ví điện tử, từ quyết định đầu tư đến vận hành và phản ứng sự cố."
        bgImage="/assets/corporate-counsel.jpg"
      >
        <div className="hero-note">
          <strong>(*)</strong>
          <span>
            Đề mục tối thiểu là nội dung cần thiết hoặc bắt buộc phải chuẩn bị theo Nghị định 52/2024/NĐ-CP.
          </span>
        </div>
      </SectionHero>

      {/* Licensing Timeline Embedded */}
      <section className="py-12 bg-white border-b border-[#d8ddd9]">
        <div className="site-shell">
          <LicensingTimeline />
        </div>
      </section>

      {/* 4 Deep Dive Pillars */}
      <DeepDivePillars />

      <section className="content-section">
        <div className="site-shell service-detail-list">
          {services.map((service) => {
            const related = contracts.filter(
              (item) => item.group === service.id
            );
            return (
              <article
                id={service.id}
                key={service.id}
                className="service-detail"
              >
                <div className="service-detail-index">{service.number}</div>
                <div className="service-detail-main">
                  <div className="service-detail-title">
                    <h2>{service.title}</h2>
                    {service.minimum && (
                      <span className="tier minimum">Tối thiểu (*)</span>
                    )}
                    {service.advanced && (
                      <span className="tier advanced">Nâng cao</span>
                    )}
                  </div>
                  <p>{service.description}</p>
                  <div className="outcome-box">
                    <CheckCircle2 />
                    <span>
                      <strong>Sản phẩm đầu ra</strong>
                      {service.outcome}
                    </span>
                  </div>
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={() => setBookingOpen(true)}
                      className="text-xs font-bold text-[#0c665f] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <CalendarCheck className="w-3.5 h-3.5" />
                      Đặt lịch tư vấn nhóm dịch vụ này
                    </button>
                  </div>
                </div>
                <div className="service-related">
                  <span>Tài liệu liên quan</span>
                  {related.length ? (
                    related.slice(0, 4).map((item) => (
                      <Link href={`/hop-dong/${item.slug}`} key={item.slug}>
                        {item.shortTitle}
                        <ArrowRight />
                      </Link>
                    ))
                  ) : (
                    <p>Chưa có tài liệu công khai trong danh mục này.</p>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <BookingModal open={bookingOpen} onClose={() => setBookingOpen(false)} />
    </main>
  );
}
