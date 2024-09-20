import React, { useState } from "react";

interface FileProps {
  windowTitle: string;
  progress: number;
  onCancel: () => void;
}

const ProgressWindow: React.FC<FileProps> = ({
  windowTitle,
  progress,
  onCancel,
}) => {
  console.log("Progress window has percentage", progress);
  const percentage = progress / 100;
  const loadingSquareCount = Array.from({ length: Math.ceil(percentage * 23) });

  const BlueSquare = () => {
    return <div className="h-4 w-3 bg-blue-800"></div>;
  };

  return (
    <div className="window h-[180px] w-[400px]">
      <div className="title-bar">
        <div className="title-bar-text">{windowTitle}</div>
        <div className="title-bar-controls">
          <button aria-label="Minimize"></button>
          <button aria-label="Maximize"></button>
          <button aria-label="Close"></button>
        </div>
      </div>
      <div className="window-body flex flex-col gap-2">
        <img src="/file-copy.gif" className="-mt-4 w-64"></img>
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
          <button disabled>Done</button>
          <button onClick={onCancel} className="w-16">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProgressWindow;
