export default function CollectionLoading() {
  return (
    <div className="pb-24 animate-pulse">
      <div className="w-full h-64 sm:h-80 bg-silk-cream/60 mb-12" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-6 w-64 bg-silk-cream/60 rounded mb-8" />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="aspect-[3/4] w-full bg-silk-cream/60" />
              <div className="h-3 w-3/4 bg-silk-cream/60 rounded" />
              <div className="h-3 w-1/3 bg-silk-cream/40 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
