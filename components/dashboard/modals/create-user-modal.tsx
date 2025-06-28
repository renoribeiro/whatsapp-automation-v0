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
import { User, Mail, Phone, Building, Shield, Eye, EyeOff } from "lucide-react"
import { useUsers } from "@/hooks/use-users"
import { companiesApi, agenciesApi } from "@/lib/api"

interface CreateUserModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function CreateUserModal({ open, onOpenChange, onSuccess }: CreateUserModalProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [companies, setCompanies] = useState<any[]>([])
  const [agencies, setAgencies] = useState<any[]>([])
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    role: "",
    companyId: "",
    agencyId: "",
    isActive: true,
  })

  const { createUser, isLoading } = useUsers()

  const roles = [
    { value: "SUPER_ADMIN", label: "Super Admin" },
    { value: "AGENCY_ADMIN", label: "Admin da Agência" },
    { value: "COMPANY_ADMIN", label: "Admin da Empresa" },
    { value: "MANAGER", label: "Gerente" },
    { value: "SELLER", label: "Vendedor" },
  ]

  useEffect(() => {
    const loadData = async () => {
      try {
        const [companiesResponse, agenciesResponse] = await Promise.all([companiesApi.getAll(), agenciesApi.getAll()])
        setCompanies(companiesResponse.companies || [])
        setAgencies(agenciesResponse || [])
      } catch (error) {
        console.error("Error loading data:", error)
      }
    }

    if (open) {
      loadData()
    }
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      // Validações
      if (!formData.firstName.trim()) {
        throw new Error("Nome é obrigatório")
      }
      if (!formData.lastName.trim()) {
        throw new Error("Sobrenome é obrigatório")
      }
      if (!formData.email.trim()) {
        throw new Error("Email é obrigatório")
      }
      if (!formData.password.trim()) {
        throw new Error("Senha é obrigatória")
      }
      if (formData.password.length < 6) {
        throw new Error("Senha deve ter pelo menos 6 caracteres")
      }
      if (!formData.role) {
        throw new Error("Função é obrigatória")
      }

      await createUser(formData)

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        role: "",
        companyId: "",
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
            <User className="mr-2 h-5 w-5 text-blue-600" />
            Novo Usuário
          </DialogTitle>
          <DialogDescription>
            Crie um novo usuário no sistema. Preencha todas as informações necessárias.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Nome</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="firstName"
                  placeholder="João"
                  className="pl-10"
                  value={formData.firstName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, firstName: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Sobrenome</Label>
              <Input
                id="lastName"
                placeholder="Silva"
                value={formData.lastName}
                onChange={(e) => setFormData((prev) => ({ ...prev, lastName: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="joao@empresa.com"
                className="pl-10"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telefone (Opcional)</Label>
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

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Shield className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Senha do usuário"
                className="pl-10 pr-10"
                value={formData.password}
                onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-xs text-gray-600">Mínimo de 6 caracteres</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Função</Label>
            <Select value={formData.role} onValueChange={(value) => setFormData((prev) => ({ ...prev, role: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma função" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    <div className="flex items-center">
                      <Shield className="mr-2 h-4 w-4" />
                      {role.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="companyId">Empresa (Opcional)</Label>
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
              <Label htmlFor="agencyId">Agência (Opcional)</Label>
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
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isActive: checked as boolean }))}
            />
            <Label htmlFor="isActive" className="text-sm">
              Usuário ativo (pode fazer login)
            </Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
              {isLoading ? "Criando..." : "Criar Usuário"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
