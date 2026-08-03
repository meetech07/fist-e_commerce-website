import Link from "next/link";
import { ArrowLeft, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-6 text-center">
      <div className="relative">
        <p className="font-display text-8xl font-bold text-accent/20">404</p>
        <SearchX className="absolute -right-8 top-1/2 h-8 w-8 -translate-y-1/2 text-accent" />
      </div>
      <h1 className="mt-4 font-display text-3xl font-semibold">Page not found</h1>
      <p className="mt-2 text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or may have moved. Let&apos;s get you back on track.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/">
          <Button variant="gold">Back to Home</Button>
        </Link>
        <Link href="/products">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4" /> Browse Products
          </Button>
        </Link>
      </div>
    </div>
  );
}
