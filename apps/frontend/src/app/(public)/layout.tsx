import { Header, Footer } from '@/components/layout'
import { PublicAIChatbot } from '@/components/ai/chatbot/PublicAIChatbot'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      
      {/* AI Chatbot for public users */}
      <PublicAIChatbot />
    </div>
  )
}
