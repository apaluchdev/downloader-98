import { useState, useRef, useEffect } from "react";
import "./WinampPlayer.css";
import { Window98 } from "./Window98";

interface WinampPlayerProps {
  src?: string;
  onClose?: () => void;
  isVisible?: boolean;
}

export function WinampPlayer({ src, onClose, isVisible = true }: WinampPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(75);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleStop = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Window98 title="WINAMP" onClose={onClose} initialX={300} initialY={300} width={275} className="winamp-player" isVisible={isVisible} showMaximize={false}>
      <div className="winamp-body">
        {/* Display */}
        <div className="winamp-display">
          <div className="winamp-time">{formatTime(currentTime)}</div>
          <div className="winamp-track-info">{src ? src.split("/").pop()?.replace(".mp3", "") || "No Track" : "No Track"}</div>
        </div>

        {/* Visualizer placeholder */}
        <div className="winamp-visualizer">
          <div className="visualizer-bars">
            {[...Array(16)].map((_, i) => (
              <div
                key={i}
                className="visualizer-bar"
                style={{
                  height: isPlaying ? `${Math.random() * 100}%` : "2px",
                  transition: "height 0.1s",
                }}
              />
            ))}
          </div>
        </div>

        {/* Seek bar */}
        <div className="winamp-seekbar">
          <input type="range" min="0" max={duration || 100} value={currentTime} onChange={handleSeek} className="seekbar-slider" />
          <div className="seekbar-time">{formatTime(duration)}</div>
        </div>

        {/* Controls */}
        <div className="winamp-controls">
          <button className="winamp-btn" onClick={handleStop} title="Stop">
            ■
          </button>
          <button className="winamp-btn winamp-btn-play" onClick={togglePlay} title={isPlaying ? "Pause" : "Play"}>
            {isPlaying ? "❚❚" : "▶"}
          </button>
        </div>

        {/* Volume */}
        <div className="winamp-volume">
          <label>Vol:</label>
          <input type="range" min="0" max="100" value={volume} onChange={(e) => setVolume(parseInt(e.target.value))} className="volume-slider" />
          <span className="volume-value">{volume}</span>
        </div>
      </div>

      <audio ref={audioRef} src={src} />
    </Window98>
  );
}
