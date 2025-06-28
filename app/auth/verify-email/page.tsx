"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Mail,
  MessageCircle,
  Users,
  BarChart3,
  Clock,
  Headphones,
} from "lucide-react"

export default function VerifyEmailPage() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const [isLoading, setIsLoading] = useState(true)
  const [verificationStatus, setVerificationStatus] = useState<"loading" | "success" | "error" | "expired">("loading")
  const [isResending, setIsResending] = useState(false)

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setVerificationStatus("error")
        setIsLoading(false)
        return
      }

      try {
        // Simular verificação
        await new Promise((resolve) => setTimeout(resolve, 2000))

        // Simular diferentes cenários
        const random = Math.random()
        if (random < 0.7) {
          setVerificationStatus("success")
        } else if (random < 0.9) {
          setVerificationStatus("expired")
        } else {
          setVerificationStatus("error")
        }
      } catch (err) {
        setVerificationStatus("error")
      } finally {
        setIsLoading(false)
      }
    }

    verifyEmail()
  }, [token])

  const handleResendEmail = async () => {
    setIsResending(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log("Resending verification email")
    } finally {
      setIsResending(false)
    }
  }

  if (verificationStatus === "loading") {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-xl">
          <CardContent className="p-8 text-center">
            <RefreshCw className="h-12 w-12 animate-spin text-green-600 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold mb-4">Verificando seu email...</h2>
            <p className="text-gray-600">Aguarde enquanto confirmamos sua conta. Isso pode levar alguns segundos.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (verificationStatus === "success") {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Email verificado com sucesso!</h1>
          <p className="text-lg text-gray-600">
            Sua conta foi ativada. Agora você pode aproveitar todos os recursos da nossa plataforma.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Side - Next Steps */}
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl">Próximos passos</CardTitle>
              <CardDescription>Comece a usar a plataforma seguindo este guia rápido</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="bg-green-100 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-green-600">1</span>
                  </div>
                  <div>
                    <p className="font-medium">Configure seu perfil</p>
                    <p className="text-sm text-gray-600">Adicione informações da sua empresa e personalize sua conta</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-green-100 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-green-600">2</span>
                  </div>
                  <div>
                    <p className="font-medium">Conecte seu WhatsApp</p>
                    <p className="text-sm text-gray-600">Integre sua conta do WhatsApp Business para começar</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-green-100 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-green-600">3</span>
                  </div>
                  <div>
                    <p className="font-medium">Importe seus contatos</p>
                    <p className="text-sm text-gray-600">Adicione sua base de contatos para começar as conversas</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-green-100 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-green-600">4</span>
                  </div>
                  <div>
                    <p className="font-medium">Configure automações</p>
                    <p className="text-sm text-gray-600">Crie fluxos automáticos para otimizar seu atendimento</p>
                  </div>
                </div>
              </div>

              <Button asChild className="w-full bg-green-600 hover:bg-green-700 mt-6">
                <Link href="/dashboard">Acessar Dashboard</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Right Side - Features Preview */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recursos disponíveis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3">
                    <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">
                      <MessageCircle className="h-5 w-5 text-blue-600" />
                    </div>
                    <p className="text-sm font-medium">Chat Unificado</p>
                  </div>
                  <div className="text-center p-3">
                    <div className="bg-purple-100 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Users className="h-5 w-5 text-purple-600" />
                    </div>
                    <p className="text-sm font-medium">Gestão de Equipe</p>
                  </div>
                  <div className="text-center p-3">
                    <div className="bg-green-100 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">
                      <BarChart3 className="h-5 w-5 text-green-600" />
                    </div>
                    <p className="text-sm font-medium">Relatórios</p>
                  </div>
                  <div className="text-center p-3">
                    <div className="bg-orange-100 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">
                      <RefreshCw className="h-5 w-5 text-orange-600" />
                    </div>
                    <p className="text-sm font-medium">Automação</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Estatísticas da plataforma</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Headphones className="h-5 w-5 text-blue-600" />
                      <span className="font-medium">Suporte 24/7</span>
                    </div>
                    <span className="text-sm text-gray-600">Disponível</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Clock className="h-5 w-5 text-green-600" />
                      <span className="font-medium">Uptime</span>
                    </div>
                    <span className="text-sm text-gray-600">99.9%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Users className="h-5 w-5 text-purple-600" />
                      <span className="font-medium">Usuários ativos</span>
                    </div>
                    <span className="text-sm text-gray-600">10k+</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (verificationStatus === "expired") {
    return (
      <div className="max-w-md mx-auto">
        <Card className="shadow-xl">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-8 w-8 text-yellow-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Link expirado</h2>
            <p className="text-gray-600 mb-4">
              Este link de verificação expirou. Links são válidos por apenas 24 horas por segurança.
            </p>
            <Button onClick={handleResendEmail} disabled={isResending} className="w-full mb-3">
              {isResending ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Reenviando...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Reenviar email
                </>
              )}
            </Button>
            <Button asChild variant="outline" className="w-full bg-transparent">
              <Link href="/auth/login">Voltar ao login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Error state
  return (
    <div className="max-w-md mx-auto">
      <Card className="shadow-xl">
        <CardContent className="p-6 text-center">
          <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Erro na verificação</h2>
          <p className="text-gray-600 mb-4">
            Não foi possível verificar seu email. O link pode ser inválido ou ter sido corrompido.
          </p>
          <Button onClick={handleResendEmail} disabled={isResending} className="w-full mb-3">
            {isResending ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Reenviando...
              </>
            ) : (
              <>
                <Mail className="mr-2 h-4 w-4" />
                Reenviar email
              </>
            )}
          </Button>
          <Button asChild variant="outline" className="w-full bg-transparent">
            <Link href="/auth/register">Criar nova conta</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
