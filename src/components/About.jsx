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
          behindGlowColor="rgba(125, 190, 255, 0.67)"
          behindGlowEnabled
          innerGradient="linear-gradient(145deg,#60496e8c 0%,#71C4FF44 100%)"
        />
      </div>

      {/* RIGHT SIDE — text content */}
      <div className="w-full md:w-[55%] text-fg">
        <p className="text-lg md:text-2xl leading-relaxed mb-4">
          Abdelrahman Elfekky is an AI Engineer and Data Analyst building
          real-world digital systems across web, mobile, and AI.
        </p>
        <p className="text-lg md:text-2xl leading-relaxed">
          He integrates AI Automation into every product, engineering
          complete ecosystems instead of standalone tools.
        </p>
      </div>
    </section>
  );
};

export default About;
