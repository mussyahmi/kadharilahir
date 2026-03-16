export interface SongStyle {
  id: string;
  label: string;
  emoji: string;
  desc: string;
  type: "synth" | "audio";
  // Synth fields
  oscillatorType?: OscillatorType;
  tempo?: number;
  volume?: number;
  attack?: number;
  decay?: number;
  sustain?: number;
  release?: number;
  // Audio file fields
  audioUrl?: string;
}

export const SONGS: SongStyle[] = [
  {
    id: "hb-1",
    label: "Happy Birthday (Ver. 1)",
    emoji: "",
    desc: "",
    type: "audio",
    audioUrl: "/audio/happy-birthday-1.mp3",
  },
  {
    id: "hb-2",
    label: "Happy Birthday (Ver. 2)",
    emoji: "",
    desc: "",
    type: "audio",
    audioUrl: "/audio/happy-birthday-2.mp3",
  },
  {
    id: "none",
    label: "Tiada Muzik",
    emoji: "🔇",
    desc: "Tanpa muzik latar",
    type: "synth",
    oscillatorType: "sine", tempo: 120, volume: 0, attack: 0.01, decay: 0.3, sustain: 0.3, release: 0.3,
  },
];
