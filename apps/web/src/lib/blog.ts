import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";

const POSTS_DIR = path.join(process.cwd(), "src", "content", "blog");

export const postSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.string(),
  category: z.enum(["Engineering", "Product", "Guides"]),
  readTime: z.string(),
  tags: z.array(z.string()).default([]),
  author: z.string().default("PulseGuard Team"),
});

export type PostMeta = z.infer<typeof postSchema>;

export interface BlogPost {
  slug: string;
  meta: PostMeta;
}

export function getAllPosts(): BlogPost[] {
  const files = fs.readdirSync(POSTS_DIR).filter((file) => file.endsWith(".mdx"));

  const posts = files.map((file) => {
    const slug = file.replace(/\.mdx$/, "");
    const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf8");
    const { data } = matter(raw);
    return { slug, meta: postSchema.parse(data) };
  });

  return posts.sort((a, b) => b.meta.date.localeCompare(a.meta.date));
}

export async function getPostBySlug(slug: string) {
  const filePath = path.join(POSTS_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);

  return { slug, meta: postSchema.parse(data), content };
}

export function formatPostDate(isoDate: string): string {
  return new Date(isoDate + "T00:00:00Z").toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}
