"use client";

import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { uploadFile } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Paperclip, Upload, X, Loader2 } from "lucide-react";

export function FileUploader() {
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{
    success: boolean;
    error?: string;
    file?: { name: string; size: number; type: string };
  } | null>(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      setFiles(acceptedFiles);
      setUploadStatus(null);
    },
    maxFiles: 1,
  });

  const handleUpload = async () => {
    if (files.length === 0) return;

    setIsUploading(true);
    setUploadStatus(null);

    try {
      const formData = new FormData();
      formData.append("file", files[0]);

      const result = await uploadFile(formData);
      setUploadStatus(result);
    } catch (error) {
      setUploadStatus({
        success: false,
        error: "An error occurred during upload",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const clearFile = () => {
    setFiles([]);
    setUploadStatus(null);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div
        {...getRootProps()}
        className={`p-6 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${
          isDragActive ? "border-primary bg-primary/10" : "border-gray-300"
        }`}
      >
        <input {...getInputProps()} />
        <Paperclip className="h-8 w-8 mx-auto mb-2 text-gray-500" />
        <p className="text-sm text-gray-600">
          {isDragActive
            ? "Drop the file here"
            : "Drag & drop a file here, or click to select"}
        </p>
      </div>

      {files.length > 0 && (
        <div className="mt-4 p-3 bg-gray-100 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 overflow-hidden">
              <Paperclip className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm font-medium truncate">
                {files[0].name}
              </span>
              <span className="text-xs text-gray-500">
                ({(files[0].size / 1024).toFixed(1)} KB)
              </span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                clearFile();
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <Button
            onClick={handleUpload}
            disabled={isUploading}
            className="mt-2 w-full"
            size="sm"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload to 0G Storage
              </>
            )}
          </Button>
        </div>
      )}

      {uploadStatus && (
        <div
          className={`mt-4 p-3 rounded-lg ${
            uploadStatus.success ? "bg-green-100" : "bg-red-100"
          }`}
        >
          {uploadStatus.success ? (
            <p className="text-sm text-green-800">
              Successfully uploaded {uploadStatus.file?.name}
            </p>
          ) : (
            <p className="text-sm text-red-800">
              {uploadStatus.error || "Upload failed"}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
