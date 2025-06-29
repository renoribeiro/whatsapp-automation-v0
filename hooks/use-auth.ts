"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
  company?: string
}

interface RegisterData {
  firstName: string
  lastName: string
  email: string
  password: string
  company?: string
}

// Contas de teste
const testAccounts = [
  {
    email: "demo@whatsapp.com",
    password: "123456",
    user: {
      id: "1",
      email: "demo@whatsapp.com",
      firstName: "Demo",
      lastName: "User",
      role: "USER",
      company: "WhatsApp Platform Demo",
    },
  },
  {
    email: "reno@re9.online",
    password: "123Re92019!@#",
    user: {
      id: "2",
      email: "reno@re9.online",
      firstName: "Reno",
      lastName: "Admin",
      role: "SUPER_ADMIN",
      company: "RE9 Online",
    },
  },
  {
    email: "renoribeiro@hotmail.com",
    password: "123Re92019!@#",
    user: {
      id: "3",
      email: "renoribeiro@hotmail.com",
      firstName: "Reno",
      lastName: "Ribeiro",
      role: "COMPANY_ADMIN",
      company: "Empresa Reno Ribeiro",
    },
  },
]

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  // Verificar se há usuário logado ao carregar
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const authData = localStorage.getItem("auth-token")
        console.log("🔍 [useAuth] Verificando localStorage:", authData)

        if (authData) {
          const parsed = JSON.parse(authData)
          console.log("✅ [useAuth] Usuário encontrado:", parsed.user)
          setUser(parsed.user)
        } else {
          console.log("❌ [useAuth] Nenhum usuário logado")
        }
      } catch (error) {
        console.error("❌ [useAuth] Erro ao verificar auth:", error)
        localStorage.removeItem("auth-token")
      }
    }
  }, [])

  const login = async (email: string, password: string) => {
    console.log("🚀 [LOGIN] Iniciando processo de login...")
    console.log("📧 [LOGIN] Email:", email)
    console.log("🔑 [LOGIN] Password length:", password?.length || 0)

    setIsLoading(true)

    try {
      // Simular delay de rede
      console.log("⏳ [LOGIN] Simulando delay de rede...")
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Verificar credenciais
      console.log("🔍 [LOGIN] Procurando conta nos dados de teste...")
      console.log(
        "🔍 [LOGIN] Contas disponíveis:",
        testAccounts.map((acc) => ({ email: acc.email, hasPassword: !!acc.password })),
      )

      const account = testAccounts.find((acc) => {
        const emailMatch = acc.email === email
        const passwordMatch = acc.password === password
        console.log(`🔍 [LOGIN] Comparando: ${acc.email} === ${email} (${emailMatch}) && senha match: ${passwordMatch}`)
        return emailMatch && passwordMatch
      })

      if (account) {
        console.log("✅ [LOGIN] Conta encontrada:", account.user)

        // Salvar no localStorage
        const authData = {
          token: `token-${account.user.id}-${Date.now()}`,
          user: account.user,
          timestamp: Date.now(),
        }

        console.log("💾 [LOGIN] Salvando no localStorage:", authData)

        if (typeof window !== "undefined") {
          localStorage.setItem("auth-token", JSON.stringify(authData))

          // Verificar se foi salvo
          const saved = localStorage.getItem("auth-token")
          console.log("✅ [LOGIN] Verificação - dados salvos:", !!saved)
        }

        // Atualizar estado
        setUser(account.user)

        // Redirecionar usando router.push primeiro
        console.log("🔄 [LOGIN] Redirecionando para dashboard...")
        router.push("/dashboard")

        // Backup com window.location após um delay
        setTimeout(() => {
          if (typeof window !== "undefined") {
            window.location.href = "/dashboard"
          }
        }, 500)

        return { success: true }
      } else {
        console.log("❌ [LOGIN] Credenciais inválidas")
        throw new Error("Email ou senha incorretos. Verifique suas credenciais.")
      }
    } catch (error) {
      console.error("❌ [LOGIN] Erro no login:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (data: RegisterData) => {
    console.log("🚀 [REGISTER] Iniciando registro:", data)
    setIsLoading(true)

    try {
      // Simular delay de rede
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const newUser = {
        id: `user-${Date.now()}`,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: "USER",
        company: data.company,
      }

      const authData = {
        token: `token-${newUser.id}`,
        user: newUser,
        timestamp: Date.now(),
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("auth-token", JSON.stringify(authData))
      }

      setUser(newUser)
      router.push("/dashboard")

      return { success: true }
    } catch (error) {
      console.error("❌ [REGISTER] Erro no registro:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    console.log("🚪 [LOGOUT] Fazendo logout...")
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth-token")
    }
    setUser(null)
    router.push("/")
  }

  const getCurrentUser = () => {
    return user
  }

  const isAuthenticated = () => {
    return !!user
  }

  return {
    login,
    register,
    logout,
    getCurrentUser,
    isAuthenticated,
    isLoading,
    user,
  }
}
