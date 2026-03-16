import { CTAAuthButton } from "@/components/landing/CTAAuthButton";

const SHAPES = [
  { shape: "✦", t: "10%", l: "6%", s: 22, op: 0.2 },
  { shape: "♥", t: "20%", l: "92%", s: 18, op: 0.18 },
  { shape: "✦", t: "80%", l: "8%", s: 14, op: 0.15 },
  { shape: "♥", t: "75%", l: "88%", s: 20, op: 0.18 },
  { shape: "✦", t: "50%", l: "96%", s: 12, op: 0.12 },
  { shape: "♥", t: "45%", l: "2%", s: 16, op: 0.15 },
];

export function CTASection() {
  return (
    <section className="py-16 md:py-24 px-4">
      <div className="mx-auto max-w-4xl">
        <div
          className="relative overflow-hidden rounded-3xl p-10 md:p-16 text-white text-center"
          style={{
            background: "linear-gradient(135deg, #be185d 0%, #7c3aed 50%, #1d4ed8 100%)",
          }}
        >
          {/* Large blurred circle decorations */}
          <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-white/5 blur-3xl pointer-events-none" />

          {/* Floating symbols */}
          {SHAPES.map((s, i) => (
            <span
              key={i}
              className="absolute pointer-events-none select-none"
              style={{ top: s.t, left: s.l, fontSize: s.s, opacity: s.op }}
            >
              {s.shape}
            </span>
          ))}

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 border border-white/20 px-4 py-1.5 text-sm font-semibold mb-6 backdrop-blur-sm">
              ✦ KadHariLahir
            </div>

            <h2 className="text-3xl md:text-5xl font-bold mb-5 leading-tight">
              Cipta Kad Jemputan Hari Lahir Digital Pertama{" "}
              <span className="text-yellow-300">Anda Hari Ini</span>
            </h2>

            <p className="text-white/75 text-base md:text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
              Bergabung dengan ibu bapa dan penganjur majlis yang menggunakan KadHariLahir untuk mencipta pengalaman jemputan yang tidak dilupakan.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <CTAAuthButton />
            </div>

            <p className="mt-6 text-white/50 text-sm">Sedia dalam beberapa minit • Mudah dikongsi melalui WhatsApp</p>
          </div>
        </div>
      </div>
    </section>
  );
}
