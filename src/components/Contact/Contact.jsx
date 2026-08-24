import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Shared contact targets — same as Navbar/LetsTalk/Footer. Keep these
// in sync if the real email/whatsapp ever change.
const EMAIL = "khendkarpranay@gmail.com";
const WHATSAPP_URL = "https://wa.me/+919359260318";

const ArrowUpRight = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M7 17 17 7" />
    <path d="M7 7h10v10" />
  </svg>
);

const splitChars = (text) =>
  text.split("").map((char, i) => (
    <span key={i} className="ct-char inline-block">
      {char === " " ? "\u00A0" : char}
    </span>
  ));

const Contact = () => {
  const sectionRef = useRef(null);
  const eyebrowRef = useRef(null);
  const headlineRef = useRef(null);
  const emailRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const eyebrowChars = eyebrowRef.current?.querySelectorAll(".ct-char") ?? [];
      const headlineChars = headlineRef.current?.querySelectorAll(".ct-char") ?? [];

      gsap.from(eyebrowChars, {
        opacity: 0,
        y: 40,
        duration: 1.0,
        stagger: { amount: 0.4, from: "start" },
        ease: "power3.out",
        scrollTrigger: {
          trigger: eyebrowRef.current,
          start: "top 90%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.from(headlineChars, {
        opacity: 0,
        y: 200,
        duration: 1.4,
        stagger: { amount: 0.6, from: "start" },
        ease: "power3.out",
        scrollTrigger: {
          trigger: headlineRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.from([emailRef.current, ctaRef.current], {
        autoAlpha: 0,
        y: 50,
        duration: 1,
        stagger: 0.15,
        ease: "power2.out",
        scrollTrigger: {
          trigger: emailRef.current,
          start: "top 95%",
          toggleActions: "play none none reverse",
        },
      });
    }, sectionRef.current);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="contact-section"
      ref={sectionRef}
      className="w-full min-h-[90vh] bg-bg text-fg flex flex-col items-center justify-center text-center px-6 py-24 gap-4"
    >
      <div
        ref={eyebrowRef}
        className="text-fg-muted text-xs md:text-sm font-medium tracking-[0.22em] uppercase pointer-events-none whitespace-nowrap"
      >
        {splitChars("have a project in mind?")}
      </div>

      <h2
        ref={headlineRef}
        className="about-accent-text font-semibold lowercase pointer-events-none leading-[0.9] m-0"
        style={{
          fontSize: "clamp(3rem, 18vw, 18rem)",
          letterSpacing: "-0.07em",
        }}
      >
        {splitChars("let's talk.")}
      </h2>

      <a
        ref={emailRef}
        href={`mailto:${EMAIL}`}
        aria-label={`Email ${EMAIL}`}
        className="text-fg text-base md:text-xl font-medium tracking-tight border-b-[1.5px] border-current pb-1 mt-4 hover:text-accent hover:border-accent transition-colors duration-300"
      >
        {EMAIL}
      </a>

      <div
        ref={ctaRef}
        className="flex items-center gap-3 md:gap-4 mt-6 flex-wrap justify-center"
      >
        <a
          href={`mailto:${EMAIL}`}
          className="ct-btn-primary inline-flex items-center justify-center gap-2 px-6 h-12 rounded-full text-xs md:text-sm font-semibold tracking-[0.2em] uppercase whitespace-nowrap transition-all duration-300 hover:-translate-y-0.5 group"
        >
          <span>Say Hello</span>
          <span className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
            <ArrowUpRight />
          </span>
        </a>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noreferrer"
          className="ct-btn-secondary inline-flex items-center justify-center gap-2 px-6 h-12 rounded-full text-xs md:text-sm font-semibold tracking-[0.2em] uppercase whitespace-nowrap transition-all duration-300 hover:-translate-y-0.5 group"
        >
          <span>WhatsApp</span>
          <span className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
            <ArrowUpRight />
          </span>
        </a>
      </div>
    </section>
  );
};

export default Contact;
