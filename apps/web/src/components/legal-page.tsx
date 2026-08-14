import { Scale, FileText, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Section {
  title: string;
  content: string;
}

interface LegalPageProps {
  title: string;
  badge: string;
  description: string;
  lastUpdated: string;
  sections: Section[];
  otherPage: {
    href: string;
    label: string;
    description: string;
  };
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function LegalPage({
  title,
  badge,
  description,
  lastUpdated,
  sections,
  otherPage,
}: LegalPageProps) {
  return (
    <div className="flex flex-col">
      <section className="py-28 md:py-36 bg-background relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.03] to-transparent pointer-events-none" />
        <div className="max-w-5xl mx-auto px-6 md:px-12 flex flex-col items-center text-center gap-6 relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-primary/20 bg-primary/5 text-primary text-[10px] font-bold font-mono uppercase tracking-widest">
            <Scale className="size-3" />
            {badge}
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground max-w-3xl leading-[1.1]">
            {title}
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-xl">{description}</p>
          <p className="text-muted-foreground/50 text-[11px] font-mono">
            Last updated: {lastUpdated}
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto w-full px-6 md:px-12 py-16 md:py-20">
        <div className="flex gap-16 lg:gap-20">
          <nav className="hidden lg:block w-56 shrink-0" aria-label="Table of contents">
            <div className="sticky top-32 space-y-1">
              <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest mb-4">
                On this page
              </p>
              {sections.map((section) => (
                <a
                  key={section.title}
                  href={`#${slugify(section.title)}`}
                  className="block text-xs text-muted-foreground/60 hover:text-foreground transition-colors py-1.5 leading-snug"
                >
                  {section.title}
                </a>
              ))}
            </div>
          </nav>

          <div className="flex-1 min-w-0 divide-y divide-border">
            {sections.map((section, i) => (
              <section
                key={section.title}
                id={slugify(section.title)}
                className="py-10 first:pt-0 last:pb-0 scroll-mt-32"
              >
                <div className="flex items-start gap-4">
                  <span className="hidden sm:inline-flex mt-0.5 size-7 shrink-0 items-center justify-center rounded-md border border-border bg-card text-[11px] font-bold text-muted-foreground/60 font-mono">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground mb-3">
                      {section.title}
                    </h2>
                    <p className="text-muted-foreground text-sm leading-relaxed max-w-prose">
                      {section.content}
                    </p>
                  </div>
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>

      <section className="border-t border-border bg-background relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 md:px-12 py-16 md:py-20 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-border bg-card text-muted-foreground text-[10px] font-bold font-mono uppercase tracking-widest mb-6">
            <FileText className="size-3" />
            {otherPage.label}
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-4 leading-[1.15]">
            {otherPage.description}
          </h2>
          <Link
            href={otherPage.href as any}
            className="inline-flex items-center gap-1.5 h-11 px-8 bg-primary text-primary-foreground font-bold text-sm rounded-lg border border-primary hover:bg-primary/90 transition-all duration-300"
          >
            Read {otherPage.label} <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
