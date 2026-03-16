import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, PartyPopper, Sparkles } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 md:py-32 px-4">
      {/* Background decorations */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-pink-200/30 dark:bg-pink-900/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-purple-200/30 dark:bg-purple-900/20 rounded-full blur-3xl" />
      </div>

      <div className="mx-auto max-w-4xl text-center">
        <Badge variant="outline" className="mb-6 gap-2 px-4 py-1.5 text-sm">
          <Sparkles className="h-3.5 w-3.5 text-pink-500" />
          Kad Jemputan Digital Malaysia
        </Badge>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
          Cipta Jemputan{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
            Hari Lahir
          </span>{" "}
          yang Memukau
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
          Bina kad jemputan digital yang cantik dalam minit. Kongsi pautan dengan mudah dan urus kehadiran tetamu secara langsung.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button size="lg" className="h-12 px-8 gap-2 text-base bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 border-0" asChild>
            <Link href="/daftar">
              <PartyPopper className="h-5 w-5" />
              Mulakan Percuma
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="h-12 px-8 gap-2 text-base" asChild>
            <Link href="/log-masuk">
              Log Masuk
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Social proof */}
        <p className="mt-8 text-sm text-muted-foreground">
          Percuma untuk bermula — tiada kad kredit diperlukan
        </p>
      </div>
    </section>
  );
}
