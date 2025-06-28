import { PrismaClient, UserRole } from "@prisma/client"
import * as bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Iniciando seed do banco de dados...")

  // Criar Super Admin
  const hashedPassword = await bcrypt.hash("admin123", 12)

  const superAdmin = await prisma.user.upsert({
    where: { email: "admin@whatsapp-platform.com" },
    update: {},
    create: {
      email: "admin@whatsapp-platform.com",
      password: hashedPassword,
      firstName: "Super",
      lastName: "Admin",
      role: UserRole.SUPER_ADMIN,
      isActive: true,
    },
  })

  console.log("✅ Super Admin criado:", superAdmin.email)

  // Criar Agência de exemplo
  const agency = await prisma.agency.upsert({
    where: { email: "agencia@exemplo.com" },
    update: {},
    create: {
      name: "Agência Digital Exemplo",
      email: "agencia@exemplo.com",
      phone: "+5511999999999",
      document: "12.345.678/0001-90",
      address: "Rua Exemplo, 123 - São Paulo/SP",
      commission: 0.25,
      isActive: true,
    },
  })

  console.log("✅ Agência criada:", agency.name)

  // Criar Admin da Agência
  const agencyAdmin = await prisma.user.upsert({
    where: { email: "admin@agencia.com" },
    update: {},
    create: {
      email: "admin@agencia.com",
      password: hashedPassword,
      firstName: "Admin",
      lastName: "Agência",
      role: UserRole.AGENCY_ADMIN,
      agencyId: agency.id,
      isActive: true,
    },
  })

  console.log("✅ Admin da Agência criado:", agencyAdmin.email)

  // Criar Empresa de exemplo
  const company = await prisma.company.upsert({
    where: { email: "empresa@exemplo.com" },
    update: {},
    create: {
      name: "Empresa Exemplo Ltda",
      email: "empresa@exemplo.com",
      phone: "+5511888888888",
      document: "98.765.432/0001-10",
      address: "Av. Exemplo, 456 - São Paulo/SP",
      agencyId: agency.id,
      isActive: true,
    },
  })

  console.log("✅ Empresa criada:", company.name)

  // Criar Admin da Empresa
  const companyAdmin = await prisma.user.upsert({
    where: { email: "admin@empresa.com" },
    update: {},
    create: {
      email: "admin@empresa.com",
      password: hashedPassword,
      firstName: "Admin",
      lastName: "Empresa",
      role: UserRole.COMPANY_ADMIN,
      companyId: company.id,
      isActive: true,
    },
  })

  console.log("✅ Admin da Empresa criado:", companyAdmin.email)

  // Criar Vendedor
  const seller = await prisma.user.upsert({
    where: { email: "vendedor@empresa.com" },
    update: {},
    create: {
      email: "vendedor@empresa.com",
      password: hashedPassword,
      firstName: "João",
      lastName: "Vendedor",
      phone: "+5511777777777",
      role: UserRole.SELLER,
      companyId: company.id,
      isActive: true,
    },
  })

  console.log("✅ Vendedor criado:", seller.email)

  // Criar Subscription para a empresa
  const subscription = await prisma.subscription.create({
    data: {
      companyId: company.id,
      status: "TRIAL",
      planName: "Standard",
      basePrice: 150.0,
      pricePerUser: 100.0,
      activeUsers: 2,
      totalAmount: 350.0,
      billingCycle: "monthly",
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
      trialEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias
    },
  })

  console.log("✅ Subscription criada para a empresa")

  // Criar Tags de exemplo
  const tags = await Promise.all([
    prisma.tag.create({
      data: {
        name: "Lead Quente",
        color: "#EF4444",
        description: "Leads com alta probabilidade de conversão",
        order: 1,
        companyId: company.id,
      },
    }),
    prisma.tag.create({
      data: {
        name: "Cliente",
        color: "#10B981",
        description: "Clientes ativos",
        order: 2,
        companyId: company.id,
      },
    }),
    prisma.tag.create({
      data: {
        name: "Suporte",
        color: "#3B82F6",
        description: "Solicitações de suporte",
        order: 3,
        companyId: company.id,
      },
    }),
  ])

  console.log("✅ Tags criadas:", tags.length)

  // Criar Respostas Rápidas
  const quickReplies = await Promise.all([
    prisma.quickReply.create({
      data: {
        title: "Saudação",
        content: "Olá! Como posso ajudá-lo hoje?",
        shortcut: "/ola",
        companyId: company.id,
        createdByUserId: seller.id,
      },
    }),
    prisma.quickReply.create({
      data: {
        title: "Horário de Funcionamento",
        content: "Nosso horário de funcionamento é de segunda a sexta, das 8h às 18h.",
        shortcut: "/horario",
        companyId: company.id,
        createdByUserId: seller.id,
      },
    }),
    prisma.quickReply.create({
      data: {
        title: "Despedida",
        content: "Obrigado pelo contato! Tenha um ótimo dia!",
        shortcut: "/tchau",
        companyId: company.id,
        createdByUserId: seller.id,
      },
    }),
  ])

  console.log("✅ Respostas Rápidas criadas:", quickReplies.length)

  console.log("🎉 Seed concluído com sucesso!")
  console.log("\n📋 Credenciais criadas:")
  console.log("Super Admin: admin@whatsapp-platform.com / admin123")
  console.log("Admin Agência: admin@agencia.com / admin123")
  console.log("Admin Empresa: admin@empresa.com / admin123")
  console.log("Vendedor: vendedor@empresa.com / admin123")
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
