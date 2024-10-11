async function UploadBlob(
  file: File,
  pin: string,
  onUploadProgress: (progress: number) => void,
  onUploadEnd: () => void,
  abortRef: React.MutableRefObject<(() => void) | null>,
): Promise<void> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("filename", file.name);
  formData.append("pin", pin);

  try {
    const xhr = new XMLHttpRequest();

    xhr.open("POST", `${process.env.REACT_APP_API_DOMAIN}/file`, true);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentCompleted = Math.round((event.loaded * 100) / event.total);
        onUploadProgress(percentCompleted);
      }
    };

    abortRef.current = () => xhr.abort();

    xhr.onloadstart = async () => {
      onUploadProgress(0);
    };

    xhr.onloadend = () => {
      onUploadProgress(100);
      onUploadEnd();
    };

    xhr.send(formData);
  } catch (error) {
    console.error("Error uploading file:", error);
  }
}

export default UploadBlob;
