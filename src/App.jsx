import Navbar from "./components/Navbar/Navbar";
import HeroSection from "./components/HeroSection/HeroSection";
import SmoothScroll from "./components/SmoothScroll";
import InkbleedCursor from "./components/InkbleedCursor/InkbleedCursor";
import LogoMarquee from "./components/LogoMarquee/LogoMarquee";
import About from "./components/About";
import TechOrbit from "./components/TechOrbit";
import Projects from "./components/Projects";

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
      {/* Baaki sections yahan neeche add karte jaana, jaise: */}
      {/* <div id="contact-section">...</div> */}
    </SmoothScroll>
  );
}

export default App;
