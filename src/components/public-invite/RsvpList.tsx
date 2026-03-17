"use client";

import { useEffect, useState } from "react";
import { subscribeToRsvps } from "@/lib/firestore";
import type { Rsvp, Slot } from "@/types/invitation";
import { CheckCircle2, XCircle, Users } from "lucide-react";
import { Timestamp } from "firebase/firestore";

const T = {
  ms: { header: "Senarai Tetamu", attending: "hadir", notAttending: "tidak dapat hadir", totalPax: "jumlah pax" },
  en: { header: "Guest List", attending: "attending", notAttending: "can't make it", totalPax: "total pax" },
};

interface Props {
  invitationId: string;
  themeColor: string;
  slots?: Slot[];
  preview?: boolean;
  language?: "ms" | "en";
}

const DUMMY_RSVPS: Rsvp[] = [
  { id: "p1", guestName: "Ahmad bin Abu Bakar", attending: true, pax: 2, message: "Tahniah! Semoga majlis berjalan lancar!", slotId: undefined, submittedAt: Timestamp.now() },
  { id: "p2", guestName: "Siti Hajar", attending: true, pax: 1, message: "", slotId: undefined, submittedAt: Timestamp.now() },
  { id: "p3", guestName: "Razif Hakim", attending: false, pax: 0, message: "Maaf, tidak dapat hadir kali ini.", slotId: undefined, submittedAt: Timestamp.now() },
];

export function RsvpList({ invitationId, themeColor, slots, preview, language }: Props) {
  const t = T[language ?? "ms"];
  const [rsvps, setRsvps] = useState<Rsvp[]>([]);

  useEffect(() => {
    if (preview) return;
    return subscribeToRsvps(invitationId, setRsvps);
  }, [invitationId, preview]);

  const data = preview
    ? DUMMY_RSVPS.map((r, i) => ({ ...r, slotId: slots?.[i % (slots.length || 1)]?.id }))
    : rsvps;

  const attending = data.filter((r) => r.attending);
  const notAttending = data.filter((r) => !r.attending);
  const totalPax = attending.reduce((sum, r) => sum + (r.pax || 1), 0);

  if (data.length === 0) return null;

  const slotLabel = (slotId?: string) => {
    if (!slotId || !slots) return null;
    return slots.find((s) => s.id === slotId)?.label ?? null;
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div
          className="h-8 w-8 rounded-full flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${themeColor}20` }}
        >
          <Users className="h-4 w-4" style={{ color: themeColor }} />
        </div>
        <div>
          <p className="text-sm font-semibold">{t.header}</p>
          <p className="text-xs text-muted-foreground">
            {attending.length} {t.attending} · {notAttending.length} {t.notAttending} · {totalPax} {t.totalPax}
          </p>
        </div>
      </div>

      {/* Attending */}
      {attending.length > 0 && (
        <div className="space-y-1.5">
          {attending.map((r) => (
            <div
              key={r.id}
              className="rounded-lg px-3 py-2 text-sm space-y-1"
              style={{ backgroundColor: `${themeColor}10`, border: `1px solid ${themeColor}25` }}
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0" style={{ color: themeColor }} />
                <span className="font-medium flex-1 min-w-0 truncate">{r.guestName}</span>
                {slotLabel(r.slotId) && (
                  <span
                    className="text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0 whitespace-nowrap"
                    style={{ backgroundColor: `${themeColor}20`, color: themeColor }}
                  >
                    {slotLabel(r.slotId)}
                  </span>
                )}
              </div>
              {r.message && (
                <p className="text-xs text-muted-foreground pl-5 italic">&ldquo;{r.message}&rdquo;</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Not attending */}
      {notAttending.length > 0 && (
        <div className="space-y-1.5">
          {notAttending.map((r) => (
            <div
              key={r.id}
              className="rounded-lg px-3 py-2 text-sm bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900 space-y-1"
            >
              <div className="flex items-center gap-2">
                <XCircle className="h-3.5 w-3.5 shrink-0 text-red-400" />
                <span className="text-muted-foreground flex-1 min-w-0 truncate">{r.guestName}</span>
              </div>
              {r.message && (
                <p className="text-xs text-muted-foreground pl-5 italic">&ldquo;{r.message}&rdquo;</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
