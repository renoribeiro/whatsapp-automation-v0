import { Test, type TestingModule } from "@nestjs/testing"
import type { INestApplication } from "@nestjs/common"
import * as request from "supertest"
import { AppModule } from "../../src/app.module"
import { PrismaService } from "../../src/prisma/prisma.service"
import { userFixture } from "../fixtures/user.fixture"
import { permissionFixture } from "../fixtures/permission.fixture"
import { describe, beforeAll, afterAll, beforeEach, it, expect } from "jest"

describe("PermissionsController (e2e)", () => {
  let app: INestApplication
  let prisma: PrismaService
  let authToken: string
  let superAdminToken: string

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    prisma = moduleFixture.get<PrismaService>(PrismaService)

    await app.init()
  })

  afterAll(async () => {
    await prisma.$disconnect()
    await app.close()
  })

  beforeEach(async () => {
    // Clean database
    await prisma.userPermission.deleteMany()
    await prisma.permission.deleteMany()
    await prisma.user.deleteMany()
    await prisma.company.deleteMany()

    // Create test company
    const company = await prisma.company.create({
      data: {
        id: "1",
        name: "Test Company",
        email: "test@company.com",
        phone: "+5511999999999",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    })

    // Create super admin user
    const superAdmin = await prisma.user.create({
      data: {
        ...userFixture.superAdmin,
        password: "$2b$10$hashedpassword", // bcrypt hash for 'password123'
      },
    })

    // Create company admin user
    const companyAdmin = await prisma.user.create({
      data: {
        ...userFixture.companyAdmin,
        companyId: company.id,
        password: "$2b$10$hashedpassword",
      },
    })

    // Create permissions
    await prisma.permission.createMany({
      data: Object.values(permissionFixture),
    })

    // Get auth tokens
    const superAdminLogin = await request(app.getHttpServer()).post("/auth/login").send({
      email: superAdmin.email,
      password: "password123",
    })

    const companyAdminLogin = await request(app.getHttpServer()).post("/auth/login").send({
      email: companyAdmin.email,
      password: "password123",
    })

    superAdminToken = superAdminLogin.body.access_token
    authToken = companyAdminLogin.body.access_token
  })

  describe("/permissions (GET)", () => {
    it("should return all permissions for authenticated user", () => {
      return request(app.getHttpServer())
        .get("/permissions")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true)
          expect(res.body.length).toBeGreaterThan(0)
          expect(res.body[0]).toHaveProperty("id")
          expect(res.body[0]).toHaveProperty("name")
          expect(res.body[0]).toHaveProperty("description")
          expect(res.body[0]).toHaveProperty("category")
        })
    })

    it("should return 401 for unauthenticated request", () => {
      return request(app.getHttpServer()).get("/permissions").expect(401)
    })

    it("should filter permissions by category", () => {
      return request(app.getHttpServer())
        .get("/permissions?category=users")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true)
          res.body.forEach((permission: any) => {
            expect(permission.category).toBe("users")
          })
        })
    })
  })

  describe("/permissions/:id (GET)", () => {
    it("should return a specific permission", async () => {
      const permission = await prisma.permission.findFirst()

      return request(app.getHttpServer())
        .get(`/permissions/${permission?.id}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(permission?.id)
          expect(res.body.name).toBe(permission?.name)
        })
    })

    it("should return 404 for non-existent permission", () => {
      return request(app.getHttpServer())
        .get("/permissions/non-existent-id")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(404)
    })
  })

  describe("/permissions (POST)", () => {
    it("should create a new permission as super admin", () => {
      const createDto = {
        name: "test_permission",
        description: "Test Permission",
        category: "test",
      }

      return request(app.getHttpServer())
        .post("/permissions")
        .set("Authorization", `Bearer ${superAdminToken}`)
        .send(createDto)
        .expect(201)
        .expect((res) => {
          expect(res.body.name).toBe(createDto.name)
          expect(res.body.description).toBe(createDto.description)
          expect(res.body.category).toBe(createDto.category)
        })
    })

    it("should return 403 for non-super admin", () => {
      const createDto = {
        name: "test_permission",
        description: "Test Permission",
        category: "test",
      }

      return request(app.getHttpServer())
        .post("/permissions")
        .set("Authorization", `Bearer ${authToken}`)
        .send(createDto)
        .expect(403)
    })

    it("should return 400 for duplicate permission name", async () => {
      const existingPermission = await prisma.permission.findFirst()

      return request(app.getHttpServer())
        .post("/permissions")
        .set("Authorization", `Bearer ${superAdminToken}`)
        .send({
          name: existingPermission?.name,
          description: "Duplicate Permission",
          category: "test",
        })
        .expect(400)
    })
  })

  describe("/permissions/:id (PUT)", () => {
    it("should update a permission as super admin", async () => {
      const permission = await prisma.permission.findFirst()
      const updateDto = {
        description: "Updated Description",
      }

      return request(app.getHttpServer())
        .put(`/permissions/${permission?.id}`)
        .set("Authorization", `Bearer ${superAdminToken}`)
        .send(updateDto)
        .expect(200)
        .expect((res) => {
          expect(res.body.description).toBe(updateDto.description)
        })
    })

    it("should return 403 for non-super admin", async () => {
      const permission = await prisma.permission.findFirst()

      return request(app.getHttpServer())
        .put(`/permissions/${permission?.id}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({ description: "Updated" })
        .expect(403)
    })
  })

  describe("/permissions/:id (DELETE)", () => {
    it("should delete a permission as super admin", async () => {
      const permission = await prisma.permission.findFirst()

      return request(app.getHttpServer())
        .delete(`/permissions/${permission?.id}`)
        .set("Authorization", `Bearer ${superAdminToken}`)
        .expect(200)
    })

    it("should return 403 for non-super admin", async () => {
      const permission = await prisma.permission.findFirst()

      return request(app.getHttpServer())
        .delete(`/permissions/${permission?.id}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(403)
    })
  })

  describe("/permissions/users/:userId (GET)", () => {
    it("should return user permissions", async () => {
      const user = await prisma.user.findFirst({ where: { role: "company_admin" } })

      return request(app.getHttpServer())
        .get(`/permissions/users/${user?.id}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true)
        })
    })

    it("should return 404 for non-existent user", () => {
      return request(app.getHttpServer())
        .get("/permissions/users/non-existent-id")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(404)
    })
  })

  describe("/permissions/assign (POST)", () => {
    it("should assign permission to user", async () => {
      const user = await prisma.user.findFirst({ where: { role: "seller" } })
      const permission = await prisma.permission.findFirst()

      if (!user) {
        // Create seller user if not exists
        const seller = await prisma.user.create({
          data: {
            ...userFixture.seller,
            companyId: "1",
            password: "$2b$10$hashedpassword",
          },
        })

        const assignDto = {
          userId: seller.id,
          permissionId: permission?.id,
          granted: true,
        }

        return request(app.getHttpServer())
          .post("/permissions/assign")
          .set("Authorization", `Bearer ${authToken}`)
          .send(assignDto)
          .expect(201)
          .expect((res) => {
            expect(res.body.userId).toBe(assignDto.userId)
            expect(res.body.permissionId).toBe(assignDto.permissionId)
            expect(res.body.granted).toBe(assignDto.granted)
          })
      }

      const assignDto = {
        userId: user.id,
        permissionId: permission?.id,
        granted: true,
      }

      return request(app.getHttpServer())
        .post("/permissions/assign")
        .set("Authorization", `Bearer ${authToken}`)
        .send(assignDto)
        .expect(201)
    })

    it("should return 400 for invalid user or permission", () => {
      const assignDto = {
        userId: "non-existent-user",
        permissionId: "non-existent-permission",
        granted: true,
      }

      return request(app.getHttpServer())
        .post("/permissions/assign")
        .set("Authorization", `Bearer ${authToken}`)
        .send(assignDto)
        .expect(400)
    })
  })

  describe("/permissions/remove (DELETE)", () => {
    it("should remove permission from user", async () => {
      const user = await prisma.user.findFirst({ where: { role: "company_admin" } })
      const permission = await prisma.permission.findFirst()

      // First assign the permission
      await prisma.userPermission.create({
        data: {
          userId: user?.id || "",
          permissionId: permission?.id || "",
        },
      })

      const removeDto = {
        userId: user?.id,
        permissionId: permission?.id,
      }

      return request(app.getHttpServer())
        .delete("/permissions/remove")
        .set("Authorization", `Bearer ${authToken}`)
        .send(removeDto)
        .expect(200)
    })
  })

  describe("/permissions/seed (POST)", () => {
    it("should seed default permissions as super admin", () => {
      return request(app.getHttpServer())
        .post("/permissions/seed")
        .set("Authorization", `Bearer ${superAdminToken}`)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty("created")
          expect(res.body).toHaveProperty("total")
          expect(typeof res.body.created).toBe("number")
          expect(typeof res.body.total).toBe("number")
        })
    })

    it("should return 403 for non-super admin", () => {
      return request(app.getHttpServer())
        .post("/permissions/seed")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(403)
    })
  })
})
