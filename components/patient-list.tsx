import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  Filter,
  FileText,
  Calendar,
  Bell,
  UserPlus,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";

export function PatientList() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Patients</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search patients..."
                className="w-[200px] pl-8"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button size="sm">
              <UserPlus className="mr-2 h-4 w-4" />
              New Patient
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {patients.map((patient) => (
            <PatientItem key={patient.id} patient={patient} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  lastVisit: string;
  upcomingAppointment?: string;
  condition?: string;
  alerts: string[];
}

interface PatientItemProps {
  patient: Patient;
}

function PatientItem({ patient }: PatientItemProps) {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-secondary">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage
            src="/placeholder.svg?height=40&width=40"
            alt={patient.name}
          />
          <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-medium">{patient.name}</h3>
          <div className="flex gap-3 text-sm text-gray-500 dark:text-gray-400">
            <span>{patient.age} years</span>
            <span>•</span>
            <span>{patient.gender}</span>
            <span>•</span>
            <span>Last visit: {patient.lastVisit}</span>
          </div>
          {patient.condition && (
            <p className="text-sm text-gray-600 mt-1">{patient.condition}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-end">
          {patient.upcomingAppointment && (
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Calendar className="h-3 w-3" />
              <span>{patient.upcomingAppointment}</span>
            </div>
          )}
          <div className="flex gap-1 mt-1">
            {patient.alerts.map((alert, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {alert}
              </Badge>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <FileText className="h-4 w-4" />
            <span className="sr-only">View Records</span>
          </Button>
          <Button variant="ghost" size="icon">
            <Calendar className="h-4 w-4" />
            <span className="sr-only">Schedule</span>
          </Button>
          <Button variant="ghost" size="icon">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Notifications</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">More Options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View Patient Profile</DropdownMenuItem>
              <DropdownMenuItem>Request Records</DropdownMenuItem>
              <DropdownMenuItem>Send Message</DropdownMenuItem>
              <DropdownMenuItem>Add Note</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                Archive Patient
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}

const patients: Patient[] = [
  {
    id: "1",
    name: "Jane Doe",
    age: 32,
    gender: "Female",
    lastVisit: "March 15, 2025",
    upcomingAppointment: "April 10, 2025",
    condition: "Hypertension, High Cholesterol",
    alerts: ["Lab Results Pending", "Medication Review"],
  },
  {
    id: "2",
    name: "John Smith",
    age: 45,
    gender: "Male",
    lastVisit: "February 28, 2025",
    upcomingAppointment: "May 5, 2025",
    condition: "Type 2 Diabetes, Obesity",
    alerts: ["Needs A1C Test"],
  },
  {
    id: "3",
    name: "Emily Johnson",
    age: 28,
    gender: "Female",
    lastVisit: "March 10, 2025",
    condition: "Asthma, Allergies",
    alerts: ["Prescription Renewal"],
  },
  {
    id: "4",
    name: "Michael Chen",
    age: 52,
    gender: "Male",
    lastVisit: "March 22, 2025",
    upcomingAppointment: "April 22, 2025",
    condition: "Arthritis, Hypertension",
    alerts: ["Physical Therapy", "Imaging Results"],
  },
  {
    id: "5",
    name: "Sarah Williams",
    age: 35,
    gender: "Female",
    lastVisit: "March 5, 2025",
    alerts: ["New Patient"],
  },
];
