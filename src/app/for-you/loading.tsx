export default function ForYouLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 animate-pulse min-h-screen">
      
      {/* Header Skeleton */}
      <div className="text-center space-y-4 flex flex-col items-center">
        <div className="w-20 h-20 bg-[#d4af37]/10 rounded-2xl mb-2" />
        <div className="h-12 bg-white/5 rounded-lg w-64" />
        <div className="h-6 bg-white/5 rounded-lg w-96 max-w-full" />
      </div>

      {/* Sections Skeleton */}
      <div className="space-y-16">
        {[...Array(2)].map((_, sectionIdx) => (
          <section key={sectionIdx} className="space-y-6">
            <div className="border-b border-white/10 pb-4">
              <div className="h-4 bg-white/5 rounded w-32 mb-2" />
              <div className="h-8 bg-white/5 rounded w-72" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="aspect-[2/3] bg-white/5 rounded-2xl border border-white/10" />
              ))}
            </div>
          </section>
        ))}
      </div>

    </div>
  );
}
