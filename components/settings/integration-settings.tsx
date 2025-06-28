"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
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
  Plus,
  Trash2,
  TestTube,
  CheckCircle,
  XCircle,
  ExternalLink,
  Key,
  Zap,
  MessageSquare,
  BarChart3,
  Code,
} from "lucide-react"

interface Integration {
  id: string
  name: string
  type: string
  status: "connected" | "disconnected" | "error"
  description: string
  icon: React.ReactNode
  config?: Record<string, any>
}

export function IntegrationSettings() {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: "1",
      name: "Google Sheets",
      type: "google_sheets",
      status: "connected",
      description: "Sincronizar contatos com planilhas do Google",
      icon: <BarChart3 className="h-5 w-5" />,
      config: { spreadsheetId: "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms" },
    },
    {
      id: "2",
      name: "OpenAI",
      type: "openai",
      status: "connected",
      description: "Integração com ChatGPT para respostas automáticas",
      icon: <MessageSquare className="h-5 w-5" />,
      config: { model: "gpt-3.5-turbo" },
    },
    {
      id: "3",
      name: "Zapier",
      type: "zapier",
      status: "disconnected",
      description: "Conectar com mais de 5000 aplicativos",
      icon: <Zap className="h-5 w-5" />,
    },
    {
      id: "4",
      name: "Slack",
      type: "slack",
      status: "error",
      description: "Notificações no Slack",
      icon: <MessageSquare className="h-5 w-5" />,
    },
  ])

  const [webhooks, setWebhooks] = useState([
    {
      id: "1",
      name: "CRM Webhook",
      url: "https://api.crm.com/webhook",
      events: ["message_received", "contact_created"],
      isActive: true,
      lastTriggered: new Date(Date.now() - 1000 * 60 * 30),
    },
    {
      id: "2",
      name: "Analytics Webhook",
      url: "https://analytics.example.com/webhook",
      events: ["conversation_started", "message_sent"],
      isActive: false,
    },
  ])

  const [apiKeys, setApiKeys] = useState([
    { id: "1", name: "OpenAI API Key", value: "sk-...", masked: true },
    { id: "2", name: "Google Sheets API Key", value: "AIza...", masked: true },
  ])

  const [isAddingIntegration, setIsAddingIntegration] = useState(false)
  const [isAddingWebhook, setIsAddingWebhook] = useState(false)
  const [isAddingApiKey, setIsAddingApiKey] = useState(false)

  const handleTestIntegration = async (integrationId: string) => {
    toast({
      title: "Testando integração...",
      description: "Aguarde enquanto testamos a conexão.",
    })

    // Simulate test
    await new Promise((resolve) => setTimeout(resolve, 2000))

    toast({
      title: "Teste concluído",
      description: "Integração funcionando corretamente!",
    })
  }

  const handleToggleIntegration = (integrationId: string) => {
    setIntegrations((prev) =>
      prev.map((integration) =>
        integration.id === integrationId
          ? { ...integration, status: integration.status === "connected" ? "disconnected" : "connected" }
          : integration,
      ),
    )
  }

  const handleDeleteWebhook = (webhookId: string) => {
    setWebhooks((prev) => prev.filter((webhook) => webhook.id !== webhookId))
    toast({
      title: "Webhook removido",
      description: "O webhook foi removido com sucesso.",
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "connected":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Conectado
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

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Integrações</h3>
        <p className="text-sm text-muted-foreground">Conecte sua plataforma com outros serviços e ferramentas.</p>
      </div>

      <Tabs defaultValue="integrations" className="space-y-4">
        <TabsList>
          <TabsTrigger value="integrations">Integrações Ativas</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="api-keys">Chaves API</TabsTrigger>
        </TabsList>

        <TabsContent value="integrations" className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-medium">Integrações Disponíveis</h4>
            <Dialog open={isAddingIntegration} onOpenChange={setIsAddingIntegration}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Integração
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Nova Integração</DialogTitle>
                  <DialogDescription>Selecione o tipo de integração que deseja configurar.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="integration-type">Tipo de Integração</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma integração" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="custom_api">API Personalizada</SelectItem>
                        <SelectItem value="discord">Discord</SelectItem>
                        <SelectItem value="telegram">Telegram</SelectItem>
                        <SelectItem value="hubspot">HubSpot</SelectItem>
                        <SelectItem value="salesforce">Salesforce</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="integration-name">Nome da Integração</Label>
                    <Input id="integration-name" placeholder="Ex: Minha API" />
                  </div>
                  <div>
                    <Label htmlFor="integration-url">URL da API</Label>
                    <Input id="integration-url" placeholder="https://api.exemplo.com" />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddingIntegration(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={() => setIsAddingIntegration(false)}>Adicionar Integração</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {integrations.map((integration) => (
              <Card key={integration.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {integration.icon}
                      <div>
                        <h4 className="font-medium">{integration.name}</h4>
                        <p className="text-sm text-muted-foreground">{integration.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(integration.status)}
                      <Button variant="outline" size="sm" onClick={() => handleTestIntegration(integration.id)}>
                        <TestTube className="h-4 w-4 mr-1" />
                        Testar
                      </Button>
                      <Switch
                        checked={integration.status === "connected"}
                        onCheckedChange={() => handleToggleIntegration(integration.id)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="webhooks" className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-medium">Webhooks Configurados</h4>
            <Dialog open={isAddingWebhook} onOpenChange={setIsAddingWebhook}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Webhook
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Novo Webhook</DialogTitle>
                  <DialogDescription>Configure um webhook para receber notificações de eventos.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="webhook-name">Nome do Webhook</Label>
                    <Input id="webhook-name" placeholder="Ex: CRM Integration" />
                  </div>
                  <div>
                    <Label htmlFor="webhook-url">URL do Webhook</Label>
                    <Input id="webhook-url" placeholder="https://api.exemplo.com/webhook" />
                  </div>
                  <div>
                    <Label htmlFor="webhook-events">Eventos</Label>
                    <Textarea
                      id="webhook-events"
                      placeholder="message_received, contact_created, conversation_started"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddingWebhook(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={() => setIsAddingWebhook(false)}>Criar Webhook</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {webhooks.map((webhook) => (
              <Card key={webhook.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Code className="h-5 w-5" />
                      <div>
                        <h4 className="font-medium">{webhook.name}</h4>
                        <p className="text-sm text-muted-foreground">{webhook.url}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs text-muted-foreground">Eventos: {webhook.events.join(", ")}</span>
                        </div>
                        {webhook.lastTriggered && (
                          <span className="text-xs text-muted-foreground">
                            Último disparo: {webhook.lastTriggered.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={webhook.isActive ? "default" : "secondary"}>
                        {webhook.isActive ? "Ativo" : "Inativo"}
                      </Badge>
                      <Button variant="outline" size="sm" onClick={() => window.open(webhook.url, "_blank")}>
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteWebhook(webhook.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="api-keys" className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-medium">Chaves de API</h4>
            <Dialog open={isAddingApiKey} onOpenChange={setIsAddingApiKey}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Chave
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Nova Chave API</DialogTitle>
                  <DialogDescription>Configure uma nova chave de API para integração.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="api-key-name">Nome da Chave</Label>
                    <Input id="api-key-name" placeholder="Ex: OpenAI API Key" />
                  </div>
                  <div>
                    <Label htmlFor="api-key-value">Valor da Chave</Label>
                    <Input id="api-key-value" type="password" placeholder="sk-..." />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddingApiKey(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={() => setIsAddingApiKey(false)}>Salvar Chave</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {apiKeys.map((apiKey) => (
              <Card key={apiKey.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Key className="h-5 w-5" />
                      <div>
                        <h4 className="font-medium">{apiKey.name}</h4>
                        <p className="text-sm text-muted-foreground font-mono">
                          {apiKey.masked ? "••••••••••••••••" : apiKey.value}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        Editar
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
