
import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LiquidEther from "../LiquidEther/LiquidEther";

// Module-level constant so the array reference stays stable across renders
// (otherwise LiquidEther's useEffect would tear down/rebuild WebGL each render).
const HERO_LIQUID_COLORS = ["#D9E6FF"];

const SplitChars = ({ text, className, id }) => {
  return (
    <span className={className} id={id}>
      {text.split("").map((char, i) => (
        <span
          key={i}
          className="hero-char"
          style={{ display: "inline-block" }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  );
};

const HeroSection = () => {
  const sectionRef = useRef(null);
  const imgRef = useRef(null);
  const headingRef = useRef(null);
  const loaderRef = useRef(null);
  const loaderCounterRef = useRef(null);
  const stroke1Ref = useRef(null);
  const stroke2Ref = useRef(null);
  const endLineRef = useRef(null);
  const parallaxInstanceRef = useRef(null);
  const [loaderDone, setLoaderDone] = useState(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    document.body.style.overflow = "hidden";

    const headingChars = headingRef.current.querySelectorAll(".hero-char");

    // Hide hero elements initially
    gsap.set(headingChars, { autoAlpha: 0, y: 100 });
    gsap.set(imgRef.current, { autoAlpha: 0, y: "50%", scale: 0.8 });
    gsap.set([stroke1Ref.current, stroke2Ref.current], { autoAlpha: 0, width: "0%" });
    gsap.set(endLineRef.current, { autoAlpha: 0 });

    // Breaker line: invisible at the top of the page, fades in as the user
    // scrolls down. Tied to scroll position via scrub so it tracks Lenis
    // smooth-scroll precisely.
    const endLineTrigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: "+=300",
      scrub: true,
      animation: gsap.to(endLineRef.current, { autoAlpha: 1, ease: "none" }),
    });

    // iOS 13+ requires explicit permission to receive deviceorientation events.
    // parallax-js uses those events automatically on mobile (gyroscope mode),
    // so we ask for permission on the first user gesture.
    const requestGyroPermission = () => {
      if (
        typeof DeviceOrientationEvent !== "undefined" &&
        typeof DeviceOrientationEvent.requestPermission === "function"
      ) {
        DeviceOrientationEvent.requestPermission().catch(() => {});
      }
    };
    const handleFirstGesture = () => {
      requestGyroPermission();
      window.removeEventListener("touchstart", handleFirstGesture);
      window.removeEventListener("click", handleFirstGesture);
    };
    window.addEventListener("touchstart", handleFirstGesture, { once: true, passive: true });
    window.addEventListener("click", handleFirstGesture, { once: true });

    // Initialize wagerfield/parallax (parallax-js) after GSAP reveal finishes.
    // On touch devices we keep the gyroscope-driven motion, but soften the
    // movement so the hero still feels stable on phones.
    const initParallax = async () => {
      if (typeof window === "undefined" || !sectionRef.current) return;
      const isTouch =
        window.matchMedia("(hover: none), (pointer: coarse)").matches ||
        window.innerWidth < 1024;
      try {
        const mod = await import("parallax-js");
        const Parallax = mod.default || mod;
        if (!sectionRef.current) return;
        parallaxInstanceRef.current = new Parallax(sectionRef.current, {
          relativeInput: true,
          hoverOnly: !isTouch,
          selector: ".hero-layer",
          scalarX: isTouch ? 4 : 2,
          scalarY: isTouch ? 4 : 2,
          frictionX: isTouch ? 0.18 : 0.1,
          frictionY: isTouch ? 0.18 : 0.1,
        });
      } catch (err) {
        console.error("Failed to init parallax-js:", err);
      }
    };

    // Pick stroke widths based on viewport so the strokes don't dwarf the hero
    // on phones.
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const stroke1Width = isMobile ? "40vw" : "22vw";
    const stroke2Width = isMobile ? "30vw" : "16vw";

    const tl = gsap.timeline({
      onComplete: () => {
        setLoaderDone(true);
        document.body.style.overflow = "";
        initParallax();
      },
    });

    const counter = { value: 0 };

    // Loader counter: 0 → 100
    tl.to(counter, {
      value: 100,
      duration: 2,
      ease: "power2.inOut",
      onUpdate: () => {
        if (loaderCounterRef.current) {
          loaderCounterRef.current.innerText = `${Math.floor(counter.value)}`;
        }
      },
    }, "anim");

    // Loader slide up
    tl.to(loaderRef.current, {
      y: "-100%",
      duration: 1.8,
      ease: "power3.out",
    }, "anim+=2.2");

    // Counter fade out
    tl.to(loaderCounterRef.current, {
      autoAlpha: 0,
      duration: 1,
      ease: "power2.out",
    }, "anim+=2");

    // Heading chars animation
    tl.to(headingChars, {
      autoAlpha: 1,
      y: 0,
      stagger: {
        amount: 0.5,
        from: "start",
      },
      duration: 1,
      ease: "power3.out",
    }, "anim+=3.2");

    // Image animation
    tl.to(imgRef.current, {
      autoAlpha: 1,
      y: 0,
      scale: 1,
      duration: 1,
      ease: "sine.out",
    }, "anim+=4.2");

    // Stroke 2 animation (right side, slightly earlier)
    tl.to(stroke2Ref.current, {
      autoAlpha: 1,
      width: stroke2Width,
      duration: 1,
      ease: "power2.out",
    }, "anim+=4.3");

    // Stroke 1 animation (left side)
    tl.to(stroke1Ref.current, {
      autoAlpha: 1,
      width: stroke1Width,
      duration: 1,
      ease: "power2.out",
    }, "anim+=4.5");

    return () => {
      tl.kill();
      endLineTrigger.kill();
      if (parallaxInstanceRef.current) {
        try {
          parallaxInstanceRef.current.destroy();
        } catch (e) {}
        parallaxInstanceRef.current = null;
      }
      window.removeEventListener("touchstart", handleFirstGesture);
      window.removeEventListener("click", handleFirstGesture);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <>
      {/* Loader */}
      <div id="loader" ref={loaderRef}>
        <div id="loader-counter" ref={loaderCounterRef}>0</div>
      </div>

      {/* Hero — direct children of #hero-section are parallax layers.
          Each layer's `data-depth` controls how much it moves with the cursor. */}
      <div id="hero-section" ref={sectionRef}>
        {/* Animated fluid background. Not a `.hero-layer` so parallax-js skips it. */}
        <div id="hero-bg-fluid">
          <LiquidEther
            colors={HERO_LIQUID_COLORS}
            mouseForce={20}
            cursorSize={100}
            isViscous={false}
            viscous={30}
            iterationsViscous={32}
            iterationsPoisson={32}
            resolution={0.5}
            isBounce={false}
            autoDemo={true}
            autoSpeed={0.5}
            autoIntensity={2.2}
            takeoverDuration={0.25}
            autoResumeDelay={3000}
            autoRampDuration={0.6}
          />
        </div>

        {/* Back stroke (behind heading) */}
        <div className="hero-layer" data-depth="0.20" style={{ zIndex: 4 }}>
          <div id="hero-stroke-2" ref={stroke2Ref}>
            <img src="/Svg_Stroke.png" alt="" draggable="false" />
          </div>
        </div>

        {/* Heading text (deepest, moves least) */}
        <div className="hero-layer" data-depth="0.10" style={{ zIndex: 5 }}>
          <div id="hero-heading" ref={headingRef}>
            <SplitChars text="PRANAY" />
          </div>
        </div>

        {/* Portrait image (foreground, moves more) */}
        <div className="hero-layer" data-depth="0.50" style={{ zIndex: 10 }}>
          <div id="hero-img" ref={imgRef}>
            <img src="/Portfolio.png" alt="" draggable="false" />
          </div>
        </div>

        {/* Front stroke (top-most) */}
        <div className="hero-layer" data-depth="0.30" style={{ zIndex: 11 }}>
          <div id="hero-stroke-1" ref={stroke1Ref}>
            <img src="/Svg_Stroke.png" alt="" draggable="false" />
          </div>
        </div>

        {/* End-of-hero indicator line */}
        <div className="hero-end-line" ref={endLineRef}></div>
      </div>
    </>
  );
};

export default HeroSection;
