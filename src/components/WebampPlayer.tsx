import { useEffect, useRef } from "react";
import Webamp from "webamp";
import butterchurn from "butterchurn";
import butterchurnPresets from "butterchurn-presets";

interface WebampPlayerProps {
  isVisible?: boolean;
  onClose?: () => void;
}

export function WebampPlayer({ isVisible = true, onClose }: WebampPlayerProps) {
  const webampRef = useRef<Webamp | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!isVisible || initializedRef.current) {
      return;
    }

    initializedRef.current = true;

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const webamp = new Webamp({
      initialTracks: [
        {
          metaData: { artist: "Gran Turismo", title: "Chevrolet Garage Music" },
          url: `${API_BASE_URL}/api/files/music/chevrolet.mp3`,
        },
        {
          metaData: { artist: "50 Cent", title: "Many Men" },
          url: `${API_BASE_URL}/api/files/music/manymen.mp3`,
        },
        {
          metaData: { artist: "Nena", title: "Irgendwie, Irgendwo, Irgendwann" },
          url: `${API_BASE_URL}/api/files/music/irgendwie.mp3`,
        },
        {
          metaData: { artist: "CSS", title: "Off The Hook" },
          url: `${API_BASE_URL}/api/files/music/offthehook.mp3`,
        },
        {
          metaData: { artist: "Unknown", title: "8bit" },
          url: `${API_BASE_URL}/api/files/music/8bit.mp3`,
        },
        {
          metaData: { artist: "Yellowcard", title: "Way Away" },
          url: `${API_BASE_URL}/api/files/music/way-away.mp3`,
        },
      ],
      initialSkin: {
        url: "https://cdn.jsdelivr.net/gh/captbaritone/webamp@43434d82cfe0e37286dbbe0666072dc3190a83bc/skins/base-2.91.wsz",
      },
      // Enable Butterchurn visualizer
      __butterchurnOptions: {
        importButterchurn: () => Promise.resolve(butterchurn),
        getPresets: () => {
          const presets = butterchurnPresets;
          return Promise.resolve(
            Object.keys(presets).map((name) => ({
              name,
              butterchurnPresetObject: presets[name],
            }))
          );
        },
        butterchurnOpen: true,
      },
    });

    webamp.renderWhenReady(containerRef.current!).then(() => {
      webampRef.current = webamp;
    });

    // Handle close event
    webamp.onClose(() => {
      if (onClose) {
        onClose();
      }
    });

    return () => {
      if (webampRef.current) {
        webampRef.current.dispose();
        webampRef.current = null;
      }
      initializedRef.current = false;
    };
  }, [isVisible]);

  if (!isVisible) {
    return null;
  }

  return <div ref={containerRef} style={{ position: "absolute", zIndex: 1000, top: 720, left: 200 }} />;
}
