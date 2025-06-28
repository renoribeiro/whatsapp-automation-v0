#!/usr/bin/env tsx

import { authApi, usersApi, companiesApi, conversationsApi } from "../lib/api"

async function healthCheck() {
  console.log("🔍 Iniciando verificação de saúde do sistema...\n")

  const checks = [
    {
      name: "API de Autenticação",
      test: async () => {
        try {
          await authApi.login("test@example.com", "test123")
        } catch (error: any) {
          // Esperamos erro 401 para credenciais inválidas
          if (error.status === 401) return true
          throw error
        }
      },
    },
    {
      name: "API de Usuários",
      test: async () => {
        await usersApi.getAll()
        return true
      },
    },
    {
      name: "API de Empresas",
      test: async () => {
        await companiesApi.getAll()
        return true
      },
    },
    {
      name: "API de Conversas",
      test: async () => {
        await conversationsApi.getAll()
        return true
      },
    },
  ]

  let allPassed = true

  for (const check of checks) {
    try {
      await check.test()
      console.log(`✅ ${check.name}: OK`)
    } catch (error: any) {
      console.log(`❌ ${check.name}: FALHOU - ${error.message}`)
      allPassed = false
    }
  }

  console.log("\n" + "=".repeat(50))

  if (allPassed) {
    console.log("🎉 Todos os testes passaram! Sistema está funcionando corretamente.")
    console.log("✅ Frontend e Backend estão conectados e funcionais.")
    console.log("🚀 Sistema pronto para deploy!")
  } else {
    console.log("⚠️  Alguns testes falharam. Verifique as configurações.")
    console.log("🔧 Certifique-se de que o backend está rodando na porta 3001")
    console.log("📊 Verifique as variáveis de ambiente")
  }

  process.exit(allPassed ? 0 : 1)
}

healthCheck().catch(console.error)
