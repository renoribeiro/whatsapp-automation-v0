"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Star, Zap, Crown } from "lucide-react"
import Link from "next/link"

export function Pricing() {
  const plans = [
    {
      name: "Starter",
      description: "Perfeito para pequenas empresas",
      price: "R$ 97",
      period: "/mês",
      icon: Zap,
      popular: false,
      features: [
        "Até 3 usuários",
        "1.000 mensagens/mês",
        "Respostas automáticas",
        "Relatórios básicos",
        "Suporte por email",
        "Integração WhatsApp Web",
      ],
      buttonText: "Começar Agora",
      buttonVariant: "outline" as const,
    },
    {
      name: "Professional",
      description: "Ideal para empresas em crescimento",
      price: "R$ 197",
      period: "/mês",
      icon: Star,
      popular: true,
      features: [
        "Até 10 usuários",
        "5.000 mensagens/mês",
        "Automação avançada",
        "Relatórios detalhados",
        "Suporte prioritário",
        "API completa",
        "Integração CRM",
        "Chatbots personalizados",
      ],
      buttonText: "Mais Popular",
      buttonVariant: "default" as const,
    },
    {
      name: "Enterprise",
      description: "Para grandes empresas",
      price: "R$ 397",
      period: "/mês",
      icon: Crown,
      popular: false,
      features: [
        "Usuários ilimitados",
        "Mensagens ilimitadas",
        "Automação completa",
        "Analytics avançado",
        "Suporte 24/7",
        "Gerente dedicado",
        "Integrações customizadas",
        "White-label disponível",
        "SLA garantido",
      ],
      buttonText: "Falar com Vendas",
      buttonVariant: "outline" as const,
    },
  ]

  return (
    <section className="py-20 bg-white dark:bg-gray-800">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Planos que crescem com seu negócio
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Escolha o plano ideal para sua empresa. Todos incluem 7 dias de teste grátis.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => {
            const Icon = plan.icon
            return (
              <Card
                key={index}
                className={`relative h-full flex flex-col transition-all duration-300 hover:scale-105 hover:shadow-2xl group ${
                  plan.popular
                    ? "border-green-500 dark:border-green-400 shadow-lg scale-105"
                    : "border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600"
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-600 hover:bg-green-700 text-white px-4 py-1 group-hover:scale-110 transition-transform duration-300">
                    Mais Popular
                  </Badge>
                )}

                <CardHeader className="text-center pb-8">
                  <div
                    className={`mx-auto p-3 rounded-full w-fit mb-4 group-hover:scale-110 transition-transform duration-300 ${
                      plan.popular ? "bg-green-100 dark:bg-green-900/30" : "bg-gray-100 dark:bg-gray-800"
                    }`}
                  >
                    <Icon
                      className={`h-8 w-8 group-hover:animate-pulse ${
                        plan.popular
                          ? "text-green-600 dark:text-green-400"
                          : "text-gray-600 dark:text-gray-400 group-hover:text-green-600 dark:group-hover:text-green-400"
                      }`}
                    />
                  </div>

                  <CardTitle
                    className={`text-2xl font-bold mb-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300 ${
                      plan.popular ? "text-green-600 dark:text-green-400" : "text-gray-900 dark:text-white"
                    }`}
                  >
                    {plan.name}
                  </CardTitle>

                  <CardDescription className="text-gray-600 dark:text-gray-400 mb-4">
                    {plan.description}
                  </CardDescription>

                  <div className="flex items-baseline justify-center">
                    <span
                      className={`text-4xl font-bold group-hover:scale-110 transition-transform duration-300 ${
                        plan.popular
                          ? "text-green-600 dark:text-green-400"
                          : "text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400"
                      }`}
                    >
                      {plan.price}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400 ml-1">{plan.period}</span>
                  </div>
                </CardHeader>

                <CardContent className="flex-grow">
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <Check
                          className={`h-5 w-5 mr-3 mt-0.5 flex-shrink-0 group-hover:scale-110 group-hover:animate-pulse transition-all duration-300 ${
                            plan.popular
                              ? "text-green-600 dark:text-green-400"
                              : "text-gray-400 group-hover:text-green-600 dark:group-hover:text-green-400"
                          }`}
                        />
                        <span className="text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-300">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    asChild
                    variant={plan.buttonVariant}
                    className={`w-full py-3 font-semibold transition-all duration-300 group-hover:scale-105 ${
                      plan.popular
                        ? "bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl"
                        : "border-2 border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 hover:shadow-lg"
                    }`}
                  >
                    <Link href="/auth/register">{plan.buttonText}</Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Todos os planos incluem 7 dias de teste grátis • Sem compromisso • Cancele quando quiser
          </p>
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-500 dark:text-gray-500">
            <span className="flex items-center">
              <Check className="h-4 w-4 mr-1 text-green-600" />
              SSL Seguro
            </span>
            <span className="flex items-center">
              <Check className="h-4 w-4 mr-1 text-green-600" />
              Suporte Brasileiro
            </span>
            <span className="flex items-center">
              <Check className="h-4 w-4 mr-1 text-green-600" />
              LGPD Compliant
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
