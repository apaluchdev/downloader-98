import type { ReactNode } from "react";
import "./Window98.css";
import { useDraggable } from "../hooks/useDraggable";

interface Window98Props {
  title: string;
  children: ReactNode;
  initialX?: number;
  initialY?: number;
  width?: string | number;
  className?: string;
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
  showMinimize?: boolean;
  showMaximize?: boolean;
  showClose?: boolean;
  isVisible?: boolean;
}

export function Window98({ title, children, initialX = 100, initialY = 100, width, className = "", onClose, onMinimize, onMaximize, showMinimize = true, showMaximize = true, showClose = true, isVisible = true }: Window98Props) {
  const { position, dragRef, handleMouseDown } = useDraggable({ x: initialX, y: initialY });

  if (!isVisible) {
    return null;
  }

  return (
    <div
      ref={dragRef}
      className={`window window98 ${className}`}
      style={{
        position: "absolute",
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: "default",
        width,
      }}
    >
      <div className="title-bar" onMouseDown={handleMouseDown} style={{ cursor: "move" }}>
        <div className="title-bar-text">{title}</div>
        <div className="title-bar-controls">
          {showMinimize && <button aria-label="Minimize" onClick={onMinimize}></button>}
          {showMaximize && <button aria-label="Maximize" onClick={onMaximize}></button>}
          {showClose && <button aria-label="Close" onClick={onClose}></button>}
        </div>
      </div>
      {children}
    </div>
  );
}
