"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Bell, Mail, MessageCircle, BarChart3, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function NotificationSettings() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [settings, setSettings] = useState({
    // Notificações por email
    emailNewMessage: true,
    emailNewUser: true,
    emailSystemUpdates: false,
    emailWeeklyReport: true,
    emailSecurityAlerts: true,

    // Notificações push
    pushNewMessage: true,
    pushNewUser: false,
    pushSystemAlerts: true,
    pushMentions: true,

    // Notificações no app
    inAppSounds: true,
    inAppDesktop: true,
    inAppMobile: true,

    // Configurações de horário
    quietHoursEnabled: true,
    quietHoursStart: "22:00",
    quietHoursEnd: "08:00",

    // Frequência de resumos
    digestFrequency: "daily",
    reportFrequency: "weekly",
  })

  const handleSave = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: "Configurações de notificação atualizadas",
      description: "Suas preferências foram salvas com sucesso.",
    })

    setIsLoading(false)
  }

  const handleSwitchChange = (field: string, value: boolean) => {
    setSettings((prev) => ({ ...prev, [field]: value }))
  }

  const handleSelectChange = (field: string, value: string) => {
    setSettings((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Configurações de Notificação
          </CardTitle>
          <CardDescription>Gerencie como e quando você recebe notificações</CardDescription>
        </CardHeader>
      </Card>

      {/* Notificações por Email */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Notificações por Email
          </CardTitle>
          <CardDescription>Receba atualizações importantes por email</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Novas mensagens</Label>
              <p className="text-sm text-muted-foreground">Receber email quando uma nova mensagem chegar</p>
            </div>
            <Switch
              checked={settings.emailNewMessage}
              onCheckedChange={(value) => handleSwitchChange("emailNewMessage", value)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Novos usuários</Label>
              <p className="text-sm text-muted-foreground">Notificar quando um novo usuário se cadastrar</p>
            </div>
            <Switch
              checked={settings.emailNewUser}
              onCheckedChange={(value) => handleSwitchChange("emailNewUser", value)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Atualizações do sistema</Label>
              <p className="text-sm text-muted-foreground">Receber informações sobre novas funcionalidades</p>
            </div>
            <Switch
              checked={settings.emailSystemUpdates}
              onCheckedChange={(value) => handleSwitchChange("emailSystemUpdates", value)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Relatório semanal</Label>
              <p className="text-sm text-muted-foreground">Resumo das atividades da semana</p>
            </div>
            <Switch
              checked={settings.emailWeeklyReport}
              onCheckedChange={(value) => handleSwitchChange("emailWeeklyReport", value)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Alertas de segurança</Label>
              <p className="text-sm text-muted-foreground">Notificações importantes sobre segurança</p>
            </div>
            <Switch
              checked={settings.emailSecurityAlerts}
              onCheckedChange={(value) => handleSwitchChange("emailSecurityAlerts", value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notificações Push */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Notificações Push
          </CardTitle>
          <CardDescription>Notificações instantâneas no navegador e dispositivos</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Novas mensagens</Label>
              <p className="text-sm text-muted-foreground">Notificação push para novas mensagens</p>
            </div>
            <Switch
              checked={settings.pushNewMessage}
              onCheckedChange={(value) => handleSwitchChange("pushNewMessage", value)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Novos usuários</Label>
              <p className="text-sm text-muted-foreground">Notificar sobre novos cadastros</p>
            </div>
            <Switch
              checked={settings.pushNewUser}
              onCheckedChange={(value) => handleSwitchChange("pushNewUser", value)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Alertas do sistema</Label>
              <p className="text-sm text-muted-foreground">Notificações importantes do sistema</p>
            </div>
            <Switch
              checked={settings.pushSystemAlerts}
              onCheckedChange={(value) => handleSwitchChange("pushSystemAlerts", value)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Menções</Label>
              <p className="text-sm text-muted-foreground">Quando você for mencionado em conversas</p>
            </div>
            <Switch
              checked={settings.pushMentions}
              onCheckedChange={(value) => handleSwitchChange("pushMentions", value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Configurações de Som e Interface */}
      <Card>
        <CardHeader>
          <CardTitle>Configurações de Interface</CardTitle>
          <CardDescription>Como as notificações aparecem na plataforma</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Sons de notificação</Label>
              <p className="text-sm text-muted-foreground">Reproduzir som quando receber notificações</p>
            </div>
            <Switch
              checked={settings.inAppSounds}
              onCheckedChange={(value) => handleSwitchChange("inAppSounds", value)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Notificações desktop</Label>
              <p className="text-sm text-muted-foreground">Mostrar notificações na área de trabalho</p>
            </div>
            <Switch
              checked={settings.inAppDesktop}
              onCheckedChange={(value) => handleSwitchChange("inAppDesktop", value)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Notificações mobile</Label>
              <p className="text-sm text-muted-foreground">Receber notificações no dispositivo móvel</p>
            </div>
            <Switch
              checked={settings.inAppMobile}
              onCheckedChange={(value) => handleSwitchChange("inAppMobile", value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Horário Silencioso */}
      <Card>
        <CardHeader>
          <CardTitle>Horário Silencioso</CardTitle>
          <CardDescription>Configure quando não receber notificações</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Ativar horário silencioso</Label>
              <p className="text-sm text-muted-foreground">Pausar notificações durante horários específicos</p>
            </div>
            <Switch
              checked={settings.quietHoursEnabled}
              onCheckedChange={(value) => handleSwitchChange("quietHoursEnabled", value)}
            />
          </div>

          {settings.quietHoursEnabled && (
            <>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quietStart">Início</Label>
                  <Select
                    value={settings.quietHoursStart}
                    onValueChange={(value) => handleSelectChange("quietHoursStart", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }, (_, i) => {
                        const hour = i.toString().padStart(2, "0")
                        return (
                          <SelectItem key={hour} value={`${hour}:00`}>
                            {hour}:00
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quietEnd">Fim</Label>
                  <Select
                    value={settings.quietHoursEnd}
                    onValueChange={(value) => handleSelectChange("quietHoursEnd", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }, (_, i) => {
                        const hour = i.toString().padStart(2, "0")
                        return (
                          <SelectItem key={hour} value={`${hour}:00`}>
                            {hour}:00
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Frequência de Resumos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Resumos e Relatórios
          </CardTitle>
          <CardDescription>Configure a frequência de resumos automáticos</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="digestFrequency">Resumo de atividades</Label>
              <Select
                value={settings.digestFrequency}
                onValueChange={(value) => handleSelectChange("digestFrequency", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="never">Nunca</SelectItem>
                  <SelectItem value="daily">Diário</SelectItem>
                  <SelectItem value="weekly">Semanal</SelectItem>
                  <SelectItem value="monthly">Mensal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reportFrequency">Relatórios de performance</Label>
              <Select
                value={settings.reportFrequency}
                onValueChange={(value) => handleSelectChange("reportFrequency", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="never">Nunca</SelectItem>
                  <SelectItem value="weekly">Semanal</SelectItem>
                  <SelectItem value="monthly">Mensal</SelectItem>
                  <SelectItem value="quarterly">Trimestral</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ações */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Salvar Preferências</p>
              <p className="text-sm text-muted-foreground">
                Suas configurações de notificação serão aplicadas imediatamente
              </p>
            </div>
            <Button onClick={handleSave} disabled={isLoading} className="gap-2">
              <Save className="h-4 w-4" />
              {isLoading ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
