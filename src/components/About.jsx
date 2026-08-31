import ProfileCard from "./ProfileCard";
import { MorphText } from "./ui/morph-text";
import { TypingText } from "./ui/typing-text";
import CursorImageTrail from "./CursorImageTrail/CursorImageTrail";

const About = () => {
  return (
    <section
      id="about"
      className="w-full px-6 md:px-20 py-20 md:py-32"
    >
      <CursorImageTrail
        imageWidth={130}
        imageHeight={130}
        radius={12}
        frequency={35}
        visibleFor={1}
        className="w-full flex flex-col md:flex-row items-center justify-center gap-10 md:gap-16"
      >
      {/* LEFT SIDE — card, vertically centered */}
      <div className="w-full md:w-[38%] flex justify-center">
        <ProfileCard
          name="Pranay Khendkar"
          title="Crazy Engineer"
          handle="Ig.pranay_khendkar"
          status="Online"
          contactText="Contact Me"
          avatarUrl="/Avater.png"
          showUserInfo
          enableTilt={true}
          enableMobileTilt
          onContactClick={() =>
            window.open(
              "https://www.instagram.com/ig.pranay_khendkar?igsh=MXV3aGRlc24xeTBnMg==",
              "_blank",
              "noopener,noreferrer"
            )
          }
          behindGlowEnabled={false}
          innerGradient="linear-gradient(145deg,#242424 0%,#242424 100%)"
        />
      </div>

      {/* RIGHT SIDE — text content */}
      <div className="w-full md:w-[55%] text-fg">
        {/* Badge */}
        <div className="flex items-center gap-2 mb-5">
          <span className="w-2 h-2 rounded-full bg-accent" />
          <span className="text-xl md:text-3xl font-semibold tracking-[0.2em] uppercase about-accent-text font-label">
            About Me
          </span>
        </div>

        {/* Heading — morphing/cycling text effect */}
        {/* ============================================================ */}
        {/* ---- YAHAN SE NAYE WORDS ADD KARNE HAIN (jitne chahiye) ---- */}
        <MorphText
          words={[
            {
              content: "I am,Pranay Khendkar",
              fontSize: "clamp(1.875rem, 5vw, 3rem)",
              offsetX: "50px",
              offsetY: "-10px",
            },
            "Problem Solver.",
            "Crazy Engineer",
            {
              content: "I am,Pranay Khendkar",
              fontSize: "clamp(1.875rem, 5vw, 3rem)",
              offsetX: "50px",
              offsetY: "-9px",
            },
            {
              content: "Code that solves problems",
              fontSize: "clamp(1.85rem, 5vw, 2.9rem)",
              offsetX: "58px",
              offsetY: "-9px",
            },
          ]}
          interval={3000}
          fontSize="clamp(1.875rem, 5vw, 3rem)"
          fontFamily="inherit"
          className="!items-start mb-6"
          textClassName="!text-left about-accent-text font-bold leading-tight font-hero"
        />

        {/* Description — typing (letter-by-letter reveal) effect */}
        <TypingText
          as="p"
          className="text-base md:text-lg leading-relaxed text-fg-muted mb-8 max-w-xl font-bold"
          fontSize=""
          fontWeight=""
          color=""
          letterSpacing=""
          align="left"
          duration={5}
          delay={0.2}
          loop
          pauseBeforeRepeat={1.5}
        >
          I'm a passionate Full-Stack Developer, aspiring Data Scientist, and
          natural problem solver who enjoys turning ideas into impactful digital
          experiences. I thrive on learning new technologies, leading collaborative
          projects, and building clean, scalable, and user-focused applications
          that create real-world value.
        </TypingText>

        {/* Meta info row */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mb-8 text-sm about-meta-text font-cond">
          <div className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span>20 Years Old</span>
          </div>
          <div className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span>India</span>
          </div>
          <div className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m22 6-10 7L2 6" />
            </svg>
            <span>khendkarpranay@gmail.com</span>
          </div>
        </div>

        {/* CTA button */}
        <a
          href="https://wa.me/919359260318"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-accent about-connect-btn font-semibold px-6 py-3 hover:opacity-90 transition-opacity"
        >
          Let's Connect
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="7" y1="17" x2="17" y2="7" />
            <polyline points="7 7 17 7 17 17" />
          </svg>
        </a>
      </div>
      </CursorImageTrail>
    </section>
  );
};

export default About;
