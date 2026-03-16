import { ImagePlus, Link2, Users, Wand2, Music, CalendarCheck } from "lucide-react";

const FEATURES = [
  {
    icon: Wand2,
    title: "Reka Bentuk AI",
    description: "Jana latar belakang kad yang unik dengan AI — pilih gaya, seni, dan suasana warna.",
    color: "#EC4899",
    grad: "from-pink-500/15 to-pink-500/5",
  },
  {
    icon: ImagePlus,
    title: "Gambar Tanpa Latar",
    description: "Muat naik foto dengan latar belakang dibuang dan komposit terus ke atas kad.",
    color: "#A855F7",
    grad: "from-purple-500/15 to-purple-500/5",
  },
  {
    icon: Music,
    title: "Muzik Hari Lahir",
    description: "Lagu Happy Birthday dimainkan secara automatik apabila tetamu membuka jemputan.",
    color: "#3B82F6",
    grad: "from-blue-500/15 to-blue-500/5",
  },
  {
    icon: Users,
    title: "RSVP Masa Nyata",
    description: "Tetamu balas kehadiran terus di pautan jemputan. Anda nampak semua dari papan pemuka.",
    color: "#10B981",
    grad: "from-emerald-500/15 to-emerald-500/5",
  },
  {
    icon: CalendarCheck,
    title: "Simpan ke Kalendar",
    description: "Tetamu boleh simpan terus ke Google Calendar atau Apple Calendar dengan satu klik.",
    color: "#F59E0B",
    grad: "from-amber-500/15 to-amber-500/5",
  },
  {
    icon: Link2,
    title: "Pautan WhatsApp",
    description: "Kongsi pautan cantik terus melalui WhatsApp, Telegram, atau mana-mana platform.",
    color: "#6366F1",
    grad: "from-indigo-500/15 to-indigo-500/5",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-16 md:py-24 px-4" id="ciri-ciri">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-pink-500 uppercase tracking-widest mb-3">Ciri-ciri</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Semua yang Anda Perlukan</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Dari reka bentuk AI hingga RSVP langsung — satu platform untuk jemputan hari lahir yang sempurna.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className={`group relative rounded-2xl p-6 bg-gradient-to-br ${feature.grad} border border-transparent hover:border-current/10 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5`}
                style={{ borderColor: `${feature.color}18` }}
              >
                {/* Icon */}
                <div
                  className="h-11 w-11 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: `${feature.color}20` }}
                >
                  <Icon className="h-5 w-5" style={{ color: feature.color }} />
                </div>

                <h3 className="font-semibold text-base mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>

                {/* Subtle corner accent */}
                <div
                  className="absolute top-4 right-4 w-2 h-2 rounded-full opacity-40"
                  style={{ backgroundColor: feature.color }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
