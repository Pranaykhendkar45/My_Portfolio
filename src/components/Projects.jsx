import { useEffect, useRef } from "react";
import { FaGithub } from "react-icons/fa";
import { Code2, Rocket, Users, AlertCircle, Target, CheckCircle2 } from "lucide-react";
import SectionBadge from "./ui/section-badge";
import { SplitText } from "./ui/split-text";

// ============================================================
// ---- YAHAN SE PROJECTS EDIT HOTE HAIN ----
//   title / description -> card ka text
//   image               -> public/ folder ki image
//   liveUrl             -> "View Project" button ka link
//   stats               -> 3 chhote chips: { icon, value, label }
//   stack               -> tech tags (price ki jagah)
//   tone                -> "light" (white card) ya "accent" (orange card)
// Naya project add karna ho to array mein ek object aur daal de.
// ============================================================
const projects = [
  {
    title: "CampusConnect",
    description:
      "Complete campus placement management system with student and officer dashboards, real-time messaging, company matching and analytics.",
    image: "/project-campusconnect.png",
    liveUrl: "https://campus-connect-omega-flame.vercel.app/",
    githubUrl: "https://github.com/Pranaykhendkar45", // TODO: apne CampusConnect repo ka link daal
    stats: [
      { icon: Code2, value: "Vanilla", label: "HTML / CSS / JS" },
      { icon: Rocket, value: "Live", label: "On Vercel" },
      { icon: Users, value: "2", label: "Dashboards" },
    ],
    stack: ["HTML", "CSS", "JavaScript"],
    problem:
      "College placements usually run through scattered spreadsheets, WhatsApp groups and notice boards. Students miss openings and officers struggle to track who applied where.",
    objective:
      "Give students and placement officers one fast, simple portal to manage vacancies, applications, announcements and recruitment progress.",
    solution:
      "Built role-based portals with candidate filters, company vacancy pipelines, announcements and analytics, in pure vanilla JS with no framework for instant loading.",
    tone: "light",
  },
  {
    title: "SEPT AI",
    description:
      "AI-powered learning platform with role-based dashboards for students, teachers and admins, an in-browser coding console and an OpenAI-powered assistant.",
    image: "/project-septai.png",
    liveUrl: "https://sept-ai.onrender.com/",
    githubUrl: "https://github.com/Pranaykhendkar45", // TODO: apne SEPT AI repo ka link daal
    stats: [
      { icon: Code2, value: "Flask", label: "+ PostgreSQL" },
      { icon: Rocket, value: "Live", label: "On Render" },
      { icon: Users, value: "3", label: "User roles" },
    ],
    stack: ["Flask", "PostgreSQL", "SocketIO", "OpenAI"],
    problem:
      "Students rarely get personalised practice and quick doubt resolution, while teachers spend hours on grading and have no clear view of each learner's progress.",
    objective:
      "Create one smart learning suite where quizzes, coding practice, grading and progress tracking work together for students, teachers and admins.",
    solution:
      "Built a Flask + PostgreSQL platform with OpenAI-generated question sets and doubt solving, a coding console, automated grading and realtime study groups via SocketIO.",
    tone: "accent",
  },
];

const goTo = (id) => {
  const el = document.getElementById(id);
  if (!el) return;
  if (window.__lenis?.scrollTo) window.__lenis.scrollTo(el, { offset: 0, duration: 1.4 });
  else el.scrollIntoView({ behavior: "smooth" });
};

// Text-slide hover: label upar jaata hai, dusra niche se aata hai
const SlideLabel = ({ children }) => (
  <span className="relative block overflow-hidden w-max">
    <span className="block transition-transform duration-300 ease-out group-hover:-translate-y-full">{children}</span>
    <span className="absolute inset-0 translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0">
      {children}
    </span>
  </span>
);

const ProjectCard = ({ p, i }) => {
  const accent = p.tone === "accent";
  const ref = useRef(null);

  // Stacking-card effect that works on phones too. If a card is taller than
  // the screen, a normal sticky top would clip its bottom. So we stick it
  // where its BOTTOM edge touches the screen bottom; the next card slides over.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const set = () => {
      const desk = window.innerWidth >= 1024;
      const base = (desk ? 84 : 76) + i * (desk ? 18 : 10);
      const maxTop = window.innerHeight - el.offsetHeight - 16;
      el.style.top = `${Math.min(base, maxTop)}px`;
    };
    set();
    const ro = new ResizeObserver(set);
    ro.observe(el);
    window.addEventListener("resize", set);
    return () => { ro.disconnect(); window.removeEventListener("resize", set); };
  }, [i]);

  const muted = accent ? "text-white/80" : "text-fg-muted";
  return (
    <article
      ref={ref}
      className={`sticky w-[92%] md:w-[90%] mx-auto mb-8 lg:mb-10 rounded-[1.75rem] lg:rounded-[2.25rem] p-5 lg:px-9 lg:py-7 ${
        accent ? "bg-accent text-white" : "bg-bg-alt text-fg border border-theme-border"
      }`}
    >
      <div className={`flex flex-col-reverse gap-5 lg:gap-10 justify-between ${i % 2 === 0 ? "lg:flex-row-reverse" : "lg:flex-row"}`}>
        {/* Text side */}
        <div className="flex flex-col justify-center flex-1 lg:w-1/2 min-w-0">
          <h3 className="font-hero font-bold tracking-tight leading-tight text-2xl md:text-3xl lg:text-4xl mb-2">{p.title}</h3>
          <p className={`font-cond text-base lg:text-[17px] leading-relaxed ${muted}`}>{p.description}</p>

          <div className="flex flex-wrap gap-x-6 gap-y-3 mt-4">
            {p.stats.map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex items-center gap-2">
                <div className={`p-2 rounded-lg ${accent ? "bg-white/15 text-white" : "bg-accent-soft text-accent"}`}>
                  <Icon size={18} />
                </div>
                <div>
                  <p className="font-semibold text-base leading-tight">{value}</p>
                  <p className="font-cond text-xs leading-4 opacity-70">{label}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            {p.stack.map((t) => (
              <span
                key={t}
                className={`font-cond text-xs font-medium px-3 py-1 rounded-full border ${accent ? "border-white/50" : "border-accent/40 text-accent"}`}
              >
                {t}
              </span>
            ))}
            <div className="ml-auto flex gap-2">
              <a
                href={p.githubUrl}
                target="_blank"
                rel="noreferrer"
                className={`inline-flex items-center gap-2 rounded-xl border px-5 py-2.5 font-cond text-base font-medium transition-colors ${
                  accent ? "border-white/60 text-white hover:bg-white/10" : "border-theme-border text-fg hover:border-accent"
                }`}
              >
                <FaGithub size={16} /> GitHub
              </a>
              <a
                href={p.liveUrl}
                target="_blank"
                rel="noreferrer"
                className={`group inline-flex rounded-xl px-5 py-2.5 font-cond text-base font-medium transition-colors ${
                  accent ? "bg-white text-black" : "bg-fg text-bg"
                }`}
              >
                <SlideLabel>Live Demo →</SlideLabel>
              </a>
            </div>
          </div>
        </div>

        {/* Image side */}
        <div className="shrink-0 lg:w-[40%] h-[26vh] md:h-[32vh] lg:h-[34vh] rounded-2xl overflow-hidden bg-black/5">
          <img src={p.image} alt={p.title} loading="lazy" className="w-full h-full object-cover object-top" />
        </div>
      </div>

      {/* Problem / Objective / Solution */}
      <div className="mt-5 lg:mt-6 grid grid-cols-1 gap-3 md:grid-cols-3">
        {[
          { icon: AlertCircle, label: "Problem", text: p.problem },
          { icon: Target, label: "Objective", text: p.objective },
          { icon: CheckCircle2, label: "Solution", text: p.solution },
        ].map(({ icon: Icon, label, text }) => (
          <div
            key={label}
            className={`rounded-xl p-4 ${accent ? "bg-white/10" : "bg-bg border border-theme-border"}`}
          >
            <div className={`mb-1.5 flex items-center gap-2 font-cond font-semibold text-xs uppercase tracking-wide ${accent ? "text-white" : "text-accent"}`}>
              <Icon size={14} /> {label}
            </div>
            <p className={`font-cond text-[13px] leading-relaxed ${muted}`}>{text}</p>
          </div>
        ))}
      </div>
    </article>
  );
};

const Projects = () => (
  <section
    id="projects-section"
    className="flex flex-col items-center bg-bg-alt text-fg rounded-3xl pt-16 md:pt-24 pb-12 md:pb-20"
  >
    <SectionBadge>Projects</SectionBadge>
    <SplitText
      as="h2"
      className="text-center font-hero font-bold tracking-tight text-[clamp(1.75rem,5vw,3.5rem)] leading-[1.1] w-[90%] lg:w-[70%] mt-5 mb-6 md:mb-9"
    >
      Things I've built, from first idea to live deployment.
    </SplitText>
    <button
      onClick={() => goTo("contact-section")}
      className="group mb-10 md:mb-16 px-8 sm:px-10 py-3 sm:py-4 rounded-2xl text-white font-bold text-lg md:text-xl transition-shadow duration-300 hover:shadow-[0_0_40px_5px_rgba(232,96,46,0.5)]"
      style={{ background: "linear-gradient(96.76deg, #E8602E 5.3%, #340E00 234.66%)" }}
    >
      <SlideLabel>Let&apos;s Talk →</SlideLabel>
    </button>

    <div className="relative w-full">
      {projects.map((p, i) => (
        <ProjectCard key={p.title} p={p} i={i} />
      ))}
    </div>
  </section>
);

export default Projects;
