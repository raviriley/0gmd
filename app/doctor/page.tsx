import { DoctorHeader } from "@/components/doctor-header";
import { PatientList } from "@/components/patient-list";
import { ThemeToggle } from "@/components/theme-toggle";

export default function DoctorDashboard() {
  return (
    <div className="py-4">
      <header className="flex pt-2 items-center border-b px-4">
        <div className="container flex items-start justify-between max-w-none">
          <div className="flex items-center gap-1">
            <DoctorHeader />
          </div>
          <ThemeToggle />
        </div>
      </header>
      <div className="container p-2 max-w-none">
        <PatientList />
      </div>
    </div>
  );
}
