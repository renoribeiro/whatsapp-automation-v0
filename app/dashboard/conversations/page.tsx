"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageCircle, Plus, Search, Clock, User, Phone, Archive, Star } from "lucide-react"

interface Conversation {
  id: string
  contact: {
    name: string
    phone: string
    avatar?: string
  }
  lastMessage: {
    content: string
    timestamp: string
    sender: "user" | "contact"
  }
  status: "active" | "pending" | "archived"
  unreadCount: number
  assignedTo?: string
}

const mockConversations: Conversation[] = [
  {
    id: "1",
    contact: {
      name: "João Silva",
      phone: "+55 11 99999-9999",
      avatar: "/placeholder-user.jpg",
    },
    lastMessage: {
      content: "Olá, gostaria de saber mais sobre os produtos",
      timestamp: "2024-01-20T10:30:00Z",
      sender: "contact",
    },
    status: "active",
    unreadCount: 2,
    assignedTo: "Maria Santos",
  },
  {
    id: "2",
    contact: {
      name: "Ana Costa",
      phone: "+55 11 88888-8888",
    },
    lastMessage: {
      content: "Obrigada pelo atendimento!",
      timestamp: "2024-01-20T09:15:00Z",
      sender: "contact",
    },
    status: "active",
    unreadCount: 0,
    assignedTo: "Pedro Oliveira",
  },
  {
    id: "3",
    contact: {
      name: "Carlos Mendes",
      phone: "+55 11 77777-7777",
    },
    lastMessage: {
      content: "Preciso de ajuda com meu pedido",
      timestamp: "2024-01-20T08:45:00Z",
      sender: "contact",
    },
    status: "pending",
    unreadCount: 1,
  },
  {
    id: "4",
    contact: {
      name: "Lucia Ferreira",
      phone: "+55 11 66666-6666",
    },
    lastMessage: {
      content: "Problema resolvido, muito obrigada!",
      timestamp: "2024-01-19T16:20:00Z",
      sender: "contact",
    },
    status: "archived",
    unreadCount: 0,
    assignedTo: "Ana Silva",
  },
]

export default function ConversationsPage() {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredConversations = conversations.filter((conv) => {
    const matchesSearch =
      conv.contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.contact.phone.includes(searchTerm) ||
      conv.lastMessage.content.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || conv.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Ativa</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pendente</Badge>
      case "archived":
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Arquivada</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
    } else {
      return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })
    }
  }

  const stats = [
    {
      title: "Total de Conversas",
      value: conversations.length.toString(),
      icon: MessageCircle,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Conversas Ativas",
      value: conversations.filter((c) => c.status === "active").length.toString(),
      icon: Star,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Pendentes",
      value: conversations.filter((c) => c.status === "pending").length.toString(),
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      title: "Arquivadas",
      value: conversations.filter((c) => c.status === "archived").length.toString(),
      icon: Archive,
      color: "text-gray-600",
      bgColor: "bg-gray-100",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
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
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
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

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar conversas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex space-x-2">
          <Button variant={statusFilter === "all" ? "default" : "outline"} onClick={() => setStatusFilter("all")}>
            Todas
          </Button>
          <Button variant={statusFilter === "active" ? "default" : "outline"} onClick={() => setStatusFilter("active")}>
            Ativas
          </Button>
          <Button
            variant={statusFilter === "pending" ? "default" : "outline"}
            onClick={() => setStatusFilter("pending")}
          >
            Pendentes
          </Button>
          <Button
            variant={statusFilter === "archived" ? "default" : "outline"}
            onClick={() => setStatusFilter("archived")}
          >
            Arquivadas
          </Button>
        </div>
      </div>

      {/* Conversations List */}
      <div className="grid gap-4">
        {filteredConversations.map((conversation) => (
          <Card key={conversation.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={conversation.contact.avatar || "/placeholder.svg"} />
                  <AvatarFallback>
                    {conversation.contact.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-sm">{conversation.contact.name}</h3>
                      {getStatusBadge(conversation.status)}
                      {conversation.unreadCount > 0 && (
                        <Badge className="bg-red-500 text-white">{conversation.unreadCount}</Badge>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatTime(conversation.lastMessage.timestamp)}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 mt-1">
                    <Phone className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{conversation.contact.phone}</span>
                  </div>

                  <p className="text-sm text-muted-foreground mt-2 truncate">{conversation.lastMessage.content}</p>

                  {conversation.assignedTo && (
                    <div className="flex items-center space-x-1 mt-2">
                      <User className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Atribuído a: {conversation.assignedTo}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredConversations.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <MessageCircle className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">Nenhuma conversa encontrada</h3>
            <p className="mt-1 text-sm text-gray-500">Tente ajustar os filtros ou termos de busca.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
