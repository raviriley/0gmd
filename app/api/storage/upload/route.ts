import { NextRequest, NextResponse } from "next/server";
import { uploadFile } from "@/lib/0g-storage";
import { writeFile } from "fs/promises";
import path from "path";
import os from "os";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Create a temporary file
    const tempDir = os.tmpdir();
    const tempFilePath = path.join(tempDir, file.name);
    const bytes = await file.arrayBuffer();
    await writeFile(tempFilePath, Buffer.from(bytes));

    // Upload to 0G Storage
    const result = await uploadFile(tempFilePath);

    // Return the result
    return NextResponse.json({
      success: true,
      rootHash: result.rootHash,
      transactionHash: result.transactionHash,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
    });
  } catch (error: any) {
    console.error("Error processing upload:", error);
    return NextResponse.json(
      { error: error.message || "Error uploading file" },
      { status: 500 },
    );
  }
}
