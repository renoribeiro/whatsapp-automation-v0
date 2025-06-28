"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BarChart3, Download, TrendingUp, Users, MessageCircle, DollarSign } from "lucide-react"
import { RevenueChart } from "@/components/dashboard/revenue-chart"
import { ConversationsChart } from "@/components/dashboard/conversations-chart"
import { ExportReportModal } from "@/components/dashboard/modals/export-report-modal"
import { useState } from "react"

export default function ReportsPage() {
  const [open, setOpen] = useState(false)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Relatórios</h2>
          <p className="text-muted-foreground">Analytics e métricas detalhadas da plataforma</p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Download className="mr-2 h-4 w-4" />
          Exportar Relatório
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 45.231,89</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +20.1% em relação ao mês passado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mensagens Enviadas</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.350.000</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +15.3% em relação ao mês passado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Empresas Ativas</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">573</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +8.2% em relação ao mês passado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12.5%</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +2.1% em relação ao mês passado
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <RevenueChart />
        <ConversationsChart />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Empresas por Receita</CardTitle>
            <CardDescription>Empresas que mais geram receita este mês</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "TechStart", revenue: "R$ 12.450", growth: "+25%" },
                { name: "Fashion Store", revenue: "R$ 8.920", growth: "+18%" },
                { name: "AutoPeças Plus", revenue: "R$ 6.780", growth: "+12%" },
                { name: "Beauty Care", revenue: "R$ 5.340", growth: "+8%" },
                { name: "FoodDelivery", revenue: "R$ 4.890", growth: "+15%" },
              ].map((company, index) => (
                <div key={company.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-whatsapp-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{company.name}</p>
                      <p className="text-sm text-muted-foreground">{company.revenue}</p>
                    </div>
                  </div>
                  <Badge variant="secondary">{company.growth}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Métricas de Engajamento</CardTitle>
            <CardDescription>Performance das conversas e atendimento</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Taxa de Resposta</span>
                <span className="text-sm font-bold">94.2%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-whatsapp-500 h-2 rounded-full" style={{ width: "94.2%" }}></div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Tempo Médio de Resposta</span>
                <span className="text-sm font-bold">2.3 min</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: "85%" }}></div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Satisfação do Cliente</span>
                <span className="text-sm font-bold">4.8/5</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: "96%" }}></div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Conversões</span>
                <span className="text-sm font-bold">12.5%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: "62.5%" }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <ExportReportModal open={open} setOpen={setOpen} />
    </div>
  )
}
