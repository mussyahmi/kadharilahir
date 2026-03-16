"use client";

import type { SongStyle } from "@/data/songs";

// Happy Birthday to You — note frequencies (Hz) and durations (beats)
// Each entry: [frequency, beats] — 0 frequency = rest
const MELODY: [number, number][] = [
  [392.00, 0.75], [392.00, 0.25], [440.00, 1], [392.00, 1], [523.25, 1], [493.88, 2],
  [392.00, 0.75], [392.00, 0.25], [440.00, 1], [392.00, 1], [587.33, 1], [523.25, 2],
  [392.00, 0.75], [392.00, 0.25], [783.99, 1], [659.25, 1], [523.25, 1], [493.88, 1], [440.00, 2],
  [698.46, 0.75], [698.46, 0.25], [659.25, 1], [523.25, 1], [587.33, 1], [523.25, 2],
];

export class BirthdaySynth {
  private ctx: AudioContext | null = null;
  private gainNode: GainNode | null = null;
  private timeouts: ReturnType<typeof setTimeout>[] = [];
  private loopTimeout: ReturnType<typeof setTimeout> | null = null;
  private playing = false;
  private style: SongStyle;

  constructor(style: SongStyle) {
    this.style = style;
  }

  private getCtx(): AudioContext {
    if (!this.ctx) {
      this.ctx = new AudioContext();
      this.gainNode = this.ctx.createGain();
      this.gainNode.connect(this.ctx.destination);
      this.gainNode.gain.value = this.style.volume;
    }
    return this.ctx;
  }

  private playNote(freq: number, startTime: number, duration: number) {
    const ctx = this.getCtx();
    const { oscillatorType, attack, decay, sustain, release } = this.style;

    const osc = ctx.createOscillator();
    const env = ctx.createGain();

    osc.type = oscillatorType;
    osc.frequency.value = freq;

    env.gain.setValueAtTime(0, startTime);
    env.gain.linearRampToValueAtTime(1, startTime + attack);
    env.gain.linearRampToValueAtTime(sustain, startTime + attack + decay);
    env.gain.setValueAtTime(sustain, startTime + duration - release);
    env.gain.linearRampToValueAtTime(0, startTime + duration);

    osc.connect(env);
    env.connect(this.gainNode!);

    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  private scheduleMelody(startAt: number): number {
    const { tempo } = this.style;
    const beatDuration = 60 / tempo;
    let t = startAt;

    for (const [freq, beats] of MELODY) {
      const dur = beats * beatDuration;
      if (freq > 0) this.playNote(freq, t, dur * 0.85);
      t += dur;
    }
    return t; // returns when melody ends
  }

  play() {
    if (this.style.id === "none") return;
    this.playing = true;
    const ctx = this.getCtx();
    if (ctx.state === "suspended") ctx.resume();

    const loop = (startAt: number) => {
      const endAt = this.scheduleMelody(startAt);
      const delay = (endAt - ctx.currentTime) * 1000;
      this.loopTimeout = setTimeout(() => {
        if (this.playing) loop(ctx.currentTime + 0.05);
      }, delay - 200);
    };

    loop(ctx.currentTime + 0.1);
  }

  pause() {
    this.playing = false;
    if (this.loopTimeout) clearTimeout(this.loopTimeout);
    this.timeouts.forEach(clearTimeout);
    this.timeouts = [];
    if (this.ctx) {
      this.ctx.close();
      this.ctx = null;
      this.gainNode = null;
    }
  }

  isPlaying() {
    return this.playing;
  }
}
