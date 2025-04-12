"use server";

import {
  createBlobFromFile,
  uploadToStorage,
  getProvider,
  getSignerFromPrivateKey,
} from "./upload";

/**
 * Server action to upload a file to 0G storage
 */
export async function uploadFile(formData: FormData) {
  try {
    const file = formData.get("file") as File;

    if (!file) {
      return { success: false, error: "No file provided" };
    }

    // Get configuration from environment variables
    const storageRpc = process.env.ZERO_G_STORAGE_RPC;
    const l1Rpc = process.env.ZERO_G_L1_RPC;
    const privateKey = process.env.ZERO_G_PRIVATE_KEY;

    if (!storageRpc || !l1Rpc || !privateKey) {
      console.error("Missing required environment variables for 0G storage");
      return {
        success: false,
        error: "Server configuration error",
      };
    }

    // Create a blob from the file
    const blob = await createBlobFromFile(file);

    // Setup provider and signer
    const provider = getProvider(l1Rpc);
    const signer = getSignerFromPrivateKey(privateKey, provider);

    // Upload to 0G storage
    const [success, error] = await uploadToStorage(
      blob,
      storageRpc,
      l1Rpc,
      signer,
    );

    if (!success) {
      console.error("Failed to upload to 0G storage:", error);
      return {
        success: false,
        error: "Failed to upload file to storage",
      };
    }

    // Return success response with file info
    return {
      success: true,
      file: {
        name: file.name,
        size: file.size,
        type: file.type,
      },
    };
  } catch (error) {
    console.error("Error processing file upload:", error);
    return {
      success: false,
      error: "Internal server error",
    };
  }
}
