import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PostLayout from "@/components/blog/post-layout";
import { formatPostDate, getAllPosts, getPostBySlug } from "@/lib/blog";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  const { title, description, date, tags } = post.meta;
  const url = `https://pulseguard.com/blog/${slug}`;

  return {
    title,
    description,
    keywords: tags,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title,
      description,
      siteName: "PulseGuard",
      publishedTime: date,
      tags,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const { title, description, date, category, readTime, author, tags } = post.meta;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    datePublished: date,
    dateModified: date,
    author: { "@type": "Organization", name: author, url: "https://pulseguard.com" },
    publisher: {
      "@type": "Organization",
      name: "PulseGuard",
      url: "https://pulseguard.com",
    },
    mainEntityOfPage: `https://pulseguard.com/blog/${slug}`,
    keywords: tags.join(", "),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PostLayout title={title} date={formatPostDate(date)} readTime={readTime} category={category}>
        {post.body}
      </PostLayout>
    </>
  );
}
