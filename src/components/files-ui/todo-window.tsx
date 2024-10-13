import React, { useState } from "react";
import Window98 from "../ui/window98";

interface FileProps {}

const TodoWindow: React.FC<FileProps> = ({}) => {
  return (
    <Window98 open={true} title="Planned Features">
      <div className="window-body flex flex-col gap-2">
        <input type="checkbox" id="example1" />
        <label htmlFor="example1">Notepad to store/share text</label>
        <input type="checkbox" id="example2" />
        <label htmlFor="example2">Share "desktop" via URL</label>
      </div>
    </Window98>
  );
};

export default TodoWindow;
