"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Download, Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useSignMessage } from "wagmi";
import { toast } from "sonner";
import { useState } from "react";

export function MedicalRecords() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Medical Records</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search records..."
                className="w-[200px] pl-8"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Records</TabsTrigger>
            <TabsTrigger value="lab">Lab Results</TabsTrigger>
            <TabsTrigger value="imaging">Imaging</TabsTrigger>
            <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
            <TabsTrigger value="visits">Visit Notes</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <div className="space-y-4">
              {medicalRecords.map((record) => (
                <RecordItem key={record.id} record={record} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="lab">
            <div className="space-y-4">
              {medicalRecords
                .filter((record) => record.type === "Lab Results")
                .map((record) => (
                  <RecordItem key={record.id} record={record} />
                ))}
            </div>
          </TabsContent>
          <TabsContent value="imaging">
            <div className="space-y-4">
              {medicalRecords
                .filter((record) => record.type === "Imaging")
                .map((record) => (
                  <RecordItem key={record.id} record={record} />
                ))}
            </div>
          </TabsContent>
          <TabsContent value="prescriptions">
            <div className="space-y-4">
              {medicalRecords
                .filter((record) => record.type === "Prescription")
                .map((record) => (
                  <RecordItem key={record.id} record={record} />
                ))}
            </div>
          </TabsContent>
          <TabsContent value="visits">
            <div className="space-y-4">
              {medicalRecords
                .filter((record) => record.type === "Visit Notes")
                .map((record) => (
                  <RecordItem key={record.id} record={record} />
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

interface Record {
  id: string;
  title: string;
  date: string;
  provider: string;
  type: string;
  status: "new" | "reviewed" | "archived";
}

interface RecordItemProps {
  record: Record;
}

function RecordItem({ record }: RecordItemProps) {
  const statusColors = {
    new: "bg-blue-100 text-blue-800",
    reviewed: "bg-green-100 text-green-800",
    archived: "bg-gray-100 text-gray-800",
  };

  const [loadingToastId, setLoadingToastId] = useState<string | number | null>(
    null,
  );

  const { signMessage, isPending } = useSignMessage({
    mutation: {
      onSuccess: () => {
        toast.success("Record authenticated", {
          description: `Successfully signed for "${record.title}" access`,
        });
        if (loadingToastId) {
          toast.dismiss(loadingToastId);
        }

        // Generate and download mock PDF file
        const fileName = record.title.replace(/\s+/g, "_") + ".pdf";
        const blob = new Blob([""], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      },
      onError: () => {
        toast.error("Authentication failed", {
          description: "Message was not signed with your wallet",
        });
        if (loadingToastId) {
          toast.dismiss(loadingToastId);
        }
      },
    },
  });

  const handleDownload = () => {
    const id = toast.loading("Signing message...", {
      description: `Signing message for "${record.title}" access`,
    });
    setLoadingToastId(id);
    signMessage({ message: `Decrypt & Sign ${record.title}` });
  };

  return (
    <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-secondary">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gray-100 rounded-full">
          <FileText className="h-5 w-5 text-gray-600" />
        </div>
        <div>
          <h3 className="font-medium">{record.title}</h3>
          <div className="flex gap-3 text-sm text-gray-500 dark:text-gray-400">
            <span>{record.date}</span>
            <span>•</span>
            <span>{record.provider}</span>
            <span>•</span>
            <span>{record.type}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span
          className={`text-xs px-2 py-1 rounded-full ${statusColors[record.status]}`}
        >
          {record.status}
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDownload}
          disabled={isPending}
        >
          <Download className="h-4 w-4" />
          <span className="sr-only">Download</span>
        </Button>
      </div>
    </div>
  );
}

const medicalRecords: Record[] = [
  {
    id: "1",
    title: "Annual Physical Examination",
    date: "March 15, 2025",
    provider: "Dr. Sarah Johnson",
    type: "Visit Notes",
    status: "new",
  },
  {
    id: "2",
    title: "Complete Blood Count (CBC)",
    date: "March 15, 2025",
    provider: "City Medical Lab",
    type: "Lab Results",
    status: "new",
  },
  {
    id: "3",
    title: "Chest X-Ray",
    date: "February 28, 2025",
    provider: "Radiology Partners",
    type: "Imaging",
    status: "reviewed",
  },
  {
    id: "4",
    title: "Lipid Panel",
    date: "February 28, 2025",
    provider: "City Medical Lab",
    type: "Lab Results",
    status: "reviewed",
  },
  {
    id: "5",
    title: "Atorvastatin 10mg",
    date: "February 28, 2025",
    provider: "Dr. Sarah Johnson",
    type: "Prescription",
    status: "reviewed",
  },
  {
    id: "6",
    title: "Allergy Consultation",
    date: "January 10, 2025",
    provider: "Dr. Michael Chen",
    type: "Visit Notes",
    status: "archived",
  },
];
