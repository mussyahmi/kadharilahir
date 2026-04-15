"use client";

import { useState } from "react";
import type { Rsvp, Slot } from "@/types/invitation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDateShort, formatTime } from "@/lib/utils";
import { deleteRsvp, updateRsvp } from "@/lib/firestore";
import { Trash2, Loader2, Pencil, Minus, Plus } from "lucide-react";
import { toast } from "sonner";

interface Props {
  guests: Rsvp[];
  invitationId: string;
  slots?: Slot[];
}

function DeleteButton({ invitationId, rsvpId }: { invitationId: string; rsvpId: string }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Padam maklum balas ini?")) return;
    setLoading(true);
    try {
      await deleteRsvp(invitationId, rsvpId);
      toast.success("Maklum balas dipadam.");
    } catch {
      toast.error("Gagal memadam. Sila cuba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-7 w-7 text-muted-foreground hover:text-destructive"
      onClick={handleDelete}
      disabled={loading}
    >
      {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
    </Button>
  );
}

function EditDialog({
  guest,
  invitationId,
  slots,
  open,
  onClose,
}: {
  guest: Rsvp;
  invitationId: string;
  slots?: Slot[];
  open: boolean;
  onClose: () => void;
}) {
  const [name, setName] = useState(guest.guestName);
  const [attending, setAttending] = useState(guest.attending);
  const [pax, setPax] = useState(guest.pax || 1);
  const [slotId, setSlotId] = useState(guest.slotId ?? "");
  const [message, setMessage] = useState(guest.message || "");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateRsvp(invitationId, guest.id, {
        guestName: name.trim(),
        attending,
        pax: attending ? pax : 0,
        slotId: attending && slotId ? slotId : undefined,
        message: message.trim(),
      });
      toast.success("Maklum balas dikemaskini.");
      onClose();
    } catch {
      toast.error("Gagal kemaskini. Sila cuba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Maklum Balas</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label>Nama Tetamu</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Kehadiran</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={attending ? "default" : "outline"}
                size="sm"
                onClick={() => setAttending(true)}
                className="flex-1"
              >
                Hadir
              </Button>
              <Button
                type="button"
                variant={!attending ? "destructive" : "outline"}
                size="sm"
                onClick={() => setAttending(false)}
                className="flex-1"
              >
                Tidak Hadir
              </Button>
            </div>
          </div>
          {attending && (
            <div className="space-y-1.5">
              <Label>Bilangan Pax</Label>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  onClick={() => setPax((p) => Math.max(1, p - 1))}
                  disabled={pax <= 1}
                >
                  <Minus className="h-3.5 w-3.5" />
                </Button>
                <span className="w-8 text-center font-semibold">{pax}</span>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  onClick={() => setPax((p) => Math.min(20, p + 1))}
                  disabled={pax >= 20}
                >
                  <Plus className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )}
          {attending && slots && slots.length > 0 && (
            <div className="space-y-1.5">
              <Label>Slot</Label>
              <div className="flex flex-col gap-2">
                {slots.map((slot) => (
                  <Button
                    key={slot.id}
                    type="button"
                    variant={slotId === slot.id ? "default" : "outline"}
                    size="sm"
                    className="justify-start"
                    onClick={() => setSlotId(slot.id)}
                  >
                    <span className="font-medium">{slot.label}</span>
                    <span className="ml-auto text-xs opacity-70">{formatTime(slot.startTime)} – {formatTime(slot.endTime)}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}
          <div className="space-y-1.5">
            <Label>Mesej</Label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              placeholder="Tiada mesej"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Batal
          </Button>
          <Button onClick={handleSave} disabled={loading || !name.trim()}>
            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Simpan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function GuestTable({ guests, invitationId, slots }: Props) {
  const [editGuest, setEditGuest] = useState<Rsvp | null>(null);
  const slotMap = new Map(slots?.map((s) => [s.id, s]) ?? []);

  if (guests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-muted-foreground">Belum ada maklum balas diterima.</p>
        <p className="text-sm text-muted-foreground mt-1">
          Kongsi pautan jemputan anda untuk mula menerima RSVP.
        </p>
      </div>
    );
  }

  return (
    <>
      {editGuest && (
        <EditDialog
          guest={editGuest}
          invitationId={invitationId}
          slots={slots}
          open={!!editGuest}
          onClose={() => setEditGuest(null)}
        />
      )}

      {/* Desktop table */}
      <div className="hidden md:block rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Tetamu</TableHead>
              <TableHead>Kehadiran</TableHead>
              <TableHead>Pax</TableHead>
              {slots && slots.length > 0 && <TableHead>Slot</TableHead>}
              <TableHead>Mesej</TableHead>
              <TableHead>Tarikh Maklum Balas</TableHead>
              <TableHead className="w-20" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {guests.map((guest) => (
              <TableRow key={guest.id}>
                <TableCell className="font-medium">{guest.guestName}</TableCell>
                <TableCell>
                  <Badge variant={guest.attending ? "default" : "secondary"} className={
                    guest.attending
                      ? "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400 hover:bg-green-100"
                      : "bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400 hover:bg-red-100"
                  }>
                    {guest.attending ? "Hadir" : "Tidak Hadir"}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm font-medium">
                  {guest.attending ? (guest.pax || 1) : "—"}
                </TableCell>
                {slots && slots.length > 0 && (
                  <TableCell className="text-sm text-muted-foreground">
                    {guest.slotId ? (slotMap.get(guest.slotId)?.label ?? "—") : "—"}
                  </TableCell>
                )}
                <TableCell className="text-muted-foreground text-sm max-w-xs truncate">
                  {guest.message || "—"}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {guest.submittedAt?.toDate ? formatDateShort(guest.submittedAt.toDate()) : "—"}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-foreground"
                      onClick={() => setEditGuest(guest)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <DeleteButton invitationId={invitationId} rsvpId={guest.id} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile card list */}
      <div className="md:hidden space-y-3">
        {guests.map((guest) => (
          <div key={guest.id} className="rounded-lg border p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium">{guest.guestName}</span>
              <div className="flex items-center gap-1">
                <Badge variant={guest.attending ? "default" : "secondary"} className={
                  guest.attending
                    ? "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400 hover:bg-green-100"
                    : "bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400 hover:bg-red-100"
                }>
                  {guest.attending ? "Hadir" : "Tidak Hadir"}
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-foreground"
                  onClick={() => setEditGuest(guest)}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <DeleteButton invitationId={invitationId} rsvpId={guest.id} />
              </div>
            </div>
            {guest.message && (
              <p className="text-sm text-muted-foreground">{guest.message}</p>
            )}
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                {guest.submittedAt?.toDate ? formatDateShort(guest.submittedAt.toDate()) : ""}
              </p>
              <div className="flex items-center gap-2">
                {slots && slots.length > 0 && guest.slotId && (
                  <p className="text-xs text-muted-foreground">{slotMap.get(guest.slotId)?.label ?? ""}</p>
                )}
                {guest.attending && (
                  <p className="text-xs text-muted-foreground">{guest.pax || 1} pax</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
