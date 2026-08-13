// Inkbleed Cursor
import * as React from "react";
import { useEffect, useRef } from "react";

const IDLE_FADE = {
  type: "tween",
  duration: 1.5,
  ease: [0.4, 0, 0.2, 1],
};

const DEFAULT_LABEL_FONT = {
  fontFamily: "Inter",
  fontWeight: 400,
  fontSize: "48px",
  lineHeight: "1.5em",
  letterSpacing: "0em",
  textAlign: "left",
};

const DEFAULTS = {
  label: false,
  labelText: "HOVER ME",
  labelColor: "#FFFFFF",
  labelFont: DEFAULT_LABEL_FONT,
  pixelCount: 32,
  pixelSize: 16,
  pixelShape: "circle",
  trailColor: "#DB6013",
  trailStyle: "solid",
  trailSpacing: 2,
};

// Fixed values (previously exposed as sliders, now baked in).
const FADE_OUT = true;
const SCALE_VARIATION = true;
const FOLLOW_SPEED = 10;
const STIFFNESS = 10;
const DAMPING = 10;

const NAMED_EASES = {
  linear: [0, 0, 1, 1],
  ease: [0.25, 0.1, 0.25, 1],
  easeIn: [0.42, 0, 1, 1],
  easeOut: [0, 0, 0.58, 1],
  easeInOut: [0.42, 0, 0.58, 1],
  circIn: [0.55, 0, 1, 0.45],
  circOut: [0, 0.55, 0.45, 1],
  circInOut: [0.85, 0, 0.15, 1],
  backIn: [0.36, 0, 0.66, -0.56],
  backOut: [0.34, 1.56, 0.64, 1],
  backInOut: [0.68, -0.6, 0.32, 1.6],
  anticipate: [0.36, 0, 0.66, -0.56],
};

function makeEaseFn(transition) {
  let pts = NAMED_EASES.easeInOut;
  const ease = transition?.ease;
  if (Array.isArray(ease) && ease.length === 4 && ease.every(Number.isFinite)) {
    pts = ease;
  } else if (typeof ease === "string" && NAMED_EASES[ease]) {
    pts = NAMED_EASES[ease];
  }
  const [x1, y1, x2, y2] = pts;
  if (x1 === y1 && x2 === y2) return (t) => t;

  const bez = (a, b, t) => {
    const u = 1 - t;
    return 3 * u * u * t * a + 3 * u * t * t * b + t * t * t;
  };
  return (t) => {
    const x = Math.max(0, Math.min(1, t));
    let s = x;
    for (let i = 0; i < 8; i++) {
      const cx = bez(x1, x2, s) - x;
      const u = 1 - s;
      const dx = 3 * u * u * x1 + 6 * u * s * (x2 - x1) + 3 * s * s * (1 - x2);
      if (Math.abs(dx) < 1e-6) break;
      s -= cx / dx;
      s = Math.max(0, Math.min(1, s));
    }
    return bez(y1, y2, s);
  };
}

const IDLE_FADE_SECONDS = Math.max(0.1, IDLE_FADE.duration ?? 1.5);
const idleEase = makeEaseFn(IDLE_FADE);

function InkbleedCursor(props) {
  const {
    pixelCount = DEFAULTS.pixelCount,
    pixelSize = DEFAULTS.pixelSize,
    pixelShape = DEFAULTS.pixelShape,
    trailColor = DEFAULTS.trailColor,
    trailStyle = DEFAULTS.trailStyle,
    trailSpacing = DEFAULTS.trailSpacing,
    label = DEFAULTS.label,
    labelText = DEFAULTS.labelText,
    labelColor = DEFAULTS.labelColor,
    style,
  } = props;

  const hostRef = useRef(null);
  const frameRef = useRef(null);
  const poolRef = useRef([]);
  const cursorRef = useRef({ x: -1000, y: -1000 });

  const live = useRef({ pixelSize, trailColor, trailStyle, trailSpacing });
  live.current = { pixelSize, trailColor, trailStyle, trailSpacing };

  const labelFont = { ...DEFAULT_LABEL_FONT, ...props.labelFont };

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const pool = poolRef.current;
    const count = Math.max(1, pixelCount);

    while (pool.length > count) {
      pool.pop()?.node.remove();
    }
    while (pool.length < count) {
      const node = document.createElement("div");
      node.style.position = "absolute";
      node.style.left = "0px";
      node.style.top = "0px";
      node.style.willChange = "transform, opacity";
      host.appendChild(node);
      const ahead = pool[pool.length - 1];
      pool.push({
        node,
        x: ahead ? ahead.x : cursorRef.current.x,
        y: ahead ? ahead.y : cursorRef.current.y,
        vx: 0,
        vy: 0,
        color: "",
        hidden: false,
      });
    }

    return () => {
      for (const p of pool) p.node.remove();
      poolRef.current = [];
    };
  }, [pixelCount]);

  useEffect(() => {
    for (const p of poolRef.current) {
      const s = p.node.style;
      s.width = `${pixelSize}px`;
      s.height = `${pixelSize}px`;
      s.borderRadius = pixelShape === "circle" ? "50%" : "0";
      s.backgroundColor = trailColor;
      p.color = trailColor;
    }
  }, [pixelCount, pixelSize, pixelShape, trailColor]);

  useEffect(() => {
    const frameEl = frameRef.current;
    if (!frameEl) return;

    const previousCursor = document.documentElement.style.cursor;
    let cursorHidden = false;
    const hideNativeCursor = (hide) => {
      if (hide === cursorHidden) return;
      cursorHidden = hide;
      document.documentElement.style.cursor = hide ? "none" : previousCursor;
    };

    let seen = false;
    let inside = false;
    let lastMove = 0;
    const onMove = (e) => {
      const rect = frameEl.getBoundingClientRect();
      const over =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;
      hideNativeCursor(over);
      if (!over) {
        inside = false;
        return;
      }
      const sx = rect.width > 0 ? frameEl.clientWidth / rect.width : 1;
      const sy = rect.height > 0 ? frameEl.clientHeight / rect.height : 1;
      const x = (e.clientX - rect.left) * sx;
      const y = (e.clientY - rect.top) * sy;

      const c = cursorRef.current;
      if (Math.hypot(x - c.x, y - c.y) > 0.5) {
        lastMove = performance.now();
      }
      c.x = x;
      c.y = y;
      const host = hostRef.current;
      if (host) host.style.opacity = "1";
      if (!seen || !inside) {
        seen = true;
        for (const px of poolRef.current) {
          px.x = c.x;
          px.y = c.y;
          px.vx = 0;
          px.vy = 0;
        }
      }
      inside = true;
    };
    const onWindowLeave = () => {
      inside = false;
      hideNativeCursor(false);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onWindowLeave);

    let activity = 0;
    let raf = 0;
    let last = performance.now();

    const frame = (now) => {
      const dt = Math.min(0.05, Math.max(0, (now - last) / 1000));
      last = now;
      const p = live.current;
      const pool = poolRef.current;
      if (!pool.length || !seen) {
        raf = requestAnimationFrame(frame);
        return;
      }

      const moving = now - lastMove < 100;
      activity = moving
        ? Math.min(1, activity + dt / 0.2)
        : Math.max(0, activity - dt / IDLE_FADE_SECONDS);
      const fadeMul = 1 - idleEase(1 - activity);

      const k = STIFFNESS * 72 * (FOLLOW_SPEED / 10);
      const retain = Math.max(0.05, 1 - DAMPING / 20);
      const decay = Math.pow(retain, dt * 60);
      const pull = 1 - Math.exp(-dt / 0.028);
      const spacing = Math.max(1, p.trailSpacing);
      const size = p.pixelSize;
      const cursor = cursorRef.current;

      for (let i = 0; i < pool.length; i++) {
        const px = pool[i];
        const ax = i === 0 ? cursor.x : pool[i - 1].x;
        const ay = i === 0 ? cursor.y : pool[i - 1].y;
        const dx = ax - px.x;
        const dy = ay - px.y;

        px.vx = (px.vx + dx * k * dt) * decay;
        px.vy = (px.vy + dy * k * dt) * decay;
        px.x += px.vx * dt;
        px.y += px.vy * dt;

        if (i > 0) {
          const dist = Math.hypot(dx, dy);
          if (dist > spacing) {
            const ratio = ((dist - spacing) / dist) * pull;
            px.x += dx * ratio;
            px.y += dy * ratio;
          }
        }

        const progress = i / pool.length;
        let opacity = FADE_OUT ? 1 - progress : 1;
        let scale = SCALE_VARIATION ? 1 - progress * 0.5 : 1;
        opacity *= fadeMul;
        scale *= fadeMul;
        const color = p.trailColor;

        const visible = p.trailStyle === "dashed" ? i % 5 < 3 : true;

        let offX = 0;
        let offY = 0;
        if (i > 0 && p.trailStyle === "wave") {
          const prev = pool[i - 1];
          const sx = px.x - prev.x;
          const sy = px.y - prev.y;
          const len = Math.hypot(sx, sy);
          if (len > 0) {
            const amount = Math.sin(i * 0.3) * size * 2;
            offX = (-sy / len) * amount;
            offY = (sx / len) * amount;
          }
        }

        const s = px.node.style;
        const hide = !visible || opacity < 0.01 || scale <= 0;
        if (hide !== px.hidden) {
          s.display = hide ? "none" : "block";
          px.hidden = hide;
        }
        if (hide) continue;

        s.transform = `translate(${px.x + offX}px, ${px.y + offY}px) translate(-50%, -50%) scale(${scale})`;
        s.opacity = String(opacity);
        if (color !== px.color) {
          s.backgroundColor = color;
          px.color = color;
        }
      }

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      hideNativeCursor(false);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onWindowLeave);
    };
  }, []);

  const labelNode = label ? (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        whiteSpace: "pre",
        pointerEvents: "none",
        userSelect: "none",
        ...labelFont,
        color: labelColor,
      }}
    >
      {labelText}
    </div>
  ) : null;

  return (
    <div
      ref={frameRef}
      style={{
        position: "fixed",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 9999,
        ...style,
      }}
    >
      {labelNode}
      <div
        ref={hostRef}
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          opacity: 0,
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

export default InkbleedCursor;
