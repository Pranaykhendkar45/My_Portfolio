import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const DecayCard = ({
  width = 300,
  height = 400,
  image = 'https://picsum.photos/300/400?grayscale',
  baseFrequency = 0.015,
  numOctaves = 5,
  seed = 4,
  maxDisplacement = 400,
  movementBound = 50,
  children
}) => {
  const rootRef = useRef(null);
  const svgRef = useRef(null);
  const displacementMapRef = useRef(null);
  const isHovering = useRef(false);

  // cursor position relative to the card itself (not the whole window)
  const cursor = useRef({ x: 0, y: 0 });
  const cachedCursor = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const lerp = (a, b, n) => (1 - n) * a + n * b;
    const map = (x, a, b, c, d) => ((x - a) * (d - c)) / (b - a) + c;
    const distance = (x1, x2, y1, y2) => Math.hypot(x1 - x2, y1 - y2);

    const el = rootRef.current;
    if (!el) return;

    const handleMouseEnter = () => {
      isHovering.current = true;
    };

    const handleMouseMove = ev => {
      const rect = el.getBoundingClientRect();
      cursor.current = { x: ev.clientX - rect.left, y: ev.clientY - rect.top };
    };

    const handleMouseLeave = () => {
      isHovering.current = false;
    };

    el.addEventListener('mouseenter', handleMouseEnter);
    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);

    const imgValues = {
      imgTransforms: { x: 0, y: 0, rz: 0 },
      displacementScale: 0
    };

    const render = () => {
      // When not hovering, targets fall back to neutral (0) so the card settles down.
      let targetX = 0;
      let targetY = 0;
      let targetRz = 0;

      if (isHovering.current) {
        targetX = map(cursor.current.x, 0, width, -120, 120);
        targetY = map(cursor.current.y, 0, height, -120, 120);
        targetRz = map(cursor.current.x, 0, width, -10, 10);
      }

      imgValues.imgTransforms.x = lerp(imgValues.imgTransforms.x, targetX, 0.1);
      imgValues.imgTransforms.y = lerp(imgValues.imgTransforms.y, targetY, 0.1);
      imgValues.imgTransforms.rz = lerp(imgValues.imgTransforms.rz, targetRz, 0.1);

      if (imgValues.imgTransforms.x > movementBound) {
        imgValues.imgTransforms.x = movementBound + (imgValues.imgTransforms.x - movementBound) * 0.2;
      }
      if (imgValues.imgTransforms.x < -movementBound) {
        imgValues.imgTransforms.x = -movementBound + (imgValues.imgTransforms.x + movementBound) * 0.2;
      }
      if (imgValues.imgTransforms.y > movementBound) {
        imgValues.imgTransforms.y = movementBound + (imgValues.imgTransforms.y - movementBound) * 0.2;
      }
      if (imgValues.imgTransforms.y < -movementBound) {
        imgValues.imgTransforms.y = -movementBound + (imgValues.imgTransforms.y + movementBound) * 0.2;
      }

      if (svgRef.current) {
        gsap.set(svgRef.current, {
          x: imgValues.imgTransforms.x,
          y: imgValues.imgTransforms.y,
          rotateZ: imgValues.imgTransforms.rz
        });
      }

      const cursorTravelledDistance = isHovering.current
        ? distance(cachedCursor.current.x, cursor.current.x, cachedCursor.current.y, cursor.current.y)
        : 0;

      imgValues.displacementScale = lerp(
        imgValues.displacementScale,
        isHovering.current ? map(cursorTravelledDistance, 0, 200, 0, maxDisplacement) : 0,
        0.06
      );

      if (displacementMapRef.current) {
        gsap.set(displacementMapRef.current, { attr: { scale: imgValues.displacementScale } });
      }

      cachedCursor.current = { ...cursor.current };

      rafId = requestAnimationFrame(render);
    };

    let rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      el.removeEventListener('mouseenter', handleMouseEnter);
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [width, height, maxDisplacement, movementBound]);

  return (
    <div ref={rootRef} className="relative" style={{ width: `${width}px`, height: `${height}px` }}>
      <div ref={svgRef} className="relative w-full h-full [will-change:transform]">
        <svg
          viewBox="-60 -75 720 900"
          preserveAspectRatio="xMidYMid slice"
          className="relative w-full h-full block"
        >
          <filter id="imgFilter">
            <feTurbulence
              type="turbulence"
              baseFrequency={baseFrequency}
              numOctaves={numOctaves}
              seed={seed}
              stitchTiles="stitch"
              x="0%"
              y="0%"
              width="100%"
              height="100%"
              result="turbulence1"
            />
            <feDisplacementMap
              ref={displacementMapRef}
              in="SourceGraphic"
              in2="turbulence1"
              scale="0"
              /* Same channel for x & y so R/G/B don't shift apart —
                 removes the rainbow/blue chromatic-fringe look, keeps a plain distortion. */
              xChannelSelector="R"
              yChannelSelector="R"
              x="0%"
              y="0%"
              width="100%"
              height="100%"
              result="displacementMap3"
            />
          </filter>
          <g>
            <image
              href={image}
              x="0"
              y="0"
              width="600"
              height="750"
              filter="url(#imgFilter)"
              preserveAspectRatio="xMidYMid slice"
            />
          </g>
        </svg>
      </div>
      <div className="absolute bottom-[1.2em] left-[1em] tracking-[-0.5px] font-black text-[2.5rem] leading-[1.5em] first-line:text-[6rem] pointer-events-none">
        {children}
      </div>
    </div>
  );
};

export default DecayCard;
