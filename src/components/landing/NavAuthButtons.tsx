"use client";

import Link from "next/link";
import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/ui/button";
import { LayoutDashboard } from "lucide-react";

export function NavAuthButtons() {
  const { user, loading } = useAuthStore();

  if (loading) return <div className="w-20 h-8" />;

  if (user) {
    return (
      <Button size="sm" className="bg-gradient-to-r from-pink-500 to-purple-600 border-0 text-white hover:from-pink-600 hover:to-purple-700 gap-1.5" asChild>
        <Link href="/papan-pemuka">
          <LayoutDashboard className="h-3.5 w-3.5" />
          Papan Pemuka
        </Link>
      </Button>
    );
  }

  return (
    <>
      <Button variant="ghost" size="sm" asChild>
        <Link href="/log-masuk">Log Masuk</Link>
      </Button>
      <Button size="sm" className="bg-gradient-to-r from-pink-500 to-purple-600 border-0 text-white hover:from-pink-600 hover:to-purple-700" asChild>
        <Link href="/daftar">Daftar</Link>
      </Button>
    </>
  );
}
