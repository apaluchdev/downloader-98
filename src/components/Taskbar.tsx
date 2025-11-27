import { useState, useEffect } from "react";
import "./Taskbar.css";

export function Taskbar() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${displayHours}:${displayMinutes} ${ampm}`;
  };

  return (
    <div className="taskbar">
      <img src="/start-button.jpg" alt="Start" className="start-button-img" />
      <div className="taskbar-tasks"></div>
      <div className="taskbar-tray">
        <span className="taskbar-time">{formatTime(time)}</span>
      </div>
    </div>
  );
}
