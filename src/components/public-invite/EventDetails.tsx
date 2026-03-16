"use client";

import { useState } from "react";
import { Calendar, Clock, MapPin, Shirt, Check, Copy } from "lucide-react";
import type { Invitation } from "@/types/invitation";
import { formatTime } from "@/lib/utils";

const DAYS_MS = ["Ahad", "Isnin", "Selasa", "Rabu", "Khamis", "Jumaat", "Sabtu"];
const DAYS_EN = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS_MS = [
  "Januari", "Februari", "Mac", "April", "Mei", "Jun",
  "Julai", "Ogos", "September", "Oktober", "November", "Disember",
];
const MONTHS_EN = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function formatDate(seconds: number, lang: "ms" | "en"): { day: string; date: string } {
  const d = new Date(seconds * 1000);
  return {
    day: (lang === "en" ? DAYS_EN : DAYS_MS)[d.getDay()],
    date: `${d.getDate()} ${(lang === "en" ? MONTHS_EN : MONTHS_MS)[d.getMonth()]} ${d.getFullYear()}`,
  };
}

const T = {
  ms: {
    header: "Butiran Majlis",
    timeSlots: "Slot Masa",
    copyAddress: "Salin alamat",
    dressCode: "Kod Pakaian",
  },
  en: {
    header: "Event Details",
    timeSlots: "Time Slots",
    copyAddress: "Copy address",
    dressCode: "Dress Code",
  },
};

interface Props {
  invitation: Invitation;
  color: string;
}

function Row({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}

export function EventDetails({ invitation, color }: Props) {
  const [copied, setCopied] = useState(false);
  const lang = invitation.language ?? "ms";
  const t = T[lang];
  const { day, date } = formatDate(invitation.date.seconds, lang);
  const hasSlots = invitation.slots && invitation.slots.length > 0;

  const copyVenue = async () => {
    await navigator.clipboard.writeText(invitation.venue);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ border: `1px solid ${color}20` }}
    >
      {/* Header */}
      <div
        className="px-5 py-3 text-xs font-semibold uppercase tracking-widest text-center"
        style={{ backgroundColor: `${color}15`, color }}
      >
        {t.header}
      </div>

      <div className="px-5 py-4 space-y-4">

        {/* Date */}
        <Row icon={<Calendar className="h-4 w-4" style={{ color }} />}>
          <p className="text-sm font-semibold">{date}</p>
          <p className="text-xs text-muted-foreground">{day}</p>
        </Row>

        {/* Time — slots or single time */}
        {hasSlots ? (
          <Row icon={<Clock className="h-4 w-4" style={{ color }} />}>
            <p className="text-xs text-muted-foreground mb-2">{t.timeSlots}</p>
            <div className="space-y-2">
              {invitation.slots!.map((slot) => (
                <div
                  key={slot.id}
                  className="rounded-xl px-3 py-2 flex items-center justify-between"
                  style={{ backgroundColor: `${color}10`, border: `1px solid ${color}20` }}
                >
                  <span className="text-sm font-medium">{slot.label}</span>
                  <span className="text-xs font-medium" style={{ color }}>
                    {formatTime(slot.startTime)} – {formatTime(slot.endTime)}
                  </span>
                </div>
              ))}
            </div>
          </Row>
        ) : invitation.time ? (
          <Row icon={<Clock className="h-4 w-4" style={{ color }} />}>
            <p className="text-sm font-semibold">{formatTime(invitation.time)}</p>
          </Row>
        ) : null}

        {/* Venue */}
        {invitation.venue && (
          <Row icon={<MapPin className="h-4 w-4 mt-0.5" style={{ color }} />}>
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm leading-relaxed">{invitation.venue}</p>
              <button
                type="button"
                onClick={copyVenue}
                className="shrink-0 rounded-lg p-1.5 transition-colors text-muted-foreground hover:text-foreground"
                title={t.copyAddress}
              >
                {copied
                  ? <Check className="h-3.5 w-3.5 text-green-500" />
                  : <Copy className="h-3.5 w-3.5" />
                }
              </button>
            </div>
          </Row>
        )}

        {/* Dress code */}
        {invitation.dressCode && (
          <Row icon={<Shirt className="h-4 w-4" style={{ color }} />}>
            <div className="flex items-center gap-2">
              <span
                className="text-xs font-medium px-2.5 py-1 rounded-full"
                style={{ backgroundColor: `${color}15`, color }}
              >
                {invitation.dressCode}
              </span>
            </div>
          </Row>
        )}

      </div>
    </div>
  );
}
