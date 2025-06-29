"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/use-auth"
import { CheckCircle, XCircle, Loader2, Play, RefreshCw } from "lucide-react"

interface TestResult {
  test: string
  status: "pending" | "running" | "success" | "error"
  message: string
  duration?: number
}

export function LoginTest() {
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const { login, logout, getCurrentUser, isAuthenticated } = useAuth()

  const updateTestResult = (testName: string, status: TestResult["status"], message: string, duration?: number) => {
    setTestResults((prev) => {
      const existing = prev.find((t) => t.test === testName)
      if (existing) {
        return prev.map((t) => (t.test === testName ? { ...t, status, message, duration } : t))
      }
      return [...prev, { test: testName, status, message, duration }]
    })
  }

  const runTests = async () => {
    setIsRunning(true)
    setTestResults([])

    const tests = [
      {
        name: "Verificar Estado Inicial",
        run: async () => {
          const startTime = Date.now()
          console.log("🧪 Teste 1: Verificando estado inicial...")

          const user = getCurrentUser()
          const isAuth = isAuthenticated()

          console.log("👤 Usuário atual:", user)
          console.log("🔐 Está autenticado:", isAuth)

          if (!isAuth && !user) {
            return {
              success: true,
              message: "Estado inicial correto - não autenticado",
              duration: Date.now() - startTime,
            }
          } else {
            return {
              success: false,
              message: "Estado inicial incorreto - deveria estar deslogado",
              duration: Date.now() - startTime,
            }
          }
        },
      },
      {
        name: "Teste Login Inválido",
        run: async () => {
          const startTime = Date.now()
          console.log("🧪 Teste 2: Testando login com credenciais inválidas...")

          try {
            await login("invalid@email.com", "wrongpassword")
            return { success: false, message: "Login inválido deveria ter falhado", duration: Date.now() - startTime }
          } catch (error) {
            console.log("✅ Login inválido rejeitado corretamente:", error)
            return { success: true, message: "Login inválido rejeitado corretamente", duration: Date.now() - startTime }
          }
        },
      },
      {
        name: "Teste Login Válido - Demo",
        run: async () => {
          const startTime = Date.now()
          console.log("🧪 Teste 3: Testando login com credenciais válidas...")

          try {
            const result = await login("demo@whatsapp.com", "123456")

            if (result.success) {
              const user = getCurrentUser()
              const isAuth = isAuthenticated()

              console.log("✅ Login realizado com sucesso")
              console.log("👤 Usuário logado:", user)
              console.log("🔐 Estado de autenticação:", isAuth)

              if (user && isAuth) {
                return {
                  success: true,
                  message: `Login realizado com sucesso - ${user.firstName} ${user.lastName}`,
                  duration: Date.now() - startTime,
                }
              } else {
                return {
                  success: false,
                  message: "Login realizado mas estado inconsistente",
                  duration: Date.now() - startTime,
                }
              }
            } else {
              return { success: false, message: "Login falhou sem erro", duration: Date.now() - startTime }
            }
          } catch (error) {
            console.error("❌ Erro no login válido:", error)
            return { success: false, message: `Erro no login: ${error}`, duration: Date.now() - startTime }
          }
        },
      },
      {
        name: "Verificar LocalStorage",
        run: async () => {
          const startTime = Date.now()
          console.log("🧪 Teste 4: Verificando dados no localStorage...")

          const authData = localStorage.getItem("auth-token")
          console.log("💾 Dados no localStorage:", authData)

          if (authData) {
            try {
              const parsed = JSON.parse(authData)
              console.log("📋 Dados parseados:", parsed)

              if (parsed.token && parsed.user) {
                return {
                  success: true,
                  message: "Dados salvos corretamente no localStorage",
                  duration: Date.now() - startTime,
                }
              } else {
                return {
                  success: false,
                  message: "Dados incompletos no localStorage",
                  duration: Date.now() - startTime,
                }
              }
            } catch (error) {
              return {
                success: false,
                message: "Erro ao parsear dados do localStorage",
                duration: Date.now() - startTime,
              }
            }
          } else {
            return {
              success: false,
              message: "Nenhum dado encontrado no localStorage",
              duration: Date.now() - startTime,
            }
          }
        },
      },
      {
        name: "Teste Logout",
        run: async () => {
          const startTime = Date.now()
          console.log("🧪 Teste 5: Testando logout...")

          logout()

          // Aguardar um pouco para o logout processar
          await new Promise((resolve) => setTimeout(resolve, 500))

          const user = getCurrentUser()
          const isAuth = isAuthenticated()
          const authData = localStorage.getItem("auth-token")

          console.log("👤 Usuário após logout:", user)
          console.log("🔐 Autenticado após logout:", isAuth)
          console.log("💾 LocalStorage após logout:", authData)

          if (!user && !isAuth && !authData) {
            return { success: true, message: "Logout realizado com sucesso", duration: Date.now() - startTime }
          } else {
            return { success: false, message: "Logout não limpou todos os dados", duration: Date.now() - startTime }
          }
        },
      },
    ]

    for (const test of tests) {
      updateTestResult(test.name, "running", "Executando...")

      try {
        const result = await test.run()
        updateTestResult(test.name, result.success ? "success" : "error", result.message, result.duration)
      } catch (error) {
        updateTestResult(test.name, "error", `Erro: ${error}`)
      }

      // Aguardar entre testes
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }

    setIsRunning(false)
    console.log("🏁 Todos os testes concluídos!")
  }

  const clearTests = () => {
    setTestResults([])
    console.clear()
  }

  const getStatusIcon = (status: TestResult["status"]) => {
    switch (status) {
      case "running":
        return <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <div className="h-4 w-4 rounded-full bg-gray-300" />
    }
  }

  const getStatusBadge = (status: TestResult["status"]) => {
    switch (status) {
      case "running":
        return <Badge className="bg-blue-100 text-blue-800">Executando</Badge>
      case "success":
        return <Badge className="bg-green-100 text-green-800">Sucesso</Badge>
      case "error":
        return <Badge className="bg-red-100 text-red-800">Erro</Badge>
      default:
        return <Badge variant="secondary">Pendente</Badge>
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Play className="h-5 w-5" />
          Teste do Sistema de Login
        </CardTitle>
        <CardDescription>
          Execute testes automatizados para verificar o funcionamento do sistema de autenticação. Abra o console do
          navegador (F12) para ver logs detalhados.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Controles */}
        <div className="flex gap-4">
          <Button onClick={runTests} disabled={isRunning} className="bg-green-600 hover:bg-green-700">
            {isRunning ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Executando Testes...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Executar Testes
              </>
            )}
          </Button>

          <Button variant="outline" onClick={clearTests} disabled={isRunning}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Limpar Resultados
          </Button>
        </div>

        {/* Resultados dos Testes */}
        {testResults.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Resultados dos Testes</h3>

            <div className="space-y-3">
              {testResults.map((result, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(result.status)}
                    <div>
                      <p className="font-medium">{result.test}</p>
                      <p className="text-sm text-gray-600">{result.message}</p>
                      {result.duration && <p className="text-xs text-gray-500">{result.duration}ms</p>}
                    </div>
                  </div>
                  {getStatusBadge(result.status)}
                </div>
              ))}
            </div>

            {/* Resumo */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Resumo</h4>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-green-600">
                    {testResults.filter((t) => t.status === "success").length}
                  </p>
                  <p className="text-sm text-gray-600">Sucessos</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-600">
                    {testResults.filter((t) => t.status === "error").length}
                  </p>
                  <p className="text-sm text-gray-600">Erros</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-600">
                    {testResults.filter((t) => t.status === "running").length}
                  </p>
                  <p className="text-sm text-gray-600">Executando</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Instruções */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Como usar:</h4>
          <ol className="text-sm text-blue-800 space-y-1">
            <li>1. Abra o console do navegador (F12 → Console)</li>
            <li>2. Clique em "Executar Testes" para iniciar</li>
            <li>3. Acompanhe os logs detalhados no console</li>
            <li>4. Verifique os resultados aqui na interface</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  )
}
