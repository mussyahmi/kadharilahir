"use client";

import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, RotateCw, Check, X } from "lucide-react";

interface Props {
  imageSrc: string;
  aspect?: number;
  onDone: (croppedBlob: Blob) => void;
  onCancel: () => void;
}

async function getCroppedBlob(imageSrc: string, pixelCrop: Area): Promise<Blob> {
  const img = await createImageBitmap(await fetch(imageSrc).then((r) => r.blob()));
  const canvas = document.createElement("canvas");
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, pixelCrop.width, pixelCrop.height);
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Canvas toBlob failed"));
    }, "image/png");
  });
}

export function ImageCropper({ imageSrc, aspect = 3 / 4, onDone, onCancel }: Props) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [processing, setProcessing] = useState(false);

  const onCropComplete = useCallback((_: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const handleDone = async () => {
    if (!croppedAreaPixels) return;
    setProcessing(true);
    try {
      const blob = await getCroppedBlob(imageSrc, croppedAreaPixels);
      onDone(blob);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex flex-col bg-black">
      {/* Crop area */}
      <div className="relative flex-1">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          rotation={rotation}
          aspect={aspect}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
          style={{
            containerStyle: { background: "#000" },
          }}
        />
      </div>

      {/* Controls */}
      <div className="bg-neutral-900 px-4 py-4 space-y-3">
        {/* Zoom slider */}
        <div className="flex items-center gap-3">
          <ZoomOut className="h-4 w-4 text-white/60 shrink-0" />
          <input
            type="range"
            min={1}
            max={3}
            step={0.05}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="flex-1 accent-white"
          />
          <ZoomIn className="h-4 w-4 text-white/60 shrink-0" />
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setRotation((r) => (r + 90) % 360)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/10 text-white text-sm hover:bg-white/20 transition-colors"
          >
            <RotateCw className="h-4 w-4" />
            Putar
          </button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1 border-white/20 text-white hover:bg-white/10 bg-transparent"
          >
            <X className="h-4 w-4 mr-1" />
            Batal
          </Button>
          <Button
            type="button"
            onClick={handleDone}
            disabled={processing}
            className="flex-1 bg-white text-black hover:bg-white/90"
          >
            <Check className="h-4 w-4 mr-1" />
            {processing ? "Memproses..." : "Guna"}
          </Button>
        </div>
      </div>
    </div>
  );
}
