import React, { ChangeEvent, useEffect, useState } from "react";
import UploadWindow from "./upload-window";
import FilesWindow from "./files-window";
import "98.css";
import PinWindow from "./pin-window";

interface FilesProps {
  // Define any props you need for the component here
}

const Files: React.FC<FilesProps> = () => {
  const [isQueryingFiles, setIsQueryingFiles] = useState<boolean>(false);
  const [files, setFiles] = useState<File[]>([]);
  const [pin, setPIN] = useState<string>("1234");

  // QUERY
  async function onQueryFiles(pin: string): Promise<void> {
    try {
      // TODO - Add a win-98 loading spinner
      setIsQueryingFiles(true);

      const timeout = async (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms));
      await timeout(2000);
      // Replace '/api/your-endpoint' with your actual endpoint
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
    console.log("Uploading file", files[0].name);
    const formData = new FormData();
    formData.append("file", files[0]);
    formData.append("filename", files[0].name);
    formData.append("pin", pin);

    try {
      const response = await fetch(
        `http://${process.env.REACT_APP_API_DOMAIN}/file`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (response.ok) {
        console.log("File uploaded successfully");
      } else {
        console.error("File upload failed");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
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

  useEffect(() => {
    onQueryFiles(pin);
  }, []);

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-8 p-6">
      <div className="flex w-2/3 max-w-4xl flex-col items-center justify-center gap-4 md:flex-row">
        <div className="flex flex-col gap-4">
          <PinWindow pin={pin} />
          <UploadWindow handleFileUpload={handleFileUpload} />
        </div>

        <div className="self-end">
          <FilesWindow
            handleFileDownload={handleFileDownload}
            handleFileUpload={handleFileUpload}
            files={files}
          />{" "}
        </div>
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
      <button onClick={async () => await handleFileDownload("flashcard.png")}>
        Download File
      </button>
    </div>
  );
};

export default Files;
