import { PrismaClient } from "@prisma/client"
import { beforeAll, afterAll, beforeEach } from "@jest/globals"

// Global test setup
beforeAll(async () => {
  // Setup test database
  process.env.DATABASE_URL = process.env.TEST_DATABASE_URL || "postgresql://test:test@localhost:5432/test_db"
})

afterAll(async () => {
  // Cleanup
  const prisma = new PrismaClient()
  await prisma.$disconnect()
})

beforeEach(async () => {
  // Reset database state before each test
  const prisma = new PrismaClient()

  // Clean up all tables
  await prisma.userPermission.deleteMany()
  await prisma.permission.deleteMany()
  await prisma.user.deleteMany()
  await prisma.company.deleteMany()

  await prisma.$disconnect()
})
