"use client";

import React, { useState } from "react";
import { Orbit as OrbitIcon } from "lucide-react";
import {
  SiHtml5,
  SiCss,
  SiJavascript,
  SiPython,
  SiTailwindcss,
} from "react-icons/si";
import { TbLetterC } from "react-icons/tb";
import { cn } from "@/lib/utils";

/**
 * ============================================================================
 * DEFAULT SVG LOGO ICONS
 * Edit these SVG definitions to change the default icons shown on planets.
 * ============================================================================
 */
const DefaultIcons = {
  c: <TbLetterC className="w-5 h-5" color="#A8B9CC" />,
  html: <SiHtml5 className="w-5 h-5" color="#E34F26" />,
  css: <SiCss className="w-5 h-5" color="#1572B6" />,
  javascript: <SiJavascript className="w-5 h-5" color="#F7DF1E" />,
  python: <SiPython className="w-5 h-5" color="#3776AB" />,
  tailwind: <SiTailwindcss className="w-5 h-5" color="#38BDF8" />,
};

/**
 * ============================================================================
 * DEFAULT ORBITS CONFIGURATION
 * Customizing these arrays is the easiest way to add/remove rings or change
 * which planets revolve on each orbit, along with their colors and speeds.
 * ============================================================================
 */
const DEFAULT_ORBITS = [
  {
    id: "inner",
    name: "Inner Ring",
    radiusClass: "var(--radius-inner)",
    radiusPx: 175,
    speed: 20,
    items: [
      { id: "c", label: "C", color: "#A8B9CC", svg: DefaultIcons.c },
      { id: "python", label: "Python", color: "#3776AB", svg: DefaultIcons.python },
    ],
  },
  {
    id: "mid",
    name: "Middle Ring",
    radiusClass: "var(--radius-mid)",
    radiusPx: 285,
    speed: 32,
    items: [
      { id: "javascript", label: "JavaScript", color: "#F7DF1E", svg: DefaultIcons.javascript },
      { id: "html", label: "HTML", color: "#E34F26", svg: DefaultIcons.html },
    ],
  },
  {
    id: "outer",
    name: "Outer Ring",
    radiusClass: "var(--radius-outer)",
    radiusPx: 395,
    speed: 48,
    items: [
      { id: "css", label: "CSS", color: "#1572B6", svg: DefaultIcons.css },
      { id: "tailwind", label: "Tailwind", color: "#38BDF8", svg: DefaultIcons.tailwind },
    ],
  },
];

export const SolarSystem = React.forwardRef(
  (
    {
      centerLogo,
      centerLogoAlt = "Core Engine",
      orbits = DEFAULT_ORBITS,
      isPaused = false,
      speedMultiplier = 1,
      className,
      ...props
    },
    ref
  ) => {
    const [hoveredId, setHoveredId] = useState(null);

    const dustItems = [
      { delay: "-4s", radius: "165px", color: "#00f5d4" },
      { delay: "-11s", radius: "260px", color: "#a855f7" },
      { delay: "-19s", radius: "340px", color: "#3b82f6" },
      { delay: "-28s", radius: "395px", color: "#00f5d4" },
      { delay: "-7s", radius: "200px", color: "#ec4899" },
      { delay: "-15s", radius: "365px", color: "#eab308" },
      { delay: "-23s", radius: "430px", color: "#a855f7" },
    ];

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex items-center justify-center w-full max-w-[940px] h-[320px] md:h-[450px] perspective-[1200px] select-none overflow-visible",
          className
        )}
        {...props}
      >
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            --radius-inner: 175px;
            --radius-mid: 285px;
            --radius-outer: 395px;
          }

          @media (max-width: 768px) {
            :root {
              --radius-inner: 100px;
              --radius-mid: 165px;
              --radius-outer: 230px;
            }
          }

          @media (max-width: 480px) {
            :root {
              --radius-inner: 70px;
              --radius-mid: 115px;
              --radius-outer: 160px;
            }
          }

          @keyframes custom-orbitMove {
            0% {
              transform: translate(-50%, -50%) rotateZ(0deg) translateX(var(--orbit-radius));
            }
            100% {
              transform: translate(-50%, -50%) rotateZ(-360deg) translateX(var(--orbit-radius));
            }
          }

          @keyframes custom-billboardCancel {
            0% {
              transform: translate(-50%, -50%) rotateZ(0deg) rotateY(10deg) rotateX(-65deg);
            }
            100% {
              transform: translate(-50%, -50%) rotateZ(360deg) rotateY(10deg) rotateX(-65deg);
            }
          }

          @keyframes custom-sun-pulse {
            0% { transform: scale(0.9); opacity: 0.7; }
            100% { transform: scale(1.1); opacity: 1; }
          }

          @keyframes custom-spin-clockwise {
            0% { transform: rotateX(65deg) rotateY(-10deg) rotateZ(0deg); }
            100% { transform: rotateX(65deg) rotateY(-10deg) rotateZ(360deg); }
          }
          @keyframes custom-spin-counter {
            0% { transform: rotateX(65deg) rotateY(-10deg) rotateZ(0deg); }
            100% { transform: rotateX(65deg) rotateY(-10deg) rotateZ(-360deg); }
          }

          .animate-custom-orbit {
            animation: custom-orbitMove var(--orbit-duration) linear infinite;
            animation-play-state: var(--orbit-play-state);
          }
          .animate-custom-billboard {
            animation: custom-billboardCancel var(--orbit-duration) linear infinite;
            animation-play-state: var(--orbit-play-state);
          }
          .animate-custom-sun-pulse {
            animation: custom-sun-pulse 4s ease-in-out infinite alternate;
          }
          .animate-custom-spin-cw {
            animation: custom-spin-clockwise 20s linear infinite;
          }
          .animate-custom-spin-ccw {
            animation: custom-spin-counter 30s linear infinite;
          }

          .orbit-logo-card {
            position: absolute;
            left: 50%;
            top: 50%;
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 0.45rem 0.95rem;
            background: rgba(10, 10, 12, 0.65);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 100px;
            font-weight: 600;
            color: #ffffff;
            white-space: nowrap;
            user-select: none;
            cursor: pointer;
            pointer-events: auto;
            transition: border-color 0.3s, color 0.3s, background 0.3s, box-shadow 0.3s, scale 0.3s;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05);
          }
        `}} />

        <div
          className="absolute w-[360px] h-[360px] md:w-[940px] md:h-[940px] flex items-center justify-center"
          style={{
            transform: "rotateX(65deg) rotateY(-10deg)",
            transformStyle: "preserve-3d",
          }}
        >
          <div
            className="absolute w-[100px] h-[100px] md:w-[130px] md:h-[130px] flex items-center justify-center z-20 pointer-events-none"
            style={{
              transform: "rotateY(10deg) rotateX(-65deg)",
              transformStyle: "preserve-3d",
            }}
          >
            <div className="absolute w-[90px] h-[90px] md:w-[120px] md:h-[120px] rounded-full filter blur-md animate-custom-sun-pulse z-10 bg-teal-500/20" />

            {centerLogo ? (
              typeof centerLogo === "string" ? (
                <img
                  className="w-14 h-14 md:w-20 md:h-20 rounded-full border-2 border-teal-500/40 shadow-[0_0_30px_rgba(20,184,166,0.3)] z-20 bg-zinc-950 p-2 md:p-3 relative"
                  src={centerLogo}
                  alt={centerLogoAlt}
                  width={80}
                  height={80}
                />
              ) : (
                <div className="w-14 h-14 md:w-20 md:h-20 rounded-full border-2 border-teal-500/40 shadow-[0_0_30px_rgba(20,184,166,0.3)] z-20 bg-zinc-950 flex items-center justify-center p-2 relative">
                  {centerLogo}
                </div>
              )
            ) : (
              <div className="w-14 h-14 md:w-20 md:h-20 rounded-full border-2 border-teal-500/40 shadow-[0_0_30px_rgba(20,184,166,0.3)] z-20 bg-zinc-950 flex items-center justify-center p-2 relative">
                <OrbitIcon className="w-8 h-8 text-teal-400 animate-spin" style={{ animationDuration: "10s" }} />
              </div>
            )}

            <div className="absolute w-[110px] h-[110px] md:w-[140px] md:h-[140px] rounded-full border border-dashed border-teal-500/20 animate-custom-spin-cw pointer-events-none" />
            <div className="absolute w-[150px] h-[150px] md:w-[185px] md:h-[185px] rounded-full border border-dashed border-teal-500/10 animate-custom-spin-ccw pointer-events-none" />
          </div>

          {dustItems.map((dust, idx) => (
            <div
              key={idx}
              className="absolute left-1/2 top-1/2 w-1 h-1 rounded-full opacity-40 pointer-events-none animate-custom-orbit"
              style={{
                background: dust.color,
                boxShadow: `0 0 6px ${dust.color}`,
                animationDelay: dust.delay,
                animationPlayState: isPaused ? "paused" : "running",
                animationDuration: `${24 / speedMultiplier}s`,
                "--orbit-radius": dust.radius,
                "--orbit-duration": `${24 / speedMultiplier}s`,
                "--orbit-play-state": isPaused ? "paused" : "running",
              }}
            />
          ))}

          {orbits.map((orbit) => {
            return (
              <React.Fragment key={orbit.id}>
                <div
                  className="absolute rounded-full border border-dashed border-zinc-700/60 pointer-events-none"
                  style={{
                    width: `calc(2 * ${orbit.radiusClass})`,
                    height: `calc(2 * ${orbit.radiusClass})`,
                    boxShadow: "inset 0 0 25px rgba(255, 255, 255, 0.01), 0 0 25px rgba(255, 255, 255, 0.01)",
                    "--orbit-radius": orbit.radiusClass,
                  }}
                />

                {orbit.items.map((item, idx, arr) => {
                  const delayValue = -(orbit.speed / arr.length) * idx;
                  const durationValue = orbit.speed / speedMultiplier;
                  const isHovered = hoveredId === item.id;

                  return (
                    <div
                      key={item.id}
                      className="absolute left-1/2 top-1/2 w-0 h-0 pointer-events-none animate-custom-orbit"
                      style={{
                        animationDelay: `${delayValue}s`,
                        animationDuration: `${durationValue}s`,
                        animationPlayState: isPaused ? "paused" : "running",
                        "--orbit-radius": orbit.radiusClass,
                        "--orbit-duration": `${durationValue}s`,
                        "--orbit-play-state": isPaused ? "paused" : "running",
                        "--hover-color": item.color,
                        zIndex: isHovered ? 30 : 10,
                        transformStyle: "preserve-3d",
                      }}
                    >
                      <div
                        className="absolute right-0 top-1/2 h-[1.5px] origin-right -translate-y-1/2 pointer-events-none transition-opacity duration-300 z-0"
                        style={{
                          width: orbit.radiusClass,
                          opacity: isHovered ? 1 : 0,
                          background: `linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(255,255,255,0.15) 20%, ${item.color} 80%, ${item.color} 100%)`,
                          boxShadow: `0 0 8px ${item.color}, 0 0 16px ${item.color}40`,
                        }}
                      />

                      <div
                        onMouseEnter={() => setHoveredId(item.id)}
                        onMouseLeave={() => setHoveredId(null)}
                        className="orbit-logo-card animate-custom-billboard"
                        style={{
                          animationDelay: `${delayValue}s`,
                          animationDuration: `${durationValue}s`,
                          animationPlayState: isPaused ? "paused" : "running",
                          borderColor: isHovered ? item.color : undefined,
                          boxShadow: isHovered
                            ? `0 0 20px rgba(0, 0, 0, 0.6), 0 0 15px ${item.color}35`
                            : undefined,
                          scale: isHovered ? 1.05 : 1,
                          "--orbit-duration": `${durationValue}s`,
                          "--orbit-play-state": isPaused ? "paused" : "running",
                        }}
                      >
                        <div
                          className="transition-transform duration-300"
                          style={{
                            transform: isHovered ? "scale(1.1)" : "scale(1)",
                            color: item.color,
                          }}
                        >
                          {item.svg}
                        </div>
                        <span className="text-[11px] md:text-[13px] tracking-tight">{item.label}</span>
                      </div>
                    </div>
                  );
                })}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    );
  }
);

SolarSystem.displayName = "SolarSystem";
