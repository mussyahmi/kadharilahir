"use client";

import { useRef, useState, useEffect } from "react";

interface Props {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  animation?: string;
  /** When false (preview mode), renders without any animation logic */
  active?: boolean;
}

export function RevealOnScroll({
  children,
  className,
  style,
  animation = "reveal-up 0.9s ease both",
  active = true,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!active) return;
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [active]);

  return (
    <div
      ref={ref}
      className={className}
      style={{ ...style, ...(active ? (visible ? { animation } : { opacity: 0 }) : {}) }}
    >
      {children}
    </div>
  );
}
