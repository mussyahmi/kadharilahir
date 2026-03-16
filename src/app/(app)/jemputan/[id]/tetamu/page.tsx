"use client";

import { use } from "react";
import Link from "next/link";
import { useInvitation } from "@/hooks/useInvitation";
import { useGuests } from "@/hooks/useGuests";
import { useAuthStore } from "@/stores/authStore";
import { RsvpStats } from "@/components/guests/RsvpStats";
import { GuestTable } from "@/components/guests/GuestTable";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ExternalLink, Copy } from "lucide-react";
import { toast } from "sonner";

export default function GuestsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { invitation, loading: invLoading } = useInvitation(id);
  const { guests, loading: guestsLoading } = useGuests(id);
  const { user } = useAuthStore();

  const isOwner = user && invitation && user.uid === invitation.ownerId;
  const inviteUrl = typeof window !== "undefined"
    ? `${window.location.origin}/jemput/${invitation?.slug}`
    : `/jemput/${invitation?.slug}`;

  const copyLink = () => {
    navigator.clipboard.writeText(inviteUrl);
    toast.success("Pautan disalin!");
  };

  if (invLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-3 gap-3">
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (!invitation || !isOwner) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-muted-foreground">Jemputan tidak dijumpai.</p>
        <Button variant="link" asChild className="mt-2">
          <Link href="/papan-pemuka">Kembali ke Papan Pemuka</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild className="h-9 w-9 shrink-0">
            <Link href="/papan-pemuka">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Senarai Tetamu</h1>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-muted-foreground text-sm">Hari Lahir {invitation.birthdayPerson}</p>
              <Badge variant="outline" className="text-xs font-mono">/{invitation.slug}</Badge>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={copyLink} className="gap-2">
            <Copy className="h-3.5 w-3.5" />
            Salin Pautan
          </Button>
          <Button variant="outline" size="sm" asChild className="gap-2">
            <Link href={`/jemput/${invitation.slug}`} target="_blank">
              <ExternalLink className="h-3.5 w-3.5" />
              Lihat Jemputan
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      {!guestsLoading && <RsvpStats guests={guests} />}

      {/* Table */}
      {guestsLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-14 w-full" />)}
        </div>
      ) : (
        <GuestTable guests={guests} />
      )}
    </div>
  );
}
