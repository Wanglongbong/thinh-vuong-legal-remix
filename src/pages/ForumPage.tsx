import { useRouter } from '@/router';
import { ForumIndex, NewForumPost, ForumThread } from '@/components/forum';

export function ForumPage() {
  const { pathname } = useRouter();

  if (pathname === '/dien-dan/tao-bai') {
    return <NewForumPost />;
  }

  if (pathname === '/dien-dan/quan-tri') {
    return <ForumIndex moderation={true} />;
  }

  if (pathname.startsWith('/dien-dan/') && pathname !== '/dien-dan') {
    const threadId = pathname.replace('/dien-dan/', '').trim();
    return <ForumThread id={threadId} />;
  }

  return <ForumIndex />;
}
