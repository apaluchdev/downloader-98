import React, { useState } from "react";

interface FileProps {}

const TodoWindow: React.FC<FileProps> = ({}) => {
  return (
    <div className="window">
      <div className="title-bar">
        <div className="title-bar-text">Planned Features</div>
        <div className="title-bar-controls">
          <button aria-label="Minimize"></button>
          <button aria-label="Maximize"></button>
          <button aria-label="Close"></button>
        </div>
      </div>
      <div className="window-body flex flex-col gap-2">
        <input type="checkbox" id="example1" />
        <label htmlFor="example1">Notepad to store/share text</label>
        <input type="checkbox" id="example2" />
        <label htmlFor="example2">Share "desktop" via URL</label>
      </div>
    </div>
  );
};

export default TodoWindow;
