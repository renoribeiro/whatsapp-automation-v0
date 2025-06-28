"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MessageCircle, Clock, User, Building } from "lucide-react"
import { CreateConversationModal } from "@/components/dashboard/modals/create-conversation-modal"
import { useState } from "react"

const conversations = [
  {
    id: "1",
    contact: "+55 11 99999-9999",
    contactName: "João Silva",
    company: "TechStart",
    lastMessage: "Olá, gostaria de saber mais sobre os planos",
    timestamp: "2 min atrás",
    status: "active",
    unread: 3,
    assignedTo: "Maria Santos",
  },
  {
    id: "2",
    contact: "+55 11 88888-8888",
    contactName: "Ana Costa",
    company: "Fashion Store",
    lastMessage: "Obrigada pelo atendimento!",
    timestamp: "5 min atrás",
    status: "resolved",
    unread: 0,
    assignedTo: "Carlos Lima",
  },
  {
    id: "3",
    contact: "+55 11 77777-7777",
    contactName: "Pedro Oliveira",
    company: "AutoPeças Plus",
    lastMessage: "Preciso de ajuda com meu pedido",
    timestamp: "10 min atrás",
    status: "pending",
    unread: 1,
    assignedTo: null,
  },
]

export default function ConversationsPage() {
  const [showCreateModal, setShowCreateModal] = useState(false)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Conversas</h2>
          <p className="text-muted-foreground">Gerencie todas as conversas do WhatsApp</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <MessageCircle className="mr-2 h-4 w-4" />
          Nova Conversa
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Conversas</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">+12% em relação ao mês passado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ativas</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">Conversas em andamento</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">Aguardando atendimento</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolvidas</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,122</div>
            <p className="text-xs text-muted-foreground">Este mês</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Conversas Recentes</CardTitle>
          <CardDescription>Lista das conversas mais recentes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {conversations.map((conversation) => (
              <div key={conversation.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="bg-whatsapp-500 text-white rounded-full w-10 h-10 flex items-center justify-center">
                    <MessageCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="font-medium">{conversation.contactName}</p>
                      <Badge variant="outline">{conversation.company}</Badge>
                      {conversation.unread > 0 && <Badge variant="destructive">{conversation.unread}</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground">{conversation.contact}</p>
                    <p className="text-sm">{conversation.lastMessage}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge
                    variant={
                      conversation.status === "active"
                        ? "default"
                        : conversation.status === "resolved"
                          ? "secondary"
                          : "outline"
                    }
                  >
                    {conversation.status === "active"
                      ? "Ativa"
                      : conversation.status === "resolved"
                        ? "Resolvida"
                        : "Pendente"}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">{conversation.timestamp}</p>
                  {conversation.assignedTo && (
                    <p className="text-xs text-muted-foreground">Atribuída a: {conversation.assignedTo}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <CreateConversationModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onSuccess={() => {
          // Aqui você recarregaria a lista de conversas
          console.log("Conversa criada com sucesso!")
        }}
      />
    </div>
  )
}
