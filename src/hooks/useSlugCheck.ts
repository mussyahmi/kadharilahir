"use client";

import { useEffect, useState } from "react";
import { checkSlugAvailable } from "@/lib/firestore";

export function useSlugCheck(slug: string, currentSlug?: string) {
  const [available, setAvailable] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    if (!slug || slug.length < 3) {
      setAvailable(null);
      return;
    }
    // If slug hasn't changed from the original, it's fine
    if (slug === currentSlug) {
      setAvailable(true);
      return;
    }
    setChecking(true);
    const timer = setTimeout(async () => {
      const ok = await checkSlugAvailable(slug);
      setAvailable(ok);
      setChecking(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [slug, currentSlug]);

  return { available, checking };
}
