"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, MessageCircle, Zap, Shield, Users } from "lucide-react"

export function Hero() {
  const [currentText, setCurrentText] = useState(0)

  const dynamicTexts = ["máquina de vendas", "ferramenta + eficiente", "plataforma completa de vendas"]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % dynamicTexts.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-sm font-medium">
              <Zap className="w-4 h-4 mr-2" />
              Plataforma #1 em Automação WhatsApp
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                Transforme seu WhatsApp
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
                  em uma{" "}
                  <span className="inline-block min-w-[300px] text-left transition-all duration-500 ease-in-out">
                    {dynamicTexts[currentText]}
                  </span>
                </span>
              </h1>

              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
                Automatize conversas, aumente vendas e transforme leads em clientes com nossa plataforma completa de
                WhatsApp Business.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg">
                <Link href="/auth/register">
                  Começar Gratuitamente
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>

              <Button asChild variant="outline" size="lg" className="px-8 py-4 text-lg bg-transparent">
                <Link href="/auth/login">Fazer Login</Link>
              </Button>
            </div>

            {/* Social Proof */}
            <div className="flex items-center space-x-8 pt-8">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-green-600" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  <strong className="text-gray-900 dark:text-white">10,000+</strong> empresas confiam
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-blue-600" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  <strong className="text-gray-900 dark:text-white">99.9%</strong> uptime
                </span>
              </div>
            </div>
          </div>

          {/* Right Column - Visual */}
          <div className="relative">
            {/* Main Card */}
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
              {/* Header */}
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-green-600 p-2 rounded-lg">
                  <MessageCircle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">WhatsApp Business</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Online agora</p>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="space-y-4">
                <div className="flex justify-end">
                  <div className="bg-green-600 text-white rounded-2xl rounded-tr-sm px-4 py-2 max-w-xs">
                    <p className="text-sm">Olá! Gostaria de saber mais sobre seus produtos.</p>
                  </div>
                </div>

                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-2xl rounded-tl-sm px-4 py-2 max-w-xs">
                    <p className="text-sm">Olá! Claro, vou te enviar nosso catálogo completo. 📱</p>
                  </div>
                </div>

                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-2xl rounded-tl-sm px-4 py-2 max-w-xs">
                    <p className="text-sm">Temos uma promoção especial hoje! 🎉</p>
                  </div>
                </div>

                <div className="flex justify-end">
                  <div className="bg-green-600 text-white rounded-2xl rounded-tr-sm px-4 py-2 max-w-xs">
                    <p className="text-sm">Perfeito! Como posso fazer o pedido?</p>
                  </div>
                </div>
              </div>

              {/* Typing Indicator */}
              <div className="flex items-center space-x-2 mt-4 text-gray-500 dark:text-gray-400">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
                <span className="text-sm">Digitando...</span>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 bg-green-600 text-white p-3 rounded-full shadow-lg">
              <MessageCircle className="h-6 w-6" />
            </div>

            <div className="absolute -bottom-4 -left-4 bg-blue-600 text-white p-3 rounded-full shadow-lg">
              <Zap className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
