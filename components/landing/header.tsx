"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MessageCircle, Menu, X } from "lucide-react"
import { useState } from "react"
import { ThemeToggle } from "@/components/theme-toggle"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <div className="bg-green-500 p-2 rounded-lg">
              <MessageCircle className="h-6 w-6 text-white" />
            </div>
            <span className="hidden font-bold sm:inline-block">WhatsApp Platform</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link href="#features" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Recursos
            </Link>
            <Link href="#pricing" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Preços
            </Link>
            <Link href="#testimonials" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Depoimentos
            </Link>
            <Link href="#contact" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Contato
            </Link>
          </nav>
        </div>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          <span className="sr-only">Toggle Menu</span>
        </Button>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <Link href="/" className="flex items-center space-x-2 md:hidden">
              <div className="bg-green-500 p-2 rounded-lg">
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold">WhatsApp Platform</span>
            </Link>
          </div>
          <nav className="flex items-center space-x-2">
            <ThemeToggle />
            <Link href="/auth/login">
              <Button variant="ghost" size="sm">
                Entrar
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button size="sm" className="bg-green-500 hover:bg-green-600">
                Começar Grátis
              </Button>
            </Link>
          </nav>
        </div>
      </div>
      {isMenuOpen && (
        <div className="border-b md:hidden">
          <nav className="flex flex-col space-y-3 p-4">
            <Link
              href="#features"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
              onClick={() => setIsMenuOpen(false)}
            >
              Recursos
            </Link>
            <Link
              href="#pricing"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
              onClick={() => setIsMenuOpen(false)}
            >
              Preços
            </Link>
            <Link
              href="#testimonials"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
              onClick={() => setIsMenuOpen(false)}
            >
              Depoimentos
            </Link>
            <Link
              href="#contact"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
              onClick={() => setIsMenuOpen(false)}
            >
              Contato
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
