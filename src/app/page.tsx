import Link from "next/link";
import Image from "next/image";
import pkg from "../../package.json";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { CTASection } from "@/components/landing/CTASection";
import { Button } from "@/components/ui/button";
import { NavAuthButtons } from "@/components/landing/NavAuthButtons";
import { FooterAuthLinks } from "@/components/landing/FooterAuthLinks";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 md:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <Image src="/logo.png" alt="KadHariLahir" width={20} height={20} />
            <span>KadHariLahir</span>
          </Link>
          <nav className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex" asChild>
              <a href="#ciri-ciri">Ciri-ciri</a>
            </Button>
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex" asChild>
              <a href="#cara-guna">Cara Guna</a>
            </Button>
            <NavAuthButtons />
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
            <Image src="/logo.png" alt="KadHariLahir" width={18} height={18} />
            <span>KadHariLahir</span>
          </div>
          <p className="text-sm text-muted-foreground text-center">
            © 2026 KadHariLahir. Kad jemputan hari lahir digital Malaysia.
          </p>
          <p className="text-xs text-muted-foreground/50">v{pkg.version}</p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <FooterAuthLinks />
          </div>
        </div>
      </footer>
    </div>
  );
}
