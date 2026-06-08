'use client';

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight, Shield, FolderOpen, Clock3,
  CheckCircle2, Upload, Users, Sparkles,
} from "lucide-react";

// Hook & Components
import { Button } from "@/components/ui/Button";
import { useSPCTheme } from "@/providers/ThemeProvider";

const FEATURES = [
  { icon: <Upload className="h-5 w-5" />, title: "Quick uploads", desc: "Upload files in seconds." },
  { icon: <Shield className="h-5 w-5" />, title: "Secure access", desc: "Only authorized users." },
  { icon: <Users className="h-5 w-5" />, title: "Simple sharing", desc: "Share across teams easily." },
  { icon: <Clock3 className="h-5 w-5" />, title: "Reliable backups", desc: "Your files stay safe." },
];

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const { colors, radius } = useSPCTheme(); // Accessing Central Theme

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div 
      className="relative min-h-screen overflow-hidden transition-colors duration-500"
      style={{ backgroundColor: colors.background, color: colors.textMain }}
    >
      
      {/* ================= BACKGROUND ================= */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <Image
          src="/assets/green.png"
          alt="Background"
          fill
          priority
          className="object-cover object-center scale-105 opacity-20"
        />
          <div 
        className="absolute inset-0 b-gradient-to-b from-white/80 via-white/90" 
        style={{ 
          // This tells CSS to fade into your provider's background color
          backgroundImage: `linear-gradient(to bottom, rgba(255,255,255,0.8), rgba(255,255,255,0.9), ${colors.background})` 
        }}
      />
        
        {/* Animated Glows - Syncing with Primary Light */}
        <div 
          className="absolute left-1/2 -top-56 h-150 w-150 -translate-x-1/2 rounded-full blur-3xl opacity-50" 
          style={{ backgroundColor: colors.primaryLight }}
        />
        <div 
          className="absolute -bottom-50 -right-25 h-125 w-125 rounded-full blur-3xl opacity-30" 
          style={{ backgroundColor: colors.primaryLight }}
        />
        
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(to right, ${colors.textMain} 1px, transparent 1px), linear-gradient(to bottom, ${colors.textMain} 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* ================= NAVBAR ================= */}
      <nav className={`fixed top-0 z-50 w-full transition-all duration-700 ${isLoaded ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}`}>
        <div 
          className="mx-auto mt-5 flex max-w-7xl items-center justify-between px-6 py-4 shadow-lg backdrop-blur-xl border"
          style={{ 
            borderRadius: radius.base, 
            backgroundColor: `${colors.card}b3`, // 70% opacity card color
            borderColor: colors.border 
          }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="relative h-11 w-11 overflow-hidden flex items-center justify-center shadow-sm border"
              style={{ borderRadius: radius.base, backgroundColor: colors.card, borderColor: colors.border }}
            >
              <Image src="/assets/SPCLOGO.avif" alt="SPC" fill className="object-contain p-2" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight" style={{ color: colors.textMain }}>
                SPC <span style={{ color: colors.primary }}>Drive</span>
              </h1>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em]" style={{ color: colors.textMuted }}>Secure File Platform</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/dashboard/auth">
              <Button size="default" rightIcon={<ArrowRight className="h-4 w-4" />}>
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ================= HERO ================= */}
      <main className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 pt-36 pb-20">
        <section className={`transition-all duration-1000 ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
          <div className="grid items-center gap-20 lg:grid-cols-2">

            {/* LEFT CONTENT */}
            <div>
              <div 
                className="mb-7 inline-flex items-center gap-2 border px-4 py-2 text-sm font-semibold shadow-sm rounded-full"
                style={{ backgroundColor: colors.card, borderColor: colors.primaryLight, color: colors.primaryDark }}
              >
                <CheckCircle2 className="h-4 w-4" />
                Trusted by departments and institutions
              </div>

              <h1 className="max-w-3xl text-5xl font-black leading-[0.95] tracking-tight md:text-7xl" style={{ color: colors.textMain }}>
                Simple file storage <span className="block" style={{ color: colors.primary }}>for everyone</span>
              </h1>

              <p className="mt-7 max-w-2xl text-lg leading-relaxed md:text-xl font-medium" style={{ color: colors.textMuted }}>
                A calm, secure place to upload, organize, and access your files. Built to feel simple — not overwhelming.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link href="/dashboard/auth" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full" rightIcon={<ArrowRight className="h-4 w-4" />}>
                    Enter Platform
                  </Button>
                </Link>
               <Link href="/dashboard/updates" passHref className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                View Updates
              </Button>
            </Link>
              </div>
            </div>

            {/* RIGHT PREVIEW CARD */}
            <div className="relative">
              <div 
                className="overflow-hidden border p-7 shadow-2xl"
                style={{ borderRadius: radius.large, backgroundColor: `${colors.card}e6`, borderColor: colors.border }}
              >
                <div className="flex items-center justify-between border-b pb-6" style={{ borderColor: colors.border }}>
                  <div>
                    <p className="text-sm font-bold uppercase tracking-widest" style={{ color: colors.textMuted }}>Storage Overview</p>
                    <h3 className="mt-1 text-3xl font-black" style={{ color: colors.textMain }}>Everything organized</h3>
                  </div>
                  <div 
                    className="flex h-16 w-16 items-center justify-center rounded-2xl"
                    style={{ backgroundColor: colors.primaryLight, color: colors.primary }}
                  >
                    <FolderOpen className="h-8 w-8" />
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  {FEATURES.map((item, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ x: 8 }}
                      className="flex gap-4 rounded-2xl p-4 border transition-all cursor-default"
                      style={{ backgroundColor: `${colors.background}80`, borderColor: 'transparent' }}
                    >
                      <div 
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl shadow-sm"
                        style={{ backgroundColor: colors.card, color: colors.primary }}
                      >
                        {item.icon}
                      </div>
                      <div>
                        <p className="font-bold" style={{ color: colors.textMain }}>{item.title}</p>
                        <p className="text-sm font-medium" style={{ color: colors.textMuted }}>{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div 
                  className="mt-6 p-5 text-white shadow-lg shadow-emerald-600/10 rounded-2xl"
                  style={{ backgroundColor: colors.primary }}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold">Clean & simple</p>
                      <p className="text-sm opacity-90 font-medium" style={{ color: colors.primaryLight }}>
                        Built for stress-free management.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="border-t py-10 backdrop-blur-xl" style={{ borderColor: colors.border, backgroundColor: `${colors.card}b3` }}>
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-6 md:flex-row text-center md:text-left">
          <div className="flex items-center gap-3">
            <div 
              className="relative h-9 w-9 overflow-hidden border"
              style={{ borderRadius: radius.base, backgroundColor: colors.card, borderColor: colors.border }}
            >
              <Image src="/assets/SPCLOGO.avif" alt="SPC" fill className="object-contain p-2" />
            </div>
            <div>
              <h3 className="text-sm font-black" style={{ color: colors.textMain }}>
                SPC <span style={{ color: colors.primary }}>Drive</span>
              </h3>
              <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: colors.textMuted }}>Secure File Platform</p>
            </div>
          </div>
          <p className="text-xs font-bold uppercase tracking-wide" style={{ color: colors.textMuted }}>
            © 2026 SPC DRIVE • Powered by Security
          </p>
        </div>
      </footer>
    </div>
  );
}