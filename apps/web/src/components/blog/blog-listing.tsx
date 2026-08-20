"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  Clock,
  ArrowRight,
  Sparkles,
  BookOpen,
  Calendar,
  X,
} from "lucide-react";
import type { BlogPost } from "@/lib/blog-types";
import { formatPostDate } from "@/lib/blog-types";

interface BlogListingProps {
  posts: BlogPost[];
}

const CATEGORIES = ["All", "Engineering", "Product", "Guides"] as const;

export function BlogListing({ posts }: BlogListingProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesCategory =
        selectedCategory === "All" || post.meta.category === selectedCategory;

      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;

      const query = searchQuery.toLowerCase().trim();
      const inTitle = post.meta.title.toLowerCase().includes(query);
      const inDesc = post.meta.description.toLowerCase().includes(query);
      const inTags = post.meta.tags.some((tag) =>
        tag.toLowerCase().includes(query),
      );
      const inCategory = post.meta.category.toLowerCase().includes(query);

      return inTitle || inDesc || inTags || inCategory;
    });
  }, [posts, selectedCategory, searchQuery]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: posts.length };
    for (const post of posts) {
      counts[post.meta.category] = (counts[post.meta.category] || 0) + 1;
    }
    return counts;
  }, [posts]);

  // Featured post: the first post when no filters are active
  const isFiltering =
    selectedCategory !== "All" || searchQuery.trim().length > 0;
  const featuredPost =
    !isFiltering && filteredPosts.length > 0 ? filteredPosts[0] : null;
  const gridPosts =
    !isFiltering && filteredPosts.length > 0
      ? filteredPosts.slice(1)
      : filteredPosts;

  return (
    <div className="flex flex-col gap-10">
      {/* Search and Category Filter Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-6 border-b border-border/80">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            const count = categoryCounts[cat] || 0;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`shrink-0 px-3.5 py-1.5 text-xs font-semibold rounded-lg border transition-all duration-200 flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-card text-muted-foreground border-border hover:text-foreground hover:border-primary/30"
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isSelected
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Live Search Input */}
        <div className="relative min-w-[240px] sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/60" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search guides & comparisons..."
            className="w-full pl-9 pr-8 py-1.5 text-xs bg-card border border-border/80 rounded-lg text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5"
            >
              <X className="size-3" />
            </button>
          )}
        </div>
      </div>

      {/* Featured Post Spotlight (shown when unfiltered) */}
      {featuredPost && (
        <div className="relative group">
          <Link
            href={`/blog/${featuredPost.slug}` as any}
            className="block p-7 sm:p-9 rounded-2xl border border-primary/30 bg-gradient-to-br from-card via-zinc-950 to-zinc-950 hover:border-primary/60 hover:shadow-2xl transition-all duration-300 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none group-hover:bg-primary/15 transition-colors" />

            <div className="relative flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold font-mono uppercase tracking-widest bg-primary/10 border border-primary/30 text-primary">
                  <Sparkles className="size-3" />
                  Featured Article
                </span>
                <span className="text-xs text-muted-foreground/50">&bull;</span>
                <span className="text-xs text-primary font-mono font-semibold">
                  {featuredPost.meta.category}
                </span>
                <span className="text-xs text-muted-foreground/50">&bull;</span>
                <span className="text-xs text-muted-foreground/70 font-mono">
                  {formatPostDate(featuredPost.meta.date)}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground group-hover:text-primary transition-colors leading-tight">
                {featuredPost.meta.title}
              </h2>

              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-3xl">
                {featuredPost.meta.description}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border/50">
                <div className="flex flex-wrap items-center gap-2">
                  {featuredPost.meta.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded text-[11px] font-mono bg-zinc-900 text-zinc-400 border border-zinc-800"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-4">
                  <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
                    <Clock className="size-3.5 text-muted-foreground/60" />
                    {featuredPost.meta.readTime}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-primary group-hover:translate-x-1 transition-transform">
                    <span>Read Article</span>
                    <ArrowRight className="size-3.5" />
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* Grid of Articles */}
      {gridPosts.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {gridPosts.map((post) => {
            const categoryBadge =
              post.meta.category === "Engineering"
                ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
                : post.meta.category === "Product"
                  ? "text-cyan-400 border-cyan-500/30 bg-cyan-500/10"
                  : "text-sky-400 border-sky-500/30 bg-sky-500/10";

            return (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}` as any}
                className="group flex flex-col justify-between p-6 rounded-xl border border-border/80 bg-card hover:border-primary/40 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 cursor-pointer relative overflow-hidden"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-[10px] font-bold font-mono uppercase tracking-wider px-2 py-0.5 rounded border ${categoryBadge}`}
                    >
                      {post.meta.category}
                    </span>
                    <span className="text-[11px] text-muted-foreground/60 font-mono flex items-center gap-1">
                      <Calendar className="size-3" />
                      {formatPostDate(post.meta.date)}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold tracking-tight text-foreground group-hover:text-primary transition-colors leading-snug">
                    {post.meta.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-3">
                    {post.meta.description}
                  </p>
                </div>

                <div className="flex flex-col gap-3 pt-5 mt-4 border-t border-border/50">
                  {post.meta.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {post.meta.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-zinc-900/90 text-zinc-400 border border-zinc-800"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground/70 font-mono">
                      <Clock className="size-3" />
                      {post.meta.readTime}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary group-hover:translate-x-1 transition-transform">
                      <span>Read</span>
                      <ArrowRight className="size-3" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center rounded-2xl border border-dashed border-border bg-card/30">
          <BookOpen className="size-10 text-muted-foreground/40 mb-3" />
          <h3 className="text-base font-bold text-foreground mb-1">
            No articles found
          </h3>
          <p className="text-xs text-muted-foreground max-w-sm mb-4">
            We couldn&apos;t find any posts matching &ldquo;{searchQuery}&rdquo;
            in {selectedCategory}.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All");
            }}
            className="px-4 py-2 text-xs font-semibold text-primary bg-primary/10 hover:bg-primary hover:text-primary-foreground border border-primary/30 rounded-lg transition-colors"
          >
            Reset search filters
          </button>
        </div>
      )}
    </div>
  );
}

export default BlogListing;
