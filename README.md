# Pranay Khendkar — Portfolio

Personal portfolio website of **Pranay Khendkar**, a full-stack developer and
aspiring data scientist. Built as a single-page React app with a heavy focus
on motion — scroll-driven reveals, a 3D tech-stack orbit, sticky stacking
project cards, and a smooth-scroll feel throughout.

**Live site:** _add your deployed link here_

---

## ✨ Features

- **Animated hero** — parallax hero section with smooth scroll (Lenis) and a
  custom cursor trail.
- **About** — bento-style intro card with a GitHub stats strip and a "latest
  ship" preview card.
- **3D Tech Orbit** — an interactive `three.js` solar-system of the tech
  stack (React Three Fiber + Drei).
- **Projects** — sticky, stacking project cards with live links, tech tags
  and stats.
- **Testimonials** — auto-scrolling marquee of community reviews.
- **Gallery** — a filterable photo/video gallery of hackathons and events.
- **Contact** — a bordered call-to-action box with a scroll-triggered,
  character-split headline animation, direct email + WhatsApp links.
- **Dark / light theme** — toggleable, persisted to `localStorage`, no
  flash-of-wrong-theme on reload.
- **Background music player** — an on/off toggle in the navbar that loops
  through a playlist.
- **Fully responsive** — from small phones up to large desktop screens.

---

## 🛠️ Tech Stack

| Layer         | Tools                                                                                              |
| ------------- | --------------------------------------------------------------------------------------------------- |
| Framework     | [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)                                        |
| Styling       | [Tailwind CSS 4](https://tailwindcss.com/)                                                          |
| Animation     | [GSAP](https://gsap.com/) (ScrollTrigger), [Framer Motion](https://www.framer.com/motion/), [@react-spring/web](https://www.react-spring.dev/) |
| 3D            | [three.js](https://threejs.org/) via `@react-three/fiber` + `@react-three/drei`                     |
| Smooth scroll | [Lenis](https://lenis.darkroom.engineering/)                                                        |
| Icons         | [lucide-react](https://lucide.dev/), [react-icons](https://react-icons.github.io/react-icons/)      |
| Linting       | [oxlint](https://oxc.rs/docs/guide/usage/linter.html)                                               |

---

## 📁 Project Structure

```
src/
├── components/
│   ├── About.jsx            # About Me bento section
│   ├── TechOrbit.jsx        # 3D tech-stack orbit
│   ├── Projects.jsx         # Sticky-stacking project cards
│   ├── Testimonials.jsx     # Community reviews marquee
│   ├── Gallery.jsx          # Photo/video gallery
│   ├── Contact/             # "Have an idea?" CTA section
│   ├── Footer/               # Site footer
│   ├── Navbar/               # Navbar, mobile menu, theme + music toggle
│   ├── HeroSection/           # Landing hero
│   ├── SmoothScroll.jsx       # Lenis smooth-scroll wrapper
│   └── ui/                    # Shared UI primitives (SectionBadge, SplitText, etc.)
├── App.jsx
└── index.css                  # Theme tokens (light/dark) + global styles
public/
├── music/                     # Background music playlist
└── *.png                      # Project screenshots, avatar, etc.
```

---

## 🚀 Getting Started

**Prerequisites:** Node.js 18+ and npm.

```bash
# 1. Clone the repo
git clone https://github.com/<your-username>/<repo-name>.git
cd <repo-name>

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

The app runs at `http://localhost:5173` by default.

### Other scripts

```bash
npm run build     # production build → dist/
npm run preview   # preview the production build locally
npm run lint      # run oxlint
```

---

## 🎨 Customizing

- **Projects** — edit the `projects` array at the top of
  `src/components/Projects.jsx` (title, description, image, live URL, stats,
  stack, tone).
- **Theme colors** — edit the CSS custom properties under
  `[data-theme="light"]` / `[data-theme="dark"]` in `src/index.css`.
- **Music playlist** — drop audio files in `public/music/` and list them in
  `PLAYLIST` inside `src/components/Navbar/MusicPlayer.jsx`.
- **Contact links** — update the `EMAIL` and `WHATSAPP_URL` constants
  (present in `Contact.jsx`, `Navbar.jsx`, and the footer).

---

## 📬 Contact

- **Email:** khendkarpranay@gmail.com
- **WhatsApp:** [Chat here](https://wa.me/+919359260318)

---

## 📄 License

This project is personal portfolio source code. Feel free to use it as
inspiration, but please don't republish it as your own portfolio as-is.
