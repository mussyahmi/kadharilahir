import { useMemo } from "react";
import type { Rsvp, Slot } from "@/types/invitation";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, XCircle, UserCheck } from "lucide-react";
import { formatTime } from "@/lib/utils";

interface Props {
  guests: Rsvp[];
  slots?: Slot[];
}

export function RsvpStats({ guests, slots }: Props) {
  const stats = useMemo(() => {
    const attending = guests.filter((g) => g.attending).length;
    const declined = guests.filter((g) => !g.attending).length;
    const totalPax = guests.filter((g) => g.attending).reduce((sum, g) => sum + (g.pax || 1), 0);

    const bySlot = slots?.map((slot) => {
      const slotGuests = guests.filter((g) => g.attending && g.slotId === slot.id);
      const pax = slotGuests.reduce((sum, g) => sum + (g.pax || 1), 0);
      return { slot, count: slotGuests.length, pax };
    }) ?? [];

    return { attending, declined, totalPax, bySlot };
  }, [guests, slots]);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="px-4 py-3 flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-green-100 dark:bg-green-950/30 flex items-center justify-center shrink-0">
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.attending}</p>
              <p className="text-xs text-muted-foreground">Hadir</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="px-4 py-3 flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-red-100 dark:bg-red-950/30 flex items-center justify-center shrink-0">
              <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.declined}</p>
              <p className="text-xs text-muted-foreground">Tidak Hadir</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="px-4 py-3 flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-purple-100 dark:bg-purple-950/30 flex items-center justify-center shrink-0">
              <UserCheck className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.totalPax}</p>
              <p className="text-xs text-muted-foreground">Jumlah Pax</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {stats.bySlot.length > 0 && (
        <Card>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Slot</th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Masa</th>
                  <th className="px-4 py-2.5 text-right text-xs font-medium text-muted-foreground">Tetamu</th>
                  <th className="px-4 py-2.5 text-right text-xs font-medium text-muted-foreground">Pax</th>
                </tr>
              </thead>
              <tbody>
                {stats.bySlot.map(({ slot, count, pax }, i) => (
                  <tr key={slot.id} className={i < stats.bySlot.length - 1 ? "border-b" : ""}>
                    <td className="px-4 py-3 font-medium">{slot.label}</td>
                    <td className="px-4 py-3 text-muted-foreground">{formatTime(slot.startTime)} – {formatTime(slot.endTime)}</td>
                    <td className="px-4 py-3 text-right font-semibold">{count}</td>
                    <td className="px-4 py-3 text-right text-muted-foreground">{pax}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
