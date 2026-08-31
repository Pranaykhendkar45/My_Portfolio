import { SolarSystem } from "./ui/solar-system";

const TechOrbit = () => {
  return (
    <section
      id="tech-orbit"
      className="w-full min-h-screen flex flex-col items-center justify-center gap-6 px-4 pt-6 pb-16 md:pt-10 md:pb-20 overflow-x-hidden"
    >
      {/* Badge — About section jaisa hi style, ab bada aur thoda upar */}
      <div className="flex items-center gap-2 -mt-6 md:-mt-10">
        <span className="w-2.5 h-2.5 rounded-full bg-accent" />
        <span className="text-xl md:text-3xl font-bold tracking-[0.2em] uppercase about-accent-text font-label">
          Tech Stack
        </span>
      </div>

      {/* Center mein naya 3D SolarSystem orbit — apne aap responsive hai */}
      <SolarSystem />
    </section>
  );
};

export default TechOrbit;
