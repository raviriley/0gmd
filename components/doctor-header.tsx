import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Bell, Calendar, Settings, Users } from "lucide-react";

export function DoctorHeader() {
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage
              src="/placeholder.svg?height=48&width=48"
              alt="Doctor"
            />
            <AvatarFallback>DS</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold text-primary-background">
              Welcome, Dr. Sarah Johnson
            </h1>
            <p className="text-muted-foreground">
              You have 3 new record requests and 5 pending reviews
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <Calendar className="h-4 w-4" />
            <span className="sr-only">Appointments</span>
          </Button>
          <Button variant="outline" size="icon">
            <Users className="h-4 w-4" />
            <span className="sr-only">Patients</span>
          </Button>
          <Button variant="outline" size="icon">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Notifications</span>
          </Button>
          <Button variant="outline" size="icon">
            <Settings className="h-4 w-4" />
            <span className="sr-only">Settings</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
