import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Autenticação - WhatsApp Platform",
  description: "Faça login ou crie sua conta na WhatsApp Platform",
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="min-h-screen">{children}</div>
}
