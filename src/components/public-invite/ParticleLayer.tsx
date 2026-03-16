"use client";

import { useEffect, useState } from "react";

type Shape = "circle" | "star" | "heart";
const SHAPES: Shape[] = ["circle", "star", "heart"];

function Particle({
  shape, size, color, opacity, style,
}: {
  shape: Shape; size: number; color: string; opacity: number;
  style?: React.CSSProperties;
}) {
  const base: React.CSSProperties = { position: "absolute", opacity, ...style };

  if (shape === "star") {
    return <span style={{ fontSize: size, color, lineHeight: 1, ...base }}>✦</span>;
  }
  if (shape === "heart") {
    return <span style={{ fontSize: size, color, lineHeight: 1, ...base }}>♥</span>;
  }
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", backgroundColor: color, ...base }} />
  );
}

interface Props {
  color: string;
  /** true = show ambient floating particles */
  active: boolean;
  /** flipping this triggers the burst */
  burst?: boolean;
}

export function ParticleLayer({ color, active, burst }: Props) {
  const [burstKey, setBurstKey] = useState(0);

  // Re-trigger burst animation each time burst flips to true
  useEffect(() => {
    if (burst) setBurstKey((k) => k + 1);
  }, [burst]);

  // Deterministic particles based on index to avoid hydration mismatch
  const burstParticles = Array.from({ length: 26 }, (_, i) => {
    const angle = (i / 26) * 360 + i * 7;
    const dist = 22 + (i % 5) * 7;
    const rad = (angle * Math.PI) / 180;
    return {
      id: i,
      dx: Math.cos(rad) * dist,
      dy: Math.sin(rad) * dist - 8,
      size: 6 + (i % 4) * 4,
      shape: SHAPES[i % 3],
      rotate: i * 37,
      delay: (i % 5) * 0.05,
    };
  });

  const ambientParticles = Array.from({ length: 16 }, (_, i) => ({
    id: i,
    x: 2 + (i / 16) * 96,
    startY: 15 + (i % 6) * 14,
    size: 5 + (i % 4) * 3,
    shape: SHAPES[i % 3],
    duration: 7 + (i % 6) * 1.5,
    delay: -(i * 1.1),
    opacity: 0.18 + (i % 4) * 0.07,
  }));

  if (!active) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      <style>{`
        @keyframes p-burst {
          0%   { transform: translate(-50%, -50%) scale(1.3); opacity: 1; }
          70%  { opacity: 0.9; }
          100% { transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) scale(0.15) rotate(var(--rot)); opacity: 0; }
        }
        @keyframes p-rise {
          0%   { transform: translateY(0)      scale(1);   opacity: 0; }
          8%   { opacity: var(--op); }
          88%  { opacity: var(--op); }
          100% { transform: translateY(-110vh) scale(0.4); opacity: 0; }
        }
      `}</style>

      {/* Burst — replay on each burstKey change */}
      {burst && burstParticles.map((p) => (
        <Particle
          key={`b-${burstKey}-${p.id}`}
          shape={p.shape}
          size={p.size}
          color={color}
          opacity={1}
          style={{
            top: "50%",
            left: "50%",
            // @ts-expect-error CSS custom props
            "--dx": `${p.dx}vw`,
            "--dy": `${p.dy}vh`,
            "--rot": `${p.rotate}deg`,
            animation: `p-burst 1.5s cubic-bezier(0.15, 0.85, 0.3, 1) ${p.delay}s forwards`,
          }}
        />
      ))}

      {/* Ambient — continuously rise and fade */}
      {ambientParticles.map((p) => (
        <Particle
          key={`a-${p.id}`}
          shape={p.shape}
          size={p.size}
          color={color}
          opacity={p.opacity}
          style={{
            left: `${p.x}%`,
            top: `${p.startY}%`,
            // @ts-expect-error CSS custom props
            "--op": p.opacity,
            animation: `p-rise ${p.duration}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
