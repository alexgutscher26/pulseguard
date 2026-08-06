import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PostLayout from "@/components/blog/post-layout";
import { formatPostDate, getPostBySlug } from "@/lib/blog";

const ALTERNATIVES_MAP: Record<string, string> = {
  freshping: "freshping-alternative",
};

export function generateStaticParams() {
  return [{ slug: "freshping" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const targetSlug = ALTERNATIVES_MAP[slug] || `${slug}-alternative`;
  const post = await getPostBySlug(targetSlug);
  if (!post) return {};

  const { title, description, date, tags } = post.meta;
  const url = `https://pulseguard.com/alternatives/${slug}`;

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

export default async function AlternativeSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const targetSlug = ALTERNATIVES_MAP[slug] || `${slug}-alternative`;
  const post = await getPostBySlug(targetSlug);

  if (!post) notFound();

  const { title, description, date, category, readTime, author, tags } = post.meta;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: title,
    description,
    datePublished: date,
    dateModified: date,
    author: { "@type": "Person", name: author },
    publisher: {
      "@type": "Organization",
      name: "PulseGuard",
      url: "https://pulseguard.com",
    },
    mainEntityOfPage: `https://pulseguard.com/alternatives/${slug}`,
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
