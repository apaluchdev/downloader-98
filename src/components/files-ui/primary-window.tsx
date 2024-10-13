import { Github } from "lucide-react";
import React, { useCallback, useState } from "react";
import { Button } from "../ui/button";
import { useDropzone } from "react-dropzone";
import Window98 from "../ui/window98";

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
  const { getInputProps, isDragAccept, isDragReject, getRootProps, open } = useDropzone({
    onDrop,
    maxFiles: 1,
    maxSize: 50 * 1024 * 1024,
  });

  const AboutWindow: React.FC = () => {
    if (!isAboutOpen) return null;
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <Window98 open={isAboutOpen} title="About" onClose={() => setIsAboutOpen(false)}>
          <div className="window-body flex flex-col justify-between p-1">
            <div className="mb-2 flex flex-row items-center">
              <h4>Downloader98</h4>
              <img src="/file-icon.png" alt="file icon" className="ml-2 h-10 w-10" />
            </div>
            <p>Easy file transfer between devices. Set a PIN and upload files.</p>
            <p>Download them on another device using the same PIN.</p>
            <p>Files expire after 6 hours.</p>
            <p className="mt-2 font-bold">Do not upload anything you would not want public!</p>
          </div>
        </Window98>
      </div>
    );
  };

  return (
    <Window98 title="File Menu" className="h-full min-w-[180px]">
      <AboutWindow />
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
            <a className="text-black" href="https://www.linkedin.com/in/adrian-paluch-675b32178/">
              <Github size={15} />
            </a>
          </Button>
          <button onClick={() => setIsAboutOpen(true)}>About</button>
        </div>
      </div>
    </Window98>
  );
};

export default PrimaryWindow;
