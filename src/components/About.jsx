import ProfileCard from "./ProfileCard";

const About = () => {
  return (
    <section
      id="about"
      className="w-full flex flex-col md:flex-row items-center justify-center gap-10 md:gap-16 px-6 md:px-20 py-20 md:py-32"
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
          innerGradient="linear-gradient(145deg,#909090 0%,#909090 100%)"
        />
      </div>

      {/* RIGHT SIDE — text content */}
      <div className="w-full md:w-[55%] text-fg">
        {/* Badge */}
        <div className="flex items-center gap-2 mb-5">
          <span className="w-2 h-2 rounded-full bg-accent" />
          <span className="text-xs font-semibold tracking-[0.2em] uppercase about-accent-text">
            About Me
          </span>
        </div>

        {/* Heading */}
        <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-6">
          Passionate. Curious.
          <br />
          <span className="about-accent-text">Problem Solver.</span>
        </h2>

        {/* Description */}
        <p className="text-base md:text-lg leading-relaxed text-fg-muted mb-8 max-w-xl">
          I'm a full-stack developer who loves turning ideas into
          real-world digital products. I enjoy building clean, efficient
          and user-friendly applications that solve meaningful problems.
        </p>

        {/* Meta info row */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mb-8 text-sm about-meta-text">
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
          href="#contact-section"
          className="inline-flex items-center gap-2 rounded-full bg-accent about-connect-btn font-semibold px-6 py-3 hover:opacity-90 transition-opacity"
        >
          Let's Connect
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="7" y1="17" x2="17" y2="7" />
            <polyline points="7 7 17 7 17 17" />
          </svg>
        </a>
      </div>
    </section>
  );
};

export default About;
