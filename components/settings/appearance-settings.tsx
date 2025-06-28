"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Palette, Monitor, Sun, Moon, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function AppearanceSettings() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [settings, setSettings] = useState({
    theme: "system",
    primaryColor: "blue",
    fontSize: "medium",
    compactMode: false,
    animations: true,
    highContrast: false,
    language: "pt-BR",
    dateFormat: "dd/mm/yyyy",
    timeFormat: "24h",
    currency: "BRL",
  })

  const handleSave = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: "Configurações de aparência atualizadas",
      description: "Suas preferências foram salvas com sucesso.",
    })

    setIsLoading(false)
  }

  const handleSelectChange = (field: string, value: string) => {
    setSettings((prev) => ({ ...prev, [field]: value }))
  }

  const handleSwitchChange = (field: string, value: boolean) => {
    setSettings((prev) => ({ ...prev, [field]: value }))
  }

  const colorOptions = [
    { value: "blue", label: "Azul", color: "bg-blue-500" },
    { value: "green", label: "Verde", color: "bg-green-500" },
    { value: "purple", label: "Roxo", color: "bg-purple-500" },
    { value: "orange", label: "Laranja", color: "bg-orange-500" },
    { value: "red", label: "Vermelho", color: "bg-red-500" },
    { value: "pink", label: "Rosa", color: "bg-pink-500" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Configurações de Aparência
          </CardTitle>
          <CardDescription>Personalize a aparência da plataforma</CardDescription>
        </CardHeader>
      </Card>

      {/* Tema */}
      <Card>
        <CardHeader>
          <CardTitle>Tema</CardTitle>
          <CardDescription>Escolha como a plataforma deve aparecer</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div
              className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                settings.theme === "light" ? "border-primary" : "border-border"
              }`}
              onClick={() => handleSelectChange("theme", "light")}
            >
              <div className="flex items-center gap-2 mb-2">
                <Sun className="h-4 w-4" />
                <span className="font-medium">Claro</span>
              </div>
              <div className="bg-white border rounded p-2 space-y-1">
                <div className="bg-gray-100 h-2 rounded"></div>
                <div className="bg-gray-200 h-2 rounded w-3/4"></div>
              </div>
            </div>

            <div
              className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                settings.theme === "dark" ? "border-primary" : "border-border"
              }`}
              onClick={() => handleSelectChange("theme", "dark")}
            >
              <div className="flex items-center gap-2 mb-2">
                <Moon className="h-4 w-4" />
                <span className="font-medium">Escuro</span>
              </div>
              <div className="bg-gray-900 border rounded p-2 space-y-1">
                <div className="bg-gray-700 h-2 rounded"></div>
                <div className="bg-gray-600 h-2 rounded w-3/4"></div>
              </div>
            </div>

            <div
              className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                settings.theme === "system" ? "border-primary" : "border-border"
              }`}
              onClick={() => handleSelectChange("theme", "system")}
            >
              <div className="flex items-center gap-2 mb-2">
                <Monitor className="h-4 w-4" />
                <span className="font-medium">Sistema</span>
              </div>
              <div className="bg-gradient-to-r from-white to-gray-900 border rounded p-2 space-y-1">
                <div className="bg-gray-400 h-2 rounded"></div>
                <div className="bg-gray-500 h-2 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cor Primária */}
      <Card>
        <CardHeader>
          <CardTitle>Cor Primária</CardTitle>
          <CardDescription>Escolha a cor principal da interface</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {colorOptions.map((color) => (
              <div
                key={color.value}
                className={`border-2 rounded-lg p-3 cursor-pointer transition-colors ${
                  settings.primaryColor === color.value ? "border-primary" : "border-border"
                }`}
                onClick={() => handleSelectChange("primaryColor", color.value)}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className={`w-8 h-8 rounded-full ${color.color}`}></div>
                  <span className="text-sm font-medium">{color.label}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Configurações de Display */}
      <Card>
        <CardHeader>
          <CardTitle>Configurações de Display</CardTitle>
          <CardDescription>Ajuste o tamanho e densidade da interface</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fontSize">Tamanho da Fonte</Label>
              <Select value={settings.fontSize} onValueChange={(value) => handleSelectChange("fontSize", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Pequena</SelectItem>
                  <SelectItem value="medium">Média</SelectItem>
                  <SelectItem value="large">Grande</SelectItem>
                  <SelectItem value="extra-large">Extra Grande</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Modo Compacto</Label>
              <p className="text-sm text-muted-foreground">Reduzir espaçamento para mostrar mais conteúdo</p>
            </div>
            <Switch
              checked={settings.compactMode}
              onCheckedChange={(value) => handleSwitchChange("compactMode", value)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Animações</Label>
              <p className="text-sm text-muted-foreground">Ativar transições e animações na interface</p>
            </div>
            <Switch
              checked={settings.animations}
              onCheckedChange={(value) => handleSwitchChange("animations", value)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Alto Contraste</Label>
              <p className="text-sm text-muted-foreground">Aumentar contraste para melhor acessibilidade</p>
            </div>
            <Switch
              checked={settings.highContrast}
              onCheckedChange={(value) => handleSwitchChange("highContrast", value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Configurações Regionais */}
      <Card>
        <CardHeader>
          <CardTitle>Configurações Regionais</CardTitle>
          <CardDescription>Idioma, formato de data e moeda</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="language">Idioma</Label>
              <Select value={settings.language} onValueChange={(value) => handleSelectChange("language", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                  <SelectItem value="en-US">English (US)</SelectItem>
                  <SelectItem value="es-ES">Español</SelectItem>
                  <SelectItem value="fr-FR">Français</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Moeda</Label>
              <Select value={settings.currency} onValueChange={(value) => handleSelectChange("currency", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BRL">Real (R$)</SelectItem>
                  <SelectItem value="USD">Dólar ($)</SelectItem>
                  <SelectItem value="EUR">Euro (€)</SelectItem>
                  <SelectItem value="GBP">Libra (£)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dateFormat">Formato de Data</Label>
              <Select value={settings.dateFormat} onValueChange={(value) => handleSelectChange("dateFormat", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dd/mm/yyyy">DD/MM/AAAA</SelectItem>
                  <SelectItem value="mm/dd/yyyy">MM/DD/AAAA</SelectItem>
                  <SelectItem value="yyyy-mm-dd">AAAA-MM-DD</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeFormat">Formato de Hora</Label>
              <Select value={settings.timeFormat} onValueChange={(value) => handleSelectChange("timeFormat", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">24 horas</SelectItem>
                  <SelectItem value="12h">12 horas (AM/PM)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Pré-visualização</CardTitle>
          <CardDescription>Veja como suas configurações afetam a interface</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Exemplo de Interface</h3>
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${colorOptions.find((c) => c.value === settings.primaryColor)?.color}`}
                ></div>
                <span className="text-sm">Cor primária</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="bg-muted h-4 rounded w-full"></div>
              <div className="bg-muted h-4 rounded w-3/4"></div>
              <div className="bg-muted h-4 rounded w-1/2"></div>
            </div>
            <div className="flex gap-2">
              <div
                className={`px-3 py-1 rounded text-white text-sm ${colorOptions.find((c) => c.value === settings.primaryColor)?.color}`}
              >
                Botão Primário
              </div>
              <div className="px-3 py-1 rounded border text-sm">Botão Secundário</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ações */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Salvar Configurações de Aparência</p>
              <p className="text-sm text-muted-foreground">As alterações serão aplicadas imediatamente</p>
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
