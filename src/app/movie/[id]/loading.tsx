export default function MovieLoading() {
  return (
    <div className="animate-pulse">
      {/* Hero Skeleton */}
      <div className="relative h-[60vh] min-h-[400px] w-full bg-gray-900 border-b border-white/10 flex items-end">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c10] via-[#0b0c10]/80 to-transparent z-10" />
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full flex flex-col md:flex-row gap-8 items-end">
          {/* Poster Skeleton */}
          <div className="w-48 md:w-64 aspect-[2/3] bg-white/5 rounded-2xl shadow-2xl shrink-0 border border-white/10" />
          
          {/* Info Skeleton */}
          <div className="flex-1 space-y-4 w-full">
            <div className="h-10 md:h-16 bg-white/5 rounded-lg w-3/4" />
            <div className="flex gap-4">
              <div className="h-6 bg-white/5 rounded w-16" />
              <div className="h-6 bg-white/5 rounded w-24" />
            </div>
            <div className="h-24 bg-white/5 rounded-lg w-full max-w-2xl mt-4" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="h-8 bg-white/5 rounded-lg w-48 mb-8" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="aspect-[2/3] bg-white/5 rounded-2xl border border-white/10" />
          ))}
        </div>
      </div>
    </div>
  );
}
