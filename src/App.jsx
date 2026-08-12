import Navbar from "./components/Navbar/Navbar";
import HeroSection from "./components/HeroSection/HeroSection";
import SmoothScroll from "./components/SmoothScroll";

function App() {
  return (
    <SmoothScroll>
      <Navbar />
      <HeroSection />
      {/* Baaki sections yahan neeche add karte jaana, jaise: */}
      {/* <div id="about">...</div> */}
      {/* <div id="projects-section">...</div> */}
      {/* <div id="contact-section">...</div> */}
    </SmoothScroll>
  );
}

export default App;
