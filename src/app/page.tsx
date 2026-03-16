import Link from "next/link";
import { PartyPopper } from "lucide-react";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { CTASection } from "@/components/landing/CTASection";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 md:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <PartyPopper className="h-5 w-5 text-pink-500" />
            <span>KadHariLahir</span>
          </Link>
          <nav className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex" asChild>
              <a href="#ciri-ciri">Ciri-ciri</a>
            </Button>
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex" asChild>
              <a href="#cara-guna">Cara Guna</a>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/log-masuk">Log Masuk</Link>
            </Button>
            <Button size="sm" className="bg-gradient-to-r from-pink-500 to-purple-600 border-0 text-white hover:from-pink-600 hover:to-purple-700" asChild>
              <Link href="/daftar">Daftar</Link>
            </Button>
            <ThemeToggle />
          </nav>
        </div>
      </header>

      {/* Page sections */}
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CTASection />

      {/* Footer */}
      <footer className="border-t py-8 px-4">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-semibold">
            <PartyPopper className="h-4 w-4 text-pink-500" />
            <span>KadHariLahir</span>
          </div>
          <p className="text-sm text-muted-foreground text-center">
            © 2025 KadHariLahir. Kad jemputan digital untuk rakyat Malaysia.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link href="/log-masuk" className="hover:underline">Log Masuk</Link>
            <Link href="/daftar" className="hover:underline">Daftar</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
