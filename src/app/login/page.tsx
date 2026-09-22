import { login, signup } from './actions'
import { demoLogin } from './actions'
import Link from 'next/link'
import { Film, ArrowRight, Sparkles } from 'lucide-react'
import RobotCharacter from '@/components/RobotCharacter'

export default function LoginPage({ searchParams }: { searchParams: { error?: string } }) {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#0b0c10]">
      
      {/* Arka plan sinematik ışık efekti */}
      <div className="absolute top-1/4 left-1/4 w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-[#d4af37]/10 rounded-full blur-[100px] -z-10" />

      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col lg:flex-row items-center gap-16">
        
        {/* SOL TARAF: Tanıtım ve Animasyonlu Karakter */}
        <div className="flex-1 text-center lg:text-left space-y-8 z-10 animate-in fade-in slide-in-from-left-8 duration-1000">
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <Sparkles className="w-5 h-5 text-[#d4af37]" />
            <span className="text-sm font-bold text-gray-300 uppercase tracking-widest">Yeni Nesil Sinema Asistanı</span>
          </div>

          <h1 className="text-5xl lg:text-7xl font-black text-white uppercase tracking-tighter leading-tight">
            Film Bulmanın <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] to-purple-500">
              En Zeki Yolu
            </span>
          </h1>

          <p className="text-lg text-gray-400 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
            Ne izleyeceğine karar veremiyor musun? Ruh halini söyle, RECON yapay zeka algoritması senin için binlerce film arasından en mükemmelini saniyeler içinde bulsun.
          </p>

          <RobotCharacter />

        </div>

        {/* SAĞ TARAF: Giriş Formu */}
        <div className="w-full max-w-md animate-in fade-in slide-in-from-right-8 duration-1000 z-10">
          <div className="glass p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden backdrop-blur-xl bg-[#0b0c10]/80">
            {/* İç Işık Hüzmesi */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent opacity-50" />

            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Sisteme Giriş</h2>
              <p className="text-sm text-gray-400">Verilerini kaydetmek ve yorum yapmak için hesap oluştur.</p>
            </div>

            {searchParams?.error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
                Giriş başarısız oldu. Bilgilerini kontrol et.
              </div>
            )}

            <form className="space-y-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider" htmlFor="email">Email</label>
                <input 
                  id="email" name="email" type="email" required 
                  className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] text-white transition-all" 
                  placeholder="ornek@recon.com" 
                />
              </div>
              
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider" htmlFor="password">Şifre</label>
                <input 
                  id="password" name="password" type="password" required 
                  className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] text-white transition-all" 
                  placeholder="••••••••" 
                />
              </div>

              <div className="pt-4 flex flex-col gap-3">
                <button formAction={login} className="w-full py-3 bg-white text-black font-black uppercase tracking-wider rounded-xl hover:bg-gray-200 transition-all hover:scale-[1.02] active:scale-95 shadow-lg">
                  Giriş Yap
                </button>
                
                <button formAction={signup} className="w-full py-3 bg-transparent border border-white/20 text-white font-bold rounded-xl hover:bg-white/5 transition-all">
                  Hesap Oluştur
                </button>

                <div className="relative flex items-center py-3">
                  <div className="flex-grow border-t border-white/10"></div>
                  <span className="flex-shrink-0 mx-4 text-gray-600 text-xs uppercase tracking-widest font-bold">veya</span>
                  <div className="flex-grow border-t border-white/10"></div>
                </div>

                <button formAction={demoLogin} formNoValidate className="w-full py-3 bg-gradient-to-r from-[#d4af37]/80 to-[#b5952f]/80 text-black font-black uppercase tracking-wider rounded-xl hover:opacity-90 transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] flex items-center justify-center gap-2">
                  Demo Hesapla Hızlı Giriş <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>

          {/* Misafir Modu */}
          <div className="mt-6 text-center">
            <Link href="/explore" className="inline-flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors group px-4 py-2 rounded-full hover:bg-white/5">
              <span>Şimdilik sadece etrafa bakacağım</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}
