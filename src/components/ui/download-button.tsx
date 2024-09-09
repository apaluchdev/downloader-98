"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { Button } from "./button";

export function DownloadButton({ fileUrl = "https://example.com/sample.pdf", fileName = "sample.pdf" }) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Button onClick={handleDownload} disabled={isDownloading} className="flex items-center space-x-2">
      <Download className="h-4 w-4" />
      <span>{isDownloading ? "Downloading..." : "Download File"}</span>
    </Button>
  );
}
