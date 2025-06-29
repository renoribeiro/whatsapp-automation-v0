"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  MessageCircle,
  Users,
  TrendingUp,
  Shield,
  LogOut,
  Settings,
  Bell,
  Calendar,
  BarChart3,
  Phone,
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

export default function DashboardPage() {
  const { getCurrentUser, logout, isAuthenticated, isInitialized } = useAuth()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    console.log("🔍 [Dashboard] Verificando autenticação...")
    console.log("🔍 [Dashboard] isInitialized:", isInitialized)
    console.log("🔍 [Dashboard] isAuthenticated:", isAuthenticated())

    if (!isInitialized) {
      console.log("⏳ [Dashboard] Aguardando inicialização...")
      return
    }

    // Verificar localStorage diretamente também
    if (typeof window !== "undefined") {
      const authData = localStorage.getItem("auth-token")
      console.log("🔍 [Dashboard] localStorage auth-token:", !!authData)

      if (authData) {
        try {
          const parsed = JSON.parse(authData)
          console.log("✅ [Dashboard] Dados do localStorage:", parsed.user)
          setUser(parsed.user)
          setIsLoading(false)
          return
        } catch (error) {
          console.error("❌ [Dashboard] Erro ao parsear localStorage:", error)
          localStorage.removeItem("auth-token")
        }
      }
    }

    if (!isAuthenticated()) {
      console.log("❌ [Dashboard] Usuário não autenticado, redirecionando...")
      window.location.href = "/auth/login"
      return
    }

    const currentUser = getCurrentUser()
    console.log("👤 [Dashboard] Usuário atual:", currentUser)
    setUser(currentUser)
    setIsLoading(false)
  }, [isAuthenticated, getCurrentUser, isInitialized])

  const handleLogout = () => {
    console.log("🚪 [Dashboard] Fazendo logout...")
    logout()
  }

  if (isLoading || !isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="bg-red-100 p-4 rounded-lg mb-4">
            <p className="text-red-800">Erro: Usuário não encontrado</p>
          </div>
          <Button onClick={() => (window.location.href = "/auth/login")}>Ir para Login</Button>
        </div>
      </div>
    )
  }

  const stats = [
    {
      title: "Conversas Ativas",
      value: "1,234",
      change: "+12%",
      icon: MessageCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Contatos",
      value: "5,678",
      change: "+8%",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Taxa de Conversão",
      value: "23.5%",
      change: "+5%",
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Uptime",
      value: "99.9%",
      change: "0%",
      icon: Shield,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ]

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "SUPER_ADMIN":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Super Admin</Badge>
      case "COMPANY_ADMIN":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Admin da Empresa</Badge>
      case "USER":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Usuário</Badge>
      default:
        return <Badge variant="secondary">{role}</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="bg-green-600 p-2 rounded-lg">
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">WhatsApp Platform</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Dashboard</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  Bem-vindo, {user.firstName} {user.lastName}! 🎉
                </h2>
                <p className="text-green-100 mb-4">
                  Email: {user.email} | Empresa: {user.company || "Não informada"}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-green-100">Nível de acesso:</span>
                  {getRoleBadge(user.role)}
                </div>
              </div>
              <div className="hidden md:block">
                <div className="bg-white/20 p-4 rounded-lg">
                  <MessageCircle className="h-12 w-12 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Success Alert */}
        <div className="mb-8">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="bg-green-600 rounded-full p-2 mr-3">
                <MessageCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-green-800">✅ Login realizado com sucesso!</h3>
                <p className="text-green-600">
                  Você está conectado como <strong>{user.role}</strong> e pode acessar todas as funcionalidades da
                  plataforma.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                      <p className="text-sm text-green-600 font-medium">{stat.change} vs mês anterior</p>
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

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Ações Rápidas
              </CardTitle>
              <CardDescription>Acesse rapidamente as funcionalidades principais</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <Phone className="h-4 w-4 mr-2" />
                Nova Conversa
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <Users className="h-4 w-4 mr-2" />
                Gerenciar Contatos
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <BarChart3 className="h-4 w-4 mr-2" />
                Ver Relatórios
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Configurações
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Atividade Recente
              </CardTitle>
              <CardDescription>Últimas ações realizadas na plataforma</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <MessageCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Login realizado com sucesso</p>
                    <p className="text-xs text-gray-500">Agora mesmo</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Users className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Dashboard carregado</p>
                    <p className="text-xs text-gray-500">Há poucos segundos</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-purple-100 p-2 rounded-full">
                    <TrendingUp className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Sistema funcionando perfeitamente</p>
                    <p className="text-xs text-gray-500">Status: Online</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
