"use client";

import Link from "next/link";
import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/ui/button";
import { ArrowRight, LayoutDashboard } from "lucide-react";

export function CTAAuthButton() {
  const { user, loading } = useAuthStore();

  if (loading) return <div className="h-13 w-56" />;

  if (user) {
    return (
      <Button
        size="lg"
        className="h-13 px-10 gap-2 text-base font-bold bg-white text-purple-700 hover:bg-white/90 shadow-xl shadow-black/20"
        asChild
      >
        <Link href="/papan-pemuka">
          <LayoutDashboard className="h-4 w-4" />
          Papan Pemuka Saya
        </Link>
      </Button>
    );
  }

  return (
    <Button
      size="lg"
      className="h-13 px-10 gap-2 text-base font-bold bg-white text-purple-700 hover:bg-white/90 shadow-xl shadow-black/20"
      asChild
    >
      <Link href="/daftar">
        Daftar Sekarang — Percuma
        <ArrowRight className="h-4 w-4" />
      </Link>
    </Button>
  );
}
