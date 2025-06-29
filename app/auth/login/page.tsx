"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MessageCircle, Mail, Lock, Eye, EyeOff, Users, TrendingUp, Shield, Zap, AlertCircle } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

export default function LoginPage() {
  const [email, setEmail] = useState("demo@whatsapp.com")
  const [password, setPassword] = useState("123456")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const { login, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()

  // Verificar se já está logado
  useEffect(() => {
    if (isAuthenticated()) {
      console.log("👤 Usuário já está logado, redirecionando...")
      router.push("/dashboard")
    }
  }, [isAuthenticated, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("📝 Formulário submetido")

    setError("")
    setSuccess("")

    if (!email || !password) {
      const errorMsg = "Por favor, preencha todos os campos"
      console.log("❌", errorMsg)
      setError(errorMsg)
      return
    }

    if (!email.includes("@")) {
      const errorMsg = "Por favor, digite um email válido"
      console.log("❌", errorMsg)
      setError(errorMsg)
      return
    }

    try {
      console.log("🔄 Chamando função de login...")
      setSuccess("Verificando credenciais...")

      const result = await login(email, password)

      if (result.success) {
        console.log("✅ Login realizado com sucesso!")
        setSuccess("Login realizado com sucesso! Redirecionando...")

        // Aguardar um pouco antes de redirecionar
        setTimeout(() => {
          window.location.href = "/dashboard"
        }, 1000)
      }
    } catch (err) {
      console.error("❌ Erro capturado no componente:", err)
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido ao fazer login"
      setError(errorMessage)
      setSuccess("")
    }
  }

  const fillCredentials = (newEmail: string, newPassword: string) => {
    console.log("🔄 Preenchendo credenciais:", newEmail)
    setEmail(newEmail)
    setPassword(newPassword)
    setError("")
    setSuccess("")
  }

  const stats = [
    {
      icon: Users,
      value: "10k+",
      label: "Empresas ativas",
      color: "text-green-400",
    },
    {
      icon: TrendingUp,
      value: "300%",
      label: "Aumento médio em vendas",
      color: "text-blue-400",
    },
    {
      icon: Shield,
      value: "99.9%",
      label: "Uptime garantido",
      color: "text-purple-400",
    },
    {
      icon: Zap,
      value: "24/7",
      label: "Suporte disponível",
      color: "text-yellow-400",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex">
      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="text-center">
            <Link href="/" className="inline-flex items-center space-x-2">
              <div className="bg-green-600 p-2 rounded-lg">
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">WhatsApp Platform</span>
            </Link>
          </div>

          {/* Demo Credentials */}
          <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
            <CardHeader>
              <CardTitle className="text-lg text-green-800 dark:text-green-300 flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Credenciais de Demonstração
              </CardTitle>
              <CardDescription className="text-green-600 dark:text-green-400">
                Clique em qualquer credencial para preencher automaticamente
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <p className="font-medium text-green-700 dark:text-green-300">Demo Geral:</p>
                <button
                  type="button"
                  onClick={() => fillCredentials("demo@whatsapp.com", "123456")}
                  className="w-full text-left p-3 rounded-lg bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-900/50 transition-all duration-200 border border-green-200 dark:border-green-800"
                >
                  <p className="text-sm font-medium text-green-700 dark:text-green-300">demo@whatsapp.com</p>
                  <p className="text-sm text-green-600 dark:text-green-400">123456</p>
                </button>
              </div>

              <div className="space-y-2">
                <p className="font-medium text-green-700 dark:text-green-300">Super Admin:</p>
                <button
                  type="button"
                  onClick={() => fillCredentials("reno@re9.online", "123Re92019!@#")}
                  className="w-full text-left p-3 rounded-lg bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-900/50 transition-all duration-200 border border-green-200 dark:border-green-800"
                >
                  <p className="text-sm font-medium text-green-700 dark:text-green-300">reno@re9.online</p>
                  <p className="text-sm text-green-600 dark:text-green-400">123Re92019!@#</p>
                </button>
              </div>

              <div className="space-y-2">
                <p className="font-medium text-green-700 dark:text-green-300">Empresa:</p>
                <button
                  type="button"
                  onClick={() => fillCredentials("renoribeiro@hotmail.com", "123Re92019!@#")}
                  className="w-full text-left p-3 rounded-lg bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-900/50 transition-all duration-200 border border-green-200 dark:border-green-800"
                >
                  <p className="text-sm font-medium text-green-700 dark:text-green-300">renoribeiro@hotmail.com</p>
                  <p className="text-sm text-green-600 dark:text-green-400">123Re92019!@#</p>
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Login Card */}
          <Card className="border-0 shadow-xl">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl font-bold">Bem-vindo de volta!</CardTitle>
              <CardDescription>Digite suas credenciais para acessar o painel</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      disabled={isLoading}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10"
                      disabled={isLoading}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="border-green-200 bg-green-50 text-green-800">
                    <MessageCircle className="h-4 w-4" />
                    <AlertDescription>{success}</AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Entrando...
                    </div>
                  ) : (
                    "Entrar"
                  )}
                </Button>
              </form>

              <div className="text-center">
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-green-600 hover:text-green-700 dark:text-green-400 transition-colors"
                >
                  Esqueceu a senha?
                </Link>
              </div>

              <div className="text-center pt-4 border-t">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Não tem uma conta?{" "}
                  <Link
                    href="/auth/register"
                    className="text-green-600 hover:text-green-700 dark:text-green-400 font-medium transition-colors"
                  >
                    Criar conta
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right Side - Stats */}
      <div className="hidden lg:flex flex-1 bg-gray-900 text-white p-12 items-center justify-center">
        <div className="max-w-md space-y-8">
          <div>
            <h2 className="text-3xl font-bold mb-4">Junte-se a milhares de empresas</h2>
            <p className="text-gray-300 text-lg">Que já transformaram suas vendas com nossa plataforma</p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div
                  key={index}
                  className="bg-gray-800 rounded-xl p-6 hover:bg-gray-700 transition-all duration-300 hover:scale-105"
                >
                  <Icon className={`h-8 w-8 ${stat.color} mb-3`} />
                  <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
