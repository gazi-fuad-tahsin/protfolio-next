"use client";

import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "motion/react";
import type { ReactNode } from "react";

/**
 * 3D card: tilts toward the cursor, shows a moving light reflection, and lets
 * children with `style={{ transform: "translateZ(..)" }}` float above it.
 */
export function Tilt3D({
  children,
  className = "",
  max = 14,
  shine: showShine = true,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
  shine?: boolean;
}) {
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 150, damping: 18 });
  const sy = useSpring(py, { stiffness: 150, damping: 18 });

  const rotateY = useTransform(sx, [0, 1], [-max, max]);
  const rotateX = useTransform(sy, [0, 1], [max, -max]);
  const shineX = useTransform(sx, [0, 1], ["0%", "100%"]);
  const shineY = useTransform(sy, [0, 1], ["0%", "100%"]);
  const shine = useMotionTemplate`radial-gradient(circle at ${shineX} ${shineY}, rgba(255,255,255,0.45), transparent 55%)`;

  return (
    <motion.div
      className={`relative [transform-style:preserve-3d] ${className}`}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        px.set((e.clientX - r.left) / r.width);
        py.set((e.clientY - r.top) / r.height);
      }}
      onPointerLeave={() => {
        px.set(0.5);
        py.set(0.5);
      }}
    >
      {children}
      {showShine && (
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[20px] mix-blend-soft-light"
        style={{ background: shine, transform: "translateZ(1px)" }}
      />
      )}
    </motion.div>
  );
}
