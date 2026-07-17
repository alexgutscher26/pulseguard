import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar } from "lucide-react";

interface PostLayoutProps {
  title: string;
  date: string;
  readTime: string;
  category: string;
  children: ReactNode;
}

export default function PostLayout({ title, date, readTime, category, children }: PostLayoutProps) {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="py-28 md:py-36 bg-background relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.03] to-transparent pointer-events-none" />
        <div className="max-w-3xl mx-auto px-6 md:px-12 flex flex-col gap-6 relative">
          <Link
            href={"/blog" as any}
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors w-fit"
          >
            <ArrowLeft className="size-3.5" />
            Back to Blog
          </Link>
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-primary/20 bg-primary/5 text-primary text-[10px] font-bold font-mono uppercase tracking-widest w-fit">
            {category}
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-[1.1]">
            {title}
          </h1>
          <div className="flex items-center gap-4 text-muted-foreground/60">
            <span className="inline-flex items-center gap-1.5 text-xs font-mono">
              <Calendar className="size-3.5" />
              {date}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-mono">
              <Clock className="size-3.5" />
              {readTime}
            </span>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-20 bg-background">
        <div className="max-w-3xl mx-auto px-6 md:px-12">
          <div className="prose prose-sm prose-invert max-w-none [&_h2]:text-xl [&_h2]:font-bold [&_h2]:tracking-tight [&_h2]:text-foreground [&_h2]:mt-10 [&_h2]:mb-4 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-foreground [&_h3]:mt-8 [&_h3]:mb-3 [&_p]:text-muted-foreground [&_p]:leading-relaxed [&_p]:mb-4 [&_ul]:text-muted-foreground [&_ul]:text-sm [&_ul]:leading-relaxed [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1.5 [&_strong]:text-foreground [&_strong]:font-semibold [&_code]:text-[13px] [&_code]:bg-card [&_code]:border [&_code]:border-border [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:font-mono [&_pre]:bg-card [&_pre]:border [&_pre]:border-border [&_pre]:rounded-xl [&_pre]:p-5 [&_pre]:mb-6 [&_pre>code]:bg-transparent [&_pre>code]:border-none [&_pre>code]:p-0 [&_pre>code]:text-sm [&_blockquote]:border-l-2 [&_blockquote]:border-primary/30 [&_blockquote]:pl-5 [&_blockquote]:text-muted-foreground [&_blockquote]:italic [&_blockquote]:mb-4 [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 [&_a]:decoration-primary/30 [&_a:hover]:decoration-primary [&_hr]:border-border [&_hr]:my-8">
            {children}
          </div>
        </div>
      </section>

      {/* Back to Blog */}
      <section className="border-t border-border bg-background">
        <div className="max-w-3xl mx-auto px-6 md:px-12 py-12 text-center">
          <Link
            href={"/blog" as any}
            className="inline-flex items-center gap-1.5 h-10 px-5 bg-primary text-primary-foreground font-bold text-xs rounded-lg border border-primary hover:bg-primary/90 transition-all duration-300"
          >
            <ArrowLeft className="size-3.5" />
            Back to Blog
          </Link>
        </div>
      </section>
    </div>
  );
}
