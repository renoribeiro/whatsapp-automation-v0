import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MoreHorizontal, Eye, Edit, Trash2, Building2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const companies = [
  {
    id: "1",
    name: "TechStart",
    email: "contato@techstart.com",
    plan: "Enterprise",
    users: 45,
    status: "active",
    revenue: "R$ 12.450",
    createdAt: "15 Jan 2024",
    logo: "/placeholder.svg?height=32&width=32&text=TS",
  },
  {
    id: "2",
    name: "Fashion Store",
    email: "admin@fashion.com",
    plan: "Professional",
    users: 23,
    status: "active",
    revenue: "R$ 8.920",
    createdAt: "22 Jan 2024",
    logo: "/placeholder.svg?height=32&width=32&text=FS",
  },
  {
    id: "3",
    name: "AutoPeças Plus",
    email: "contato@autopecas.com",
    plan: "Professional",
    users: 18,
    status: "inactive",
    revenue: "R$ 6.780",
    createdAt: "05 Feb 2024",
    logo: "/placeholder.svg?height=32&width=32&text=AP",
  },
  {
    id: "4",
    name: "Beauty Care",
    email: "info@beauty.com",
    plan: "Starter",
    users: 8,
    status: "active",
    revenue: "R$ 5.340",
    createdAt: "12 Feb 2024",
    logo: "/placeholder.svg?height=32&width=32&text=BC",
  },
  {
    id: "5",
    name: "FoodDelivery",
    email: "suporte@food.com",
    plan: "Professional",
    users: 32,
    status: "active",
    revenue: "R$ 4.890",
    createdAt: "28 Feb 2024",
    logo: "/placeholder.svg?height=32&width=32&text=FD",
  },
]

export function CompaniesTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Empresas</CardTitle>
        <CardDescription>Todas as empresas cadastradas na plataforma</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {companies.map((company) => (
            <div key={company.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={company.logo || "/placeholder.svg"} alt={company.name} />
                  <AvatarFallback>
                    <Building2 className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center space-x-2">
                    <p className="font-medium">{company.name}</p>
                    <Badge
                      variant={
                        company.plan === "Enterprise"
                          ? "default"
                          : company.plan === "Professional"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {company.plan}
                    </Badge>
                    <Badge variant={company.status === "active" ? "default" : "secondary"}>
                      {company.status === "active" ? "Ativa" : "Inativa"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{company.email}</p>
                  <p className="text-sm text-muted-foreground">{company.users} usuários</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-medium">{company.revenue}</p>
                  <p className="text-xs text-muted-foreground">Receita mensal</p>
                  <p className="text-xs text-muted-foreground">Criada em {company.createdAt}</p>
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
