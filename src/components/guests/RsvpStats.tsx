import { useMemo } from "react";
import type { Rsvp } from "@/types/invitation";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, XCircle, UserCheck } from "lucide-react";

interface Props {
  guests: Rsvp[];
}

export function RsvpStats({ guests }: Props) {
  const stats = useMemo(() => {
    const attending = guests.filter((g) => g.attending).length;
    const declined = guests.filter((g) => !g.attending).length;
    const totalPax = guests.filter((g) => g.attending).reduce((sum, g) => sum + (g.pax || 1), 0);
    return { attending, declined, totalPax };
  }, [guests]);

  return (
    <div className="grid grid-cols-3 gap-3">
      <Card>
        <CardContent className="p-4 flex items-center gap-3">
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
        <CardContent className="p-4 flex items-center gap-3">
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
        <CardContent className="p-4 flex items-center gap-3">
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
  );
}
