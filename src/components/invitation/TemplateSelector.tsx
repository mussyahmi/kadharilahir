"use client";

import { templates } from "@/data/templates";
import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";
import { Label } from "@/components/ui/label";

interface Props {
  value: string;
  onChange: (templateId: string) => void;
}

const templatePreviews: Record<string, React.ReactNode> = {
  comel: (
    <div className="w-full h-full bg-gradient-to-br from-pink-200 via-pink-100 to-purple-200 flex flex-col items-center justify-center gap-1 p-2">
      <div className="text-2xl">🎈</div>
      <div className="w-10 h-10 rounded-full bg-pink-300 border-2 border-white" />
      <div className="w-12 h-1.5 rounded bg-pink-400 mt-1" />
      <div className="w-8 h-1 rounded bg-pink-300" />
    </div>
  ),
  elegan: (
    <div className="w-full h-full bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 flex flex-col items-center justify-center gap-1 p-2">
      <div className="text-2xl">✨</div>
      <div className="w-10 h-10 rounded-full bg-yellow-700/60 border-2 border-yellow-500" />
      <div className="w-12 h-1.5 rounded bg-yellow-500 mt-1" />
      <div className="w-8 h-1 rounded bg-yellow-700" />
    </div>
  ),
  minimalis: (
    <div className="w-full h-full bg-white dark:bg-neutral-800 flex flex-col items-center justify-center gap-1 p-2 border border-neutral-200 dark:border-neutral-700">
      <div className="w-10 h-10 rounded-full bg-indigo-100 border-2 border-indigo-400" />
      <div className="w-12 h-1.5 rounded bg-indigo-400 mt-1" />
      <div className="w-8 h-1 rounded bg-indigo-200" />
    </div>
  ),
  seri: (
    <div className="w-full h-full bg-gradient-to-br from-orange-300 via-yellow-200 to-pink-300 flex flex-col items-center justify-center gap-1 p-2">
      <div className="text-2xl">🎉</div>
      <div className="w-10 h-10 rounded-full bg-orange-300 border-2 border-white" />
      <div className="w-12 h-1.5 rounded bg-orange-500 mt-1" />
      <div className="w-8 h-1 rounded bg-yellow-400" />
    </div>
  ),
  "ai-custom": (
    <div className="w-full h-full bg-gradient-to-br from-violet-100 via-pink-50 to-indigo-100 flex flex-col items-center justify-center gap-1.5 p-2">
      <div className="w-8 h-8 rounded-full bg-white border border-pink-200 flex items-center justify-center">
        <svg viewBox="0 0 24 24" className="w-4 h-4 text-violet-500" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z" />
          <path d="M8 12h8M12 8v8" />
        </svg>
      </div>
      <div className="w-14 h-1 rounded bg-violet-300" />
      <div className="w-10 h-1 rounded bg-pink-300" />
      <div className="text-[8px] text-violet-500 font-bold tracking-wide">AI</div>
    </div>
  ),
};

export function TemplateSelector({ value, onChange }: Props) {
  return (
    <div className="space-y-2">
      <Label>Template</Label>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {templates.map((template) => (
          <button
            key={template.id}
            type="button"
            onClick={() => onChange(template.id)}
            className={cn(
              "relative flex flex-col rounded-xl border-2 overflow-hidden transition-all",
              value === template.id
                ? "border-primary ring-2 ring-primary/30"
                : "border-border hover:border-primary/50"
            )}
          >
            <div className="h-24 w-full">
              {templatePreviews[template.id]}
            </div>
            <div className="p-2 text-left bg-card">
              <p className="text-xs font-semibold">{template.name}</p>
              <p className="text-[10px] text-muted-foreground leading-tight mt-0.5 line-clamp-2">
                {template.description}
              </p>
            </div>
            {value === template.id && (
              <div className="absolute top-1.5 right-1.5">
                <CheckCircle2 className="h-4 w-4 text-primary drop-shadow" />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
