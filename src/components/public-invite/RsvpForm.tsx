"use client";

import { useState } from "react";
import { addRsvp } from "@/lib/firestore";
import type { Slot } from "@/types/invitation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn, formatTime } from "@/lib/utils";

const T = {
  ms: {
    errAttend: "Sila pilih sama ada anda akan hadir atau tidak.",
    errSlot: "Sila pilih slot masa kehadiran anda.",
    successToast: "Maklum balas anda telah dihantar!",
    errorToast: "Gagal menghantar maklum balas. Sila cuba lagi.",
    thankYou: "Terima Kasih!",
    confirmAttend: "Maklum balas anda telah diterima. Jumpa anda di majlis!",
    confirmDecline: "Maklum balas anda telah diterima. Kami faham dan terima kasih kerana memaklumkan.",
    nameLabel: "Nama Anda",
    namePlaceholder: "cth: Ahmad bin Abu",
    attendanceLabel: "Kehadiran",
    yesAttend: "✓ Ya, saya hadir",
    noAttend: "✗ Tidak dapat hadir",
    selectSlot: "Pilih Slot Masa",
    messageLabel: "Pesanan (pilihan)",
    messagePlaceholder: "Tinggalkan ucapan atau mesej...",
    previewOnly: "Pratonton Sahaja",
    submit: "Hantar Maklum Balas",
  },
  en: {
    errAttend: "Please select whether you will attend or not.",
    errSlot: "Please select a time slot.",
    successToast: "Your response has been submitted!",
    errorToast: "Failed to submit. Please try again.",
    thankYou: "Thank You!",
    confirmAttend: "Your response has been received. See you at the party!",
    confirmDecline: "Your response has been received. We understand and thank you for letting us know.",
    nameLabel: "Your Name",
    namePlaceholder: "e.g. John Smith",
    attendanceLabel: "Attendance",
    yesAttend: "✓ Yes, I'll be there",
    noAttend: "✗ Sorry, can't make it",
    selectSlot: "Select Time Slot",
    messageLabel: "Message (optional)",
    messagePlaceholder: "Leave a wish or message...",
    previewOnly: "Preview Only",
    submit: "Submit RSVP",
  },
};

interface Props {
  invitationId: string;
  themeColor: string;
  slots?: Slot[];
  dark?: boolean;
  preview?: boolean;
  language?: "ms" | "en";
}

export function RsvpForm({ invitationId, themeColor, slots, dark, preview, language }: Props) {
  const [guestName, setGuestName] = useState("");
  const [attending, setAttending] = useState<boolean | null>(null);
  const [slotId, setSlotId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const t = T[language ?? "ms"];
  const hasSlots = slots && slots.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (attending === null) { toast.error(t.errAttend); return; }
    if (attending && hasSlots && !slotId) { toast.error(t.errSlot); return; }
    setSubmitting(true);
    try {
      await addRsvp(invitationId, { guestName, attending, message, slotId: slotId ?? undefined });
      setSubmitted(true);
      toast.success(t.successToast);
    } catch {
      toast.error(t.errorToast);
    } finally {
      setSubmitting(false);
    }
  };

  const textClass = dark ? "text-white" : "";
  const mutedClass = dark ? "text-white/50" : "text-muted-foreground";
  const inputClass = dark ? "bg-white/10 border-white/20 text-white placeholder:text-white/40" : "";

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-3 py-8 text-center">
        <div className="h-14 w-14 rounded-full flex items-center justify-center" style={{ backgroundColor: `${themeColor}20` }}>
          <CheckCircle2 className="h-7 w-7" style={{ color: themeColor }} />
        </div>
        <h3 className={cn("font-semibold text-lg", textClass)}>{t.thankYou}</h3>
        <p className={cn("text-sm", mutedClass)}>
          {attending ? t.confirmAttend : t.confirmDecline}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="guestName" className={textClass}>
          {t.nameLabel} <span className="text-destructive">*</span>
        </Label>
        <Input
          id="guestName"
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
          placeholder={t.namePlaceholder}
          required
          className={cn("h-11", inputClass)}
        />
      </div>

      <div className="space-y-2">
        <Label className={textClass}>
          {t.attendanceLabel} <span className="text-destructive">*</span>
        </Label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setAttending(true)}
            className={cn(
              "h-11 rounded-lg border-2 text-sm font-medium transition-all",
              attending === true ? "text-white border-transparent"
                : dark ? "border-white/20 text-white hover:border-white/50"
                : "border-border hover:border-primary/50"
            )}
            style={attending === true ? { backgroundColor: themeColor, borderColor: themeColor } : {}}
          >
            {t.yesAttend}
          </button>
          <button
            type="button"
            onClick={() => { setAttending(false); setSlotId(null); }}
            className={cn(
              "h-11 rounded-lg border-2 text-sm font-medium transition-all",
              attending === false ? "text-white border-transparent"
                : dark ? "border-white/20 text-white hover:border-white/50"
                : "border-border hover:border-primary/50"
            )}
            style={attending === false ? { backgroundColor: themeColor, borderColor: themeColor } : {}}
          >
            {t.noAttend}
          </button>
        </div>
      </div>

      {attending === true && hasSlots && (
        <div className="space-y-2">
          <Label className={textClass}>
            {t.selectSlot} <span className="text-destructive">*</span>
          </Label>
          <div className="space-y-2">
            {slots!.map((slot) => (
              <button
                key={slot.id}
                type="button"
                onClick={() => setSlotId(slot.id)}
                className={cn(
                  "w-full flex justify-between items-center rounded-lg border-2 px-4 py-2.5 text-sm font-medium transition-all",
                  slotId === slot.id ? "text-white border-transparent"
                    : dark ? "border-white/20 text-white hover:border-white/50"
                    : "border-border hover:border-primary/50"
                )}
                style={slotId === slot.id ? { backgroundColor: themeColor, borderColor: themeColor } : {}}
              >
                <span>{slot.label}</span>
                <span className={slotId === slot.id ? "text-white/80 text-xs" : cn("text-xs", mutedClass)}>
                  {formatTime(slot.startTime)} – {formatTime(slot.endTime)}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="rsvpMessage" className={textClass}>{t.messageLabel}</Label>
        <Textarea
          id="rsvpMessage"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={t.messagePlaceholder}
          rows={3}
          className={cn("resize-none", inputClass)}
        />
      </div>

      <Button
        type="submit"
        disabled={submitting || preview}
        className="w-full h-11 text-white"
        style={{ backgroundColor: themeColor, borderColor: themeColor, opacity: preview ? 0.6 : 1 }}
      >
        {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
        {preview ? t.previewOnly : t.submit}
      </Button>
    </form>
  );
}
