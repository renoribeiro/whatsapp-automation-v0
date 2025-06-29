import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Rotas que precisam de autenticação
  const protectedRoutes = ["/dashboard"]

  // Rotas de auth que não devem ser acessadas se já estiver logado
  const authRoutes = ["/auth/login", "/auth/register"]

  // Verificar se é uma rota protegida
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

  // Verificar se é uma rota de auth
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))

  // Verificar se há token de auth (simplificado para o exemplo)
  const authToken = request.cookies.get("auth-token")?.value

  if (isProtectedRoute && !authToken) {
    // Redirecionar para login se tentar acessar rota protegida sem estar logado
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }

  if (isAuthRoute && authToken) {
    // Redirecionar para dashboard se tentar acessar auth já estando logado
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/login", "/auth/register"],
}
