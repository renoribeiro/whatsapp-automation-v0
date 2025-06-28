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
import { MessageCircle, User, Building, Phone } from "lucide-react"
import { useConversations } from "@/hooks/use-conversations"
import { companiesApi, whatsappApi, usersApi } from "@/lib/api"

interface CreateConversationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function CreateConversationModal({ open, onOpenChange, onSuccess }: CreateConversationModalProps) {
  const [error, setError] = useState("")
  const [companies, setCompanies] = useState<any[]>([])
  const [whatsappConnections, setWhatsappConnections] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [formData, setFormData] = useState({
    contactName: "",
    phoneNumber: "",
    companyId: "",
    whatsappConnectionId: "",
    assignedUserId: "",
  })

  const { createConversation, isLoading } = useConversations()

  useEffect(() => {
    const loadData = async () => {
      try {
        const [companiesResponse, connectionsResponse, usersResponse] = await Promise.all([
          companiesApi.getAll(),
          whatsappApi.getConnections(),
          usersApi.getAll(),
        ])
        setCompanies(companiesResponse.companies || [])
        setWhatsappConnections(connectionsResponse || [])
        setUsers(usersResponse.users || [])
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
      if (!formData.contactName.trim()) {
        throw new Error("Nome do contato é obrigatório")
      }
      if (!formData.phoneNumber.trim()) {
        throw new Error("Número de telefone é obrigatório")
      }
      if (!formData.companyId) {
        throw new Error("Empresa é obrigatória")
      }
      if (!formData.whatsappConnectionId) {
        throw new Error("Conexão WhatsApp é obrigatória")
      }

      await createConversation(formData)

      // Reset form
      setFormData({
        contactName: "",
        phoneNumber: "",
        companyId: "",
        whatsappConnectionId: "",
        assignedUserId: "",
      })

      onSuccess?.()
      onOpenChange(false)
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <MessageCircle className="mr-2 h-5 w-5 text-green-600" />
            Nova Conversa
          </DialogTitle>
          <DialogDescription>Crie uma nova conversa com um contato. Preencha as informações abaixo.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactName">Nome do Contato</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="contactName"
                  placeholder="João Silva"
                  className="pl-10"
                  value={formData.contactName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, contactName: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Telefone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="phoneNumber"
                  placeholder="+55 11 99999-9999"
                  className="pl-10"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData((prev) => ({ ...prev, phoneNumber: e.target.value }))}
                  required
                />
              </div>
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
            <Label htmlFor="whatsappConnectionId">Conexão WhatsApp</Label>
            <Select
              value={formData.whatsappConnectionId}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, whatsappConnectionId: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma conexão" />
              </SelectTrigger>
              <SelectContent>
                {whatsappConnections.map((connection) => (
                  <SelectItem key={connection.id} value={connection.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{connection.displayName}</span>
                      <span className="text-sm text-gray-500">{connection.phoneNumber}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="assignedUserId">Atribuir a (Opcional)</Label>
            <Select
              value={formData.assignedUserId}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, assignedUserId: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um usuário" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    <div className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      {user.firstName} {user.lastName}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-green-600 hover:bg-green-700">
              {isLoading ? "Criando..." : "Criar Conversa"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
