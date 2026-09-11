import { useEffect, useState } from 'react';
import { RouterProvider, useRouter } from '@/router';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { SelectionAssistant } from '@/components/selection-assistant';
import { LegalAssistant } from '@/components/legal-assistant';
import { AiConfigModal } from '@/components/ai-config-modal';
import { BackgroundMusic } from '@/components/background-music';
import { RoyalFlankDecor } from '@/components/royal-flank-decor';
import { ErrorBoundary } from '@/components/error-boundary';
import { HomePage } from '@/pages/HomePage';
import { ServicesPage } from '@/pages/ServicesPage';
import { TeamPage } from '@/pages/TeamPage';
import { ContractsPage } from '@/pages/ContractsPage';
import { ContractDetailPage } from '@/pages/ContractDetailPage';
import { ContractBuilderPage } from '@/pages/ContractBuilderPage';
import { ToolPage } from '@/pages/ToolPage';
import { KnowledgePage } from '@/pages/KnowledgePage';
import { ContactPage } from '@/pages/ContactPage';
import { DisclaimerPage } from '@/pages/DisclaimerPage';
import { ReportsPage } from '@/pages/ReportsPage';
import { ReportDetailPage } from '@/pages/ReportDetailPage';
import { ForumPage } from '@/pages/ForumPage';

function AppContent() {
  const { pathname } = useRouter();
  const [aiModalOpen, setAiModalOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => setAiModalOpen(true);
    window.addEventListener('tv:open-ai-settings', handleOpen);
    return () => window.removeEventListener('tv:open-ai-settings', handleOpen);
  }, []);

  const renderPage = () => {
    if (pathname === '/' || pathname === '') {
      return <HomePage />;
    }
    if (pathname === '/doi-ngu') {
      return <TeamPage />;
    }
    if (pathname === '/hop-dong') {
      return <ContractsPage />;
    }
    if (pathname.startsWith('/hop-dong/')) {
      return <ContractDetailPage />;
    }
    if (pathname === '/tao-hop-dong' || pathname.startsWith('/tao-hop-dong')) {
      return <ContractBuilderPage />;
    }
    if (pathname === '/cong-cu' || pathname.startsWith('/cong-cu')) {
      return <ToolPage />;
    }
    if (pathname === '/bao-cao-so-bo') {
      return <ReportsPage />;
    }
    if (pathname.startsWith('/bao-cao-so-bo/')) {
      return <ReportDetailPage />;
    }
    if (pathname === '/dien-dan' || pathname.startsWith('/dien-dan')) {
      return <ForumPage />;
    }
    if (pathname === '/kien-thuc') {
      return <KnowledgePage />;
    }
    if (pathname === '/lien-he') {
      return <ContactPage />;
    }
    if (pathname === '/tuyen-bo-phap-ly') {
      return <DisclaimerPage />;
    }
    return <HomePage />;
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      <a className="skip-link" href="#main-content">
        Bỏ qua điều hướng
      </a>
      <RoyalFlankDecor />
      <SiteHeader />
      <div id="main-content" className="flex-1">
        <ErrorBoundary fallbackTitle="Không thể tải nội dung trang này">
          {renderPage()}
        </ErrorBoundary>
      </div>
      <SiteFooter />
      <SelectionAssistant />
      <LegalAssistant />
      <BackgroundMusic />
      <AiConfigModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <RouterProvider>
      <AppContent />
    </RouterProvider>
  );
}
