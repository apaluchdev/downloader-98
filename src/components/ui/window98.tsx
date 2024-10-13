import React, { useState } from "react";
import "98.css";

interface Props {
  title: string;
  children: React.ReactNode;
  open?: boolean;
  onClose?: () => void;
  className?: string;
}

const Window98: React.FC<Props> = ({
  children,
  title,
  open,
  onClose,
  className,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(open ?? true);

  const closeWindow = () => {
    setIsOpen(false);

    onClose && onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={`window ${className}`}>
      <div className="title-bar mb-1">
        <div className="title-bar-text">{title}</div>
        <div className="title-bar-controls">
          <button aria-label="Minimize" />
          <button aria-label="Maximize" />
          <button onClick={closeWindow} aria-label="Close" />
        </div>
      </div>
      {children}
    </div>
  );
};

export default Window98;
