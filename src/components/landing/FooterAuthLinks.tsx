"use client";

import Link from "next/link";
import { useAuthStore } from "@/stores/authStore";

export function FooterAuthLinks() {
  const { user, loading } = useAuthStore();

  if (loading) return null;

  if (user) {
    return (
      <Link href="/papan-pemuka" className="hover:underline">Papan Pemuka</Link>
    );
  }

  return (
    <>
      <Link href="/log-masuk" className="hover:underline">Log Masuk</Link>
      <Link href="/daftar" className="hover:underline">Daftar</Link>
    </>
  );
}
