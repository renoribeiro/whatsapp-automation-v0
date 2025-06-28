import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const activities = [
  {
    user: "João Silva",
    action: "criou uma nova empresa",
    target: "TechStart Solutions",
    time: "2 min atrás",
    avatar: "/placeholder.svg?height=32&width=32&text=JS",
  },
  {
    user: "Maria Santos",
    action: "enviou 1.250 mensagens",
    target: "Campanha Black Friday",
    time: "5 min atrás",
    avatar: "/placeholder.svg?height=32&width=32&text=MS",
  },
  {
    user: "Carlos Lima",
    action: "configurou novo chatbot",
    target: "Atendimento Automático",
    time: "10 min atrás",
    avatar: "/placeholder.svg?height=32&width=32&text=CL",
  },
  {
    user: "Ana Costa",
    action: "gerou relatório",
    target: "Performance Mensal",
    time: "15 min atrás",
    avatar: "/placeholder.svg?height=32&width=32&text=AC",
  },
  {
    user: "Pedro Oliveira",
    action: "atualizou plano",
    target: "Professional → Enterprise",
    time: "20 min atrás",
    avatar: "/placeholder.svg?height=32&width=32&text=PO",
  },
]

export function RecentActivity() {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Atividade Recente</CardTitle>
        <CardDescription>Últimas ações realizadas na plataforma</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-center">
              <Avatar className="h-9 w-9">
                <AvatarImage src={activity.avatar || "/placeholder.svg"} alt={activity.user} />
                <AvatarFallback>
                  {activity.user
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">
                  <span className="font-semibold">{activity.user}</span> {activity.action}
                </p>
                <p className="text-sm text-muted-foreground">{activity.target}</p>
              </div>
              <div className="ml-auto font-medium text-xs text-muted-foreground">{activity.time}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
