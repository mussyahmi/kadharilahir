"use client";

import { useMemo, useState } from "react";
import type { InvitationFormData, Invitation } from "@/types/invitation";
import { TemplateCustomAI } from "@/components/public-invite/templates/TemplateCustomAI";
import { Eye, Sun, Moon } from "lucide-react";

interface Props {
  form: InvitationFormData;
  isEditing?: boolean;
}

function formToInvitation(form: InvitationFormData): Invitation {
  const dateObj = form.date ? new Date(form.date) : new Date();
  return {
    id: "__preview__",
    ownerId: "__preview__",
    slug: form.slug || "preview",
    birthdayPerson: form.birthdayPerson || "Nama Orang Hari Lahir",
    birthdayAge: form.birthdayAge,
    language: form.language ?? "ms",
    date: {
      toDate: () => dateObj,
      seconds: Math.floor(dateObj.getTime() / 1000),
      nanoseconds: 0,
    } as unknown as import("firebase/firestore").Timestamp,
    time: form.time,
    venue: form.venue,
    message: form.message,
    coverPhotoUrl: form.coverPhotoUrl,
    backgroundImageUrl: form.backgroundImageUrl,
    themeColor: form.themeColor || "#EC4899",
    templateId: "ai-custom",
    tagline: form.tagline,
    dressCode: form.dressCode,
    slots: form.slots,
    locationLat: form.locationLat,
    locationLng: form.locationLng,
    photoOffsetX: form.photoOffsetX,
    photoOffsetY: form.photoOffsetY,
    photoRadius: form.photoRadius,
    photoWidth: form.photoWidth,
    photoHeight: form.photoHeight,
    createdAt: null as unknown as import("firebase/firestore").Timestamp,
    updatedAt: null as unknown as import("firebase/firestore").Timestamp,
  };
}

export function InvitePreviewPanel({ form, isEditing }: Props) {
  const invitation = useMemo(() => formToInvitation(form), [form]);
  const [dark, setDark] = useState(false);

  return (
    <div className="hidden xl:flex flex-col gap-3 w-[420px] shrink-0">
      <div className="sticky top-6">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-3">
          <Eye className="h-4 w-4" />
          Pratonton Langsung
          <span className="ml-auto text-xs bg-muted px-2 py-0.5 rounded-full">Belum disimpan</span>
          <button
            type="button"
            onClick={() => setDark((d) => !d)}
            className="rounded-full p-1.5 border border-border hover:bg-muted transition-colors text-muted-foreground"
            title={dark ? "Tukar ke mod cerah" : "Tukar ke mod gelap"}
          >
            {dark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
          </button>
        </div>

        {/* Phone frame */}
        <div
          className="relative rounded-[2rem] border-4 border-foreground/10 bg-background overflow-hidden shadow-2xl"
          style={{ height: "calc(100vh - 7rem)" }}
        >
          <div className="absolute inset-0 overflow-y-auto overflow-x-hidden">
            <div style={{ zoom: 0.82 }}>
              <TemplateCustomAI invitation={invitation} preview={true} darkMode={dark} />
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-2">
          Klik{" "}
          <span className="font-medium">
            {isEditing ? "Simpan Perubahan" : "Cipta Jemputan"}
          </span>{" "}
          untuk {isEditing ? "mengemas kini" : "menerbitkan"}
        </p>
      </div>
    </div>
  );
}
