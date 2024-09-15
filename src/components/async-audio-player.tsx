import React, { useState, useEffect, useRef } from "react";

const AsyncAudioPlayer = () => {
  const [audioSrc, setAudioSrc] = useState<string>(
    "http://localhost:8080/file/apaluch/toyota.mp3",
  );
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Function to fetch the audio file
    const loadAudio = async () => {
      try {
        const response = await fetch(audioSrc);
        if (response.ok) {
          // Create an object URL from the response
          const audioBlob = await response.blob();
          const audioUrl = URL.createObjectURL(audioBlob);
          setAudioSrc(audioUrl);
          // Optionally, play the audio once it is loaded
          if (audioRef.current) audioRef.current.play();
        } else {
          console.error("Failed to load audio");
        }
      } catch (error) {
        console.error("Error loading audio:", error);
      }
    };

    loadAudio();
  }, []);

  return (
    <div>
      {audioSrc ? (
        <audio ref={audioRef} controls>
          <source src={audioSrc} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      ) : (
        <p>Loading audio...</p>
      )}
    </div>
  );
};

export default AsyncAudioPlayer;
