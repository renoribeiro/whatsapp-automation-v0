"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  MessageCircle,
  Users,
  BarChart3,
  Zap,
  Shield,
  Smartphone,
  Bot,
  Clock,
  Globe,
  Settings,
  HeadphonesIcon,
  TrendingUp,
} from "lucide-react"

export function Features() {
  const features = [
    {
      icon: MessageCircle,
      title: "Chat Unificado",
      description: "Gerencie todas as conversas do WhatsApp em uma interface única e intuitiva.",
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-100 dark:bg-green-900/30",
    },
    {
      icon: Bot,
      title: "Automação Inteligente",
      description: "Chatbots avançados com IA para atendimento 24/7 e qualificação de leads.",
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      icon: Users,
      title: "Gestão de Equipe",
      description: "Distribua conversas, monitore performance e gerencie sua equipe de vendas.",
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
    },
    {
      icon: BarChart3,
      title: "Relatórios Avançados",
      description: "Analytics completo com métricas de vendas, conversão e performance.",
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-100 dark:bg-orange-900/30",
    },
    {
      icon: Zap,
      title: "Respostas Rápidas",
      description: "Templates personalizáveis para agilizar o atendimento e padronizar respostas.",
      color: "text-yellow-600 dark:text-yellow-400",
      bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
    },
    {
      icon: Shield,
      title: "Segurança Total",
      description: "Criptografia end-to-end e conformidade com LGPD para proteger seus dados.",
      color: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-100 dark:bg-red-900/30",
    },
    {
      icon: Smartphone,
      title: "Multi-dispositivo",
      description: "Acesse de qualquer lugar: desktop, tablet ou smartphone com sincronização.",
      color: "text-indigo-600 dark:text-indigo-400",
      bgColor: "bg-indigo-100 dark:bg-indigo-900/30",
    },
    {
      icon: Clock,
      title: "Agendamento",
      description: "Programe mensagens e campanhas para serem enviadas no momento ideal.",
      color: "text-pink-600 dark:text-pink-400",
      bgColor: "bg-pink-100 dark:bg-pink-900/30",
    },
    {
      icon: Globe,
      title: "Integrações",
      description: "Conecte com CRM, e-commerce, Google Sheets e centenas de outras ferramentas.",
      color: "text-teal-600 dark:text-teal-400",
      bgColor: "bg-teal-100 dark:bg-teal-900/30",
    },
    {
      icon: Settings,
      title: "Personalização",
      description: "Configure fluxos, campos customizados e adapte a plataforma ao seu negócio.",
      color: "text-gray-600 dark:text-gray-400",
      bgColor: "bg-gray-100 dark:bg-gray-900/30",
    },
    {
      icon: HeadphonesIcon,
      title: "Suporte Premium",
      description: "Suporte técnico especializado em português com atendimento prioritário.",
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
    },
    {
      icon: TrendingUp,
      title: "Escalabilidade",
      description: "Cresce junto com seu negócio, desde startups até grandes corporações.",
      color: "text-cyan-600 dark:text-cyan-400",
      bgColor: "bg-cyan-100 dark:bg-cyan-900/30",
    },
  ]

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Tudo que você precisa para vender mais
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Uma plataforma completa com todas as ferramentas necessárias para transformar seu WhatsApp em uma máquina de
            vendas
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card
                key={index}
                className="h-full border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 hover:scale-105 group"
              >
                <CardHeader className="pb-4">
                  <div
                    className={`${feature.bgColor} p-3 rounded-lg w-fit group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className={`h-6 w-6 ${feature.color} group-hover:animate-pulse`} />
                  </div>
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 dark:text-gray-400 leading-relaxed group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
