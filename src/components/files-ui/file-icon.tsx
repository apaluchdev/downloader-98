import FileExtended from "@/lib/file-extended";
import React, { useState } from "react";

interface FileProps {
  handleFileDownload: (fileName: string) => void;
  handleFileClick: (fileName: string) => void;
  file: FileExtended;
}

const FileIcon: React.FC<FileProps> = ({ file, handleFileDownload, handleFileClick }) => {
  return (
    <div
      onDoubleClick={() => {
        handleFileDownload(file.name);
        handleFileClick(file.name);
      }}
      onClick={() => handleFileClick(file.name)}
      className={`flex h-[76px] w-20 cursor-pointer select-none flex-col items-center gap-2 truncate border pt-2 text-center ${file.IsClicked ? "border-blue-700 bg-blue-500" : "border-transparent"} hover:cursor-pointer`}
      title={file.name}
    >
      <img src="file-icon.png" alt="file icon" />
      <h1 className="w-[74px] overflow-hidden text-ellipsis text-xs tracking-wide">{file.name}</h1>
    </div>
  );
};

export default FileIcon;
