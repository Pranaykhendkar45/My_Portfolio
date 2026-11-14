import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GraduationCap, Briefcase, Trophy, Code2, Award, Users } from "lucide-react";
import SectionBadge from "./ui/section-badge";
import { SplitText } from "./ui/split-text";

gsap.registerPlugin(ScrollTrigger);

// ============================================================
// ---- EDIT: counters aur timeline yahin se badalte hain ----
// ============================================================
const counters = [
  { value: 3, suffix: "", label: "Projects Built" },
  { value: 50, suffix: "+", label: "Python Mini Projects" },
  { value: 5, suffix: "", label: "Certificates" },
  { value: 4, suffix: "", label: "Tech Events & Hackathons" },
];

const timeline = [
  { icon: GraduationCap, date: "2025", title: "Started B.Tech in CSE", place: "SKN Sinhgad College of Engineering, Korti", text: "Began my Computer Science journey and started building web projects from day one." },
  { icon: Users, date: "2025 – 2026", title: "Training Representative", place: "CU-SUCCEED Pvt. Ltd.", text: "Represented the training program on campus, led student coordination and earned a Certificate of Appreciation." },
  { icon: Code2, date: "Mar 2026", title: "Sinhgad Hackathon 2026", place: "National level · 2 days", text: "Took part in a 2-day national hackathon and learned to build and ship under pressure." },
  { icon: Award, date: "Jul 2026", title: "Python Bootcamp — 50 Projects", place: "Udemy", text: "Completed 30.5 hours of hands-on Python by building 50 projects." },
  { icon: Code2, date: "Aug 2026", title: "Spectrum 2K26 — Code Mind Clash", place: "State level technical festival", text: "Competed in a coding contest against students from other colleges." },
  { icon: Trophy, date: "Sep 2026", title: "Winner · Electra 2K26 (BGMI)", place: "EESA & IEEE Student Branch", text: "Led the squad to a winning finish in the BGMI event." },
  { icon: Briefcase, date: "Oct 2026", title: "Olympus-2K26 — AI Webden", place: "SVERI's College of Engineering", text: "Participated in the AI Webden event of a national level symposium." },
];

const Experience = () => {
  const root = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // counters
      gsap.utils.toArray(".count-num").forEach((el) => {
        const end = Number(el.dataset.value);
        const obj = { v: 0 };
        gsap.to(obj, {
          v: end, duration: 2, ease: "power2.out",
          onUpdate: () => { el.textContent = Math.round(obj.v); },
          scrollTrigger: { trigger: el, start: "top 90%", toggleActions: "play none none reset" },
        });
      });
      gsap.from(".count-card", {
        opacity: 0, y: 50, scale: 0.9, duration: 0.7, stagger: 0.12, ease: "back.out(1.6)",
        scrollTrigger: { trigger: ".count-grid", start: "top 88%", toggleActions: "play none none reverse" },
      });

      // timeline line fills as you scroll
      gsap.fromTo(".tl-line-fill", { scaleY: 0 }, {
        scaleY: 1, ease: "none", transformOrigin: "top center",
        scrollTrigger: { trigger: ".tl-wrap", start: "top 65%", end: "bottom 65%", scrub: true },
      });

      // every milestone appears step by step, linked to scroll position
      gsap.utils.toArray(".tl-item").forEach((item, i) => {
        const fromLeft = window.innerWidth >= 768 ? i % 2 === 0 : false;
        const card = item.querySelector(".tl-card");
        const dot = item.querySelector(".tl-dot");
        gsap.fromTo(card,
          { opacity: 0, x: fromLeft ? -80 : 80, y: 40 },
          { opacity: 1, x: 0, y: 0, ease: "power2.out",
            scrollTrigger: { trigger: item, start: "top 92%", end: "top 62%", scrub: 0.6 } });
        gsap.fromTo(dot,
          { scale: 0 },
          { scale: 1, ease: "back.out(2)",
            scrollTrigger: { trigger: item, start: "top 80%", end: "top 62%", scrub: 0.6 } });
        // dot fills with accent colour once the line reaches it
        ScrollTrigger.create({
          trigger: item, start: "top 65%",
          onEnter: () => dot.classList.add("tl-dot-on"),
          onLeaveBack: () => dot.classList.remove("tl-dot-on"),
        });
      });
      requestAnimationFrame(() => ScrollTrigger.refresh());
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="experience" ref={root} className="w-full px-5 md:px-8 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="flex justify-center"><SectionBadge>Journey</SectionBadge></div>
        <SplitText
          as="h2"
          className="mx-auto mt-6 max-w-4xl text-center font-hero font-bold tracking-tight leading-[1.1] text-fg text-[clamp(1.75rem,5vw,3.5rem)]"
        >
          My journey so far, in numbers and milestones.
        </SplitText>

        {/* counters */}
        <div className="count-grid mt-14 grid grid-cols-2 gap-4 md:grid-cols-4">
          {counters.map((c) => (
            <div key={c.label} className="count-card rounded-2xl border border-theme-border bg-bg-alt p-6 text-center">
              <div className="font-hero text-4xl md:text-5xl font-bold text-accent">
                <span className="count-num" data-value={c.value}>0</span>{c.suffix}
              </div>
              <p className="mt-2 font-cond text-sm text-fg-muted">{c.label}</p>
            </div>
          ))}
        </div>

        {/* timeline */}
        <div className="tl-wrap relative mt-20">
          <div className="absolute left-4 top-0 h-full w-px bg-theme-border md:left-1/2 md:-translate-x-1/2">
            <div className="tl-line-fill h-full w-full bg-accent" />
          </div>

          {timeline.map(({ icon: Icon, date, title, place, text }, i) => (
            <div key={title} className={`tl-item relative mb-10 last:mb-0 flex md:w-1/2 pl-12 md:pl-0 ${i % 2 === 0 ? "md:pr-12" : "md:ml-auto md:pl-12"}`}>
              <span className={`tl-dot absolute top-6 left-4 -translate-x-1/2 md:left-auto ${i % 2 === 0 ? "md:right-0 md:translate-x-1/2" : "md:left-0 md:-translate-x-1/2"} flex h-9 w-9 items-center justify-center rounded-full border-2 border-accent bg-bg text-accent [&.tl-dot-on]:bg-accent [&.tl-dot-on]:text-bg transition-colors duration-300`}>
                <Icon size={16} />
              </span>
              <div className="tl-card w-full rounded-2xl border border-theme-border bg-bg-alt p-5 md:p-6 transition-colors duration-300 hover:border-accent">
                <span className="font-suisse-mono text-xs text-accent">{date}</span>
                <h3 className="mt-1 font-hero text-base md:text-lg font-bold tracking-tight text-fg">{title}</h3>
                <p className="mt-0.5 font-cond text-sm text-fg-subtle">{place}</p>
                <p className="mt-3 font-cond text-[15px] leading-relaxed text-fg-muted">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
