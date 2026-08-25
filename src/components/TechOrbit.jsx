import { useEffect, useState } from "react";
import BeamCircle from "./BeamCircle";

const TechOrbit = () => {
  // Screen chhoti ho to circle bhi chhota ho jaye (overflow/horizontal
  // scroll na ho) — bade screen pe 620px tak jaata hai.
  // Icons circle ki boundary se thoda bahar bhi nikalte hain, isliye
  // extra buffer (EDGE_BUFFER) rakha hai taaki wo bhi cut/overflow na ho.
  const EDGE_BUFFER = 120;
  const [circleSize, setCircleSize] = useState(620);

  useEffect(() => {
    const updateSize = () => {
      setCircleSize(Math.min(620, window.innerWidth - EDGE_BUFFER));
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

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

      {/* Center mein BeamCircle — full screen ke hisab se bada size */}
      {/* ---- YAHAN SE MAX SIZE CHANGE HOTI HAI (620) ---- */}
      <BeamCircle size={circleSize} />
    </section>
  );
};

export default TechOrbit;
