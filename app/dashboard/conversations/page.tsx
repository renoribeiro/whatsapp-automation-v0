"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, MoreHorizontal, MessageCircle, Clock, CheckCircle, Archive } from "lucide-react"

// Mock data
const conversations = [
  {
    id: 1,
    contact: "João Silva",
    phone: "+55 11 99999-9999",
    lastMessage: "Olá, gostaria de saber mais sobre o produto",
    status: "active",
    assignedTo: "Maria Santos",
    updatedAt: "2024-01-15 14:30",
    unreadCount: 3,
  },
  {
    id: 2,
    contact: "Ana Costa",
    phone: "+55 11 88888-8888",
    lastMessage: "Obrigada pelo atendimento!",
    status: "closed",
    assignedTo: "Pedro Lima",
    updatedAt: "2024-01-15 12:15",
    unreadCount: 0,
  },
  {
    id: 3,
    contact: "Carlos Oliveira",
    phone: "+55 11 77777-7777",
    lastMessage: "Quando vocês podem me ligar?",
    status: "pending",
    assignedTo: null,
    updatedAt: "2024-01-15 10:45",
    unreadCount: 1,
  },
]

const stats = [
  {
    title: "Conversas Ativas",
    value: "89",
    icon: MessageCircle,
    change: "+12%",
  },
  {
    title: "Aguardando Resposta",
    value: "23",
    icon: Clock,
    change: "+5%",
  },
  {
    title: "Finalizadas Hoje",
    value: "45",
    icon: CheckCircle,
    change: "+18%",
  },
  {
    title: "Arquivadas",
    value: "156",
    icon: Archive,
    change: "+8%",
  },
]

export default function ConversationsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "default",
      pending: "outline",
      closed: "secondary",
    } as const

    const labels = {
      active: "Ativa",
      pending: "Pendente",
      closed: "Finalizada",
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
          <h1 className="text-3xl font-bold tracking-tight">Conversas</h1>
          <p className="text-muted-foreground">Gerencie todas as conversas do WhatsApp</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nova Conversa
        </Button>
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
              <p className="text-xs text-muted-foreground">{stat.change} desde ontem</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Conversations Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Conversas</CardTitle>
          <CardDescription>Visualize e gerencie todas as conversas em andamento</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar conversas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="active">Ativas</SelectItem>
                <SelectItem value="pending">Pendentes</SelectItem>
                <SelectItem value="closed">Finalizadas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contato</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Última Mensagem</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Atribuído para</TableHead>
                <TableHead>Atualizado</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {conversations.map((conversation) => (
                <TableRow key={conversation.id}>
                  <TableCell className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback>
                        {conversation.contact
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <span className="font-medium">{conversation.contact}</span>
                      {conversation.unreadCount > 0 && (
                        <Badge variant="destructive" className="ml-2 text-xs">
                          {conversation.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{conversation.phone}</TableCell>
                  <TableCell className="max-w-xs truncate">{conversation.lastMessage}</TableCell>
                  <TableCell>{getStatusBadge(conversation.status)}</TableCell>
                  <TableCell>
                    {conversation.assignedTo || <span className="text-muted-foreground">Não atribuído</span>}
                  </TableCell>
                  <TableCell>{conversation.updatedAt}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Abrir Chat</DropdownMenuItem>
                        <DropdownMenuItem>Atribuir</DropdownMenuItem>
                        <DropdownMenuItem>Marcar como Lida</DropdownMenuItem>
                        <DropdownMenuItem>Arquivar</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
