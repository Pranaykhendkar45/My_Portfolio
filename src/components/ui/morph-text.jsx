"use client";

import React, { useId } from "react";
import { cn } from "@/lib/utils";

// ─── Component ──────────────────────────────────────────────────────────────

export function MorphText({
  // ================================================================
  // ---- YAHAN SE WORDS ADD/CHANGE HOTE HAIN ----
  // Har entry 2 tarah se de sakta hai:
  //   1) Simple string/JSX -> "Crazy Engineer"  (default size/position use hoga)
  //   2) Object -> agar KISI EK word ka size/position alag chahiye:
  //      {
  //        content: "Crazy Engineer",   // ya <>I am<br/>Pranay</>
  //        fontSize: "clamp(2rem, 8vw, 5rem)",  // sirf isi word ka size
  //        offsetX: "20px",   // left/right shift (negative = left)
  //        offsetY: "-10px",  // up/down shift (negative = upar)
  //        className: "text-blue-500", // extra classes sirf isi word pe
  //      }
  // ================================================================
  words = ["CREATE", "DESIGN", "DEVELOP"],
  // Har word kitni der (ms) dikhega, uske baad agla word aayega
  interval = 3000,
  // Neeche chhota subtext (optional)
  subtext,
  fontSize = "clamp(3rem, 15vw, 10rem)",
  fontFamily = '"Space Grotesk", sans-serif',
  className,
  textClassName,
  subtextClassName,
}) {
  // Har word ko normalize kar rahe hain: string ho ya object, dono handle honge
  const normalizedWords = words.map((w) =>
    w && typeof w === "object" && !React.isValidElement(w)
      ? w
      : { content: w }
  );
  // Unique ID so multiple instances don't share filter IDs / keyframe names
  const uid = useId().replace(/:/g, "");
  const filterId = `morph-threshold-${uid}`;
  const keyframeName = `morph-word-rotate-${uid}`;

  const n = normalizedWords.length;
  const totalDuration = (interval / 1000) * n; // seconds
  const wordDuration = interval / 1000;

  // Build per-word keyframe + delay styles
  const wordStyles = normalizedWords.map((_, i) => ({
    animationDelay: `${i * wordDuration}s`,
    animationDuration: `${totalDuration}s`,
    animationName: keyframeName,
  }));

  // ------------------------------------------------------------------
  // Har word ki "visible window" hamesha uske apne slot (1/n hissa) ke
  // ANDAR hi rehti hai — chahe 3 words ho ya 10, isliye kabhi overlap
  // nahi hota. (Pehle ye percentages fixed the, jo 5+ words pe overlap
  // kar jaate the.)
  // ------------------------------------------------------------------
  const pct = (fracOfSlot) => `${((fracOfSlot / n) * 100).toFixed(3)}%`;

  return (
    <div className={cn("morph-text-root relative flex flex-col items-center", className)}>
      {/* ── Threshold SVG filter (hidden) ─────────────────────────── */}
      <svg
        aria-hidden="true"
        focusable="false"
        style={{ position: "absolute", width: 0, height: 0, pointerEvents: "none" }}
      >
        <defs>
          <filter id={filterId}>
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 25 -9"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      {/* ── Morphing word container ────────────────────────────────── */}
      <div
        className={cn("morph-text-container relative select-none", textClassName)}
        style={{
          fontSize,
          fontWeight: 700,
          filter: `url(#${filterId})`,
          fontFamily,
        }}
      >
        {/* word rotator */}
        <div
          className="morph-word-rotator relative flex items-center justify-center"
          style={{ height: "1.2em", minWidth: "14ch" }}
        >
          {normalizedWords.map((w, i) => (
            <span
              key={i}
              className={cn("morph-word absolute", w.className)}
              style={{
                top: "50%",
                left: "50%",
                // offsetX/offsetY = sirf isi word ko nudge karne ke liye
                // (transform animation ke upar se, isliye animation ke
                // sath conflict nahi karta)
                marginLeft: w.offsetX || 0,
                marginTop: w.offsetY || 0,
                // fontSize di hai to sirf isi word ka size override hoga
                ...(w.fontSize ? { fontSize: w.fontSize } : {}),
                transform: "translate(-50%, -50%)",
                opacity: 0,
                whiteSpace: "nowrap",
                animationTimingFunction: "ease-in-out",
                animationIterationCount: "infinite",
                animationFillMode: "both",
                ...wordStyles[i],
                ...(w.style || {}),
              }}
            >
              {w.content}
            </span>
          ))}
        </div>
      </div>

      {/* ── Optional subtext ──────────────────────────────────────── */}
      {subtext && (
        <p
          className={cn(
            "morph-subtext mt-8 uppercase tracking-[0.2em] text-[#888]",
            subtextClassName
          )}
          style={{
            fontSize: "1.2rem",
            opacity: 0,
            animation: "morph-fade-up 1s ease-out 1s forwards",
            fontFamily,
          }}
        >
          {subtext}
        </p>
      )}

      {/* ── Scoped keyframes ──────────────────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;500;700&display=swap');

        @keyframes ${keyframeName} {
          0% {
            opacity: 0;
            filter: blur(20px);
            transform: translate(-50%, -50%) scale(0.8);
          }
          ${pct(0.05)} {
            opacity: 0.5;
            filter: blur(10px);
          }
          ${pct(0.15)}, ${pct(0.6)} {
            opacity: 1;
            filter: blur(0px);
            transform: translate(-50%, -50%) scale(1);
          }
          ${pct(0.7)} {
            opacity: 0.5;
            filter: blur(10px);
          }
          ${pct(0.8)} {
            opacity: 0;
            filter: blur(20px);
            transform: translate(-50%, -50%) scale(1.2);
          }
        }

        @keyframes morph-fade-up {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default MorphText;
