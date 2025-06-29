import { LoginTest } from "@/components/test/login-test"

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Página de Testes - WhatsApp Platform</h1>
          <p className="text-gray-600">
            Use esta página para testar o sistema de autenticação e verificar logs no console.
          </p>
        </div>

        <LoginTest />
      </div>
    </div>
  )
}
