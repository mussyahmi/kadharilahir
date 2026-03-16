"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, MapPin, Navigation, Search, X } from "lucide-react";
import { toast } from "sonner";

const LocationPickerMap = dynamic(
  () => import("./LocationPickerMap").then((m) => ({ default: m.LocationPickerMap })),
  { ssr: false, loading: () => <div className="w-full rounded-lg bg-muted animate-pulse" style={{ height: 280 }} /> }
);

interface Props {
  lat?: number;
  lng?: number;
  onChange: (lat: number | undefined, lng: number | undefined) => void;
}

export function LocationPicker({ lat, lng, onChange }: Props) {
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const hasPin = lat !== undefined && lng !== undefined;

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Peranti anda tidak menyokong fungsi lokasi.");
      return;
    }
    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onChange(pos.coords.latitude, pos.coords.longitude);
        setGettingLocation(false);
      },
      () => {
        toast.error("Gagal mendapatkan lokasi. Sila benarkan akses lokasi.");
        setGettingLocation(false);
      },
      { timeout: 10000 }
    );
  };

  const geocode = async () => {
    if (!query.trim()) return;
    setSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1&countrycodes=my`,
        { headers: { "Accept-Language": "ms" } }
      );
      const data = await res.json();
      if (data.length > 0) {
        onChange(parseFloat(data[0].lat), parseFloat(data[0].lon));
      } else {
        toast.error("Alamat tidak dijumpai. Cuba lebih spesifik.");
      }
    } catch {
      toast.error("Gagal mencari alamat. Sila cuba lagi.");
    } finally {
      setSearching(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") { e.preventDefault(); geocode(); }
  };

  return (
    <div className="space-y-3">
      <Label>Lokasi di Peta (pilihan)</Label>

      {/* Address search */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Taip alamat dan tekan cari..."
            className="h-11 pl-9"
          />
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={geocode}
          disabled={searching || !query.trim()}
          className="h-11 shrink-0"
        >
          {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : "Cari"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={useCurrentLocation}
          disabled={gettingLocation}
          className="h-11 shrink-0 gap-1.5"
          title="Guna lokasi semasa"
        >
          {gettingLocation ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Navigation className="h-4 w-4" />
          )}
          <span className="hidden sm:inline">Lokasi Saya</span>
        </Button>
      </div>

      {/* Map */}
      {hasPin ? (
        <div className="space-y-1.5">
          <LocationPickerMap
            lat={lat!}
            lng={lng!}
            onMove={(newLat, newLng) => onChange(newLat, newLng)}
          />
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {lat!.toFixed(6)}, {lng!.toFixed(6)} — Seret pin atau klik pada peta untuk ubah lokasi
            </p>
            <button
              type="button"
              onClick={() => onChange(undefined, undefined)}
              className="text-xs text-destructive hover:underline flex items-center gap-0.5"
            >
              <X className="h-3 w-3" /> Buang lokasi
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 rounded-lg border-2 border-dashed border-border p-4">
          <MapPin className="h-5 w-5 text-muted-foreground shrink-0" />
          <div className="text-sm text-muted-foreground flex-1">
            Cari alamat di atas untuk meletakkan pin pada peta. Tetamu boleh terus pergi ke lokasi melalui Waze atau Google Maps.
          </div>
        </div>
      )}
    </div>
  );
}
