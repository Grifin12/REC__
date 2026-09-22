const genreMap: Record<string, number> = {
  // Temel Türler
  'aksiyon': 28, 'macera': 12, 'animasyon': 16, 'komedi': 35,
  'suç': 80, 'belgesel': 99, 'dram': 18, 'aile': 10751,
  'fantastik': 14, 'tarih': 36, 'korku': 27, 'müzik': 10402,
  'gizem': 9648, 'romantik': 10749, 'bilim kurgu': 878, 'uzay': 878, 'sci fi': 878,
  'gerilim': 53, 'savaş': 10752, 'vahşi batı': 37, 'western': 37,
  
  // Ruh Halleri & Özel Etiketler (TMDB Keywords veya Tür birleşimleri)
  'ağlatacak': 18, 'hüzünlü': 18, 'duygusal': 18, // Dram
  'güldürecek': 35, 'eğlenceli': 35, 'komik': 35, // Komedi
  'korkutucu': 27, 'ürpertici': 27, // Korku
  'heyecanlı': 28, 'tempolu': 28, // Aksiyon
  'kafa yoran': 9648, 'akıl almaz': 9648, // Gizem/Mindfuck
  'aşk': 10749, 'romantizm': 10749, 'sevgiliyle': 10749, // Romantik
  'büyü': 14, 'süper kahraman': 28, 'zombi': 27, 'uzaylı': 878
};

export function parseMovieQuery(query: string) {
  let q = query.toLowerCase();
  const params: Record<string, string | number> = {};
  
  // 1. Yıl Çıkarma (örn: "2015", "1999")
  const yearMatch = q.match(/\b(19\d{2}|20\d{2})\b/);
  if (yearMatch) {
    params['primary_release_year'] = yearMatch[1];
    q = q.replace(yearMatch[0], ''); 
  }
  
  // 2. Onyıl Çıkarma (90'lar, 80'ler vb.)
  if (q.includes('90lar') || q.includes("90'lar") || q.includes('90 lar')) {
    params['primary_release_date.gte'] = '1990-01-01';
    params['primary_release_date.lte'] = '1999-12-31';
  } else if (q.includes('80ler') || q.includes("80'ler") || q.includes('80 ler')) {
    params['primary_release_date.gte'] = '1980-01-01';
    params['primary_release_date.lte'] = '1989-12-31';
  } else if (q.includes('2000ler') || q.includes("2000'ler") || q.includes('2000 ler')) {
    params['primary_release_date.gte'] = '2000-01-01';
    params['primary_release_date.lte'] = '2009-12-31';
  }
  
  // 3. Tür & Ruh Hali Tespiti
  const foundGenres: number[] = [];
  Object.entries(genreMap).forEach(([keyword, id]) => {
    if (q.includes(keyword)) {
      if (!foundGenres.includes(id)) foundGenres.push(id);
      q = q.replace(keyword, '');
    }
  });
  
  if (foundGenres.length > 0) {
    params['with_genres'] = foundGenres.join(',');
  }
  
  // 4. Kalan temiz metni bul (gereksiz kelimeleri at)
  const cleanQuery = q.replace(/(filmi|filmleri|olan|bana|göster|bul|film|izlemek|istiyorum|öner)/g, '').trim();
  
  return {
    isDiscover: Object.keys(params).length > 0,
    params,
    cleanQuery
  };
}
