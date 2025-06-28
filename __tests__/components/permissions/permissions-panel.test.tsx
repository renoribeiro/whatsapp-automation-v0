import type React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { PermissionsPanel } from "@/components/permissions/permissions-panel"
import { permissionFixture } from "../fixtures/permission.fixture"
import { userFixture } from "../fixtures/user.fixture"
import "@testing-library/jest-dom"
import { jest } from "@jest/globals"

// Mock the API calls
jest.mock("@/lib/api", () => ({
  getPermissions: jest.fn(),
  getUserPermissions: jest.fn(),
  assignPermission: jest.fn(),
  removePermission: jest.fn(),
}))

const mockApi = require("@/lib/api")

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe("PermissionsPanel", () => {
  const mockUser = userFixture.companyAdmin
  const mockPermissions = Object.values(permissionFixture)

  beforeEach(() => {
    jest.clearAllMocks()
    mockApi.getPermissions.mockResolvedValue(mockPermissions)
    mockApi.getUserPermissions.mockResolvedValue([])
  })

  it("should render permissions panel with user info", async () => {
    render(<PermissionsPanel user={mockUser} />, { wrapper: createWrapper() })

    expect(screen.getByText("Gerenciar Permissões")).toBeInTheDocument()
    expect(screen.getByText(mockUser.name)).toBeInTheDocument()
    expect(screen.getByText(mockUser.email)).toBeInTheDocument()
  })

  it("should display loading state initially", () => {
    render(<PermissionsPanel user={mockUser} />, { wrapper: createWrapper() })

    expect(screen.getByText("Carregando permissões...")).toBeInTheDocument()
  })

  it("should display permissions after loading", async () => {
    render(<PermissionsPanel user={mockUser} />, { wrapper: createWrapper() })

    await waitFor(() => {
      expect(screen.getByText("Gerenciar usuários")).toBeInTheDocument()
      expect(screen.getByText("Visualizar conversas")).toBeInTheDocument()
      expect(screen.getByText("Gerar relatórios")).toBeInTheDocument()
    })
  })

  it("should filter permissions by category", async () => {
    render(<PermissionsPanel user={mockUser} />, { wrapper: createWrapper() })

    await waitFor(() => {
      expect(screen.getByText("Gerenciar usuários")).toBeInTheDocument()
    })

    // Click on users category filter
    const usersFilter = screen.getByText("Usuários")
    fireEvent.click(usersFilter)

    await waitFor(() => {
      expect(screen.getByText("Gerenciar usuários")).toBeInTheDocument()
      expect(screen.queryByText("Visualizar conversas")).not.toBeInTheDocument()
    })
  })

  it("should search permissions by name", async () => {
    render(<PermissionsPanel user={mockUser} />, { wrapper: createWrapper() })

    await waitFor(() => {
      expect(screen.getByText("Gerenciar usuários")).toBeInTheDocument()
    })

    const searchInput = screen.getByPlaceholderText("Buscar permissões...")
    fireEvent.change(searchInput, { target: { value: "usuários" } })

    await waitFor(() => {
      expect(screen.getByText("Gerenciar usuários")).toBeInTheDocument()
      expect(screen.queryByText("Visualizar conversas")).not.toBeInTheDocument()
    })
  })

  it("should assign permission to user", async () => {
    mockApi.assignPermission.mockResolvedValue({ success: true })

    render(<PermissionsPanel user={mockUser} />, { wrapper: createWrapper() })

    await waitFor(() => {
      expect(screen.getByText("Gerenciar usuários")).toBeInTheDocument()
    })

    // Find and click the toggle for user management permission
    const toggles = screen.getAllByRole("switch")
    fireEvent.click(toggles[0])

    await waitFor(() => {
      expect(mockApi.assignPermission).toHaveBeenCalledWith({
        userId: mockUser.id,
        permissionId: permissionFixture.userManagement.id,
        granted: true,
      })
    })
  })

  it("should remove permission from user", async () => {
    // Mock user already has the permission
    mockApi.getUserPermissions.mockResolvedValue([
      {
        id: "1",
        userId: mockUser.id,
        permissionId: permissionFixture.userManagement.id,
        permission: permissionFixture.userManagement,
      },
    ])
    mockApi.removePermission.mockResolvedValue({ success: true })

    render(<PermissionsPanel user={mockUser} />, { wrapper: createWrapper() })

    await waitFor(() => {
      expect(screen.getByText("Gerenciar usuários")).toBeInTheDocument()
    })

    // Find and click the toggle for user management permission (should be checked)
    const toggles = screen.getAllByRole("switch")
    fireEvent.click(toggles[0])

    await waitFor(() => {
      expect(mockApi.removePermission).toHaveBeenCalledWith({
        userId: mockUser.id,
        permissionId: permissionFixture.userManagement.id,
      })
    })
  })

  it("should display error message on API failure", async () => {
    mockApi.getPermissions.mockRejectedValue(new Error("API Error"))

    render(<PermissionsPanel user={mockUser} />, { wrapper: createWrapper() })

    await waitFor(() => {
      expect(screen.getByText("Erro ao carregar permissões")).toBeInTheDocument()
    })
  })

  it("should show empty state when no permissions found", async () => {
    mockApi.getPermissions.mockResolvedValue([])

    render(<PermissionsPanel user={mockUser} />, { wrapper: createWrapper() })

    await waitFor(() => {
      expect(screen.getByText("Nenhuma permissão encontrada")).toBeInTheDocument()
    })
  })

  it("should group permissions by category", async () => {
    render(<PermissionsPanel user={mockUser} />, { wrapper: createWrapper() })

    await waitFor(() => {
      expect(screen.getByText("Usuários")).toBeInTheDocument()
      expect(screen.getByText("Conversas")).toBeInTheDocument()
      expect(screen.getByText("Relatórios")).toBeInTheDocument()
    })
  })

  it("should show permission count for each category", async () => {
    render(<PermissionsPanel user={mockUser} />, { wrapper: createWrapper() })

    await waitFor(() => {
      // Each category should show count
      expect(screen.getByText("Usuários (1)")).toBeInTheDocument()
      expect(screen.getByText("Conversas (1)")).toBeInTheDocument()
      expect(screen.getByText("Relatórios (1)")).toBeInTheDocument()
    })
  })
})
