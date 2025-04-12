"use client";

import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Paperclip, X, Upload, FileUp, Loader2 } from "lucide-react";
import { uploadFile } from "@/lib/actions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

export function FileUploadDialog() {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [open, setOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResults, setUploadResults] = useState<
    {
      success: boolean;
      error?: string;
      file?: { name: string; size: number; type: string };
    }[]
  >([]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: true,
    maxFiles: 5,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif"],
      "application/pdf": [".pdf"],
      "application/msword": [".doc", ".docx"],
      "application/vnd.ms-excel": [".xls", ".xlsx"],
      "text/plain": [".txt"],
    },
    onDrop: (acceptedFiles) => {
      setUploadedFiles([...uploadedFiles, ...acceptedFiles]);
      setUploadResults([]);
    },
  });

  const removeFile = (index: number) => {
    const newFiles = [...uploadedFiles];
    newFiles.splice(index, 1);
    setUploadedFiles(newFiles);
  };

  const handleSubmit = async () => {
    if (uploadedFiles.length === 0) return;

    setIsUploading(true);
    setUploadResults([]);

    const results = [];

    // Upload each file sequentially
    for (const file of uploadedFiles) {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const result = await uploadFile(formData);
        results.push(result);
      } catch (error) {
        console.error(error);
        results.push({
          success: false,
          error: "An error occurred during upload",
        });
      }
    }

    setUploadResults(results);
    setIsUploading(false);

    // Only clear files and close dialog if all uploads were successful
    if (results.every((result) => result.success)) {
      setTimeout(() => {
        setOpen(false);
        setUploadedFiles([]);
        setUploadResults([]);
      }, 2000);
    }
  };

  // Calculate overall upload status
  const allSuccess =
    uploadResults.length > 0 && uploadResults.every((result) => result.success);
  const anyFailed = uploadResults.some((result) => !result.success);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="cursor-pointer flex gap-2 items-center"
        >
          <FileUp className="h-4 w-4" />
          <span>Upload Records</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Files to 0G Storage</DialogTitle>
        </DialogHeader>
        <div
          {...getRootProps()}
          className="relative border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer"
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <div className="text-center text-primary">
              <p className="font-medium">Drop files here</p>
            </div>
          ) : (
            <div className="text-center text-muted-foreground">
              <Upload className="h-8 w-8 mx-auto mb-2" />
              <p>Drag & drop files here or click to browse</p>
              <p className="text-xs mt-1">
                Supports: Images, PDFs, Word, Excel, and text files
              </p>
            </div>
          )}
        </div>

        {uploadedFiles.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Selected Files</h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {uploadedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-muted rounded-md p-2 text-sm"
                >
                  <div className="flex items-center gap-2 truncate">
                    <Paperclip className="h-4 w-4 text-muted-foreground" />
                    <span className="truncate max-w-[220px]">{file.name}</span>
                    {uploadResults[index] && (
                      <span
                        className={
                          uploadResults[index].success
                            ? "text-green-500"
                            : "text-red-500"
                        }
                      >
                        {uploadResults[index].success ? "✓" : "✗"}
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                    className="text-muted-foreground hover:text-foreground"
                    disabled={isUploading}
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Remove file</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {uploadResults.length > 0 && (
          <div
            className={`mt-4 p-3 rounded-lg ${
              allSuccess ? "bg-green-100" : anyFailed ? "bg-red-100" : ""
            }`}
          >
            {allSuccess ? (
              <p className="text-sm text-green-800">
                Successfully uploaded all files to 0G storage
              </p>
            ) : (
              <p className="text-sm text-red-800">
                Some files failed to upload. Please try again.
              </p>
            )}
          </div>
        )}

        <DialogFooter className="mt-4">
          <Button
            variant="outline"
            onClick={() => {
              setOpen(false);
              setUploadedFiles([]);
              setUploadResults([]);
            }}
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={uploadedFiles.length === 0 || isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload to 0G{" "}
                {uploadedFiles.length > 0 && `(${uploadedFiles.length})`}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
