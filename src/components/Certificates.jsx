import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Award, Calendar, X } from "lucide-react";
import SectionBadge from "./ui/section-badge";
import { SplitText } from "./ui/split-text";

gsap.registerPlugin(ScrollTrigger);

// ============================================================
// ---- CERTIFICATES EDIT: naya certificate ho to ek object aur daal de ----
// image -> public/certificates/ folder me
// ============================================================
const certificates = [
  {
    title: "The Ultimate Python Bootcamp: Learn by Building 50 Projects",
    issuer: "Udemy · Instructor: Hitesh Choudhary",
    date: "July 7, 2026",
    tag: "Course Completion",
    description:
      "Completed a 30.5-hour hands-on Python course where I built 50 projects, strengthening core Python, problem solving and real-world coding practice.",
    image: "/certificates/udemy-python-bootcamp.jpg",
  },
  {
    title: "Electra 2K26 — BGMI Event (Winner)",
    issuer: "Dept. of Electrical Engineering, EESA & IEEE SB, SKNSCOE Korti",
    date: "29 Sep 2026",
    tag: "Winner",
    description:
      "Secured a winning position in the BGMI event of Electra 2K26, organised with the IEEE Student Branch, showing teamwork and strategy under pressure.",
    image: "/certificates/electra-2k26.jpg",
  },
  {
    title: "Olympus-2K26 — AI Webden",
    issuer: "SVERI's College of Engineering, Pandharpur",
    date: "2 & 3 Oct 2026",
    tag: "Participation",
    description:
      "Participated in the AI Webden event of the national level technical symposium Olympus-2K26, working on AI and web based problem statements.",
    image: "/certificates/olympus-2k26.jpg",
  },
  {
    title: "Spectrum 2K26 — Code Mind Clash",
    issuer: "SKN Sinhgad College of Engineering, Pandharpur",
    date: "29 Aug 2026",
    tag: "Participation",
    description:
      "Took part in Code Mind Clash at the state level technical festival Spectrum 2K26, solving coding challenges against participants from other colleges.",
    image: "/certificates/spectrum-2k26.jpg",
  },
  {
    title: "Sinhgad Hackathon 2026",
    issuer: "Dept. of CSE, ACSES · SKN Sinhgad College of Engineering",
    date: "13 & 14 Mar 2026",
    tag: "Participation",
    description:
      "Actively participated in a 2-day national level hackathon, building and presenting a working prototype with my team under tight deadlines.",
    image: "/certificates/sinhgad-hackathon-2026.jpg",
  },
];

const Certificates = () => {
  const root = useRef(null);
  const [active, setActive] = useState(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray(".cert-item").forEach((item, i) => {
        const fromLeft = i % 2 === 0;
        const img = item.querySelector(".cert-img");
        const text = item.querySelectorAll(".cert-text > *");
        const st = { trigger: item, start: "top 80%", toggleActions: "play none none reverse" };

        // image: clip-path wipe + slight tilt
        gsap.fromTo(
          img,
          { clipPath: "inset(0 100% 0 0 round 16px)", opacity: 0, rotate: fromLeft ? -4 : 4, x: fromLeft ? -60 : 60 },
          { clipPath: "inset(0 0% 0 0 round 16px)", opacity: 1, rotate: 0, x: 0, duration: 1.1, ease: "power3.out", scrollTrigger: st }
        );
        // text: stagger up
        gsap.from(text, { opacity: 0, y: 40, duration: 0.8, stagger: 0.12, delay: 0.15, ease: "power3.out", scrollTrigger: st });
        // image parallax while scrolling
        gsap.to(item.querySelector(".cert-img img"), {
          yPercent: -6, ease: "none",
          scrollTrigger: { trigger: item, start: "top bottom", end: "bottom top", scrub: true },
        });
        // big number counter
        gsap.from(item.querySelector(".cert-num"), {
          opacity: 0, x: fromLeft ? 80 : -80, duration: 1, ease: "power3.out", scrollTrigger: st,
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  // close lightbox with Esc
  useEffect(() => {
    if (!active) return;
    const onKey = (e) => e.key === "Escape" && setActive(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  return (
    <section id="certificates" ref={root} className="w-full px-5 md:px-8 py-20 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="flex justify-center"><SectionBadge>Certificates</SectionBadge></div>
        <SplitText
          as="h2"
          className="mx-auto mt-6 max-w-4xl text-center font-hero font-bold tracking-tight leading-[1.1] text-fg text-[clamp(1.75rem,5vw,3.5rem)]"
        >
          Learning, competing and winning along the way.
        </SplitText>

        <div className="mt-16 md:mt-24 space-y-20 md:space-y-32">
          {certificates.map((c, i) => (
            <article
              key={c.title}
              className={`cert-item relative flex flex-col items-center gap-8 lg:gap-16 ${i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"}`}
            >
              <button
                type="button"
                onClick={() => setActive(c)}
                aria-label={`View ${c.title} certificate`}
                className="cert-img group relative w-full lg:w-[55%] overflow-hidden rounded-2xl border border-theme-border bg-bg-alt cursor-zoom-in"
              >
                <img
                  src={c.image}
                  alt={c.title}
                  loading="lazy"
                  className="h-full w-full scale-[1.08] object-cover transition-[scale] duration-700 group-hover:scale-[1.14]"
                />
                <span className="absolute bottom-3 right-3 rounded-full bg-black/70 px-3 py-1 font-cond text-xs text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  Click to view
                </span>
              </button>

              <div className="cert-text relative w-full lg:w-[45%]">
                <span className="cert-num pointer-events-none absolute -top-10 right-0 font-suisse-mono text-7xl md:text-8xl font-extrabold text-accent/10 select-none">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent-soft px-3 py-1 font-cond text-xs text-accent">
                  <Award size={13} /> {c.tag}
                </span>
                <h3 className="mt-4 font-hero text-xl md:text-3xl font-bold tracking-tight leading-tight text-fg">{c.title}</h3>
                <p className="mt-2 font-cond text-sm text-fg-subtle">{c.issuer}</p>
                <p className="mt-4 font-cond text-base md:text-lg leading-relaxed text-fg-muted">{c.description}</p>
                <div className="mt-5 inline-flex items-center gap-2 font-cond text-sm text-fg-muted">
                  <Calendar size={15} className="text-accent" /> {c.date}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {active && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          onClick={() => setActive(null)}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            aria-label="Close"
            className="absolute right-5 top-5 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            onClick={() => setActive(null)}
          >
            <X size={22} />
          </button>
          <img
            src={active.image}
            alt={active.title}
            className="max-h-[90vh] max-w-[95vw] rounded-xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
};

export default Certificates;
