import { DashboardHeader } from "@/components/dashboard-header";
import { HealthStatistics } from "@/components/health-statistics";
import { MedicalRecords } from "@/components/medical-records";
import { AICopilotSidebar } from "@/components/ai-copilot-sidebar";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function Dashboard() {
  return (
    <SidebarProvider defaultOpen={true}>
      <SidebarInset>
        <main className="flex-1">
          <div className="container mx-auto px-4 pb-6 pt-3">
            <div className="flex items-start justify-between mb-4">
              <DashboardHeader />
              <SidebarTrigger
                className="rotate-180"
                variant="ghost"
                size="icon"
              />
            </div>
            <HealthStatistics />
            <MedicalRecords />
          </div>
        </main>
      </SidebarInset>
      <AICopilotSidebar />
    </SidebarProvider>
  );
}
