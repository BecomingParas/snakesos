import { Header, Footer } from '@/components/layout';
import { PublicAIChatbot } from '@/components/ai/chatbot/PublicAIChatbot';
import { Providers } from '@/components/providers/providers';

export const dynamic = 'force-dynamic';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />

        {/* AI Chatbot for public users */}
        <PublicAIChatbot />
      </div>
    </Providers>
  );
}
