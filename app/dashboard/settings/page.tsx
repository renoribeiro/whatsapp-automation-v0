"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { User, Building, Bell, Shield, Palette, Database, Zap, CreditCard, Users, MessageCircle } from "lucide-react"
import { ProfileSettings } from "@/components/settings/profile-settings"
import { CompanySettings } from "@/components/settings/company-settings"
import { NotificationSettings } from "@/components/settings/notification-settings"
import { SecuritySettings } from "@/components/settings/security-settings"
import { AppearanceSettings } from "@/components/settings/appearance-settings"
import { DatabaseSettings } from "@/components/settings/database-settings"
import { IntegrationSettings } from "@/components/settings/integration-settings"
import { BillingSettings } from "@/components/settings/billing-settings"
import { TeamSettings } from "@/components/settings/team-settings"
import { WhatsAppSettings } from "@/components/settings/whatsapp-settings"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile")

  const settingsSections = [
    {
      id: "profile",
      label: "Perfil",
      icon: User,
      description: "Gerencie suas informações pessoais",
      component: ProfileSettings,
    },
    {
      id: "company",
      label: "Empresa",
      icon: Building,
      description: "Configurações da empresa",
      component: CompanySettings,
    },
    {
      id: "team",
      label: "Equipe",
      icon: Users,
      description: "Gerenciar usuários e permissões",
      component: TeamSettings,
      badge: "3",
    },
    {
      id: "whatsapp",
      label: "WhatsApp",
      icon: MessageCircle,
      description: "Configurações do WhatsApp Business",
      component: WhatsAppSettings,
    },
    {
      id: "notifications",
      label: "Notificações",
      icon: Bell,
      description: "Preferências de notificação",
      component: NotificationSettings,
    },
    {
      id: "security",
      label: "Segurança",
      icon: Shield,
      description: "Configurações de segurança",
      component: SecuritySettings,
    },
    {
      id: "appearance",
      label: "Aparência",
      icon: Palette,
      description: "Tema e personalização",
      component: AppearanceSettings,
    },
    {
      id: "integrations",
      label: "Integrações",
      icon: Zap,
      description: "APIs e webhooks",
      component: IntegrationSettings,
      badge: "New",
    },
    {
      id: "database",
      label: "Banco de Dados",
      icon: Database,
      description: "Backup e sincronização",
      component: DatabaseSettings,
    },
    {
      id: "billing",
      label: "Faturamento",
      icon: CreditCard,
      description: "Planos e pagamentos",
      component: BillingSettings,
    },
  ]

  const ActiveComponent = settingsSections.find((section) => section.id === activeTab)?.component || ProfileSettings

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Configurações</h2>
          <p className="text-muted-foreground">Gerencie as configurações da sua conta e plataforma</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar com lista de configurações */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Configurações</CardTitle>
                <CardDescription>Escolha uma categoria para configurar</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <TabsList className="grid w-full grid-cols-1 h-auto bg-transparent p-1">
                  {settingsSections.map((section) => {
                    const Icon = section.icon
                    return (
                      <TabsTrigger
                        key={section.id}
                        value={section.id}
                        className="w-full justify-start gap-2 px-3 py-2 h-auto data-[state=active]:bg-muted"
                      >
                        <Icon className="h-4 w-4" />
                        <div className="flex-1 text-left">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{section.label}</span>
                            {section.badge && (
                              <Badge variant={section.badge === "New" ? "default" : "secondary"} className="text-xs">
                                {section.badge}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{section.description}</p>
                        </div>
                      </TabsTrigger>
                    )
                  })}
                </TabsList>
              </CardContent>
            </Card>
          </div>

          {/* Conteúdo principal */}
          <div className="lg:col-span-3">
            {settingsSections.map((section) => (
              <TabsContent key={section.id} value={section.id} className="mt-0">
                <section.component />
              </TabsContent>
            ))}
          </div>
        </div>
      </Tabs>
    </div>
  )
}
