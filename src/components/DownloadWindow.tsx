import { useState } from "react";
import "./DownloadWindow.css";
import { Window98 } from "./Window98";

interface DownloadWindowProps {
  onFileAdd?: (file: File) => void;
  onClose?: () => void;
  isVisible?: boolean;
}

export function DownloadWindow({ onFileAdd, onClose, isVisible = true }: DownloadWindowProps) {
  const [count] = useState(0);
  const [progress] = useState(25);
  const [pin, setPin] = useState("");
  const [showModal, setShowModal] = useState(false);

  // Pin must be 6-8 digits
  const isPinValid = /^\d{6,8}$/.test(pin);

  const percentage = Math.min(Math.max(progress, 0), 100);
  const loadingSquareCount = Array.from({ length: Math.ceil((percentage / 100) * 23) });

  const BlueSquare = () => {
    return <div className="h-4 w-3 bg-blue-800" />;
  };

  const validatePin = () => {
    if (pin.length < 6) {
      setShowModal(true);
      return false;
    }
    return true;
  };

  const handleQuery = () => {};

  const handleDownload = () => {};

  const handleUpload = () => {
    if (validatePin() && onFileAdd) {
      const input = document.createElement("input");
      input.type = "file";
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          onFileAdd(file);
        }
      };
      input.click();
    }
  };

  return (
    <Window98 title="Downloader 98" onClose={onClose} initialX={100} initialY={50} width={480} className="download-window" isVisible={isVisible}>
      <div className="window-body">
        <div className="field-row-stacked">
          <label htmlFor="pin">PIN</label>
          <input id="pin" className="pin-input" type="text" placeholder="Enter 6-digit pin" value={pin} onChange={(e) => setPin(e.target.value)} />
        </div>

        <div className="field-row" style={{ marginTop: 8, gap: 8 }}>
          <button onClick={handleQuery} disabled={!isPinValid}>
            Query
          </button>
          <button onClick={handleDownload} disabled={!isPinValid}>
            Download ({count})
          </button>
          <button onClick={handleUpload} disabled={!isPinValid}>
            Upload
          </button>
        </div>

        <div className="status-bar" style={{ marginTop: 12 }}>
          <p className="status-bar-field">Speed: 0 KB/s</p>
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
            <p style={{ marginBottom: 16 }}>Pin must be 6 digits or longer!</p>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button onClick={() => setShowModal(false)}>OK</button>
            </div>
          </div>
        </div>
      )}
    </Window98>
  );
}
