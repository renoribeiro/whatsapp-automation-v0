"use client"

import { useState } from "react"
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
  const router = useRouter()

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Verificar se as credenciais correspondem a alguma conta de teste
      const account = testAccounts.find((acc) => acc.email === email && acc.password === password)

      if (account) {
        if (typeof window !== "undefined") {
          localStorage.setItem(
            "auth-token",
            JSON.stringify({
              token: `token-${account.user.id}`,
              user: account.user,
            }),
          )
        }
        router.push("/dashboard")
        return { success: true }
      } else {
        throw new Error("Credenciais inválidas")
      }
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (data: RegisterData) => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      if (typeof window !== "undefined") {
        localStorage.setItem(
          "auth-token",
          JSON.stringify({
            token: "demo-token-123",
            user: {
              id: "new-user",
              email: data.email,
              firstName: data.firstName,
              lastName: data.lastName,
              role: "USER",
              company: data.company,
            },
          }),
        )
      }
      router.push("/dashboard")
      return { success: true }
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth-token")
    }
    router.push("/")
  }

  const getCurrentUser = () => {
    if (typeof window !== "undefined") {
      const authData = localStorage.getItem("auth-token")
      if (authData) {
        try {
          const parsed = JSON.parse(authData)
          return parsed.user
        } catch {
          return null
        }
      }
    }
    return null
  }

  return {
    login,
    register,
    logout,
    getCurrentUser,
    isLoading,
  }
}
