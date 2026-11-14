import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaWhatsapp } from "react-icons/fa";
import { SplitText } from "../ui/split-text";

// Shared contact targets — same as Navbar/LetsTalk/Footer. Keep these
// in sync if the real email/whatsapp ever change.
const EMAIL = "khendkarpranay@gmail.com";
const WHATSAPP_URL = "https://wa.me/+919359260318";

// Corner dots, same visual language as SectionBadge, but sized for a big box.
const CornerDot = ({ className }) => (
  <span className={`absolute w-[6px] h-[6px] rounded-full bg-accent ${className}`} />
);

// Web3Forms (free): https://web3forms.com -> email daal ke Access Key lo,
// phir .env me VITE_WEB3FORMS_KEY=xxxx daalo (aur Vercel env me bhi).
const W3F_KEY = import.meta.env.VITE_WEB3FORMS_KEY;

const ContactForm = () => {
  const [status, setStatus] = useState("idle"); // idle | sending | ok | error
  const onSubmit = async (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    if (f.get("botcheck")) return; // honeypot: bots fill this
    const name = f.get("name"), email = f.get("email"), message = f.get("message");
    if (!W3F_KEY) {
      // key nahi hai to mail app khol do
      window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent("Portfolio message from " + name)}&body=${encodeURIComponent(message + "\n\n" + name + " (" + email + ")")}`;
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: W3F_KEY,
          subject: `Portfolio message from ${name}`,
          from_name: "Portfolio Contact Form",
          name, email, message,
          replyto: email,
        }),
      });
      const data = await res.json();
      if (data.success) { setStatus("ok"); e.target.reset(); } else setStatus("error");
    } catch { setStatus("error"); }
  };
  const field = "w-full rounded-xl border border-theme-border bg-bg px-4 py-3 font-cond text-base text-fg outline-none transition-colors placeholder:text-fg-subtle focus:border-accent";
  return (
    <form onSubmit={onSubmit} className="relative mt-12 w-full max-w-xl space-y-3 text-left">
      <input type="text" name="botcheck" tabIndex={-1} autoComplete="off" className="hidden" />
      <div className="grid gap-3 md:grid-cols-2">
        <input name="name" required placeholder="Your name" className={field} />
        <input name="email" type="email" required placeholder="Your email" className={field} />
      </div>
      <textarea name="message" required rows={4} placeholder="Tell me about your idea..." className={field} />
      <button
        type="submit"
        disabled={status === "sending"}
        className="ct-btn-primary inline-flex h-12 w-full items-center justify-center rounded-full text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-60"
      >
        {status === "sending" ? "Sending..." : "Send Message"}
      </button>
      {status === "ok" && <p className="text-center font-cond text-sm text-accent">Thanks! Your message is sent, I'll reply soon.</p>}
      {status === "error" && <p className="text-center font-cond text-sm text-red-500">Something went wrong. Please email me directly instead.</p>}
    </form>
  );
};

const Contact = () => {
  const sectionRef = useRef(null);
  const boxRef = useRef(null);
  const subRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from(boxRef.current, {
        autoAlpha: 0,
        y: 40,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: boxRef.current,
          start: "top 90%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.from([subRef.current, ctaRef.current], {
        autoAlpha: 0,
        y: 30,
        duration: 1,
        stagger: 0.15,
        ease: "power2.out",
        scrollTrigger: {
          trigger: subRef.current,
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
      className="w-full bg-bg text-fg px-5 md:px-8 py-16 md:py-24"
    >
      <div
        ref={boxRef}
        className="ct-box relative mx-auto max-w-6xl rounded-3xl border border-accent/50 px-6 py-16 md:px-16 md:py-24 flex flex-col items-center text-center overflow-hidden"
      >
        <div aria-hidden="true" className="ct-box-glow pointer-events-none absolute inset-0" />

        <CornerDot className="top-4 left-4" />
        <CornerDot className="top-4 right-4" />
        <CornerDot className="bottom-4 left-4" />
        <CornerDot className="bottom-4 right-4" />

        <h2
          className="relative font-hero font-bold leading-[1.1] tracking-tight text-fg"
          style={{ fontSize: "clamp(1.9rem, 5.2vw, 4.25rem)" }}
        >
          <SplitText as="span" className="inline">
            Have an idea? Let's build it and{" "}
          </SplitText>
          <span className="ct-shipit inline-flex items-center rounded-full border border-accent px-5 py-1 text-accent">
            <SplitText as="span" className="inline">
              ship it
            </SplitText>
          </span>
        </h2>

        <SplitText
          as="h3"
          className="relative about-accent-text font-semibold lowercase pointer-events-none leading-[0.9] m-0 mt-6 md:mt-10"
          style={{
            fontSize: "clamp(2.5rem, 13vw, 12rem)",
            letterSpacing: "-0.07em",
          }}
          y={120}
          duration={1.2}
        >
          let's talk.
        </SplitText>

        <p
          ref={subRef}
          className="relative mt-8 md:mt-10 max-w-xl text-base md:text-lg leading-relaxed text-fg-muted font-cond"
        >
          Open to internships, freelance work and team projects. Tell me what
          you're building and I'll reply fast.
        </p>

        <div
          ref={ctaRef}
          className="relative flex items-center gap-3 md:gap-4 mt-9 flex-wrap justify-center"
        >
          <a
            href={`mailto:${EMAIL}`}
            className="ct-btn-primary inline-flex items-center justify-center gap-2 px-7 h-12 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300 hover:-translate-y-0.5 group"
          >
            <span>Send a message</span>
          </a>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            className="ct-btn-secondary inline-flex items-center justify-center gap-2 px-7 h-12 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300 hover:-translate-y-0.5 group"
          >
            <FaWhatsapp size={18} />
            <span>Chat on WhatsApp</span>
          </a>
        </div>

        <ContactForm />
      </div>
    </section>
  );
};

export default Contact;
