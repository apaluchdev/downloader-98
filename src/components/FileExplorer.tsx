import { useState, useRef } from "react";
import "./FileExplorer.css";
import { Window98 } from "./Window98";

interface FileItem {
  name: string;
  id: string;
}

interface FileExplorerProps {
  onFileAdd?: (file: File) => void;
  onFileDelete?: (id: string) => void;
  files: FileItem[];
  onClose?: () => void;
  isVisible?: boolean;
}

export function FileExplorer({ onFileAdd, onFileDelete, files, onClose, isVisible = true }: FileExplorerProps) {
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Delete" && selectedFileId && onFileDelete) {
      onFileDelete(selectedFileId);
      setSelectedFileId(null);
    }
  };

  const handleDeleteClick = () => {
    if (selectedFileId && onFileDelete) {
      onFileDelete(selectedFileId);
      setSelectedFileId(null);
    }
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
    <Window98 title="My Files" onClose={onClose} initialX={500} initialY={100} className="file-explorer-window" isVisible={isVisible}>
      <div className="window-body file-explorer-body" tabIndex={0} onKeyDown={handleKeyDown}>
        <div ref={dropZoneRef} className={`file-drop-zone ${isDragging ? "dragging" : ""}`} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
          {files.length === 0 ? (
            <div className="empty-state">
              <p>Drop files here or use the browse button</p>
            </div>
          ) : (
            <div className="file-grid">
              {files.map((file) => (
                <div key={file.id} className={`file-item ${selectedFileId === file.id ? "selected" : ""}`} onClick={() => setSelectedFileId(file.id)}>
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
