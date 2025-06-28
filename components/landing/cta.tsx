"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, MessageCircle, Star, Users } from "lucide-react"
import Link from "next/link"

export function CTA() {
  return (
    <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600 dark:from-green-700 dark:to-blue-700">
      <div className="container">
        <div className="max-w-4xl mx-auto text-center text-white">
          {/* Main CTA */}
          <div className="mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Pronto para transformar suas vendas?</h2>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Junte-se a mais de 10.000 empresas que já aumentaram suas vendas em até 300%
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-white text-green-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <Link href="/auth/register">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Começar Teste Grátis
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-2 border-white text-white hover:bg-white hover:text-green-600 px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 hover:scale-105 bg-transparent"
              >
                <Link href="/auth/login">Ver Demonstração</Link>
              </Button>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-white/20">
            <div className="flex flex-col items-center">
              <div className="bg-white/10 p-4 rounded-full mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div className="text-2xl font-bold mb-2">10.000+</div>
              <div className="opacity-90">Empresas confiam</div>
            </div>

            <div className="flex flex-col items-center">
              <div className="bg-white/10 p-4 rounded-full mb-4">
                <Star className="h-8 w-8 text-white" />
              </div>
              <div className="text-2xl font-bold mb-2">4.9/5</div>
              <div className="opacity-90">Avaliação média</div>
            </div>

            <div className="flex flex-col items-center">
              <div className="bg-white/10 p-4 rounded-full mb-4">
                <MessageCircle className="h-8 w-8 text-white" />
              </div>
              <div className="text-2xl font-bold mb-2">1M+</div>
              <div className="opacity-90">Mensagens enviadas</div>
            </div>
          </div>

          {/* Guarantee */}
          <div className="mt-12 p-6 bg-white/10 rounded-2xl backdrop-blur-sm">
            <h3 className="text-xl font-semibold mb-2">Garantia de 7 dias</h3>
            <p className="opacity-90">
              Teste nossa plataforma por 7 dias gratuitamente. Se não ficar satisfeito, cancele sem custos.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
