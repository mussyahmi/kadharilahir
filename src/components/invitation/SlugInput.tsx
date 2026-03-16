"use client";

import { useSlugCheck } from "@/hooks/useSlugCheck";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { slugify } from "@/lib/utils";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

interface Props {
  value: string;
  onChange: (slug: string) => void;
  currentSlug?: string; // original slug when editing
}

export function SlugInput({ value, onChange, currentSlug }: Props) {
  const { available, checking } = useSlugCheck(value, currentSlug);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(slugify(e.target.value));
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="slug">URL Jemputan</Label>
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground shrink-0 hidden sm:block">
          kadharilahir.app/jemput/
        </span>
        <div className="relative flex-1">
          <Input
            id="slug"
            value={value}
            onChange={handleChange}
            placeholder="nama-hari-jadi"
            className="h-11 pr-9 font-mono text-sm"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {checking && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
            {!checking && available === true && value.length >= 3 && (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            )}
            {!checking && available === false && (
              <XCircle className="h-4 w-4 text-destructive" />
            )}
          </div>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        {!checking && available === false
          ? "URL ini telah digunakan. Sila pilih yang lain."
          : "Hanya huruf kecil, nombor, dan tanda sambung (-) dibenarkan."}
      </p>
    </div>
  );
}
