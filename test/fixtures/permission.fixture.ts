export const permissionFixture = {
  userManagement: {
    id: "1",
    name: "user_management",
    description: "Gerenciar usuários",
    category: "users",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  conversationView: {
    id: "2",
    name: "conversation_view",
    description: "Visualizar conversas",
    category: "conversations",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  reportGenerate: {
    id: "3",
    name: "report_generate",
    description: "Gerar relatórios",
    category: "reports",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
}

export const userPermissionFixture = {
  superAdminPermissions: [
    {
      id: "1",
      userId: "1",
      permissionId: "1",
      createdAt: new Date("2024-01-01"),
    },
    {
      id: "2",
      userId: "1",
      permissionId: "2",
      createdAt: new Date("2024-01-01"),
    },
    {
      id: "3",
      userId: "1",
      permissionId: "3",
      createdAt: new Date("2024-01-01"),
    },
  ],
  sellerPermissions: [
    {
      id: "4",
      userId: "3",
      permissionId: "2",
      createdAt: new Date("2024-01-01"),
    },
  ],
}
