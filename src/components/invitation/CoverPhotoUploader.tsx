"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { uploadCoverPhoto } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ImageCropper } from "@/components/ui/ImageCropper";
import { ImagePlus, Loader2, X } from "lucide-react";
import { toast } from "sonner";

interface Props {
  value: string;
  onChange: (url: string) => void;
  uid: string;
  invitationId: string;
}

export function CoverPhotoUploader({ value, onChange, uid, invitationId }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [cropSrc, setCropSrc] = useState<string | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Fail terlalu besar. Maksimum 10MB.");
      return;
    }

    // Show cropper with object URL
    const url = URL.createObjectURL(file);
    setCropSrc(url);

    // Reset input so same file can be re-selected
    if (fileRef.current) fileRef.current.value = "";
  };

  const uploadBlob = async (blob: Blob) => {
    setCropSrc(null);
    setUploading(true);
    setProgress(0);
    const file = new File([blob], "cover.png", { type: "image/png" });
    try {
      const url = await uploadCoverPhoto(file, invitationId, uid, setProgress);
      onChange(url);
      toast.success("Gambar berjaya dimuat naik.");
    } catch {
      toast.error("Gagal memuat naik gambar.");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleCropCancel = () => {
    if (cropSrc) URL.revokeObjectURL(cropSrc);
    setCropSrc(null);
  };

  return (
    <>
      {cropSrc && (
        <ImageCropper
          imageSrc={cropSrc}
          aspect={3 / 4}
          onDone={uploadBlob}
          onCancel={handleCropCancel}
        />
      )}

      <div className="space-y-2">
        <Label>Gambar Muka Depan</Label>
        <div
          className="relative w-full h-48 rounded-lg border-2 border-dashed border-border overflow-hidden cursor-pointer hover:border-primary/50 transition-colors"
          onClick={() => !uploading && fileRef.current?.click()}
        >
          {value ? (
            <>
              <Image src={value} alt="Cover" fill className="object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                <p className="text-white text-sm font-medium">Tukar gambar</p>
              </div>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-7 w-7"
                onClick={(e) => { e.stopPropagation(); onChange(""); }}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground">
              {uploading ? (
                <>
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <p className="text-sm">{Math.round(progress)}%</p>
                </>
              ) : (
                <>
                  <ImagePlus className="h-8 w-8" />
                  <p className="text-sm">Klik untuk memuat naik</p>
                  <p className="text-xs">PNG, JPG hingga 10MB</p>
                </>
              )}
            </div>
          )}

          {uploading && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted">
              <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
            </div>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={handleFile}
        />
      </div>
    </>
  );
}
