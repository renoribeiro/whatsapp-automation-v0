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
    const checkAuth = () => {
      try {
        const authData = localStorage.getItem("auth-token")
        console.log("🔍 Verificando auth no localStorage:", authData)

        if (authData) {
          const parsed = JSON.parse(authData)
          console.log("✅ Usuário encontrado:", parsed.user)
          setUser(parsed.user)
        } else {
          console.log("❌ Nenhum usuário logado")
        }
      } catch (error) {
        console.error("❌ Erro ao verificar auth:", error)
        localStorage.removeItem("auth-token")
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    console.log("🚀 Iniciando processo de login...")
    console.log("📧 Email:", email)
    console.log("🔑 Password:", password ? "***" : "vazio")

    setIsLoading(true)

    try {
      // Simular delay de rede
      console.log("⏳ Simulando delay de rede...")
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Verificar credenciais
      console.log("🔍 Procurando conta nos dados de teste...")
      const account = testAccounts.find((acc) => {
        console.log(`🔍 Comparando: ${acc.email} === ${email} && ${acc.password} === ${password}`)
        return acc.email === email && acc.password === password
      })

      if (account) {
        console.log("✅ Conta encontrada:", account.user)

        // Salvar no localStorage
        const authData = {
          token: `token-${account.user.id}-${Date.now()}`,
          user: account.user,
          timestamp: Date.now(),
        }

        console.log("💾 Salvando no localStorage:", authData)
        localStorage.setItem("auth-token", JSON.stringify(authData))

        // Verificar se foi salvo
        const saved = localStorage.getItem("auth-token")
        console.log("✅ Verificação - dados salvos:", saved)

        // Atualizar estado
        setUser(account.user)

        // Redirecionar
        console.log("🔄 Redirecionando para dashboard...")

        // Usar window.location para garantir o redirecionamento
        window.location.href = "/dashboard"

        return { success: true }
      } else {
        console.log("❌ Credenciais inválidas")
        throw new Error("Email ou senha incorretos. Verifique suas credenciais.")
      }
    } catch (error) {
      console.error("❌ Erro no login:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (data: RegisterData) => {
    console.log("🚀 Iniciando registro:", data)
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

      localStorage.setItem("auth-token", JSON.stringify(authData))
      setUser(newUser)

      // Usar window.location para garantir o redirecionamento
      window.location.href = "/dashboard"

      return { success: true }
    } catch (error) {
      console.error("❌ Erro no registro:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    console.log("🚪 Fazendo logout...")
    localStorage.removeItem("auth-token")
    setUser(null)
    window.location.href = "/"
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
