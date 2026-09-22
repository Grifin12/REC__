# RECON — Modern Sinematik Film Keşif & Sosyal Platformu 🎬

Recon, klasik retro-terminal arayüzünden arındırılarak; **Letterboxd (ClonnerboxD referansı)** sosyal dinamikleri ile **Sumora'nın doğal dil tabanlı keşif/öneri UX'ini** birleştiren, modern, sinematik ve üst segment (premium) bir film takip platformudur.

## 🚀 Teknolojiler
- **Next.js 14+ (App Router)**: Gelişmiş routing, Server Components (RSC) ve Server Actions.
- **TypeScript**: Tip güvenli ve hatasız kod mimarisi.
- **Tailwind CSS**: Glassmorphism efektli koyu (deep dark) sinematik tema, CSS Grid responsive düzen.
- **Supabase (PostgreSQL & Auth)**: İlişkisel veritabanı, RLS güvenlik politikaları ve kimlik doğrulama.
- **TMDB API**: Dünyanın en büyük film veritabanından anlık veri çekimi.

## 🎯 Temel Özellikler
1. **Yapay Zeka Destekli Doğal Dil Araması**: "90'lar uzay gerilim filmleri" yazdığınızda, sistem bunu anlar, parçalar ve doğrudan filtrelenmiş sonuçları getirir.
2. **Letterboxd Sosyal Dinamikleri**: Filmleri "İzlendi", "Favori" veya "İzlenecekler" listesine ekleme. 10 üzerinden puanlama ve inceleme (review) yazma imkanı.
3. **Sinematik ve Premium UI**: Arkaya gömülü bulanık film afişleri, neon altın/cyan vurgular ve responsive (Mobil, Tablet, PC) kusursuz tasarım.
4. **Mükemmel SEO & Performans**: Semantik HTML5 standartları (article, aside, section vb.), dinamik Open Graph meta etiketleri ve optimize edilmiş Next.js resimleri.

## ⚙️ Kurulum & Çalıştırma

1. Repoyu klonlayın ve bağımlılıkları yükleyin:
   ```bash
   npm install
   ```

2. Proje dizininde `.env.local` dosyası oluşturun ve aşağıdaki değişkenleri tanımlayın:
   ```env
   TMDB_API_KEY=sizin_tmdb_api_key_niz
   TMDB_READ_ACCESS_TOKEN=sizin_tmdb_read_access_token
   NEXT_PUBLIC_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p
   
   NEXT_PUBLIC_SUPABASE_URL=sizin_supabase_proje_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sizin_supabase_anon_key
   ```

3. Supabase SQL şemalarını veritabanınıza uygulayın:
   - `supabase/schema.sql` dosyasındaki SQL kodlarını Supabase projenizin SQL editöründe çalıştırarak tabloları ve RLS (Row Level Security) kurallarını oluşturun.

4. Geliştirme sunucusunu başlatın:
   ```bash
   npm run dev
   ```

Uygulama `http://localhost:3000` adresinde çalışacaktır!

## 📌 Mimari Referanslar
Bu proje; veritabanı şeması ve sosyal dinamikler açısından [Letterboxd-Clone](https://github.com/janaiscoding/letterboxd-clone)'un Firebase altyapısının **PostgreSQL (Supabase)** üzerine modernize edilmiş halini kullanır. Arama ve keşif deneyiminde ise [Sumora](https://github.com/mahrufa-binta-ali/sumora)'nın doğal dil çözümleme mantığı temel alınarak baştan kodlanmıştır.
