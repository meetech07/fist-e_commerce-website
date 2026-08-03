import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Clock } from "lucide-react";
import { getBlogs } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = buildMetadata({
  title: "Ceiling & Interior Blog",
  description:
    "Expert guides on false ceilings, PVC & WPC wall panels, gypsum boards, installation tips and interior design inspiration from Paras Enterprises.",
  path: "/blog",
});

export default async function BlogPage() {
  const posts = await getBlogs();

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-28 sm:px-6">
      <div className="max-w-2xl">
        <h1 className="font-display text-4xl font-semibold sm:text-5xl">The Paras Journal</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Guides, tips and inspiration for ceilings, walls and modern interiors — straight from our workshop floor.
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link key={post.id} href={`/blog/${post.slug}`} className="group overflow-hidden rounded-3xl border bg-card transition hover:border-accent hover:shadow-xl">
            <div className="relative aspect-[16/10] overflow-hidden">
              <Image src={post.cover_image} alt={post.title} fill className="object-cover transition duration-700 group-hover:scale-105" sizes="(max-width:768px) 100vw, 33vw" />
              <Badge variant="gold" className="absolute left-4 top-4">{post.category}</Badge>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>{formatDate(post.created_at)}</span>
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {post.reading_time} min read</span>
              </div>
              <h2 className="mt-2 line-clamp-2 font-display text-lg font-semibold transition group-hover:text-accent">{post.title}</h2>
              <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{post.excerpt}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent">
                Read article <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
