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
  isMobile?: boolean;
}

export function Window98({ title, children, initialX = 100, initialY = 100, width, className = "", onClose, onMinimize, onMaximize, showMinimize = true, showMaximize = true, showClose = true, isVisible = true, isMobile = false }: Window98Props) {
  const { position, dragRef, handleMouseDown } = useDraggable({ x: initialX, y: initialY });

  if (!isVisible) {
    return null;
  }

  return (
    <div
      ref={dragRef}
      className={`window window98 ${className} ${isMobile ? "mobile-window" : ""}`}
      style={{
        position: isMobile ? "relative" : "absolute",
        left: isMobile ? "auto" : `${position.x}px`,
        top: isMobile ? "auto" : `${position.y}px`,
        cursor: "default",
        width,
        margin: isMobile ? "10px auto" : "0",
      }}
    >
      <div className="title-bar" onMouseDown={isMobile ? undefined : handleMouseDown} style={{ cursor: isMobile ? "default" : "move" }}>
        <div className="title-bar-text">{title}</div>
        <div className="title-bar-controls">
          {showMinimize && !isMobile && <button aria-label="Minimize" onClick={onMinimize}></button>}
          {showMaximize && !isMobile && <button aria-label="Maximize" onClick={onMaximize}></button>}
          {showClose && !isMobile && <button aria-label="Close" onClick={onClose}></button>}
        </div>
      </div>
      {children}
    </div>
  );
}
