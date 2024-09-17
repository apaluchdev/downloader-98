import React, { useState } from "react";

interface FileProps {
  handleFileDownload: (fileName: string) => void;
  file: File;
}

const FileIcon: React.FC<FileProps> = ({ file, handleFileDownload }) => {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(!isClicked); // Toggle the clicked state
  };

  return (
    <div
      onDoubleClick={() => handleFileDownload(file.name)}
      onClick={handleClick}
      className={`flex h-[76px] w-20 cursor-pointer flex-col items-center gap-2 truncate border pt-2 text-center ${isClicked ? "border-blue-700 bg-blue-500" : "border-transparent"} hover:cursor-pointer`}
      title={file.name}
    >
      <img src="file-icon.png" alt="file icon" />
      <h1 className="w-[74px] overflow-hidden text-ellipsis text-xs tracking-wide">
        {file.name}
      </h1>
    </div>
  );
};

export default FileIcon;
