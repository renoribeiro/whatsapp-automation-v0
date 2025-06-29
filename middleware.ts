import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Remover middleware por enquanto para não interferir no redirecionamento
  return NextResponse.next()
}

export const config = {
  matcher: [],
}
