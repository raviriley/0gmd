import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Filter, Search, Clock, Check, X, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function DoctorRecordRequests() {
  return (
    <Card className="mb-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Record Requests</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search requests..."
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
        <Tabs defaultValue="pending">
          <TabsList className="mb-4">
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="denied">Denied</TabsTrigger>
            <TabsTrigger value="all">All Requests</TabsTrigger>
          </TabsList>
          <TabsContent value="pending">
            <div className="space-y-4">
              {recordRequests
                .filter((request) => request.status === "pending")
                .map((request) => (
                  <RequestItem key={request.id} request={request} />
                ))}
            </div>
          </TabsContent>
          <TabsContent value="approved">
            <div className="space-y-4">
              {recordRequests
                .filter((request) => request.status === "approved")
                .map((request) => (
                  <RequestItem key={request.id} request={request} />
                ))}
            </div>
          </TabsContent>
          <TabsContent value="denied">
            <div className="space-y-4">
              {recordRequests
                .filter((request) => request.status === "denied")
                .map((request) => (
                  <RequestItem key={request.id} request={request} />
                ))}
            </div>
          </TabsContent>
          <TabsContent value="all">
            <div className="space-y-4">
              {recordRequests.map((request) => (
                <RequestItem key={request.id} request={request} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

interface RecordRequest {
  id: string;
  doctorName: string;
  doctorId: string;
  requestType: string;
  requestedDate: string;
  description: string;
  priority: "high" | "medium" | "low";
  status: "pending" | "approved" | "denied";
}

interface RequestItemProps {
  request: RecordRequest;
}

function RequestItem({ request }: RequestItemProps) {
  const priorityColors = {
    high: "bg-red-100 text-red-800",
    medium: "bg-yellow-100 text-yellow-800",
    low: "bg-green-100 text-green-800",
  };

  const statusIcons = {
    pending: <Clock className="h-4 w-4 text-yellow-500" />,
    approved: <Check className="h-4 w-4 text-green-500" />,
    denied: <X className="h-4 w-4 text-red-500" />,
  };

  return (
    <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-secondary">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage
            src="/placeholder.svg?height=40&width=40"
            alt={request.doctorName}
          />
          <AvatarFallback>{request.doctorName.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-medium">{request.doctorName}</h3>
          <div className="flex gap-3 text-sm text-gray-500 dark:text-gray-400">
            <span>{request.requestType}</span>
            <span>•</span>
            <span>{request.requestedDate}</span>
            <span>•</span>
            <span>Doctor ID: {request.doctorId}</span>
          </div>
          <p className="text-sm text-gray-600 mt-1">{request.description}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            priorityColors[request.priority]
          }`}
        >
          {request.priority}
        </span>
        <div className="flex items-center gap-1">
          {request.status === "pending" ? (
            <>
              <Button variant="outline" size="sm" className="h-8">
                <X className="h-4 w-4 mr-1" />
                Deny
              </Button>
              <Button size="sm" className="h-8">
                <Check className="h-4 w-4 mr-1" />
                Approve
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              {statusIcons[request.status]}
              <span className="text-sm capitalize">{request.status}</span>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <RefreshCw className="h-4 w-4" />
                <span className="sr-only">Reprocess</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const recordRequests: RecordRequest[] = [
  {
    id: "1",
    doctorName: "Dr. Gregory House, MD",
    doctorId: "D1001",
    requestType: "Lab Results",
    requestedDate: "April 2, 2025",
    description: "Request for blood test results from March 15, 2025",
    priority: "high",
    status: "pending",
  },
  {
    id: "2",
    doctorName: "Dr. Meredith Grey, MD",
    doctorId: "D1002",
    requestType: "Imaging",
    requestedDate: "April 1, 2025",
    description: "Chest X-ray results from recent hospital visit",
    priority: "medium",
    status: "pending",
  },
  {
    id: "3",
    doctorName: "Dr. Emily Johnson, MD, PhD",
    doctorId: "D1003",
    requestType: "Prescription",
    requestedDate: "March 30, 2025",
    description: "Refill request for asthma medication",
    priority: "low",
    status: "pending",
  },
  {
    id: "4",
    doctorName: "Dr. Doogie Howser, MD, PhD",
    doctorId: "D1004",
    requestType: "Visit Notes",
    requestedDate: "March 28, 2025",
    description: "Copy of physician notes from annual physical",
    priority: "medium",
    status: "approved",
  },
  {
    id: "5",
    doctorName: "Dr. Sarah Williams, MD, PhD",
    doctorId: "D1005",
    requestType: "Lab Results",
    requestedDate: "March 25, 2025",
    description: "Request for genetic testing results",
    priority: "high",
    status: "denied",
  },
];
