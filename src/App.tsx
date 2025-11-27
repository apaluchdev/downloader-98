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
}

function App() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isDownloadWindowVisible, setIsDownloadWindowVisible] = useState(true);
  const [isFileExplorerVisible, setIsFileExplorerVisible] = useState(true);
  // const [isWinampVisible, setIsWinampVisible] = useState(true);

  const handleFileAdd = (file: File) => {
    const newFile: FileItem = {
      name: file.name,
      id: `${Date.now()}-${Math.random()}`,
    };
    setFiles((prev) => [...prev, newFile]);
  };

  const handleFileDelete = (id: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== id));
  };

  return (
    <div className="w-full">
      <div className="desktop" style={{ position: "relative", width: "100%", height: "100vh" }}>
        <RecycleBinIcon name="Recycle Bin" imageSrc="/recycle_bin_full-2.png" onDoubleClick={() => alert("Recycle Bin opened!")} />
        {/* Bonzi GIF at top right */}
        <img src="/bonzi.gif" alt="Bonzi GIF" style={{ position: "absolute", top: 12, right: 12, width: 100, height: "auto", zIndex: 100 }} />
      </div>
      <DownloadWindow onFileAdd={handleFileAdd} onClose={() => setIsDownloadWindowVisible(false)} isVisible={isDownloadWindowVisible} />
      <FileExplorer files={files} onFileAdd={handleFileAdd} onFileDelete={handleFileDelete} onClose={() => setIsFileExplorerVisible(false)} isVisible={isFileExplorerVisible} />
      {/* <WinampPlayer src="/music/chevrolet.mp3" onClose={() => setIsWinampVisible(false)} isVisible={isWinampVisible} /> */}
      {/* <ProgressWindow windowTitle="Upload Progress" progress={50} onCancel={() => {}} onDone={() => {}} /> */}
      <Taskbar />
    </div>
  );
}

export default App;
