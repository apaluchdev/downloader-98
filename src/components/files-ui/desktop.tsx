import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import UploadWindow from "./primary-window";
import FilesWindow from "./files-window";
import "98.css";
import PinWindow from "./pin-window";
import ProgressWindow from "./progress-window/progress-window";
import UploadBlob from "../../lib/uploader";
import Modal from "../ui/modal";

interface FilesProps {
  // Define any props you need for the component here
}

const Files: React.FC<FilesProps> = () => {
  const [isQueryingFiles, setIsQueryingFiles] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [files, setFiles] = useState<File[]>([]);
  const [pin, setPIN] = useState<string>("1234");
  const abortRef = useRef<(() => void) | null>(null);

  // QUERY
  async function onQueryFiles(pin: string): Promise<void> {
    try {
      setIsQueryingFiles(true);

      const timeout = async (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms));
      await timeout(2000);

      const response = await fetch(
        `http://${process.env.REACT_APP_API_DOMAIN}/file/query/${pin}`,
      ); // TODO make this domain an env variable
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();

      const fileArray = data.blobs.map((fileName: string) => {
        const nameWithoutPath = fileName.split("/").pop() || fileName;
        return new File([new Blob()], nameWithoutPath, { type: "text/plain" });
      });

      setIsQueryingFiles(false);
      setFiles(fileArray);
    } catch (error) {
      console.error("Error querying files:", error);
    }
  }

  // DOWNLOAD
  async function handleFileDownload(fileName: string): Promise<void> {
    try {
      // TODO make this domain an env variable
      const response = await fetch(
        `http://${process.env.REACT_APP_API_DOMAIN}/file/${pin}/${fileName}`,
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      } else if (response.ok) {
        console.log("Download success");
      }

      const blob = await response.blob();
      triggerBrowserDownload(URL.createObjectURL(blob), fileName);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  }

  // UPLOAD
  async function handleFileUpload(files: File[]): Promise<void> {
    setIsUploading(true);
    await UploadBlob(
      files[0],
      pin,
      setUploadProgress,
      () => {
        setIsUploading(false);
        onQueryFiles(pin);
      },
      abortRef,
    );
  }

  async function triggerBrowserDownload(
    url: string,
    fileName: string,
  ): Promise<void> {
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  }

  const handleAbortUpload = () => {
    console.log("Aborting upload...");
    if (abortRef.current) {
      abortRef.current();
      setIsUploading(false);
    }
  };

  const handlePinEntered = () => {
    onQueryFiles(pin);
  };

  useEffect(() => {
    onQueryFiles(pin);
  }, []);

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-8 p-6">
      <div className="flex w-2/3 max-w-4xl flex-col items-center justify-center gap-4 md:flex-row">
        <div className="flex flex-col gap-4">
          <PinWindow pin={pin} handlePinEntered={handlePinEntered} />
          <UploadWindow handleFileUpload={handleFileUpload} />
        </div>

        <div className="md:self-end">
          <FilesWindow
            handleFileDownload={handleFileDownload}
            handleFileUpload={handleFileUpload}
            files={isQueryingFiles ? undefined : files}
          />
        </div>
        <div className="self-end">
          <Modal isOpen={isUploading} onClose={() => setIsUploading(false)}>
            <ProgressWindow
              progress={uploadProgress}
              windowTitle="Uploading - FILENAME"
              onCancel={handleAbortUpload}
            />
          </Modal>
        </div>
      </div>
      <div className="window fixed bottom-0 left-0 flex w-screen items-start">
        <button className="start-button m-0 p-0"></button>
      </div>
    </div>
  );
};

export default Files;
