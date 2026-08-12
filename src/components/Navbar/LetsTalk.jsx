import React from "react";
import { useSpring, animated } from "@react-spring/web";

// Same address used in `Contact` and `SiteFooter`. If any of these change,
// keep all three places in sync.
const EMAIL = "khendkarpranay@gmail.com";

// "LET'S TALK" was previously a non-interactive div. It now opens the user's
// mail client straight to the real contact email — which is also wired up
// in the contact section and the footer.
const LetsTalk = () => {
  const [springs, api] = useSpring(() => ({
    from: { x: 0 },
    x: -10,
  }));

  const [opacitySprings, opacityApi] = useSpring(() => ({
    opacity: 1,
    x: 0,
  }));

  const [opacitySpringsReverse, opacityApiReverse] = useSpring(() => ({
    opacity: 0,
    x: -10,
  }));

  return (
    <a
      href={`mailto:${EMAIL}`}
      aria-label={`Email ${EMAIL}`}
      className="nav_btn_lg nav_btn_dark flex items-center justify-center hover:bg-brblue py-6"
      onMouseEnter={() => {
        api.start({ x: 20 });
        opacityApi.start({ opacity: 0, x: 5 });
        opacityApiReverse.start({ opacity: 1, x: 3 });
      }}
      onMouseLeave={() => {
        api.start({ x: 0 });
        opacityApi.start({ opacity: 1, x: 0 });
        opacityApiReverse.start({ opacity: 0, x: -10 });
      }}
    >
      <animated.span style={opacitySpringsReverse} className="opacity-0">➔</animated.span>
      <animated.span style={springs}>LET'S TALK &nbsp;</animated.span>
      <animated.span style={opacitySprings}>&nbsp;•&nbsp;</animated.span>
    </a>
  );
};

export default LetsTalk;
