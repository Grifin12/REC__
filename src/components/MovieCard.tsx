import Image from 'next/image';
import Link from 'next/link';

interface MovieCardProps {
  movie: any;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const posterPath = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=Afi%C5%9F+Yok';

  return (
    <Link href={`/movie/${movie.id}`} className="group block h-full">
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl bg-white/5 border border-white/10 transition-transform duration-300 group-hover:scale-105 group-hover:border-[#d4af37]/50">
        <Image
          src={posterPath}
          alt={movie.title || 'Movie Poster'}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
        />
        {/* Rating Badge */}
        <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm border border-white/20 text-[#d4af37] text-xs font-bold px-2 py-1 rounded-md">
          {movie.vote_average ? movie.vote_average.toFixed(1) : 'NR'}
        </div>
      </div>
      <div className="mt-3">
        <h3 className="text-sm font-semibold text-gray-200 line-clamp-1 group-hover:text-white transition-colors">
          {movie.title}
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          {movie.release_date ? movie.release_date.substring(0, 4) : 'Bilinmeyen Yıl'}
        </p>
      </div>
    </Link>
  );
}
