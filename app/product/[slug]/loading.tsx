export default function ProductLoading() {
  return (
    <div className="pb-24 pt-6 animate-pulse">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-4 w-56 bg-silk-cream/60 rounded mb-8" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7 space-y-4">
            <div className="aspect-[3/4] w-full bg-silk-cream/60" />
            <div className="grid grid-cols-4 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-silk-cream/50" />
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="h-7 w-3/4 bg-silk-cream/60 rounded" />
            <div className="h-5 w-1/3 bg-silk-cream/50 rounded" />
            <div className="h-24 w-full bg-silk-cream/40 rounded" />
            <div className="h-12 w-full bg-silk-cream/60 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
