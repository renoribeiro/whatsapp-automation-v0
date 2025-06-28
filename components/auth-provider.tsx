"use client"

import type React from "react"

import { useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { loadUser } = useAuth()

  useEffect(() => {
    loadUser()
  }, [loadUser])

  return <>{children}</>
}
