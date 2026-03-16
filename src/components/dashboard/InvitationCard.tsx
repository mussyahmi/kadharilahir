"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { deleteInvitation } from "@/lib/firestore";
import type { Invitation } from "@/types/invitation";
import { formatDateShort } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Pencil, Users, Trash2, ExternalLink, Loader2, Calendar, MapPin } from "lucide-react";
import { toast } from "sonner";

interface Props {
  invitation: Invitation;
}

export function InvitationCard({ invitation }: Props) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const eventDate = invitation.date?.toDate ? invitation.date.toDate() : new Date();

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteInvitation(invitation.id, invitation.slug);
      toast.success("Jemputan berjaya dipadam.");
      setDeleteDialogOpen(false);
    } catch {
      toast.error("Gagal memadam jemputan.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <Card className="overflow-hidden hover:shadow-md transition-shadow group">
        {/* Cover image */}
        <div className="relative h-40 bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-950/30 dark:to-purple-950/30">
          {invitation.coverPhotoUrl ? (
            <Image
              src={invitation.coverPhotoUrl}
              alt={invitation.birthdayPerson}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div
              className="absolute inset-0 opacity-40"
              style={{ background: `linear-gradient(135deg, ${invitation.themeColor}40, ${invitation.themeColor}20)` }}
            />
          )}
          {/* Theme color accent */}
          <div
            className="absolute bottom-0 left-0 right-0 h-1"
            style={{ backgroundColor: invitation.themeColor }}
          />
          {/* Menu */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" className="h-8 w-8 shadow-sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/jemputan/${invitation.id}`}>
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/jemputan/${invitation.id}/tetamu`}>
                    <Users className="h-4 w-4 mr-2" />
                    Tetamu
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/jemput/${invitation.slug}`} target="_blank">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Lihat Jemputan
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Padam
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <CardContent className="p-4 space-y-3">
          <div>
            <h3 className="font-semibold text-base leading-tight">
              Hari Lahir {invitation.birthdayPerson}
            </h3>
            <Badge variant="outline" className="mt-1 text-xs font-mono">
              /{invitation.slug}
            </Badge>
          </div>

          <div className="space-y-1 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 shrink-0" />
              <span>{formatDateShort(eventDate)}</span>
            </div>
            {invitation.venue && (
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{invitation.venue}</span>
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-1">
            <Button size="sm" variant="outline" className="flex-1 h-8 text-xs" asChild>
              <Link href={`/jemputan/${invitation.id}`}>
                <Pencil className="h-3 w-3 mr-1" />
                Edit
              </Link>
            </Button>
            <Button size="sm" variant="outline" className="flex-1 h-8 text-xs" asChild>
              <Link href={`/jemputan/${invitation.id}/tetamu`}>
                <Users className="h-3 w-3 mr-1" />
                Tetamu
              </Link>
            </Button>
            <Button size="sm" variant="outline" className="h-8 w-8 p-0" asChild>
              <Link href={`/jemput/${invitation.slug}`} target="_blank">
                <ExternalLink className="h-3 w-3" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Padam Jemputan?</DialogTitle>
            <DialogDescription>
              Adakah anda pasti ingin memadam jemputan hari lahir{" "}
              <strong>{invitation.birthdayPerson}</strong>? Tindakan ini tidak boleh dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={deleting}>
              Batal
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              Padam
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
