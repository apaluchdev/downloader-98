import { useState } from "react";
import "./DownloadWindow.css";
import { Window98 } from "./Window98";

interface FileItem {
  name: string;
  id: string;
  file: File;
  isSynced: boolean;
  size?: number; // Actual size from server, overrides file.size for synced files
}

interface DownloadWindowProps {
  onFileSync?: (id: string) => void;
  onSetFiles?: (files: FileItem[]) => void;
  activePin?: string;
  onActivePinChange?: (pin: string) => void;
  onClose?: () => void;
  isVisible?: boolean;
  files?: FileItem[];
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function DownloadWindow({ onFileSync, onSetFiles, activePin = "", onActivePinChange, onClose, isVisible = true, files = [] }: DownloadWindowProps) {
  const count = files.length;
  const [inputPin, setInputPin] = useState("");
  const [progress, setProgress] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("Pin must be 6 digits or longer!");
  const [isUploading, setIsUploading] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);

  // Pin must be 6-8 digits
  const isPinValid = /^\d{6,8}$/.test(inputPin);

  const percentage = Math.min(Math.max(progress, 0), 100);
  const loadingSquareCount = Array.from({ length: Math.ceil((percentage / 100) * 28) });

  const BlueSquare = () => {
    return <div className="h-4 w-3 bg-blue-800" />;
  };

  const validatePin = () => {
    if (inputPin.length < 6) {
      setModalMessage("Pin must be 6 digits or longer!");
      setShowModal(true);
      return false;
    }
    return true;
  };

  const uploadFileToAPI = async (file: File) => {
    if (!validatePin()) {
      return;
    }

    setIsUploading(true);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${API_BASE_URL}/api/files/${activePin}`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Upload successful:", result);

      setProgress(100);
      setModalMessage(`File "${file.name}" uploaded successfully!`);
      setShowModal(true);

      // Reset progress after a short delay
      setTimeout(() => {
        setProgress(0);
      }, 1500);

      return true;
    } catch (error) {
      console.error("Upload error:", error);
      setModalMessage(`Upload failed: ${error instanceof Error ? error.message : "Unknown error"}`);
      setShowModal(true);
      setProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  const handleQuery = async () => {
    if (!validatePin()) {
      return;
    }

    setIsUploading(true);
    setProgress(0);

    try {
      const response = await fetch(`${API_BASE_URL}/api/files/${inputPin}`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`Query failed: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Files from API:", data);

      // Handle the API response format: { files: [{ name, size }, ...] }
      const fileObjects = data.files || [];

      // Create placeholder File objects for the files on the server
      const serverFiles: FileItem[] = fileObjects.map((fileObj: { name: string; size: number }) => ({
        name: fileObj.name,
        id: `server-${Date.now()}-${Math.random()}`,
        file: new File([], fileObj.name, { type: "application/octet-stream" }),
        isSynced: true,
        size: fileObj.size,
      }));

      // Merge with existing local files that are not synced
      const localUnsyncedFiles = files.filter((f) => !f.isSynced);
      const allFiles = [...serverFiles, ...localUnsyncedFiles];

      if (onSetFiles) {
        onSetFiles(allFiles);
      }

      // Set the active PIN after successful query
      if (onActivePinChange) {
        onActivePinChange(inputPin);
      }

      setProgress(100);
      setModalMessage(`Found ${fileObjects.length} file(s) on server.`);
      setShowModal(true);

      setTimeout(() => {
        setProgress(0);
      }, 1500);
    } catch (error) {
      console.error("Query error:", error);
      setModalMessage(`Query failed: ${error instanceof Error ? error.message : "Unknown error"}`);
      setShowModal(true);
      setProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = () => {};

  const handleUpload = async () => {
    if (!validatePin()) {
      return;
    }

    const unsyncedFiles = files.filter((f) => !f.isSynced);

    if (unsyncedFiles.length === 0) {
      setModalMessage("No unsynced files to upload!");
      setShowModal(true);
      return;
    }

    // Upload all unsynced files from the FileExplorer
    let uploadedCount = 0;
    for (const fileItem of unsyncedFiles) {
      const success = await uploadFileToAPI(fileItem.file);
      if (success && onFileSync) {
        onFileSync(fileItem.id);
        uploadedCount++;
      }
    }

    if (uploadedCount > 0) {
      setModalMessage(`Successfully uploaded ${uploadedCount} file(s)!`);
      setShowModal(true);
    }
  };

  return (
    <Window98 title="Downloader 98" onClose={onClose} initialX={50} initialY={200} width={480} className="download-window" isVisible={isVisible}>
      <div className="window-body">
        <div className="field-row-stacked">
          <label htmlFor="pin">PIN</label>
          <input id="pin" className="pin-input" type="text" placeholder="Enter 6-digit pin" value={inputPin} onChange={(e) => setInputPin(e.target.value)} />
        </div>

        <div className="field-row" style={{ marginTop: 8, gap: 8 }}>
          <button onClick={handleQuery} disabled={!isPinValid}>
            Set PIN
          </button>
          <button onClick={handleDownload} disabled={!isPinValid}>
            Download ({count})
          </button>
          <button onClick={handleUpload} disabled={!isPinValid || isUploading}>
            {isUploading ? "Uploading..." : "Upload"}
          </button>
          <button onClick={() => setShowAboutModal(true)}>About</button>
        </div>

        <div className="status-bar" style={{ marginTop: 12 }}>
          <p className="status-bar-field">{isUploading ? `Uploading: ${percentage}%` : `Speed: 0 KB/s`}</p>
        </div>

        <div style={{ marginTop: 8 }}>
          <ul className="tree-view bg-(--win-98)" style={{ border: "2px inset #c0c0c0", padding: "6px" }}>
            <div className="flex h-4 gap-1">
              {loadingSquareCount.map((_, index) => (
                <BlueSquare key={index} />
              ))}
            </div>
          </ul>
        </div>
      </div>

      {showModal && (
        <div
          className="window modal-window"
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: "300px",
            zIndex: 1000,
          }}
        >
          <div className="title-bar">
            <div className="title-bar-text">Warning</div>
            <div className="title-bar-controls">
              <button aria-label="Close" onClick={() => setShowModal(false)}></button>
            </div>
          </div>
          <div className="window-body">
            <p style={{ marginBottom: 16 }}>{modalMessage}</p>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button onClick={() => setShowModal(false)}>OK</button>
            </div>
          </div>
        </div>
      )}

      {showAboutModal && (
        <div
          className="window modal-window"
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: "350px",
            zIndex: 1000,
          }}
        >
          <div className="title-bar">
            <div className="title-bar-text">About Downloader 98</div>
            <div className="title-bar-controls">
              <button aria-label="Close" onClick={() => setShowAboutModal(false)}></button>
            </div>
          </div>
          <div className="window-body">
            <p style={{ marginBottom: 12, fontWeight: "bold" }}>Downloader 98</p>
            <p style={{ marginBottom: 12 }}>
              Enter a PIN to upload and download files. <br />
              Query the server for a specific PIN to see available files, upload local files, and download them. Files associated with a PIN are expired after a week.
            </p>
            <hr style={{ margin: "16px 0" }} />
            <p style={{ fontSize: "1em", color: "#666", marginBottom: 8 }}>
              Winamp provided by{" "}
              <a href="https://github.com/captbaritone/webamp" target="_blank" rel="noopener noreferrer">
                Webamp
              </a>{" "}
              (MIT License)
            </p>
            <div style={{ fontSize: "1em", color: "#888", marginBottom: 8 }}>Copyright (c) 2017-2024 Jordan Eldredge</div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button onClick={() => setShowAboutModal(false)}>OK</button>
            </div>
          </div>
        </div>
      )}
    </Window98>
  );
}
