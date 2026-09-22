import { NextResponse } from 'next/server';
import { discoverMovies, searchMovies } from '@/lib/tmdb';
import { parseMovieQuery } from '@/lib/parseMovieQuery';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');

  if (!q) {
    return NextResponse.json({ results: [] });
  }

  try {
    const { isDiscover, params, cleanQuery } = parseMovieQuery(q);

    let data;

    if (isDiscover) {
      // Doğal dil keşfi (Örn: "90'lar uzay filmleri")
      // Eğer geriye kalan bir kelime varsa (örn "Matrix"), onu keyword veya search olarak değerlendirebiliriz
      // Ancak şimdilik discover üzerinden with_genres ve tarihler ile arıyoruz.
      // Eger cleanQuery bossa sadece filtrelerle discover yap.
      
      const discoverParams = {
        sort_by: 'popularity.desc',
        ...params
      };

      data = await discoverMovies(discoverParams);
    } else {
      // Doğrudan isimle arama (Örn: "Inception")
      data = await searchMovies(cleanQuery || q);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Arama sırasında bir hata oluştu.' }, { status: 500 });
  }
}
