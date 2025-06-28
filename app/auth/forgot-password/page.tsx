"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail, ArrowLeft, CheckCircle, Clock, Shield, RefreshCw } from "lucide-react"

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [email, setEmail] = useState("")
  const [emailSent, setEmailSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Simular envio de email
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Aqui você faria a chamada real para a API
      console.log("Password reset request for:", email)

      setEmailSent(true)
    } catch (err) {
      setError("Erro ao enviar email. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log("Resending email to:", email)
    } finally {
      setIsLoading(false)
    }
  }

  if (emailSent) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Email enviado com sucesso!</h1>
          <p className="text-gray-600">
            Enviamos as instruções para redefinir sua senha para <strong>{email}</strong>
          </p>
        </div>

        <Card className="shadow-xl">
          <CardContent className="p-6">
            <div className="space-y-4">
              <Alert>
                <Mail className="h-4 w-4" />
                <AlertDescription>
                  Verifique sua caixa de entrada e também a pasta de spam. O email pode levar alguns minutos para
                  chegar.
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">Próximos passos:</h3>
                <div className="space-y-2">
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-100 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-blue-600">1</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Verifique seu email</p>
                      <p className="text-xs text-gray-600">Procure por um email de redefinição de senha</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-100 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-blue-600">2</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Clique no link</p>
                      <p className="text-xs text-gray-600">O link é válido por 24 horas</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-100 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-blue-600">3</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Crie uma nova senha</p>
                      <p className="text-xs text-gray-600">Escolha uma senha forte e segura</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button onClick={handleResend} variant="outline" disabled={isLoading} className="flex-1 bg-transparent">
                  {isLoading ? (
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
                <Button asChild className="flex-1">
                  <Link href="/auth/login">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar ao login
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
      {/* Left Side - Information */}
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Esqueceu sua senha?</h1>
          <p className="text-lg text-gray-600">
            Não se preocupe! Digite seu email e enviaremos instruções para redefinir sua senha.
          </p>
        </div>

        {/* Security Info */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900">Processo seguro</h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="bg-green-100 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                <Shield className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Verificação por email</p>
                <p className="text-sm text-gray-600">Enviamos um link seguro apenas para o email cadastrado</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                <Clock className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Link temporário</p>
                <p className="text-sm text-gray-600">O link expira em 24 horas por segurança</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-purple-100 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Acesso imediato</p>
                <p className="text-sm text-gray-600">Após redefinir, você pode fazer login normalmente</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex items-center justify-center">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Redefinir Senha</CardTitle>
            <CardDescription>Digite seu email para receber as instruções</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <p className="text-xs text-gray-600">Digite o email associado à sua conta</p>
              </div>

              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isLoading}>
                {isLoading ? "Enviando..." : "Enviar instruções"}
              </Button>

              <div className="text-center">
                <Link
                  href="/auth/login"
                  className="text-sm text-green-600 hover:text-green-500 inline-flex items-center"
                >
                  <ArrowLeft className="mr-1 h-4 w-4" />
                  Voltar ao login
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
