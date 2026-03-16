"use client";

import Link from "next/link";
import { useAuthStore } from "@/stores/authStore";
import { useInvitations } from "@/hooks/useInvitations";
import { InvitationCard } from "@/components/dashboard/InvitationCard";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus } from "lucide-react";

function DashboardSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-lg border overflow-hidden">
          <Skeleton className="h-40 w-full" />
          <div className="p-4 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { invitations, loading } = useInvitations(user?.uid ?? null);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Jemputan Saya</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {loading ? "Memuatkan..." : `${invitations.length} jemputan`}
          </p>
        </div>
        <Button asChild className="gap-2 w-full sm:w-auto">
          <Link href="/jemputan/baru">
            <Plus className="h-4 w-4" />
            Jemputan Baru
          </Link>
        </Button>
      </div>

      {loading ? (
        <DashboardSkeleton />
      ) : invitations.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {invitations.map((inv) => (
            <InvitationCard key={inv.id} invitation={inv} />
          ))}
        </div>
      )}
    </div>
  );
}
