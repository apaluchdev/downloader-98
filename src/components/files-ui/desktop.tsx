import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import FilesWindow from "./files-window";
import "98.css";
import PinWindow from "./pin-window";
import ProgressWindow from "./progress-window/progress-window";
import UploadBlob from "../../lib/uploader";
import Modal from "../ui/modal";
import PrimaryWindow from "./primary-window";
import FileExtended from "@/lib/file-extended";
import TodoWindow from "./todo-window";

interface FilesProps {
  // Define any props you need for the component here
}

const Files: React.FC<FilesProps> = () => {
  const [isQueryingFiles, setIsQueryingFiles] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [files, setFiles] = useState<FileExtended[]>([]);
  const [pin, setPIN] = useState<string>(
    Math.floor(10000 + Math.random() * 90000).toString(),
  ); // Random 5 digit PIN
  const pinRef = useRef<string | null>(null);
  const abortRef = useRef<(() => void) | null>(null);

  // QUERY
  async function onQueryFiles(pin: string): Promise<void> {
    try {
      setIsQueryingFiles(true);
      console.log("Querying files for pin:", pin);
      const response = await fetch(
        `${process.env.REACT_APP_API_DOMAIN}/file/query/${pin}`,
      ); // TODO make this domain an env variable
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();

      if (!data.blobs) {
        setIsQueryingFiles(false);
        setFiles([]);
        return;
      }

      const fileArray: FileExtended[] = data.blobs.map((fileName: string) => {
        const nameWithoutPath = fileName.split("/").pop() || fileName;
        return new File([new Blob()], nameWithoutPath, { type: "text/plain" });
      });

      fileArray.forEach((file) => {
        file.IsClicked = false;
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
        `${process.env.REACT_APP_API_DOMAIN}/file/${pin}/${fileName}`,
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
    console.log("Uploading file using pin", pinRef.current);
    await UploadBlob(
      files[0],
      pinRef.current ?? "",
      setUploadProgress,
      () => {
        //setIsUploading(false);
        onQueryFiles(pinRef.current ?? "");
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
    }
    setIsUploading(false);
  };

  const handleFileClicked = (filename: string) => {
    const newFiles = files.map((file) => {
      if (file.name === filename) {
        file.IsClicked = !file.IsClicked;
      } else {
        file.IsClicked = false;
      }
      return file;
    });

    setFiles(newFiles);
  };

  useEffect(() => {
    console.log("PIN updated:", pin);
    pinRef.current = pin;
    onQueryFiles(pin);
  }, [pin]);

  return (
    <div className="flex h-screen w-screen flex-col items-center gap-8 p-6">
      <div className="window mb-8 hidden p-4 md:block">
        <div className="title-bar mb-1">
          <div className="title-bar-text">Welcome to</div>
          <div className="title-bar-controls">
            <button aria-label="Minimize" />
            <button aria-label="Maximize" />
            <button aria-label="Close" />
          </div>
        </div>
        <h1 className="p-4 text-6xl">Downloader98</h1>
      </div>
      <h1 className="window w-32 scale-125 text-center text-xl font-semibold">
        Current PIN: {pin}
      </h1>
      <div
        id="container-primary"
        className="flex w-3/4 max-w-4xl flex-col items-center justify-center gap-4 md:flex-row"
      >
        <div className="flex-2 flex flex-col gap-4">
          <div className="hidden md:block">
            <TodoWindow />
          </div>
          <PinWindow pin={pin} setPIN={setPIN} />
          <PrimaryWindow
            handleFileUpload={handleFileUpload}
            handleFileDownload={() =>
              files.filter((x) => x.IsClicked).length > 0 &&
              handleFileDownload(files.filter((x) => x.IsClicked)[0].name)
            }
            isFileSelected={files.filter((x) => x.IsClicked).length == 1}
          />
        </div>

        <div className="w-full flex-1 md:self-end">
          <FilesWindow
            handleFileDownload={handleFileDownload}
            handleFileUpload={handleFileUpload}
            handleFileClick={(filename: string) => handleFileClicked(filename)}
            files={isQueryingFiles ? undefined : files}
          />
        </div>
        <div className="self-end">
          <Modal isOpen={isUploading} onClose={() => setIsUploading(false)}>
            <ProgressWindow
              progress={uploadProgress}
              windowTitle="Uploading"
              onCancel={handleAbortUpload}
              onDone={() => setIsUploading(false)}
            />
          </Modal>
        </div>
      </div>
      <div className="fixed bottom-16 right-12 flex w-10 items-end opacity-0 md:opacity-100">
        <div className="flex flex-col gap-2">
          <img src="/recycle_bin_full-2.png" className=""></img>
          <p className="text-center text-white">Recycle Bin</p>
        </div>
      </div>
      <div className="window fixed bottom-0 left-0 flex w-screen">
        <button className="start-button m-0 p-0"></button>
      </div>
    </div>
  );
};

export default Files;
