import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserCheck, UserX, Crown } from "lucide-react"

const stats = [
  {
    title: "Total de Usuários",
    value: "2,350",
    icon: Users,
    description: "Todos os usuários cadastrados",
  },
  {
    title: "Usuários Ativos",
    value: "1,890",
    icon: UserCheck,
    description: "Logaram nos últimos 30 dias",
  },
  {
    title: "Usuários Inativos",
    value: "460",
    icon: UserX,
    description: "Sem login há mais de 30 dias",
  },
  {
    title: "Administradores",
    value: "12",
    icon: Crown,
    description: "Usuários com acesso admin",
  },
]

export function UsersStats() {
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
