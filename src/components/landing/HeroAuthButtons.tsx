"use client";

import Link from "next/link";
import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/ui/button";
import { ArrowRight, LayoutDashboard } from "lucide-react";

export function HeroAuthButtons() {
  const { user, loading } = useAuthStore();

  if (loading) return <div className="h-12 w-48" />;

  if (user) {
    return (
      <Button
        size="lg"
        className="h-12 px-8 gap-2 text-base bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 border-0 shadow-lg shadow-pink-500/25"
        asChild
      >
        <Link href="/papan-pemuka">
          <LayoutDashboard className="h-5 w-5" />
          Papan Pemuka Saya
        </Link>
      </Button>
    );
  }

  return (
    <>
      <Button
        size="lg"
        className="h-12 px-8 gap-2 text-base bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 border-0 shadow-lg shadow-pink-500/25"
        asChild
      >
        <Link href="/daftar">
          Mulakan Percuma
          <ArrowRight className="h-4 w-4" />
        </Link>
      </Button>
      <Button size="lg" variant="outline" className="h-12 px-8 text-base" asChild>
        <Link href="/log-masuk">Log Masuk</Link>
      </Button>
    </>
  );
}
