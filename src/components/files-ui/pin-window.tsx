import React, { useState } from "react";

interface PinWindowProps {
  pin: string;
  setPIN: (text: string) => void;
}

const PinWindow: React.FC<PinWindowProps> = ({ pin, setPIN }) => {
  const [inputValue, setInputValue] = useState(pin); // State to store input value

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value); // Update the state with the current input value
  };

  const handleSubmit = () => {
    setPIN(inputValue);
  };

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
        <input
          className="w-16"
          id="pin"
          type="text"
          value={inputValue}
          onChange={handleChange}
        />
        <button onClick={handleSubmit}>Connect</button>
      </div>
    </div>
  );
};

export default PinWindow;
