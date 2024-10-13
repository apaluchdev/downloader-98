import React, { useState } from "react";
import Window98 from "../ui/window98";

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
    <Window98 title="PIN" className="w-[200px]">
      <div className="window-body flex gap-2">
        <label htmlFor="pin">PIN</label>
        <input className="w-16 tracking-widest" id="pin" type="text" value={inputValue} onChange={handleChange} />
        <button onClick={handleSubmit}>Connect</button>
      </div>
    </Window98>
  );
};

export default PinWindow;
