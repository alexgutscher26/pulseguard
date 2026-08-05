import type { Metadata } from "next";
import { FileText, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { formatPostDate, getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog | PulseGuard",
  description:
    "Engineering insights, monitoring tips, and product updates from the PulseGuard team.",
  openGraph: {
    title: "Blog | PulseGuard",
    description: "Engineering insights, monitoring tips, and product updates.",
  },
};

const posts = getAllPosts();

const categories = ["All", "Engineering", "Product", "Guides"];

export default function BlogPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="py-28 md:py-36 bg-background relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.03] to-transparent pointer-events-none" />
        <div className="max-w-5xl mx-auto px-6 md:px-12 flex flex-col items-center text-center gap-6 relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-primary/20 bg-primary/5 text-primary text-[10px] font-bold font-mono uppercase tracking-widest">
            <FileText className="size-3" />
            Blog
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground max-w-3xl leading-[1.1]">
            Engineering insights &amp; product updates
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-xl">
            Thoughts on monitoring, incident response, and building infrastructure that doesn&apos;t
            wake you up at 3 AM.
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="border-b border-border bg-background/50">
        <div className="max-w-5xl mx-auto px-6 md:px-12 py-4 flex gap-2 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`shrink-0 px-3.5 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                cat === "All"
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-transparent text-muted-foreground border-border hover:text-foreground hover:border-primary/30"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Posts */}
      <section className="py-16 md:py-20 bg-background relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-2 gap-px bg-border rounded-xl overflow-hidden">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}` as any}
                className="bg-card p-7 md:p-9 flex flex-col gap-4 group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
                    {post.meta.category}
                  </span>
                  <span className="text-[10px] text-muted-foreground/40">&bull;</span>
                  <span className="text-[10px] text-muted-foreground/50 font-mono">
                    {formatPostDate(post.meta.date)}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors leading-snug">
                  {post.meta.title}
                </h2>
                <p className="text-muted-foreground text-xs leading-relaxed flex-1">
                  {post.meta.description}
                </p>
                <div className="flex items-center gap-3 pt-2">
                  <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground/50 font-mono">
                    <Clock className="size-3" />
                    {post.meta.readTime}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    Read <ArrowRight className="size-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
