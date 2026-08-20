import type { Metadata } from "next";
import { FileText, Rss } from "lucide-react";
import { getAllPosts } from "@/lib/blog";
import { BlogListing } from "@/components/blog/blog-listing";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Engineering Blog & Architecture Insights | SteadyStack",
  description:
    "Engineering deep-dives, distributed consensus architectures, uptime benchmarking, and incident response guides from the SteadyStack team.",
  openGraph: {
    title: "Engineering Blog & Architecture Insights | SteadyStack",
    description:
      "Engineering deep-dives, distributed consensus architectures, uptime benchmarking, and incident response guides.",
    siteName: "SteadyStack",
  },
  alternates: {
    canonical: "https://steadystack.dev/blog",
  },
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero Header */}
      <section className="pt-28 pb-16 md:pt-36 md:pb-24 bg-background relative overflow-hidden border-b border-border/80">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.04] via-transparent to-transparent pointer-events-none" />
        <div className="max-w-5xl mx-auto px-6 md:px-12 flex flex-col items-center text-center gap-6 relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-primary/20 bg-primary/5 text-primary text-[10px] font-bold font-mono uppercase tracking-widest rounded-md">
            <FileText className="size-3" />
            Engineering &amp; Product Publications
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground max-w-3xl leading-[1.1]">
            Engineering insights &amp; monitoring architecture
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-2xl">
            In-depth technical guides on global edge consensus, zero-noise
            alerting pipelines, SLA verification, and building distributed
            infrastructure that doesn&apos;t wake you up at 3 AM.
          </p>
        </div>
      </section>

      {/* Main Blog Explorer & Posts */}
      <section className="py-12 md:py-16 bg-background">
        <div className="max-w-5xl mx-auto px-6 md:px-12">
          <BlogListing posts={posts} />
        </div>
      </section>
    </div>
  );
}
