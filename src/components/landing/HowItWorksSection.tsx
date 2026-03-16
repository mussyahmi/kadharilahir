const STEPS = [
  {
    number: "01",
    title: "Daftar Akaun",
    description: "Cipta akaun percuma dengan e-mel atau Google dalam masa beberapa saat.",
  },
  {
    number: "02",
    title: "Isi Maklumat Jemputan",
    description: "Masukkan nama, tarikh majlis, lokasi, dan pilih warna tema kegemaran anda.",
  },
  {
    number: "03",
    title: "Kongsi Pautan",
    description: "Salin pautan unik dan hantar kepada tetamu melalui WhatsApp atau media sosial.",
  },
  {
    number: "04",
    title: "Urus Kehadiran",
    description: "Lihat maklum balas tetamu secara masa nyata dari papan pemuka anda.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-16 md:py-24 px-4 bg-muted/30" id="cara-guna">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Cara Guna</h2>
          <p className="text-muted-foreground text-lg">
            Empat langkah mudah untuk mencipta jemputan digital yang menakjubkan.
          </p>
        </div>

        <div className="space-y-6 md:space-y-0 md:grid md:grid-cols-2 md:gap-8">
          {STEPS.map((step, index) => (
            <div key={step.number} className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                  {step.number}
                </div>
                {index < 3 && (
                  <div className="w-0.5 h-6 bg-gradient-to-b from-purple-500 to-transparent mx-auto mt-1 hidden md:block" />
                )}
              </div>
              <div className="pt-1.5">
                <h3 className="font-semibold text-base mb-1">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
