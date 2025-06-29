"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, Plus, Search, Users, Lock, Unlock, Settings } from "lucide-react"

interface Permission {
  id: string
  name: string
  description: string
  resource: string
  action: string
  isActive: boolean
}

interface Role {
  id: string
  name: string
  description: string
  permissions: string[]
  userCount: number
}

const mockPermissions: Permission[] = [
  {
    id: "1",
    name: "Visualizar Usuários",
    description: "Permite visualizar a lista de usuários",
    resource: "users",
    action: "read",
    isActive: true,
  },
  {
    id: "2",
    name: "Criar Usuários",
    description: "Permite criar novos usuários",
    resource: "users",
    action: "create",
    isActive: true,
  },
  {
    id: "3",
    name: "Editar Usuários",
    description: "Permite editar informações de usuários",
    resource: "users",
    action: "update",
    isActive: true,
  },
  {
    id: "4",
    name: "Excluir Usuários",
    description: "Permite excluir usuários",
    resource: "users",
    action: "delete",
    isActive: false,
  },
  {
    id: "5",
    name: "Visualizar Empresas",
    description: "Permite visualizar a lista de empresas",
    resource: "companies",
    action: "read",
    isActive: true,
  },
  {
    id: "6",
    name: "Gerenciar Conversas",
    description: "Permite gerenciar conversas do WhatsApp",
    resource: "conversations",
    action: "manage",
    isActive: true,
  },
]

const mockRoles: Role[] = [
  {
    id: "1",
    name: "Super Admin",
    description: "Acesso total ao sistema",
    permissions: ["1", "2", "3", "4", "5", "6"],
    userCount: 2,
  },
  {
    id: "2",
    name: "Admin da Empresa",
    description: "Administrador de empresa com acesso limitado",
    permissions: ["1", "2", "3", "5", "6"],
    userCount: 8,
  },
  {
    id: "3",
    name: "Usuário",
    description: "Usuário padrão com acesso básico",
    permissions: ["1", "5", "6"],
    userCount: 25,
  },
]

export default function PermissionsPage() {
  const [permissions, setPermissions] = useState<Permission[]>(mockPermissions)
  const [roles, setRoles] = useState<Role[]>(mockRoles)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredPermissions = permissions.filter(
    (permission) =>
      permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      permission.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      permission.resource.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const togglePermission = (id: string) => {
    setPermissions(permissions.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p)))
  }

  const getResourceBadge = (resource: string) => {
    const colors = {
      users: "bg-blue-100 text-blue-800 border-blue-200",
      companies: "bg-green-100 text-green-800 border-green-200",
      conversations: "bg-purple-100 text-purple-800 border-purple-200",
      reports: "bg-orange-100 text-orange-800 border-orange-200",
    }

    return (
      <Badge className={colors[resource as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-200"}>
        {resource}
      </Badge>
    )
  }

  const getActionBadge = (action: string) => {
    const colors = {
      read: "bg-green-100 text-green-800 border-green-200",
      create: "bg-blue-100 text-blue-800 border-blue-200",
      update: "bg-yellow-100 text-yellow-800 border-yellow-200",
      delete: "bg-red-100 text-red-800 border-red-200",
      manage: "bg-purple-100 text-purple-800 border-purple-200",
    }

    return (
      <Badge className={colors[action as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-200"}>
        {action}
      </Badge>
    )
  }

  const stats = [
    {
      title: "Total de Permissões",
      value: permissions.length.toString(),
      icon: Shield,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Permissões Ativas",
      value: permissions.filter((p) => p.isActive).length.toString(),
      icon: Unlock,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Funções Criadas",
      value: roles.length.toString(),
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Permissões Inativas",
      value: permissions.filter((p) => !p.isActive).length.toString(),
      icon: Lock,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Permissões</h1>
          <p className="text-muted-foreground">Gerencie permissões e funções de usuários</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nova Permissão
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

      {/* Tabs */}
      <Tabs defaultValue="permissions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="permissions">Permissões</TabsTrigger>
          <TabsTrigger value="roles">Funções</TabsTrigger>
        </TabsList>

        <TabsContent value="permissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Lista de Permissões</CardTitle>
              <CardDescription>Gerencie todas as permissões do sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar permissões..."
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
                      <TableHead>Descrição</TableHead>
                      <TableHead>Recurso</TableHead>
                      <TableHead>Ação</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPermissions.map((permission) => (
                      <TableRow key={permission.id}>
                        <TableCell className="font-medium">{permission.name}</TableCell>
                        <TableCell>{permission.description}</TableCell>
                        <TableCell>{getResourceBadge(permission.resource)}</TableCell>
                        <TableCell>{getActionBadge(permission.action)}</TableCell>
                        <TableCell>
                          <Badge
                            className={permission.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                          >
                            {permission.isActive ? "Ativa" : "Inativa"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Switch
                            checked={permission.isActive}
                            onCheckedChange={() => togglePermission(permission.id)}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {roles.map((role) => (
              <Card key={role.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {role.name}
                    <Badge variant="secondary">{role.userCount} usuários</Badge>
                  </CardTitle>
                  <CardDescription>{role.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Permissões:</p>
                    <div className="flex flex-wrap gap-1">
                      {role.permissions.map((permId) => {
                        const permission = permissions.find((p) => p.id === permId)
                        return permission ? (
                          <Badge key={permId} variant="outline" className="text-xs">
                            {permission.name}
                          </Badge>
                        ) : null
                      })}
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-4">
                    <Button variant="outline" size="sm">
                      <Settings className="mr-2 h-4 w-4" />
                      Editar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
