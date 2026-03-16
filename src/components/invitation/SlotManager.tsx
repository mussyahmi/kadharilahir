"use client";

import { useState } from "react";
import type { Slot } from "@/types/invitation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { formatTime } from "@/lib/utils";

interface Props {
  value: Slot[];
  onChange: (slots: Slot[]) => void;
}

function generateId() {
  return Math.random().toString(36).slice(2, 9);
}

export function SlotManager({ value, onChange }: Props) {
  const [newLabel, setNewLabel] = useState("");
  const [newStart, setNewStart] = useState("");
  const [newEnd, setNewEnd] = useState("");

  const addSlot = () => {
    if (!newLabel.trim() || !newStart || !newEnd) return;
    onChange([
      ...value,
      { id: generateId(), label: newLabel.trim(), startTime: newStart, endTime: newEnd },
    ]);
    setNewLabel("");
    setNewStart("");
    setNewEnd("");
  };

  const removeSlot = (id: string) => {
    onChange(value.filter((s) => s.id !== id));
  };

  return (
    <div className="space-y-3">
      <Label>Slot Masa (pilihan)</Label>

      {value.length > 0 && (
        <div className="space-y-2">
          {value.map((slot) => (
            <div
              key={slot.id}
              className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm bg-muted/40"
            >
              <div>
                <span className="font-medium">{slot.label}</span>
                <span className="text-muted-foreground ml-2">
                  {formatTime(slot.startTime)} – {formatTime(slot.endTime)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => removeSlot(slot.id)}
                className="text-destructive hover:text-destructive/80 ml-2"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="rounded-lg border p-3 space-y-3 bg-muted/20">
        <p className="text-xs text-muted-foreground">Tambah slot baru</p>
        <Input
          placeholder="Nama slot (cth: Slot Keluarga)"
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          className="h-9"
        />
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Masa mula</p>
            <Input
              type="time"
              value={newStart}
              onChange={(e) => setNewStart(e.target.value)}
              className="h-9"
            />
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Masa tamat</p>
            <Input
              type="time"
              value={newEnd}
              onChange={(e) => setNewEnd(e.target.value)}
              className="h-9"
            />
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addSlot}
          disabled={!newLabel.trim() || !newStart || !newEnd}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-1" />
          Tambah Slot
        </Button>
      </div>
    </div>
  );
}
