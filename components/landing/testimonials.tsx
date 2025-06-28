"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Star, Quote } from "lucide-react"

export function Testimonials() {
  const testimonials = [
    {
      name: "Carlos Silva",
      role: "CEO",
      company: "TechStart Ltda",
      content:
        "A plataforma revolucionou nossa comunicação com clientes. Aumentamos as vendas em 250% em apenas 3 meses!",
      rating: 5,
      avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "Ana Costa",
      role: "Gerente de Vendas",
      company: "Vendas Pro",
      content: "Nunca foi tão fácil gerenciar múltiplas conversas. A automação nos economiza horas todos os dias.",
      rating: 5,
      avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "Roberto Lima",
      role: "Diretor Comercial",
      company: "Mega Negócios",
      content: "O suporte é excepcional e a plataforma é muito intuitiva. Recomendo para qualquer empresa séria.",
      rating: 5,
      avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "Mariana Santos",
      role: "Fundadora",
      company: "Inovação Digital",
      content: "Desde que começamos a usar, nossa taxa de conversão triplicou. É uma ferramenta indispensável!",
      rating: 5,
      avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "Pedro Oliveira",
      role: "Gerente de Marketing",
      company: "Growth Marketing",
      content: "A integração com nossas ferramentas foi perfeita. Agora temos controle total sobre nossos leads.",
      rating: 5,
      avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "Juliana Ferreira",
      role: "Diretora de Atendimento",
      company: "Atendimento Plus",
      content: "Nossos clientes ficaram muito mais satisfeitos com a rapidez e qualidade do atendimento.",
      rating: 5,
      avatar: "/placeholder.svg?height=60&width=60",
    },
  ]

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            O que nossos clientes dizem
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Mais de 10.000 empresas confiam em nossa plataforma para transformar suas vendas
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="h-full flex flex-col bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-2 group"
            >
              <CardContent className="p-6 flex flex-col h-full">
                {/* Quote Icon */}
                <div className="mb-4">
                  <Quote className="h-8 w-8 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform duration-300" />
                </div>

                {/* Content */}
                <blockquote className="text-gray-700 dark:text-gray-300 mb-6 flex-grow leading-relaxed">
                  "{testimonial.content}"
                </blockquote>

                {/* Rating */}
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 text-yellow-400 fill-current group-hover:animate-pulse"
                      style={{ animationDelay: `${i * 100}ms` }}
                    />
                  ))}
                </div>

                {/* Author Info */}
                <div className="flex items-center border-t border-gray-100 dark:border-gray-700 pt-4">
                  <img
                    src={testimonial.avatar || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4 group-hover:scale-110 transition-transform duration-300"
                  />
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {testimonial.role} • {testimonial.company}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
