import { Github } from "lucide-react";
import React, { useCallback, useState } from "react";
import { Button } from "../ui/button";
import { useDropzone } from "react-dropzone";
import Modal from "../ui/modal";

type Props = {
  handleFileUpload: (files: File[]) => void;
  handleFileDownload: () => void;
  isFileSelected: boolean;
};

const PrimaryWindow: React.FC<Props> = (props) => {
  const { handleFileUpload, handleFileDownload } = props;
  const [isAboutOpen, setIsAboutOpen] = useState<boolean>(false);
  const onDrop = useCallback((acceptedFiles: File[]) => {
    handleFileUpload(acceptedFiles);
  }, []);
  const { getInputProps, isDragAccept, isDragReject, getRootProps, open } =
    useDropzone({
      onDrop,
      maxFiles: 1,
      maxSize: 50 * 1024 * 1024,
    });

  return (
    <div className="window h-full min-w-[180px]">
      <div className="absolute flex">
        <Modal isOpen={isAboutOpen} onClose={() => console.log("hi")}>
          <div className="window h-full min-w-[180px]">
            <div className="title-bar">
              {/* TODO - Create an error window if no file is selected */}
              <div className="title-bar-text">About</div>
              <div className="title-bar-controls">
                <button aria-label="Minimize" />
                <button aria-label="Maximize" />
                <button
                  onClick={() => setIsAboutOpen(false)}
                  aria-label="Close"
                />
              </div>
            </div>
            <div className="window-body flex h-[85%] flex-col justify-between p-4">
              <p>
                Easy file transfer between devices. Set a PIN and upload files.
              </p>
              <p>Download them on another device using the same PIN.</p>
              <p>Files expire after 6 hours.</p>
            </div>
          </div>
        </Modal>
      </div>

      <div className="title-bar">
        {/* TODO - Create an error window if no file is selected */}
        <div className="title-bar-text">File Menu</div>
        <div className="title-bar-controls">
          <button aria-label="Minimize" />
          <button aria-label="Maximize" />
          <button aria-label="Close" />
        </div>
      </div>
      <div className="window-body flex h-[85%] flex-col justify-between gap-6 p-4">
        <div className="flex scale-110 flex-col gap-2 font-semibold">
          <button onClick={handleFileDownload} disabled={!props.isFileSelected}>
            Download
          </button>
          <button {...getRootProps({})} onClick={open}>
            <input {...getInputProps()} />
            <p>Upload</p>
          </button>
        </div>
        {/* TODO - Hide these two on mobile */}
        <div className="flex scale-110 flex-col gap-2 font-semibold">
          <Button className="h-5 w-full self-center rounded-none bg-transparent text-black hover:bg-transparent">
            <a
              className="text-black"
              href="https://www.linkedin.com/in/adrian-paluch-675b32178/"
            >
              <Github size={15} />
            </a>
          </Button>
          <button onClick={() => setIsAboutOpen(true)}>About</button>
        </div>
      </div>
    </div>
  );
};

export default PrimaryWindow;
