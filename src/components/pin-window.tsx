import React from "react";

interface PinWindowProps {
  pin: string;
}

const PinWindow: React.FC<PinWindowProps> = ({ pin }) => {
  return (
    <div className="window w-[300px]">
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
        <input id="pin" type="text" value="1234" />
      </div>
    </div>
  );
};

export default PinWindow;
