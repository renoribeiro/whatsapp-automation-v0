/**
 * Rotas públicas que não requerem autenticação
 */
export const publicRoutes = [
  "/",
  "/auth/new-verification",
  "/auth/reset",
  "/api/auth/callback/google",
  "/api/auth/callback/github",
  "/auth/verify-email",
]

/**
 * Rotas de autenticação
 * Usuários logados serão redirecionados para /dashboard
 */
export const authRoutes = [
  "/auth/login",
  "/auth/register",
  "/auth/error",
  "/auth/reset",
  "/auth/new-password",
  "/auth/forgot-password",
  "/auth/reset-password",
]

/**
 * Prefixo para rotas de API de autenticação
 */
export const apiAuthPrefix = "/api/auth"

/**
 * Rota padrão de redirecionamento após login
 */
export const DEFAULT_LOGIN_REDIRECT = "/dashboard"

/**
 * Rotas protegidas que requerem autenticação
 */
export const protectedRoutes = [
  "/dashboard",
  "/dashboard/users",
  "/dashboard/companies",
  "/dashboard/conversations",
  "/dashboard/chat",
  "/dashboard/reports",
  "/dashboard/settings",
  "/dashboard/permissions",
]

/**
 * Rotas de admin que requerem permissões especiais
 */
export const adminRoutes = ["/dashboard/users", "/dashboard/companies", "/dashboard/permissions"]
