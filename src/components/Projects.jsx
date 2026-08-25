import StackingCards from "./ui/stacking-card";

// ============================================================
// ---- YAHAN SE PROJECTS EDIT HOTE HAIN ----
//   title       -> project ka naam
//   description -> chhota description
//   link        -> project ki image (public/ folder mein daali hai),
//                  ya "Coming Soon" wale card ke liye null rakh de
//   liveUrl     -> "See more" button project ke live link pe le jayega
//   color       -> card ka background color
// ============================================================
const projects = [
  {
    title: "CampusConnect",
    description:
      "Complete campus placement management system — student & officer dashboards, real-time messaging, company matching aur analytics, sab Vanilla HTML/CSS/JS mein banaya.",
    link: "/project-campusconnect.png",
    liveUrl: "https://campus-connect-omega-flame.vercel.app/",
    color: "#1a1a1a",
  },
  {
    title: "SEPT AI",
    description:
      "AI-powered learning platform — students, teachers aur admins ke liye role-based dashboards, in-browser coding console, OpenAI se chalne wala AI assistant. Flask + PostgreSQL + Flask-SocketIO se banaya.",
    link: "/project-septai.png",
    liveUrl: "https://sept-ai.onrender.com/",
    color: "#6b4226",
  },
  // {
  //   title: "Coming Soon",
  //   description: "Ye project abhi banaya ja raha hai — jald hi yahan aayega.",
  //   link: null,
  //   liveUrl: null,
  //   color: "#d9822b",
  // },
  // {
  //   title: "Coming Soon",
  //   description: "Ye project abhi banaya ja raha hai — jald hi yahan aayega.",
  //   link: null,
  //   liveUrl: null,
  //   color: "#c48b9f",
  // },
];

const Projects = () => {
  return (
    <div id="projects-section">
      {/* Badge — Tech Stack section jaisa hi style */}
      <div className="flex items-center justify-center gap-2 pt-10 pb-4 md:pt-14 md:pb-6">
        <span className="w-2.5 h-2.5 rounded-full bg-accent" />
        <span className="text-xl md:text-3xl font-bold tracking-[0.2em] uppercase about-accent-text font-label">
          My Projects
        </span>
      </div>
      <StackingCards projects={projects} />
    </div>
  );
};

export default Projects;
