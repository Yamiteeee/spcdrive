'use client';

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Shield,
  FolderOpen,
  Clock3,
  CheckCircle2,
  Upload,
  Users,
  Sparkles,
  LayoutGrid,
} from "lucide-react";

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f7faf8] text-slate-900">

      {/* ================= BACKGROUND ================= */}
      <div className="absolute inset-0 -z-10 overflow-hidden">

        {/* SOFT IMAGE (less aggressive) */}
        <Image
          src="/assets/green.png"
          alt="Background"
          fill
          priority
          className="object-cover object-center scale-105 opacity-20"
        />

        {/* WARM SOFT OVERLAY (key fix) */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/90 to-[#f7faf8]" />

        {/* SOFT GREEN AMBIENT LIGHT */}
        <div className="absolute left-1/2 top-[-220px] h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-emerald-200/30 blur-3xl" />
        <div className="absolute bottom-[-200px] right-[-100px] h-[500px] w-[500px] rounded-full bg-green-200/20 blur-3xl" />

        {/* VERY LIGHT GRID */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "linear-gradient(to right,#000 1px,transparent 1px),linear-gradient(to bottom,#000 1px,transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      {/* ================= NAVBAR ================= */}
      <nav
        className={`fixed top-0 z-50 w-full transition-all duration-700 ${
          isLoaded ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        }`}
      >
        <div className="mx-auto mt-5 flex max-w-7xl items-center justify-between rounded-2xl border border-white/60 bg-white/70 px-6 py-4 shadow-lg backdrop-blur-xl">

          {/* LEFT */}
          <div className="flex items-center gap-3">

            {/* FIXED LOGO (VISIBLE ALWAYS) */}
            <div className="relative h-11 w-11 overflow-hidden rounded-2xl bg-white border border-slate-200 flex items-center justify-center">
              <Image
                src="/assets/SPCLOGO.avif"
                alt="SPC"
                fill
                className="object-contain p-2"
              />
            </div>

            <div>
              <h1 className="text-lg font-black tracking-tight text-slate-900">
                SPC <span className="text-emerald-600">Drive</span>
              </h1>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400">
                Secure File Platform
              </p>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-6">

            <Link href="#" className="hidden text-sm font-semibold text-slate-500 hover:text-slate-900 md:block">
              Features
            </Link>

            <Link href="#" className="hidden text-sm font-semibold text-slate-500 hover:text-slate-900 md:block">
              About
            </Link>

            <Link
              href="/dashboard/auth"
              className="group flex h-11 items-center justify-center rounded-xl bg-emerald-600 px-5 text-sm font-bold text-white shadow-md transition hover:bg-emerald-700"
            >
              Get Started
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </nav>

      {/* ================= HERO ================= */}
      <main className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 pt-36">

        <section
          className={`transition-all duration-1000 ${
            isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div className="grid items-center gap-20 lg:grid-cols-2">

            {/* LEFT */}
            <div>

              {/* badge */}
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white/80 px-4 py-2 text-sm font-semibold text-emerald-700 shadow-sm">
                <CheckCircle2 className="h-4 w-4" />
                Trusted by departments and institutions
              </div>

              {/* heading */}
              <h1 className="max-w-3xl text-5xl font-black leading-[0.95] tracking-tight text-slate-900 md:text-7xl">
                Simple file storage
                <span className="block text-emerald-600">
                  for everyone
                </span>
              </h1>

              {/* subtext */}
              <p className="mt-7 max-w-2xl text-lg leading-relaxed text-slate-600 md:text-xl">
                A calm, secure place to upload, organize, and access your files.
                Built to feel simple — not overwhelming.
              </p>

              {/* buttons */}
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">

                <Link
                  href="/dashboard/auth"
                  className="group flex h-14 items-center justify-center rounded-2xl bg-emerald-600 px-8 text-sm font-bold text-white shadow-lg transition hover:bg-emerald-700"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>

                <button className="flex h-14 items-center justify-center rounded-2xl border border-slate-200 bg-white px-8 text-sm font-bold text-slate-700 hover:bg-slate-50">
                  View Features
                </button>
              </div>
            </div>

            {/* RIGHT CARD */}
            <div className="relative">

              <div className="overflow-hidden rounded-[2rem] border border-white bg-white/90 p-7 shadow-xl">

                {/* HEADER */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-6">

                  <div>
                    <p className="text-sm text-slate-500">Storage Overview</p>
                    <h3 className="mt-2 text-3xl font-black text-slate-900">
                      Everything organized
                    </h3>
                  </div>

                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                    <FolderOpen className="h-8 w-8" />
                  </div>
                </div>

                {/* LIST */}
                <div className="mt-6 space-y-4">

                  {[
                    {
                      icon: <Upload className="h-5 w-5" />,
                      title: "Quick uploads",
                      desc: "Upload files in seconds.",
                    },
                    {
                      icon: <Shield className="h-5 w-5" />,
                      title: "Secure access",
                      desc: "Only authorized users.",
                    },
                    {
                      icon: <Users className="h-5 w-5" />,
                      title: "Simple sharing",
                      desc: "Share across teams easily.",
                    },
                    {
                      icon: <Clock3 className="h-5 w-5" />,
                      title: "Reliable backups",
                      desc: "Your files stay safe.",
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex gap-4 rounded-2xl bg-slate-50 p-5 hover:bg-emerald-50"
                    >
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-emerald-600">
                        {item.icon}
                      </div>

                      <div>
                        <p className="font-semibold text-slate-900">{item.title}</p>
                        <p className="text-sm text-slate-500">{item.desc}</p>
                      </div>
                    </div>
                  ))}

                </div>

                {/* FOOT NOTE */}
                <div className="mt-6 rounded-2xl bg-emerald-50 p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white">
                      <Sparkles className="h-5 w-5" />
                    </div>

                    <div>
                      <p className="font-semibold text-slate-900">Clean & simple</p>
                      <p className="text-sm text-slate-500">
                        Built for stress-free file management.
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
      <footer className="border-t border-slate-200 bg-white/70 py-10 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-6 md:flex-row">

          <div className="flex items-center gap-3">

            <div className="relative h-9 w-9 overflow-hidden rounded-xl bg-white border border-slate-200">
              <Image
                src="/assets/SPCLOGO.avif"
                alt="SPC"
                fill
                className="object-contain p-2"
              />
            </div>

            <div>
              <h3 className="text-sm font-black text-slate-900">
                SPC <span className="text-emerald-600">Drive</span>
              </h3>
              <p className="text-xs text-slate-500">
                Secure File Platform
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-500">
            © 2026 SPC DRIVE. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}