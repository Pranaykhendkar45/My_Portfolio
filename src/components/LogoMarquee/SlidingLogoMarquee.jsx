"use client";

import React, { useRef, useState, useMemo } from "react";

// Project mein "@/components/lib/utils" ka cn() nahi tha, isliye chhota
// local helper bana diya — bas non-empty classNames ko join karta hai.
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

// lucide-react install nahi hai is project mein, isliye Play/Pause
// icons simple inline SVG se bana diye — koi extra dependency nahi chahiye.
function PlayIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" {...props}>
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}
function PauseIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" {...props}>
      <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
    </svg>
  );
}

export function SlidingLogoMarquee({
  items,
  speed = 1,
  pauseOnHover = true,
  enableBlur = true,
  blurIntensity = 1,

  // ============================================================
  // ---- YAHAN SE SIZE CONTROL HOTA HAI (height / width) ----
  // height = strip ki height (chhoti rakhni hai to px kam rakh, e.g. "70px")
  // width  = "100%" => full width edge-to-edge (jo abhi default hai)
  // ============================================================
  height = "80px",
  width = "100%",

  gap = "2rem",
  scale = 1,
  direction = "horizontal",
  autoPlay = true,
  backgroundColor = "!transparent",
  showGridBackground = false,
  className,
  onItemClick,
  enableSpillEffect = false,
  animationSteps = 8,
  showControls = true,
}) {
  const containerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);

  // Seamless loop ke liye items ko duplicate kar rahe hain
  const duplicatedItems = useMemo(() => [...items, ...items], [items]);

  const handleItemClick = (item) => {
    if (item.href) {
      window.open(item.href, "_blank", "noopener,noreferrer");
    }
    onItemClick?.(item);
  };

  const togglePlayState = () => {
    setIsPlaying(!isPlaying);
  };

  const blurDivs = Array.from({ length: animationSteps }, (_, index) => (
    <div
      key={index}
      style={{ "--index": index }}
      className="absolute inset-0 z-[var(--index)]"
    />
  ));

  const itemRenderer = (item, index, isDuplicate) => (
    <li
      key={`${item.id}-${index}-${isDuplicate ? "dup" : "orig"}`}
      className={cn(
        "sliding-marquee-item text-foreground",
        "grid place-items-center cursor-pointer transition-transform duration-200 ease-in-out",
        "hover:scale-[1.05] focus:scale-[1.05] focus:outline-none focus:ring-2 focus:ring-primary",
        "backdrop-blur-sm"
      )}
      onClick={() => handleItemClick(item)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          handleItemClick(item);
        }
      }}
    >
      <div className="h-4/5 w-auto">{item.content}</div>
    </li>
  );

  return (
    <>
      <style>
        {`
        .sliding-marquee-container {
          --speed: ${speed};
          --gap: ${gap};
          --blur: ${blurIntensity};
          --blurs: ${animationSteps};
          --duration: calc(200s / var(--speed));
        }

        @keyframes marquee-horizontal {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        @keyframes marquee-vertical {
          from { transform: translateY(0); }
          to { transform: translateY(-50%); }
        }

        .sliding-marquee-list {
          display: flex;
          flex-shrink: 0;
          min-width: 200%;
          gap: var(--gap);
          height: 100%;
          align-items: center;
          list-style-type: none;
          padding-inline: 0;
          margin: 0;
          pointer-events: auto;
          animation: marquee-horizontal var(--duration) linear infinite paused;
          transform: translateZ(0);
          will-change: transform;
        }

        .sliding-marquee-resizable[data-direction="vertical"] .sliding-marquee-list {
            flex-direction: column;
            min-width: unset;
            min-height: 200%;
            width: 100%;
            animation: marquee-vertical var(--duration) linear infinite paused;
        }

        .sliding-marquee-item {
          min-width: clamp(100px, 15vw, 250px);
          height: 80%;
          aspect-ratio: 16 / 9;
          font-size: clamp(1rem, 1vw + 0.5rem, 2rem);
        }

        [data-play-state="running"] .sliding-marquee-list {
          animation-play-state: running !important;
        }
        [data-play-state="paused"] .sliding-marquee-list {
          animation-play-state: paused !important;
        }

        .sliding-marquee-resizable {
          overflow: hidden;
          scale: var(--scale);
          width: 100%;
          height: ${height};
          position: relative;
        }

        .sliding-marquee-inner {
          height: 100%;
          width: 100%;
          position: relative;
          mask: linear-gradient(90deg, transparent, black 15% 85%, transparent);
          display: flex;
          pointer-events: none;
        }

        .sliding-marquee-blur { position: absolute; top: 0; bottom: 0; width: 25%; z-index: 2; pointer-events: none; }
        .sliding-marquee-blur--right { right: 0; }
        .sliding-marquee-blur--left { left: 0; rotate: 180deg; }
        .sliding-marquee-blur div {
            mask: linear-gradient(90deg,
                transparent calc(var(--index) * calc((100 / var(--blurs)) * 1%)),
                black calc((var(--index) + 1) * calc((100 / var(--blurs)) * 1%)),
                black calc((var(--index) + 2) * calc((100 / var(--blurs)) * 1%)),
                transparent calc((var(--index) + 3) * calc((100 / var(--blurs)) * 1%)));
            backdrop-filter: blur(calc((var(--index, 0) * var(--blur, 0)) * 1px));
        }
        .sliding-marquee-resizable[data-spill="true"] { container-type: size; }
        .sliding-marquee-resizable[data-spill="true"] .sliding-marquee-inner::after {
            content: ""; position: fixed; top: 50%; left: 50%; width: calc(var(--scale) * 10000vw); height: calc(var(--scale) * 10000vh);
            pointer-events: none; translate: -50% -50%;
            mask: linear-gradient(white, white) 50% 50% / 100% 100% no-repeat, linear-gradient(white, white) 50% 50% / 100cqi 100cqh no-repeat;
            mask-composite: exclude;
        }
        `}
      </style>

      <div
        ref={containerRef}
        className={cn("sliding-marquee-container relative", className)}
        style={{ width, background: backgroundColor, scale: scale }}
        onMouseEnter={() => pauseOnHover && setIsPlaying(false)}
        onMouseLeave={() => pauseOnHover && setIsPlaying(true)}
      >
        {showGridBackground && (
          <div className="absolute inset-0 pointer-events-none opacity-5">
            <div className="h-full w-full bg-[radial-gradient(#4b5563_1px,transparent_1px)] [background-size:16px_16px]" />
          </div>
        )}

        <div
          className="sliding-marquee-resizable"
          data-direction={direction}
          data-blurring={enableBlur}
          data-play-state={isPlaying ? "running" : "paused"}
          data-spill={enableSpillEffect}
        >
          <div className="sliding-marquee-inner">
            {enableBlur && (
              <div className="sliding-marquee-blur sliding-marquee-blur--left">
                {blurDivs}
              </div>
            )}

            <ul className="sliding-marquee-list text-foreground" aria-hidden={false}>
              {items.map((item, index) => itemRenderer(item, index, false))}
              {items.map((item, index) => itemRenderer(item, index, true))}
            </ul>

            {enableBlur && (
              <div className="sliding-marquee-blur sliding-marquee-blur--right">
                {blurDivs}
              </div>
            )}
          </div>
        </div>

        {showControls && (
          <button
            onClick={togglePlayState}
            className={cn(
              "absolute top-1/2 right-2 transform -translate-y-1/2 z-10 p-2 text-xs",
              "bg-gray-800/50 text-white",
              "rounded-full hover:bg-gray-700/70 transition-colors",
              "focus:outline-none focus:ring-2 focus:ring-primary"
            )}
            aria-label={isPlaying ? "Pause animation" : "Play animation"}
          >
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>
        )}
      </div>
    </>
  );
}

export default SlidingLogoMarquee;
