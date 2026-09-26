import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Shared char-split scroll-reveal, same animation used across the site
// (About heading, Projects/Gallery/Testimonials headings, the big
// "let's talk." in Contact). Splits `children` (must be a plain string)
// into one <span> per character and reveals them on scroll with a
// stagger, so every heading feels consistent site-wide.
export const SplitText = ({
  children,
  as: Component = "h2",
  className = "",
  style,
  y = 60,
  duration = 1,
  start = "top 88%",
  ...rest
}) => {
  const ref = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined" || !ref.current) return;
    const chars = ref.current.querySelectorAll(".split-char");

    const ctx = gsap.context(() => {
      gsap.from(chars, {
        opacity: 0,
        y,
        duration,
        stagger: { amount: Math.min(0.6, chars.length * 0.02), from: "start" },
        ease: "power3.out",
        scrollTrigger: {
          trigger: ref.current,
          start,
          toggleActions: "play none none reverse",
        },
      });
    });

    return () => ctx.revert();
  }, [children, y, duration, start]);

  return (
    <Component ref={ref} className={className} style={style} {...rest}>
      {String(children)
        .split("")
        .map((char, i) => (
          <span key={i} className="split-char inline-block">
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
    </Component>
  );
};

export default SplitText;
