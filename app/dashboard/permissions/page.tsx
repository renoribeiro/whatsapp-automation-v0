"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Plus, MoreHorizontal, Shield, Users, Settings, Eye } from "lucide-react"

// Mock data
const permissions = [
  {
    id: 1,
    name: "Gerenciar Usuários",
    description: "Criar, editar e excluir usuários",
    module: "users",
    active: true,
    usersCount: 12,
  },
  {
    id: 2,
    name: "Visualizar Relatórios",
    description: "Acessar relatórios e métricas",
    module: "reports",
    active: true,
    usersCount: 45,
  },
  {
    id: 3,
    name: "Gerenciar Empresas",
    description: "Criar e editar empresas",
    module: "companies",
    active: true,
    usersCount: 8,
  },
  {
    id: 4,
    name: "Configurações Avançadas",
    description: "Acessar configurações do sistema",
    module: "settings",
    active: false,
    usersCount: 3,
  },
]

const roles = [
  {
    id: 1,
    name: "Super Admin",
    description: "Acesso total ao sistema",
    permissions: ["users", "companies", "reports", "settings"],
    usersCount: 2,
    color: "destructive",
  },
  {
    id: 2,
    name: "Admin",
    description: "Administrador com acesso limitado",
    permissions: ["users", "reports"],
    usersCount: 8,
    color: "default",
  },
  {
    id: 3,
    name: "Manager",
    description: "Gerente de equipe",
    permissions: ["reports"],
    usersCount: 15,
    color: "secondary",
  },
  {
    id: 4,
    name: "User",
    description: "Usuário padrão",
    permissions: [],
    usersCount: 234,
    color: "outline",
  },
]

const stats = [
  {
    title: "Total de Permissões",
    value: "24",
    icon: Shield,
    change: "+2",
  },
  {
    title: "Roles Ativos",
    value: "8",
    icon: Users,
    change: "+1",
  },
  {
    title: "Permissões Ativas",
    value: "18",
    icon: Settings,
    change: "+3",
  },
  {
    title: "Usuários com Acesso",
    value: "259",
    icon: Eye,
    change: "+12",
  },
]

export default function PermissionsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("permissions")

  const getModuleBadge = (module: string) => {
    const colors = {
      users: "default",
      companies: "secondary",
      reports: "outline",
      settings: "destructive",
    } as const

    return <Badge variant={colors[module as keyof typeof colors] || "secondary"}>{module}</Badge>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Permissões</h1>
          <p className="text-muted-foreground">Gerencie permissões e roles do sistema</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nova Permissão
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change} desde o mês passado</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 border-b">
        <button
          onClick={() => setActiveTab("permissions")}
          className={`pb-2 px-1 ${
            activeTab === "permissions" ? "border-b-2 border-primary text-primary" : "text-muted-foreground"
          }`}
        >
          Permissões
        </button>
        <button
          onClick={() => setActiveTab("roles")}
          className={`pb-2 px-1 ${
            activeTab === "roles" ? "border-b-2 border-primary text-primary" : "text-muted-foreground"
          }`}
        >
          Roles
        </button>
      </div>

      {activeTab === "permissions" && (
        <Card>
          <CardHeader>
            <CardTitle>Lista de Permissões</CardTitle>
            <CardDescription>Gerencie todas as permissões do sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar permissões..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Módulo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Usuários</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {permissions.map((permission) => (
                  <TableRow key={permission.id}>
                    <TableCell className="font-medium">{permission.name}</TableCell>
                    <TableCell>{permission.description}</TableCell>
                    <TableCell>{getModuleBadge(permission.module)}</TableCell>
                    <TableCell>
                      <Switch checked={permission.active} />
                    </TableCell>
                    <TableCell>{permission.usersCount} usuários</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Editar</DropdownMenuItem>
                          <DropdownMenuItem>Ver Usuários</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">Excluir</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {activeTab === "roles" && (
        <Card>
          <CardHeader>
            <CardTitle>Lista de Roles</CardTitle>
            <CardDescription>Gerencie roles e suas permissões</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {roles.map((role) => (
                <Card key={role.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{role.name}</CardTitle>
                      <Badge variant={role.color as any}>{role.usersCount} usuários</Badge>
                    </div>
                    <CardDescription>{role.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Permissões:</p>
                      <div className="flex flex-wrap gap-1">
                        {role.permissions.length > 0 ? (
                          role.permissions.map((permission) => (
                            <Badge key={permission} variant="outline" className="text-xs">
                              {permission}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-xs text-muted-foreground">Nenhuma permissão</span>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-end mt-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Editar</DropdownMenuItem>
                          <DropdownMenuItem>Ver Usuários</DropdownMenuItem>
                          <DropdownMenuItem>Duplicar</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">Excluir</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
