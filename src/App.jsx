import Navbar from "./components/Navbar/Navbar";
import HeroSection from "./components/HeroSection/HeroSection";
import SmoothScroll from "./components/SmoothScroll";
import InkbleedCursor from "./components/InkbleedCursor/InkbleedCursor";
import LogoMarquee from "./components/LogoMarquee/LogoMarquee";
import About from "./components/About";
import TechOrbit from "./components/TechOrbit";
import WhatIKnow from "./components/WhatIKnow";
import Projects from "./components/Projects";
import Certificates from "./components/Certificates";
import Experience from "./components/Experience";
import GitHubStats from "./components/GitHubStats";
import Testimonials from "./components/Testimonials";
import Gallery from "./components/Gallery";
import Contact from "./components/Contact/Contact";
import Footer from "./components/Footer/Footer";
import { Reveal, ScrollProgress } from "./components/ui/reveal";
import { Analytics } from "@vercel/analytics/react";

function App() {
  return (
    <SmoothScroll>
      <InkbleedCursor />
      <ScrollProgress />
      <Navbar />
      <HeroSection />
      <Reveal><LogoMarquee /></Reveal>
      <About />
      <Reveal><TechOrbit /></Reveal>
      <WhatIKnow />
      <Projects />
      <Certificates />
      <Experience />
      <GitHubStats />
      <Testimonials />
      <Reveal><Gallery /></Reveal>
      <Reveal><Contact /></Reveal>
      <Reveal><Footer /></Reveal>
      <Analytics />
    </SmoothScroll>
  );
}

export default App;
