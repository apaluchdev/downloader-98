import { useState, useCallback, useEffect } from "react";
import "./App.css";
import { Taskbar } from "./components/Taskbar";
import { DownloadWindow } from "./components/DownloadWindow";
import { FileExplorer } from "./components/FileExplorer";
import { RecycleBinIcon } from "./components/RecycleBinIcon";
import { WebampPlayer } from "./components/WebampPlayer";

interface FileItem {
  name: string;
  id: string;
  file: File;
  isSynced: boolean;
  size?: number; // Actual size from server, overrides file.size for synced files
}

function App() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isDownloadWindowVisible, setIsDownloadWindowVisible] = useState(true);
  const [isFileExplorerVisible, setIsFileExplorerVisible] = useState(true);
  const [activePin, setActivePin] = useState<string>("");
  const [isWebampVisible, setIsWebampVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
      setIsMobile(mobile);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleFileAdd = (file: File, isSynced = false) => {
    const newFile: FileItem = {
      name: file.name,
      id: `${Date.now()}-${Math.random()}`,
      file: file,
      isSynced: isSynced,
    };
    setFiles((prev) => [...prev, newFile]);
  };

  const handleFileDelete = (id: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== id));
  };

  const handleFileSync = (id: string) => {
    setFiles((prev) => prev.map((file) => (file.id === id ? { ...file, isSynced: true } : file)));
  };

  const handleSetFiles = (newFiles: FileItem[]) => {
    setFiles(newFiles);
  };

  const handlePinChange = (newPin: string) => {
    // Only clear files if the PIN is actually changing to a different value
    if (newPin !== activePin) {
      setFiles([]);
    }
    setActivePin(newPin);
  };

  const handleFileDownload = async (fileItem: FileItem) => {
    if (!fileItem.isSynced) {
      alert("Cannot download: File not synced to server yet!");
      return;
    }

    if (!activePin) {
      alert("No PIN set. Please query files first.");
      return;
    }

    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(`${API_BASE_URL}/api/files/${activePin}/${fileItem.name}`);

      if (!response.ok) {
        throw new Error(`Download failed: ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileItem.name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Download error:", error);
      alert(`Download failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };

  const handleDownloadWindowClose = useCallback(() => {
    setIsDownloadWindowVisible(false);
  }, []);

  const handleFileExplorerClose = useCallback(() => {
    setIsFileExplorerVisible(false);
  }, []);

  const handleWebampClose = useCallback(() => {
    setIsWebampVisible(false);
  }, []);

  return (
    <div className={`w-full ${isMobile ? "mobile-layout" : ""}`} style={{ height: "100vh", overflow: isMobile ? "auto" : "hidden" }}>
      <div className="desktop" style={{ position: "relative", width: "100%", height: isMobile ? "auto" : "100vh", minHeight: isMobile ? "100vh" : "auto" }}>
        {!isMobile && <RecycleBinIcon name="Recycle Bin" imageSrc="/recycle_bin_full-2.png" onDoubleClick={() => alert("Recycle Bin opened!")} />}
        {/* Bonzi GIF at top right */}
        {!isMobile && <img src="/bonzi.gif" alt="Bonzi GIF" style={{ position: "fixed", top: 8, right: 8, width: 100, height: "auto", zIndex: 0 }} />}
        {activePin && (
          <div className={`current-pin-display ${isMobile ? "mobile-pin" : ""}`}>
            <h1 className="window text-center font-semibold w-xs m-auto display-block">
              <p className="text-lg">Current PIN: {activePin}</p>
            </h1>
          </div>
        )}
        <DownloadWindow files={files} onFileSync={handleFileSync} onSetFiles={handleSetFiles} activePin={activePin} onActivePinChange={handlePinChange} onClose={handleDownloadWindowClose} isVisible={isDownloadWindowVisible} isMobile={isMobile} />
        <FileExplorer files={files} onFileAdd={handleFileAdd} onFileDelete={handleFileDelete} onFileDownload={handleFileDownload} activePin={activePin} onClose={handleFileExplorerClose} isVisible={isFileExplorerVisible} isMobile={isMobile} />
        {!isMobile && <WebampPlayer onClose={handleWebampClose} isVisible={isWebampVisible} />}
      </div>
      {!isMobile && <Taskbar />}
    </div>
  );
}

export default App;
