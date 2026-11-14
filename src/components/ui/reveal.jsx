import { motion } from "framer-motion";

// Site-wide scroll reveal: fade + rise + un-blur. Wrap any section with it.
export const Reveal = ({ children, delay = 0, y = 60, amount = 0.08, className = "" }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y, filter: "blur(8px)" }}
    whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
    viewport={{ once: true, amount }}
    transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
);

// Thin accent progress bar at the top that fills as you scroll.
import { useScroll, useSpring } from "framer-motion";
export const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.2 });
  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed left-0 right-0 top-0 z-[9998] h-[3px] origin-left bg-accent"
    />
  );
};
