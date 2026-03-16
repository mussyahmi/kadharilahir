"use client";

import Image from "next/image";
import { Sparkles, Check } from "lucide-react";
import { HeroAuthButtons } from "@/components/landing/HeroAuthButtons";

const PERKS = ["Mudah digunakan", "Tanpa kemahiran teknikal", "Sedia dalam minit"];

const FLOATS = [
  { shape: "✦", top: "12%", left: "8%", size: 18, delay: 0, dur: 3.5 },
  { shape: "♥", top: "22%", left: "91%", size: 14, delay: 0.8, dur: 4 },
  { shape: "✦", top: "76%", left: "5%", size: 12, delay: 1.2, dur: 3.8 },
  { shape: "♥", top: "88%", left: "22%", size: 16, delay: 1.6, dur: 3.2 },
  { shape: "✦", top: "50%", left: "96%", size: 11, delay: 2, dur: 3.9 },
];

function MockCard() {
  return (
    <div
      className="relative w-full max-w-[260px] mx-auto select-none"
      style={{ animation: "hero-bob 5s ease-in-out infinite" }}
    >
      {/* Glow behind */}
      <div
        className="absolute inset-0 rounded-3xl blur-3xl opacity-40 -z-10 scale-110"
        style={{ background: "linear-gradient(135deg, #ec4899 0%, #a855f7 100%)" }}
      />

      {/* Real screenshot */}
      <div className="rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10">
        <Image
          src="/hero-preview.png"
          alt="Contoh kad jemputan hari lahir"
          width={520}
          height={900}
          className="w-full h-auto"
          priority
        />
      </div>

      {/* AI Design badge */}
      <div
        className="absolute -top-3 -right-4 rounded-full px-3 py-1 text-[11px] font-bold text-white shadow-lg whitespace-nowrap"
        style={{
          background: "linear-gradient(135deg, #f59e0b, #ef4444)",
          animation: "hero-badge 3.2s ease-in-out infinite",
        }}
      >
        ✦ AI Design
      </div>

      {/* RSVP badge */}
      <div
        className="absolute -bottom-2 -left-4 rounded-full px-3 py-1 text-[11px] font-bold text-white shadow-lg whitespace-nowrap"
        style={{ background: "linear-gradient(135deg, #10b981, #3b82f6)" }}
      >
        12 hadir
      </div>
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-16 md:py-24 px-4">
      {/* Background blobs */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-pink-300/20 dark:bg-pink-900/20 rounded-full blur-3xl -translate-y-1/2" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-300/20 dark:bg-purple-900/20 rounded-full blur-3xl translate-y-1/3" />
        <div className="absolute top-1/2 left-0 w-[300px] h-[300px] bg-blue-200/15 dark:bg-blue-900/10 rounded-full blur-3xl -translate-x-1/2" />
      </div>

      {/* Floating symbols */}
      {FLOATS.map((f, i) => (
        <span
          key={i}
          className="absolute pointer-events-none select-none text-pink-400/25 dark:text-pink-400/20 hidden lg:block"
          style={{
            top: f.top,
            left: f.left,
            fontSize: f.size,
            animation: `hero-bob ${f.dur}s ease-in-out ${f.delay}s infinite`,
          }}
        >
          {f.shape}
        </span>
      ))}

      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">

          {/* Text */}
          <div className="order-2 md:order-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-pink-200 dark:border-pink-800 bg-pink-50 dark:bg-pink-950/50 px-4 py-1.5 text-sm text-pink-600 dark:text-pink-300 font-medium mb-6">
              <Sparkles className="h-3.5 w-3.5" />
              Kad Jemputan Hari Lahir Digital
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-[3.4rem] font-bold leading-tight mb-5">
              Jemputan Hari Lahir{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
                yang Memukau
              </span>
            </h1>

            <p className="text-base md:text-lg text-muted-foreground mb-8 leading-relaxed max-w-lg">
              Reka bentuk AI, muzik, animasi masuk, RSVP langsung — semua dalam satu pautan yang boleh dikongsi melalui WhatsApp.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start mb-7">
              <HeroAuthButtons />
            </div>

            <div className="flex flex-wrap gap-x-5 gap-y-2 justify-center md:justify-start">
              {PERKS.map((p) => (
                <span key={p} className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Check className="h-3.5 w-3.5 text-green-500 shrink-0" />
                  {p}
                </span>
              ))}
            </div>
          </div>

          {/* Mock card */}
          <div className="order-1 md:order-2 flex justify-center md:justify-end py-6">
            <MockCard />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes hero-bob {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-14px); }
        }
        @keyframes hero-badge {
          0%, 100% { transform: rotate(-4deg) scale(1); }
          50% { transform: rotate(4deg) scale(1.06); }
        }
      `}</style>
    </section>
  );
}
