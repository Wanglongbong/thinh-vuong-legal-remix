import { useRouter } from '@/router';
import { PlatformShell } from '@/components/platform-shell';
import { LegalPlatform } from '@/components/legal-platform';

type Tool =
  | 'tong-quan'
  | 'hoi-dap'
  | 'tao-hop-dong'
  | 'review'
  | 'so-sanh'
  | 'ho-so'
  | 'tep';

export function ToolPage() {
  const { pathname } = useRouter();

  let tool: Tool = 'tong-quan';
  if (pathname.startsWith('/cong-cu/hoi-dap')) tool = 'hoi-dap';
  else if (pathname.startsWith('/cong-cu/tao-hop-dong')) tool = 'tao-hop-dong';
  else if (pathname.startsWith('/cong-cu/review')) tool = 'review';
  else if (pathname.startsWith('/cong-cu/so-sanh')) tool = 'so-sanh';
  else if (pathname.startsWith('/cong-cu/ho-so')) tool = 'ho-so';
  else if (pathname.startsWith('/cong-cu/tep')) tool = 'tep';

  return (
    <PlatformShell>
      <LegalPlatform tool={tool} />
    </PlatformShell>
  );
}
