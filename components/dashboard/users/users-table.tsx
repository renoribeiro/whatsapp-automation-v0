import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const users = [
  {
    id: "1",
    name: "João Silva",
    email: "joao@techstart.com",
    company: "TechStart",
    role: "Admin",
    status: "active",
    lastLogin: "2 min atrás",
    avatar: "/placeholder.svg?height=32&width=32&text=JS",
  },
  {
    id: "2",
    name: "Maria Santos",
    email: "maria@fashion.com",
    company: "Fashion Store",
    role: "Manager",
    status: "active",
    lastLogin: "1 hora atrás",
    avatar: "/placeholder.svg?height=32&width=32&text=MS",
  },
  {
    id: "3",
    name: "Carlos Lima",
    email: "carlos@autopecas.com",
    company: "AutoPeças Plus",
    role: "User",
    status: "inactive",
    lastLogin: "3 dias atrás",
    avatar: "/placeholder.svg?height=32&width=32&text=CL",
  },
  {
    id: "4",
    name: "Ana Costa",
    email: "ana@beauty.com",
    company: "Beauty Care",
    role: "Manager",
    status: "active",
    lastLogin: "30 min atrás",
    avatar: "/placeholder.svg?height=32&width=32&text=AC",
  },
  {
    id: "5",
    name: "Pedro Oliveira",
    email: "pedro@food.com",
    company: "FoodDelivery",
    role: "User",
    status: "active",
    lastLogin: "5 min atrás",
    avatar: "/placeholder.svg?height=32&width=32&text=PO",
  },
]

export function UsersTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Usuários</CardTitle>
        <CardDescription>Todos os usuários cadastrados na plataforma</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users.map((user) => (
            <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                  <AvatarFallback>
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center space-x-2">
                    <p className="font-medium">{user.name}</p>
                    <Badge
                      variant={user.role === "Admin" ? "default" : user.role === "Manager" ? "secondary" : "outline"}
                    >
                      {user.role}
                    </Badge>
                    <Badge variant={user.status === "active" ? "default" : "secondary"}>
                      {user.status === "active" ? "Ativo" : "Inativo"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <p className="text-sm text-muted-foreground">{user.company}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="text-right">
                  <p className="text-sm font-medium">Último login</p>
                  <p className="text-xs text-muted-foreground">{user.lastLogin}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="mr-2 h-4 w-4" />
                      Visualizar
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
