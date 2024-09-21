import React, { useState } from "react";

interface FileProps {
  windowTitle: string;
  progress: number;
  onCancel: () => void;
  onDone: () => void;
}

const ProgressWindow: React.FC<FileProps> = ({
  windowTitle,
  progress,
  onCancel,
  onDone,
}) => {
  const percentage = progress / 100;
  const loadingSquareCount = Array.from({ length: Math.ceil(percentage * 23) });

  const BlueSquare = () => {
    return <div className="h-4 w-3 bg-blue-800"></div>;
  };

  return (
    <div className="window h-[200px] w-[400px]">
      <div className="title-bar">
        <div className="title-bar-text">{windowTitle}</div>
        <div className="title-bar-controls">
          <button aria-label="Minimize"></button>
          <button aria-label="Maximize"></button>
          <button onClick={onCancel} aria-label="Close"></button>
        </div>
      </div>
      <div className="window-body flex flex-col gap-2">
        {progress < 100 && <img src="/file-copy.gif" className="w-64"></img>}
        {progress == 100 && (
          <img src="/checkmark.png" className="ml-2 w-8 pt-6"></img>
        )}
        <div className="flex h-6 flex-col gap-2">
          <p>Uploading... {progress}%</p>

          <ul className="tree-view !bg-[var(--win-98)]">
            <div className="flex h-4 gap-1">
              {loadingSquareCount.map((_, index) => (
                <BlueSquare key={index} />
              ))}
            </div>
          </ul>
        </div>
        <div className="mt-8 flex gap-2 self-end font-semibold">
          <button disabled={progress != 100} onClick={onDone}>
            Done
          </button>
          <button onClick={onCancel} className="w-16">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProgressWindow;
