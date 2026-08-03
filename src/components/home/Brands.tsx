import { brandsData } from "@/lib/constants";

export function Brands() {
  const doubled = [...brandsData, ...brandsData];
  return (
    <section className="overflow-hidden border-y bg-secondary/40 py-12">
      <div className="mx-auto mb-8 max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">
            Brands <span className="gold-text">we deal in</span>
          </h2>
          <p className="text-sm text-muted-foreground">Genuine products · Authorised distributors</p>
        </div>
      </div>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />
        <div className="flex w-max animate-marquee gap-4 px-4">
          {doubled.map((brand, i) => (
            <div
              key={`${brand}-${i}`}
              className="flex h-16 items-center rounded-2xl border bg-card px-8 shadow-sm"
            >
              <span className="whitespace-nowrap font-display text-lg font-semibold tracking-wide text-muted-foreground/80">
                {brand}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
