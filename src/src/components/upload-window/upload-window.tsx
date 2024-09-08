import React from "react";

type Props = {
  // Define your component props here
};

const UploadWindow: React.FC<Props> = (props) => {
  // Component logic goes here

  return (
    <div className="window h-full min-w-[180px]">
      <div className="title-bar">
        <div className="title-bar-text">Upload File</div>
        <div className="title-bar-controls">
          <button aria-label="Minimize" />
          <button aria-label="Maximize" />
          <button aria-label="Close" />
        </div>
      </div>
      <div className="window-body p-4">
        <button className="scale-125 font-semibold">Upload</button>
      </div>
    </div>
  );
};

export default UploadWindow;
