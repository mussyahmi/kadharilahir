"use client";

import { useEffect, useState } from "react";
import { subscribeToInvitations } from "@/lib/firestore";
import type { Invitation } from "@/types/invitation";

export function useInvitations(uid: string | null) {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) { setLoading(false); return; }
    const unsubscribe = subscribeToInvitations(uid, (items) => {
      setInvitations(items);
      setLoading(false);
    });
    return unsubscribe;
  }, [uid]);

  return { invitations, loading };
}
