import { useState } from "react";
import "./App.css";
import { Taskbar } from "./components/Taskbar";
import { DownloadWindow } from "./components/DownloadWindow";
import { FileExplorer } from "./components/FileExplorer";
import { RecycleBinIcon } from "./components/RecycleBinIcon";
// import { WinampPlayer } from "./components/WinampPlayer";

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
  const [currentPin, setCurrentPin] = useState<string>("");
  // const [isWinampVisible, setIsWinampVisible] = useState(true);

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
    setCurrentPin(newPin);
    // Clear files when PIN is changed
    setFiles([]);
  };

  const handleFileDownload = async (fileItem: FileItem) => {
    if (!fileItem.isSynced) {
      alert("Cannot download: File not synced to server yet!");
      return;
    }

    if (!currentPin) {
      alert("No PIN set. Please query files first.");
      return;
    }

    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(`${API_BASE_URL}/api/files/${currentPin}/${fileItem.name}`);

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

  return (
    <div className="w-full">
      <div className="desktop" style={{ position: "relative", width: "100%", height: "100vh" }}>
        <RecycleBinIcon name="Recycle Bin" imageSrc="/recycle_bin_full-2.png" onDoubleClick={() => alert("Recycle Bin opened!")} />
        {/* Bonzi GIF at top right */}
        <img src="/bonzi.gif" alt="Bonzi GIF" style={{ position: "absolute", top: 12, right: 12, width: 100, height: "auto", zIndex: 100 }} />
        {currentPin && (
          <h1 className="window text-center font-semibold w-xs m-auto display-block">
            <p className="text-lg">Current PIN: {currentPin}</p>
          </h1>
        )}
      </div>
      <DownloadWindow files={files} onFileSync={handleFileSync} onSetFiles={handleSetFiles} currentPin={currentPin} onPinChange={handlePinChange} onClose={() => setIsDownloadWindowVisible(false)} isVisible={isDownloadWindowVisible} />
      <FileExplorer files={files} onFileAdd={handleFileAdd} onFileDelete={handleFileDelete} onFileDownload={handleFileDownload} onClose={() => setIsFileExplorerVisible(false)} isVisible={isFileExplorerVisible} />
      {/* <WinampPlayer src="/music/chevrolet.mp3" onClose={() => setIsWinampVisible(false)} isVisible={isWinampVisible} /> */}
      {/* <ProgressWindow windowTitle="Upload Progress" progress={50} onCancel={() => {}} onDone={() => {}} /> */}
      <Taskbar />
    </div>
  );
}

export default App;
