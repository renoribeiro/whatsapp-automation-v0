"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MessageCircle, Mail, Lock, Eye, EyeOff, Users, TrendingUp, Shield, Zap } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const { login, isLoading } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Por favor, preencha todos os campos")
      return
    }

    try {
      await login(email, password)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao fazer login")
    }
  }

  const stats = [
    { icon: Users, value: "10k+", label: "Empresas ativas" },
    { icon: TrendingUp, value: "300%", label: "Aumento médio em vendas" },
    { icon: Shield, value: "99.9%", label: "Uptime garantido" },
    { icon: Zap, value: "24/7", label: "Suporte disponível" },
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
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Entrando..." : "Entrar"}
                </Button>
              </form>

              <div className="text-center">
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-green-600 hover:text-green-700 dark:text-green-400"
                >
                  Esqueceu a senha?
                </Link>
              </div>

              <div className="text-center pt-4 border-t">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Não tem uma conta?{" "}
                  <Link
                    href="/auth/register"
                    className="text-green-600 hover:text-green-700 dark:text-green-400 font-medium"
                  >
                    Criar conta
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Demo Credentials */}
          <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
            <CardHeader>
              <CardTitle className="text-lg text-green-800 dark:text-green-300">Credenciais de Demonstração</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="font-medium text-green-700 dark:text-green-300">Demo Geral:</p>
                <p className="text-green-600 dark:text-green-400">demo@whatsapp.com / 123456</p>
              </div>
              <div>
                <p className="font-medium text-green-700 dark:text-green-300">Admin Total:</p>
                <p className="text-green-600 dark:text-green-400">reno@re9.online / 123Re92019!@#</p>
              </div>
              <div>
                <p className="font-medium text-green-700 dark:text-green-300">Empresa:</p>
                <p className="text-green-600 dark:text-green-400">renoribeiro@hotmail.com / 123Re92019!@#</p>
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
                <div key={index} className="bg-gray-800 rounded-xl p-6 hover:bg-gray-700 transition-colors">
                  <Icon className="h-8 w-8 text-green-400 mb-3" />
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
