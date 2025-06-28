import { Test, type TestingModule } from "@nestjs/testing"
import { PermissionsService } from "./permissions.service"
import { PrismaService } from "../prisma/prisma.service"
import { mockPrismaService } from "../../test/mocks/prisma.mock"
import { permissionFixture, userPermissionFixture } from "../../test/fixtures/permission.fixture"
import { jest } from "@jest/globals"

describe("PermissionsService", () => {
  let service: PermissionsService
  let prisma: PrismaService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermissionsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile()

    service = module.get<PermissionsService>(PermissionsService)
    prisma = module.get<PrismaService>(PrismaService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe("findAll", () => {
    it("should return all permissions", async () => {
      const expectedPermissions = Object.values(permissionFixture)
      mockPrismaService.permission.findMany.mockResolvedValue(expectedPermissions)

      const result = await service.findAll()

      expect(result).toEqual(expectedPermissions)
      expect(prisma.permission.findMany).toHaveBeenCalledWith({
        orderBy: { category: "asc" },
      })
    })

    it("should handle database errors", async () => {
      mockPrismaService.permission.findMany.mockRejectedValue(new Error("Database error"))

      await expect(service.findAll()).rejects.toThrow("Database error")
    })
  })

  describe("findOne", () => {
    it("should return a permission by id", async () => {
      const permission = permissionFixture.userManagement
      mockPrismaService.permission.findUnique.mockResolvedValue(permission)

      const result = await service.findOne("1")

      expect(result).toEqual(permission)
      expect(prisma.permission.findUnique).toHaveBeenCalledWith({
        where: { id: "1" },
      })
    })

    it("should return null if permission not found", async () => {
      mockPrismaService.permission.findUnique.mockResolvedValue(null)

      const result = await service.findOne("999")

      expect(result).toBeNull()
    })
  })

  describe("create", () => {
    it("should create a new permission", async () => {
      const createDto = {
        name: "test_permission",
        description: "Test Permission",
        category: "test",
      }
      const createdPermission = {
        id: "4",
        ...createDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      mockPrismaService.permission.create.mockResolvedValue(createdPermission)

      const result = await service.create(createDto)

      expect(result).toEqual(createdPermission)
      expect(prisma.permission.create).toHaveBeenCalledWith({
        data: createDto,
      })
    })
  })

  describe("getUserPermissions", () => {
    it("should return user permissions", async () => {
      const userPermissions = userPermissionFixture.superAdminPermissions
      mockPrismaService.userPermission.findMany.mockResolvedValue(
        userPermissions.map((up) => ({
          ...up,
          permission: permissionFixture.userManagement,
        })),
      )

      const result = await service.getUserPermissions("1")

      expect(result).toHaveLength(3)
      expect(prisma.userPermission.findMany).toHaveBeenCalledWith({
        where: { userId: "1" },
        include: { permission: true },
      })
    })
  })

  describe("assignPermissionToUser", () => {
    it("should assign permission to user", async () => {
      const assignDto = {
        userId: "3",
        permissionId: "1",
      }
      const userPermission = {
        id: "5",
        ...assignDto,
        createdAt: new Date(),
      }

      mockPrismaService.userPermission.create.mockResolvedValue(userPermission)

      const result = await service.assignPermissionToUser(assignDto)

      expect(result).toEqual(userPermission)
      expect(prisma.userPermission.create).toHaveBeenCalledWith({
        data: assignDto,
      })
    })
  })

  describe("removePermissionFromUser", () => {
    it("should remove permission from user", async () => {
      const removeDto = {
        userId: "3",
        permissionId: "1",
      }

      mockPrismaService.userPermission.deleteMany.mockResolvedValue({ count: 1 })

      await service.removePermissionFromUser(removeDto)

      expect(prisma.userPermission.deleteMany).toHaveBeenCalledWith({
        where: removeDto,
      })
    })
  })
})
