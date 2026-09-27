import React, { useEffect, useRef, useState } from "react";

// ============================================================
// Background music toggle. Same round icon style as every other
// navbar button (`.nav_btn_sm`), visible on both the desktop and
// mobile navbars — it's never tucked away in a hidden menu.
//
// HOW TO ADD SONGS:
//   1. Drop the audio file(s) in `public/music/` (e.g. public/music/song-1.mp3).
//   2. List each file's path below, in the order you want them to play.
//   3. When a song ends, the player automatically moves to the next
//      one, and after the last song it loops back to the first —
//      so the whole playlist repeats forever until the user turns
//      it off.
// ============================================================
const PLAYLIST = [
  "/music/song-1.mp3",
  "/music/song-2.mp3",
];

const MusicOnIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M9 18V5l12-2v13" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="18" cy="16" r="3" />
  </svg>
);

const MusicOffIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M9 18V5l12-2v13" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="18" cy="16" r="3" />
    <line x1="2" y1="2" x2="22" y2="22" />
  </svg>
);

const MusicPlayer = () => {
  const audioRef = useRef(null);
  const indexRef = useRef(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || PLAYLIST.length === 0) return;

    audio.volume = 0.5;

    const playNext = () => {
      indexRef.current = (indexRef.current + 1) % PLAYLIST.length;
      audio.src = PLAYLIST[indexRef.current];
      audio.play().catch(() => {});
    };

    audio.addEventListener("ended", playNext);
    return () => audio.removeEventListener("ended", playNext);
  }, []);

  if (PLAYLIST.length === 0) return null;

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      audio.pause();
      setPlaying(false);
      return;
    }

    if (!audio.src) {
      audio.src = PLAYLIST[indexRef.current];
    }
    audio
      .play()
      .then(() => setPlaying(true))
      .catch(() => setPlaying(false));
  };

  return (
    <>
      <audio ref={audioRef} preload="none" />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pause music" : "Play music"}
        aria-pressed={playing}
        className="nav_btn_sm flex items-center justify-center cursor-pointer"
      >
        {playing ? <MusicOnIcon /> : <MusicOffIcon />}
      </button>
    </>
  );
};

export default MusicPlayer;
