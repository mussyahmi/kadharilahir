import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PartyPopper, ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-16 md:py-24 px-4">
      <div className="mx-auto max-w-3xl">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 p-8 md:p-12 text-white text-center">
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10">
            <PartyPopper className="h-10 w-10 mx-auto mb-4 opacity-90" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Sedia untuk Bermula?
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
              Cipta kad jemputan hari lahir digital pertama anda hari ini. Percuma, mudah, dan memukau.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" className="h-12 px-8 bg-white text-purple-600 hover:bg-white/90 gap-2 text-base font-semibold" asChild>
                <Link href="/daftar">
                  Daftar Sekarang — Percuma
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
