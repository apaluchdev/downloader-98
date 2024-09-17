import { Github } from "lucide-react";
import React, { useCallback } from "react";
import { Button } from "../ui/button";
import { useDropzone } from "react-dropzone";

type Props = {
  handleFileUpload: (files: File[]) => void;
};

const UploadWindow: React.FC<Props> = (props) => {
  const { handleFileUpload } = props;
  const onDrop = useCallback((acceptedFiles: File[]) => {
    handleFileUpload(acceptedFiles);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    maxSize: 50 * 1024 * 1024,
  });

  return (
    <div className="window h-full min-w-[180px]">
      <div className="title-bar">
        {/* TODO - Create an error window if no file is selected */}
        <div className="title-bar-text">Upload File</div>
        <div className="title-bar-controls">
          <button aria-label="Minimize" />
          <button aria-label="Maximize" />
          <button aria-label="Close" />
        </div>
      </div>
      <div className="window-body flex h-[85%] flex-col justify-between gap-4 p-4">
        <div className="flex scale-110 flex-col gap-4 font-semibold">
          <button>Download</button>
          <button {...getRootProps()}>Upload</button>
        </div>
        <div className="flex scale-110 flex-col gap-4 font-semibold">
          <Button className="self-center bg-transparent text-black hover:bg-transparent">
            <Github />
          </Button>
          <button>About</button>
        </div>
      </div>
    </div>
  );
};

export default UploadWindow;
