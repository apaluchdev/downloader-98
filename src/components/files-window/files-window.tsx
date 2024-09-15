import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

type Props = {
  onFileDrop: (files: File[]) => void;
  files: File[];
};

// TODO - Turn this into it's own component. Change the icon depending on the file extension
const FileItem: React.FC<{ file: File }> = ({ file }) => {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(!isClicked); // Toggle the clicked state
  };

  return (
    <div
      onClick={handleClick}
      className={`flex h-[75px] w-20 cursor-pointer flex-col items-center gap-2 truncate border pt-2 text-center ${isClicked ? "border-blue-700 bg-blue-400" : "border-transparent"} hover:cursor-pointer`}
      title={file.name}
    >
      <img src="file-icon.png" alt="file icon" />
      <h1 className="w-[74px] overflow-hidden text-ellipsis text-xs tracking-wide">
        {file.name}
      </h1>
    </div>
  );
};

const FilesWindow: React.FC<Props> = (props) => {
  const { files } = props;

  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log(acceptedFiles);
    // Handle the files here (e.g., upload or display)
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
  });

  return (
    <div className="window min-w-[400px] scroll-smooth">
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
                <FileItem key={index} file={file} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilesWindow;
