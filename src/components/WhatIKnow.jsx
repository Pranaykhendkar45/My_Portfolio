import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  SiPython, SiJavascript, SiC, SiCplusplus, SiHtml5, SiCss, SiReact, SiTailwindcss,
  SiFlask, SiMysql, SiOpencv, SiGit, SiGithub, SiPostman, SiVercel, SiRender,
  SiGreensock, SiEspressif, SiFirebase, SiClaude, SiGooglegemini, SiElevenlabs, SiCursor,
} from "react-icons/si";
import {
  Crown, Flag, Users, Compass, Zap, Lightbulb, MessageCircle, Repeat,
  Bot, Heart, Orbit, MessagesSquare,
} from "lucide-react";
import SectionBadge from "./ui/section-badge";
import { SplitText } from "./ui/split-text";

gsap.registerPlugin(ScrollTrigger);

// ============================================================
// ---- YAHAN SE EDIT KAR: naya skill/tool add karna ho to array me ek item daal de ----
// ============================================================
const skills = [
  {
    title: "Languages & Core CS",
    items: [
      { name: "Python", icon: SiPython, color: "#3776AB" },
      { name: "JavaScript", icon: SiJavascript, color: "#F7DF1E" },
      { name: "C", icon: SiC, color: "#A8B9CC" },
      { name: "C++", icon: SiCplusplus, color: "#00599C" },
      { name: "DSA" }, { name: "OOP" },
    ],
  },
  {
    title: "Frontend",
    items: [
      { name: "HTML5", icon: SiHtml5, color: "#E34F26" },
      { name: "CSS3", icon: SiCss, color: "#1572B6" },
      { name: "React.js", icon: SiReact, color: "#61DAFB" },
      { name: "Tailwind CSS", icon: SiTailwindcss, color: "#38BDF8" },
      { name: "GSAP", icon: SiGreensock, color: "#88CE02" },
      { name: "Responsive Design" },
    ],
  },
  {
    title: "Backend & APIs",
    items: [
      { name: "Flask", icon: SiFlask, color: "#999999" },
      { name: "REST APIs" },
      { name: "SQLAlchemy" },
      { name: "Gunicorn" },
    ],
  },
  {
    title: "Databases",
    items: [
      { name: "MySQL", icon: SiMysql, color: "#4479A1" },
      { name: "Firebase", icon: SiFirebase, color: "#FFCA28" },
      { name: "Firestore", icon: SiFirebase, color: "#FFA000" },
    ],
  },
  {
    title: "AI & Hardware",
    items: [
      { name: "OpenAI API" },
      { name: "OpenCV", icon: SiOpencv, color: "#5C3EE8" },
      { name: "ESP32 / IoT", icon: SiEspressif, color: "#E7352C" },
      { name: "Data Analysis" },
    ],
  },
];

const devTools = [
  { name: "Git", icon: SiGit, color: "#F05032" },
  { name: "GitHub", icon: SiGithub, color: "#999999" },
  { name: "VS Code", icon: null, color: "#007ACC" },
  { name: "Postman", icon: SiPostman, color: "#FF6C37" },
  { name: "Vercel", icon: SiVercel, color: "#999999" },
  { name: "Render", icon: SiRender, color: "#46E3B7" },
];

const aiTools = [
  { name: "Claude AI", icon: SiClaude, color: "#D97757" },
  { name: "ChatGPT", icon: MessagesSquare, color: "#10A37F" },
  { name: "Lovable", icon: Heart, color: "#FF5C8A" },
  { name: "Antigravity", icon: Orbit, color: "#4F8BFF" },
  { name: "Cursor", icon: SiCursor, color: "#999999" },
  { name: "Gemini", icon: SiGooglegemini, color: "#8E75B2" },
  { name: "ElevenLabs", icon: SiElevenlabs, color: "#999999" },
];

const softSkills = [
  { icon: Crown, title: "Leadership", text: "I lead from the front: set the direction, motivate the team and keep everyone moving toward the goal.", lead: true },
  { icon: Flag, title: "Ownership", text: "I take full ownership of whatever I build, from the first idea to live deployment.", lead: true },
  { icon: Users, title: "Team Management", text: "I assign roles, coordinate teammates and deliver together under hackathon deadlines." },
  { icon: Compass, title: "Decision Making", text: "I make quick, confident calls and stand by the outcome, good or bad." },
  { icon: Zap, title: "Initiative", text: "Usually the first to start, first to step up and first to take responsibility." },
  { icon: Lightbulb, title: "Problem Solving", text: "I understand the problem first, then pick the simplest solution that works." },
  { icon: MessageCircle, title: "Communication", text: "I explain ideas clearly and keep the whole team on the same page." },
  { icon: Repeat, title: "Quick Learner", text: "I pick up new tools and frameworks fast and put them straight into projects." },
];

const Pill = ({ item }) => {
  const Icon = item.icon;
  return (
    <span className="know-pill inline-flex items-center gap-2 rounded-full border border-theme-border bg-bg px-3.5 py-1.5 font-cond text-sm text-fg transition-colors duration-300 hover:border-accent hover:bg-accent-soft">
      {Icon && <Icon size={15} color={item.color} />}
      {item.name}
    </span>
  );
};

const WhatIKnow = () => {
  const root = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // skill group cards: rise + fade, then pills pop inside
      gsap.utils.toArray(".know-card").forEach((card, i) => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: card, start: "top 85%", toggleActions: "play none none reverse" },
        });
        tl.from(card, { opacity: 0, y: 70, rotateX: -12, transformOrigin: "top center", duration: 0.8, ease: "power3.out", delay: (i % 2) * 0.1 })
          .from(card.querySelectorAll(".know-pill"), { opacity: 0, scale: 0.4, y: 14, duration: 0.45, stagger: 0.06, ease: "back.out(2)" }, "-=0.35");
      });

      // tools: pop in with stagger
      gsap.utils.toArray(".tools-row").forEach((row) => {
        gsap.fromTo(
          row.querySelectorAll(".tool-chip"),
          { opacity: 0, scale: 0.5, y: 50 },
          {
            opacity: 1, scale: 1, y: 0, stagger: 0.12, ease: "back.out(1.6)",
            scrollTrigger: { trigger: row, start: "top 92%", end: "top 55%", scrub: 0.6 },
          }
        );
      });

      // soft skills: alternate left / right slide-in
      gsap.utils.toArray(".soft-card").forEach((card, i) => {
        gsap.from(card, {
          opacity: 0, x: i % 2 === 0 ? -60 : 60, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: card, start: "top 90%", toggleActions: "play none none reverse" },
        });
        gsap.from(card.querySelector(".soft-icon"), {
          scale: 0, rotate: -90, duration: 0.7, delay: 0.2, ease: "back.out(2)",
          scrollTrigger: { trigger: card, start: "top 90%", toggleActions: "play none none reverse" },
        });
      });

      // sub-headings: line draw
      gsap.utils.toArray(".know-line").forEach((l) => {
        gsap.from(l, {
          scaleX: 0, transformOrigin: "left center", duration: 1, ease: "power3.out",
          scrollTrigger: { trigger: l, start: "top 92%", toggleActions: "play none none reverse" },
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  const SubHead = ({ children }) => (
    <div className="mb-6 mt-16 first:mt-0">
      <h3 className="font-hero text-xl md:text-2xl font-bold tracking-tight text-fg">{children}</h3>
      <div className="know-line mt-3 h-px w-full bg-accent/60" />
    </div>
  );

  return (
    <section id="what-i-know" ref={root} className="relative z-10 w-full bg-bg px-5 md:px-8 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="flex justify-center"><SectionBadge>What I Know</SectionBadge></div>
        <SplitText
          as="h2"
          className="mx-auto mt-6 max-w-4xl text-center font-hero font-bold tracking-tight leading-[1.1] text-fg text-[clamp(1.75rem,5vw,3.5rem)]"
        >
          Skills, tools and the soft side of how I work.
        </SplitText>

        <div className="mt-14">
          <SubHead>Technical Skills</SubHead>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 [perspective:1000px]">
            {skills.map((g) => (
              <div key={g.title} className="know-card rounded-2xl border border-theme-border bg-bg-alt p-6 md:p-7">
                <div className="mb-4 flex items-center gap-2 font-cond text-[11px] uppercase tracking-wide text-fg-subtle">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  {g.title}
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {g.items.map((it) => <Pill key={it.name} item={it} />)}
                </div>
              </div>
            ))}
          </div>

          <SubHead>Tools I Use</SubHead>
          {[["Development", devTools], ["AI Tools", aiTools]].map(([label, list]) => (
            <div key={label} className="mb-8 last:mb-0">
              <div className="mb-3 flex items-center gap-2 font-cond text-[11px] uppercase tracking-wide text-fg-subtle">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                {label}
              </div>
              <div className="tools-row flex flex-wrap justify-center md:justify-start gap-4">
                {list.map(({ name, icon: Icon, color }) => (
                  <div
                    key={name}
                    className="tool-chip group flex w-[calc(50%-0.5rem)] sm:w-36 flex-col items-center gap-3 rounded-2xl border border-theme-border bg-bg-alt px-4 py-6 transition-[translate,border-color] duration-300 hover:-translate-y-1.5 hover:border-accent"
                  >
                    {Icon ? (
                      <Icon size={30} color={color} className="transition-transform duration-300 group-hover:scale-110" />
                    ) : (
                      <span className="font-suisse-mono text-xl font-bold" style={{ color }}>{"</>"}</span>
                    )}
                    <span className="font-cond text-sm text-fg">{name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <SubHead>Soft Skills</SubHead>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {softSkills.map(({ icon: Icon, title, text, lead }) => (
              <div key={title} className={`soft-card flex items-start gap-4 rounded-2xl border bg-bg-alt p-5 md:p-6 ${lead ? "border-accent" : "border-theme-border"}`}>
                <div className="soft-icon shrink-0 rounded-xl bg-accent-soft p-3 text-accent">
                  <Icon size={22} />
                </div>
                <div>
                  <h4 className="font-display text-lg font-medium text-fg">{title}</h4>
                  <p className="mt-1 font-cond text-sm leading-relaxed text-fg-muted">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatIKnow;
