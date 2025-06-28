"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import {
  Smartphone,
  Plus,
  QrCode,
  CheckCircle,
  XCircle,
  MessageSquare,
  Clock,
  Moon,
  Download,
  Upload,
  Trash2,
  Edit,
  Copy,
} from "lucide-react"

interface WhatsAppConnection {
  id: string
  phoneNumber: string
  displayName: string
  status: "connected" | "disconnected" | "connecting" | "error"
  connectionType: "OFFICIAL_API" | "EVOLUTION_API"
  qrCode?: string
  lastActivity?: Date
}

interface QuickReply {
  id: string
  title: string
  content: string
  shortcut: string
  category: string
  isActive: boolean
}

interface AutoReply {
  id: string
  name: string
  trigger: "welcome" | "business_hours" | "away"
  message: string
  isActive: boolean
  conditions?: Record<string, any>
}

export function WhatsAppSettings() {
  const [connections, setConnections] = useState<WhatsAppConnection[]>([
    {
      id: "1",
      phoneNumber: "+5511999999999",
      displayName: "Atendimento Principal",
      status: "connected",
      connectionType: "EVOLUTION_API",
      lastActivity: new Date(Date.now() - 1000 * 60 * 15),
    },
    {
      id: "2",
      phoneNumber: "+5511888888888",
      displayName: "Vendas",
      status: "disconnected",
      connectionType: "OFFICIAL_API",
    },
  ])

  const [quickReplies, setQuickReplies] = useState<QuickReply[]>([
    {
      id: "1",
      title: "Boas-vindas",
      content: "Olá! Bem-vindo(a) ao nosso atendimento. Como posso ajudá-lo(a)?",
      shortcut: "/ola",
      category: "Geral",
      isActive: true,
    },
    {
      id: "2",
      title: "Horário de Funcionamento",
      content: "Nosso horário de atendimento é de segunda a sexta, das 8h às 18h.",
      shortcut: "/horario",
      category: "Informações",
      isActive: true,
    },
    {
      id: "3",
      title: "Preços",
      content: "Para informações sobre preços, por favor aguarde que um consultor entrará em contato.",
      shortcut: "/precos",
      category: "Vendas",
      isActive: true,
    },
  ])

  const [autoReplies, setAutoReplies] = useState<AutoReply[]>([
    {
      id: "1",
      name: "Mensagem de Boas-vindas",
      trigger: "welcome",
      message: "Olá! Obrigado por entrar em contato. Em breve um de nossos atendentes responderá sua mensagem.",
      isActive: true,
    },
    {
      id: "2",
      name: "Fora do Horário Comercial",
      trigger: "business_hours",
      message: "No momento estamos fora do horário de atendimento. Retornaremos sua mensagem no próximo dia útil.",
      isActive: true,
      conditions: { startTime: "18:00", endTime: "08:00" },
    },
    {
      id: "3",
      name: "Ausência Temporária",
      trigger: "away",
      message: "Estou temporariamente ausente. Retornarei em breve.",
      isActive: false,
    },
  ])

  const [isAddingConnection, setIsAddingConnection] = useState(false)
  const [isAddingQuickReply, setIsAddingQuickReply] = useState(false)
  const [isAddingAutoReply, setIsAddingAutoReply] = useState(false)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "connected":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Conectado
          </Badge>
        )
      case "connecting":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            Conectando
          </Badge>
        )
      case "disconnected":
        return <Badge variant="secondary">Desconectado</Badge>
      case "error":
        return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" />
            Erro
          </Badge>
        )
      default:
        return <Badge variant="secondary">Desconhecido</Badge>
    }
  }

  const handleConnectWhatsApp = (connectionId: string) => {
    setConnections((prev) =>
      prev.map((conn) => (conn.id === connectionId ? { ...conn, status: "connecting" as const } : conn)),
    )

    // Simulate connection process
    setTimeout(() => {
      setConnections((prev) =>
        prev.map((conn) =>
          conn.id === connectionId ? { ...conn, status: "connected" as const, lastActivity: new Date() } : conn,
        ),
      )
      toast({
        title: "WhatsApp conectado",
        description: "A conexão foi estabelecida com sucesso.",
      })
    }, 3000)
  }

  const handleDisconnectWhatsApp = (connectionId: string) => {
    setConnections((prev) =>
      prev.map((conn) => (conn.id === connectionId ? { ...conn, status: "disconnected" as const } : conn)),
    )
    toast({
      title: "WhatsApp desconectado",
      description: "A conexão foi encerrada.",
    })
  }

  const handleDeleteQuickReply = (replyId: string) => {
    setQuickReplies((prev) => prev.filter((reply) => reply.id !== replyId))
    toast({
      title: "Resposta rápida removida",
      description: "A resposta rápida foi removida com sucesso.",
    })
  }

  const handleToggleQuickReply = (replyId: string) => {
    setQuickReplies((prev) =>
      prev.map((reply) => (reply.id === replyId ? { ...reply, isActive: !reply.isActive } : reply)),
    )
  }

  const handleToggleAutoReply = (replyId: string) => {
    setAutoReplies((prev) =>
      prev.map((reply) => (reply.id === replyId ? { ...reply, isActive: !reply.isActive } : reply)),
    )
  }

  const handleExportQuickReplies = () => {
    const data = JSON.stringify(quickReplies, null, 2)
    const blob = new Blob([data], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "respostas-rapidas.json"
    a.click()
    URL.revokeObjectURL(url)

    toast({
      title: "Exportação concluída",
      description: "As respostas rápidas foram exportadas com sucesso.",
    })
  }

  const formatLastActivity = (date?: Date) => {
    if (!date) return "Nunca"

    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))

    if (minutes < 60) return `${minutes} min atrás`
    return `${hours}h atrás`
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Configurações do WhatsApp</h3>
        <p className="text-sm text-muted-foreground">
          Gerencie suas conexões WhatsApp, respostas rápidas e automações.
        </p>
      </div>

      <Tabs defaultValue="connections" className="space-y-4">
        <TabsList>
          <TabsTrigger value="connections">Conexões</TabsTrigger>
          <TabsTrigger value="quick-replies">Respostas Rápidas</TabsTrigger>
          <TabsTrigger value="auto-replies">Respostas Automáticas</TabsTrigger>
          <TabsTrigger value="advanced">Avançado</TabsTrigger>
        </TabsList>

        <TabsContent value="connections" className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-medium">Conexões WhatsApp</h4>
            <Dialog open={isAddingConnection} onOpenChange={setIsAddingConnection}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Conexão
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Nova Conexão</DialogTitle>
                  <DialogDescription>Configure uma nova conexão WhatsApp.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="phone-number">Número do WhatsApp</Label>
                    <Input id="phone-number" placeholder="+5511999999999" />
                  </div>
                  <div>
                    <Label htmlFor="display-name">Nome de Exibição</Label>
                    <Input id="display-name" placeholder="Ex: Atendimento" />
                  </div>
                  <div>
                    <Label htmlFor="connection-type">Tipo de Conexão</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EVOLUTION_API">Evolution API</SelectItem>
                        <SelectItem value="OFFICIAL_API">API Oficial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddingConnection(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={() => setIsAddingConnection(false)}>Adicionar Conexão</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {connections.map((connection) => (
              <Card key={connection.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Smartphone className="h-5 w-5" />
                      <div>
                        <h4 className="font-medium">{connection.displayName}</h4>
                        <p className="text-sm text-muted-foreground">{connection.phoneNumber}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline">{connection.connectionType}</Badge>
                          <span className="text-xs text-muted-foreground">
                            Última atividade: {formatLastActivity(connection.lastActivity)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(connection.status)}
                      {connection.status === "disconnected" && (
                        <Button variant="outline" size="sm" onClick={() => handleConnectWhatsApp(connection.id)}>
                          <QrCode className="h-4 w-4 mr-1" />
                          Conectar
                        </Button>
                      )}
                      {connection.status === "connected" && (
                        <Button variant="outline" size="sm" onClick={() => handleDisconnectWhatsApp(connection.id)}>
                          Desconectar
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="quick-replies" className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-medium">Respostas Rápidas</h4>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={handleExportQuickReplies}>
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Importar
              </Button>
              <Dialog open={isAddingQuickReply} onOpenChange={setIsAddingQuickReply}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Resposta
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Adicionar Resposta Rápida</DialogTitle>
                    <DialogDescription>Crie uma nova resposta rápida para agilizar o atendimento.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="reply-title">Título</Label>
                      <Input id="reply-title" placeholder="Ex: Boas-vindas" />
                    </div>
                    <div>
                      <Label htmlFor="reply-shortcut">Atalho</Label>
                      <Input id="reply-shortcut" placeholder="Ex: /ola" />
                    </div>
                    <div>
                      <Label htmlFor="reply-category">Categoria</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="geral">Geral</SelectItem>
                          <SelectItem value="vendas">Vendas</SelectItem>
                          <SelectItem value="suporte">Suporte</SelectItem>
                          <SelectItem value="informacoes">Informações</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="reply-content">Conteúdo</Label>
                      <Textarea id="reply-content" placeholder="Digite o conteúdo da resposta..." rows={4} />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddingQuickReply(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={() => setIsAddingQuickReply(false)}>Criar Resposta</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="grid gap-4">
            {quickReplies.map((reply) => (
              <Card key={reply.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-medium">{reply.title}</h4>
                        <Badge variant="outline">{reply.category}</Badge>
                        <Badge variant="secondary" className="font-mono text-xs">
                          {reply.shortcut}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{reply.content}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch checked={reply.isActive} onCheckedChange={() => handleToggleQuickReply(reply.id)} />
                      <Button variant="outline" size="sm">
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteQuickReply(reply.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="auto-replies" className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-medium">Respostas Automáticas</h4>
            <Dialog open={isAddingAutoReply} onOpenChange={setIsAddingAutoReply}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Automação
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Resposta Automática</DialogTitle>
                  <DialogDescription>Configure uma resposta automática para situações específicas.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="auto-reply-name">Nome</Label>
                    <Input id="auto-reply-name" placeholder="Ex: Mensagem de Boas-vindas" />
                  </div>
                  <div>
                    <Label htmlFor="auto-reply-trigger">Gatilho</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um gatilho" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="welcome">Primeira mensagem</SelectItem>
                        <SelectItem value="business_hours">Fora do horário</SelectItem>
                        <SelectItem value="away">Ausência temporária</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="auto-reply-message">Mensagem</Label>
                    <Textarea id="auto-reply-message" placeholder="Digite a mensagem automática..." rows={4} />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddingAutoReply(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={() => setIsAddingAutoReply(false)}>Criar Automação</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {autoReplies.map((reply) => (
              <Card key={reply.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="mt-1">
                        {reply.trigger === "welcome" && <MessageSquare className="h-5 w-5" />}
                        {reply.trigger === "business_hours" && <Clock className="h-5 w-5" />}
                        {reply.trigger === "away" && <Moon className="h-5 w-5" />}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{reply.name}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{reply.message}</p>
                        {reply.conditions && (
                          <div className="mt-2">
                            <Badge variant="outline" className="text-xs">
                              {reply.conditions.startTime} - {reply.conditions.endTime}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch checked={reply.isActive} onCheckedChange={() => handleToggleAutoReply(reply.id)} />
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Avançadas</CardTitle>
              <CardDescription>Configurações técnicas e limites do sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="message-limit">Limite de Mensagens por Minuto</Label>
                  <Input id="message-limit" type="number" defaultValue="30" />
                  <p className="text-xs text-muted-foreground mt-1">Limite para evitar bloqueios do WhatsApp</p>
                </div>
                <div>
                  <Label htmlFor="retry-attempts">Tentativas de Reenvio</Label>
                  <Input id="retry-attempts" type="number" defaultValue="3" />
                  <p className="text-xs text-muted-foreground mt-1">Número de tentativas para mensagens falhadas</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Backup Automático</Label>
                    <p className="text-sm text-muted-foreground">Fazer backup das conversas automaticamente</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Logs Detalhados</Label>
                    <p className="text-sm text-muted-foreground">Registrar logs detalhados para debug</p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Webhook de Status</Label>
                    <p className="text-sm text-muted-foreground">Receber notificações de mudança de status</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex space-x-2">
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Exportar Configurações
                  </Button>
                  <Button variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Importar Configurações
                  </Button>
                  <Button variant="destructive">Resetar Configurações</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
