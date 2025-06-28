"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Building, Save, Globe, Phone, Mail, MapPin, Users, Calendar } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function CompanySettings() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [company, setCompany] = useState({
    name: "Empresa Digital LTDA",
    tradeName: "Digital Corp",
    cnpj: "12.345.678/0001-90",
    email: "contato@empresa.com",
    phone: "+55 11 3333-4444",
    website: "https://empresa.com",
    address: "Rua das Empresas, 123",
    city: "São Paulo",
    state: "SP",
    zipCode: "01234-567",
    country: "Brasil",
    industry: "technology",
    size: "medium",
    description: "Empresa especializada em soluções digitais e automação de processos.",
    foundedYear: "2020",
  })

  const handleSave = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: "Configurações da empresa atualizadas",
      description: "As informações da empresa foram salvas com sucesso.",
    })

    setIsLoading(false)
  }

  const handleInputChange = (field: string, value: string) => {
    setCompany((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Informações da Empresa
          </CardTitle>
          <CardDescription>Configure as informações da sua empresa e como ela aparece na plataforma</CardDescription>
        </CardHeader>
      </Card>

      {/* Informações básicas */}
      <Card>
        <CardHeader>
          <CardTitle>Dados Básicos</CardTitle>
          <CardDescription>Informações principais da empresa</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Razão Social</Label>
              <Input id="name" value={company.name} onChange={(e) => handleInputChange("name", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tradeName">Nome Fantasia</Label>
              <Input
                id="tradeName"
                value={company.tradeName}
                onChange={(e) => handleInputChange("tradeName", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cnpj">CNPJ</Label>
              <div className="flex items-center gap-2">
                <Input id="cnpj" value={company.cnpj} onChange={(e) => handleInputChange("cnpj", e.target.value)} />
                <Badge variant="secondary">Verificado</Badge>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="foundedYear" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Ano de Fundação
              </Label>
              <Input
                id="foundedYear"
                value={company.foundedYear}
                onChange={(e) => handleInputChange("foundedYear", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição da Empresa</Label>
            <Textarea
              id="description"
              placeholder="Descreva sua empresa..."
              value={company.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Contato */}
      <Card>
        <CardHeader>
          <CardTitle>Informações de Contato</CardTitle>
          <CardDescription>Como os clientes podem entrar em contato</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Corporativo
              </Label>
              <Input
                id="email"
                type="email"
                value={company.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Telefone
              </Label>
              <Input id="phone" value={company.phone} onChange={(e) => handleInputChange("phone", e.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="website" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Website
            </Label>
            <Input
              id="website"
              type="url"
              value={company.website}
              onChange={(e) => handleInputChange("website", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Endereço */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Endereço
          </CardTitle>
          <CardDescription>Localização da empresa</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address">Endereço</Label>
            <Input
              id="address"
              value={company.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">Cidade</Label>
              <Input id="city" value={company.city} onChange={(e) => handleInputChange("city", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">Estado</Label>
              <Input id="state" value={company.state} onChange={(e) => handleInputChange("state", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="zipCode">CEP</Label>
              <Input
                id="zipCode"
                value={company.zipCode}
                onChange={(e) => handleInputChange("zipCode", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">País</Label>
            <Select value={company.country} onValueChange={(value) => handleInputChange("country", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Brasil">Brasil</SelectItem>
                <SelectItem value="Argentina">Argentina</SelectItem>
                <SelectItem value="Chile">Chile</SelectItem>
                <SelectItem value="Colômbia">Colômbia</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Classificação */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Classificação da Empresa
          </CardTitle>
          <CardDescription>Informações sobre o segmento e tamanho da empresa</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="industry">Setor</Label>
              <Select value={company.industry} onValueChange={(value) => handleInputChange("industry", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technology">Tecnologia</SelectItem>
                  <SelectItem value="retail">Varejo</SelectItem>
                  <SelectItem value="healthcare">Saúde</SelectItem>
                  <SelectItem value="education">Educação</SelectItem>
                  <SelectItem value="finance">Financeiro</SelectItem>
                  <SelectItem value="manufacturing">Manufatura</SelectItem>
                  <SelectItem value="services">Serviços</SelectItem>
                  <SelectItem value="other">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="size">Tamanho da Empresa</Label>
              <Select value={company.size} onValueChange={(value) => handleInputChange("size", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="micro">Micro (1-9 funcionários)</SelectItem>
                  <SelectItem value="small">Pequena (10-49 funcionários)</SelectItem>
                  <SelectItem value="medium">Média (50-249 funcionários)</SelectItem>
                  <SelectItem value="large">Grande (250+ funcionários)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ações */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Salvar Configurações</p>
              <p className="text-sm text-muted-foreground">As alterações serão aplicadas em toda a plataforma</p>
            </div>
            <Button onClick={handleSave} disabled={isLoading} className="gap-2">
              <Save className="h-4 w-4" />
              {isLoading ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
