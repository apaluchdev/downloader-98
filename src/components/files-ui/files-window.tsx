import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import FileIcon from "./file-icon";

type Props = {
  handleFileDownload: (filename: string) => void;
  handleFileUpload: (files: File[]) => void;
  files: File[];
};

const FilesWindow: React.FC<Props> = (props) => {
  const { files } = props;

  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log(acceptedFiles);
    props.handleFileUpload(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
  });

  return (
    <div className="window min-w-[480px] scroll-smooth">
      <div className="title-bar mb-1">
        <div className="title-bar-text">Files</div>
        <div className="title-bar-controls">
          <button aria-label="Minimize" />
          <button aria-label="Maximize" />
          <button aria-label="Close" />
        </div>
      </div>
      <div
        {...getRootProps()}
        className="!m-0.5 flex max-h-[260px] min-h-[200px] flex-wrap overflow-y-scroll bg-white p-4"
      >
        <div
          className={`${isDragActive ? "border-blue-500 bg-blue-100" : ""} m-2 flex w-full border-2 border-dashed border-gray-300 p-2`}
        >
          {files.length < 1 && (
            <div className="flex w-full items-center justify-center pt-10 text-center">
              <h4 className="pb-12 text-center text-gray-400">
                Drag and drop files
              </h4>
            </div>
          )}
          {files.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2">
              {files.map((file, index) => (
                <FileIcon
                  handleFileDownload={props.handleFileDownload}
                  key={index}
                  file={file}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilesWindow;
