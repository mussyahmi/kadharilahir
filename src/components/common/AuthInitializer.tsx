"use client";

import { useAuth } from "@/hooks/useAuth";

/** Mounts the Firebase auth listener globally. Renders nothing. */
export function AuthInitializer() {
  useAuth();
  return null;
}
