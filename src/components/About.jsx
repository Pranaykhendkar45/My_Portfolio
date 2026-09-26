import { ArrowUpRight, MapPin } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { motion } from "framer-motion";
import SectionBadge from "./ui/section-badge";
import { SplitText } from "./ui/split-text";

const rise = (i) => ({
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5, delay: i * 0.08, ease: "easeOut" },
});

const Card = ({ className = "", children, ...rest }) => (
  <div
    className={`relative rounded-2xl border border-theme-border bg-bg-alt ${className}`}
    {...rest}
  >
    {children}
  </div>
);

const About = () => {
  return (
    <section id="about" className="w-full px-5 md:px-8 py-20 md:py-32">
      <div className="mx-auto max-w-6xl">
        {/* Badge + heading */}
        <motion.div {...rise(0)} className="flex justify-center md:justify-start">
          <SectionBadge>About Me</SectionBadge>
        </motion.div>

        <motion.div {...rise(1)}>
          <h2
            className="mt-6 max-w-4xl text-center md:text-left font-hero font-bold leading-[1.05] tracking-tight text-fg"
            style={{ fontSize: "clamp(2rem, 6vw, 4.25rem)" }}
          >
            <SplitText as="span" className="inline">
              I build web apps that solve{" "}
            </SplitText>
            <SplitText as="span" className="inline text-accent">
              real problems
            </SplitText>
          </h2>
        </motion.div>

        <motion.p
          {...rise(2)}
          className="mt-6 max-w-xl text-center md:text-left text-base md:text-lg leading-relaxed text-fg-muted font-cond"
        >
          I'm Pranay, a full-stack developer and aspiring data scientist from
          India. I turn ideas into clean, scalable products — from role-based
          dashboards to AI-powered platforms.
        </motion.p>

        {/* stats */}
        <motion.div
          {...rise(3)}
          className="mt-10 flex justify-center md:justify-start divide-x divide-theme-border border-t border-theme-border pt-6"
        >
          {[
            { value: "4+", label: "public repos on GitHub" },
            { value: "7+", label: "GitHub followers" },
            { value: "2+", label: "products shipped live" },
          ].map((s) => (
            <div key={s.label} className="px-5 first:pl-0 md:px-8">
              <div className="font-suisse-mono text-3xl md:text-4xl font-extrabold tracking-tight text-fg">
                {s.value}
              </div>
              <div className="mt-1 flex items-center gap-1.5 font-cond text-[11px] text-fg-subtle">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
                {s.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* bento grid */}
        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-12">
          {/* photo */}
          <motion.div {...rise(4)} className="md:col-span-5 md:row-span-2">
            <Card className="overflow-hidden h-full">
              <div className="relative h-full min-h-[380px]">
                <img
                  src="/Avater.png"
                  alt="Portrait of Pranay Khendkar"
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover object-top grayscale transition duration-700 hover:grayscale-0"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"
                  aria-hidden="true"
                />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/60 px-3 py-1 font-cond text-[11px] text-white backdrop-blur">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
                    Open to work
                  </div>
                  <h3 className="font-hero text-2xl md:text-3xl font-extrabold tracking-tight text-white">
                    Pranay Khendkar
                  </h3>
                  <p className="mt-1 font-cond text-white/70">Crazy Engineer</p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* problem solver */}
          <motion.div {...rise(5)} className="md:col-span-7">
            <Card className="p-7 md:p-9">
            <SplitText
              as="h3"
              className="font-hero text-xl md:text-2xl font-bold text-fg"
            >
              Problem solver first, coder second.
            </SplitText>
              <p className="mt-4 max-w-xl leading-relaxed text-fg-muted font-cond">
                I enjoy turning ideas into impactful digital experiences. I
                learn new technologies fast, lead collaborative projects, and
                build clean, scalable, user-focused applications that create
                real-world value.
              </p>
              <div className="mt-6 flex flex-wrap gap-2 font-cond text-xs">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-theme-border px-3 py-1 text-fg-muted">
                  <MapPin size={12} /> India
                </span>
                {["20 years old", "Full-stack", "Data science"].map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1.5 rounded-full border border-theme-border px-3 py-1 text-fg-muted"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* currently focused on */}
          <motion.div {...rise(6)} className="md:col-span-4">
            <Card className="p-7 h-full">
              <div className="font-cond text-[11px] uppercase tracking-wide text-fg-subtle">
                Currently focused on
              </div>
              <ul className="mt-4 space-y-3 text-sm font-cond text-fg">
                {[
                  "Role-based full-stack apps",
                  "Realtime features with WebSockets",
                  "Data science and Gen-AI",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    {t}
                  </li>
                ))}
              </ul>
            </Card>
          </motion.div>

          {/* latest ship */}
          <motion.div {...rise(7)} className="md:col-span-3">
            <a
              href="https://sept-ai.onrender.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open SEPT AI live"
              className="group block h-full"
            >
              <Card className="relative block overflow-hidden h-full min-h-[190px]">
                <img
                  src="/project-septai.png"
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover opacity-40 transition duration-500 group-hover:scale-105 group-hover:opacity-70"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-black to-black/30"
                  aria-hidden="true"
                />
                <div className="relative flex h-full min-h-[190px] flex-col justify-end p-6">
                  <div className="font-cond text-[11px] text-accent">
                    Latest ship
                  </div>
                  <div className="mt-1 flex items-center justify-between text-xl font-bold text-white">
                    SEPT AI
                    <ArrowUpRight className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </div>
                </div>
              </Card>
            </a>
          </motion.div>
        </div>

        <motion.a
          {...rise(8)}
          href="https://github.com/Pranaykhendkar45"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-2 font-cond text-sm text-fg-muted transition hover:text-fg"
        >
          <FaGithub /> See everything I'm building on GitHub
        </motion.a>
      </div>
    </section>
  );
};

export default About;
