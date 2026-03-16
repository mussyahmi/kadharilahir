"use client";

import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

interface Props {
  presets: string[];
  value: string;
  onSelect: (text: string) => void;
}

export function TextPresets({ presets, value, onSelect }: Props) {
  return (
    <div className="space-y-1.5">
      <p className="text-xs text-muted-foreground flex items-center gap-1">
        <Sparkles className="h-3 w-3" />
        Pilih cadangan atau taip sendiri
      </p>
      <div className="flex flex-wrap gap-2">
        {presets.map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => onSelect(preset)}
            className={cn(
              "text-xs px-3 py-1.5 rounded-full border transition-all text-left",
              value === preset
                ? "border-primary bg-primary/10 text-primary font-medium"
                : "border-border hover:border-primary/50 text-muted-foreground hover:text-foreground"
            )}
          >
            {preset}
          </button>
        ))}
      </div>
    </div>
  );
}
