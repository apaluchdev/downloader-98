import { useState, useRef } from "react";
import "./FileExplorer.css";
import { Window98 } from "./Window98";

interface FileItem {
  name: string;
  id: string;
  file: File;
  isSynced: boolean;
  size?: number; // Actual size from server, overrides file.size for synced files
}

interface FileExplorerProps {
  onFileAdd?: (file: File) => void;
  onFileDelete?: (id: string) => void;
  onFileDownload?: (file: FileItem) => void;
  files: FileItem[];
  onClose?: () => void;
  isVisible?: boolean;
  activePin?: string;
  isMobile?: boolean;
}

export function FileExplorer({ onFileAdd, onFileDelete, onFileDownload, files, onClose, isVisible = true, activePin = "", isMobile = false }: FileExplorerProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    droppedFiles.forEach((file) => {
      if (onFileAdd) {
        onFileAdd(file);
      }
    });
  };

  const handleKeyDown = async (e: React.KeyboardEvent) => {
    if (e.key === "Delete" && selectedFileId && onFileDelete) {
      const selectedFile = files.find((f) => f.id === selectedFileId);
      if (!selectedFile) {
        return;
      }

      // If file is synced, delete from server
      if (selectedFile.isSynced && activePin) {
        try {
          const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
          const response = await fetch(`${API_BASE_URL}/api/files/${activePin}/${selectedFile.name}`, {
            method: "DELETE",
          });

          if (!response.ok) {
            throw new Error(`Delete failed: ${response.statusText}`);
          }

          console.log(`File "${selectedFile.name}" deleted from server`);
        } catch (error) {
          console.error("Delete error:", error);
          alert(`Failed to delete file from server: ${error instanceof Error ? error.message : "Unknown error"}`);
          return;
        }
      }

      // Remove from local state
      onFileDelete(selectedFileId);
      setSelectedFileId(null);
    }
  };

  const handleDeleteClick = async () => {
    if (!selectedFileId || !onFileDelete) {
      return;
    }

    const selectedFile = files.find((f) => f.id === selectedFileId);
    if (!selectedFile) {
      return;
    }

    // If file is synced, delete from server
    if (selectedFile.isSynced && activePin) {
      try {
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
        const response = await fetch(`${API_BASE_URL}/api/files/${activePin}/${selectedFile.name}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error(`Delete failed: ${response.statusText}`);
        }

        console.log(`File "${selectedFile.name}" deleted from server`);
      } catch (error) {
        console.error("Delete error:", error);
        alert(`Failed to delete file from server: ${error instanceof Error ? error.message : "Unknown error"}`);
        return;
      }
    }

    // Remove from local state
    onFileDelete(selectedFileId);
    setSelectedFileId(null);
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onFileAdd) {
      onFileAdd(file);
    }
  };

  const handleDoubleClick = (fileItem: FileItem) => {
    if (onFileDownload) {
      onFileDownload(fileItem);
    }
  };

  const getSelectedFile = () => {
    return files.find((f) => f.id === selectedFileId);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const getFileIconSrc = (fileName: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase();
    switch (ext) {
      case "txt":
        return "/fileIcons/text.png";
      case "pdf":
        return "/fileIcons/text.png";
      case "zip":
      case "rar":
      case "7z":
        return "/fileIcons/winrar-zip.png";
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return "/fileIcons/image2.png";
      case "mp3":
        return "/fileIcons/music.png";
      case "wav":
        return "/fileIcons/music.png";
      case "mp4":
        return "/fileIcons/media.png";
      case "avi":
        return "/fileIcons/media.png";
      default:
        return "/fileIcons/file.png"; // fallback generic icon
    }
  };

  return (
    <Window98 title="My Files" onClose={onClose} initialX={isMobile ? 10 : 750} initialY={isMobile ? 450 : 300} width={isMobile ? 'calc(100vw - 20px)' : undefined} className="file-explorer-window" isVisible={isVisible} isMobile={isMobile}>
      <div className="window-body file-explorer-body" tabIndex={0} onKeyDown={handleKeyDown}>
        <div ref={dropZoneRef} className={`file-drop-zone ${isDragging ? "dragging" : ""}`} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
          {files.length === 0 ? (
            <div className="empty-state">
              <p>Drop files here or use the browse button</p>
            </div>
          ) : (
            <div className="file-grid">
              {files.map((file) => (
                <div key={file.id} className={`file-item ${selectedFileId === file.id ? "selected" : ""}`} onClick={() => setSelectedFileId(file.id)} onDoubleClick={() => handleDoubleClick(file)} style={{ opacity: file.isSynced ? 1 : 0.5 }}>
                  <div className="file-icon">
                    <img
                      src={getFileIconSrc(file.name)}
                      alt={file.name + " icon"}
                      style={{ width: 32, height: 32 }}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = "/fileIcons/file.png";
                      }}
                    />
                  </div>
                  <div className="file-name">{file.name}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="status-bar">
          <p className="status-bar-field">{files.length} file(s)</p>
          {selectedFileId && getSelectedFile() && <p className="status-bar-field">{formatFileSize(getSelectedFile()!.size || getSelectedFile()!.file.size)}</p>}
          <button className="status-bar-delete-btn" onClick={handleBrowseClick}>
            Browse
          </button>
          <button className="status-bar-delete-btn" onClick={handleDeleteClick} disabled={!selectedFileId}>
            Delete
          </button>
          <input ref={fileInputRef} type="file" onChange={handleFileChange} style={{ display: "none" }} />
        </div>
      </div>
    </Window98>
  );
}
