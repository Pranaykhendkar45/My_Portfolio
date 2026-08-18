"use client";
import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Code2 } from "lucide-react";
import {
  SiReact,
  SiPython,
  SiHtml5,
  SiTailwindcss,
  SiJavascript,
  SiCss,
} from "react-icons/si";
import { TbLetterC } from "react-icons/tb";

// ============================================================
// ---- YAHAN SE ORBIT ICONS CHANGE HOTE HAIN ----
// Har orbit ek ring hai jo center ke around ghumti hai.
//   icon        -> koi bhi lucide/react-icons icon, ya apna khud ka <img src="...">
//   radiusFactor-> ring kitni badi (0 = center, 1 = poora edge tak)
//   speed       -> 1 chakkar poora karne mein kitne seconds lagenge
//                  (chhota number = tez ghumega)
//   iconSize    -> icon ka size (px)
//   startAngle  -> ring pe icon kahan se shuru hoga (degrees, 0-360)
//                  isse ek hi ring pe 2 icons ek dusre ke opposite rakh sakte hain
// ============================================================
const defaultOrbits = [
  {
    id: 1,
    radiusFactor: 0.32,
    speed: 10,
    startAngle: 0,
    icon: <SiReact color="#61DAFB" />,
    iconSize: 40,
    orbitColor: "rgba(97, 218, 251, 0.9)",
    orbitThickness: 1.5,
  },
  {
    id: 2,
    radiusFactor: 0.32,
    speed: 10,
    startAngle: 180,
    icon: <TbLetterC color="#A8B9CC" />,
    iconSize: 40,
    orbitColor: "rgba(97, 218, 251, 0.9)",
    orbitThickness: 1.5,
  },
  {
    id: 3,
    radiusFactor: 0.58,
    speed: 14,
    startAngle: 90,
    icon: <SiPython color="#3776AB" />,
    iconSize: 44,
    orbitColor: "rgba(255, 202, 60, 0.9)",
    orbitThickness: 1.5,
  },
  {
    id: 4,
    radiusFactor: 0.58,
    speed: 14,
    startAngle: 270,
    icon: <SiJavascript color="#F7DF1E" />,
    iconSize: 44,
    orbitColor: "rgba(255, 202, 60, 0.9)",
    orbitThickness: 1.5,
  },
  {
    id: 5,
    radiusFactor: 0.82,
    speed: 11,
    startAngle: 45,
    icon: <SiHtml5 color="#E34F26" />,
    iconSize: 46,
    orbitColor: "rgba(232, 121, 249, 0.9)",
    orbitThickness: 2,
  },
  {
    id: 6,
    radiusFactor: 0.82,
    speed: 11,
    startAngle: 225,
    icon: <SiCss color="#1572B6" />,
    iconSize: 46,
    orbitColor: "rgba(232, 121, 249, 0.9)",
    orbitThickness: 2,
  },
  {
    id: 7,
    radiusFactor: 1,
    speed: 17,
    startAngle: 0,
    icon: <SiTailwindcss color="#38BDF8" />,
    iconSize: 46,
    orbitColor: "rgba(74, 222, 128, 0.9)",
    orbitThickness: 1,
  },
];

const BeamCircle = ({ size = 420, orbits: customOrbits, centerIcon }) => {
  const orbitsData = useMemo(() => customOrbits || defaultOrbits, [customOrbits]);
  const halfSize = size / 2;

  const rotationTransition = (duration) => ({
    repeat: Infinity,
    duration,
    ease: "linear",
  });

  const CenterIcon = useMemo(
    () => (
      <motion.div
        className="beam-center-dot rounded-full shadow-lg grid place-content-center"
        style={{ width: halfSize * 0.3, height: halfSize * 0.3 }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      >
        {centerIcon ? (
          centerIcon
        ) : (
          <Code2 className="beam-center-icon" size={halfSize * 0.15} />
        )}
      </motion.div>
    ),
    [halfSize, centerIcon]
  );

  return (
    <div className="flex justify-center items-center p-4 bg-transparent">
      <div className="relative" style={{ width: size, height: size }}>
        {orbitsData.map((orbit) => {
          const orbitDiameter = size * orbit.radiusFactor;
          const orbitRadius = orbitDiameter / 2;
          const containerSize = size;
          const angleRad = ((orbit.startAngle || 0) * Math.PI) / 180;
          const startX = halfSize + orbitRadius * Math.cos(angleRad);
          const startY = halfSize + orbitRadius * Math.sin(angleRad);

          return (
            <React.Fragment key={orbit.id}>
              {/* Orbit Line — bright, fixed color, dono mode me same */}
              <div
                className="absolute rounded-full border border-dashed"
                style={{
                  width: orbitDiameter,
                  height: orbitDiameter,
                  top: halfSize - orbitRadius,
                  left: halfSize - orbitRadius,
                  borderColor: orbit.orbitColor,
                  borderWidth: orbit.orbitThickness || 1,
                }}
              />

              {/* Rotating Container */}
              <motion.div
                className="absolute inset-0"
                style={{ width: containerSize, height: containerSize }}
                animate={{ rotate: 360 }}
                transition={rotationTransition(orbit.speed)}
              >
                {/* Traveling Icon */}
                <div
                  className="absolute"
                  style={{
                    top: startY,
                    left: startX,
                    transform: `translate(-50%, -50%)`,
                  }}
                >
                  <motion.div
                    className="rounded-full shadow-md grid place-content-center p-1.5 bg-white"
                    style={{ width: orbit.iconSize, height: orbit.iconSize }}
                    animate={{ rotate: -360 }}
                    transition={rotationTransition(orbit.speed)}
                  >
                    {React.isValidElement(orbit.icon)
                      ? React.cloneElement(orbit.icon, { size: orbit.iconSize * 0.6 })
                      : orbit.icon}
                  </motion.div>
                </div>
              </motion.div>
            </React.Fragment>
          );
        })}

        {/* Central Icon */}
        <div className="absolute inset-0 grid place-content-center z-10">{CenterIcon}</div>
      </div>
    </div>
  );
};

export default BeamCircle;
