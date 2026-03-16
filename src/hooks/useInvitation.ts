"use client";

import { useEffect, useState } from "react";
import { subscribeToInvitation } from "@/lib/firestore";
import type { Invitation } from "@/types/invitation";

export function useInvitation(id: string | null) {
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) { setLoading(false); return; }
    const unsubscribe = subscribeToInvitation(id, (inv) => {
      setInvitation(inv);
      setLoading(false);
    });
    return unsubscribe;
  }, [id]);

  return { invitation, loading };
}
