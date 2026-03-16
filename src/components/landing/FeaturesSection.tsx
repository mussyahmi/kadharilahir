import { Card, CardContent } from "@/components/ui/card";
import { ImagePlus, Link2, Users, Palette, Share2, Smartphone } from "lucide-react";

const FEATURES = [
  {
    icon: ImagePlus,
    title: "Gambar Muka Depan",
    description: "Muat naik gambar cantik sebagai latar belakang jemputan anda.",
    color: "#EC4899",
  },
  {
    icon: Palette,
    title: "Warna Tema Sendiri",
    description: "Pilih warna tema yang sesuai dengan majlis hari lahir.",
    color: "#A855F7",
  },
  {
    icon: Link2,
    title: "Pautan Unik",
    description: "Setiap jemputan mendapat URL yang mudah dikongsi.",
    color: "#3B82F6",
  },
  {
    icon: Users,
    title: "Urus Tetamu RSVP",
    description: "Lihat siapa yang hadir dan tidak hadir secara masa nyata.",
    color: "#10B981",
  },
  {
    icon: Share2,
    title: "Kongsi Dengan Mudah",
    description: "Hantar pautan melalui WhatsApp, Telegram, atau media sosial.",
    color: "#F59E0B",
  },
  {
    icon: Smartphone,
    title: "Mesra Mudah Alih",
    description: "Reka bentuk responsif, cantik di telefon dan komputer.",
    color: "#6366F1",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-16 md:py-24 px-4" id="ciri-ciri">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ciri-ciri Utama</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Semua yang anda perlukan untuk mencipta jemputan hari lahir yang sempurna.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6 space-y-3">
                  <div
                    className="h-11 w-11 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${feature.color}15` }}
                  >
                    <Icon className="h-5 w-5" style={{ color: feature.color }} />
                  </div>
                  <h3 className="font-semibold text-base">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
