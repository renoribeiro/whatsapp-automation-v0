"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Lock, Eye, EyeOff, Check, X, CheckCircle, AlertTriangle, RefreshCw, ArrowLeft } from "lucide-react"

export default function ResetPasswordPage() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const [isLoading, setIsLoading] = useState(false)
  const [isValidating, setIsValidating] = useState(true)
  const [tokenValid, setTokenValid] = useState(false)
  const [tokenExpired, setTokenExpired] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  })

  const passwordCriteria = [
    { label: "Pelo menos 8 caracteres", test: (pwd: string) => pwd.length >= 8 },
    { label: "Uma letra maiúscula", test: (pwd: string) => /[A-Z]/.test(pwd) },
    { label: "Uma letra minúscula", test: (pwd: string) => /[a-z]/.test(pwd) },
    { label: "Um número", test: (pwd: string) => /\d/.test(pwd) },
    { label: "Um caractere especial", test: (pwd: string) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd) },
  ]

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setTokenValid(false)
        setIsValidating(false)
        return
      }

      try {
        // Simular validação do token
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Simular diferentes cenários
        const random = Math.random()
        if (random < 0.7) {
          setTokenValid(true)
        } else if (random < 0.9) {
          setTokenExpired(true)
        } else {
          setTokenValid(false)
        }
      } catch (err) {
        setTokenValid(false)
      } finally {
        setIsValidating(false)
      }
    }

    validateToken()
  }, [token])

  const getPasswordStrength = () => {
    const passedCriteria = passwordCriteria.filter((criteria) => criteria.test(formData.password)).length
    return (passedCriteria / passwordCriteria.length) * 100
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem")
      setIsLoading(false)
      return
    }

    const allCriteriaMet = passwordCriteria.every((criteria) => criteria.test(formData.password))
    if (!allCriteriaMet) {
      setError("A senha não atende a todos os critérios de segurança")
      setIsLoading(false)
      return
    }

    try {
      // Simular reset de senha
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Aqui você faria a chamada real para a API
      console.log("Password reset with token:", token)

      setSuccess(true)
    } catch (err) {
      setError("Erro ao redefinir senha. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isValidating) {
    return (
      <div className="max-w-md mx-auto">
        <Card className="shadow-xl">
          <CardContent className="p-6 text-center">
            <RefreshCw className="h-8 w-8 animate-spin text-green-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Validando link...</h2>
            <p className="text-gray-600">Verificando se o link é válido e não expirou</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!token || (!tokenValid && !tokenExpired)) {
    return (
      <div className="max-w-md mx-auto">
        <Card className="shadow-xl">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Link inválido</h2>
            <p className="text-gray-600 mb-4">O link de redefinição de senha é inválido ou foi corrompido.</p>
            <Button asChild className="w-full">
              <Link href="/auth/forgot-password">Solicitar novo link</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (tokenExpired) {
    return (
      <div className="max-w-md mx-auto">
        <Card className="shadow-xl">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-8 w-8 text-yellow-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Link expirado</h2>
            <p className="text-gray-600 mb-4">
              Este link de redefinição de senha expirou. Links são válidos por apenas 24 horas por segurança.
            </p>
            <Button asChild className="w-full">
              <Link href="/auth/forgot-password">Solicitar novo link</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (success) {
    return (
      <div className="max-w-md mx-auto">
        <Card className="shadow-xl">
          <CardContent className="p-6 text-center">
            <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Senha redefinida!</h2>
            <p className="text-gray-600 mb-4">
              Sua senha foi redefinida com sucesso. Agora você pode fazer login com sua nova senha.
            </p>
            <Button asChild className="w-full">
              <Link href="/auth/login">Fazer login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto">
      <Card className="shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Nova Senha</CardTitle>
          <CardDescription>Crie uma senha forte e segura para sua conta</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="password">Nova Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Sua nova senha"
                  className="pl-10 pr-10"
                  value={formData.password}
                  onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {formData.password && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span>Força da senha:</span>
                    <span className="font-medium">
                      {getPasswordStrength() < 40 ? "Fraca" : getPasswordStrength() < 80 ? "Média" : "Forte"}
                    </span>
                  </div>
                  <Progress value={getPasswordStrength()} className="h-2" />
                  <div className="space-y-1">
                    {passwordCriteria.map((criteria, index) => (
                      <div key={index} className="flex items-center space-x-2 text-xs">
                        {criteria.test(formData.password) ? (
                          <Check className="h-3 w-3 text-green-500" />
                        ) : (
                          <X className="h-3 w-3 text-gray-400" />
                        )}
                        <span className={criteria.test(formData.password) ? "text-green-600" : "text-gray-500"}>
                          {criteria.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirme sua nova senha"
                  className="pl-10 pr-10"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {formData.confirmPassword && (
                <div className="flex items-center space-x-2 text-xs">
                  {formData.password === formData.confirmPassword ? (
                    <>
                      <Check className="h-3 w-3 text-green-500" />
                      <span className="text-green-600">Senhas coincidem</span>
                    </>
                  ) : (
                    <>
                      <X className="h-3 w-3 text-red-500" />
                      <span className="text-red-600">Senhas não coincidem</span>
                    </>
                  )}
                </div>
              )}
            </div>

            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isLoading}>
              {isLoading ? "Redefinindo..." : "Redefinir senha"}
            </Button>

            <div className="text-center">
              <Link href="/auth/login" className="text-sm text-green-600 hover:text-green-500 inline-flex items-center">
                <ArrowLeft className="mr-1 h-4 w-4" />
                Voltar ao login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
