"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart3,
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  MessageCircle,
  Users,
  Building,
  DollarSign,
} from "lucide-react"

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState("30d")
  const [reportType, setReportType] = useState("overview")

  const stats = [
    {
      title: "Total de Conversas",
      value: "2,847",
      change: "+12.5%",
      trend: "up",
      icon: MessageCircle,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Novos Usuários",
      value: "156",
      change: "+8.2%",
      trend: "up",
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Empresas Ativas",
      value: "42",
      change: "+3.1%",
      trend: "up",
      icon: Building,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Receita Total",
      value: "R$ 28.450",
      change: "-2.4%",
      trend: "down",
      icon: DollarSign,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ]

  const reports = [
    {
      id: "1",
      title: "Relatório de Conversas",
      description: "Análise detalhada das conversas por período",
      type: "conversations",
      lastGenerated: "2024-01-20",
      status: "ready",
    },
    {
      id: "2",
      title: "Relatório de Usuários",
      description: "Estatísticas de usuários e atividade",
      type: "users",
      lastGenerated: "2024-01-19",
      status: "ready",
    },
    {
      id: "3",
      title: "Relatório Financeiro",
      description: "Receitas, assinaturas e comissões",
      type: "financial",
      lastGenerated: "2024-01-18",
      status: "generating",
    },
    {
      id: "4",
      title: "Relatório de Performance",
      description: "Métricas de performance do sistema",
      type: "performance",
      lastGenerated: "2024-01-17",
      status: "ready",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ready":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Pronto</Badge>
      case "generating":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Gerando</Badge>
      case "error":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Erro</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Relatórios</h1>
          <p className="text-muted-foreground">Visualize métricas e gere relatórios detalhados</p>
        </div>
        <div className="flex space-x-2">
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
        {stats.map((stat, index) => {
          const Icon = stat.icon
          const TrendIcon = stat.trend === "up" ? TrendingUp : TrendingDown
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <div className="flex items-center space-x-1 mt-1">
                      <TrendIcon className={`h-3 w-3 ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`} />
                      <span className={`text-xs ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                        {stat.change}
                      </span>
                      <span className="text-xs text-muted-foreground">vs período anterior</span>
                    </div>
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

      {/* Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Visão Geral - Últimos 30 dias</CardTitle>
          <CardDescription>Gráfico de conversas e atividade dos usuários</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <BarChart3 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500">Gráfico será implementado aqui</p>
              <p className="text-sm text-gray-400">Dados de conversas, usuários e receita</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      <Card>
        <CardHeader>
          <CardTitle>Relatórios Disponíveis</CardTitle>
          <CardDescription>Gere e baixe relatórios detalhados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {reports.map((report) => (
              <Card key={report.id} className="border-2">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{report.title}</h3>
                    {getStatusBadge(report.status)}
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{report.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>Último: {new Date(report.lastGenerated).toLocaleDateString("pt-BR")}</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" disabled={report.status === "generating"}>
                        Gerar
                      </Button>
                      <Button variant="outline" size="sm" disabled={report.status !== "ready"}>
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
