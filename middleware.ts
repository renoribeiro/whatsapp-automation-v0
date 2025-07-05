import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Permitir todas as rotas sem interferência
  return NextResponse.next()
}

export const config = {
  matcher: [],
}
