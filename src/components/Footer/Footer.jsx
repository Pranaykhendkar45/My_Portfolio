import React from "react";

// Shared contact targets — same as Navbar/Menu/LetsTalk. Keep these in
// sync if the real email/whatsapp/instagram ever change.
const EMAIL = "khendkarpranay@gmail.com";
const WHATSAPP_URL = "https://wa.me/+919359260318";
const INSTAGRAM_URL =
  "https://www.instagram.com/ig.pranay_khendkar?igsh=MXV3aGRlc24xeTBnMg==";

const Icon = ({ children }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {children}
  </svg>
);

const InstagramIcon = () => (
  <Icon>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </Icon>
);

const WhatsAppIcon = () => (
  <Icon>
    <path d="M3 21l1.65-4.95A9 9 0 1 1 8.05 19.35z" />
    <path d="M8.5 8.5a1 1 0 0 1 1-1h.5a1 1 0 0 1 1 .8l.35 1.75a1 1 0 0 1-.27.93l-.6.6a6 6 0 0 0 2.94 2.94l.6-.6a1 1 0 0 1 .93-.27l1.75.35a1 1 0 0 1 .8 1v.5a1 1 0 0 1-1 1A9.5 9.5 0 0 1 8.5 8.5z" />
  </Icon>
);

const MailIcon = () => (
  <Icon>
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </Icon>
);

// Smooth-scroll to an in-page section, same approach as Navbar.jsx —
// falls back to native scroll if the Lenis instance isn't ready.
const scrollToSection = (id) => {
  if (typeof window === "undefined") return;
  const target = id === "top" ? 0 : document.getElementById(id);
  if (target == null) return;
  const lenis = window.__lenis;
  if (lenis && typeof lenis.scrollTo === "function") {
    lenis.scrollTo(target, { offset: 0, duration: 1.4 });
    return;
  }
  if (target === 0) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  } else {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

const Footer = () => {
  return (
    <footer
      id="main-footer"
      className="w-full bg-bg text-fg border-t border-theme-border"
    >
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-14 md:py-20 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-8">
        {/* Brand + blurb + socials */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight about-accent-text">
            PRANAY
          </h1>
          <p className="mt-4 text-fg-muted max-w-xs leading-relaxed">
            Building clean, thoughtful interfaces and the systems that
            power them.
          </p>
          <div className="flex items-center gap-3 mt-6">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="nav_btn_sm flex items-center justify-center hover:opacity-70 transition-opacity"
            >
              <InstagramIcon />
            </a>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
              className="nav_btn_sm flex items-center justify-center hover:opacity-70 transition-opacity"
            >
              <WhatsAppIcon />
            </a>
            <a
              href={`mailto:${EMAIL}`}
              aria-label={`Email ${EMAIL}`}
              className="nav_btn_sm flex items-center justify-center hover:opacity-70 transition-opacity"
            >
              <MailIcon />
            </a>
          </div>
        </div>

        {/* Explore + Contact links */}
        <div className="grid grid-cols-2 gap-8">
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-fg-subtle mb-1">
              Explore
            </h3>
            <button
              onClick={() => scrollToSection("about")}
              className="text-left text-fg-muted hover:text-fg transition-colors w-fit"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection("projects-section")}
              className="text-left text-fg-muted hover:text-fg transition-colors w-fit"
            >
              Projects
            </button>
            <button
              onClick={() => scrollToSection("gallery-section")}
              className="text-left text-fg-muted hover:text-fg transition-colors w-fit"
            >
              Gallery
            </button>
            <button
              onClick={() => scrollToSection("contact-section")}
              className="text-left text-fg-muted hover:text-fg transition-colors w-fit"
            >
              Get in touch
            </button>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-fg-subtle mb-1">
              Contact
            </h3>
            <a
              href={`mailto:${EMAIL}`}
              className="text-fg-muted hover:text-fg transition-colors break-all"
            >
              {EMAIL}
            </a>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              className="text-fg-muted hover:text-fg transition-colors"
            >
              WhatsApp: +91 93592 60318
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-theme-border">
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-5 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-fg-subtle">
          <p>© {new Date().getFullYear()} Pranay. All rights reserved.</p>
          <p>Designed &amp; built by Pranay</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
