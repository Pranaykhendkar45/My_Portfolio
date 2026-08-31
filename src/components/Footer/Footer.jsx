import React from "react";
import { LineHoverLink, lineHoverStyles } from "@/components/ui/line-hover-link";
import SocialFlipButton from "@/components/ui/social-flip-button";
import {
  FaGithub,
  FaWhatsapp,
  FaLinkedin,
  FaInstagram,
  FaEnvelope,
} from "react-icons/fa";

// Shared contact targets — same as Navbar/Menu/LetsTalk. Keep these in
// sync if the real email/whatsapp/instagram ever change.
const EMAIL = "khendkarpranay@gmail.com";
const WHATSAPP_URL = "https://wa.me/+919359260318";
const INSTAGRAM_URL =
  "https://www.instagram.com/ig.pranay_khendkar?igsh=MXV3aGRlc24xeTBnMg==";
const GITHUB_URL = "https://github.com/Pranaykhendkar45";
const LINKEDIN_URL =
  "https://www.linkedin.com/in/pranay-khendkar-304527385?utm_source=share_via&utm_content=profile&utm_medium=member_android";

// Letters spell out "CONTACT" on the front face; hovering flips each
// tile to reveal the actual icon/link underneath.
const socialFlipItems = [
  { letter: "C", icon: <FaGithub />, label: "GitHub", href: GITHUB_URL },
  { letter: "O", icon: <FaWhatsapp />, label: "WhatsApp", href: WHATSAPP_URL },
  { letter: "N", icon: <FaLinkedin />, label: "LinkedIn", href: LINKEDIN_URL },
  { letter: "T", icon: <FaInstagram />, label: "Instagram", href: INSTAGRAM_URL },
  { letter: "A", icon: <FaGithub />, label: "GitHub", href: GITHUB_URL },
  { letter: "C", icon: <FaEnvelope />, label: "Email", href: `mailto:${EMAIL}` },
  { letter: "T", icon: <FaEnvelope />, label: "Email", href: `mailto:${EMAIL}` },
];

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
      {/* Hover-underline effect styles, injected once for all footer links */}
      <style>{lineHoverStyles}</style>
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
          <div className="mt-6">
            <SocialFlipButton items={socialFlipItems} className="justify-start" />
          </div>
        </div>

        {/* Explore + Contact links */}
        <div className="grid grid-cols-2 gap-8">
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-fg-subtle mb-1">
              Explore
            </h3>
            <LineHoverLink
              as="button"
              variant="slide"
              injectStyle={false}
              onClick={() => scrollToSection("about")}
              className="text-left text-fg-muted hover:text-fg transition-colors"
            >
              About
            </LineHoverLink>
            <LineHoverLink
              as="button"
              variant="slide"
              injectStyle={false}
              onClick={() => scrollToSection("projects-section")}
              className="text-left text-fg-muted hover:text-fg transition-colors"
            >
              Projects
            </LineHoverLink>
            <LineHoverLink
              as="button"
              variant="slide"
              injectStyle={false}
              onClick={() => scrollToSection("gallery-section")}
              className="text-left text-fg-muted hover:text-fg transition-colors"
            >
              Gallery
            </LineHoverLink>
            <LineHoverLink
              as="button"
              variant="slide"
              injectStyle={false}
              onClick={() => scrollToSection("contact-section")}
              className="text-left text-fg-muted hover:text-fg transition-colors"
            >
              Get in touch
            </LineHoverLink>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-fg-subtle mb-1">
              Contact
            </h3>
            <LineHoverLink
              variant="slide"
              injectStyle={false}
              href={`mailto:${EMAIL}`}
              className="text-fg-muted hover:text-fg transition-colors break-all"
            >
              {EMAIL}
            </LineHoverLink>
            <LineHoverLink
              variant="slide"
              injectStyle={false}
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              className="text-fg-muted hover:text-fg transition-colors"
            >
              Chat on WhatsApp
            </LineHoverLink>
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
