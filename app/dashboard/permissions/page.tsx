"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Shield, Users, Search, Plus, Eye, Edit, Trash2, UserCheck, Lock, Unlock, Filter } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Permission {
  id: string
  name: string
  displayName: string
  description?: string
  category: string
  isActive: boolean
  userPermissions: Array<{
    userId: string
    granted: boolean
    user: {
      id: string
      firstName: string
      lastName: string
      email: string
      role: string
    }
  }>
}

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: string
  isActive: boolean
}

export default function PermissionsPage() {
  const [permissions, setPermissions] = useState<Record<string, Permission[]>>({})
  const [users, setUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<string>("")
  const [userPermissions, setUserPermissions] = useState<Permission[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadPermissions()
    loadUsers()
  }, [])

  useEffect(() => {
    if (selectedUser) {
      loadUserPermissions(selectedUser)
    }
  }, [selectedUser])

  const loadPermissions = async () => {
    try {
      // Simular carregamento de permissões agrupadas por categoria
      const mockPermissions = {
        Dashboard: [
          {
            id: "1",
            name: "dashboard.view",
            displayName: "Visualizar Dashboard",
            description: "Permite visualizar o dashboard principal",
            category: "Dashboard",
            isActive: true,
            userPermissions: [],
          },
          {
            id: "2",
            name: "dashboard.analytics",
            displayName: "Ver Análises",
            description: "Permite ver métricas e análises detalhadas",
            category: "Dashboard",
            isActive: true,
            userPermissions: [],
          },
        ],
        Usuários: [
          {
            id: "3",
            name: "users.view",
            displayName: "Visualizar Usuários",
            description: "Permite visualizar lista de usuários",
            category: "Usuários",
            isActive: true,
            userPermissions: [],
          },
          {
            id: "4",
            name: "users.create",
            displayName: "Criar Usuários",
            description: "Permite criar novos usuários",
            category: "Usuários",
            isActive: true,
            userPermissions: [],
          },
          {
            id: "5",
            name: "users.edit",
            displayName: "Editar Usuários",
            description: "Permite editar dados de usuários",
            category: "Usuários",
            isActive: true,
            userPermissions: [],
          },
          {
            id: "6",
            name: "users.permissions",
            displayName: "Gerenciar Permissões",
            description: "Permite gerenciar permissões de usuários",
            category: "Usuários",
            isActive: true,
            userPermissions: [],
          },
        ],
        Conversas: [
          {
            id: "7",
            name: "conversations.view",
            displayName: "Visualizar Conversas",
            description: "Permite visualizar conversas",
            category: "Conversas",
            isActive: true,
            userPermissions: [],
          },
          {
            id: "8",
            name: "conversations.assign",
            displayName: "Atribuir Conversas",
            description: "Permite atribuir conversas a usuários",
            category: "Conversas",
            isActive: true,
            userPermissions: [],
          },
        ],
        Mensagens: [
          {
            id: "9",
            name: "messages.send",
            displayName: "Enviar Mensagens",
            description: "Permite enviar mensagens",
            category: "Mensagens",
            isActive: true,
            userPermissions: [],
          },
          {
            id: "10",
            name: "messages.mass",
            displayName: "Mensagens em Massa",
            description: "Permite enviar mensagens em massa",
            category: "Mensagens",
            isActive: true,
            userPermissions: [],
          },
        ],
      }

      setPermissions(mockPermissions)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar permissões",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const loadUsers = async () => {
    try {
      // Simular carregamento de usuários
      const mockUsers = [
        {
          id: "1",
          firstName: "João",
          lastName: "Silva",
          email: "joao@empresa.com",
          role: "COMPANY_ADMIN",
          isActive: true,
        },
        {
          id: "2",
          firstName: "Maria",
          lastName: "Santos",
          email: "maria@empresa.com",
          role: "SELLER",
          isActive: true,
        },
        {
          id: "3",
          firstName: "Pedro",
          lastName: "Costa",
          email: "pedro@empresa.com",
          role: "SELLER",
          isActive: true,
        },
      ]

      setUsers(mockUsers)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar usuários",
        variant: "destructive",
      })
    }
  }

  const loadUserPermissions = async (userId: string) => {
    try {
      // Simular carregamento de permissões do usuário
      const mockUserPermissions = Object.values(permissions)
        .flat()
        .map((permission) => ({
          ...permission,
          granted: Math.random() > 0.5, // Simular permissões aleatórias
          source: Math.random() > 0.5 ? "user" : "role",
        }))

      setUserPermissions(mockUserPermissions as Permission[])
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar permissões do usuário",
        variant: "destructive",
      })
    }
  }

  const handlePermissionToggle = async (userId: string, permissionId: string, granted: boolean) => {
    try {
      // Simular atualização de permissão
      await new Promise((resolve) => setTimeout(resolve, 500))

      setUserPermissions((prev) =>
        prev.map((perm) => (perm.id === permissionId ? { ...perm, granted, source: "user" } : perm)),
      )

      toast({
        title: "Sucesso",
        description: `Permissão ${granted ? "concedida" : "removida"} com sucesso`,
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar permissão",
        variant: "destructive",
      })
    }
  }

  const filteredPermissions = Object.entries(permissions).reduce(
    (acc, [category, perms]) => {
      if (selectedCategory !== "all" && category !== selectedCategory) {
        return acc
      }

      const filtered = perms.filter(
        (perm) =>
          perm.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          perm.description?.toLowerCase().includes(searchTerm.toLowerCase()),
      )

      if (filtered.length > 0) {
        acc[category] = filtered
      }

      return acc
    },
    {} as Record<string, Permission[]>,
  )

  const categories = Object.keys(permissions)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Controle de Permissões</h1>
          <p className="text-muted-foreground">Gerencie permissões granulares por usuário e papel</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nova Permissão
        </Button>
      </div>

      <Tabs defaultValue="permissions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="permissions">
            <Shield className="h-4 w-4 mr-2" />
            Permissões
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users className="h-4 w-4 mr-2" />
            Usuários
          </TabsTrigger>
        </TabsList>

        <TabsContent value="permissions" className="space-y-4">
          {/* Filtros */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Filtros</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Buscar permissões..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as categorias</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Permissões */}
          <div className="space-y-6">
            {Object.entries(filteredPermissions).map(([category, perms]) => (
              <Card key={category}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    {category}
                    <Badge variant="secondary">{perms.length}</Badge>
                  </CardTitle>
                  <CardDescription>Permissões da categoria {category}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {perms.map((permission) => (
                      <div key={permission.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{permission.displayName}</h4>
                            <Badge variant={permission.isActive ? "default" : "secondary"}>
                              {permission.isActive ? "Ativa" : "Inativa"}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{permission.description}</p>
                          <p className="text-xs text-muted-foreground font-mono">{permission.name}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Lista de Usuários */}
            <Card>
              <CardHeader>
                <CardTitle>Usuários</CardTitle>
                <CardDescription>Selecione um usuário para gerenciar suas permissões</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-2">
                    {users.map((user) => (
                      <div
                        key={user.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedUser === user.id ? "bg-primary/10 border-primary" : "hover:bg-muted"
                        }`}
                        onClick={() => setSelectedUser(user.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">
                              {user.firstName} {user.lastName}
                            </p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                          <Badge variant="outline">{user.role}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Permissões do Usuário */}
            <div className="lg:col-span-2">
              {selectedUser ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <UserCheck className="h-5 w-5" />
                      Permissões do Usuário
                    </CardTitle>
                    <CardDescription>Gerencie as permissões específicas do usuário selecionado</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-96">
                      <div className="space-y-6">
                        {Object.entries(
                          userPermissions.reduce(
                            (acc, perm) => {
                              if (!acc[perm.category]) {
                                acc[perm.category] = []
                              }
                              acc[perm.category].push(perm)
                              return acc
                            },
                            {} as Record<string, any[]>,
                          ),
                        ).map(([category, perms]) => (
                          <div key={category} className="space-y-3">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{category}</h4>
                              <Separator className="flex-1" />
                            </div>
                            <div className="space-y-2">
                              {perms.map((permission) => (
                                <div
                                  key={permission.id}
                                  className="flex items-center justify-between p-3 border rounded-lg"
                                >
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                      <Label htmlFor={`perm-${permission.id}`} className="font-medium">
                                        {permission.displayName}
                                      </Label>
                                      <Badge
                                        variant={permission.source === "role" ? "secondary" : "default"}
                                        className="text-xs"
                                      >
                                        {permission.source === "role" ? "Papel" : "Usuário"}
                                      </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{permission.description}</p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {permission.granted ? (
                                      <Unlock className="h-4 w-4 text-green-500" />
                                    ) : (
                                      <Lock className="h-4 w-4 text-red-500" />
                                    )}
                                    <Switch
                                      id={`perm-${permission.id}`}
                                      checked={permission.granted}
                                      onCheckedChange={(checked) =>
                                        handlePermissionToggle(selectedUser, permission.id, checked)
                                      }
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="flex items-center justify-center h-96">
                    <div className="text-center space-y-2">
                      <Users className="h-12 w-12 text-muted-foreground mx-auto" />
                      <p className="text-muted-foreground">Selecione um usuário para gerenciar suas permissões</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
