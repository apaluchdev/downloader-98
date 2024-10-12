import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import FileIcon from "./file-icon";
import FileExtended from "@/lib/file-extended";

type Props = {
  handleFileDownload: (filename: string) => void;
  handleFileUpload: (files: File[]) => void;
  handleFileClick: (filename: string) => void;
  files: FileExtended[] | undefined;
};

const FilesWindow: React.FC<Props> = (props) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log(acceptedFiles);
    props.handleFileUpload(acceptedFiles);
  }, []);

  const { getRootProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    maxSize: 50 * 1024 * 1024,
    noClick: true, // Need to allow users to click the file icons without prompting another upload
  });

  // Ensure the entire display area, including the FileDisplay component, is wrapped in getRootProps
  return (
    <div className="window scroll-smooth md:max-w-[600px]">
      <div className="title-bar mb-1">
        <div className="title-bar-text">Files</div>
        <div className="title-bar-controls">
          <button aria-label="Minimize" />
          <button aria-label="Maximize" />
          <button aria-label="Close" />
        </div>
      </div>
      <div
        {...getRootProps()} // Ensure this wraps the file display
        className={`!m-0.5 flex max-h-[260px] min-h-[220px] flex-wrap overflow-y-scroll bg-white p-4 md:min-h-[280px]`}
      >
        <div
          className={`m-2 flex w-full border-2 border-dashed border-gray-300 p-2 ${
            isDragActive ? "border-blue-500 bg-blue-100" : ""
          }`}
        >
          <FileDisplay {...props} /> {/* Pass necessary props */}
        </div>
      </div>
    </div>
  );
};

// Child component remains as is, rendering the files
const FileDisplay: React.FC<Props> = ({
  files,
  handleFileDownload,
  handleFileClick,
}) => {
  if (files === undefined) {
    return (
      <div className="flex w-full items-center justify-center">
        <img src="/torch-folder.gif" className="w-20" />
      </div>
    );
  }

  if (files.length < 1) {
    return (
      <h4 className="flex w-full items-center justify-center text-gray-400">
        Drag and drop files
      </h4>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-2">
      {files.map((file, index) => (
        <FileIcon
          handleFileDownload={handleFileDownload}
          key={index}
          file={file}
          handleFileClick={handleFileClick}
        />
      ))}
    </div>
  );
};

export default FilesWindow;
