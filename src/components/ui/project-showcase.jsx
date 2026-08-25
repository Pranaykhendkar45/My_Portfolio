import { useState, useRef, useEffect } from "react";
import { ArrowUpRight } from "lucide-react";

// Apne real projects yahan se hi edit karna — same data jo Projects.jsx me hai.
const projects = [
  {
    title: "CampusConnect",
    description: "Complete campus placement management system.",
    year: "2025",
    link: "https://campus-connect-omega-flame.vercel.app/",
    image: "/project-campusconnect.png",
  },
  {
    title: "SEPT AI",
    description: "AI-powered learning platform for students & teachers.",
    year: "2025",
    link: "https://sept-ai.onrender.com/",
    image: "/project-septai.png",
  },
  {
    title: "Coming Soon",
    description: "Ye project abhi banaya ja raha hai.",
    year: "2026",
    link: "#",
    image: null,
  },
  {
    title: "Coming Soon",
    description: "Ye project abhi banaya ja raha hai.",
    year: "2026",
    link: "#",
    image: null,
  },
];

export function ProjectShowcase() {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [smoothPosition, setSmoothPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const lerp = (start, end, factor) => start + (end - start) * factor;

    const animate = () => {
      setSmoothPosition(prev => ({
        x: lerp(prev.x, mousePosition.x, 0.15),
        y: lerp(prev.y, mousePosition.y, 0.15),
      }));
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [mousePosition]);

  const handleMouseMove = e => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const handleMouseEnter = index => {
    setHoveredIndex(index);
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
    setIsVisible(false);
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full max-w-2xl mx-auto px-6 py-16"
    >
      <h2 className="text-fg-muted text-sm font-medium tracking-wide uppercase mb-8">
        Selected Work
      </h2>

      {/* Floating image preview that follows the cursor */}
      <div
        className="pointer-events-none fixed z-50 overflow-hidden rounded-xl shadow-2xl"
        style={{
          left: containerRef.current?.getBoundingClientRect().left ?? 0,
          top: containerRef.current?.getBoundingClientRect().top ?? 0,
          transform: `translate3d(${smoothPosition.x + 20}px, ${smoothPosition.y - 100}px, 0)`,
          opacity: isVisible ? 1 : 0,
          scale: isVisible ? 1 : 0.8,
          transition: "opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), scale 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <div className="relative w-[280px] h-[180px] bg-bg-alt rounded-xl overflow-hidden">
          {projects.map((project, index) =>
            project.image ? (
              <img
                key={project.title + index}
                src={project.image}
                alt={project.title}
                className="absolute inset-0 w-full h-full object-cover transition-all duration-500 ease-out"
                style={{
                  opacity: hoveredIndex === index ? 1 : 0,
                  scale: hoveredIndex === index ? 1 : 1.1,
                  filter: hoveredIndex === index ? "none" : "blur(10px)",
                }}
              />
            ) : (
              <div
                key={project.title + index}
                className="absolute inset-0 flex items-center justify-center bg-bg-alt transition-opacity duration-500 ease-out"
                style={{ opacity: hoveredIndex === index ? 1 : 0 }}
              >
                <span className="text-fg-subtle text-sm font-semibold uppercase tracking-widest">
                  Coming Soon
                </span>
              </div>
            )
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-bg/20 to-transparent" />
        </div>
      </div>

      <div className="space-y-0">
        {projects.map((project, index) => (
          <a
            key={project.title + index}
            href={project.link}
            target={project.link !== "#" ? "_blank" : undefined}
            rel={project.link !== "#" ? "noreferrer" : undefined}
            className="group block"
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          >
            <div className="relative py-5 transition-all duration-300 ease-out">
              {/* Background highlight on hover */}
              <div
                className={`
                  absolute inset-0 -mx-4 px-4 bg-bg-alt/50 rounded-lg
                  transition-all duration-300 ease-out
                  ${hoveredIndex === index ? "opacity-100 scale-100" : "opacity-0 scale-95"}
                `}
              />

              <div className="relative flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="inline-flex items-center gap-2">
                    <h3 className="text-fg font-medium text-lg tracking-tight font-display">
                      <span className="relative">
                        {project.title}
                        <span
                          className={`
                            absolute left-0 -bottom-0.5 h-px bg-fg
                            transition-all duration-300 ease-out
                            ${hoveredIndex === index ? "w-full" : "w-0"}
                          `}
                        />
                      </span>
                    </h3>

                    <ArrowUpRight
                      className={`
                        w-4 h-4 text-fg-muted
                        transition-all duration-300 ease-out
                        ${
                          hoveredIndex === index
                            ? "opacity-100 translate-x-0 translate-y-0"
                            : "opacity-0 -translate-x-2 translate-y-2"
                        }
                      `}
                    />
                  </div>

                  <p
                    className={`
                      text-fg-muted text-sm mt-1 leading-relaxed
                      transition-all duration-300 ease-out
                      ${hoveredIndex === index ? "text-fg/70" : "text-fg-muted"}
                    `}
                  >
                    {project.description}
                  </p>
                </div>

                <span
                  className={`
                    text-xs font-mono text-fg-muted tabular-nums
                    transition-all duration-300 ease-out
                    ${hoveredIndex === index ? "text-fg/60" : ""}
                  `}
                >
                  {project.year}
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

export default ProjectShowcase;
