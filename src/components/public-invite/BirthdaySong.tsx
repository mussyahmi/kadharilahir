"use client";

import { useEffect, useRef, useState } from "react";
import { Music, VolumeX } from "lucide-react";
import { SONGS } from "@/data/songs";
import { BirthdaySynth } from "@/lib/birthdaySynth";

interface Props {
  songId?: string;
  color: string;
  shouldPlay?: boolean;
}

export function BirthdaySong({ songId, color, shouldPlay }: Props) {
  const [playing, setPlaying] = useState(false);
  const synthRef = useRef<BirthdaySynth | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const style = SONGS.find((s) => s.id === songId) ?? SONGS[0];

  const stop = () => {
    synthRef.current?.pause();
    synthRef.current = null;
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    setPlaying(false);
  };

  const play = () => {
    if (style.type === "audio" && style.audioUrl) {
      const audio = new Audio(style.audioUrl);
      audio.loop = true;
      audio.volume = 0.7;
      audio.play().catch(() => {});
      audioRef.current = audio;
    } else if (style.type === "synth") {
      const synth = new BirthdaySynth(style);
      synth.play();
      synthRef.current = synth;
    }
    setPlaying(true);
  };

  // Start playing when entry overlay is dismissed
  useEffect(() => {
    if (shouldPlay) play();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldPlay]);

  // Cleanup on unmount
  useEffect(() => {
    return () => stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!songId || style.id === "none") return null;

  return (
    <div className="fixed bottom-6 right-4 z-50 flex flex-col items-center gap-1">
      <button
        onClick={() => playing ? stop() : play()}
        className="rounded-full w-12 h-12 flex items-center justify-center shadow-lg text-white transition-transform active:scale-95"
        style={{ backgroundColor: color }}
        aria-label={playing ? "Henti muzik" : "Main muzik"}
      >
        {playing ? <VolumeX className="h-5 w-5" /> : <Music className="h-5 w-5" />}
      </button>
    </div>
  );
}
