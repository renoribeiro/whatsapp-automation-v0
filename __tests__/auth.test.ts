import { describe, it, expect, vi, beforeEach } from "vitest"
import { authApi } from "@/lib/api"

// Mock fetch
global.fetch = vi.fn()

describe("Auth API", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should login successfully", async () => {
    const mockResponse = {
      access_token: "test-token",
      user: { id: "1", email: "test@example.com" },
    }
    ;(fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    })

    const result = await authApi.login("test@example.com", "password")

    expect(result).toEqual(mockResponse)
    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:3001/auth/login",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "Content-Type": "application/json",
        }),
        body: JSON.stringify({
          email: "test@example.com",
          password: "password",
        }),
      }),
    )
  })

  it("should handle login error", async () => {
    ;(fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ message: "Invalid credentials" }),
    })

    await expect(authApi.login("test@example.com", "wrong-password")).rejects.toThrow("Invalid credentials")
  })

  it("should register successfully", async () => {
    const mockResponse = { message: "User created successfully" }
    ;(fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    })

    const userData = {
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      password: "password123",
      company: "Test Company",
    }

    const result = await authApi.register(userData)

    expect(result).toEqual(mockResponse)
    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:3001/auth/register",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify(userData),
      }),
    )
  })
})
