import { DoctorHeader } from "@/components/doctor-header";
import { PatientList } from "@/components/patient-list";
import { AICopilotSidebar } from "@/components/ai-copilot-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";

export default function DoctorDashboard() {
  return (
    <SidebarProvider defaultOpen={true}>
      <AICopilotSidebar />
      <SidebarInset>
        <header className="flex pt-2 shrink-0 items-center border-b">
          <div className="container flex items-start justify-between px-4">
            <div className="flex items-center gap-1">
              <DoctorHeader />
            </div>
            <ThemeToggle />
          </div>
        </header>
        <div className="container px-4 pb-6 pt-3">
          <PatientList />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
