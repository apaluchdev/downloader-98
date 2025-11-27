import type React from "react";
import { Window98 } from "./Window98";
import "./ProgressWindow.css";

interface FileProps {
  windowTitle: string;
  progress: number;
  onCancel: () => void;
  onDone: () => void;
  onClose?: () => void;
  isVisible?: boolean;
}

const ProgressWindow: React.FC<FileProps> = ({ windowTitle, progress, onClose, isVisible = true }) => {
  const percentage = Math.min(Math.max(progress, 0), 100);
  const loadingSquareCount = Array.from({ length: Math.ceil((percentage / 100) * 23) });

  const BlueSquare = () => {
    return <div className="h-4 w-3 bg-blue-900" />;
  };

  return (
    <Window98 title={windowTitle} onClose={onClose} initialX={200} initialY={180} className="progress-window" isVisible={isVisible}>
      <div className="window-body progress-window-body">
        {progress < 100 && <img src="/file-copy.gif" className="w-64" alt="Copy" />}
        {progress === 100 && <img src="/checkmark.png" className="ml-2 w-8 pt-6" alt="Done" />}
        <div className="flex h-6 flex-col gap-2">
          <p>Uploading... {percentage}%</p>
          <ul className="tree-view bg-(--win-98)">
            <div className="flex h-4 gap-1">
              {loadingSquareCount.map((_, index) => (
                <BlueSquare key={index} />
              ))}
            </div>
          </ul>
        </div>
        {/* <div className="mt-8 flex gap-2 self-end font-semibold">
          <button disabled={percentage !== 100} onClick={onDone}>
            Done
          </button>
          <button onClick={onCancel} className="w-16">
            Cancel
          </button>
        </div> */}
      </div>
    </Window98>
  );
};

export default ProgressWindow;
