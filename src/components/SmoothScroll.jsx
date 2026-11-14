
import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const SmoothScroll = ({ children }) => {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Mobile fix: URL bar show/hide fires resize -> triggers get mis-measured.
    ScrollTrigger.config({ ignoreMobileResize: true });

    const isTouch =
      typeof window !== "undefined" &&
      (window.matchMedia("(hover: none), (pointer: coarse)").matches ||
        window.innerWidth < 1024);

    const lenis = new Lenis({
      duration: isTouch ? 1.0 : 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // On touch devices, native scrolling feels best — keep Lenis off for touch.
      syncTouch: false,
    });

    // Expose the active Lenis instance globally so other components (e.g. the
    // navbar menu) can request smooth scroll-to-section animations through
    // the same engine that's already running. Falling back to native
    // window.scrollTo would fight Lenis and feel jumpy.
    if (typeof window !== "undefined") {
      window.__lenis = lenis;
    }

    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // Re-measure all scroll animations whenever page height changes
    // (fonts, lazy images, orientation change). Without this, on phones the
    // trigger positions go stale and animations never start.
    let timer;
    const refresh = () => {
      clearTimeout(timer);
      timer = setTimeout(() => ScrollTrigger.refresh(), 200);
    };
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(refresh) : null;
    ro?.observe(document.body);
    window.addEventListener("load", refresh);
    window.addEventListener("orientationchange", refresh);
    document.fonts?.ready.then(refresh);
    refresh();

    return () => {
      clearTimeout(timer);
      ro?.disconnect();
      window.removeEventListener("load", refresh);
      window.removeEventListener("orientationchange", refresh);
      lenis.destroy();
      if (typeof window !== "undefined" && window.__lenis === lenis) {
        delete window.__lenis;
      }
    };
  }, []);

  return children;
};

export default SmoothScroll;
