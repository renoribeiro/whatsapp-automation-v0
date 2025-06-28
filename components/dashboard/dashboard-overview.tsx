import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

const topCompanies = [
  { name: "TechStart", revenue: 12450, progress: 85, plan: "Enterprise" },
  { name: "Fashion Store", revenue: 8920, progress: 72, plan: "Professional" },
  { name: "AutoPeças Plus", revenue: 6780, progress: 58, plan: "Professional" },
  { name: "Beauty Care", revenue: 5340, progress: 45, plan: "Starter" },
  { name: "FoodDelivery", revenue: 4890, progress: 38, plan: "Professional" },
]

export function DashboardOverview() {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Top Empresas</CardTitle>
        <CardDescription>Empresas com melhor performance este mês</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {topCompanies.map((company) => (
            <div key={company.name} className="flex items-center">
              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium leading-none">{company.name}</p>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{company.plan}</Badge>
                    <span className="text-sm font-medium">R$ {company.revenue.toLocaleString()}</span>
                  </div>
                </div>
                <Progress value={company.progress} className="h-2" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
