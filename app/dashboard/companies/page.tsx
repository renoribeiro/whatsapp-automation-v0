"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Building, Plus, Search, MoreHorizontal, Edit, Trash2, Users, AlertCircle, CheckCircle } from "lucide-react"

interface Company {
  id: string
  name: string
  email: string
  phone: string
  status: string
  plan: string
  users: number
  createdAt: string
  lastActivity: string
}

const mockCompanies: Company[] = [
  {
    id: "1",
    name: "Empresa ABC Ltda",
    email: "contato@empresaabc.com",
    phone: "(11) 99999-9999",
    status: "active",
    plan: "Premium",
    users: 15,
    createdAt: "2024-01-15",
    lastActivity: "2024-01-20",
  },
  {
    id: "2",
    name: "XYZ Tecnologia",
    email: "admin@xyztec.com",
    phone: "(11) 88888-8888",
    status: "active",
    plan: "Enterprise",
    users: 45,
    createdAt: "2024-01-10",
    lastActivity: "2024-01-19",
  },
  {
    id: "3",
    name: "StartUp Inovadora",
    email: "hello@startup.com",
    phone: "(11) 77777-7777",
    status: "pending",
    plan: "Basic",
    users: 5,
    createdAt: "2024-01-18",
    lastActivity: "2024-01-18",
  },
  {
    id: "4",
    name: "Empresa Inativa",
    email: "contato@inativa.com",
    phone: "(11) 66666-6666",
    status: "inactive",
    plan: "Basic",
    users: 8,
    createdAt: "2024-01-05",
    lastActivity: "2024-01-10",
  },
]

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>(mockCompanies)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredCompanies = companies.filter(
    (company) =>
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Ativa</Badge>
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Inativa</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pendente</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getPlanBadge = (plan: string) => {
    switch (plan) {
      case "Enterprise":
        return <Badge className="bg-purple-100 text-purple-800 border-purple-200">Enterprise</Badge>
      case "Premium":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Premium</Badge>
      case "Basic":
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Basic</Badge>
      default:
        return <Badge variant="secondary">{plan}</Badge>
    }
  }

  const stats = [
    {
      title: "Total de Empresas",
      value: companies.length.toString(),
      icon: Building,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Empresas Ativas",
      value: companies.filter((c) => c.status === "active").length.toString(),
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Total de Usuários",
      value: companies.reduce((sum, c) => sum + c.users, 0).toString(),
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Pendentes",
      value: companies.filter((c) => c.status === "pending").length.toString(),
      icon: AlertCircle,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Empresas</h1>
          <p className="text-muted-foreground">Gerencie empresas e seus planos na plataforma</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nova Empresa
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`${stat.bgColor} p-3 rounded-full`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Companies Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Empresas</CardTitle>
          <CardDescription>Visualize e gerencie todas as empresas da plataforma</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar empresas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Plano</TableHead>
                  <TableHead>Usuários</TableHead>
                  <TableHead>Última Atividade</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCompanies.map((company) => (
                  <TableRow key={company.id}>
                    <TableCell className="font-medium">{company.name}</TableCell>
                    <TableCell>{company.email}</TableCell>
                    <TableCell>{company.phone}</TableCell>
                    <TableCell>{getStatusBadge(company.status)}</TableCell>
                    <TableCell>{getPlanBadge(company.plan)}</TableCell>
                    <TableCell>{company.users}</TableCell>
                    <TableCell>{new Date(company.lastActivity).toLocaleDateString("pt-BR")}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Users className="mr-2 h-4 w-4" />
                            Ver Usuários
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredCompanies.length === 0 && (
            <div className="text-center py-8">
              <Building className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">Nenhuma empresa encontrada</h3>
              <p className="mt-1 text-sm text-gray-500">Tente ajustar os termos de busca.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
