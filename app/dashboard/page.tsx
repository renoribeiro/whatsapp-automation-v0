import { DashboardOverview } from "@/components/dashboard/dashboard-overview"
import { MetricsCards } from "@/components/dashboard/metrics-cards"
import { ConversationsChart } from "@/components/dashboard/conversations-chart"
import { RevenueChart } from "@/components/dashboard/revenue-chart"
import { RecentActivity } from "@/components/dashboard/recent-activity"

export default function DashboardPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>

      <MetricsCards />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <ConversationsChart />
        <RevenueChart />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <DashboardOverview />
        <RecentActivity />
      </div>
    </div>
  )
}
