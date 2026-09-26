import { useRef, useState } from "react";
import { Play, Pause } from "lucide-react";
import SectionBadge from "./ui/section-badge";
import { SplitText } from "./ui/split-text";

// ============================================================
// ---- YAHAN SE GALLERY KI PHOTOS / VIDEOS CHANGE HOTE HAIN ----
// BENTO   -> upar wala bada grid (7 tiles). type: "photo" | "video" | "stat"
//            `cls` = mobile classes + md: ke baad desktop grid position.
// MORE    -> "Show more" dabane pe khulne wali baaki photos/videos.
// Files public/gallery-media aur public/about-trail mein hain.
// ============================================================
const BENTO = [
  { type: "video", src: "/gallery-media/gallery-video-2.mp4", cls: "col-span-2 aspect-[4/5] md:aspect-auto md:col-span-5 md:row-span-8 md:col-start-1" },
  { type: "photo", src: "/gallery-media/gallery-2.jpg", cls: "aspect-square md:aspect-auto md:col-span-8 md:row-span-4 md:col-start-6" },
  { type: "photo", src: "/gallery-media/gallery-10.jpg", cls: "aspect-square md:aspect-auto md:col-span-5 md:row-span-4 md:col-start-14" },
  { type: "stat", cls: "aspect-square md:aspect-auto md:col-span-4 md:row-span-4" },
  { type: "photo", src: "/gallery-media/gallery-4.jpg", cls: "aspect-square md:aspect-auto md:col-span-4 md:row-span-4" },
  { type: "photo", src: "/gallery-media/gallery-12.jpg", cls: "col-span-2 aspect-[16/10] md:aspect-auto md:col-span-13 md:row-span-4 md:col-start-1" },
  { type: "video", src: "/gallery-media/gallery-video-3.mp4", cls: "col-span-2 aspect-[4/5] md:aspect-auto md:col-span-5 md:row-span-8 md:col-start-14 md:row-start-5" },
];

const MORE = [
  "/gallery-media/gallery-1.jpg",
  "/gallery-media/gallery-video-1.mp4",
  "/gallery-media/gallery-3.jpg",
  "/gallery-media/gallery-5.jpg",
  "/gallery-media/gallery-6.jpg",
  "/gallery-media/gallery-7.jpg",
  "/gallery-media/gallery-8.jpg",
  "/gallery-media/gallery-9.jpg",
  "/gallery-media/gallery-11.jpg",
  "/about-trail/trail-1.jpg",
  "/about-trail/trail-2.jpg",
  "/about-trail/trail-3.jpg",
  "/about-trail/trail-4.jpg",
  "/about-trail/trail-5.jpg",
  "/about-trail/trail-6.jpg",
  "/about-trail/trail-7.jpg",
].map((src) => ({ type: src.endsWith(".mp4") ? "video" : "photo", src, cls: "aspect-[4/5]" }));

const Video = ({ src }) => {
  const ref = useRef(null);
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) {
      // ek time pe sirf ek video chale
      document.querySelectorAll("video[data-gallery]").forEach((o) => o !== v && o.pause());
      v.play();
    } else {
      v.pause();
    }
  };

  return (
    <>
      <video
        ref={ref}
        data-gallery
        src={`${src}#t=0.1`}
        loop
        playsInline
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <button
        onClick={toggle}
        aria-label={playing ? "Pause video" : "Play video"}
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
          playing ? "opacity-0 hover:opacity-100 bg-black/10" : "opacity-100 bg-black/20"
        }`}
      >
        <span className="flex items-center justify-center w-16 h-16 rounded-full border-2 border-white text-white">
          {playing ? <Pause size={26} fill="white" /> : <Play size={26} fill="white" className="ml-1" />}
        </span>
      </button>
    </>
  );
};

const Tile = ({ item, i }) => (
  <div className={`relative overflow-hidden rounded-xl bg-black/10 min-h-0 ${item.cls}`}>
    {item.type === "video" && <Video src={item.src} />}
    {item.type === "photo" && (
      <img
        src={item.src}
        alt={`Gallery photo ${i + 1}`}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover"
      />
    )}
    {item.type === "stat" && (
      <div
        className="absolute inset-0 flex flex-col justify-end p-4 lg:p-6 text-white"
        style={{ background: "linear-gradient(160deg, #F0713A 0%, #E8602E 55%, #B8431B 100%)" }}
      >
        <p className="font-display text-2xl md:text-3xl lg:text-5xl leading-none">Beyond</p>
        <p className="font-display text-2xl md:text-3xl lg:text-5xl leading-none">the Code</p>
        <p className="mt-2 text-sm lg:text-lg text-white/85">Moments from my journey</p>
      </div>
    )}
  </div>
);

const Gallery = () => {
  const [showMore, setShowMore] = useState(false);

  return (
    <section
      id="gallery-section"
      className="w-full flex flex-col items-center bg-bg-alt text-fg rounded-3xl pt-20 pb-16 md:pb-24"
    >
      <SectionBadge>Gallery</SectionBadge>
      <SplitText
        as="h2"
        className="text-center font-display font-medium capitalize text-[2rem] sm:text-[2.2rem] md:text-[3.5rem] leading-[1.25] md:leading-[1.2] w-[90%] lg:w-[70%] mt-5 mb-8 md:mb-14"
      >
        Moments, memories and milestones.
      </SplitText>

      <div className="w-full px-4 md:px-6 lg:px-20 max-w-[1600px]">
        <div className="grid grid-cols-2 md:grid-cols-18 md:grid-rows-12 gap-3 sm:gap-4 md:gap-5 md:aspect-[18/12.5]">
          {BENTO.map((item, i) => (
            <Tile key={i} item={item} i={i} />
          ))}
        </div>

        {showMore && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 mt-3 sm:mt-4 md:mt-5">
            {MORE.map((item, i) => (
              <Tile key={item.src} item={item} i={i + BENTO.length} />
            ))}
          </div>
        )}

        <div className="flex justify-center mt-8 md:mt-12">
          <button
            onClick={() => setShowMore((v) => !v)}
            className="px-8 py-3 rounded-2xl bg-fg text-bg font-medium text-lg hover:bg-accent hover:text-white transition-colors"
          >
            {showMore ? "Show less" : "Show more"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Gallery;
