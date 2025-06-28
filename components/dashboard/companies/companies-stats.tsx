import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, TrendingUp, Users, CreditCard } from "lucide-react"

const stats = [
  {
    title: "Total de Empresas",
    value: "573",
    icon: Building2,
    description: "Empresas cadastradas",
  },
  {
    title: "Empresas Ativas",
    value: "489",
    icon: TrendingUp,
    description: "Com atividade nos últimos 30 dias",
  },
  {
    title: "Total de Usuários",
    value: "2,350",
    icon: Users,
    description: "Usuários de todas as empresas",
  },
  {
    title: "Receita Mensal",
    value: "R$ 45.231",
    icon: CreditCard,
    description: "Receita total das assinaturas",
  },
]

export function CompaniesStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
