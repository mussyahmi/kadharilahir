"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { createInvitation, updateInvitation } from "@/lib/firestore";
import { uploadBackgroundImage } from "@/lib/storage";
import type { Invitation, InvitationFormData, Slot } from "@/types/invitation";
import { slugify } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeColorPicker } from "./ThemeColorPicker";
import { SongPicker } from "./SongPicker";
import { SlugInput } from "./SlugInput";
import { CoverPhotoUploader } from "./CoverPhotoUploader";
import { SlotManager } from "./SlotManager";
import { TextPresets } from "./TextPresets";
import { InvitePreviewPanel } from "./InvitePreviewPanel";
import { AiPromptGenerator } from "./AiPromptGenerator";
import { LocationPicker } from "./LocationPicker";
import { Loader2, Save, ArrowLeft, ImagePlus, X, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";

interface Props {
  initialData?: Invitation;
}

const DEFAULT_FORM: InvitationFormData = {
  birthdayPerson: "",
  birthdayAge: undefined,
  date: "",
  time: "",
  venue: "",
  message: "",
  coverPhotoUrl: "",
  backgroundImageUrl: "",
  themeColor: "#EC4899",
  templateId: "ai-custom",
  tagline: "",
  dressCode: "",
  slots: [],
  locationLat: undefined,
  locationLng: undefined,
  photoOffsetX: 0,
  photoOffsetY: 0,
  photoRadius: 8,
  photoWidth: 75,
  photoHeight: 50,
  songId: "piano",
  aiDesignStyle: "meriah",
  aiArtStyle: "ilustrasi",
  aiColorMood: "vibrant",
  language: "ms",
  slug: "",
};

export function InvitationForm({ initialData }: Props) {
  const router = useRouter();
  const { user } = useAuthStore();
  const isEditing = !!initialData;

  const toFormData = (inv: Invitation): InvitationFormData => ({
    birthdayPerson: inv.birthdayPerson,
    birthdayAge: inv.birthdayAge !== undefined ? String(inv.birthdayAge) : undefined,
    language: inv.language ?? "ms",
    date: inv.date?.toDate ? inv.date.toDate().toISOString().split("T")[0] : "",
    time: inv.time,
    venue: inv.venue,
    message: inv.message,
    coverPhotoUrl: inv.coverPhotoUrl,
    backgroundImageUrl: inv.backgroundImageUrl ?? "",
    themeColor: inv.themeColor,
    templateId: "ai-custom",
    tagline: inv.tagline ?? "",
    dressCode: inv.dressCode ?? "",
    slots: inv.slots ?? [],
    locationLat: inv.locationLat,
    locationLng: inv.locationLng,
    photoOffsetX: inv.photoOffsetX ?? 0,
    photoOffsetY: inv.photoOffsetY ?? 0,
    photoRadius: inv.photoRadius ?? 8,
    photoWidth: inv.photoWidth ?? 75,
    photoHeight: inv.photoHeight ?? 50,
    songId: inv.songId ?? "none",
    aiDesignStyle: inv.aiDesignStyle ?? "meriah",
    aiArtStyle: inv.aiArtStyle ?? "ilustrasi",
    aiColorMood: inv.aiColorMood ?? "vibrant",
    slug: inv.slug,
  });

  const [form, setForm] = useState<InvitationFormData>(
    initialData ? toFormData(initialData) : DEFAULT_FORM
  );
  const [saving, setSaving] = useState(false);
  const [bgUploading, setBgUploading] = useState(false);
  const [bgProgress, setBgProgress] = useState(0);
  const [showPrompt, setShowPrompt] = useState(false);
  const bgFileRef = useRef<HTMLInputElement>(null);

  const tempId = initialData?.id ?? `new-${user?.uid}-${Date.now()}`;

  const taglinePresets = [
    "Anda dijemput hadir ke majlis hari lahir",
    "Dengan penuh kegembiraan, kami menjemput anda ke majlis yang bermakna ini",
    "Kehadiran anda amat kami hargai dan nantikan",
  ];

  const messagePresets = [
    "Semoga Allah panjangkan umur, murahkan rezeki, dan sentiasa melindungi ananda yang dikasihi. Amin.",
    "Semoga membesar menjadi anak yang soleh, sihat, dan bahagia dunia akhirat. Amin ya Rabbal Alamin.",
    "Doa kami agar ananda sentiasa dalam rahmat dan kasih sayang Allah sepanjang hayat. Amin.",
  ];

  const set = (field: keyof InvitationFormData, value: string | number | undefined | Slot[]) => {
    setForm((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === "birthdayPerson" && !isEditing) {
        updated.slug = slugify(value as string);
      }
      return updated;
    });
  };

  const handleBgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Fail terlalu besar. Maksimum 10MB.");
      return;
    }
    setBgUploading(true);
    setBgProgress(0);
    try {
      const url = await uploadBackgroundImage(file, tempId, user?.uid ?? "", setBgProgress);
      set("backgroundImageUrl", url);
      toast.success("Gambar latar berjaya dimuat naik.");
    } catch {
      toast.error("Gagal memuat naik gambar latar.");
    } finally {
      setBgUploading(false);
      setBgProgress(0);
      if (bgFileRef.current) bgFileRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!form.birthdayPerson || !form.date || !form.slug) {
      toast.error("Sila isi semua maklumat wajib.");
      return;
    }
    if (form.slug.length < 3) {
      toast.error("URL jemputan mestilah sekurang-kurangnya 3 aksara.");
      return;
    }

    setSaving(true);
    try {
      if (isEditing) {
        await updateInvitation(initialData.id, form, initialData.slug);
        toast.success("Jemputan berjaya dikemaskini!");
      } else {
        await createInvitation(form, user.uid);
        toast.success("Jemputan berjaya dicipta!");
      }
      router.push("/papan-pemuka");
    } catch (err: unknown) {
      const msg = (err as { message?: string }).message ?? "";
      if (msg.includes("already exists") || msg.includes("permission")) {
        toast.error("URL jemputan ini telah digunakan. Sila pilih yang lain.");
      } else {
        toast.error("Gagal menyimpan jemputan. Sila cuba lagi.");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex gap-8 items-start">
    <form onSubmit={handleSubmit} className="space-y-6 flex-1 min-w-0">

      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild className="h-9 w-9 shrink-0">
          <Link href="/papan-pemuka">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">
            {isEditing ? "Edit Jemputan" : "Jemputan Baru"}
          </h1>
          <p className="text-muted-foreground text-sm">
            {isEditing ? "Kemaskini butiran jemputan anda" : "Isi semua maklumat, jana prompt AI, dan muat naik kad yang dijana"}
          </p>
        </div>
      </div>

      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Maklumat Asas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Language toggle */}
          <div className="space-y-2">
            <Label>Bahasa Kad</Label>
            <div className="flex gap-2">
              {(["ms", "en"] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => set("language", lang)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                    form.language === lang
                      ? "bg-foreground text-background border-foreground"
                      : "bg-background text-muted-foreground border-border hover:border-foreground/40"
                  }`}
                >
                  {lang === "ms" ? "🇲🇾 Bahasa Melayu" : "🇬🇧 English"}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="birthdayPerson">
                Nama Orang Hari Lahir <span className="text-destructive">*</span>
              </Label>
              <Input
                id="birthdayPerson"
                value={form.birthdayPerson}
                onChange={(e) => set("birthdayPerson", e.target.value)}
                placeholder="cth: Aisyah Binti Ahmad"
                required
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="birthdayAge">Milestone (pilihan)</Label>
              <Input
                id="birthdayAge"
                type="text"
                value={form.birthdayAge ?? ""}
                onChange={(e) =>
                  set("birthdayAge", e.target.value || undefined)
                }
                placeholder="cth: 1st Birthday!"
                className="h-11"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tagline">Ayat Pelawaan (pilihan)</Label>
            <Input
              id="tagline"
              value={form.tagline ?? ""}
              onChange={(e) => set("tagline", e.target.value)}
              placeholder="cth: Jemputan Hari Lahir"
              className="h-11"
            />
            <TextPresets
              presets={taglinePresets}
              value={form.tagline ?? ""}
              onSelect={(text) => set("tagline", text)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">
                Tarikh Majlis <span className="text-destructive">*</span>
              </Label>
              <Input
                id="date"
                type="date"
                value={form.date}
                onChange={(e) => set("date", e.target.value)}
                required
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Masa (pilihan jika guna slot)</Label>
              <Input
                id="time"
                type="text"
                value={form.time}
                onChange={(e) => set("time", e.target.value)}
                placeholder="cth: 8:00 Malam"
                className="h-11"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="venue">Lokasi / Tempat</Label>
            <Input
              id="venue"
              value={form.venue}
              onChange={(e) => set("venue", e.target.value)}
              placeholder="cth: Dewan Serbaguna, Taman Maju, KL"
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dressCode">Kod Pakaian (pilihan)</Label>
            <Input
              id="dressCode"
              value={form.dressCode ?? ""}
              onChange={(e) => set("dressCode", e.target.value)}
              placeholder="cth: Pakaian Santai & Comel"
              className="h-11"
            />
          </div>
        </CardContent>
      </Card>

      {/* Location */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Lokasi di Peta</CardTitle>
        </CardHeader>
        <CardContent>
          <LocationPicker
            lat={form.locationLat}
            lng={form.locationLng}
            onChange={(lat, lng) => {
              setForm((prev) => ({ ...prev, locationLat: lat, locationLng: lng }));
            }}
          />
        </CardContent>
      </Card>

      {/* Slots */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Slot Masa</CardTitle>
        </CardHeader>
        <CardContent>
          <SlotManager
            value={form.slots ?? []}
            onChange={(slots) => set("slots", slots)}
          />
        </CardContent>
      </Card>

      {/* Message */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Ucapan / Mesej</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Textarea
              value={form.message}
              onChange={(e) => set("message", e.target.value)}
              placeholder="cth: Semoga Allah panjangkan umur dan murahkan rezeki..."
              rows={4}
              className="resize-none"
            />
            <TextPresets
              presets={messagePresets}
              value={form.message}
              onSelect={(text) => set("message", text)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Cover Photo */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Gambar Orang Hari Lahir</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <CoverPhotoUploader
            value={form.coverPhotoUrl}
            onChange={(url) => set("coverPhotoUrl", url)}
            uid={user?.uid ?? ""}
            invitationId={tempId}
          />
          <p className="text-xs text-muted-foreground">
            Gambar ini akan ditampal secara automatik ke atas kawasan kosong dalam kad AI anda.
          </p>

          {/* Remove background tip */}
          <div className="rounded-lg border border-blue-200 bg-blue-50 dark:bg-blue-950/30 dark:border-blue-800 px-3 py-2.5 flex items-start gap-2">
            <span className="text-base leading-none mt-0.5">✂️</span>
            <p className="text-xs text-blue-800 dark:text-blue-200 leading-relaxed">
              Untuk hasil terbaik, buang latar belakang gambar terlebih dahulu.{" "}
              <a
                href="https://www.iloveimg.com/remove-background"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline underline-offset-2 hover:opacity-80"
              >
                Buang latar di sini →
              </a>
            </p>
          </div>

          {/* Position + radius controls */}
          <div className="space-y-4 pt-1 border-t">
            {/* Position nudge */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs">Kedudukan Gambar</Label>
                <button
                  type="button"
                  className="text-xs text-muted-foreground hover:text-foreground underline"
                  onClick={() => setForm((p) => ({ ...p, photoOffsetX: 0, photoOffsetY: 0 }))}
                >
                  Set semula
                </button>
              </div>
              <div className="flex flex-col items-center gap-1">
                <button type="button" onClick={() => setForm((p) => ({ ...p, photoOffsetY: Math.max(-15, (p.photoOffsetY ?? 0) - 1) }))}
                  className="w-9 h-9 rounded-lg border hover:bg-muted flex items-center justify-center text-lg">↑</button>
                <div className="flex gap-1">
                  <button type="button" onClick={() => setForm((p) => ({ ...p, photoOffsetX: Math.max(-15, (p.photoOffsetX ?? 0) - 1) }))}
                    className="w-9 h-9 rounded-lg border hover:bg-muted flex items-center justify-center text-lg">←</button>
                  <div className="w-9 h-9 rounded-lg border bg-muted/40 flex items-center justify-center text-xs text-muted-foreground">
                    {form.photoOffsetX ?? 0},{form.photoOffsetY ?? 0}
                  </div>
                  <button type="button" onClick={() => setForm((p) => ({ ...p, photoOffsetX: Math.min(15, (p.photoOffsetX ?? 0) + 1) }))}
                    className="w-9 h-9 rounded-lg border hover:bg-muted flex items-center justify-center text-lg">→</button>
                </div>
                <button type="button" onClick={() => setForm((p) => ({ ...p, photoOffsetY: Math.min(15, (p.photoOffsetY ?? 0) + 1) }))}
                  className="w-9 h-9 rounded-lg border hover:bg-muted flex items-center justify-center text-lg">↓</button>
              </div>
            </div>

            {/* Size */}
            <div className="space-y-3">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs">Lebar — {form.photoWidth ?? 75}%</Label>
                </div>
                <input
                  type="range"
                  min={30}
                  max={100}
                  step={1}
                  value={form.photoWidth ?? 75}
                  onChange={(e) => set("photoWidth", parseInt(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs">Tinggi — {form.photoHeight ?? 50}%</Label>
                </div>
                <input
                  type="range"
                  min={20}
                  max={80}
                  step={1}
                  value={form.photoHeight ?? 50}
                  onChange={(e) => set("photoHeight", parseInt(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>
            </div>

            {/* Border radius */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs">Bucu Bulat — {form.photoRadius ?? 8}%</Label>
                <div className="flex gap-1">
                  {[0, 8, 20, 50].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => set("photoRadius", v)}
                      className={`text-xs px-2 py-1 rounded border transition-colors ${(form.photoRadius ?? 8) === v ? "bg-primary text-white border-primary" : "hover:bg-muted border-border"}`}
                    >
                      {v === 0 ? "Tajam" : v === 8 ? "Biasa" : v === 20 ? "Bulat" : "Oval"}
                    </button>
                  ))}
                </div>
              </div>
              <input
                type="range"
                min={0}
                max={50}
                step={1}
                value={form.photoRadius ?? 8}
                onChange={(e) => set("photoRadius", parseInt(e.target.value))}
                className="w-full accent-primary"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Theme Color */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Warna Tema</CardTitle>
        </CardHeader>
        <CardContent>
          <ThemeColorPicker
            value={form.themeColor}
            onChange={(color) => set("themeColor", color)}
          />
        </CardContent>
      </Card>

      {/* Lagu Hari Lahir */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">🎵 Lagu Hari Lahir</CardTitle>
          <CardDescription>Pilih muzik latar untuk kad jemputan anda.</CardDescription>
        </CardHeader>
        <CardContent>
          <SongPicker value={form.songId ?? "none"} onChange={(id) => setForm((f) => ({ ...f, songId: id }))} />
        </CardContent>
      </Card>

      {/* AI Prompt Generator — button-triggered */}
      <Card className="border-violet-200 dark:border-violet-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Jana Prompt AI</CardTitle>
            <Button
              type="button"
              variant={showPrompt ? "secondary" : "default"}
              size="sm"
              onClick={() => setShowPrompt((v) => !v)}
              className="gap-1.5"
            >
              <Sparkles className="h-3.5 w-3.5" />
              {showPrompt ? "Sembunyikan" : "Jana Prompt"}
              {showPrompt ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            </Button>
          </div>
          {!showPrompt && (
            <p className="text-xs text-muted-foreground mt-1">
              Klik untuk jana prompt JSON yang boleh digunakan dengan ChatGPT, Midjourney, atau mana-mana AI image generator.
            </p>
          )}
        </CardHeader>
        {showPrompt && (
          <CardContent>
            <AiPromptGenerator
              form={form}
              onStyleChange={(styleId, artId, moodId) => {
                setForm((f) => ({ ...f, aiDesignStyle: styleId, aiArtStyle: artId, aiColorMood: moodId }));
              }}
            />
          </CardContent>
        )}
      </Card>

      {/* Background Image Upload */}
      <Card className="border-violet-200 dark:border-violet-800">
        <CardHeader>
          <CardTitle className="text-base">Gambar Latar Belakang (Hasil AI)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">
              Muat naik gambar kad yang dijana oleh AI. Gambar orang hari lahir akan ditampal secara automatik di atasnya dengan kesan blend.
            </p>
            <div
              className="relative w-full rounded-lg border-2 border-dashed border-border overflow-hidden cursor-pointer hover:border-primary/50 transition-colors"
              style={{ aspectRatio: "2/3", maxHeight: 420 }}
              onClick={() => !bgUploading && bgFileRef.current?.click()}
            >
              {form.backgroundImageUrl ? (
                <>
                  <Image src={form.backgroundImageUrl} alt="Background" fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                    <p className="text-white text-sm font-medium">Tukar gambar</p>
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-7 w-7"
                    onClick={(e) => { e.stopPropagation(); set("backgroundImageUrl", ""); }}
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground">
                  {bgUploading ? (
                    <>
                      <Loader2 className="h-8 w-8 animate-spin" />
                      <p className="text-sm">{Math.round(bgProgress)}%</p>
                    </>
                  ) : (
                    <>
                      <ImagePlus className="h-8 w-8" />
                      <p className="text-sm">Klik untuk muat naik gambar AI</p>
                      <p className="text-xs">PNG, JPG hingga 10MB · Nisbah 2:3 (potret)</p>
                    </>
                  )}
                </div>
              )}
              {bgUploading && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted">
                  <div className="h-full bg-primary transition-all" style={{ width: `${bgProgress}%` }} />
                </div>
              )}
            </div>
            <input
              ref={bgFileRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={handleBgUpload}
            />
          </div>
        </CardContent>
      </Card>

      {/* URL Jemputan */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">URL Jemputan</CardTitle>
        </CardHeader>
        <CardContent>
          <SlugInput
            value={form.slug}
            onChange={(slug) => set("slug", slug)}
            currentSlug={initialData?.slug}
          />
        </CardContent>
      </Card>

      <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
        <Button type="button" variant="outline" asChild className="w-full sm:w-auto">
          <Link href="/papan-pemuka">Batal</Link>
        </Button>
        <Button type="submit" disabled={saving} className="w-full sm:w-auto gap-2">
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {isEditing ? "Simpan Perubahan" : "Cipta Jemputan"}
        </Button>
      </div>
    </form>
    <InvitePreviewPanel form={form} isEditing={!!initialData} />
    </div>
  );
}
