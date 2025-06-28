"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Download, FileText, CalendarIcon, BarChart3, Users, MessageCircle, TrendingUp, Building } from "lucide-react"
import { reportsApi, companiesApi } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface ExportReportModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function ExportReportModal({ open, onOpenChange, onSuccess }: ExportReportModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [companies, setCompanies] = useState<any[]>([])
  const [formData, setFormData] = useState({
    reportType: "",
    format: "",
    companyId: "",
    includeCharts: true,
    includeDetails: true,
    includeComparisons: false,
  })

  const { toast } = useToast()

  const reportTypes = [
    { value: "performance", label: "Relatório de Performance", icon: TrendingUp },
    { value: "conversations", label: "Relatório de Conversas", icon: MessageCircle },
    { value: "users", label: "Relatório de Usuários", icon: Users },
    { value: "companies", label: "Relatório de Empresas", icon: Building },
    { value: "leads", label: "Relatório de Leads", icon: BarChart3 },
    { value: "complete", label: "Relatório Completo", icon: FileText },
  ]

  const formats = [
    { value: "pdf", label: "PDF", description: "Documento formatado para impressão" },
    { value: "excel", label: "Excel", description: "Planilha para análise de dados" },
    { value: "csv", label: "CSV", description: "Dados separados por vírgula" },
    { value: "json", label: "JSON", description: "Dados estruturados para API" },
  ]

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const response = await companiesApi.getAll()
        setCompanies([{ id: "all", name: "Todas as empresas" }, ...(response.companies || [])])
      } catch (error) {
        console.error("Error loading companies:", error)
      }
    }

    if (open) {
      loadCompanies()
    }
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Validações
      if (!formData.reportType) {
        throw new Error("Tipo de relatório é obrigatório")
      }
      if (!formData.format) {
        throw new Error("Formato é obrigatório")
      }
      if (!startDate) {
        throw new Error("Data de início é obrigatória")
      }
      if (!endDate) {
        throw new Error("Data de fim é obrigatória")
      }
      if (startDate > endDate) {
        throw new Error("Data de início deve ser anterior à data de fim")
      }

      const reportData = {
        ...formData,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      }

      const response = await reportsApi.generate(reportData)

      // Download do arquivo
      const link = document.createElement("a")
      link.href = response.downloadUrl
      link.download = response.fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "Sucesso",
        description: "Relatório gerado e baixado com sucesso!",
      })

      // Reset form
      setFormData({
        reportType: "",
        format: "",
        companyId: "",
        includeCharts: true,
        includeDetails: true,
        includeComparisons: false,
      })
      setStartDate(undefined)
      setEndDate(undefined)

      onSuccess?.()
      onOpenChange(false)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Download className="mr-2 h-5 w-5 text-green-600" />
            Exportar Relatório
          </DialogTitle>
          <DialogDescription>
            Configure e exporte relatórios personalizados. Escolha o tipo, período e formato desejado.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="reportType">Tipo de Relatório</Label>
            <Select
              value={formData.reportType}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, reportType: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de relatório" />
              </SelectTrigger>
              <SelectContent>
                {reportTypes.map((type) => {
                  const Icon = type.icon
                  return (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center">
                        <Icon className="mr-2 h-4 w-4" />
                        {type.label}
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Data de Início</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP", { locale: ptBR }) : "Selecionar data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Data de Fim</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP", { locale: ptBR }) : "Selecionar data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyId">Empresa</Label>
            <Select
              value={formData.companyId}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, companyId: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma empresa" />
              </SelectTrigger>
              <SelectContent>
                {companies.map((company) => (
                  <SelectItem key={company.id} value={company.id}>
                    <div className="flex items-center">
                      <Building className="mr-2 h-4 w-4" />
                      {company.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="format">Formato de Exportação</Label>
            <Select
              value={formData.format}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, format: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o formato" />
              </SelectTrigger>
              <SelectContent>
                {formats.map((format) => (
                  <SelectItem key={format.value} value={format.value}>
                    <div className="flex flex-col">
                      <span className="font-medium">{format.label}</span>
                      <span className="text-sm text-gray-500">{format.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Opções de Conteúdo</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeCharts"
                  checked={formData.includeCharts}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, includeCharts: checked as boolean }))}
                />
                <Label htmlFor="includeCharts" className="text-sm">
                  Incluir gráficos e visualizações
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeDetails"
                  checked={formData.includeDetails}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, includeDetails: checked as boolean }))
                  }
                />
                <Label htmlFor="includeDetails" className="text-sm">
                  Incluir dados detalhados
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeComparisons"
                  checked={formData.includeComparisons}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, includeComparisons: checked as boolean }))
                  }
                />
                <Label htmlFor="includeComparisons" className="text-sm">
                  Incluir comparações com período anterior
                </Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-green-600 hover:bg-green-700">
              {isLoading ? "Gerando..." : "Exportar Relatório"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
