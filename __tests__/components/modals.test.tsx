import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { CreateUserModal } from "@/components/dashboard/modals/create-user-modal"
import { CreateConversationModal } from "@/components/dashboard/modals/create-conversation-modal"

// Mock hooks
vi.mock("@/hooks/use-users", () => ({
  useUsers: () => ({
    createUser: vi.fn(),
    isLoading: false,
  }),
}))

vi.mock("@/hooks/use-conversations", () => ({
  useConversations: () => ({
    createConversation: vi.fn(),
    isLoading: false,
  }),
}))

vi.mock("@/lib/api", () => ({
  companiesApi: {
    getAll: vi.fn().mockResolvedValue({ companies: [] }),
  },
  agenciesApi: {
    getAll: vi.fn().mockResolvedValue([]),
  },
  whatsappApi: {
    getConnections: vi.fn().mockResolvedValue([]),
  },
  usersApi: {
    getAll: vi.fn().mockResolvedValue({ users: [] }),
  },
}))

describe("CreateUserModal", () => {
  it("should render modal when open", () => {
    render(<CreateUserModal open={true} onOpenChange={() => {}} onSuccess={() => {}} />)

    expect(screen.getByText("Novo Usuário")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("João")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Silva")).toBeInTheDocument()
  })

  it("should validate required fields", async () => {
    const onOpenChange = vi.fn()

    render(<CreateUserModal open={true} onOpenChange={onOpenChange} onSuccess={() => {}} />)

    const submitButton = screen.getByText("Criar Usuário")
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText("Nome é obrigatório")).toBeInTheDocument()
    })
  })
})

describe("CreateConversationModal", () => {
  it("should render modal when open", () => {
    render(<CreateConversationModal open={true} onOpenChange={() => {}} onSuccess={() => {}} />)

    expect(screen.getByText("Nova Conversa")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("João Silva")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("+55 11 99999-9999")).toBeInTheDocument()
  })
})
