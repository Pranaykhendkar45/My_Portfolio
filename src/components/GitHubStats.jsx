import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaGithub } from "react-icons/fa";
import { GitFork, GitCommitHorizontal, Star, Users, BookMarked } from "lucide-react";
import SectionBadge from "./ui/section-badge";
import { SplitText } from "./ui/split-text";

gsap.registerPlugin(ScrollTrigger);

const USERNAME = "Pranaykhendkar45";

const GitHubStats = () => {
  const root = useRef(null);
  const [user, setUser] = useState(null);
  const [stars, setStars] = useState(null);
  const [commits, setCommits] = useState(null);
  const [chartOk, setChartOk] = useState(true);

  // live numbers from GitHub's public API (no key needed)
  useEffect(() => {
    let dead = false;
    (async () => {
      try {
        const u = await fetch(`https://api.github.com/users/${USERNAME}`).then((r) => r.ok ? r.json() : null);
        if (!dead && u) setUser(u);
        const repos = await fetch(`https://api.github.com/users/${USERNAME}/repos?per_page=100`).then((r) => r.ok ? r.json() : []);
        if (!dead && Array.isArray(repos)) setStars(repos.reduce((n, r) => n + (r.stargazers_count || 0), 0));
        // total public commits authored (GitHub search API, no key needed)
        const cached = sessionStorage.getItem("gh-commits");
        if (cached) { setCommits(Number(cached)); }
        else {
          const c = await fetch(`https://api.github.com/search/commits?q=author:${USERNAME}&per_page=1`, {
            headers: { Accept: "application/vnd.github+json" },
          }).then((r) => r.ok ? r.json() : null);
          if (!dead && c && typeof c.total_count === "number") {
            setCommits(c.total_count);
            try { sessionStorage.setItem("gh-commits", String(c.total_count)); } catch { /* ignore */ }
          }
        }
      } catch { /* offline / rate-limited: cards just show a dash */ }
    })();
    return () => { dead = true; };
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".gh-card", {
        opacity: 0, y: 50, duration: 0.7, stagger: 0.1, ease: "power3.out",
        scrollTrigger: { trigger: ".gh-grid", start: "top 88%", toggleActions: "play none none reverse" },
      });
      gsap.from(".gh-chart", {
        opacity: 0, scale: 0.95, y: 40, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: ".gh-chart", start: "top 90%", toggleActions: "play none none reverse" },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  const items = [
    { icon: BookMarked, label: "Public Repos", value: user?.public_repos },
    { icon: Users, label: "Followers", value: user?.followers },
    { icon: GitCommitHorizontal, label: "Total Commits", value: commits },
    { icon: Star, label: "Stars Earned", value: stars },
    { icon: GitFork, label: "Following", value: user?.following },
  ];

  return (
    <section id="github" ref={root} className="w-full px-5 md:px-8 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="flex justify-center"><SectionBadge>GitHub</SectionBadge></div>
        <SplitText
          as="h2"
          className="mx-auto mt-6 max-w-4xl text-center font-hero font-bold tracking-tight leading-[1.1] text-fg text-[clamp(1.75rem,5vw,3.5rem)]"
        >
          I build in public, one commit at a time.
        </SplitText>

        <div className="gh-grid mt-12 grid grid-cols-2 gap-4 md:grid-cols-5">
          {items.map(({ icon: Icon, label, value }) => (
            <div key={label} className="gh-card last:col-span-2 md:last:col-span-1 rounded-2xl border border-theme-border bg-bg-alt p-5 text-center">
              <Icon size={22} className="mx-auto text-accent" />
              <div className="mt-3 font-hero text-3xl font-bold text-fg">{value ?? "—"}</div>
              <p className="mt-1 font-cond text-sm text-fg-muted">{label}</p>
            </div>
          ))}
        </div>

        {chartOk && (
          <div className="gh-chart mt-6 overflow-x-auto rounded-2xl border border-theme-border bg-bg-alt p-5 md:p-7">
            <p className="mb-4 font-cond text-sm text-fg-muted">Contribution activity (last 12 months)</p>
            <img
              src={`https://ghchart.rshah.org/f66b15/${USERNAME}`}
              alt={`${USERNAME} GitHub contribution chart`}
              loading="lazy"
              onError={() => setChartOk(false)}
              className="min-w-[640px] w-full"
            />
          </div>
        )}

        <div className="mt-8 flex justify-center">
          <a
            href={`https://github.com/${USERNAME}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-2xl bg-fg px-7 py-3 font-cond text-base font-medium text-bg transition-transform duration-300 hover:-translate-y-0.5"
          >
            <FaGithub size={18} /> View GitHub Profile
          </a>
        </div>
      </div>
    </section>
  );
};

export default GitHubStats;
