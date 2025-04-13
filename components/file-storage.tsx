"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Paperclip, Upload, Download, X } from "lucide-react";

interface FileReference {
  rootHash: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  transactionHash: string;
}

export function FileStorage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<FileReference[]>([]);
  const [rootHashToDownload, setRootHashToDownload] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch("/api/storage/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      setUploadedFiles((prev) => [
        ...prev,
        {
          rootHash: result.rootHash,
          fileName: result.fileName,
          fileSize: result.fileSize,
          mimeType: result.mimeType,
          transactionHash: result.transactionHash,
        },
      ]);
      setSelectedFile(null);
    } catch (error) {
      console.error("Error uploading to 0G storage:", error);
      alert("Failed to upload file. See console for details.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = async (rootHash: string) => {
    try {
      window.open(`/api/storage/download/${rootHash}`, "_blank");
    } catch (error) {
      console.error("Error downloading from 0G storage:", error);
      alert("Failed to download file. See console for details.");
    }
  };

  return (
    <div className="p-6 space-y-6 border rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold">0G Decentralized Storage</h2>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Upload File</h3>

        <div className="flex gap-2">
          <Input
            type="file"
            onChange={handleFileChange}
            className="flex-1"
            disabled={isUploading}
          />
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
          >
            {isUploading ? "Uploading..." : "Upload to 0G"}
            <Upload className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {selectedFile && (
          <div className="text-sm flex items-center gap-2 p-2 border rounded-md bg-background">
            <Paperclip className="h-4 w-4" />
            <span>{selectedFile.name}</span>
            <span className="text-muted-foreground">
              ({(selectedFile.size / 1024).toFixed(1)} KB)
            </span>
            <Button
              size="icon"
              variant="ghost"
              className="h-5 w-5 ml-auto"
              onClick={() => setSelectedFile(null)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>

      <div className="border-t pt-4 space-y-4">
        <h3 className="text-lg font-medium">Uploaded Files</h3>

        {uploadedFiles.length > 0 ? (
          <div className="space-y-2">
            {uploadedFiles.map((file) => (
              <div
                key={file.rootHash}
                className="flex items-center p-3 border rounded-md bg-background"
              >
                <div className="flex-1">
                  <div className="font-medium">{file.fileName}</div>
                  <div className="text-xs text-muted-foreground">
                    Root hash: {file.rootHash.substring(0, 16)}...
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Size: {(file.fileSize / 1024).toFixed(1)} KB
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDownload(file.rootHash)}
                >
                  Download
                  <Download className="ml-1 h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-8 text-muted-foreground border border-dashed rounded-md">
            No files uploaded yet
          </div>
        )}
      </div>

      <div className="border-t pt-4 space-y-4">
        <h3 className="text-lg font-medium">Download by Root Hash</h3>

        <div className="flex gap-2">
          <Input
            placeholder="Enter root hash..."
            value={rootHashToDownload}
            onChange={(e) => setRootHashToDownload(e.target.value)}
            className="flex-1"
          />
          <Button
            onClick={() => handleDownload(rootHashToDownload)}
            disabled={!rootHashToDownload.trim()}
          >
            Download
            <Download className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
