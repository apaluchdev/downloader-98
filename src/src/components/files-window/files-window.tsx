import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

type Props = {
  // Define your component props here
};

const FileItem: React.FC<{ file: string }> = ({ file }) => {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(!isClicked); // Toggle the clicked state
  };

  return (
    <div
      className={`flex cursor-pointer flex-col items-center gap-2 border-2 p-2 ${isClicked ? "border-blue-700 bg-blue-500" : "border-transparent"} hover:cursor-pointer`}
      onClick={handleClick}
    >
      <img src="file-icon.png" alt="file icon" />
      <p className="select-none text-lg">{file}</p>
    </div>
  );
};

const FilesWindow: React.FC<Props> = (props) => {
  const [files, setFiles] = React.useState<string[]>([
    "file1.txt",
    "file2.txt",
    "file3.txt",
    "file4.txt",
    "file5.txt",
    "file5.txt",
    "file5.txt",
    "file5.txt",
    "file5.txt",
    "file5.txt",
    "file5.txt",
    "file5.txt",
    "file5.txt",
    "file5.txt",
    "file5.txt",
    "file5.txt",
    "file5.txt",
    "file5.txt",
    "file5.txt",
  ]);

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
        {!files && (
          <h4 className="pb-12 text-center text-gray-400">
            Drag and drop files here
          </h4>
        )}
        {files && (
          <div className="flex flex-wrap gap-2">
            {files.map((file, index) => (
              <FileItem key={index} file={file} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FilesWindow;
