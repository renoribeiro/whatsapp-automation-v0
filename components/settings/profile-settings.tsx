"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Camera, Save, User, Mail, Phone, MapPin, Calendar } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function ProfileSettings() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [profile, setProfile] = useState({
    firstName: "João",
    lastName: "Silva",
    email: "joao.silva@empresa.com",
    phone: "+55 11 99999-9999",
    bio: "Gerente de vendas com 5 anos de experiência em atendimento ao cliente via WhatsApp.",
    location: "São Paulo, SP",
    birthDate: "1990-05-15",
    avatar: "/placeholder.svg?height=100&width=100&text=JS",
  })

  const handleSave = async () => {
    setIsLoading(true)

    // Simular salvamento
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: "Perfil atualizado",
      description: "Suas informações foram salvas com sucesso.",
    })

    setIsLoading(false)
  }

  const handleInputChange = (field: string, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Informações Pessoais
          </CardTitle>
          <CardDescription>Gerencie suas informações pessoais e como elas aparecem na plataforma</CardDescription>
        </CardHeader>
      </Card>

      {/* Avatar e informações básicas */}
      <Card>
        <CardHeader>
          <CardTitle>Foto do Perfil</CardTitle>
          <CardDescription>Esta foto será exibida em seu perfil e nas conversas</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profile.avatar || "/placeholder.svg"} alt="Avatar" />
              <AvatarFallback className="text-lg">
                {profile.firstName[0]}
                {profile.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <Camera className="h-4 w-4" />
                Alterar Foto
              </Button>
              <p className="text-sm text-muted-foreground">JPG, PNG ou GIF. Máximo 2MB.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informações pessoais */}
      <Card>
        <CardHeader>
          <CardTitle>Dados Pessoais</CardTitle>
          <CardDescription>Mantenha suas informações atualizadas</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Nome</Label>
              <Input
                id="firstName"
                value={profile.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Sobrenome</Label>
              <Input
                id="lastName"
                value={profile.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
              <Badge variant="secondary">Verificado</Badge>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Telefone
            </Label>
            <Input id="phone" value={profile.phone} onChange={(e) => handleInputChange("phone", e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Localização
            </Label>
            <Input
              id="location"
              value={profile.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="birthDate" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Data de Nascimento
            </Label>
            <Input
              id="birthDate"
              type="date"
              value={profile.birthDate}
              onChange={(e) => handleInputChange("birthDate", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Biografia</Label>
            <Textarea
              id="bio"
              placeholder="Conte um pouco sobre você..."
              value={profile.bio}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              rows={3}
            />
            <p className="text-sm text-muted-foreground">{profile.bio.length}/500 caracteres</p>
          </div>
        </CardContent>
      </Card>

      {/* Ações */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Salvar Alterações</p>
              <p className="text-sm text-muted-foreground">Suas alterações serão aplicadas imediatamente</p>
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
