import { NextRequest, NextResponse } from "next/server";
import { downloadFile } from "@/lib/0g-storage";
import { readFile, unlink } from "fs/promises";
import path from "path";
import os from "os";

export async function GET(
  request: NextRequest,
  { params }: { params: { rootHash: string } },
) {
  try {
    const { rootHash } = params;

    // Create a temp file path for download
    const tempDir = os.tmpdir();
    const tempFilePath = path.join(tempDir, `${rootHash}.tmp`);

    // Download the file from 0G Storage
    await downloadFile(rootHash, tempFilePath);

    // Read the file
    const fileBuffer = await readFile(tempFilePath);

    // Delete the temp file
    await unlink(tempFilePath).catch(console.error);

    // Set appropriate headers and return file
    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Disposition": `attachment; filename=${rootHash}`,
        "Content-Type": "application/octet-stream",
      },
    });
  } catch (error: any) {
    console.error("Error downloading file:", error);
    return NextResponse.json(
      { error: error.message || "Error downloading file" },
      { status: 500 },
    );
  }
}
