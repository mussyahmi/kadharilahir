import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PartyPopper, Plus } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
      <div className="w-16 h-16 rounded-full bg-pink-100 dark:bg-pink-950/30 flex items-center justify-center mb-4">
        <PartyPopper className="h-8 w-8 text-pink-500" />
      </div>
      <h2 className="text-xl font-semibold mb-2">Belum ada jemputan</h2>
      <p className="text-muted-foreground mb-6 max-w-sm">
        Cipta kad jemputan hari lahir digital pertama anda dan kongsi dengan keluarga &amp; rakan.
      </p>
      <Button asChild className="gap-2">
        <Link href="/jemputan/baru">
          <Plus className="h-4 w-4" />
          Cipta Jemputan
        </Link>
      </Button>
    </div>
  );
}
