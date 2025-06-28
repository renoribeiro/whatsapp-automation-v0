import type React from "react"
import { MessageCircle, Shield, Zap } from "lucide-react"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      {/* Header */}
      <header className="relative z-10 backdrop-blur-sm bg-white/80 border-b border-green-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="bg-green-500 p-2 rounded-lg">
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">WhatsApp Platform</span>
            </div>
            <div className="hidden md:flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Shield className="h-4 w-4 text-green-500" />
                <span>Seguro</span>
              </div>
              <div className="flex items-center space-x-1">
                <Zap className="h-4 w-4 text-green-500" />
                <span>Rápido</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-8">{children}</main>

      {/* Footer */}
      <footer className="relative z-10 backdrop-blur-sm bg-white/80 border-t border-green-100 mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-gray-600">
            <p>&copy; 2024 WhatsApp Platform. Todos os direitos reservados.</p>
            <div className="flex justify-center space-x-4 mt-2">
              <a href="#" className="hover:text-green-600 transition-colors">
                Termos
              </a>
              <a href="#" className="hover:text-green-600 transition-colors">
                Privacidade
              </a>
              <a href="#" className="hover:text-green-600 transition-colors">
                Suporte
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
