"use client";

import * as React from "react";
import { Star } from "lucide-react";
import type { Review } from "@/types";
import { formatDate } from "@/lib/utils";
import { Rating } from "@/components/shared/Rating";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const DEMO_REVIEWS: Review[] = [
  {
    id: "r1",
    product_id: "demo",
    user_id: null,
    user_name: "Rohit Mehta",
    rating: 5,
    title: "Excellent quality & finish",
    comment: "The material finish is genuinely premium. Delivery was fast and packaging was perfect.",
    is_verified: true,
    created_at: new Date(Date.now() - 6 * 86400000).toISOString(),
  },
  {
    id: "r2",
    product_id: "demo",
    user_id: null,
    user_name: "Kavita Joshi",
    rating: 4,
    title: "Great value for money",
    comment: "Very good quality for the price. Would recommend to anyone planning interiors.",
    is_verified: true,
    created_at: new Date(Date.now() - 12 * 86400000).toISOString(),
  },
];

export function ProductReviews({ productId }: { productId: string }) {
  const [reviews, setReviews] = React.useState<Review[]>(DEMO_REVIEWS);
  const [form, setForm] = React.useState({ name: "", rating: 5, title: "", comment: "" });
  const [submitting, setSubmitting] = React.useState(false);

  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name.trim().length < 2) return toast.error("Please enter your name");
    if (form.comment.trim().length < 10) return toast.error("Review should be at least 10 characters");
    setSubmitting(true);
    try {
      const newReview: Review = {
        id: `local-${Date.now()}`,
        product_id: productId,
        user_id: null,
        user_name: form.name,
        rating: form.rating,
        title: form.title,
        comment: form.comment,
        is_verified: false,
        created_at: new Date().toISOString(),
      };
      setReviews((prev) => [newReview, ...prev]);
      setForm({ name: "", rating: 5, title: "", comment: "" });
      toast.success("Thanks for your review!");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mt-14">
      <h2 className="mb-6 font-display text-2xl font-semibold sm:text-3xl">Customer Reviews</h2>
      <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
        <div className="rounded-3xl border bg-card p-6 text-center">
          <p className="font-display text-5xl font-bold">{avg.toFixed(1)}</p>
          <Rating value={avg} size="md" className="mt-2 justify-center" />
          <p className="mt-1 text-sm text-muted-foreground">{reviews.length} reviews</p>
          <div className="mt-5 space-y-2">
            {distribution.map(({ star, count }) => (
              <div key={star} className="flex items-center gap-2 text-xs">
                <span className="w-3">{star}</span>
                <Star className="h-3 w-3 fill-accent text-accent" />
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full gold-gradient"
                    style={{ width: `${(count / reviews.length) * 100}%` }}
                  />
                </div>
                <span className="w-6 text-muted-foreground">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="rounded-2xl border bg-card p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar name={review.user_name} size="md" />
                    <div>
                      <p className="text-sm font-semibold">{review.user_name}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(review.created_at)}</p>
                    </div>
                  </div>
                  {review.is_verified && (
                    <span className="rounded-full bg-success/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-success">
                      ✓ Verified
                    </span>
                  )}
                </div>
                <Rating value={review.rating} className="mt-3" />
                {review.title && <p className="mt-1.5 font-semibold">{review.title}</p>}
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{review.comment}</p>
              </div>
            ))}
          </div>

          <form onSubmit={submit} className="mt-8 rounded-3xl border bg-card p-6">
            <h3 className="font-display text-lg font-semibold">Write a review</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="rv-name">Your Name *</Label>
                <Input id="rv-name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Full name" />
              </div>
              <div className="space-y-2">
                <Label>Rating</Label>
                <div className="flex gap-1 pt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, rating: star }))}
                      aria-label={`${star} stars`}
                    >
                      <Star className={cn("h-6 w-6 transition", star <= form.rating ? "fill-accent text-accent" : "text-muted-foreground/40")} />
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="rv-title">Title (optional)</Label>
                <Input id="rv-title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Short summary" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="rv-comment">Your Review *</Label>
                <Textarea id="rv-comment" rows={4} value={form.comment} onChange={(e) => setForm((f) => ({ ...f, comment: e.target.value }))} placeholder="Share your experience…" />
              </div>
            </div>
            <Button type="submit" variant="gold" className="mt-5" loading={submitting}>Submit Review</Button>
          </form>
        </div>
      </div>
    </section>
  );
}
