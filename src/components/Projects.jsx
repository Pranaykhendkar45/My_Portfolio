import { Code2, Rocket, Users } from "lucide-react";
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
    stats: [
      { icon: Code2, value: "Vanilla", label: "HTML / CSS / JS" },
      { icon: Rocket, value: "Live", label: "On Vercel" },
      { icon: Users, value: "2", label: "Dashboards" },
    ],
    stack: ["HTML", "CSS", "JavaScript"],
    tone: "light",
  },
  {
    title: "SEPT AI",
    description:
      "AI-powered learning platform with role-based dashboards for students, teachers and admins, an in-browser coding console and an OpenAI-powered assistant.",
    image: "/project-septai.png",
    liveUrl: "https://sept-ai.onrender.com/",
    stats: [
      { icon: Code2, value: "Flask", label: "+ PostgreSQL" },
      { icon: Rocket, value: "Live", label: "On Render" },
      { icon: Users, value: "3", label: "User roles" },
    ],
    stack: ["Flask", "PostgreSQL", "SocketIO", "OpenAI"],
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
  return (
    <article
      style={{ "--stick": `${100 + i * 24}px` }}
      className={`relative w-[92%] md:w-[90%] mx-auto mb-8 lg:mb-10 lg:sticky lg:top-[var(--stick)] rounded-[2rem] lg:rounded-[2.5rem] p-6 lg:px-12 lg:py-14 ${
        accent ? "bg-accent text-white" : "bg-bg-alt text-fg border border-theme-border"
      }`}
    >
      <div
        className={`flex flex-col-reverse lg:gap-16 gap-6 justify-between ${
          i % 2 === 0 ? "lg:flex-row-reverse" : "lg:flex-row"
        }`}
      >
        {/* Text side */}
        <div className="flex flex-col justify-center flex-1 lg:w-1/2 min-w-0">
          <h3 className="font-display font-medium leading-tight text-3xl md:text-4xl lg:text-[3.25rem] mb-3">
            {p.title}
          </h3>
          <p className={`text-base md:text-xl lg:text-xl font-light tracking-wide ${accent ? "text-white/80" : "text-fg-muted"}`}>
            {p.description}
          </p>

          <div className="flex flex-wrap gap-x-8 gap-y-4 mt-6 lg:mt-8">
            {p.stats.map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex items-center gap-2">
                <div className={`p-3 rounded-xl ${accent ? "bg-white/15 text-white" : "bg-accent-soft text-accent"}`}>
                  <Icon size={22} />
                </div>
                <div>
                  <p className="font-semibold text-lg leading-tight">{value}</p>
                  <p className="font-medium text-sm leading-4 opacity-70">{label}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <div className="flex flex-wrap gap-2 mb-6">
              {p.stack.map((t) => (
                <span
                  key={t}
                  className={`text-sm font-medium px-3 py-1 rounded-full border ${
                    accent ? "border-white/50" : "border-accent/40 text-accent"
                  }`}
                >
                  {t}
                </span>
              ))}
            </div>
            <a
              href={p.liveUrl}
              target="_blank"
              rel="noreferrer"
              className={`group inline-flex px-8 py-3 rounded-2xl font-medium text-lg transition-colors ${
                accent ? "bg-white text-black" : "bg-fg text-bg"
              }`}
            >
              <SlideLabel>View Project →</SlideLabel>
            </a>
          </div>
        </div>

        {/* Image side */}
        <div className="shrink-0 lg:w-[42%] h-[30vh] md:h-[38vh] lg:h-[55vh] rounded-2xl overflow-hidden bg-black/5">
          <img src={p.image} alt={p.title} loading="lazy" className="w-full h-full object-cover object-top" />
        </div>
      </div>
    </article>
  );
};

const Projects = () => (
  <section
    id="projects-section"
    className="flex flex-col items-center bg-bg-alt text-fg rounded-3xl pt-20 md:pt-28 pb-16 md:pb-24"
  >
    <SectionBadge>Projects</SectionBadge>
    <SplitText
      as="h2"
      className="text-center font-display font-medium capitalize text-[2rem] sm:text-[2.2rem] md:text-[3.5rem] leading-[1.25] md:leading-[1.2] w-[90%] lg:w-[70%] mt-5 mb-6 md:mb-9"
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
