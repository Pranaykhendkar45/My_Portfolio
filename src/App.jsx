import Navbar from "./components/Navbar/Navbar";
import HeroSection from "./components/HeroSection/HeroSection";
import SmoothScroll from "./components/SmoothScroll";
import InkbleedCursor from "./components/InkbleedCursor/InkbleedCursor";
import LogoMarquee from "./components/LogoMarquee/LogoMarquee";

function App() {
  return (
    <SmoothScroll>
      <InkbleedCursor />
      <Navbar />
      <HeroSection />
      <LogoMarquee />
      {/* Baaki sections yahan neeche add karte jaana, jaise: */}
      {/* <div id="about">...</div> */}
      {/* <div id="projects-section">...</div> */}
      {/* <div id="contact-section">...</div> */}
    </SmoothScroll>
  );
}

export default App;
