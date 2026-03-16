import Image from "next/image";
import type { Invitation } from "@/types/invitation";
import { formatDate, formatTime } from "@/lib/utils";
import { MapPin, Clock, Shirt, Users, Cake } from "lucide-react";
import { RsvpForm } from "@/components/public-invite/RsvpForm";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { InviteFooter } from "@/components/public-invite/InviteFooter";

interface Props {
  invitation: Invitation;
  preview?: boolean;
}

export function TemplateMinimalis({ invitation, preview }: Props) {
  const eventDate = invitation.date?.toDate ? invitation.date.toDate() : new Date();
  const hasSlots = invitation.slots && invitation.slots.length > 0;
  const color = invitation.themeColor;

  return (
    <div className={`${preview ? "" : "min-h-screen"} bg-background`}>

      {/* Topbar */}
      <div className="border-b px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-sm font-semibold tracking-tight">
          <div className="h-5 w-5 rounded flex items-center justify-center" style={{ backgroundColor: color }}>
            <Cake className="h-3 w-3 text-white" />
          </div>
          KadHariLahir
        </Link>
      </div>

      <div className="mx-auto max-w-xl px-6 py-12">

        {/* Photo */}
        {invitation.coverPhotoUrl && (
          <div
            className="relative w-full rounded-xl overflow-hidden mb-10 shadow-sm"
            style={{ paddingBottom: "56%", border: `1px solid ${color}30` }}
          >
            <Image
              src={invitation.coverPhotoUrl}
              alt={invitation.birthdayPerson}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 672px"
            />
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-0.5 w-8 rounded" style={{ backgroundColor: color }} />
            <p className="text-xs text-muted-foreground uppercase tracking-[0.18em] font-medium">
              {invitation.tagline || "Anda dijemput hadir ke majlis hari lahir"}
            </p>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight">
            {invitation.birthdayPerson}
          </h1>
          {invitation.birthdayAge && (
            <p className="text-sm text-muted-foreground mt-1 font-medium">
              {invitation.birthdayAge} Tahun
            </p>
          )}
          <p className="text-base mt-3 font-semibold" style={{ color }}>{formatDate(eventDate)}</p>
        </div>

        <Separator className="mb-8" />

        {/* Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
          {!hasSlots && invitation.time && (
            <div className="flex items-start gap-3">
              <div className="mt-0.5 h-8 w-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}12` }}>
                <Clock className="h-4 w-4" style={{ color }} />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-0.5">Masa</p>
                <p className="font-semibold text-sm">{invitation.time}</p>
              </div>
            </div>
          )}
          {invitation.venue && (
            <div className="flex items-start gap-3">
              <div className="mt-0.5 h-8 w-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}12` }}>
                <MapPin className="h-4 w-4" style={{ color }} />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-0.5">Lokasi</p>
                <p className="font-semibold text-sm">{invitation.venue}</p>
              </div>
            </div>
          )}
          {invitation.dressCode && (
            <div className="flex items-start gap-3">
              <div className="mt-0.5 h-8 w-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}12` }}>
                <Shirt className="h-4 w-4" style={{ color }} />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-0.5">Kod Pakaian</p>
                <p className="font-semibold text-sm">{invitation.dressCode}</p>
              </div>
            </div>
          )}
        </div>

        {/* Slots */}
        {hasSlots && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Users className="h-3.5 w-3.5" style={{ color }} />
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Slot Masa</p>
            </div>
            <div className="space-y-2">
              {invitation.slots!.map((slot) => (
                <div key={slot.id} className="flex justify-between items-center rounded-lg border px-4 py-2.5 text-sm">
                  <span className="font-medium">{slot.label}</span>
                  <span className="text-muted-foreground text-xs tabular-nums">{formatTime(slot.startTime)} – {formatTime(slot.endTime)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Message */}
        {invitation.message && (
          <div className="mb-8 pl-4" style={{ borderLeft: `2px solid ${color}` }}>
            <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap italic">
              {invitation.message}
            </p>
          </div>
        )}

        <Separator className="mb-8" />

        {/* RSVP */}
        {!preview && (
          <div>
            <h2 className="text-lg font-bold mb-1">Maklum Balas Kehadiran</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Sila maklumkan kehadiran anda kepada tuan rumah.
            </p>
            <RsvpForm invitationId={invitation.id} themeColor={color} slots={invitation.slots} />
          </div>
        )}
      </div>

      <InviteFooter />
    </div>
  );
}
