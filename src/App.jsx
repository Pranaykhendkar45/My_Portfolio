import Navbar from "./components/Navbar/Navbar";
import HeroSection from "./components/HeroSection/HeroSection";
import SmoothScroll from "./components/SmoothScroll";
import InkbleedCursor from "./components/InkbleedCursor/InkbleedCursor";
import LogoMarquee from "./components/LogoMarquee/LogoMarquee";
import About from "./components/About";
import TechOrbit from "./components/TechOrbit";
import Projects from "./components/Projects";
import Gallery from "./components/Gallery";
import Contact from "./components/Contact/Contact";
import Footer from "./components/Footer/Footer";

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
      <Gallery />
      <Contact />
      <Footer />
    </SmoothScroll>
  );
}

export default App;
