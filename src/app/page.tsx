import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 font-sans text-zinc-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 flex items-center justify-between px-8 py-5 bg-white/80 backdrop-blur-md border-b border-zinc-200">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
          </div>
          <span className="font-bold tracking-tighter text-xl text-zinc-950">SPC DRIVE</span>
        </div>
        <div className="flex items-center gap-6">
          <Link 
            href="/dashboard/auth" 
            className="text-sm font-bold text-zinc-500 hover:text-emerald-600 transition-colors"
          >
            System Status
          </Link>
          <Link 
            href="/dashboard/auth" 
            className="px-5 py-2.5 bg-emerald-500 text-white text-sm font-bold rounded-xl hover:bg-emerald-600 transition-all shadow-md shadow-emerald-100"
          >
            Access Console
          </Link>
        </div>
      </nav>

      <main className="flex-1 pt-32 pb-20 px-6 max-w-6xl mx-auto w-full">
        {/* Hero Section */}
        <section className="flex flex-col items-center text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-zinc-200 shadow-sm text-emerald-600 text-[10px] font-black uppercase tracking-[0.2em]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Core Protocol v1.0.4 Active
          </div>

          <h1 className="text-6xl md:text-7xl font-black tracking-tight text-zinc-950 leading-[1.05]">
            Modular Storage for <br />
            <span className="text-emerald-500 italic">Advanced Architects.</span>
          </h1>
          
          <p className="max-w-2xl text-xl leading-relaxed text-zinc-500 font-medium">
            A high-performance Stored Program Control interface designed for 
            seamless file management, secure node registration, and real-time system monitoring.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
            <Link
              href="/dashboard/auth"
              className="group flex h-16 items-center justify-center rounded-2xl bg-zinc-950 px-10 text-white font-bold transition-all hover:bg-emerald-600 hover:shadow-2xl hover:shadow-emerald-200 active:scale-95 w-full sm:w-auto"
            >
              Launch Console
              <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="ArrowRightIcon" />
                <path d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <a
              href="https://github.com"
              className="flex h-16 items-center justify-center rounded-2xl border-2 border-zinc-200 bg-white px-10 font-bold text-zinc-900 transition-all hover:border-emerald-500 hover:text-emerald-600 active:scale-95 w-full sm:w-auto"
            >
              System Docs
            </a>
          </div>
        </section>

        {/* Feature Grid (Bento Style) */}
        <section className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-zinc-200 p-8 rounded-[2.5rem] shadow-sm space-y-4">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <h3 className="font-bold text-xl">Extreme Speed</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">0.2ms latency in file retrieval through optimized SPC packet routing logic.</p>
          </div>

          <div className="bg-emerald-500 p-8 rounded-[2.5rem] shadow-xl shadow-emerald-100 text-white space-y-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            </div>
            <h3 className="font-bold text-xl">Military Security</h3>
            <p className="text-emerald-50 font-medium text-sm leading-relaxed">End-to-end encryption for all storage bins with Supabase Auth integration.</p>
          </div>

          <div className="bg-white border border-zinc-200 p-8 rounded-[2.5rem] shadow-sm space-y-4">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            </div>
            <h3 className="font-bold text-xl">Modular Bins</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">Dynamic file architecture that scales perfectly with your development needs.</p>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t border-zinc-200 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-8 text-xs font-bold text-zinc-400 uppercase tracking-widest">
            <a href="#" className="hover:text-emerald-500 transition-colors">Privacy</a>
            <a href="#" className="hover:text-emerald-500 transition-colors">Protocol</a>
            <a href="#" className="hover:text-emerald-500 transition-colors">Support</a>
          </div>
          <p className="text-[10px] text-zinc-300 font-bold uppercase tracking-[0.3em]">
            © 2026 SPC DRIVE • Engineered in San Pablo City
          </p>
        </div>
      </footer>
    </div>
  );
}