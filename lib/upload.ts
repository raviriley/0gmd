import { Indexer, Blob } from "@0glabs/0g-ts-sdk";
import { ethers } from "ethers";

/**
 * Creates a Blob object from a File
 */
export async function createBlobFromFile(file: File): Promise<Blob> {
  return new Blob(file);
}

/**
 * Uploads a file to 0G storage
 */
export async function uploadToStorage(
  blob: Blob,
  storageRpc: string,
  l1Rpc: string,
  signer: ethers.Wallet,
): Promise<[boolean, Error | null]> {
  try {
    const indexer = new Indexer(storageRpc);

    const uploadOptions = {
      taskSize: 10,
      expectedReplica: 1,
      finalityRequired: true,
      tags: "0x",
      skipTx: false,
      fee: BigInt(0),
    };

    await indexer.upload(blob, l1Rpc, signer, uploadOptions);
    return [true, null];
  } catch (error) {
    return [false, error instanceof Error ? error : new Error(String(error))];
  }
}

/**
 * Gets a signer from a private key
 */
export function getSignerFromPrivateKey(
  privateKey: string,
  provider: ethers.JsonRpcProvider,
): ethers.Wallet {
  return new ethers.Wallet(privateKey, provider);
}

/**
 * Gets a provider from an RPC URL
 */
export function getProvider(rpcUrl: string): ethers.JsonRpcProvider {
  return new ethers.JsonRpcProvider(rpcUrl);
}
