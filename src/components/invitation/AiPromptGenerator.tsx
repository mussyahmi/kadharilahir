"use client";

import { useMemo, useState } from "react";
import type { InvitationFormData } from "@/types/invitation";
import { formatTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";

interface Props {
  form: InvitationFormData;
  onStyleChange?: (styleId: string, artId: string, moodId: string) => void;
}

// ── Design option definitions ────────────────────────────────────────────────

const DESIGN_STYLES = [
  {
    id: "bayi",
    label: "🐰 Bayi Kawaii",
    desc: "Adorable baby/toddler theme. Kawaii animals, fluffy clouds, rainbow, pastel nursery aesthetic.",
    decorations: "Cute kawaii animals (elephant, bunny, teddy bear, chick), fluffy clouds, crescent moon with face, rainbow, pastel balloons, mini stars, hearts, cupcakes, gift boxes, party hats. All soft and rounded, very cute style.",
    bg: "Soft pastel pink (or theme color) gradient background with a decorative illustrated border of clouds, stars, and cute animals framing all four sides. Gentle heart or dot texture overlay.",
  },
  {
    id: "meriah",
    label: "🎉 Meriah",
    desc: "Colorful, festive, whimsical. Balloons, confetti, ribbons, stars. Bright and playful.",
    decorations: "Balloons, confetti, stars, ribbons, streamers, cupcakes, gift boxes.",
    bg: "Bright festive gradient with illustrated decorative elements filling the borders.",
  },
  {
    id: "elegan",
    label: "✨ Elegan",
    desc: "Elegant and luxurious. Gold foil accents, floral motifs, serif typography, premium feel.",
    decorations: "Gold leaf, roses, peonies, pearls, delicate lace patterns, geometric gold frames.",
    bg: "Deep rich background (ivory, champagne, deep navy or blush) with gold and floral embellishments.",
  },
  {
    id: "minimalis",
    label: "◻ Minimalis",
    desc: "Clean, modern, minimal. Lots of white space, simple geometric accents, sans-serif.",
    decorations: "Thin lines, simple geometric shapes, small dots or dashes in theme color only.",
    bg: "White or very light neutral background with only subtle minimal accents.",
  },
  {
    id: "catair",
    label: "🌸 Cat Air",
    desc: "Soft watercolor painting style. Floral, dreamy, pastel. Hand-painted feel.",
    decorations: "Watercolor flowers (roses, daisies, wildflowers), soft brushstroke borders, botanical leaves.",
    bg: "Soft watercolor wash background blending pastel shades of the theme color.",
  },
  {
    id: "tropika",
    label: "🌴 Tropika",
    desc: "Tropical garden vibes. Lush leaves, hibiscus, paradise aesthetic.",
    decorations: "Tropical leaves (monstera, palm), hibiscus flowers, exotic birds, fruits.",
    bg: "Lush tropical green with pops of theme color flowers. Warm sunshine gradient.",
  },
  {
    id: "fantasi",
    label: "🌟 Fantasi",
    desc: "Magical, dreamy, fairy-tale. Stars, galaxies, sparkles, enchanted forest.",
    decorations: "Stars, sparkles, moons, fairy lights, magical dust, enchanted motifs.",
    bg: "Deep starry sky or gradient aurora background with magical glowing elements.",
  },
  {
    id: "retro",
    label: "🎞 Retro",
    desc: "Vintage retro style. Nostalgic patterns, distressed textures, classic look.",
    decorations: "Retro banners, pennant flags, polka dots, vintage floral, aged paper texture.",
    bg: "Warm vintage background with aged paper or retro pattern texture.",
  },
] as const;

type DesignStyleId = (typeof DESIGN_STYLES)[number]["id"];

const ART_STYLES = [
  {
    id: "ilustrasi",
    label: "🖍 Ilustrasi",
    desc: "Hand-drawn illustration / cartoon style. Charming and friendly.",
  },
  {
    id: "catair-art",
    label: "🎨 Cat Air",
    desc: "Loose watercolor painting. Soft edges, painterly texture.",
  },
  {
    id: "3d",
    label: "💎 3D Render",
    desc: "3D rendered elements. Glossy, dimensional, modern.",
  },
  {
    id: "flat",
    label: "◼ Flat Design",
    desc: "Flat vector design. Bold shapes, clean silhouettes.",
  },
  {
    id: "realistik",
    label: "📷 Foto Realistik",
    desc: "Photorealistic style. Lifelike flowers, decorations, textures.",
  },
] as const;

type ArtStyleId = (typeof ART_STYLES)[number]["id"];

const COLOR_MOODS = [
  {
    id: "pastel",
    label: "🍬 Pastel",
    desc: "Soft pastel tones. Muted, gentle, dreamy palette.",
  },
  {
    id: "vibrant",
    label: "🌈 Vibrant",
    desc: "Bold, saturated, high-contrast. Eye-catching and energetic.",
  },
  {
    id: "mono",
    label: "◑ Monokromatik",
    desc: "Shades of a single color. Refined and cohesive.",
  },
  {
    id: "gelap",
    label: "🌑 Gelap",
    desc: "Dark, moody, dramatic. Deep backgrounds with luminous accents.",
  },
] as const;

type ColorMoodId = (typeof COLOR_MOODS)[number]["id"];

// ── Prompt builder ───────────────────────────────────────────────────────────

function formatDateForPrompt(dateStr: string) {
  if (!dateStr) return undefined;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return undefined;
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  return {
    date: `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`,
    day: days[d.getDay()],
  };
}

function buildPrompt(
  form: InvitationFormData,
  styleId: DesignStyleId,
  artId: ArtStyleId,
  moodId: ColorMoodId
): object {
  const dateInfo = formatDateForPrompt(form.date);
  const hasSlots = form.slots && form.slots.length > 0;
  const slotsText = hasSlots
    ? form.slots!.map((s) => `${formatTime(s.startTime)} – ${formatTime(s.endTime)} ${s.label}`)
    : undefined;

  const style = DESIGN_STYLES.find((s) => s.id === styleId)!;
  const art = ART_STYLES.find((a) => a.id === artId)!;
  const mood = COLOR_MOODS.find((m) => m.id === moodId)!;

  return {
    task: "Generate a birthday invitation card image (portrait format, 2:3 ratio, 1080×1620px)",
    birthday_person: form.birthdayPerson || "Birthday Person Name",
    milestone: form.birthdayAge || undefined,
    tagline: form.tagline || "You are invited to celebrate",
    theme_color: form.themeColor,
    photo_overlay_info: {
      technique: "The birthday person's photo will have its background REMOVED (transparent PNG) and overlaid directly onto this card. Design the card background to complement a person standing/sitting in the center-top area.",
      position: "Person will appear horizontally centered, top edge at ~18% from top, occupying ~75% width and ~50% height of the card",
      design_guidance: [
        "Design the background BEHIND where the person will be as relatively clean, soft, or gradient — so the subject stands out naturally",
        "You can add a subtle glowing halo, soft bokeh, radiant light, or vignette effect in that zone to help the subject pop",
        "Decorative elements (flowers, particles, bokeh) can partially overlap the subject area for depth — they will appear behind the removed-background photo",
        "DO NOT place hard text, logos, or busy patterns directly behind the subject area",
        styleId === "bayi"
          ? "For baby theme: place a soft fluffy cloud or rounded arch as a decorative frame around the subject area. DO NOT draw any person, baby, or character inside this zone — it must be left empty for the photo composite."
          : "A decorative frame, arch, or border around the subject zone looks great and is encouraged. DO NOT draw any person or character inside this zone.",
      ],
    },
    event_details_on_card: {
      date: dateInfo?.date,
      day: dateInfo?.day,
      time_slots: slotsText,
      single_time: !hasSlots && form.time ? formatTime(form.time) : undefined,
      dress_code: form.dressCode || undefined,
      placement: "Bottom portion of the card (below the subject area). Place inside a decorative banner, ribbon, or cloud shape matching the card style. Use a clean, legible font.",
      note: "Include all the above event details clearly on the card, just like a printed invitation.",
    },
    design_instructions: {
      overall_style: style.desc,
      art_style: art.desc,
      color_mood: mood.desc,
      theme_color_hex: form.themeColor,
      decorations: `${style.decorations} All in palette matching theme color ${form.themeColor} with ${mood.desc.toLowerCase()} color treatment.`,
      background: style.bg,
      text_layout: [
        "TOP: Tagline text",
        "CENTER-TOP (~18-68% height): Subject photo area (keep background clean/soft here)",
        "BELOW SUBJECT: Birthday person name prominently, then milestone (e.g. '1st Birthday!')",
        "BOTTOM: Event date, day, time slots, dress code — inside a decorative banner or cloud shape",
      ],
      do_not_include: [
        "Do NOT include venue address or map on the card",
        "Do NOT include location coordinates on the card",
      ],
      important: [
        "IMPORTANT: Do NOT draw any person, baby, child, or human figure anywhere on the card. The birthday person's photo will be added separately as a transparent PNG overlay.",
        "The subject area (~18–68% from top, center) must be left as a clean, soft, empty background — a real photo will be placed there later.",
        "A glowing radial light or soft gradient in the subject area adds depth for when the photo is composited on top.",
        "All text must be legible and correctly spelled",
        "Card must be portrait orientation (taller than wide)",
        `Art style: ${art.desc}`,
        `Color mood: ${mood.desc}`,
      ],
    },
  };
}

// ── Pill selector ────────────────────────────────────────────────────────────

function PillGroup<T extends string>({
  options,
  value,
  onChange,
}: {
  options: readonly { id: T; label: string; desc: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          title={opt.desc}
          onClick={() => onChange(opt.id)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
            value === opt.id
              ? "bg-foreground text-background border-foreground"
              : "bg-background text-muted-foreground border-border hover:border-foreground/40"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────

export function AiPromptGenerator({ form, onStyleChange }: Props) {
  const [copied, setCopied] = useState(false);
  const [styleId, setStyleId] = useState<DesignStyleId>(
    (form.aiDesignStyle as DesignStyleId) ?? "meriah"
  );
  const [artId, setArtId] = useState<ArtStyleId>(
    (form.aiArtStyle as ArtStyleId) ?? "ilustrasi"
  );
  const [moodId, setMoodId] = useState<ColorMoodId>(
    (form.aiColorMood as ColorMoodId) ?? "vibrant"
  );

  const handleStyleChange = (s: DesignStyleId) => { setStyleId(s); onStyleChange?.(s, artId, moodId); };
  const handleArtChange = (a: ArtStyleId) => { setArtId(a); onStyleChange?.(styleId, a, moodId); };
  const handleMoodChange = (m: ColorMoodId) => { setMoodId(m); onStyleChange?.(styleId, artId, m); };

  const prompt = useMemo(
    () => buildPrompt(form, styleId, artId, moodId),
    [form, styleId, artId, moodId]
  );
  const promptText = JSON.stringify(prompt, null, 2);

  const copy = async () => {
    await navigator.clipboard.writeText(promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">

      {/* Design style pickers */}
      <div className="space-y-3">
        <div>
          <p className="text-xs font-semibold text-foreground mb-1.5">Gaya Reka Bentuk</p>
          <PillGroup options={DESIGN_STYLES} value={styleId} onChange={handleStyleChange} />
          <p className="text-[11px] text-muted-foreground mt-1.5 italic">
            {DESIGN_STYLES.find((s) => s.id === styleId)?.desc}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold text-foreground mb-1.5">Gaya Seni</p>
          <PillGroup options={ART_STYLES} value={artId} onChange={handleArtChange} />
          <p className="text-[11px] text-muted-foreground mt-1.5 italic">
            {ART_STYLES.find((a) => a.id === artId)?.desc}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold text-foreground mb-1.5">Suasana Warna</p>
          <PillGroup options={COLOR_MOODS} value={moodId} onChange={handleMoodChange} />
          <p className="text-[11px] text-muted-foreground mt-1.5 italic">
            {COLOR_MOODS.find((m) => m.id === moodId)?.desc}
          </p>
        </div>
      </div>

      <div className="border-t pt-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Prompt untuk AI Image Generator</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Salin dan tampal ke ChatGPT, Midjourney, atau mana-mana AI yang boleh jana gambar.
            </p>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={copy} className="shrink-0 gap-1.5">
            {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Disalin!" : "Salin Prompt"}
          </Button>
        </div>

        <pre className="text-[11px] leading-relaxed bg-muted rounded-lg p-4 overflow-auto max-h-64 border text-muted-foreground whitespace-pre-wrap">
          {promptText}
        </pre>

        <div className="rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800 p-3 text-xs text-amber-800 dark:text-amber-200 space-y-1">
          <p className="font-semibold">Cara guna:</p>
          <ol className="list-decimal list-inside space-y-0.5 text-amber-700 dark:text-amber-300">
            <li>Pilih gaya reka bentuk, gaya seni, dan suasana warna di atas</li>
            <li>Salin prompt di atas</li>
            <li>Tampal ke ChatGPT (DALL·E), Midjourney, atau Canva AI</li>
            <li>Jana gambar dan muat turun hasilnya</li>
            <li>Muat naik gambar tersebut sebagai <strong>Gambar Latar Belakang</strong> di bawah</li>
            <li>
              Buang latar belakang gambar orang hari lahir di{" "}
              <a
                href="https://www.iloveimg.com/remove-background"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline underline-offset-2 hover:opacity-80"
              >
                iloveimg.com/remove-background
              </a>
            </li>
            <li>Muat naik gambar orang hari lahir sebagai <strong>Gambar Orang Hari Lahir</strong> — ia akan ditampal secara automatik</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
