import { notFound } from 'next/navigation';
import { BookOpen, Clock, User } from 'lucide-react';
import { FloatingWidgets } from '@snake-rescue/ui';

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  content: string;
  category: string;
  tags: string[];
  imageUrl: string | null;
  createdAt: Date;
  author: {
    name: string;
  };
};

function formatDate(dateStr: Date | null) {
  if (!dateStr) return 'Unknown date';
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

async function getBlogBySlug(slug: string): Promise<BlogPost | null> {
  // TODO: Replace with GraphQL API call
  // For now, return mock data to complete the build
  return null;
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#0f1a1c]">
      <div className="max-w-5xl mx-auto px-4 py-16">
        <article className="space-y-8">
          <div className="flex flex-col gap-3 mb-8 text-center">
            <span className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/40 rounded-full px-4 py-2 text-sm text-emerald-300 font-semibold">
              <BookOpen className="w-4 h-4" /> Wildlife Blog
            </span>
            <h1 className="text-5xl font-bold text-white leading-tight">{blog.title}</h1>
            <div className="flex flex-col sm:flex-row sm:justify-center sm:items-center gap-3 text-gray-400 text-sm">
              <span className="flex items-center gap-2"><User className="w-4 h-4" />{blog.author.name}</span>
              <span className="flex items-center gap-2"><Clock className="w-4 h-4" />{formatDate(blog.createdAt)}</span>
              <span className="text-emerald-300 uppercase tracking-[0.2em] text-xs font-semibold">{blog.category}</span>
            </div>
          </div>

          <div className="rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br from-emerald-900/30 to-slate-950/70 shadow-xl">
            {blog.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={blog.imageUrl} alt={blog.title} className="w-full h-96 object-cover" />
            ) : (
              <div className="h-96 flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950 text-8xl text-white/10">🐍</div>
            )}
          </div>

          <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed space-y-6">
            {blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag) => (
                  <span key={tag} className="text-xs font-semibold uppercase tracking-[0.16em] bg-white/5 border border-white/10 rounded-full px-3 py-1 text-emerald-300">
                    {tag}
                  </span>
                ))}
              </div>
            )}
            {blog.content.split('\n').map((paragraph, index) => (
              paragraph.trim() ? <p key={index}>{paragraph}</p> : <br key={`br-${index}`} />
            ))}
          </div>
        </article>
      </div>
      <FloatingWidgets />
    </div>
  );
}
