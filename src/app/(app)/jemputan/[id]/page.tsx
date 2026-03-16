"use client";

import { use } from "react";
import { useInvitation } from "@/hooks/useInvitation";
import { InvitationForm } from "@/components/invitation/InvitationForm";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function EditInvitationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { invitation, loading } = useInvitation(id);
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!loading && invitation && user && invitation.ownerId !== user.uid) {
      router.push("/papan-pemuka");
    }
  }, [invitation, loading, user, router]);

  if (loading) {
    return (
      <div className="flex gap-8">
        {/* Form skeleton */}
        <div className="flex-1 min-w-0 space-y-4">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-[140px] w-full rounded-xl" />
          <Skeleton className="h-[120px] w-full rounded-xl" />
          <Skeleton className="h-[160px] w-full rounded-xl" />
          <Skeleton className="h-[100px] w-full rounded-xl" />
          <Skeleton className="h-[120px] w-full rounded-xl" />
          <Skeleton className="h-[80px] w-full rounded-xl" />
        </div>
        {/* Preview panel skeleton — matches xl:flex */}
        <div className="hidden xl:flex flex-col gap-3 w-[420px] shrink-0">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="rounded-[2rem]" style={{ height: "calc(100vh - 7rem)" }} />
        </div>
      </div>
    );
  }

  if (!invitation) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-muted-foreground">Jemputan tidak dijumpai.</p>
      </div>
    );
  }

  return <InvitationForm initialData={invitation} />;
}
