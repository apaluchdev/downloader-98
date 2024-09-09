import React, { useEffect, useState } from "react";
import UploadWindow from "./upload-window/upload-window";
import FilesWindow from "./files-window/files-window";

interface FilesProps {
  // Define any props you need for the component here
}

const Files: React.FC<FilesProps> = () => {
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    const mockFiles = [
      new File([""], "file1.txt"),
      new File([""], "file2.txt"),
    ];
    setFiles(mockFiles);
    return () => {
      console.log("Component unmounted");
    };
  }, []); // Add any dependencies inside the array if needed

  const handleFileUpload = (files: File[]) => {
    files.forEach((file) => {
      console.log(file);
    });
  };

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-8 p-6">
      {/* Main windows */}
      <div className="flex w-2/3 max-w-4xl flex-col items-center justify-center gap-4 md:flex-row">
        <UploadWindow onFileUpload={handleFileUpload} />
        <FilesWindow onFileDrop={handleFileUpload} files={files} />
      </div>
      <div>
        <button
          onClick={() => setFiles([...files, new File([""], "fileX.txt")])}
          className="flex items-center text-nowrap px-4 font-semibold"
        >
          DEBUG Add File
        </button>
      </div>
      <div className="window fixed bottom-0 left-0 flex w-screen items-start">
        <button className="start-button m-0 p-0"></button>
      </div>
    </div>
  );
};

export default Files;
