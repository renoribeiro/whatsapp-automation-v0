"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import {
  CreditCard,
  Download,
  Calendar,
  Users,
  MessageSquare,
  Database,
  Zap,
  CheckCircle,
  Plus,
  Trash2,
} from "lucide-react"

interface Subscription {
  id: string
  plan: string
  status: "active" | "inactive" | "trial" | "cancelled"
  currentPeriodStart: Date
  currentPeriodEnd: Date
  amount: number
  currency: string
}

interface Usage {
  messages: { used: number; limit: number }
  users: { used: number; limit: number }
  storage: { used: number; limit: number }
  automations: { used: number; limit: number }
}

interface Invoice {
  id: string
  number: string
  date: Date
  amount: number
  status: "paid" | "pending" | "failed"
  downloadUrl?: string
}

interface PaymentMethod {
  id: string
  type: "card" | "pix" | "boleto"
  last4?: string
  brand?: string
  expiryMonth?: number
  expiryYear?: number
  isDefault: boolean
}

export function BillingSettings() {
  const [subscription] = useState<Subscription>({
    id: "1",
    plan: "Professional",
    status: "active",
    currentPeriodStart: new Date(2024, 0, 1),
    currentPeriodEnd: new Date(2024, 1, 1),
    amount: 299.9,
    currency: "BRL",
  })

  const [usage] = useState<Usage>({
    messages: { used: 8420, limit: 10000 },
    users: { used: 3, limit: 5 },
    storage: { used: 2.3, limit: 10 },
    automations: { used: 12, limit: 20 },
  })

  const [invoices] = useState<Invoice[]>([
    {
      id: "1",
      number: "INV-2024-001",
      date: new Date(2024, 0, 1),
      amount: 299.9,
      status: "paid",
      downloadUrl: "/invoices/inv-2024-001.pdf",
    },
    {
      id: "2",
      number: "INV-2023-012",
      date: new Date(2023, 11, 1),
      amount: 299.9,
      status: "paid",
      downloadUrl: "/invoices/inv-2023-012.pdf",
    },
    {
      id: "3",
      number: "INV-2023-011",
      date: new Date(2023, 10, 1),
      amount: 299.9,
      status: "failed",
    },
  ])

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: "1",
      type: "card",
      last4: "4242",
      brand: "visa",
      expiryMonth: 12,
      expiryYear: 2025,
      isDefault: true,
    },
    {
      id: "2",
      type: "card",
      last4: "5555",
      brand: "mastercard",
      expiryMonth: 8,
      expiryYear: 2026,
      isDefault: false,
    },
  ])

  const [isAddingPaymentMethod, setIsAddingPaymentMethod] = useState(false)
  const [isChangingPlan, setIsChangingPlan] = useState(false)

  const plans = [
    {
      name: "Básico",
      price: 149.9,
      features: ["5.000 mensagens/mês", "2 usuários", "5GB armazenamento", "10 automações"],
    },
    {
      name: "Professional",
      price: 299.9,
      features: ["10.000 mensagens/mês", "5 usuários", "10GB armazenamento", "20 automações"],
    },
    {
      name: "Enterprise",
      price: 599.9,
      features: ["Mensagens ilimitadas", "20 usuários", "50GB armazenamento", "Automações ilimitadas"],
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Ativo
          </Badge>
        )
      case "trial":
        return <Badge className="bg-blue-100 text-blue-800">Trial</Badge>
      case "cancelled":
        return <Badge variant="destructive">Cancelado</Badge>
      default:
        return <Badge variant="secondary">Inativo</Badge>
    }
  }

  const getInvoiceStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-100 text-green-800">Pago</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>
      case "failed":
        return <Badge variant="destructive">Falhou</Badge>
      default:
        return <Badge variant="secondary">Desconhecido</Badge>
    }
  }

  const handleDownloadInvoice = (invoice: Invoice) => {
    if (invoice.downloadUrl) {
      window.open(invoice.downloadUrl, "_blank")
    } else {
      toast({
        title: "Download não disponível",
        description: "Esta fatura não está disponível para download.",
        variant: "destructive",
      })
    }
  }

  const handleDeletePaymentMethod = (methodId: string) => {
    setPaymentMethods((prev) => prev.filter((method) => method.id !== methodId))
    toast({
      title: "Método removido",
      description: "O método de pagamento foi removido com sucesso.",
    })
  }

  const handleSetDefaultPaymentMethod = (methodId: string) => {
    setPaymentMethods((prev) =>
      prev.map((method) => ({
        ...method,
        isDefault: method.id === methodId,
      })),
    )
    toast({
      title: "Método padrão alterado",
      description: "O método de pagamento padrão foi atualizado.",
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Cobrança e Assinatura</h3>
        <p className="text-sm text-muted-foreground">
          Gerencie sua assinatura, métodos de pagamento e histórico de faturas.
        </p>
      </div>

      <Tabs defaultValue="subscription" className="space-y-4">
        <TabsList>
          <TabsTrigger value="subscription">Assinatura</TabsTrigger>
          <TabsTrigger value="usage">Uso</TabsTrigger>
          <TabsTrigger value="invoices">Faturas</TabsTrigger>
          <TabsTrigger value="payment-methods">Pagamento</TabsTrigger>
        </TabsList>

        <TabsContent value="subscription" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Plano Atual</span>
                {getStatusBadge(subscription.status)}
              </CardTitle>
              <CardDescription>Informações sobre sua assinatura atual</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Plano</Label>
                  <p className="text-2xl font-bold">{subscription.plan}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Valor Mensal</Label>
                  <p className="text-2xl font-bold">R$ {subscription.amount.toFixed(2)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Início do Período</Label>
                  <p className="text-sm text-muted-foreground">
                    {subscription.currentPeriodStart.toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Próxima Cobrança</Label>
                  <p className="text-sm text-muted-foreground">{subscription.currentPeriodEnd.toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex space-x-2">
                <Dialog open={isChangingPlan} onOpenChange={setIsChangingPlan}>
                  <DialogTrigger asChild>
                    <Button>Alterar Plano</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl">
                    <DialogHeader>
                      <DialogTitle>Escolher Plano</DialogTitle>
                      <DialogDescription>Selecione o plano que melhor atende às suas necessidades.</DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-3 gap-4">
                      {plans.map((plan) => (
                        <Card key={plan.name} className={plan.name === subscription.plan ? "border-blue-500" : ""}>
                          <CardHeader>
                            <CardTitle className="text-center">{plan.name}</CardTitle>
                            <div className="text-center">
                              <span className="text-3xl font-bold">R$ {plan.price}</span>
                              <span className="text-muted-foreground">/mês</span>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-2">
                              {plan.features.map((feature, index) => (
                                <li key={index} className="flex items-center text-sm">
                                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                  {feature}
                                </li>
                              ))}
                            </ul>
                            <Button
                              className="w-full mt-4"
                              variant={plan.name === subscription.plan ? "secondary" : "default"}
                              disabled={plan.name === subscription.plan}
                            >
                              {plan.name === subscription.plan ? "Plano Atual" : "Selecionar"}
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsChangingPlan(false)}>
                        Cancelar
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Button variant="outline">Cancelar Assinatura</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usage" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Mensagens</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{usage.messages.used.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">de {usage.messages.limit.toLocaleString()} mensagens</p>
                <Progress value={(usage.messages.used / usage.messages.limit) * 100} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Usuários</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{usage.users.used}</div>
                <p className="text-xs text-muted-foreground">de {usage.users.limit} usuários</p>
                <Progress value={(usage.users.used / usage.users.limit) * 100} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Armazenamento</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{usage.storage.used} GB</div>
                <p className="text-xs text-muted-foreground">de {usage.storage.limit} GB</p>
                <Progress value={(usage.storage.used / usage.storage.limit) * 100} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Automações</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{usage.automations.used}</div>
                <p className="text-xs text-muted-foreground">de {usage.automations.limit} automações</p>
                <Progress value={(usage.automations.used / usage.automations.limit) * 100} className="mt-2" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="invoices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Faturas</CardTitle>
              <CardDescription>Visualize e baixe suas faturas anteriores</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {invoices.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{invoice.number}</p>
                        <p className="text-sm text-muted-foreground">{invoice.date.toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="font-medium">R$ {invoice.amount.toFixed(2)}</p>
                        {getInvoiceStatusBadge(invoice.status)}
                      </div>
                      {invoice.downloadUrl && (
                        <Button variant="outline" size="sm" onClick={() => handleDownloadInvoice(invoice)}>
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment-methods" className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-medium">Métodos de Pagamento</h4>
            <Dialog open={isAddingPaymentMethod} onOpenChange={setIsAddingPaymentMethod}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Método
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Método de Pagamento</DialogTitle>
                  <DialogDescription>Adicione um novo cartão de crédito ou débito.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="card-number">Número do Cartão</Label>
                    <Input id="card-number" placeholder="1234 5678 9012 3456" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiry">Validade</Label>
                      <Input id="expiry" placeholder="MM/AA" />
                    </div>
                    <div>
                      <Label htmlFor="cvc">CVC</Label>
                      <Input id="cvc" placeholder="123" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="cardholder-name">Nome no Cartão</Label>
                    <Input id="cardholder-name" placeholder="João Silva" />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddingPaymentMethod(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={() => setIsAddingPaymentMethod(false)}>Adicionar Cartão</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-4">
            {paymentMethods.map((method) => (
              <Card key={method.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <CreditCard className="h-5 w-5" />
                      <div>
                        <p className="font-medium">
                          {method.brand?.toUpperCase()} •••• {method.last4}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Expira em {method.expiryMonth}/{method.expiryYear}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {method.isDefault && <Badge>Padrão</Badge>}
                      {!method.isDefault && (
                        <Button variant="outline" size="sm" onClick={() => handleSetDefaultPaymentMethod(method.id)}>
                          Definir como Padrão
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeletePaymentMethod(method.id)}
                        disabled={method.isDefault}
                      >
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
