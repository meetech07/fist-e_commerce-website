import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";
import { getBlogBySlug } from "@/lib/data";
import { blogJsonLd } from "@/lib/seo";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { JsonLd } from "@/components/seo/JsonLd";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);
  if (!post) return { title: "Article not found" };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.cover_image, width: 1200, height: 630, alt: post.title }],
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);
  if (!post) notFound();

  const paragraphs = post.content.split("\n\n").filter(Boolean);

  return (
    <article className="mx-auto max-w-3xl px-4 pb-24 pt-28 sm:px-6">
      <JsonLd data={blogJsonLd(post)} />

      <Link href="/blog" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-accent">
        <ArrowLeft className="h-4 w-4" /> All articles
      </Link>

      <div className="mt-6 flex flex-wrap gap-2">
        <Badge variant="gold">{post.category}</Badge>
        {post.tags.map((t) => <Badge key={t} variant="outline">#{t}</Badge>)}
      </div>

      <h1 className="mt-4 font-display text-3xl font-semibold leading-tight sm:text-4xl">{post.title}</h1>

      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5"><User className="h-4 w-4" /> {post.author}</span>
        <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {formatDate(post.created_at)}</span>
        <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {post.reading_time} min read</span>
      </div>

      <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-3xl">
        <Image src={post.cover_image} alt={post.title} fill className="object-cover" priority />
      </div>

      <div className="prose-para mt-8 space-y-5">
        {paragraphs.map((p, i) => (
          <p key={i} className="leading-relaxed text-muted-foreground [&:first-child]:text-lg [&:first-child]:text-foreground">
            {p}
          </p>
        ))}
      </div>

      <div className="mt-12 rounded-3xl bg-secondary/50 p-6 text-center">
        <h2 className="font-display text-xl font-semibold">Need materials for your next project?</h2>
        <p className="mt-2 text-sm text-muted-foreground">Browse our full range of ceilings, panels and accessories with trade pricing.</p>
        <Link href="/products" className="mt-4 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90">
          Explore Products
        </Link>
      </div>
    </article>
  );
}
