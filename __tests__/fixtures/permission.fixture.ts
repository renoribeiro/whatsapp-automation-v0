export const permissionFixture = {
  userManagement: {
    id: "1",
    name: "user_management",
    description: "Gerenciar usuários",
    category: "users",
    metadata: null,
    createdAt: new Date("2024-01-01T00:00:00.000Z"),
    updatedAt: new Date("2024-01-01T00:00:00.000Z"),
  },
  conversationView: {
    id: "2",
    name: "conversation_view",
    description: "Visualizar conversas",
    category: "conversations",
    metadata: null,
    createdAt: new Date("2024-01-01T00:00:00.000Z"),
    updatedAt: new Date("2024-01-01T00:00:00.000Z"),
  },
  reportGenerate: {
    id: "3",
    name: "report_generate",
    description: "Gerar relatórios",
    category: "reports",
    metadata: null,
    createdAt: new Date("2024-01-01T00:00:00.000Z"),
    updatedAt: new Date("2024-01-01T00:00:00.000Z"),
  },
  messagesSend: {
    id: "4",
    name: "messages_send",
    description: "Enviar mensagens",
    category: "messages",
    metadata: null,
    createdAt: new Date("2024-01-01T00:00:00.000Z"),
    updatedAt: new Date("2024-01-01T00:00:00.000Z"),
  },
  automationCreate: {
    id: "5",
    name: "automation_create",
    description: "Criar automações",
    category: "automation",
    metadata: null,
    createdAt: new Date("2024-01-01T00:00:00.000Z"),
    updatedAt: new Date("2024-01-01T00:00:00.000Z"),
  },
  billingView: {
    id: "6",
    name: "billing_view",
    description: "Visualizar cobrança",
    category: "billing",
    metadata: null,
    createdAt: new Date("2024-01-01T00:00:00.000Z"),
    updatedAt: new Date("2024-01-01T00:00:00.000Z"),
  },
  settingsManage: {
    id: "7",
    name: "settings_manage",
    description: "Gerenciar configurações",
    category: "settings",
    metadata: null,
    createdAt: new Date("2024-01-01T00:00:00.000Z"),
    updatedAt: new Date("2024-01-01T00:00:00.000Z"),
  },
  integrationsManage: {
    id: "8",
    name: "integrations_manage",
    description: "Gerenciar integrações",
    category: "integrations",
    metadata: null,
    createdAt: new Date("2024-01-01T00:00:00.000Z"),
    updatedAt: new Date("2024-01-01T00:00:00.000Z"),
  },
}

export const userPermissionFixture = {
  superAdminPermissions: [
    {
      id: "1",
      userId: "1",
      permissionId: "1",
      granted: true,
      createdAt: new Date("2024-01-01T00:00:00.000Z"),
      updatedAt: new Date("2024-01-01T00:00:00.000Z"),
    },
    {
      id: "2",
      userId: "1",
      permissionId: "2",
      granted: true,
      createdAt: new Date("2024-01-01T00:00:00.000Z"),
      updatedAt: new Date("2024-01-01T00:00:00.000Z"),
    },
    {
      id: "3",
      userId: "1",
      permissionId: "3",
      granted: true,
      createdAt: new Date("2024-01-01T00:00:00.000Z"),
      updatedAt: new Date("2024-01-01T00:00:00.000Z"),
    },
  ],
  companyAdminPermissions: [
    {
      id: "4",
      userId: "2",
      permissionId: "1",
      granted: true,
      createdAt: new Date("2024-01-01T00:00:00.000Z"),
      updatedAt: new Date("2024-01-01T00:00:00.000Z"),
    },
    {
      id: "5",
      userId: "2",
      permissionId: "2",
      granted: true,
      createdAt: new Date("2024-01-01T00:00:00.000Z"),
      updatedAt: new Date("2024-01-01T00:00:00.000Z"),
    },
  ],
  sellerPermissions: [
    {
      id: "6",
      userId: "3",
      permissionId: "2",
      granted: true,
      createdAt: new Date("2024-01-01T00:00:00.000Z"),
      updatedAt: new Date("2024-01-01T00:00:00.000Z"),
    },
    {
      id: "7",
      userId: "3",
      permissionId: "4",
      granted: true,
      createdAt: new Date("2024-01-01T00:00:00.000Z"),
      updatedAt: new Date("2024-01-01T00:00:00.000Z"),
    },
  ],
}

export const rolePermissionFixture = {
  superAdminRole: [
    {
      id: "1",
      role: "SUPER_ADMIN",
      permissionId: "1",
      granted: true,
      createdAt: new Date("2024-01-01T00:00:00.000Z"),
      updatedAt: new Date("2024-01-01T00:00:00.000Z"),
    },
    {
      id: "2",
      role: "SUPER_ADMIN",
      permissionId: "2",
      granted: true,
      createdAt: new Date("2024-01-01T00:00:00.000Z"),
      updatedAt: new Date("2024-01-01T00:00:00.000Z"),
    },
  ],
  companyAdminRole: [
    {
      id: "3",
      role: "COMPANY_ADMIN",
      permissionId: "1",
      granted: true,
      createdAt: new Date("2024-01-01T00:00:00.000Z"),
      updatedAt: new Date("2024-01-01T00:00:00.000Z"),
    },
    {
      id: "4",
      role: "COMPANY_ADMIN",
      permissionId: "2",
      granted: true,
      createdAt: new Date("2024-01-01T00:00:00.000Z"),
      updatedAt: new Date("2024-01-01T00:00:00.000Z"),
    },
  ],
  sellerRole: [
    {
      id: "5",
      role: "SELLER",
      permissionId: "2",
      granted: true,
      createdAt: new Date("2024-01-01T00:00:00.000Z"),
      updatedAt: new Date("2024-01-01T00:00:00.000Z"),
    },
    {
      id: "6",
      role: "SELLER",
      permissionId: "4",
      granted: true,
      createdAt: new Date("2024-01-01T00:00:00.000Z"),
      updatedAt: new Date("2024-01-01T00:00:00.000Z"),
    },
  ],
}
