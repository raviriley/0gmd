import { Indexer, ZgFile } from "@0glabs/0g-ts-sdk";
import { ethers } from "ethers";

// Network configuration
const RPC_URL = process.env.RPC_URL || "https://evmrpc-testnet.0g.ai/";
const INDEXER_RPC =
  process.env.INDEXER_RPC || "https://indexer-storage-testnet-standard.0g.ai";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";

// Initialize provider, signer, and indexer
const getStorageClient = () => {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const signer = new ethers.Wallet(PRIVATE_KEY, provider);
  const indexer = new Indexer(INDEXER_RPC);

  return { provider, signer, indexer };
};

/**
 * Upload a file to 0G Storage
 * @param filePath - Path to the file to upload
 * @returns Object with rootHash and transactionHash
 */
export async function uploadFile(filePath: string) {
  try {
    const { indexer, signer } = getStorageClient();

    // Create ZgFile from file path
    const zgFile = await ZgFile.fromFilePath(filePath);
    const [tree, treeErr] = await zgFile.merkleTree();

    if (treeErr) {
      throw new Error(`Error generating merkle tree: ${treeErr}`);
    }

    // Upload file with SDK
    const [tx, uploadErr] = await indexer.upload(zgFile, RPC_URL, signer);

    if (uploadErr) {
      throw new Error(`Error uploading file: ${uploadErr}`);
    }

    // Get file identifier and transaction hash
    const rootHash = tree?.rootHash();

    return {
      rootHash,
      transactionHash: tx,
    };
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
}

/**
 * Download a file from 0G Storage
 * @param rootHash - The root hash of the file to download
 * @param outputPath - The path where to save the downloaded file
 * @returns boolean indicating success
 */
export async function downloadFile(rootHash: string, outputPath: string) {
  try {
    const { indexer } = getStorageClient();

    // Download the file
    const err = await indexer.download(rootHash, outputPath, true);

    if (err) {
      throw new Error(`Error downloading file: ${err}`);
    }

    return true;
  } catch (error) {
    console.error("Error downloading file:", error);
    throw error;
  }
}
