import { Test, type TestingModule } from "@nestjs/testing"
import type { INestApplication } from "@nestjs/common"
import * as request from "supertest"
import { AppModule } from "../../src/app.module"
import { PrismaService } from "../../src/prisma/prisma.service"
import { userFixture } from "../fixtures/user.fixture"
import { describe, beforeAll, afterAll, beforeEach, it, expect } from "jest"

describe("AuthController (e2e)", () => {
  let app: INestApplication
  let prisma: PrismaService

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
    await prisma.user.deleteMany()
    await prisma.company.deleteMany()
  })

  describe("/auth/login (POST)", () => {
    beforeEach(async () => {
      // Create test user
      await prisma.user.create({
        data: {
          ...userFixture.superAdmin,
          password: "$2b$10$hashedpassword", // bcrypt hash for 'password123'
        },
      })
    })

    it("should login with valid credentials", () => {
      return request(app.getHttpServer())
        .post("/auth/login")
        .send({
          email: "admin@test.com",
          password: "password123",
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty("access_token")
          expect(res.body).toHaveProperty("user")
          expect(res.body.user.email).toBe("admin@test.com")
        })
    })

    it("should reject invalid credentials", () => {
      return request(app.getHttpServer())
        .post("/auth/login")
        .send({
          email: "admin@test.com",
          password: "wrongpassword",
        })
        .expect(401)
    })

    it("should reject non-existent user", () => {
      return request(app.getHttpServer())
        .post("/auth/login")
        .send({
          email: "nonexistent@test.com",
          password: "password123",
        })
        .expect(401)
    })
  })

  describe("/auth/register (POST)", () => {
    it("should register a new user", () => {
      return request(app.getHttpServer())
        .post("/auth/register")
        .send({
          email: "newuser@test.com",
          password: "password123",
          name: "New User",
          role: "seller",
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty("access_token")
          expect(res.body).toHaveProperty("user")
          expect(res.body.user.email).toBe("newuser@test.com")
        })
    })

    it("should reject duplicate email", async () => {
      // Create first user
      await prisma.user.create({
        data: userFixture.superAdmin,
      })

      return request(app.getHttpServer())
        .post("/auth/register")
        .send({
          email: "admin@test.com",
          password: "password123",
          name: "Duplicate User",
          role: "seller",
        })
        .expect(400)
    })
  })

  describe("/auth/refresh (POST)", () => {
    let refreshToken: string

    beforeEach(async () => {
      // Create user and get refresh token
      await prisma.user.create({
        data: {
          ...userFixture.superAdmin,
          password: "$2b$10$hashedpassword",
        },
      })

      const loginResponse = await request(app.getHttpServer()).post("/auth/login").send({
        email: "admin@test.com",
        password: "password123",
      })

      refreshToken = loginResponse.body.refresh_token
    })

    it("should refresh access token", () => {
      return request(app.getHttpServer())
        .post("/auth/refresh")
        .send({
          refresh_token: refreshToken,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty("access_token")
        })
    })

    it("should reject invalid refresh token", () => {
      return request(app.getHttpServer())
        .post("/auth/refresh")
        .send({
          refresh_token: "invalid_token",
        })
        .expect(401)
    })
  })
})
