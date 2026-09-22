export default function ExploreLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse min-h-screen">
      <div className="h-12 bg-white/5 rounded-lg w-64 mb-4" />
      <div className="h-6 bg-white/5 rounded-lg w-96 mb-12" />

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Skeleton */}
        <div className="w-full lg:w-64 shrink-0 space-y-6">
          <div className="h-64 bg-white/5 rounded-2xl border border-white/10" />
          <div className="h-48 bg-white/5 rounded-2xl border border-white/10" />
        </div>

        {/* Grid Skeleton */}
        <div className="flex-1">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {[...Array(15)].map((_, i) => (
              <div key={i} className="aspect-[2/3] bg-white/5 rounded-2xl border border-white/10" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
