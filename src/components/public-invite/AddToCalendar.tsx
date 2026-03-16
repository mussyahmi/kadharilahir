"use client";

import { CalendarPlus } from "lucide-react";
import type { Invitation } from "@/types/invitation";

interface Props {
  invitation: Invitation;
  color: string;
  language?: "ms" | "en";
}

function buildDatetime(invitation: Invitation) {
  const date = new Date(invitation.date.seconds * 1000);
  const [h, m] = (invitation.time || "12:00").split(":").map(Number);
  const start = new Date(date);
  start.setHours(h, m, 0, 0);
  const end = new Date(start);
  end.setHours(start.getHours() + 2); // default 2-hour event
  return { start, end };
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function toLocalISOString(d: Date) {
  return (
    `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}` +
    `T${pad(d.getHours())}${pad(d.getMinutes())}00`
  );
}

function eventTitle(invitation: Invitation, language?: "ms" | "en"): string {
  const base = language === "en" ? "Birthday" : "Hari Lahir";
  const milestone = invitation.birthdayAge ? ` — ${invitation.birthdayAge}` : "";
  return `${base} ${invitation.birthdayPerson}${milestone}`;
}

function googleCalendarUrl(invitation: Invitation, language?: "ms" | "en"): string {
  const { start, end } = buildDatetime(invitation);
  const title = encodeURIComponent(eventTitle(invitation, language));
  const dates = `${toLocalISOString(start)}/${toLocalISOString(end)}`;
  const details = encodeURIComponent(invitation.message || "");
  const location = encodeURIComponent(invitation.venue || "");
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
}

function downloadIcs(invitation: Invitation, language?: "ms" | "en") {
  const { start, end } = buildDatetime(invitation);
  const title = eventTitle(invitation, language);
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//KadHariLahir//EN",
    "BEGIN:VEVENT",
    `DTSTART:${toLocalISOString(start)}`,
    `DTEND:${toLocalISOString(end)}`,
    `SUMMARY:${title}`,
    `LOCATION:${invitation.venue || ""}`,
    `DESCRIPTION:${(invitation.message || "").replace(/\n/g, "\\n")}`,
    `UID:${invitation.id}@kadharilahjr`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([ics], { type: "text/calendar" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `jemputan-${invitation.slug}.ics`;
  a.click();
  URL.revokeObjectURL(url);
}

export function AddToCalendar({ invitation, color, language }: Props) {
  const label = language === "en" ? "Save to Calendar" : "Simpan ke Kalendar";
  return (
    <div className="space-y-2">
      <p className="text-xs text-center text-muted-foreground font-medium uppercase tracking-wide flex items-center justify-center gap-1.5">
        <CalendarPlus className="h-3.5 w-3.5" />
        {label}
      </p>
      <div className="grid grid-cols-2 gap-3">
        <a
          href={googleCalendarUrl(invitation, language)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold border-2 transition-opacity hover:opacity-80"
          style={{ borderColor: color, color }}
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09zM12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23zM5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84zM12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Google
        </a>
        <button
          type="button"
          onClick={() => downloadIcs(invitation, language)}
          className="flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold border-2 transition-opacity hover:opacity-80"
          style={{ borderColor: color, color }}
        >
          <svg viewBox="0 0 814 1000" className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg">
            <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-37.3-155.5-127.4C46 790.7 0 663 0 541.8c0-207.8 130.3-317.8 257.4-317.8 68.9 0 126.3 46.9 168.6 46.9 40.7 0 104.7-51.3 183.2-51.3 27.2 0 127.8 2.6 197.5 93.4zM552.5 94.8C586 56.4 608.6 3.3 608.6 0c0-.6 0-1.3-.1-1.9-43.4 1.9-95.6 28.1-126.5 62.8-28.2 31.5-55.2 83.8-55.2 137.4 0 7.1 1.3 14.3 1.9 16.5 3.2.6 8.4 1.3 13.6 1.3 38.8 0 88.3-25.4 110.2-121.3z"/>
          </svg>
          Apple
        </button>
      </div>
    </div>
  );
}
