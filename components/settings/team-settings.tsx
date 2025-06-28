"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "@/hooks/use-toast"
import { Search, MoreHorizontal, UserPlus, Mail, Shield, Crown, User, Building, Trash2, Edit, Send } from "lucide-react"

interface TeamMember {
  id: string
  firstName: string
  lastName: string
  email: string
  role: "SUPER_ADMIN" | "AGENCY_ADMIN" | "COMPANY_ADMIN" | "SELLER"
  status: "active" | "inactive" | "pending"
  avatar?: string
  lastActive?: Date
  joinedAt: Date
}

interface Invitation {
  id: string
  email: string
  role: string
  status: "pending" | "expired"
  sentAt: Date
  expiresAt: Date
}

export function TeamSettings() {
  const [members, setMembers] = useState<TeamMember[]>([
    {
      id: "1",
      firstName: "João",
      lastName: "Silva",
      email: "joao@empresa.com",
      role: "COMPANY_ADMIN",
      status: "active",
      avatar: "/placeholder.svg?height=40&width=40",
      lastActive: new Date(Date.now() - 1000 * 60 * 30),
      joinedAt: new Date(2024, 0, 15),
    },
    {
      id: "2",
      firstName: "Maria",
      lastName: "Santos",
      email: "maria@empresa.com",
      role: "SELLER",
      status: "active",
      lastActive: new Date(Date.now() - 1000 * 60 * 60 * 2),
      joinedAt: new Date(2024, 1, 1),
    },
    {
      id: "3",
      firstName: "Pedro",
      lastName: "Costa",
      email: "pedro@empresa.com",
      role: "SELLER",
      status: "inactive",
      joinedAt: new Date(2024, 1, 10),
    },
  ])

  const [invitations, setInvitations] = useState<Invitation[]>([
    {
      id: "1",
      email: "novo@empresa.com",
      role: "SELLER",
      status: "pending",
      sentAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 6),
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [isInviting, setIsInviting] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState("")

  const roleLabels = {
    SUPER_ADMIN: "Super Admin",
    AGENCY_ADMIN: "Admin da Agência",
    COMPANY_ADMIN: "Admin da Empresa",
    SELLER: "Vendedor",
  }

  const roleIcons = {
    SUPER_ADMIN: <Crown className="h-4 w-4" />,
    AGENCY_ADMIN: <Building className="h-4 w-4" />,
    COMPANY_ADMIN: <Shield className="h-4 w-4" />,
    SELLER: <User className="h-4 w-4" />,
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "SUPER_ADMIN":
        return "default"
      case "AGENCY_ADMIN":
        return "secondary"
      case "COMPANY_ADMIN":
        return "outline"
      case "SELLER":
        return "secondary"
      default:
        return "secondary"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Ativo</Badge>
      case "inactive":
        return <Badge variant="secondary">Inativo</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>
      default:
        return <Badge variant="secondary">Desconhecido</Badge>
    }
  }

  const filteredMembers = members.filter(
    (member) =>
      member.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleInviteMember = async () => {
    if (!inviteEmail || !inviteRole) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive",
      })
      return
    }

    const newInvitation: Invitation = {
      id: Date.now().toString(),
      email: inviteEmail,
      role: inviteRole,
      status: "pending",
      sentAt: new Date(),
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    }

    setInvitations((prev) => [...prev, newInvitation])
    setInviteEmail("")
    setInviteRole("")
    setIsInviting(false)

    toast({
      title: "Convite enviado",
      description: `Convite enviado para ${inviteEmail}`,
    })
  }

  const handleResendInvitation = (invitationId: string) => {
    setInvitations((prev) =>
      prev.map((inv) =>
        inv.id === invitationId
          ? { ...inv, sentAt: new Date(), expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7) }
          : inv,
      ),
    )

    toast({
      title: "Convite reenviado",
      description: "O convite foi reenviado com sucesso.",
    })
  }

  const handleRevokeInvitation = (invitationId: string) => {
    setInvitations((prev) => prev.filter((inv) => inv.id !== invitationId))
    toast({
      title: "Convite revogado",
      description: "O convite foi revogado com sucesso.",
    })
  }

  const handleRemoveMember = (memberId: string) => {
    setMembers((prev) => prev.filter((member) => member.id !== memberId))
    toast({
      title: "Membro removido",
      description: "O membro foi removido da equipe.",
    })
  }

  const formatLastActive = (date?: Date) => {
    if (!date) return "Nunca"

    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 60) return `${minutes} min atrás`
    if (hours < 24) return `${hours}h atrás`
    return `${days} dias atrás`
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Gerenciamento de Equipe</h3>
        <p className="text-sm text-muted-foreground">Gerencie os membros da sua equipe e suas permissões.</p>
      </div>

      <div className="flex justify-between items-center">
        <div className="relative w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar membros..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Dialog open={isInviting} onOpenChange={setIsInviting}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Convidar Membro
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Convidar Novo Membro</DialogTitle>
              <DialogDescription>Envie um convite para um novo membro se juntar à equipe.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="invite-email">Email</Label>
                <Input
                  id="invite-email"
                  type="email"
                  placeholder="novo@empresa.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="invite-role">Função</Label>
                <Select value={inviteRole} onValueChange={setInviteRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma função" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SELLER">Vendedor</SelectItem>
                    <SelectItem value="COMPANY_ADMIN">Admin da Empresa</SelectItem>
                    <SelectItem value="AGENCY_ADMIN">Admin da Agência</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsInviting(false)}>
                Cancelar
              </Button>
              <Button onClick={handleInviteMember}>
                <Send className="h-4 w-4 mr-2" />
                Enviar Convite
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Membros da Equipe</CardTitle>
            <CardDescription>
              {filteredMembers.length} de {members.length} membros
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredMembers.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={member.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {member.firstName[0]}
                        {member.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="font-medium">
                          {member.firstName} {member.lastName}
                        </p>
                        {getStatusBadge(member.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">{member.email}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <Badge variant={getRoleBadgeVariant(member.role)}>
                          {roleIcons[member.role]}
                          <span className="ml-1">{roleLabels[member.role]}</span>
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          Último acesso: {formatLastActive(member.lastActive)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Mail className="h-4 w-4 mr-2" />
                        Enviar Email
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600" onClick={() => handleRemoveMember(member.id)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remover
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {invitations.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Convites Pendentes</CardTitle>
              <CardDescription>Convites enviados aguardando resposta</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {invitations.map((invitation) => (
                  <div key={invitation.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <Mail className="h-5 w-5 text-gray-500" />
                      </div>
                      <div>
                        <p className="font-medium">{invitation.email}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline">{roleLabels[invitation.role as keyof typeof roleLabels]}</Badge>
                          <span className="text-xs text-muted-foreground">
                            Enviado em {invitation.sentAt.toLocaleDateString()}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          Expira em {invitation.expiresAt.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleResendInvitation(invitation.id)}>
                        Reenviar
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleRevokeInvitation(invitation.id)}>
                        Revogar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
