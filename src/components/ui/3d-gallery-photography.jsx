"use client";

import { useRef, useMemo, useCallback, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

const DEFAULT_DEPTH_RANGE = 50;
const MAX_HORIZONTAL_OFFSET = 8;
const MAX_VERTICAL_OFFSET = 8;

// ============================================================
// ---- YAHAN SE GALLERY KI SPEED CONTROL HOTI HAI ----
// SCROLL_SENSITIVITY -> jitna zyada, utna hi thoda sa page-scroll
//                        karne pe photos zyada tez badlengi.
//                        (pehle 0.03 tha, isliye bahut fast tha)
// AUTOPLAY_SPEED      -> jab tu scroll nahi kar raha, photos khud
//                        kitni raftaar se ghumti hain (idle loop)
// VELOCITY_MULTIPLIER -> overall multiplier — sabse bada asar isi ka
//                        hota hai actual movement pe
// Neeche wale Gallery.jsx mein bhi ek "speed" prop hai jo in sab ko
// ek saath scale karta hai — chhota rakhna (jaise 0.4-0.6) dheema
// karega, bada karna (1.5+) tez karega.
// ============================================================
const SCROLL_SENSITIVITY = 0.008;
const AUTOPLAY_SPEED = 0.15;
const VELOCITY_MULTIPLIER = 5;

// ---- SCROLL PROPERLY END TAK CHALE, ISKE LIYE ----
// Pehle gallery POORE PAGE ke scroll (window.scrollY) pe depend karti thi,
// chahe page kitna bhi lamba ho — isliye section khatam hone se pehle hi
// scroll "adhoora" reh jaata tha. Ab hum gallery section ki APNI HEIGHT ke
// hisaab se scroll ko normalize karte hain: section ko poora scroll karne
// par exactly SECTION_CYCLES chakkar poore hote hain, chahe baaki page
// kitna bhi bada/chhota ho.
const SECTION_CYCLES = 1.4;

// ---- IMAGE "COVER" CROP (center part dikhega, jaisa CSS object-fit:cover) ----
// Frame ka apna fixed aspect ratio — chhoti/badi image ho, hamesha isi
// frame ke andar center-crop hoke fit hogi (kisi bhi image ka pura frame
// stretch nahi hoga).
const FRAME_ASPECT = 1.4; // width/height

// Custom shader material for blur, opacity, and cloth folding effects
const createClothMaterial = () => {
  return new THREE.ShaderMaterial({
    transparent: true,
    uniforms: {
      map: { value: null },
      opacity: { value: 1.0 },
      blurAmount: { value: 0.0 },
      scrollForce: { value: 0.0 },
      time: { value: 0.0 },
      isHovered: { value: 0.0 },
      texelSize: { value: new THREE.Vector2(1 / 512, 1 / 512) },
      uvScale: { value: new THREE.Vector2(1, 1) },
      uvOffset: { value: new THREE.Vector2(0, 0) },
    },
    vertexShader: `
      uniform float scrollForce;
      uniform float time;
      uniform float isHovered;
      varying vec2 vUv;
      varying vec3 vNormal;

      void main() {
        vUv = uv;
        vNormal = normal;

        vec3 pos = position;

        float curveIntensity = scrollForce * 0.3;
        float distanceFromCenter = length(pos.xy);
        float curve = distanceFromCenter * distanceFromCenter * curveIntensity;

        float ripple1 = sin(pos.x * 2.0 + scrollForce * 3.0) * 0.02;
        float ripple2 = sin(pos.y * 2.5 + scrollForce * 2.0) * 0.015;
        float clothEffect = (ripple1 + ripple2) * abs(curveIntensity) * 2.0;

        float flagWave = 0.0;
        if (isHovered > 0.5) {
          float wavePhase = pos.x * 3.0 + time * 8.0;
          float waveAmplitude = sin(wavePhase) * 0.1;
          float dampening = smoothstep(-0.5, 0.5, pos.x);
          flagWave = waveAmplitude * dampening;

          float secondaryWave = sin(pos.x * 5.0 + time * 12.0) * 0.03 * dampening;
          flagWave += secondaryWave;
        }

        pos.z -= (curve + clothEffect + flagWave);

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D map;
      uniform float opacity;
      uniform float blurAmount;
      uniform float scrollForce;
      uniform vec2 texelSize;
      uniform vec2 uvScale;
      uniform vec2 uvOffset;
      varying vec2 vUv;
      varying vec3 vNormal;

      void main() {
        // Cover-crop: sirf center wala portion sample hota hai
        // (jaisa CSS object-fit: cover), poori image stretch nahi hoti.
        vec2 uv = vUv * uvScale + uvOffset;
        vec4 color = texture2D(map, uv);

        if (blurAmount > 0.0) {
          vec4 blurred = vec4(0.0);
          float total = 0.0;

          for (float x = -2.0; x <= 2.0; x += 1.0) {
            for (float y = -2.0; y <= 2.0; y += 1.0) {
              vec2 offset = vec2(x, y) * texelSize * blurAmount;
              float weight = 1.0 / (1.0 + length(vec2(x, y)));
              blurred += texture2D(map, uv + offset) * weight;
              total += weight;
            }
          }
          color = blurred / total;
        }

        float curveHighlight = abs(scrollForce) * 0.05;
        color.rgb += vec3(curveHighlight * 0.1);

        gl_FragColor = vec4(color.rgb, color.a * opacity);
      }
    `,
  });
};

function ImagePlane({ texture, position, scale, material }) {
  const meshRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (material && texture) {
      material.uniforms.map.value = texture;
      const img = texture.image;
      const w = img?.videoWidth || img?.width;
      const h = img?.videoHeight || img?.height;
      if (w && h) {
        material.uniforms.texelSize.value.set(1 / w, 1 / h);

        // Cover-crop: image ka aspect vs frame ka aspect compare karke
        // sirf center wala hissa sample karte hain (object-fit: cover)
        const imageAspect = w / h;
        const frameAspect = FRAME_ASPECT;
        let scaleX = 1;
        let scaleY = 1;
        if (imageAspect > frameAspect) {
          // Image frame se zyada chaudi hai -> horizontally crop
          scaleX = frameAspect / imageAspect;
        } else {
          // Image frame se zyada lambi hai -> vertically crop
          scaleY = imageAspect / frameAspect;
        }
        material.uniforms.uvScale.value.set(scaleX, scaleY);
        material.uniforms.uvOffset.value.set((1 - scaleX) / 2, (1 - scaleY) / 2);
      }
    }
  }, [material, texture]);

  useEffect(() => {
    if (material && material.uniforms) {
      material.uniforms.isHovered.value = isHovered ? 1.0 : 0.0;
    }
  }, [material, isHovered]);

  return (
    <mesh
      ref={meshRef}
      position={position}
      scale={scale}
      material={material}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
    >
      <planeGeometry args={[1, 1, 32, 32]} />
    </mesh>
  );
}

function GalleryScene({
  images,
  speed = 1,
  visibleCount = 8,
  locked = false,
  fadeSettings = {
    fadeIn: { start: 0.05, end: 0.15 },
    fadeOut: { start: 0.85, end: 0.95 },
  },
  blurSettings = {
    blurIn: { start: 0.0, end: 0.1 },
    blurOut: { start: 0.9, end: 1.0 },
    maxBlur: 3.0,
  },
}) {
  const [scrollVelocity, setScrollVelocity] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const lastInteraction = useRef(Date.now());

  const normalizedImages = useMemo(
    () => images.map(img => (typeof img === "string" ? { src: img, alt: "" } : img)),
    [images]
  );

  // ---- VIDEO SUPPORT ----
  // useTexture (drei) sirf images load kar sakta hai, video nahi.
  // Isliye images aur videos ko alag-alag load karte hain, phir
  // dono ko wapas original order mein combine karte hain.
  const isVideoSrc = src => /\.(mp4|webm|mov)$/i.test(src);
  const imageEntries = useMemo(() => normalizedImages.filter(img => !isVideoSrc(img.src)), [normalizedImages]);
  const videoEntries = useMemo(() => normalizedImages.filter(img => isVideoSrc(img.src)), [normalizedImages]);

  const loadedImageTextures = useTexture(
    imageEntries.length > 0 ? imageEntries.map(img => img.src) : ["/placeholder.svg"]
  );

  // Video textures manually banate hain (THREE.VideoTexture) — har
  // video ke liye ek hidden <video> element jo autoplay+loop+muted hai
  const [videoTextures, setVideoTextures] = useState({});
  useEffect(() => {
    if (videoEntries.length === 0) return;
    const created = {};
    const elements = [];

    videoEntries.forEach(entry => {
      const video = document.createElement("video");
      video.src = entry.src;
      video.crossOrigin = "anonymous";
      video.loop = true;
      video.muted = true;
      video.playsInline = true;
      video.autoplay = true;
      video.play().catch(() => {});
      elements.push(video);

      const tex = new THREE.VideoTexture(video);
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      created[entry.src] = tex;
    });

    setVideoTextures(created);

    return () => {
      elements.forEach(v => {
        v.pause();
        v.src = "";
      });
      Object.values(created).forEach(t => t.dispose());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoEntries.map(v => v.src).join(",")]);

  // Textures ko wapas original (normalizedImages) order mein combine karte hain
  const textureBySrc = useMemo(() => {
    const map = {};
    imageEntries.forEach((entry, i) => {
      map[entry.src] = loadedImageTextures[i];
    });
    Object.entries(videoTextures).forEach(([src, tex]) => {
      map[src] = tex;
    });
    return map;
  }, [imageEntries, loadedImageTextures, videoTextures]);

  const textures = useMemo(
    () => normalizedImages.map(img => textureBySrc[img.src]),
    [normalizedImages, textureBySrc]
  );

  const materials = useMemo(
    () => Array.from({ length: visibleCount }, () => createClothMaterial()),
    [visibleCount]
  );

  const spatialPositions = useMemo(() => {
    const positions = [];
    const maxHorizontalOffset = MAX_HORIZONTAL_OFFSET;
    const maxVerticalOffset = MAX_VERTICAL_OFFSET;

    for (let i = 0; i < visibleCount; i++) {
      const horizontalAngle = (i * 2.618) % (Math.PI * 2);
      const verticalAngle = (i * 1.618 + Math.PI / 3) % (Math.PI * 2);

      const horizontalRadius = (i % 3) * 1.2;
      const verticalRadius = ((i + 1) % 4) * 0.8;

      const x = (Math.sin(horizontalAngle) * horizontalRadius * maxHorizontalOffset) / 3;
      const y = (Math.cos(verticalAngle) * verticalRadius * maxVerticalOffset) / 4;

      positions.push({ x, y });
    }

    return positions;
  }, [visibleCount]);

  const totalImages = normalizedImages.length;
  const depthRange = DEFAULT_DEPTH_RANGE;

  const planesData = useRef(
    Array.from({ length: visibleCount }, (_, i) => ({
      index: i,
      z: visibleCount > 0 ? ((depthRange / visibleCount) * i) % depthRange : 0,
      imageIndex: totalImages > 0 ? i % totalImages : 0,
      x: spatialPositions[i]?.x ?? 0,
      y: spatialPositions[i]?.y ?? 0,
    }))
  );

  useEffect(() => {
    planesData.current = Array.from({ length: visibleCount }, (_, i) => ({
      index: i,
      z: visibleCount > 0 ? ((depthRange / Math.max(visibleCount, 1)) * i) % depthRange : 0,
      imageIndex: totalImages > 0 ? i % totalImages : 0,
      x: spatialPositions[i]?.x ?? 0,
      y: spatialPositions[i]?.y ?? 0,
    }));
  }, [depthRange, spatialPositions, totalImages, visibleCount]);

  // ---- Normal page scroll se gallery ko drive karte hain ----
  // Pehle canvas apna khud ka wheel event capture karta tha
  // (preventDefault) — isse mouse gallery ke upar hote hi PAGE scroll
  // hona band ho jaata tha. Ab hum window ke real scroll se hi
  // gallery ko move karte hain, page scroll normal rehta hai.
  //
  // ---- SCROLL PROPERLY PAGE KE END TAK CHALE (chahe niche kuch ho ya na ho) ----
  // Pehle sirf gallery section ki apni height use ho rahi thi — lekin agar
  // gallery ke NICHE koi section/footer nahi hai, to page wahin khatam ho
  // jaata hai jahan gallery khatam hoti hai, aur poora cycle complete karne
  // ke liye jitni scroll-room chahiye thi utni milti hi nahi thi.
  // Ab hum "gallery ka top kahan hai" aur "poore page ka absolute end kahan
  // hai" dono nikaal ke, un dono ke beech jitni bhi scroll-room bachi hai
  // (chahe niche kuch ho ya na ho), usी ke against progress normalize
  // karte hain — isliye gallery ka cycle hamesha page ke bilkul end tak
  // properly complete hoga.
  const scrollRoomRef = useRef(1);
  const sectionTopAbsRef = useRef(0);
  const prevProgressRef = useRef(0);

  useEffect(() => {
    const measure = () => {
      const canvas = document.querySelector("canvas");
      const wrap = canvas?.parentElement;
      if (!wrap) return;
      const rectTop = wrap.getBoundingClientRect().top + window.scrollY;
      const scrollMax = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      sectionTopAbsRef.current = rectTop;
      scrollRoomRef.current = Math.max(scrollMax - rectTop, 1);
    };
    measure();
    window.addEventListener("resize", measure);
    // Thoda delay ke baad bhi ek baar measure kar lo (fonts/images load
    // hone ke baad page height badal sakti hai)
    const t = setTimeout(measure, 500);
    return () => {
      window.removeEventListener("resize", measure);
      clearTimeout(t);
    };
  }, []);

  const handlePageScroll = useCallback(() => {
    const currentY = window.scrollY;
    const raw = (currentY - sectionTopAbsRef.current) / scrollRoomRef.current;
    const progress = Math.max(0, Math.min(1, raw));
    const deltaProgress = progress - prevProgressRef.current;
    prevProgressRef.current = progress;

    if (deltaProgress !== 0) {
      // Poore progress range (0->1) mein SECTION_CYCLES chakkar poore honge
      setScrollVelocity(prev => prev + deltaProgress * depthRange * SECTION_CYCLES * 6 * speed);
      setAutoPlay(false);
      lastInteraction.current = Date.now();
    }
  }, [speed, depthRange]);

  const handleKeyDown = useCallback(
    event => {
      if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
        setScrollVelocity(prev => prev - 2 * speed);
        setAutoPlay(false);
        lastInteraction.current = Date.now();
      } else if (event.key === "ArrowDown" || event.key === "ArrowRight") {
        setScrollVelocity(prev => prev + 2 * speed);
        setAutoPlay(false);
        lastInteraction.current = Date.now();
      }
    },
    [speed]
  );

  // Touch support for mobile — swipe up/down to navigate (page scroll
  // ke saath conflict nahi karta, passive rehta hai)
  const touchStartY = useRef(0);
  const handleTouchStart = useCallback(e => {
    touchStartY.current = e.touches[0].clientY;
  }, []);
  const handleTouchMove = useCallback(
    e => {
      const deltaY = touchStartY.current - e.touches[0].clientY;
      setScrollVelocity(prev => prev + deltaY * 0.02 * speed);
      touchStartY.current = e.touches[0].clientY;
      setAutoPlay(false);
      lastInteraction.current = Date.now();
    },
    [speed]
  );

  // ---- SCROLL-LOCK MODE ----
  // Jab bahar wala wrapper (Gallery.jsx) page-scroll ko lock kar deta hai
  // (Lenis.stop()), tab window.scrollY badalna band ho jaata hai, isliye
  // handlePageScroll kuch nahi karega. Us waqt hum seedha wheel/touch delta
  // se hi scrollVelocity drive karte hain, taaki gallery locked hone ke
  // baad bhi scroll/swipe karne pe ghoomti rahe.
  const handleWheelLocked = useCallback(
    e => {
      setScrollVelocity(prev => prev + e.deltaY * 0.05 * speed);
      setAutoPlay(false);
      lastInteraction.current = Date.now();
    },
    [speed]
  );

  useEffect(() => {
    window.addEventListener("scroll", handlePageScroll, { passive: true });
    document.addEventListener("keydown", handleKeyDown);
    const canvas = document.querySelector("canvas");
    if (canvas) {
      canvas.addEventListener("touchstart", handleTouchStart, { passive: true });
      canvas.addEventListener("touchmove", handleTouchMove, { passive: true });
    }
    if (locked) {
      window.addEventListener("wheel", handleWheelLocked, { passive: true });
    }

    return () => {
      window.removeEventListener("scroll", handlePageScroll);
      document.removeEventListener("keydown", handleKeyDown);
      if (canvas) {
        canvas.removeEventListener("touchstart", handleTouchStart);
        canvas.removeEventListener("touchmove", handleTouchMove);
      }
      window.removeEventListener("wheel", handleWheelLocked);
    }
  }, [handlePageScroll, handleKeyDown, handleTouchStart, handleTouchMove, handleWheelLocked, locked]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Date.now() - lastInteraction.current > 3000) {
        setAutoPlay(true);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useFrame((state, delta) => {
    if (autoPlay) {
      setScrollVelocity(prev => prev + AUTOPLAY_SPEED * delta);
    }

    setScrollVelocity(prev => prev * 0.95);

    const time = state.clock.getElapsedTime();
    materials.forEach(material => {
      if (material && material.uniforms) {
        material.uniforms.time.value = time;
        material.uniforms.scrollForce.value = scrollVelocity;
      }
    });

    const imageAdvance = totalImages > 0 ? visibleCount % totalImages || totalImages : 0;
    const totalRange = depthRange;
    const halfRange = totalRange / 2;

    planesData.current.forEach((plane, i) => {
      let newZ = plane.z + scrollVelocity * delta * VELOCITY_MULTIPLIER;
      let wrapsForward = 0;
      let wrapsBackward = 0;

      if (newZ >= totalRange) {
        wrapsForward = Math.floor(newZ / totalRange);
        newZ -= totalRange * wrapsForward;
      } else if (newZ < 0) {
        wrapsBackward = Math.ceil(-newZ / totalRange);
        newZ += totalRange * wrapsBackward;
      }

      if (wrapsForward > 0 && imageAdvance > 0 && totalImages > 0) {
        plane.imageIndex = (plane.imageIndex + wrapsForward * imageAdvance) % totalImages;
      }

      if (wrapsBackward > 0 && imageAdvance > 0 && totalImages > 0) {
        const step = plane.imageIndex - wrapsBackward * imageAdvance;
        plane.imageIndex = ((step % totalImages) + totalImages) % totalImages;
      }

      plane.z = ((newZ % totalRange) + totalRange) % totalRange;
      plane.x = spatialPositions[i]?.x ?? 0;
      plane.y = spatialPositions[i]?.y ?? 0;

      const normalizedPosition = plane.z / totalRange;
      let opacity = 1;

      if (normalizedPosition >= fadeSettings.fadeIn.start && normalizedPosition <= fadeSettings.fadeIn.end) {
        const fadeInProgress =
          (normalizedPosition - fadeSettings.fadeIn.start) / (fadeSettings.fadeIn.end - fadeSettings.fadeIn.start);
        opacity = fadeInProgress;
      } else if (normalizedPosition < fadeSettings.fadeIn.start) {
        opacity = 0;
      } else if (normalizedPosition >= fadeSettings.fadeOut.start && normalizedPosition <= fadeSettings.fadeOut.end) {
        const fadeOutProgress =
          (normalizedPosition - fadeSettings.fadeOut.start) / (fadeSettings.fadeOut.end - fadeSettings.fadeOut.start);
        opacity = 1 - fadeOutProgress;
      } else if (normalizedPosition > fadeSettings.fadeOut.end) {
        opacity = 0;
      }

      opacity = Math.max(0, Math.min(1, opacity));

      let blur = 0;

      if (normalizedPosition >= blurSettings.blurIn.start && normalizedPosition <= blurSettings.blurIn.end) {
        const blurInProgress =
          (normalizedPosition - blurSettings.blurIn.start) / (blurSettings.blurIn.end - blurSettings.blurIn.start);
        blur = blurSettings.maxBlur * (1 - blurInProgress);
      } else if (normalizedPosition < blurSettings.blurIn.start) {
        blur = blurSettings.maxBlur;
      } else if (normalizedPosition >= blurSettings.blurOut.start && normalizedPosition <= blurSettings.blurOut.end) {
        const blurOutProgress =
          (normalizedPosition - blurSettings.blurOut.start) / (blurSettings.blurOut.end - blurSettings.blurOut.start);
        blur = blurSettings.maxBlur * blurOutProgress;
      } else if (normalizedPosition > blurSettings.blurOut.end) {
        blur = blurSettings.maxBlur;
      }

      blur = Math.max(0, Math.min(blurSettings.maxBlur, blur));

      const material = materials[i];
      if (material && material.uniforms) {
        material.uniforms.opacity.value = opacity;
        material.uniforms.blurAmount.value = blur;
      }
    });
  });

  if (normalizedImages.length === 0) return null;

  return (
    <>
      {planesData.current.map((plane, i) => {
        const texture = textures[plane.imageIndex];
        const material = materials[i];

        if (!texture || !material) return null;

        const worldZ = plane.z - depthRange / 2;

        // Fixed frame size for har plane — cover-crop ab shader ke
        // andar (uvScale/uvOffset) ho raha hai, isliye geometry ka
        // size sabke liye same rehta hai (consistent grid jaisa lagta hai)
        const scale = [2.7 * FRAME_ASPECT, 2.7, 1];

        return (
          <ImagePlane
            key={plane.index}
            texture={texture}
            position={[plane.x, plane.y, worldZ]}
            scale={scale}
            material={material}
          />
        );
      })}
    </>
  );
}

// Fallback for when WebGL is not available
function FallbackGallery({ images }) {
  const normalizedImages = useMemo(
    () => images.map(img => (typeof img === "string" ? { src: img, alt: "" } : img)),
    [images]
  );

  return (
    <div className="flex flex-col items-center justify-center h-full bg-bg-alt p-4">
      <p className="text-fg-muted mb-4">WebGL not supported. Showing image list:</p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
        {normalizedImages.map((img, i) => (
          <img key={i} src={img.src || "/placeholder.svg"} alt={img.alt} className="w-full h-32 object-cover rounded" />
        ))}
      </div>
    </div>
  );
}

export default function InfiniteGallery({
  images,
  className = "h-96 w-full",
  style,
  fadeSettings = {
    fadeIn: { start: 0.05, end: 0.25 },
    fadeOut: { start: 0.4, end: 0.43 },
  },
  blurSettings = {
    blurIn: { start: 0.0, end: 0.1 },
    blurOut: { start: 0.4, end: 0.43 },
    maxBlur: 8.0,
  },
  speed,
  visibleCount,
  locked = false,
}) {
  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) {
        setWebglSupported(false);
      }
    } catch (e) {
      setWebglSupported(false);
    }
  }, []);

  if (!webglSupported) {
    return (
      <div className={className} style={style}>
        <FallbackGallery images={images} />
      </div>
    );
  }

  return (
    <div className={className} style={style}>
      <Canvas
        camera={{ position: [0, 0, 0], fov: 55 }}
        gl={{ antialias: true, alpha: true }}
        frameloop="always"
      >
        <GalleryScene
          images={images}
          fadeSettings={fadeSettings}
          blurSettings={blurSettings}
          speed={speed}
          visibleCount={visibleCount}
          locked={locked}
        />
      </Canvas>
    </div>
  );
}
