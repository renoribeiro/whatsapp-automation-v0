"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { Textarea } from "@/components/ui/textarea"
import { Building, Mail, Phone, MapPin, FileText } from "lucide-react"
import { useCompanies } from "@/hooks/use-companies"
import { agenciesApi } from "@/lib/api"

interface CreateCompanyModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function CreateCompanyModal({ open, onOpenChange, onSuccess }: CreateCompanyModalProps) {
  const [error, setError] = useState("")
  const [agencies, setAgencies] = useState<any[]>([])
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    document: "",
    address: "",
    agencyId: "",
    isActive: true,
  })

  const { createCompany, isLoading } = useCompanies()

  useEffect(() => {
    const loadAgencies = async () => {
      try {
        const response = await agenciesApi.getAll()
        setAgencies(response || [])
      } catch (error) {
        console.error("Error loading agencies:", error)
      }
    }

    if (open) {
      loadAgencies()
    }
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      // Validações
      if (!formData.name.trim()) {
        throw new Error("Nome da empresa é obrigatório")
      }
      if (!formData.email.trim()) {
        throw new Error("Email é obrigatório")
      }
      if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
        throw new Error("Email deve ter um formato válido")
      }

      await createCompany(formData)

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        document: "",
        address: "",
        agencyId: "",
        isActive: true,
      })

      onSuccess?.()
      onOpenChange(false)
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Building className="mr-2 h-5 w-5 text-purple-600" />
            Nova Empresa
          </DialogTitle>
          <DialogDescription>
            Cadastre uma nova empresa no sistema. Preencha as informações da empresa.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Nome da Empresa</Label>
            <div className="relative">
              <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="name"
                placeholder="Empresa Exemplo Ltda"
                className="pl-10"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="contato@empresa.com"
                  className="pl-10"
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="phone"
                  placeholder="+55 11 99999-9999"
                  className="pl-10"
                  value={formData.phone}
                  onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="document">CNPJ (Opcional)</Label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="document"
                placeholder="12.345.678/0001-90"
                className="pl-10"
                value={formData.document}
                onChange={(e) => setFormData((prev) => ({ ...prev, document: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Endereço (Opcional)</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Textarea
                id="address"
                placeholder="Rua Exemplo, 123 - Bairro - Cidade/Estado - CEP"
                className="pl-10 min-h-[80px]"
                value={formData.address}
                onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="agencyId">Agência Responsável (Opcional)</Label>
            <Select
              value={formData.agencyId}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, agencyId: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma agência" />
              </SelectTrigger>
              <SelectContent>
                {agencies.map((agency) => (
                  <SelectItem key={agency.id} value={agency.id}>
                    <div className="flex items-center">
                      <Building className="mr-2 h-4 w-4" />
                      {agency.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isActive: checked as boolean }))}
            />
            <Label htmlFor="isActive" className="text-sm">
              Empresa ativa (pode usar o sistema)
            </Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-purple-600 hover:bg-purple-700">
              {isLoading ? "Criando..." : "Criar Empresa"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
