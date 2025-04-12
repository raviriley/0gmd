import { NextRequest, NextResponse } from "next/server";
import {
  createBlobFromFile,
  uploadToStorage,
  getProvider,
  getSignerFromPrivateKey,
} from "@/lib/upload";

export async function POST(request: NextRequest) {
  try {
    // Check if the request is a multipart form
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Get configuration from environment variables
    const storageRpc = process.env.ZERO_G_STORAGE_RPC;
    const l1Rpc = process.env.ZERO_G_L1_RPC;
    const privateKey = process.env.ZERO_G_PRIVATE_KEY;

    if (!storageRpc || !l1Rpc || !privateKey) {
      console.error("Missing required environment variables for 0G storage");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 },
      );
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
      return NextResponse.json(
        { error: "Failed to upload file to storage" },
        { status: 500 },
      );
    }

    // Return success response with file info
    return NextResponse.json({
      success: true,
      file: {
        name: file.name,
        size: file.size,
        type: file.type,
      },
    });
  } catch (error) {
    console.error("Error processing file upload:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
