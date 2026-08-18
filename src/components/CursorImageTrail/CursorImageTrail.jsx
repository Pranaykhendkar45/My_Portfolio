import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

const DEFAULT_URLS = [
  "/about-trail/trail-1.jpg",
  "/about-trail/trail-2.jpg",
  "/about-trail/trail-3.jpg",
  "/about-trail/trail-4.jpg",
  "/about-trail/trail-5.jpg",
  "/about-trail/trail-6.jpg",
  "/about-trail/trail-7.jpg",
];

const TRANSITION = { type: "spring", stiffness: 300, damping: 30 };

const srcOf = img => (typeof img === "string" ? img : img?.src ?? "");

export default function CursorImageTrail(props) {
  const {
    images = DEFAULT_URLS,
    imageWidth = 140,
    imageHeight = 140,
    radius = 12,
    fit = "cover",
    position = "center",
    frequency = 35,
    visibleFor = 1,
    showLabel = false,
    labelText = "Hover Me",
    labelColor = "#ffffff",
    labelFont = {
      fontFamily: "Inter",
      fontWeight: 400,
      fontSize: 40,
      lineHeight: "1.5em",
      letterSpacing: "0em",
      textAlign: "left",
    },
    children,
    ...rest
  } = props;

  const urls = useMemo(() => {
    const list = (images ?? []).map(srcOf).filter(Boolean);
    return list.length ? list : DEFAULT_URLS;
  }, [images]);

  const threshold = 200 - ((frequency - 1) * 199) / 49;

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeImages, setActiveImages] = useState([]);

  const handleMouseMove = event => {
    const rect = event.currentTarget.getBoundingClientRect();
    setMousePos({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
    setIsHovering(true);
  };
  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);

  useEffect(() => {
    if (!isHovering || urls.length === 0) return;
    const lastImage = activeImages[activeImages.length - 1];
    const distance = lastImage
      ? Math.hypot(mousePos.x - lastImage.x, mousePos.y - lastImage.y)
      : Infinity;
    if (distance <= threshold) return;

    const newImage = {
      id: Math.random(),
      position: currentImageIndex,
      x: mousePos.x,
      y: mousePos.y,
      state: "entering",
    };
    setActiveImages(prev => [...prev, newImage]);
    setCurrentImageIndex(prev => (prev + 1) % urls.length);

    setTimeout(() => {
      setActiveImages(prev =>
        prev.map(img => (img.id === newImage.id ? { ...img, state: "exiting" } : img))
      );
    }, visibleFor * 1000);

    setTimeout(() => {
      setActiveImages(prev => prev.filter(img => img.id !== newImage.id));
    }, visibleFor * 1000 + 2000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mousePos, isHovering, urls, threshold, currentImageIndex, visibleFor]);

  return (
    <div
      {...rest}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        position: "relative",
        overflow: "visible",
        width: "100%",
        ...rest.style,
      }}
    >
      {children}

      {showLabel && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            whiteSpace: "nowrap",
            pointerEvents: "none",
            userSelect: "none",
            ...labelFont,
            color: labelColor,
          }}
        >
          {labelText}
        </div>
      )}

      {activeImages.map(({ id, position: slot, x, y, state }) => (
        <motion.div
          key={id}
          initial={{
            opacity: 0,
            scale: 0.5,
            filter: "blur(10px)",
            x: x - imageWidth / 2,
            y: y - imageHeight / 2,
          }}
          animate={{
            opacity: state === "entering" ? 1 : 0,
            scale: state === "entering" ? 1 : 0.5,
            filter: state === "entering" ? "blur(0px)" : "blur(10px)",
            x: x - imageWidth / 2,
            y: y - imageHeight / 2,
          }}
          transition={TRANSITION}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: `${imageWidth}px`,
            height: `${imageHeight}px`,
            backgroundImage: `url(${urls[slot]})`,
            backgroundSize: fit,
            backgroundPosition: fit === "cover" ? `center ${position}` : "center",
            backgroundRepeat: "no-repeat",
            borderRadius: `${radius}px`,
            pointerEvents: "none",
          }}
        />
      ))}
    </div>
  );
}
