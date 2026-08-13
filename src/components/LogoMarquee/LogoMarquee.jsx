// LogoMarquee — adapted from SmoothUI's logo-cloud-3 block
// Real brand SVGs weren't provided, so plain text wordmarks are used here.
// Swap the DEFAULT_LOGOS array with your own <img>/<svg> logos any time.

const DEFAULT_LOGOS = [
  { name: "🚀WELCOME TO MY PORTFOLIO" },
  { name: "🚀WELCOME TO MY PORTFOLIO" },
  { name: "🚀WELCOME TO MY PORTFOLIO" },
  { name: "🚀WELCOME TO MY PORTFOLIO" },

];

const SPEED_MAP = {
  fast: "20s",
  normal: "40s",
  slow: "60s",
};

export function LogoMarquee({
  title,
  description,
  logos = DEFAULT_LOGOS,
  speed = "normal",
  direction = "left",
  pauseOnHover = true,
  // ---- YAHAN SE SIZE CONTROL HOTA HAI ----
  fullWidth = true, // true => edge-to-edge full width, false => max-w-7xl centered
  heightClass = "py-4", // strip ki height (padding) — chhota rakhne ke liye kam value
}) {
  const animationDuration = SPEED_MAP[speed];
  const animationDirection = direction === "right" ? "reverse" : "normal";

  return (
    <section className={`overflow-hidden ${heightClass}`}>
      <style>
        {`
          @keyframes marquee-scroll {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }
          .marquee-track {
            animation: marquee-scroll var(--marquee-duration, 40s) linear infinite;
            animation-direction: var(--marquee-direction, normal);
          }
          .marquee-container:hover .marquee-track {
            animation-play-state: var(--marquee-pause-on-hover, running);
          }
          @media (prefers-reduced-motion: reduce) {
            .marquee-track { animation: none; }
          }
        `}
      </style>

      {/* fullWidth=true => 'w-full px-0' (edge to edge)
          fullWidth=false => 'mx-auto max-w-7xl px-6' (centered, constrained) */}
      <div className={fullWidth ? "w-full" : "mx-auto max-w-7xl px-6"}>
        {(title || description) && (
          <div className="mb-6 text-center">
            {title && (
              <h2 className="mb-2 font-bold text-2xl text-foreground lg:text-3xl">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-foreground/70 text-lg">{description}</p>
            )}
          </div>
        )}

        <div
          className="marquee-container relative overflow-hidden"
          style={{
            maskImage:
              "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
          }}
        >
          <div
            className="marquee-track flex w-max"
            style={{
              "--marquee-direction": animationDirection,
              "--marquee-duration": animationDuration,
              "--marquee-pause-on-hover": pauseOnHover ? "paused" : "running",
            }}
          >
            {[...logos, ...logos].map((logo, index) => (
              <div
                className="flex shrink-0 items-center justify-center px-8 opacity-60 transition-opacity duration-200 hover:opacity-100"
                key={`${logo.name}-${index}`}
              >
                <span className="whitespace-nowrap font-semibold text-foreground text-xl tracking-tight">
                  {logo.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default LogoMarquee;
