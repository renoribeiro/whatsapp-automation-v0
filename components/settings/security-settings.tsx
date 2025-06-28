"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Shield, Key, Smartphone, Eye, EyeOff, Save, AlertTriangle, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function SecuritySettings() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    loginNotifications: true,
    sessionTimeout: true,
    deviceTracking: true,
    ipWhitelist: false,
    passwordExpiry: false,
  })

  const [sessions] = useState([
    {
      id: "1",
      device: "Chrome - Windows",
      location: "São Paulo, Brasil",
      lastActive: "Agora",
      current: true,
      ip: "192.168.1.100",
    },
    {
      id: "2",
      device: "Safari - iPhone",
      location: "São Paulo, Brasil",
      lastActive: "2 horas atrás",
      current: false,
      ip: "192.168.1.101",
    },
    {
      id: "3",
      device: "Chrome - Android",
      location: "Rio de Janeiro, Brasil",
      lastActive: "1 dia atrás",
      current: false,
      ip: "10.0.0.50",
    },
  ])

  const handlePasswordChange = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: "Senha alterada",
      description: "Sua senha foi atualizada com sucesso.",
    })

    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" })
    setIsLoading(false)
  }

  const handleSecuritySave = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: "Configurações de segurança atualizadas",
      description: "Suas preferências foram salvas com sucesso.",
    })

    setIsLoading(false)
  }

  const handleRevokeSession = (sessionId: string) => {
    toast({
      title: "Sessão revogada",
      description: "A sessão foi encerrada com sucesso.",
    })
  }

  const getPasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++

    return strength
  }

  const passwordStrength = getPasswordStrength(passwordForm.newPassword)
  const strengthLabels = ["Muito fraca", "Fraca", "Regular", "Boa", "Forte"]
  const strengthColors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-blue-500", "bg-green-500"]

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Configurações de Segurança
          </CardTitle>
          <CardDescription>Gerencie a segurança da sua conta e dados</CardDescription>
        </CardHeader>
      </Card>

      {/* Alterar Senha */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Alterar Senha
          </CardTitle>
          <CardDescription>Mantenha sua conta segura com uma senha forte</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Senha Atual</Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showCurrentPassword ? "text" : "password"}
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm((prev) => ({ ...prev, currentPassword: e.target.value }))}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">Nova Senha</Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>

            {passwordForm.newPassword && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${strengthColors[passwordStrength - 1] || "bg-gray-200"}`}
                      style={{ width: `${(passwordStrength / 5) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground">{strengthLabels[passwordStrength - 1] || ""}</span>
                </div>

                <div className="text-xs text-muted-foreground space-y-1">
                  <p className={passwordForm.newPassword.length >= 8 ? "text-green-600" : ""}>
                    ✓ Pelo menos 8 caracteres
                  </p>
                  <p className={/[A-Z]/.test(passwordForm.newPassword) ? "text-green-600" : ""}>
                    ✓ Uma letra maiúscula
                  </p>
                  <p className={/[a-z]/.test(passwordForm.newPassword) ? "text-green-600" : ""}>
                    ✓ Uma letra minúscula
                  </p>
                  <p className={/[0-9]/.test(passwordForm.newPassword) ? "text-green-600" : ""}>✓ Um número</p>
                  <p className={/[^A-Za-z0-9]/.test(passwordForm.newPassword) ? "text-green-600" : ""}>
                    ✓ Um caractere especial
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {passwordForm.confirmPassword && passwordForm.newPassword !== passwordForm.confirmPassword && (
              <p className="text-sm text-red-600">As senhas não coincidem</p>
            )}
          </div>

          <Button
            onClick={handlePasswordChange}
            disabled={
              isLoading ||
              !passwordForm.currentPassword ||
              !passwordForm.newPassword ||
              passwordForm.newPassword !== passwordForm.confirmPassword
            }
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            {isLoading ? "Alterando..." : "Alterar Senha"}
          </Button>
        </CardContent>
      </Card>

      {/* Autenticação de Dois Fatores */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Autenticação de Dois Fatores (2FA)
          </CardTitle>
          <CardDescription>Adicione uma camada extra de segurança à sua conta</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Ativar 2FA</Label>
              <p className="text-sm text-muted-foreground">Usar aplicativo autenticador para login</p>
            </div>
            <div className="flex items-center gap-2">
              {securitySettings.twoFactorEnabled && (
                <Badge variant="secondary" className="gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Ativo
                </Badge>
              )}
              <Switch
                checked={securitySettings.twoFactorEnabled}
                onCheckedChange={(value) => setSecuritySettings((prev) => ({ ...prev, twoFactorEnabled: value }))}
              />
            </div>
          </div>

          {!securitySettings.twoFactorEnabled && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">
                    Recomendamos ativar a autenticação de dois fatores
                  </p>
                  <p className="text-sm text-yellow-700 mt-1">
                    Isso tornará sua conta muito mais segura contra acessos não autorizados.
                  </p>
                </div>
              </div>
            </div>
          )}

          {securitySettings.twoFactorEnabled && (
            <div className="space-y-3">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-800">2FA está ativo</p>
                    <p className="text-sm text-green-700 mt-1">
                      Sua conta está protegida com autenticação de dois fatores.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Ver Códigos de Backup
                </Button>
                <Button variant="outline" size="sm">
                  Reconfigurar 2FA
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Configurações de Segurança */}
      <Card>
        <CardHeader>
          <CardTitle>Configurações Avançadas</CardTitle>
          <CardDescription>Configurações adicionais de segurança</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Notificações de login</Label>
              <p className="text-sm text-muted-foreground">Receber email quando alguém fizer login na sua conta</p>
            </div>
            <Switch
              checked={securitySettings.loginNotifications}
              onCheckedChange={(value) => setSecuritySettings((prev) => ({ ...prev, loginNotifications: value }))}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Timeout de sessão</Label>
              <p className="text-sm text-muted-foreground">Encerrar sessão automaticamente após inatividade</p>
            </div>
            <Switch
              checked={securitySettings.sessionTimeout}
              onCheckedChange={(value) => setSecuritySettings((prev) => ({ ...prev, sessionTimeout: value }))}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Rastreamento de dispositivos</Label>
              <p className="text-sm text-muted-foreground">Monitorar dispositivos que acessam sua conta</p>
            </div>
            <Switch
              checked={securitySettings.deviceTracking}
              onCheckedChange={(value) => setSecuritySettings((prev) => ({ ...prev, deviceTracking: value }))}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Lista branca de IPs</Label>
              <p className="text-sm text-muted-foreground">Permitir acesso apenas de IPs específicos</p>
            </div>
            <Switch
              checked={securitySettings.ipWhitelist}
              onCheckedChange={(value) => setSecuritySettings((prev) => ({ ...prev, ipWhitelist: value }))}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Expiração de senha</Label>
              <p className="text-sm text-muted-foreground">Forçar alteração de senha periodicamente</p>
            </div>
            <Switch
              checked={securitySettings.passwordExpiry}
              onCheckedChange={(value) => setSecuritySettings((prev) => ({ ...prev, passwordExpiry: value }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Sessões Ativas */}
      <Card>
        <CardHeader>
          <CardTitle>Sessões Ativas</CardTitle>
          <CardDescription>Gerencie os dispositivos conectados à sua conta</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {sessions.map((session) => (
            <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{session.device}</p>
                  {session.current && <Badge variant="secondary">Atual</Badge>}
                </div>
                <p className="text-sm text-muted-foreground">
                  {session.location} • {session.ip}
                </p>
                <p className="text-sm text-muted-foreground">Último acesso: {session.lastActive}</p>
              </div>
              {!session.current && (
                <Button variant="outline" size="sm" onClick={() => handleRevokeSession(session.id)}>
                  Revogar
                </Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Ações */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Salvar Configurações de Segurança</p>
              <p className="text-sm text-muted-foreground">Suas configurações serão aplicadas imediatamente</p>
            </div>
            <Button onClick={handleSecuritySave} disabled={isLoading} className="gap-2">
              <Save className="h-4 w-4" />
              {isLoading ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
