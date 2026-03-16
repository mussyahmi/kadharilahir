import type { Rsvp } from "@/types/invitation";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDateShort } from "@/lib/utils";

interface Props {
  guests: Rsvp[];
}

export function GuestTable({ guests }: Props) {
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
      {/* Desktop table */}
      <div className="hidden md:block rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Tetamu</TableHead>
              <TableHead>Kehadiran</TableHead>
              <TableHead>Mesej</TableHead>
              <TableHead>Tarikh Maklum Balas</TableHead>
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
                <TableCell className="text-muted-foreground text-sm max-w-xs truncate">
                  {guest.message || "—"}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {guest.submittedAt?.toDate ? formatDateShort(guest.submittedAt.toDate()) : "—"}
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
              <Badge variant={guest.attending ? "default" : "secondary"} className={
                guest.attending
                  ? "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400 hover:bg-green-100"
                  : "bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400 hover:bg-red-100"
              }>
                {guest.attending ? "Hadir" : "Tidak Hadir"}
              </Badge>
            </div>
            {guest.message && (
              <p className="text-sm text-muted-foreground">{guest.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              {guest.submittedAt?.toDate ? formatDateShort(guest.submittedAt.toDate()) : ""}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}
