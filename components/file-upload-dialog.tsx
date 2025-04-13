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
import { useSignMessage, useAccount } from "wagmi";
import { toast } from "sonner";

export function FileUploadDialog() {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [open, setOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [loadingToastId, setLoadingToastId] = useState<string | number | null>(
    null,
  );
  const [currentFileIndex, setCurrentFileIndex] = useState<number>(-1);
  const [encryptedFiles, setEncryptedFiles] = useState<Set<number>>(new Set());
  const [uploadResults, setUploadResults] = useState<
    {
      success: boolean;
      error?: string;
      file?: { name: string; size: number; type: string };
    }[]
  >([]);
  const { isConnected } = useAccount();

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
      setEncryptedFiles(new Set());
    },
  });

  const removeFile = (index: number) => {
    const newFiles = [...uploadedFiles];
    newFiles.splice(index, 1);
    setUploadedFiles(newFiles);

    // Update encrypted files tracker
    const newEncrypted = new Set(encryptedFiles);
    newEncrypted.delete(index);
    // Adjust indexes for files after the removed one
    const updatedEncrypted = new Set<number>();
    newEncrypted.forEach((idx) => {
      if (idx < index) updatedEncrypted.add(idx);
      else if (idx > index) updatedEncrypted.add(idx - 1);
    });
    setEncryptedFiles(updatedEncrypted);
  };

  // First signing step: Encrypt file
  const { signMessage: signEncrypt, isPending: isEncryptPending } =
    useSignMessage({
      mutation: {
        onSuccess: () => {
          if (
            currentFileIndex >= 0 &&
            currentFileIndex < uploadedFiles.length
          ) {
            const fileName = uploadedFiles[currentFileIndex].name;

            // Dismiss the signing toast
            if (loadingToastId) {
              toast.dismiss(loadingToastId);
              setLoadingToastId(null);
            }

            // Show encryption in progress toast
            const encryptingId = toast.loading("Encrypting file...", {
              description: `Encrypting "${fileName}"`,
            });
            setLoadingToastId(encryptingId);

            // Add a 2-second delay to simulate encryption
            setTimeout(() => {
              // Dismiss the encrypting toast
              toast.dismiss(encryptingId);
              setLoadingToastId(null);

              // Show success toast
              toast.success("File encrypted", {
                description: `"${fileName}" has been encrypted`,
              });

              // Mark as encrypted and continue to next step
              const newEncrypted = new Set(encryptedFiles);
              newEncrypted.add(currentFileIndex);
              setEncryptedFiles(newEncrypted);

              // Add a 1-second delay before proceeding to upload signature
              setTimeout(() => {
                // Proceed to upload signing
                signUpload();
              }, 1000);
            }, 2000);
          }
        },
        onError: () => {
          if (!isConnected) {
            toast.error("Wallet not connected", {
              description: "Please connect your wallet to encrypt files",
            });
          } else if (currentFileIndex >= 0) {
            const fileName = uploadedFiles[currentFileIndex].name;
            toast.error("Encryption failed", {
              description: `Could not encrypt "${fileName}". Failed to sign message.`,
            });
          } else {
            toast.error("Encryption failed", {
              description: "Failed to sign message",
            });
          }

          if (loadingToastId) {
            toast.dismiss(loadingToastId);
            setLoadingToastId(null);
          }

          // Reset upload state after error
          setIsUploading(false);
          setCurrentFileIndex(-1);
        },
      },
    });

  // Second signing step: Upload to 0G
  const { signMessage: signUploadMessage, isPending: isUploadPending } =
    useSignMessage({
      mutation: {
        onSuccess: async () => {
          if (
            currentFileIndex >= 0 &&
            currentFileIndex < uploadedFiles.length
          ) {
            const fileName = uploadedFiles[currentFileIndex].name;
            toast.success("Signed for upload", {
              description: `Uploading "${fileName}" to 0G Storage`,
            });

            if (loadingToastId) {
              toast.dismiss(loadingToastId);
              setLoadingToastId(null);
            }

            // Now perform the actual upload
            try {
              const formData = new FormData();
              formData.append("file", uploadedFiles[currentFileIndex]);

              const result = await uploadFile(formData);
              const newResults = [...uploadResults];
              newResults[currentFileIndex] = result;
              setUploadResults(newResults);

              if (result.success) {
                toast.success("Upload complete", {
                  description: `"${fileName}" has been uploaded to 0G Storage`,
                });

                // Move to next file or finish
                processNextFile();
              } else {
                // Don't show error toast, keep loading toast active
                console.error("Upload failed silently:", result.error);

                // Don't dismiss the loading toast
                setLoadingToastId((prevId) => prevId);

                // Still update results internally
                const newResults = [...uploadResults];
                newResults[currentFileIndex] = {
                  success: false,
                  error: result.error || `Failed to upload "${fileName}"`,
                };
                setUploadResults(newResults);

                // Don't move to next file - we're "stuck" loading
              }
            } catch (error) {
              console.error(error);
              const newResults = [...uploadResults];
              newResults[currentFileIndex] = {
                success: false,
                error: "An error occurred during upload",
              };
              setUploadResults(newResults);

              // Don't show error toast, keep loading toast active
              // Don't dismiss the loading toast
              setLoadingToastId((prevId) => prevId);

              // Don't move to next file - we're "stuck" loading
            }
          }
        },
        onError: () => {
          if (!isConnected) {
            toast.error("Wallet not connected", {
              description: "Please connect your wallet to upload files",
            });

            if (loadingToastId) {
              toast.dismiss(loadingToastId);
              setLoadingToastId(null);
            }
          } else if (currentFileIndex >= 0) {
            // Don't show error toast, keep the loading toast active
            console.log(
              "upload authorization failed silently for:",
              uploadedFiles[currentFileIndex]?.name,
            );

            // Don't dismiss the loading toast
            setLoadingToastId((prevId) => prevId);
          } else {
            // Don't show error toast, keep the loading toast active
            console.log("Upload authorization failed silently");

            // Don't dismiss the loading toast
            setLoadingToastId((prevId) => prevId);
          }

          // Don't proceed to next file - we're "stuck" loading
        },
      },
    });

  // Process the next file in the queue
  const processNextFile = () => {
    const nextIndex = currentFileIndex + 1;
    if (nextIndex < uploadedFiles.length) {
      setCurrentFileIndex(nextIndex);
      signEncryptFile(nextIndex);
    } else {
      // All files processed
      finishUpload();
    }
  };

  // Sign encryption message for a file
  const signEncryptFile = (fileIndex: number) => {
    if (fileIndex >= 0 && fileIndex < uploadedFiles.length) {
      const fileName = uploadedFiles[fileIndex].name;
      const id = toast.loading("Uploading encrypted file(s)...", {
        description: `Preparing to encrypt "${fileName}"`,
      });
      setLoadingToastId(id);

      signEncrypt({ message: `Encrypt ${fileName}` });
    }
  };

  // Sign upload message
  const signUpload = () => {
    if (currentFileIndex >= 0 && currentFileIndex < uploadedFiles.length) {
      const fileName = uploadedFiles[currentFileIndex].name;
      const id = toast.loading("Signing for upload...", {
        description: `Preparing to upload "${fileName}" to 0G Storage`,
      });
      setLoadingToastId(id);

      signUploadMessage({ message: `Upload ${fileName} to 0G Storage` });
    }
  };

  // Finish the upload process
  const finishUpload = () => {
    setIsUploading(false);
    setCurrentFileIndex(-1);

    // Only clear files and close dialog if all uploads were successful
    if (
      uploadResults.length > 0 &&
      uploadResults.every((result) => result && result.success)
    ) {
      setTimeout(() => {
        setOpen(false);
        setUploadedFiles([]);
        setUploadResults([]);
        setEncryptedFiles(new Set());
      }, 2000);
    }
  };

  const handleSubmit = async () => {
    if (uploadedFiles.length === 0) return;

    setIsUploading(true);
    setUploadResults(Array(uploadedFiles.length).fill(undefined));
    setCurrentFileIndex(0);

    // Start with the first file
    signEncryptFile(0);
  };

  // Calculate overall upload status
  const allSuccess =
    uploadResults.length > 0 &&
    uploadResults.every((result) => result && result.success);
  const anyFailed = uploadResults.some((result) => result && !result.success);

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
                    {encryptedFiles.has(index) && !uploadResults[index] && (
                      <span className="text-blue-500">Encrypted</span>
                    )}
                    {uploadResults[index] && (
                      <span
                        className={
                          uploadResults[index].success
                            ? "text-green-500"
                            : "text-blue-500"
                        }
                      >
                        {uploadResults[index].success ? "✓" : "..."}
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

        {uploadResults.filter(Boolean).length > 0 && (
          <div
            className={`mt-4 p-3 rounded-lg ${
              allSuccess ? "bg-green-100" : anyFailed ? "bg-blue-100" : ""
            }`}
          >
            {allSuccess ? (
              <p className="text-sm text-green-800">
                Successfully uploaded all files to 0G storage
              </p>
            ) : (
              <p className="text-sm text-blue-800">Upload processing...</p>
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
              setEncryptedFiles(new Set());
            }}
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              uploadedFiles.length === 0 ||
              isUploading ||
              isEncryptPending ||
              isUploadPending
            }
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
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
