import React, { useState } from "react";

interface PinWindowProps {
  pin: string;
  handlePinEntered: (text: string) => void; // Callback function passed via props
}

const PinWindow: React.FC<PinWindowProps> = ({ pin, handlePinEntered }) => {
  const [inputValue, setInputValue] = useState("1234"); // State to store input value

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value); // Update the state with the current input value
  };

  const handleSubmit = () => {
    handlePinEntered(inputValue); // Call the provided callback with the current input value
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
