"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { BarChart3, TrendingUp, Users, MessageCircle, Download, DollarSign, Activity } from "lucide-react"

const stats = [
  {
    title: "Mensagens Enviadas",
    value: "12,345",
    icon: MessageCircle,
    change: "+12.5%",
    trend: "up",
  },
  {
    title: "Usuários Ativos",
    value: "1,234",
    icon: Users,
    change: "+8.2%",
    trend: "up",
  },
  {
    title: "Taxa de Conversão",
    value: "23.4%",
    icon: TrendingUp,
    change: "+2.1%",
    trend: "up",
  },
  {
    title: "Receita Mensal",
    value: "R$ 45,678",
    icon: DollarSign,
    change: "+15.3%",
    trend: "up",
  },
]

const recentReports = [
  {
    id: 1,
    name: "Relatório de Conversas - Janeiro",
    type: "Conversas",
    createdAt: "2024-01-15",
    status: "completed",
    size: "2.3 MB",
  },
  {
    id: 2,
    name: "Relatório de Usuários - Janeiro",
    type: "Usuários",
    createdAt: "2024-01-14",
    status: "completed",
    size: "1.8 MB",
  },
  {
    id: 3,
    name: "Relatório de Receita - Dezembro",
    type: "Financeiro",
    createdAt: "2024-01-10",
    status: "processing",
    size: "Processando...",
  },
]

const chartData = [
  { name: "Jan", messages: 4000, users: 2400, revenue: 2400 },
  { name: "Fev", messages: 3000, users: 1398, revenue: 2210 },
  { name: "Mar", messages: 2000, users: 9800, revenue: 2290 },
  { name: "Abr", messages: 2780, users: 3908, revenue: 2000 },
  { name: "Mai", messages: 1890, users: 4800, revenue: 2181 },
  { name: "Jun", messages: 2390, users: 3800, revenue: 2500 },
]

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState("30d")
  const [reportType, setReportType] = useState("all")

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: "default",
      processing: "outline",
      failed: "destructive",
    } as const

    const labels = {
      completed: "Concluído",
      processing: "Processando",
      failed: "Falhou",
    } as const

    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Relatórios</h1>
          <p className="text-muted-foreground">Visualize métricas e gere relatórios detalhados</p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Últimos 7 dias</SelectItem>
              <SelectItem value="30d">Últimos 30 dias</SelectItem>
              <SelectItem value="90d">Últimos 90 dias</SelectItem>
              <SelectItem value="1y">Último ano</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>
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
              <p className="text-xs text-muted-foreground flex items-center">
                <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                {stat.change} desde o período anterior
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Mensagens por Mês</CardTitle>
            <CardDescription>Volume de mensagens enviadas nos últimos 6 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
              <div className="text-center">
                <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">Gráfico de mensagens seria renderizado aqui</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Usuários Ativos</CardTitle>
            <CardDescription>Crescimento de usuários ativos mensalmente</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
              <div className="text-center">
                <Activity className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">Gráfico de usuários seria renderizado aqui</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Reports */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Relatórios Recentes</CardTitle>
              <CardDescription>Histórico de relatórios gerados</CardDescription>
            </div>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Tipo de relatório" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="conversations">Conversas</SelectItem>
                <SelectItem value="users">Usuários</SelectItem>
                <SelectItem value="financial">Financeiro</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentReports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">{report.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {report.type} • {report.createdAt} • {report.size}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusBadge(report.status)}
                  {report.status === "completed" && (
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
          <CardDescription>Gere relatórios personalizados rapidamente</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Button variant="outline" className="h-20 flex-col bg-transparent">
              <MessageCircle className="h-6 w-6 mb-2" />
              Relatório de Conversas
            </Button>
            <Button variant="outline" className="h-20 flex-col bg-transparent">
              <Users className="h-6 w-6 mb-2" />
              Relatório de Usuários
            </Button>
            <Button variant="outline" className="h-20 flex-col bg-transparent">
              <DollarSign className="h-6 w-6 mb-2" />
              Relatório Financeiro
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
