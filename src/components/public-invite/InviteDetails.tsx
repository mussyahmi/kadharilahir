import type { Invitation } from "@/types/invitation";
import { Clock, MapPin, MessageCircle, Shirt, Users } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { formatTime } from "@/lib/utils";

interface Props {
  invitation: Invitation;
}

function ordinal(n: number): string {
  if (n === 1) return "1st";
  if (n === 2) return "2nd";
  if (n === 3) return "3rd";
  return `${n}th`;
}

export function InviteDetails({ invitation }: Props) {
  const hasSlots = invitation.slots && invitation.slots.length > 0;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 md:px-6 space-y-6">
      {/* Details grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {invitation.time && !hasSlots && (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/50">
            <div
              className="mt-0.5 h-9 w-9 rounded-full flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${invitation.themeColor}20` }}
            >
              <Clock className="h-4 w-4" style={{ color: invitation.themeColor }} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Masa</p>
              <p className="font-semibold text-sm mt-0.5">{invitation.time}</p>
            </div>
          </div>
        )}

        {invitation.venue && (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/50">
            <div
              className="mt-0.5 h-9 w-9 rounded-full flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${invitation.themeColor}20` }}
            >
              <MapPin className="h-4 w-4" style={{ color: invitation.themeColor }} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Lokasi</p>
              <p className="font-semibold text-sm mt-0.5">{invitation.venue}</p>
            </div>
          </div>
        )}

        {invitation.dressCode && (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/50">
            <div
              className="mt-0.5 h-9 w-9 rounded-full flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${invitation.themeColor}20` }}
            >
              <Shirt className="h-4 w-4" style={{ color: invitation.themeColor }} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Kod Pakaian</p>
              <p className="font-semibold text-sm mt-0.5">{invitation.dressCode}</p>
            </div>
          </div>
        )}
      </div>

      {/* Slots */}
      {hasSlots && (
        <>
          <Separator />
          <div className="flex items-start gap-3">
            <div
              className="mt-0.5 h-9 w-9 rounded-full flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${invitation.themeColor}20` }}
            >
              <Users className="h-4 w-4" style={{ color: invitation.themeColor }} />
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-2">Slot Masa</p>
              <div className="space-y-2">
                {invitation.slots!.map((slot) => (
                  <div
                    key={slot.id}
                    className="flex items-center justify-between rounded-lg px-3 py-2 text-sm"
                    style={{ backgroundColor: `${invitation.themeColor}15`, border: `1px solid ${invitation.themeColor}30` }}
                  >
                    <span className="font-medium">{slot.label}</span>
                    <span className="text-muted-foreground text-xs">
                      {formatTime(slot.startTime)} – {formatTime(slot.endTime)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Message */}
      {invitation.message && (
        <>
          <Separator />
          <div className="flex items-start gap-3">
            <div
              className="mt-0.5 h-9 w-9 rounded-full flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${invitation.themeColor}20` }}
            >
              <MessageCircle className="h-4 w-4" style={{ color: invitation.themeColor }} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-2">Ucapan</p>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{invitation.message}</p>
            </div>
          </div>
        </>
      )}

      {/* Birthday age note */}
      {invitation.birthdayAge && (
        <p className="text-center text-xs text-muted-foreground pt-2">
          Menyambut Hari Lahir Ke-{invitation.birthdayAge} 🎂
        </p>
      )}
    </div>
  );
}
