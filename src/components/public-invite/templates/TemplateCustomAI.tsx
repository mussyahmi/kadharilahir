"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import Image from "next/image";
import type { Invitation } from "@/types/invitation";
import { RsvpForm } from "@/components/public-invite/RsvpForm";
import { RsvpList } from "@/components/public-invite/RsvpList";
import { InviteFooter } from "@/components/public-invite/InviteFooter";
import { ImageIcon, Navigation, Map, Sun, Moon } from "lucide-react";
import { AddToCalendar } from "@/components/public-invite/AddToCalendar";
import { BirthdaySong } from "@/components/public-invite/BirthdaySong";
import { EventDetails } from "@/components/public-invite/EventDetails";
import { InviteEntry } from "@/components/public-invite/InviteEntry";
import { ParticleLayer } from "@/components/public-invite/ParticleLayer";
import { RevealOnScroll } from "@/components/public-invite/RevealOnScroll";

interface Props {
  invitation: Invitation;
  preview?: boolean;
  /** Controlled dark mode (used by preview panel). Unset = self-managed. */
  darkMode?: boolean;
}

function WazeButton({ lat, lng, color }: { lat: number; lng: number; color: string }) {
  return (
    <a
      href={`https://waze.com/ul?ll=${lat},${lng}&navigate=yes`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-85"
      style={{ backgroundColor: color }}
    >
      <Navigation className="h-4 w-4" />
      Waze
    </a>
  );
}

function GoogleMapsButton({ lat, lng, color }: { lat: number; lng: number; color: string }) {
  return (
    <a
      href={`https://www.google.com/maps?q=${lat},${lng}`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-85"
      style={{ backgroundColor: color }}
    >
      <Map className="h-4 w-4" />
      Google Maps
    </a>
  );
}

const LABELS = {
  ms: {
    goToLocation: "Pergi ke Lokasi",
    rsvpTitle: "Maklum Balas Kehadiran",
    rsvpDesc: "Sila maklumkan kehadiran anda kepada tuan rumah.",
  },
  en: {
    goToLocation: "Get Directions",
    rsvpTitle: "RSVP",
    rsvpDesc: "Please let the host know if you can attend.",
  },
};

export function TemplateCustomAI({ invitation, preview, darkMode }: Props) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  // Live page: use next-themes (only after mount). Preview: use controlled darkMode prop.
  const isDark = darkMode !== undefined ? darkMode : (mounted ? resolvedTheme === "dark" : false);
  const [entered, setEntered] = useState(false);
  const hasSong = !!invitation.songId && invitation.songId !== "none";
  const lang = invitation.language ?? "ms";
  const t = LABELS[lang];

  const color = invitation.themeColor;
  const hasBg = !!invitation.backgroundImageUrl;
  const hasPhoto = !!invitation.coverPhotoUrl;

  const liveEntered = !preview && entered;
  const hasLocation = invitation.locationLat !== undefined && invitation.locationLng !== undefined;
  const offsetX = invitation.photoOffsetX ?? 0;
  const offsetY = invitation.photoOffsetY ?? 0;
  const radius = invitation.photoRadius ?? 8;
  const photoW = invitation.photoWidth ?? 75;
  const photoH = invitation.photoHeight ?? 50;
  const photoLeft = (100 - photoW) / 2 + offsetX;

  // Full width on mobile always; on desktop constrain only for live page (not preview)
  const sectionCls = preview ? "w-full" : "w-full sm:max-w-sm sm:mx-auto";

  return (
    <div className={`${darkMode ? "dark" : ""} text-foreground`}>
    <div className={`${preview ? "" : "min-h-screen"} bg-neutral-100 dark:bg-neutral-950 flex flex-col relative`}>

      {/* Dark / light toggle — live page only */}
      {!preview && darkMode === undefined && (
        <button
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          className="fixed top-4 right-4 z-[99] rounded-full p-2.5 shadow-lg border-2 transition-colors bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700"
          aria-label="Toggle dark mode"
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
      )}

      {/* Floating particles — burst on entry, ambient drift after */}
      {!preview && (
        <ParticleLayer color={color} active={entered} burst={entered} />
      )}

      {/* Card — 2:3 portrait */}
      <RevealOnScroll
        className={sectionCls}
        animation="scale-bloom 1.1s cubic-bezier(0.34,1.56,0.64,1) both"
        active={liveEntered}
      >
        <div className="relative w-full" style={{ paddingBottom: "150%" }}>

          {/* AI-generated background */}
          {hasBg ? (
            <Image
              src={invitation.backgroundImageUrl!}
              alt="Kad Jemputan"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 640px) 100vw, 384px"
            />
          ) : (
            <div
              className="absolute inset-0 flex flex-col items-center justify-center gap-3"
              style={{
                background: `linear-gradient(135deg, ${color}25 0%, ${color}08 60%, ${color}18 100%)`,
                border: `2px dashed ${color}40`,
              }}
            >
              <ImageIcon className="h-10 w-10" style={{ color: `${color}60` }} />
              <p className="text-sm text-center px-8 font-medium" style={{ color: `${color}80` }}>
                Jana gambar kad dengan AI dan muat naik sebagai latar belakang
              </p>
            </div>
          )}

          {/* Birthday person photo — background-removed PNG composited over card */}
          {hasPhoto && (
            <div
              className="absolute overflow-hidden"
              style={{
                top: `${18 + offsetY}%`,
                left: `${photoLeft}%`,
                width: `${photoW}%`,
                height: `${photoH}%`,
                borderRadius: `${radius}%`,
                ...(!preview && entered
                  ? { animation: `photo-rise 1.1s cubic-bezier(0.34,1.56,0.64,1) 0.3s both, photo-float 4s ease-in-out 1.5s infinite` }
                  : !preview ? { opacity: 0 } : {}),
              }}
            >
              <Image
                src={invitation.coverPhotoUrl}
                alt={invitation.birthdayPerson}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 75vw, 288px"
              />
            </div>
          )}

          {/* Placeholder if no photo yet */}
          {!hasPhoto && hasBg && (
            <div
              className="absolute flex items-center justify-center"
              style={{ top: `${18 + offsetY}%`, left: `${photoLeft}%`, width: `${photoW}%`, height: `${photoH}%`, borderRadius: `${radius}%` }}
            >
              <div
                className="w-full h-full rounded-2xl flex flex-col items-center justify-center gap-2"
                style={{ backgroundColor: `${color}15`, border: `2px dashed ${color}40` }}
              >
                <ImageIcon className="h-8 w-8" style={{ color: `${color}40` }} />
                <p className="text-[10px] font-medium text-center px-3" style={{ color: `${color}60` }}>
                  Muat naik gambar tanpa latar belakang
                </p>
              </div>
            </div>
          )}
        </div>
      </RevealOnScroll>

      {/* Event details strip */}
      <RevealOnScroll className={`${sectionCls} px-5 pt-5`} active={liveEntered}>
        <EventDetails invitation={invitation} color={color} />
      </RevealOnScroll>

      {/* Message / Ucapan */}
      {invitation.message && (
        <RevealOnScroll className={`${sectionCls} px-5 pt-6`} active={liveEntered}>
          <div
            className="rounded-2xl px-5 py-4 text-sm text-center leading-relaxed whitespace-pre-line"
            style={{ backgroundColor: `${color}10`, border: `1px solid ${color}25`, color }}
          >
            {invitation.message}
          </div>
        </RevealOnScroll>
      )}

      {/* Navigation buttons */}
      {hasLocation && (
        <RevealOnScroll className={`${sectionCls} px-5 pt-5`} active={liveEntered}>
          <p className="text-xs text-center text-muted-foreground mb-3 font-medium uppercase tracking-wide">{t.goToLocation}</p>
          <div className="grid grid-cols-2 gap-3">
            <WazeButton lat={invitation.locationLat!} lng={invitation.locationLng!} color={color} />
            <GoogleMapsButton lat={invitation.locationLat!} lng={invitation.locationLng!} color={color} />
          </div>
        </RevealOnScroll>
      )}

      {/* Save to Calendar */}
      <RevealOnScroll className={`${sectionCls} px-5 pt-5`} active={liveEntered}>
        <AddToCalendar invitation={invitation} color={color} language={lang} />
      </RevealOnScroll>

      {/* RSVP Section */}
      <RevealOnScroll className={`${sectionCls} px-5 py-8 space-y-8`} active={liveEntered}>
        <div className="space-y-4">
          <div className="text-center">
            <h2 className="text-base font-bold">{t.rsvpTitle}</h2>
            <p className="text-xs text-muted-foreground mt-0.5">{t.rsvpDesc}</p>
          </div>
          <RsvpForm invitationId={invitation.id} themeColor={color} slots={invitation.slots} dark={isDark} preview={preview} language={lang} eventDate={invitation.date as unknown as { seconds: number; nanoseconds: number }} />
        </div>

        {/* Guest list */}
        <div
          className="rounded-2xl p-4 space-y-3"
          style={{ backgroundColor: `${color}08`, border: `1px solid ${color}20` }}
        >
          <RsvpList
            invitationId={invitation.id}
            themeColor={color}
            slots={invitation.slots}
            preview={preview}
            language={lang}
          />
        </div>
      </RevealOnScroll>

      {!preview && (
        <BirthdaySong songId={invitation.songId} color={color} shouldPlay={entered} />
      )}

      {!preview && (
        <InviteEntry
          birthdayPerson={invitation.birthdayPerson}
          color={color}
          hasSong={hasSong}
          onEnter={() => { window.scrollTo({ top: 0, behavior: "instant" }); setEntered(true); }}
          language={lang}
        />
      )}

      <InviteFooter dark={isDark} />
    </div>
    </div>
  );
}
