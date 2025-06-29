"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Users, TrendingUp, Shield, Zap, Clock } from "lucide-react"
import Link from "next/link"
import { DynamicText } from "@/components/ui/dynamic-text"

export function Hero() {
  const stats = [
    {
      icon: Users,
      value: "10k+",
      label: "Empresas ativas",
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-100 dark:bg-green-900/30",
    },
    {
      icon: MessageCircle,
      value: "1M+",
      label: "Mensagens enviadas",
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      icon: TrendingUp,
      value: "300%",
      label: "Aumento médio em vendas",
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
    },
    {
      icon: Shield,
      value: "99.9%",
      label: "Uptime garantido",
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-100 dark:bg-orange-900/30",
    },
    {
      icon: Zap,
      value: "24/7",
      label: "Suporte disponível",
      color: "text-yellow-600 dark:text-yellow-400",
      bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
    },
    {
      icon: Clock,
      value: "< 1s",
      label: "Tempo de resposta",
      color: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-100 dark:bg-red-900/30",
    },
  ]

  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" />

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-green-200 dark:bg-green-800 rounded-full opacity-20 animate-pulse" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-blue-200 dark:bg-blue-800 rounded-full opacity-20 animate-pulse delay-1000" />

      <div className="container relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <Badge
            variant="secondary"
            className="mb-6 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800"
          >
            <Zap className="w-3 h-3 mr-1" />
            Plataforma #1 em WhatsApp Business
          </Badge>

          {/* Main heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6">
            Transforme seu <span className="text-green-600 dark:text-green-400">WhatsApp</span>
            <br />
            em uma{" "}
            <span className="text-green-600 dark:text-green-400">
              <DynamicText
                words={["máquina de vendas", "ferramenta + eficiente", "plataforma completa de vendas"]}
                className="text-green-600 dark:text-green-400"
              />
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Gerencie todas as suas conversas do WhatsApp em um só lugar. Automatize respostas, organize leads e aumente
            suas vendas com nossa plataforma completa.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button
              asChild
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <Link href="/auth/register">
                <MessageCircle className="w-5 h-5 mr-2" />
                Começar Gratuitamente
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-2 border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 hover:scale-105 bg-transparent"
            >
              <Link href="/auth/login">Ver Demonstração</Link>
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div
                  key={index}
                  className="group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-2"
                >
                  <div
                    className={`${stat.bgColor} p-3 rounded-full w-fit mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className={`h-6 w-6 ${stat.color} group-hover:animate-pulse`} />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
                    {stat.label}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
