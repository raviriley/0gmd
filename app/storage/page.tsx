import { FileStorage } from "@/components/file-storage";

export default function StoragePage() {
  return (
    <div className="container max-w-4xl py-8">
      <h1 className="text-2xl font-bold mb-6">0G Decentralized File Storage</h1>
      <FileStorage />
    </div>
  );
}
