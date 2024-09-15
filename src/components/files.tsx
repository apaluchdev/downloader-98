import React, { ChangeEvent, useEffect, useState } from "react";
import UploadWindow from "./upload-window/upload-window";
import FilesWindow from "./files-window/files-window";
import "98.css";
import PinWindow from "./pin-window";

interface FilesProps {
  // Define any props you need for the component here
}

const Files: React.FC<FilesProps> = () => {
  const [files, setFiles] = useState<File[]>([]);

  async function queryFiles(pin: string): Promise<void> {
    try {
      // Replace '/api/your-endpoint' with your actual endpoint
      const response = await fetch(`http://localhost:8080/file/query/${pin}`); // TODO make this domain an env variable
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();

      const fileArray = data.blobs.map((fileName: string) => {
        const nameWithoutPath = fileName.split("/").pop() || fileName;
        return new File([new Blob()], nameWithoutPath, { type: "text/plain" });
      });

      setFiles(fileArray);
    } catch (error) {
      console.error("Error fetching blobs:", error);
    }
  }

  useEffect(() => {
    queryFiles("1234");
  }, []);

  const handleFileUpload = (files: File[]) => {
    files.forEach((file) => {
      console.log(file);
    });
  };

  const downloadBlob = async () => {
    try {
      console.log("Success, download size: ", 1024);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-8 p-6">
      {/* Main windows */}
      <div className="flex w-2/3 max-w-4xl flex-col items-center justify-center gap-4 md:flex-row">
        <UploadWindow onFileUpload={handleFileUpload} />
        <FilesWindow onFileDrop={handleFileUpload} files={files} />
        <PinWindow pin="1234" />
      </div>
      <div>
        <button
          onClick={() => setFiles([...files, new File([""], "fileX.txt")])}
          className="flex items-center text-nowrap px-4"
        >
          DEBUG Add File
        </button>
      </div>
      <div className="window fixed bottom-0 left-0 flex w-screen items-start">
        <button className="start-button m-0 p-0"></button>
      </div>
      <button onClick={downloadBlob}>Download File</button>
    </div>
  );
};

export default Files;
