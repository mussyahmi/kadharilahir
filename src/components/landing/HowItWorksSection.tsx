import { UserPlus, FileEdit, Share2, BarChart3 } from "lucide-react";

const STEPS = [
  {
    icon: UserPlus,
    number: "01",
    title: "Daftar Akaun",
    description: "Cipta akaun percuma dengan e-mel atau Google dalam masa beberapa saat.",
    color: "#EC4899",
  },
  {
    icon: FileEdit,
    number: "02",
    title: "Isi & Reka Jemputan",
    description: "Masukkan nama, tarikh, lokasi, jana reka bentuk AI, dan muat naik gambar.",
    color: "#A855F7",
  },
  {
    icon: Share2,
    number: "03",
    title: "Kongsi Pautan",
    description: "Salin pautan unik dan hantar kepada tetamu melalui WhatsApp atau media sosial.",
    color: "#3B82F6",
  },
  {
    icon: BarChart3,
    number: "04",
    title: "Urus Kehadiran",
    description: "Lihat maklum balas tetamu secara masa nyata dari papan pemuka anda.",
    color: "#10B981",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-16 md:py-24 px-4 bg-muted/40 dark:bg-muted/20" id="cara-guna">
      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold text-purple-500 uppercase tracking-widest mb-3">Cara Guna</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">4 Langkah Mudah</h2>
          <p className="text-muted-foreground text-lg">
            Dari daftar hingga jemputan siap dikongsi — dalam masa kurang 5 minit.
          </p>
        </div>

        {/* Desktop: horizontal strip */}
        <div className="hidden md:grid md:grid-cols-4 gap-0 relative">
          {/* Connector line */}
          <div className="absolute top-10 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-pink-300 via-purple-300 to-green-300 dark:from-pink-700 dark:via-purple-700 dark:to-green-700" />

          {STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.number} className="flex flex-col items-center text-center px-4 relative">
                {/* Circle */}
                <div
                  className="h-20 w-20 rounded-full flex items-center justify-center mb-5 shadow-lg relative z-10 bg-background"
                  style={{ border: `3px solid ${step.color}` }}
                >
                  <Icon className="h-7 w-7" style={{ color: step.color }} />
                </div>

                <span className="text-xs font-bold text-muted-foreground/50 uppercase tracking-widest mb-1">
                  {step.number}
                </span>
                <h3 className="font-bold text-sm mb-2">{step.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            );
          })}
        </div>

        {/* Mobile: vertical */}
        <div className="flex flex-col gap-0 md:hidden">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={step.number} className="flex gap-5 relative">
                {/* Left column: circle + line */}
                <div className="flex flex-col items-center shrink-0">
                  <div
                    className="h-12 w-12 rounded-full flex items-center justify-center shrink-0 bg-background shadow-md z-10"
                    style={{ border: `2.5px solid ${step.color}` }}
                  >
                    <Icon className="h-5 w-5" style={{ color: step.color }} />
                  </div>
                  {i < STEPS.length - 1 && (
                    <div
                      className="w-px flex-1 mt-1 mb-1 min-h-[32px]"
                      style={{ background: `linear-gradient(to bottom, ${step.color}60, transparent)` }}
                    />
                  )}
                </div>

                <div className={`pb-7 ${i === STEPS.length - 1 ? "pb-0" : ""}`}>
                  <span className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest">
                    {step.number}
                  </span>
                  <h3 className="font-bold text-sm mt-0.5 mb-1">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
