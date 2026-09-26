import { Star } from "lucide-react";
import { motion } from "framer-motion";
import { SplitText } from "./ui/split-text";

const REVIEWS = [
  {
    name: "Sandesh Jadhav",
    role: "Full Stack Developer",
    rating: 4.8,
    text: "Pranay is a curious and dedicated developer who learns quickly and always tries to understand how things work instead of just copying solutions.",
  },
  {
    name: "Srushti Kadam",
    role: "Hackathon Teammate",
    rating: 4.9,
    text: "Working with Pranay was a great experience. He takes responsibility, contributes ideas, and stays focused on finding practical solutions during challenging situations.",
  },
  {
    name: "Sandeep Linge(Sir)",
    role: "Computer Science Faculty",
    rating: 4.7,
    text: "Pranay is an enthusiastic learner with a strong interest in software development. He actively explores new technologies and applies what he learns through projects.",
  },
  {
    name: "sheryians mentor",
    role: "Technical Mentor",
    rating: 4.8,
    text: "Pranay has a strong learning mindset and is always willing to experiment with new technologies. His consistency and curiosity are his biggest strengths.",
  },
  {
    name: "Sushant Chandhanshive",
    role: "Software Developer",
    rating: 4.7,
    text: "Pranay has a practical approach to development. He enjoys building real-world projects and continuously works on improving his technical skills.",
  },
  {
    name: "Virah Bhosale",
    role: "Hackethon Teammate",
    rating: 4.9,
    text: "Pranay is a fast learner with a strong problem-solving mindset. He takes initiative, builds practical projects, and consistently pushes himself to explore new areas of technology.",
  },
  {
    name: "Lakita Ingole",
    role: "Project Teammate",
    rating: 4.9,
    text: "Pranay brings good energy to the team, communicates his ideas clearly, and is always ready to learn something new when working on a project.",
  },
];

const initials = (n) =>
  n.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

function Review({ r, hidden }) {
  return (
    <figure
      aria-hidden={hidden || undefined}
      className="w-[280px] shrink-0 rounded-2xl border border-theme-border bg-bg-alt p-6 md:w-[340px]"
    >
      <div
        className="flex items-center gap-1 text-accent"
        role="img"
        aria-label={`${r.rating} out of 5 stars`}
      >
        {[0, 1, 2, 3, 4].map((s) => (
          <Star
            key={s}
            size={14}
            fill={s < Math.round(r.rating) ? "currentColor" : "none"}
            strokeWidth={1.5}
          />
        ))}
        <span className="ml-2 font-suisse-mono text-xs text-fg-subtle">
          {r.rating.toFixed(1)}
        </span>
      </div>
      <blockquote className="mt-4 text-[15px] leading-relaxed text-fg font-cond">
        {r.text}
      </blockquote>
      <figcaption className="mt-6 flex items-center gap-3">
        <span
          className="grid h-10 w-10 place-items-center rounded-full border border-accent/50 bg-accent/10 font-suisse-mono text-xs text-accent"
          aria-hidden="true"
        >
          {initials(r.name)}
        </span>
        <span>
          <span className="block text-sm font-semibold text-fg">{r.name}</span>
          <span className="block text-xs text-fg-subtle font-cond">{r.role}</span>
        </span>
      </figcaption>
    </figure>
  );
}

const Testimonials = () => (
  <section
    id="community"
    className="py-20 md:py-28"
    aria-labelledby="community-title"
  >
    <div className="mx-auto mb-10 max-w-6xl px-5 md:mb-14 md:px-8">
      <SplitText
        as="h2"
        id="community-title"
        className="max-w-2xl font-hero font-bold leading-tight tracking-tight text-fg"
        style={{ fontSize: "clamp(1.75rem, 4.5vw, 3rem)" }}
      >
        The community I learn and build with
      </SplitText>
      <motion.p
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
        className="mt-4 max-w-2xl text-fg-muted font-cond md:text-lg"
      >
        Real reviews from developers,teammate, client, mentor — the kind of
        learning culture I grew up in.
      </motion.p>
    </div>

    <div
      className="testimonial-marquee-wrap overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)]"
      tabIndex={0}
      aria-label="Community reviews"
    >
      <div className="testimonial-marquee">
        {REVIEWS.map((r) => (
          <Review key={r.name} r={r} />
        ))}
        {REVIEWS.map((r) => (
          <Review key={`${r.name}-2`} r={r} hidden />
        ))}
      </div>
    </div>
  </section>
);

export default Testimonials;
