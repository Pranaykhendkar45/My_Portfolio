import SectionBadge from "./ui/section-badge";
import { SolarSystem } from "./ui/solar-system";

const TechOrbit = () => {
  return (
    <section
      id="tech-orbit"
      className="w-full min-h-screen flex flex-col items-center justify-center gap-6 px-4 pt-20 pb-16 md:pt-28 md:pb-20 overflow-x-hidden"
    >
      <SectionBadge>Tech Stack</SectionBadge>

      {/* Center mein naya 3D SolarSystem orbit — apne aap responsive hai */}
      <SolarSystem />
    </section>
  );
};

export default TechOrbit;
