"use client";

import { useEffect, useState } from "react";
import { subscribeToRsvps } from "@/lib/firestore";
import type { Rsvp } from "@/types/invitation";

export function useGuests(invitationId: string | null) {
  const [guests, setGuests] = useState<Rsvp[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!invitationId) { setLoading(false); return; }
    const unsubscribe = subscribeToRsvps(invitationId, (items) => {
      setGuests(items);
      setLoading(false);
    });
    return unsubscribe;
  }, [invitationId]);

  return { guests, loading };
}
