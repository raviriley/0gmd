import { DashboardHeader } from "@/components/dashboard-header";
import { HealthStatistics } from "@/components/health-statistics";
import { MedicalRecords } from "@/components/medical-records";
import { AICopilotSidebar } from "@/components/ai-copilot-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { DoctorRecordRequests } from "@/components/doctor-record-requests";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Dashboard() {
  return (
    <SidebarProvider defaultOpen={true}>
      <AICopilotSidebar />
      <SidebarInset className="h-[calc(100vh-16px)] overflow-hidden">
        <header className="flex pt-2 shrink-0 items-center border-b">
          <div className="container flex items-start justify-between pl-4 pr-2">
            <div className="flex items-center gap-1">
              {/* <SidebarTrigger
              className="rotate-180 -mt-5"
              variant="ghost"
              size="icon"
            /> */}
              <DashboardHeader />
            </div>
            <ThemeToggle />
          </div>
        </header>
        <ScrollArea className="h-[calc(100%-76px)] mr-[-8px] pr-[8px]">
          <div className="container px-4 pb-6 pt-3">
            <HealthStatistics />
            <DoctorRecordRequests />
            <MedicalRecords />
          </div>
        </ScrollArea>
      </SidebarInset>
    </SidebarProvider>
  );
}
