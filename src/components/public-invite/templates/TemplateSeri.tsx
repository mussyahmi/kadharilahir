import Image from "next/image";
import type { Invitation } from "@/types/invitation";
import { formatDate, formatTime } from "@/lib/utils";
import { MapPin, Clock, Shirt, Users, Cake, Calendar } from "lucide-react";
import { RsvpForm } from "@/components/public-invite/RsvpForm";
import { InviteFooter } from "@/components/public-invite/InviteFooter";

interface Props {
  invitation: Invitation;
  preview?: boolean;
}

export function TemplateSeri({ invitation, preview }: Props) {
  const eventDate = invitation.date?.toDate ? invitation.date.toDate() : new Date();
  const hasSlots = invitation.slots && invitation.slots.length > 0;
  const color = invitation.themeColor;

  return (
    <div
      className={preview ? "" : "min-h-screen"}
      style={{ background: `linear-gradient(150deg, ${color}20 0%, #f8f8f8 50%, ${color}12 100%)` }}
    >
      {/* Top banner */}
      <div
        className="w-full py-2.5 text-center text-white text-xs font-bold tracking-[0.2em] uppercase"
        style={{ backgroundColor: color }}
      >
        Majlis Hari Lahir
      </div>

      <div className="mx-auto max-w-lg px-4 py-8 space-y-5">

        {/* Photo */}
        {invitation.coverPhotoUrl ? (
          <div
            className="relative rounded-2xl overflow-hidden shadow-lg border-4 border-white"
            style={{ paddingBottom: "72%" }}
          >
            <Image
              src={invitation.coverPhotoUrl}
              alt={invitation.birthdayPerson}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 640px) 100vw, 512px"
            />
            {invitation.birthdayAge && (
              <div
                className="absolute top-3 right-3 h-14 w-14 rounded-full flex flex-col items-center justify-center text-white shadow-lg"
                style={{ backgroundColor: color }}
              >
                <span className="text-xl font-black leading-none">{invitation.birthdayAge}</span>
                <span className="text-[8px] font-bold uppercase tracking-wider mt-0.5">Tahun</span>
              </div>
            )}
          </div>
        ) : (
          <div
            className="rounded-2xl overflow-hidden shadow-lg border-4 border-white flex items-center justify-center relative"
            style={{ paddingBottom: "72%", backgroundColor: `${color}15` }}
          >
            <Cake className="absolute inset-0 m-auto h-20 w-20" style={{ color: `${color}50` }} />
            {invitation.birthdayAge && (
              <div
                className="absolute top-3 right-3 h-14 w-14 rounded-full flex flex-col items-center justify-center text-white shadow-lg"
                style={{ backgroundColor: color }}
              >
                <span className="text-xl font-black leading-none">{invitation.birthdayAge}</span>
                <span className="text-[8px] font-bold uppercase tracking-wider mt-0.5">Tahun</span>
              </div>
            )}
          </div>
        )}

        {/* Heading */}
        <div className="bg-white dark:bg-neutral-800 rounded-2xl px-5 py-4 text-center shadow-sm space-y-2">
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">
            {invitation.tagline || "Anda dijemput hadir ke majlis hari lahir"}
          </p>
          <h1 className="text-2xl font-black leading-tight" style={{ color }}>
            {invitation.birthdayPerson}
          </h1>
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-white text-xs font-semibold"
            style={{ backgroundColor: color }}
          >
            <Calendar className="h-3 w-3" />
            {formatDate(eventDate)}
          </div>
        </div>

        {/* Info cards */}
        <div className="space-y-2.5">
          {!hasSlots && invitation.time && (
            <div className="flex items-center gap-3 bg-white dark:bg-neutral-800 rounded-xl px-4 py-3 shadow-sm">
              <div className="h-9 w-9 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}15` }}>
                <Clock className="h-4 w-4" style={{ color }} />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Masa</p>
                <p className="font-bold text-sm">{invitation.time}</p>
              </div>
            </div>
          )}
          {invitation.venue && (
            <div className="flex items-center gap-3 bg-white dark:bg-neutral-800 rounded-xl px-4 py-3 shadow-sm">
              <div className="h-9 w-9 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}15` }}>
                <MapPin className="h-4 w-4" style={{ color }} />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Lokasi</p>
                <p className="font-bold text-sm">{invitation.venue}</p>
              </div>
            </div>
          )}
          {invitation.dressCode && (
            <div className="flex items-center gap-3 bg-white dark:bg-neutral-800 rounded-xl px-4 py-3 shadow-sm">
              <div className="h-9 w-9 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}15` }}>
                <Shirt className="h-4 w-4" style={{ color }} />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Kod Pakaian</p>
                <p className="font-bold text-sm">{invitation.dressCode}</p>
              </div>
            </div>
          )}
        </div>

        {/* Slots */}
        {hasSlots && (
          <div className="bg-white dark:bg-neutral-800 rounded-xl px-4 py-4 shadow-sm space-y-2">
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-semibold text-muted-foreground mb-1">
              <Users className="h-3.5 w-3.5" style={{ color }} /> Slot Masa
            </div>
            {invitation.slots!.map((slot) => (
              <div
                key={slot.id}
                className="flex justify-between rounded-lg px-3 py-2 text-sm font-medium"
                style={{ backgroundColor: `${color}12`, border: `1px solid ${color}35` }}
              >
                <span>{slot.label}</span>
                <span className="text-muted-foreground text-xs tabular-nums">{formatTime(slot.startTime)} – {formatTime(slot.endTime)}</span>
              </div>
            ))}
          </div>
        )}

        {/* Message */}
        {invitation.message && (
          <div
            className="rounded-xl px-4 py-3 text-sm text-center italic leading-relaxed"
            style={{ backgroundColor: `${color}12`, borderLeft: `3px solid ${color}`, color: `${color}dd` }}
          >
            &ldquo;{invitation.message}&rdquo;
          </div>
        )}

        {/* RSVP */}
        {!preview && (
          <div className="bg-white dark:bg-neutral-800 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="text-center">
              <h2 className="text-base font-black" style={{ color }}>Maklum Balas Kehadiran</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Sila maklumkan kehadiran anda kepada tuan rumah.
              </p>
            </div>
            <RsvpForm invitationId={invitation.id} themeColor={color} slots={invitation.slots} />
          </div>
        )}

      </div>
      <InviteFooter />
    </div>
  );
}
