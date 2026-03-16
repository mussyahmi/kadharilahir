"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";
import { Check, Pipette } from "lucide-react";

const PRESETS = [
  { hex: "#EC4899", label: "Pink" },
  { hex: "#A855F7", label: "Ungu" },
  { hex: "#3B82F6", label: "Biru" },
  { hex: "#10B981", label: "Hijau" },
  { hex: "#F59E0B", label: "Emas" },
  { hex: "#EF4444", label: "Merah" },
  { hex: "#06B6D4", label: "Cyan" },
  { hex: "#F97316", label: "Oren" },
  { hex: "#8B5CF6", label: "Violet" },
  { hex: "#6366F1", label: "Indigo" },
];

interface Props {
  value: string;
  onChange: (color: string) => void;
}

export function ThemeColorPicker({ value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const isCustom = !PRESETS.some((c) => c.hex === value);

  return (
    <div className="flex flex-wrap gap-3 items-center">
      {PRESETS.map((color) => (
        <button
          key={color.hex}
          type="button"
          title={color.label}
          onClick={() => onChange(color.hex)}
          className={cn(
            "relative h-9 w-9 rounded-full transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            value === color.hex && "ring-2 ring-ring ring-offset-2"
          )}
          style={{ backgroundColor: color.hex }}
        >
          {value === color.hex && (
            <Check className="absolute inset-0 m-auto h-4 w-4 text-white drop-shadow" />
          )}
        </button>
      ))}

      {/* Custom color swatch (shown when a non-preset color is active) */}
      {isCustom && (
        <div
          className="relative h-9 w-9 rounded-full ring-2 ring-ring ring-offset-2 shrink-0"
          style={{ backgroundColor: value }}
        >
          <Check className="absolute inset-0 m-auto h-4 w-4 text-white drop-shadow" />
        </div>
      )}

      {/* Color picker trigger */}
      <button
        type="button"
        title="Pilih warna lain"
        onClick={() => inputRef.current?.click()}
        className={cn(
          "relative h-9 w-9 rounded-full border-2 border-dashed border-muted-foreground/40 flex items-center justify-center transition-colors hover:border-muted-foreground/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        )}
      >
        <Pipette className="h-4 w-4 text-muted-foreground" />
        <input
          ref={inputRef}
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="sr-only"
          aria-label="Pilih warna tema"
        />
      </button>
    </div>
  );
}
