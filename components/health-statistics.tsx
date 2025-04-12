import type React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Activity,
  Heart,
  Thermometer,
  Droplet,
  Weight,
  TrendingUp,
} from "lucide-react";

export function HealthStatistics() {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Health Statistics
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Heart Rate"
          value="72 bpm"
          description="Normal range"
          icon={<Heart className="h-5 w-5 text-rose-500" />}
          trend="stable"
        />
        <StatCard
          title="Blood Pressure"
          value="120/80 mmHg"
          description="Optimal"
          icon={<Activity className="h-5 w-5 text-indigo-500" />}
          trend="improving"
        />
        <StatCard
          title="Temperature"
          value="98.6°F"
          description="Normal"
          icon={<Thermometer className="h-5 w-5 text-amber-500" />}
          trend="stable"
        />
        <StatCard
          title="Glucose Level"
          value="95 mg/dL"
          description="Fasting"
          icon={<Droplet className="h-5 w-5 text-blue-500" />}
          trend="stable"
        />
        <StatCard
          title="Weight"
          value="145 lbs"
          description="BMI: 22.5"
          icon={<Weight className="h-5 w-5 text-emerald-500" />}
          trend="improving"
        />
        <StatCard
          title="Cholesterol"
          value="180 mg/dL"
          description="Total"
          icon={<TrendingUp className="h-5 w-5 text-purple-500" />}
          trend="needs attention"
        />
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  trend: "improving" | "stable" | "needs attention";
}

function StatCard({ title, value, description, icon, trend }: StatCardProps) {
  const trendColor = {
    improving: "text-emerald-500",
    stable: "text-blue-500",
    "needs attention": "text-amber-500",
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <CardDescription className="flex items-center justify-between mt-1">
          <span>{description}</span>
          <span className={trendColor[trend]}>{trend}</span>
        </CardDescription>
      </CardContent>
    </Card>
  );
}
