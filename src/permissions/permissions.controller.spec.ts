import { Test, type TestingModule } from "@nestjs/testing"
import { PermissionsController } from "./permissions.controller"
import { PermissionsService } from "./permissions.service"
import { permissionFixture } from "../../test/fixtures/permission.fixture"
import { jest } from "@jest/globals"

describe("PermissionsController", () => {
  let controller: PermissionsController
  let service: PermissionsService

  const mockPermissionsService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    getUserPermissions: jest.fn(),
    assignPermissionToUser: jest.fn(),
    removePermissionFromUser: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PermissionsController],
      providers: [
        {
          provide: PermissionsService,
          useValue: mockPermissionsService,
        },
      ],
    }).compile()

    controller = module.get<PermissionsController>(PermissionsController)
    service = module.get<PermissionsService>(PermissionsService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe("findAll", () => {
    it("should return all permissions", async () => {
      const expectedPermissions = Object.values(permissionFixture)
      mockPermissionsService.findAll.mockResolvedValue(expectedPermissions)

      const result = await controller.findAll()

      expect(result).toEqual(expectedPermissions)
      expect(service.findAll).toHaveBeenCalled()
    })
  })

  describe("findOne", () => {
    it("should return a permission by id", async () => {
      const permission = permissionFixture.userManagement
      mockPermissionsService.findOne.mockResolvedValue(permission)

      const result = await controller.findOne("1")

      expect(result).toEqual(permission)
      expect(service.findOne).toHaveBeenCalledWith("1")
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

      mockPermissionsService.create.mockResolvedValue(createdPermission)

      const result = await controller.create(createDto)

      expect(result).toEqual(createdPermission)
      expect(service.create).toHaveBeenCalledWith(createDto)
    })
  })

  describe("getUserPermissions", () => {
    it("should return user permissions", async () => {
      const userPermissions = [permissionFixture.userManagement]
      mockPermissionsService.getUserPermissions.mockResolvedValue(userPermissions)

      const result = await controller.getUserPermissions("1")

      expect(result).toEqual(userPermissions)
      expect(service.getUserPermissions).toHaveBeenCalledWith("1")
    })
  })

  describe("assignPermission", () => {
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

      mockPermissionsService.assignPermissionToUser.mockResolvedValue(userPermission)

      const result = await controller.assignPermission(assignDto)

      expect(result).toEqual(userPermission)
      expect(service.assignPermissionToUser).toHaveBeenCalledWith(assignDto)
    })
  })
})
