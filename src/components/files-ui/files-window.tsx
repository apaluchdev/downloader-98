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
  const { files } = props;

  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log(acceptedFiles);
    props.handleFileUpload(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
  });

  if (files == undefined)
    return (
      <div className="window min-w-[200px] max-w-[200px] scroll-smooth md:max-w-[600px]">
        <div className="title-bar mb-1">
          <div className="title-bar-text">Files</div>
          <div className="title-bar-controls">
            <button aria-label="Minimize" />
            <button aria-label="Maximize" />
            <button aria-label="Close" />
          </div>
        </div>
        <div className="!m-0.5 flex max-h-[260px] min-h-[220px] w-full items-center justify-center bg-white p-4 md:min-h-[280px]">
          <img src="/torch-folder.gif" className="w-20"></img>
        </div>
      </div>
    );

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
        {...getRootProps()}
        className="!m-0.5 flex max-h-[260px] min-h-[220px] flex-wrap overflow-y-scroll bg-white p-4 md:min-h-[280px]"
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
                  handleFileClick={props.handleFileClick}
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
