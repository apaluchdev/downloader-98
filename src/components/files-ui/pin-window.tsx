import React from "react";

interface PinWindowProps {
  pin: string;
}

const PinWindow: React.FC<PinWindowProps> = ({ pin }) => {
  return (
    <div className="window w-[200px]">
      <div className="title-bar">
        <div className="title-bar-text">PIN</div>
        <div className="title-bar-controls">
          <button aria-label="Minimize"></button>
          <button aria-label="Maximize"></button>
          <button aria-label="Close"></button>
        </div>
      </div>
      <div className="window-body flex gap-2">
        <label htmlFor="pin">PIN</label>
        <input className="w-16" id="pin" type="text" defaultValue="1234" />
        <button>Connect</button>
      </div>
    </div>
  );
};

export default PinWindow;
