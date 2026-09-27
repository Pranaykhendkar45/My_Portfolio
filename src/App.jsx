import Navbar from "./components/Navbar/Navbar";
import HeroSection from "./components/HeroSection/HeroSection";
import SmoothScroll from "./components/SmoothScroll";
import InkbleedCursor from "./components/InkbleedCursor/InkbleedCursor";
import LogoMarquee from "./components/LogoMarquee/LogoMarquee";
import About from "./components/About";
import TechOrbit from "./components/TechOrbit";
import Projects from "./components/Projects";
import Testimonials from "./components/Testimonials";
import Gallery from "./components/Gallery";
import Contact from "./components/Contact/Contact";
import Footer from "./components/Footer/Footer";
import { Analytics } from "@vercel/analytics/react";

function App() {
  return (
    <SmoothScroll>
      <InkbleedCursor />
      <Navbar />
      <HeroSection />
      <LogoMarquee />
      <About />
      <TechOrbit />
      <Projects />
      <Testimonials />
      <Gallery />
      <Contact />
      <Footer />
      <Analytics />
    </SmoothScroll>
  );
}

export default App;
