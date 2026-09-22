import Link from 'next/link';

export const metadata = {
  title: 'Ruh Hali | RECON',
  description: 'Bugün nasıl hissediyorsun? Ruh haline en uygun filmleri keşfet.',
};

const moods = [
  { id: 'eglenceli', emoji: '😊', label: 'Eğlenceli', desc: 'Kahkaha atmak ve keyiflenmek istiyorum', query: 'komedi eğlenceli', bg: 'from-yellow-500/20 to-orange-500/5', border: 'border-yellow-500/30', hover: 'hover:border-yellow-500 hover:shadow-[0_0_30px_rgba(234,179,8,0.3)]' },
  { id: 'duygusal', emoji: '😢', label: 'Duygusal', desc: 'Biraz ağlamak ve derin hissetmek istiyorum', query: 'dram hüzünlü ağlatacak', bg: 'from-blue-500/20 to-cyan-500/5', border: 'border-blue-500/30', hover: 'hover:border-blue-500 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]' },
  { id: 'dusundurucu', emoji: '🧠', label: 'Düşündürücü', desc: 'Felsefi ve derin anlamları olan bir şeyler', query: 'belgesel tarih biyografi', bg: 'from-emerald-500/20 to-teal-500/5', border: 'border-emerald-500/30', hover: 'hover:border-emerald-500 hover:shadow-[0_0_30px_rgba(16,185,129,0.3)]' },
  { id: 'beyin-yakan', emoji: '🤯', label: 'Beyin Yakan', desc: 'Sonu şaşırtan, karmaşık olay örgüleri', query: 'gizem bilim kurgu kafa yoran', bg: 'from-purple-500/20 to-fuchsia-500/5', border: 'border-purple-500/30', hover: 'hover:border-purple-500 hover:shadow-[0_0_30px_rgba(168,85,247,0.3)]' },
  { id: 'gerilimli', emoji: '😨', label: 'Gerilimli', desc: 'Tırnaklarımı yedirtecek bir heyecan', query: 'gerilim korku korkutucu', bg: 'from-red-500/20 to-rose-500/5', border: 'border-red-500/30', hover: 'hover:border-red-500 hover:shadow-[0_0_30px_rgba(239,68,68,0.3)]' },
  { id: 'romantik', emoji: '❤️', label: 'Romantik', desc: 'Aşk, tutku ve romantizm', query: 'romantik aşk sevgiliyle', bg: 'from-pink-500/20 to-rose-400/5', border: 'border-pink-500/30', hover: 'hover:border-pink-500 hover:shadow-[0_0_30px_rgba(236,72,153,0.3)]' },
  { id: 'sakin', emoji: '😌', label: 'Sakin', desc: 'Kafa dinlemelik, yavaş tempolu filmler', query: 'aile sakin', bg: 'from-indigo-500/20 to-blue-500/5', border: 'border-indigo-500/30', hover: 'hover:border-indigo-500 hover:shadow-[0_0_30px_rgba(99,102,241,0.3)]' },
  { id: 'heyecanli', emoji: '🔥', label: 'Heyecanlı', desc: 'Bol aksiyon, patlama ve yüksek tempo', query: 'aksiyon macera tempolu', bg: 'from-orange-500/20 to-red-500/5', border: 'border-orange-500/30', hover: 'hover:border-orange-500 hover:shadow-[0_0_30px_rgba(249,115,22,0.3)]' },
];

export default function MoodPage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center py-20 px-4">
      <div className="text-center mb-16 space-y-4">
        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter">
          Bugün Nasıl Hissediyorsun?
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Sadece ruh halini seç, yapay zekamız şu anki hissiyatına en uygun sinematik yolculuğu senin için hazırlasın.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto w-full">
        {moods.map((mood) => (
          <Link 
            key={mood.id} 
            href={`/search?q=${encodeURIComponent(mood.query)}`}
            className={`group relative overflow-hidden rounded-3xl p-8 transition-all duration-500 bg-gradient-to-br ${mood.bg} border ${mood.border} ${mood.hover} backdrop-blur-sm`}
          >
            <div className="flex flex-col items-center text-center space-y-4 relative z-10">
              <span className="text-6xl transform group-hover:scale-110 transition-transform duration-300 inline-block">
                {mood.emoji}
              </span>
              <h3 className="text-2xl font-bold text-white tracking-wide">
                {mood.label}
              </h3>
              <p className="text-sm text-gray-300 font-medium">
                {mood.desc}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
