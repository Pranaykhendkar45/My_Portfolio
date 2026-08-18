"use client";

import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export const TypingText = ({
  children,
  as: Component = "div",
  className = "",
  delay = 0,
  duration = 2,
  fontSize = "text-4xl",
  fontWeight = "font-bold",
  color = "text-white",
  letterSpacing = "tracking-wide",
  align = "left",
  loop = false,
  // loop = true hone ke baad, poora type ho jaane ke baad kitni der
  // ruk ke dobara se shuru ho (seconds)
  pauseBeforeRepeat = 1,
}) => {
  const [textContent, setTextContent] = useState("");
  // Har baar animation dobara chalane ke liye "cycle" badhate hain —
  // isse motion.span remount hota hai aur "hidden" se fresh shuru hota hai
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    const extractText = (node) => {
      if (typeof node === "string" || typeof node === "number") {
        return node.toString();
      }
      if (Array.isArray(node)) {
        return node.map(extractText).join("");
      }
      if (React.isValidElement(node)) {
        const element = node;
        if (typeof element.props.children !== "undefined") {
          return extractText(element.props.children);
        }
      }
      return "";
    };

    setTextContent(extractText(children));
  }, [children]);

  const characters = textContent.split("").map((char) => char);

  // ---- LOOP LOGIC: type poora hone ke baad (delay + duration) +
  // thoda pause (pauseBeforeRepeat), phir cycle ko badha ke animation
  // dobara se (fresh) chalate hain — infinite repeat ---- //
  useEffect(() => {
    if (!loop || characters.length === 0) return;
    const totalTime = (delay + duration + pauseBeforeRepeat) * 1000;
    const timer = setTimeout(() => {
      setCycle((c) => c + 1);
    }, totalTime);
    return () => clearTimeout(timer);
  }, [loop, delay, duration, pauseBeforeRepeat, characters.length, cycle]);

  const characterVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: (i) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: delay + i * (duration / characters.length),
        duration: 0.3,
        ease: "easeInOut",
      },
    }),
  };

  return React.createElement(
    Component,
    {
      className: cn(
        "inline-flex flex-wrap",
        className,
        fontSize,
        fontWeight,
        color,
        letterSpacing,
        align === "center"
          ? "justify-center text-center"
          : align === "right"
          ? "justify-end text-right"
          : "justify-start text-left"
      ),
    },
    <motion.span
      // key badalne se React ise remount karta hai -> "hidden" state se
      // fresh shuru hota hai, isliye loop mein har baar type effect repeat hota hai
      key={cycle}
      className="inline-block"
      initial="hidden"
      animate="visible"
      aria-label={textContent}
      role="text"
    >
      {characters.map((char, index) =>
        char === " " ? (
          // Space ko plain text ki tarah rakha hai (inline-block nahi) —
          // inline-block ke andar akela space browsers zero-width kar
          // dete hain, isliye pehle space "gayab" ho raha tha.
          <span key={`space-${index}`}> </span>
        ) : (
          <motion.span
            key={`${char}-${index}`}
            className="inline-block"
            variants={characterVariants}
            custom={index}
            initial="hidden"
            animate="visible"
          >
            {char}
          </motion.span>
        )
      )}
    </motion.span>
  );
};

export default TypingText;
