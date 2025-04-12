import { DashboardHeader } from "@/components/dashboard-header";
import { HealthStatistics } from "@/components/health-statistics";
import { MedicalRecords } from "@/components/medical-records";
import { AICopilotSidebar } from "@/components/ai-copilot-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function Dashboard() {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen bg-gray-50">
        <main className="flex-1">
          <div className="container mx-auto px-4 py-6">
            <DashboardHeader />
            <HealthStatistics />
            <MedicalRecords />
          </div>
        </main>
        <AICopilotSidebar />
      </div>
    </SidebarProvider>
  );
}
