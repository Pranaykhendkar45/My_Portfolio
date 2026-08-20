import { useTransform, motion, useScroll } from "framer-motion";
import { useRef, useState, useEffect } from "react";

export const Card = ({ i, title, description, url, liveUrl, color, progress, range, targetScale }) => {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "start start"],
  });

  const imageScale = useTransform(scrollYProgress, [0, 1], [2, 1]);
  const scale = useTransform(progress, range, [1, targetScale]);

  // ---- EXTRA: hover-follow floating image preview (on top of the existing static image) ----
  const [isHovering, setIsHovering] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [smoothPos, setSmoothPos] = useState({ x: 0, y: 0 });
  const animationRef = useRef(null);

  useEffect(() => {
    const lerp = (a, b, n) => a + (b - a) * n;
    const animate = () => {
      setSmoothPos(prev => ({
        x: lerp(prev.x, mousePos.x, 0.15),
        y: lerp(prev.y, mousePos.y, 0.15),
      }));
      animationRef.current = requestAnimationFrame(animate);
    };
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [mousePos]);

  const handleMouseMove = e => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  return (
    <div
      ref={container}
      className="h-screen flex items-center justify-center sticky top-0"
    >
      <motion.div
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onMouseMove={handleMouseMove}
        style={{
          backgroundColor: color,
          scale,
          top: `calc(-5vh + ${i * 25}px)`,
        }}
        className="flex flex-col relative -top-[25%] h-[480px] md:h-[500px] w-[90%] md:w-[75%] rounded-md p-8 md:p-14 origin-top text-white"
      >
        <h2 className="text-xl md:text-2xl text-center font-semibold">{title}</h2>
        <div className="flex flex-col md:flex-row h-full mt-5 gap-6 md:gap-10">
          <div className="w-full md:w-[40%] relative md:top-[10%]">
            <p className="text-sm">{description}</p>
            {liveUrl && (
              <span className="flex items-center gap-2 pt-2">
                <a href={liveUrl} target="_blank" rel="noreferrer" className="underline cursor-pointer">
                  See more
                </a>
                <svg width="22" height="12" viewBox="0 0 22 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M21.5303 6.53033C21.8232 6.23744 21.8232 5.76256 21.5303 5.46967L16.7574 0.696699C16.4645 0.403806 15.9896 0.403806 15.6967 0.696699C15.4038 0.989592 15.4038 1.46447 15.6967 1.75736L19.9393 6L15.6967 10.2426C15.4038 10.5355 15.4038 11.0104 15.6967 11.3033C15.9896 11.5962 16.4645 11.5962 16.7574 11.3033L21.5303 6.53033ZM0 6.75L21 6.75V5.25L0 5.25L0 6.75Z"
                    fill="black"
                  />
                </svg>
              </span>
            )}
          </div>

          <div className="relative w-full md:w-[60%] h-40 md:h-full rounded-lg overflow-hidden">
            {url ? (
              <motion.div className="w-full h-full" style={{ scale: imageScale }}>
                <img src={url} alt={title} className="absolute inset-0 w-full h-full object-cover" />
              </motion.div>
            ) : (
              <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-black/20">
                <span className="text-2xl md:text-4xl font-bold uppercase tracking-widest text-white/70">
                  Coming Soon
                </span>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* EXTRA: floating image preview that follows the cursor while hovering this card */}
      {url && (
        <div
          className="pointer-events-none fixed z-50 overflow-hidden rounded-xl shadow-2xl"
          style={{
            left: 0,
            top: 0,
            transform: `translate3d(${smoothPos.x + 24}px, ${smoothPos.y - 100}px, 0)`,
            opacity: isHovering ? 1 : 0,
            scale: isHovering ? 1 : 0.85,
            transition: "opacity 0.3s cubic-bezier(0.4,0,0.2,1), scale 0.3s cubic-bezier(0.4,0,0.2,1)",
          }}
        >
          <div className="relative w-[280px] h-[180px] bg-black/40 rounded-xl overflow-hidden">
            <img src={url} alt={title} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        </div>
      )}
    </div>
  );
};

const StackingCards = ({ projects }) => {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  return (
    <section className="text-fg w-full bg-bg" ref={container}>
      {projects.map((project, i) => {
        const targetScale = 1 - (projects.length - i) * 0.05;
        return (
          <Card
            key={`p_${i}`}
            i={i}
            url={project.link}
            liveUrl={project.liveUrl}
            title={project.title}
            color={project.color}
            description={project.description}
            progress={scrollYProgress}
            range={[i * 0.25, 1]}
            targetScale={targetScale}
          />
        );
      })}
    </section>
  );
};

export default StackingCards;
