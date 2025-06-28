import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Users, MessageCircle, Building2, DollarSign } from "lucide-react"

const metrics = [
  {
    title: "Total de Usuários",
    value: "2,350",
    change: "+20.1%",
    trend: "up",
    icon: Users,
  },
  {
    title: "Mensagens Enviadas",
    value: "45,231",
    change: "+15.3%",
    trend: "up",
    icon: MessageCircle,
  },
  {
    title: "Empresas Ativas",
    value: "573",
    change: "+8.2%",
    trend: "up",
    icon: Building2,
  },
  {
    title: "Receita Mensal",
    value: "R$ 45.231",
    change: "-2.1%",
    trend: "down",
    icon: DollarSign,
  },
]

export function MetricsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <Card key={metric.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
            <metric.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              {metric.trend === "up" ? (
                <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
              )}
              <span className={metric.trend === "up" ? "text-green-500" : "text-red-500"}>{metric.change}</span>
              <span className="ml-1">em relação ao mês passado</span>
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
