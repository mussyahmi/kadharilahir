"use client";

import { useEffect, useState } from "react";

interface Props {
  birthdayPerson: string;
  color: string;
  hasSong: boolean;
  onEnter: () => void;
  language?: "ms" | "en";
}

export function InviteEntry({ birthdayPerson, color, hasSong, onEnter, language }: Props) {
  const label = language === "en" ? "Birthday Invitation" : "Jemputan Hari Lahir";
  const openBtn = language === "en" ? "Open Invitation" : "Buka Jemputan";
  const musicNote = language === "en" ? "Music will play" : "Muzik akan dimainkan";
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (fading) {
      const t = setTimeout(() => setVisible(false), 700);
      return () => clearTimeout(t);
    }
  }, [fading]);

  const enter = () => {
    setFading(true);
    onEnter();
  };

  if (!visible) return null;

  return (
    <div
      onClick={enter}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center cursor-pointer select-none overflow-hidden"
      style={{
        background: "#0a0a0a",
        opacity: fading ? 0 : 1,
        transition: "opacity 0.7s ease",
        pointerEvents: fading ? "none" : "auto",
      }}
    >
      {/* Soft radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 80% 60% at 50% 50%, ${color}22 0%, transparent 70%)`,
        }}
      />

      {/* Floating particles — mixed shapes */}
      {(["✦","♥","✦","circle","♥","circle","✦","♥"] as const).map((shape, i) => (
        shape === "circle" ? (
          <div
            key={i}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 5 + (i % 3) * 4,
              height: 5 + (i % 3) * 4,
              backgroundColor: color,
              opacity: 0.25 + (i % 3) * 0.15,
              left: `${6 + i * 12}%`,
              top: `${12 + (i % 3) * 28}%`,
              animation: `float-particle ${3 + i * 0.5}s ease-in-out infinite`,
              animationDelay: `${i * 0.35}s`,
            }}
          />
        ) : (
          <span
            key={i}
            className="absolute pointer-events-none select-none"
            style={{
              fontSize: 8 + (i % 3) * 5,
              color,
              opacity: 0.3 + (i % 3) * 0.15,
              left: `${6 + i * 12}%`,
              top: `${12 + (i % 3) * 28}%`,
              lineHeight: 1,
              animation: `float-particle ${3 + i * 0.5}s ease-in-out infinite`,
              animationDelay: `${i * 0.35}s`,
            }}
          >
            {shape}
          </span>
        )
      ))}

      {/* Content */}
      <div className="relative flex flex-col items-center px-8 text-center">
        {/* Label */}
        <p
          className="text-xs font-semibold tracking-[0.25em] uppercase mb-3"
          style={{ color: `${color}99` }}
        >
          {label}
        </p>

        {/* Divider line */}
        <div className="flex items-center gap-3 mb-4 w-full max-w-xs">
          <div className="flex-1 h-px" style={{ backgroundColor: `${color}40` }} />
          <div className="w-1 h-1 rounded-full" style={{ backgroundColor: color }} />
          <div className="flex-1 h-px" style={{ backgroundColor: `${color}40` }} />
        </div>

        {/* Name */}
        <h1
          className="text-2xl font-bold leading-tight mb-1"
          style={{ color: "#ffffff" }}
        >
          {birthdayPerson}
        </h1>

        {/* Divider line */}
        <div className="flex items-center gap-3 mt-4 mb-8 w-full max-w-xs">
          <div className="flex-1 h-px" style={{ backgroundColor: `${color}40` }} />
          <div className="w-1 h-1 rounded-full" style={{ backgroundColor: color }} />
          <div className="flex-1 h-px" style={{ backgroundColor: `${color}40` }} />
        </div>

        {/* CTA button */}
        <button
          className="rounded-full px-10 py-3.5 text-sm font-bold text-white tracking-wide"
          style={{
            backgroundColor: color,
            boxShadow: `0 0 40px ${color}50, 0 4px 20px rgba(0,0,0,0.4)`,
            animation: "pulse-glow 2.5s ease-in-out infinite",
          }}
        >
          {openBtn}
        </button>

        {hasSong && (
          <p className="mt-3 text-xs" style={{ color: `${color}60` }}>
            {musicNote}
          </p>
        )}
      </div>

      <style>{`
        @keyframes float-particle {
          0%, 100% { transform: translateY(0); opacity: 0.2; }
          50% { transform: translateY(-20px); opacity: 0.5; }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 40px ${color}50, 0 4px 20px rgba(0,0,0,0.4); }
          50% { box-shadow: 0 0 60px ${color}80, 0 4px 24px rgba(0,0,0,0.5); }
        }
      `}</style>
    </div>
  );
}
