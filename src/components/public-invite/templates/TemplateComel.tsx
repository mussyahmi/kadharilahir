import Image from "next/image";
import type { Invitation } from "@/types/invitation";
import { formatDate, formatTime } from "@/lib/utils";
import { MapPin, Clock, Shirt, Users, Cake } from "lucide-react";
import { RsvpForm } from "@/components/public-invite/RsvpForm";
import { InviteFooter } from "@/components/public-invite/InviteFooter";

interface Props {
  invitation: Invitation;
  preview?: boolean;
}

export function TemplateComel({ invitation, preview }: Props) {
  const eventDate = invitation.date?.toDate ? invitation.date.toDate() : new Date();
  const hasSlots = invitation.slots && invitation.slots.length > 0;
  const color = invitation.themeColor;

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center py-10 px-4"
      style={{ background: `linear-gradient(135deg, ${color}25 0%, ${color}08 50%, ${color}18 100%)` }}
    >
      {/* Card */}
      <div className="w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl bg-white dark:bg-neutral-900">

        {/* Top strip */}
        <div className="h-2 w-full" style={{ backgroundColor: color }} />

        {/* Dot pattern header */}
        <div
          className="h-10 w-full flex items-center justify-center"
          style={{ backgroundColor: `${color}12` }}
        >
          <div className="flex gap-2">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="h-2 w-2 rounded-full" style={{ backgroundColor: `${color}${i % 2 === 0 ? "80" : "40"}` }} />
            ))}
          </div>
        </div>

        {/* Photo */}
        <div
          className="mx-5 mt-1 rounded-2xl overflow-hidden shadow-md"
          style={{ border: `3px solid ${color}50` }}
        >
          {invitation.coverPhotoUrl ? (
            <div className="relative w-full" style={{ paddingBottom: "100%" }}>
              <Image
                src={invitation.coverPhotoUrl}
                alt={invitation.birthdayPerson}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 640px) 100vw, 400px"
              />
            </div>
          ) : (
            <div
              className="w-full flex items-center justify-center"
              style={{ paddingBottom: "100%", position: "relative", backgroundColor: `${color}15` }}
            >
              <Cake className="absolute inset-0 m-auto h-16 w-16" style={{ color: `${color}60` }} />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="px-6 py-5 text-center space-y-3">
          {(invitation.tagline || invitation.birthdayAge) && (
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
              {invitation.tagline || "Anda dijemput hadir ke majlis hari lahir"}
            </p>
          )}

          <div>
            <h1 className="text-2xl font-bold leading-tight" style={{ color }}>
              {invitation.birthdayPerson}
            </h1>
            {invitation.birthdayAge && (
              <p className="text-base font-semibold mt-0.5" style={{ color: `${color}bb` }}>
                {invitation.birthdayAge} Tahun
              </p>
            )}
          </div>

          {/* Date badge */}
          <div
            className="inline-block px-4 py-1.5 rounded-full text-white text-sm font-semibold"
            style={{ backgroundColor: color }}
          >
            {formatDate(eventDate)}
          </div>

          {/* Details */}
          <div className="space-y-2 text-sm pt-1 text-left">
            {!hasSlots && invitation.time && (
              <div className="flex items-center gap-2.5">
                <div className="h-7 w-7 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}15` }}>
                  <Clock className="h-3.5 w-3.5" style={{ color }} />
                </div>
                <span>{invitation.time}</span>
              </div>
            )}
            {invitation.venue && (
              <div className="flex items-center gap-2.5">
                <div className="h-7 w-7 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}15` }}>
                  <MapPin className="h-3.5 w-3.5" style={{ color }} />
                </div>
                <span>{invitation.venue}</span>
              </div>
            )}
            {invitation.dressCode && (
              <div className="flex items-center gap-2.5">
                <div className="h-7 w-7 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}15` }}>
                  <Shirt className="h-3.5 w-3.5" style={{ color }} />
                </div>
                <span>{invitation.dressCode}</span>
              </div>
            )}
          </div>

          {/* Slots */}
          {hasSlots && (
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <Users className="h-3.5 w-3.5" />
                Slot Masa
              </div>
              {invitation.slots!.map((slot) => (
                <div
                  key={slot.id}
                  className="flex justify-between rounded-lg px-3 py-1.5 text-xs font-medium"
                  style={{ backgroundColor: `${color}12`, border: `1px solid ${color}35` }}
                >
                  <span>{slot.label}</span>
                  <span className="text-muted-foreground">{formatTime(slot.startTime)} – {formatTime(slot.endTime)}</span>
                </div>
              ))}
            </div>
          )}

          {/* Message */}
          {invitation.message && (
            <div
              className="rounded-xl px-4 py-3 text-sm text-center italic leading-relaxed"
              style={{ backgroundColor: `${color}10`, borderLeft: `3px solid ${color}50`, color: `${color}dd` }}
            >
              &ldquo;{invitation.message}&rdquo;
            </div>
          )}
        </div>

        {/* Dot pattern footer */}
        <div
          className="h-10 w-full flex items-center justify-center border-t"
          style={{ backgroundColor: `${color}08`, borderColor: `${color}20` }}
        >
          <div className="flex gap-2">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="h-2 w-2 rounded-full" style={{ backgroundColor: `${color}${i % 2 === 0 ? "40" : "70"}` }} />
            ))}
          </div>
        </div>

        {/* RSVP */}
        {!preview && (
          <div className="px-6 pb-6 pt-4 space-y-3">
            <div className="text-center">
              <h2 className="text-base font-bold">Maklum Balas Kehadiran</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Sila maklumkan kehadiran anda kepada tuan rumah.
              </p>
            </div>
            <RsvpForm invitationId={invitation.id} themeColor={color} slots={invitation.slots} />
          </div>
        )}

        {/* Bottom strip */}
        <div className="h-2 w-full" style={{ backgroundColor: color }} />
      </div>

      <InviteFooter />
    </div>
  );
}
