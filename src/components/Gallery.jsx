import { useState, useEffect, useRef } from "react";
import InfiniteGallery from "./ui/3d-gallery-photography";

// ---- YAHAN SE GALLERY KI PHOTOS/VIDEOS CHANGE HOTE HAIN ----
// .mp4 wali entries video ki tarah play hongi (auto-loop, muted),
// baaki sab normal photo ki tarah.
const galleryImages = [
  { src: "/gallery-media/gallery-1.jpg", alt: "Photo 1" },
   { src: "/about-trail/trail-1.jpg", alt: "Photo 2" },
   { src: "/about-trail/trail-2.jpg", alt: "Photo 3" },
   { src: "/about-trail/trail-3.jpg", alt: "Photo 4" },
   { src: "/about-trail/trail-4.jpg", alt: "Photo 5" },
   { src: "/about-trail/trail-5.jpg", alt: "Photo 6" },
   { src: "/about-trail/trail-6.jpg", alt: "Photo 7" },
   { src: "/about-trail/trail-7.jpg", alt: "Photo 8" },
  { src: "/gallery-media/gallery-2.jpg", alt: "Photo 9" },
  { src: "/gallery-media/gallery-video-1.mp4", alt: "Video 1" },
  { src: "/gallery-media/gallery-3.jpg", alt: "Photo 10" },
  { src: "/gallery-media/gallery-4.jpg", alt: "Photo 11" },
  { src: "/gallery-media/gallery-5.jpg", alt: "Photo 12" },
  { src: "/gallery-media/gallery-video-2.mp4", alt: "Video 2" },
  { src: "/gallery-media/gallery-6.jpg", alt: "Photo 13" },
  { src: "/gallery-media/gallery-7.jpg", alt: "Photo 14" },
  { src: "/gallery-media/gallery-8.jpg", alt: "Photo 15" },
  { src: "/gallery-media/gallery-video-3.mp4", alt: "Video 3" },
  { src: "/gallery-media/gallery-9.jpg", alt: "Photo 16" },
  { src: "/gallery-media/gallery-10.jpg", alt: "Photo 17" },
  { src: "/gallery-media/gallery-11.jpg", alt: "Photo 18" },
  { src: "/gallery-media/gallery-12.jpg", alt: "Photo 19" },
];

// ---- GALLERY EXIT LOCK ----
// Jab tak user gallery ke andar hai, kam se kam itni der (ms) usko
// gallery ke andar hi rakho, phir aage (Contact/"let's talk") scroll
// karne do. Chhota number = jaldi exit, bada number = zyada der rukega.
const MIN_LOCK_MS = 5000;

// ---- LOCK KAHAN TRIGGER HO, YAHAN SE ADJUST KARO ----
// Values 0 se 1 ke beech — 0 = screen ka bilkul top, 1 = bilkul bottom.
// Niche scroll karte waqt (upar se niche aate waqt) gallery jab is
// point tak pahunche, tab lock lagega.
const LOCK_TRIGGER_PERCENT_DOWN = 0.1;

// Upar scroll karte waqt (niche se upar aate waqt) gallery jab is point
// tak pahunche, tab lock lagega — ye DOWN wale se ALAG value ho sakti
// hai, dono independently tune karo jab tak dono directions mein
// sahi jagah stick na ho.
const LOCK_TRIGGER_PERCENT_UP = 0.94;

const Gallery = () => {
  // Mobile pe kam planes render karo — perf ke liye, aur chhoti height rakho.
  const [isMobile, setIsMobile] = useState(false);
  const [locked, setLocked] = useState(false);
  const sectionRef = useRef(null);
  const canvasWrapRef = useRef(null);
  const lockedRef = useRef(false);
  const lockStartRef = useRef(0);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // ---- SCROLL LOCK LOGIC ----
  // Jab bhi gallery section viewport mein (kisi bhi taraf se — neeche
  // scroll karke ya upar scroll karke wapas) dikhna shuru hoti hai, tab
  // lock ON — page scroll freeze (Lenis.stop()) aur forward/backward
  // wheel-touch capture karke gallery ko hi feed karte hain. MIN_LOCK_MS
  // poora hone ke baad, agla scroll gesture (jis taraf bhi ho) lock hata
  // deta hai aur page us disha mein aage badhta hai. Section jab poori
  // tarah viewport se bahar chala jaata hai (upar ya neeche), "armed"
  // wapas ho jaata hai — taaki agli baar andar aane pe phir se lock lage.
  useEffect(() => {
    const target = canvasWrapRef.current;
    if (!target) return;

    const armedRef = { current: true };
    const lastScrollYRef = { current: window.scrollY };
    const directionRef = { current: "down" };

    const isIntersectingViewport = rect => rect.top < window.innerHeight && rect.bottom > 0;

    // Scroll direction track karte hain taaki alag-alag threshold use
    // kar sakein (upar/niche aane pe alag jagah lock lag sake).
    const updateDirection = () => {
      const currentY = window.scrollY;
      if (currentY > lastScrollYRef.current) directionRef.current = "down";
      else if (currentY < lastScrollYRef.current) directionRef.current = "up";
      lastScrollYRef.current = currentY;
    };

    // Sirf tab lock lagao jab gallery ka ACTUAL VISUAL (canvas) us
    // direction ke apne trigger point tak pahunch chuka ho.
    const coversTriggerLine = rect => {
      const percent =
        directionRef.current === "down" ? LOCK_TRIGGER_PERCENT_DOWN : LOCK_TRIGGER_PERCENT_UP;
      const lineY = window.innerHeight * percent;
      return rect.top <= lineY && rect.bottom >= lineY;
    };

    const tryEnterLock = () => {
      updateDirection();
      const rect = target.getBoundingClientRect();

      if (!isIntersectingViewport(rect)) {
        // Section poori tarah viewport se bahar (upar ya neeche) —
        // agli baar andar aane pe phir se lock lagne do.
        armedRef.current = true;
        return;
      }

      if (lockedRef.current || !armedRef.current) return;
      if (!coversTriggerLine(rect)) return;

      lockedRef.current = true;
      armedRef.current = false;
      lockStartRef.current = Date.now();
      setLocked(true);
      window.__lenis?.stop();
    };

    // Sirf re-arm karta hai jab section viewport se bahar chala jaaye.
    // Lock ENGAGE nahi karta — isse menu-navigation (Lenis.scrollTo se
    // hone wala programmatic "scroll" event) accidentally lock trigger
    // nahi karti. Lock sirf real user gesture (wheel/touchmove) se lagta
    // hai, jo neeche onWheel/onTouchMove ke andar tryEnterLock() call
    // karte hain.
    const armOnExit = () => {
      const rect = target.getBoundingClientRect();
      if (!isIntersectingViewport(rect)) {
        armedRef.current = true;
      }
    };

    const releaseLock = () => {
      lockedRef.current = false;
      setLocked(false);
      window.__lenis?.start();
    };

    const onWheel = e => {
      tryEnterLock();
      if (!lockedRef.current) return;

      const elapsed = Date.now() - lockStartRef.current;
      if (elapsed >= MIN_LOCK_MS) {
        // Minimum time poora ho chuka — ab is disha mein aage badhne do.
        releaseLock();
        return;
      }
      // Abhi minimum time poora nahi hua (chahe upar ja raha ho ya neeche) —
      // page scroll ko yahin rok do, gallery apna wheel listener khud
      // handle kar lega.
      e.preventDefault();
    };

    const onTouchMove = e => {
      tryEnterLock();
      if (!lockedRef.current) return;
      const elapsed = Date.now() - lockStartRef.current;
      if (elapsed >= MIN_LOCK_MS) {
        releaseLock();
        return;
      }
      e.preventDefault();
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("scroll", armOnExit, { passive: true });

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("scroll", armOnExit);
      // Agar component unmount ho jaaye jab locked ho, page scroll ko
      // hamesha ke liye freeze mat chhodo.
      if (lockedRef.current) {
        window.__lenis?.start();
      }
    };
  }, []);

  return (
    <section id="gallery-section" ref={sectionRef} className="w-full bg-bg text-fg py-16 md:py-24">
      <div className="flex items-center justify-center gap-2 pb-6 md:pb-10">
        <span className="w-2.5 h-2.5 rounded-full bg-accent" />
        <span className="text-xl md:text-3xl font-bold tracking-[0.2em] uppercase about-accent-text font-label">
          Gallery
        </span>
      </div>

      <div ref={canvasWrapRef}>
        <InfiniteGallery
          images={galleryImages}
          // ---- SPEED YAHAN SE CONTROL HOTI HAI ----
          // Chhota number = dheema, bada number = tez
          // (component ke andar SCROLL_SENSITIVITY / AUTOPLAY_SPEED /
          // VELOCITY_MULTIPLIER constants bhi fine-tuning ke liye hain —
          // src/components/ui/3d-gallery-photography.jsx ke top pe)
          speed={isMobile ? 0.5 : 0.7}
          visibleCount={isMobile ? 6 : 10}
          locked={locked}
          fadeSettings={{
            fadeIn: { start: 0.05, end: 0.25 },
            fadeOut: { start: 0.4, end: 0.43 },
          }}
          blurSettings={{
            blurIn: { start: 0.0, end: 0.1 },
            blurOut: { start: 0.4, end: 0.43 },
            maxBlur: 8.0,
          }}
          className="h-[60vh] md:h-[85vh] w-full rounded-2xl overflow-hidden"
        />
      </div>

      <p className="text-center text-xs md:text-sm mt-4 opacity-60 font-mono uppercase tracking-widest">
        Scroll / swipe to explore
      </p>
    </section>
  );
};

export default Gallery;
