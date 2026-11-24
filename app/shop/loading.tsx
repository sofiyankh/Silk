export default function ShopLoading() {
  return (
    <div className="pb-20 animate-pulse">
      {/* Banner skeleton */}
      <div className="w-full h-48 sm:h-64 bg-silk-cream/60 mb-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-8 w-48 bg-silk-cream/60 mb-8 rounded" />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-4">
          <div className="hidden lg:block space-y-4">
            <div className="h-6 w-32 bg-silk-cream/60 rounded" />
            <div className="h-40 w-full bg-silk-cream/40 rounded" />
          </div>

          <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="aspect-[3/4] w-full bg-silk-cream/60" />
                <div className="h-3 w-3/4 bg-silk-cream/60 rounded" />
                <div className="h-3 w-1/3 bg-silk-cream/40 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
