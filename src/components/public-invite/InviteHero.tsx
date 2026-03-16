import Image from "next/image";
import type { Invitation } from "@/types/invitation";
import { formatDate } from "@/lib/utils";
import { Calendar } from "lucide-react";

interface Props {
  invitation: Invitation;
}

export function InviteHero({ invitation }: Props) {
  const eventDate = invitation.date?.toDate ? invitation.date.toDate() : new Date();

  return (
    <div className="relative w-full min-h-[60vh] md:min-h-[70vh] flex items-end overflow-hidden">
      {/* Background */}
      {invitation.coverPhotoUrl ? (
        <Image
          src={invitation.coverPhotoUrl}
          alt={invitation.birthdayPerson}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${invitation.themeColor}80, ${invitation.themeColor}20)`,
          }}
        />
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {/* Content */}
      <div className="relative z-10 w-full px-4 pb-8 pt-16 md:px-8 md:pb-12">
        <div className="mx-auto max-w-4xl">
          <p className="text-sm font-medium text-white/70 uppercase tracking-widest mb-2">
            Jemputan Hari Lahir
          </p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-4">
            {invitation.birthdayPerson}
          </h1>
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-white text-sm font-medium"
            style={{ backgroundColor: `${invitation.themeColor}cc` }}
          >
            <Calendar className="h-4 w-4" />
            {formatDate(eventDate)}
          </div>
        </div>
      </div>

      {/* Bottom accent line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1"
        style={{ backgroundColor: invitation.themeColor }}
      />
    </div>
  );
}
