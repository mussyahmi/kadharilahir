import Image from "next/image";
import type { Invitation } from "@/types/invitation";
import { formatDate, formatTime } from "@/lib/utils";
import { MapPin, Clock, Shirt, Users, Calendar } from "lucide-react";
import { RsvpForm } from "@/components/public-invite/RsvpForm";
import { InviteFooter } from "@/components/public-invite/InviteFooter";

interface Props {
  invitation: Invitation;
  preview?: boolean;
}

export function TemplateElegan({ invitation, preview }: Props) {
  const eventDate = invitation.date?.toDate ? invitation.date.toDate() : new Date();
  const hasSlots = invitation.slots && invitation.slots.length > 0;
  const color = invitation.themeColor;

  return (
    <div className={`${preview ? "" : "min-h-screen"} bg-neutral-950 text-white`}>

      {/* Hero */}
      <div className="relative h-[55vh] overflow-hidden">
        {invitation.coverPhotoUrl ? (
          <Image
            src={invitation.coverPhotoUrl}
            alt={invitation.birthdayPerson}
            fill
            className="object-cover opacity-40"
            priority
            sizes="100vw"
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{ background: `linear-gradient(135deg, ${color}30 0%, transparent 100%)` }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/50 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 px-6 pb-10 text-center">
          {/* Ornamental line */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-10" style={{ backgroundColor: `${color}70` }} />
            <div className="h-1 w-1 rounded-full" style={{ backgroundColor: color }} />
            <div className="h-px w-10" style={{ backgroundColor: `${color}70` }} />
          </div>
          <p
            className="text-[10px] uppercase tracking-[0.35em] mb-3 font-medium"
            style={{ color: `${color}cc` }}
          >
            {invitation.tagline || "Anda dijemput hadir ke majlis hari lahir"}
          </p>
          <h1
            className="text-4xl md:text-5xl font-bold mb-2 leading-tight"
            style={{ fontFamily: "Georgia, serif" }}
          >
            {invitation.birthdayPerson}
          </h1>
          {invitation.birthdayAge && (
            <p className="text-sm font-light tracking-widest mt-1" style={{ color: `${color}99` }}>
              {invitation.birthdayAge} Tahun
            </p>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="flex items-center justify-center gap-4 py-6 px-6">
        <div className="h-px flex-1 max-w-24" style={{ backgroundColor: `${color}40` }} />
        <div className="flex gap-1.5">
          <div className="h-1 w-1 rounded-full" style={{ backgroundColor: `${color}80` }} />
          <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
          <div className="h-1 w-1 rounded-full" style={{ backgroundColor: `${color}80` }} />
        </div>
        <div className="h-px flex-1 max-w-24" style={{ backgroundColor: `${color}40` }} />
      </div>

      {/* Details */}
      <div className="mx-auto max-w-lg px-6 pb-6 space-y-3">
        <div className="flex items-center justify-center gap-2 text-sm font-medium" style={{ color }}>
          <Calendar className="h-4 w-4" />
          {formatDate(eventDate)}
        </div>

        {!hasSlots && invitation.time && (
          <div className="flex items-center justify-center gap-2 text-sm text-white/60">
            <Clock className="h-3.5 w-3.5" />
            {invitation.time}
          </div>
        )}
        {invitation.venue && (
          <div className="flex items-center justify-center gap-2 text-sm text-white/60">
            <MapPin className="h-3.5 w-3.5" />
            {invitation.venue}
          </div>
        )}
        {invitation.dressCode && (
          <div className="flex items-center justify-center gap-2 text-sm text-white/60">
            <Shirt className="h-3.5 w-3.5" />
            {invitation.dressCode}
          </div>
        )}

        {/* Slots */}
        {hasSlots && (
          <div className="space-y-2 pt-3">
            <div className="flex items-center justify-center gap-1.5 text-[10px] uppercase tracking-[0.2em]" style={{ color: `${color}99` }}>
              <Users className="h-3 w-3" /> Slot Masa
            </div>
            {invitation.slots!.map((slot) => (
              <div
                key={slot.id}
                className="flex justify-between rounded-sm px-5 py-2.5 text-sm"
                style={{ backgroundColor: `${color}10`, borderLeft: `2px solid ${color}` }}
              >
                <span className="font-medium text-white/90">{slot.label}</span>
                <span className="text-white/50 text-xs">{formatTime(slot.startTime)} – {formatTime(slot.endTime)}</span>
              </div>
            ))}
          </div>
        )}

        {/* Message */}
        {invitation.message && (
          <div className="pt-4 pb-4 text-center text-sm italic text-white/50 leading-relaxed border-t border-b border-white/10 mt-3">
            &ldquo;{invitation.message}&rdquo;
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="flex items-center justify-center gap-4 py-4 px-6">
        <div className="h-px flex-1 max-w-24" style={{ backgroundColor: `${color}40` }} />
        <div className="flex gap-1.5">
          <div className="h-1 w-1 rounded-full" style={{ backgroundColor: `${color}80` }} />
          <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
          <div className="h-1 w-1 rounded-full" style={{ backgroundColor: `${color}80` }} />
        </div>
        <div className="h-px flex-1 max-w-24" style={{ backgroundColor: `${color}40` }} />
      </div>

      {/* RSVP */}
      {!preview && (
        <div className="mx-auto max-w-md px-6 pb-12 space-y-4">
          <div className="text-center">
            <h2 className="text-lg font-semibold tracking-wide" style={{ fontFamily: "Georgia, serif" }}>
              Maklum Balas Kehadiran
            </h2>
            <p className="text-xs text-white/40 mt-1">
              Sila maklumkan kehadiran anda kepada tuan rumah.
            </p>
          </div>
          <RsvpForm invitationId={invitation.id} themeColor={color} slots={invitation.slots} dark />
        </div>
      )}

      <InviteFooter dark />
    </div>
  );
}
