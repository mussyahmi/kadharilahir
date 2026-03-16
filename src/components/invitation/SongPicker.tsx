"use client";

import { useRef, useState } from "react";
import { SONGS } from "@/data/songs";
import { BirthdaySynth } from "@/lib/birthdaySynth";
import { Play, Square } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  value: string;
  onChange: (id: string) => void;
}

export function SongPicker({ value, onChange }: Props) {
  const [previewId, setPreviewId] = useState<string | null>(null);
  const synthRef = useRef<BirthdaySynth | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stopPreview = () => {
    synthRef.current?.pause();
    synthRef.current = null;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setPreviewId(null);
  };

  const togglePreview = (id: string) => {
    if (previewId === id) { stopPreview(); return; }
    stopPreview();

    const style = SONGS.find((s) => s.id === id);
    if (!style || style.id === "none") return;

    if (style.type === "audio" && style.audioUrl) {
      const audio = new Audio(style.audioUrl);
      audio.volume = 0.7;
      audio.play().catch(() => {});
      audioRef.current = audio;
      audio.onended = () => setPreviewId(null);
    } else if (style.type === "synth") {
      const synth = new BirthdaySynth(style);
      synth.play();
      synthRef.current = synth;
    }

    setPreviewId(id);
  };

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {SONGS.map((song) => {
          const isSelected = value === song.id;
          const isPreviewing = previewId === song.id;
          return (
            <div
              key={song.id}
              onClick={() => { onChange(song.id); if (isPreviewing) stopPreview(); }}
              className={cn(
                "relative rounded-xl border-2 p-3 cursor-pointer transition-all",
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/40"
              )}
            >
              <div className="flex items-center justify-between gap-1">
                <div className="min-w-0">
                  <p className="text-sm font-medium leading-tight">
                    {song.emoji} {song.label}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5 leading-tight">{song.desc}</p>
                </div>
                {song.id !== "none" && (
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); togglePreview(song.id); }}
                    className="shrink-0 rounded-full w-7 h-7 flex items-center justify-center bg-muted hover:bg-muted/80 transition-colors"
                    title={isPreviewing ? "Berhenti" : "Pratonton"}
                  >
                    {isPreviewing
                      ? <Square className="h-3 w-3 fill-current" />
                      : <Play className="h-3 w-3 fill-current" />
                    }
                  </button>
                )}
              </div>
              {isSelected && (
                <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}
