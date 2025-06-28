const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new ApiError(response.status, errorData.message || "Request failed")
    }

    return await response.json()
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(0, "Network error")
  }
}

// Auth API
export const authApi = {
  login: async (email: string, password: string) => {
    return apiRequest<{ access_token: string; user: any }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
  },

  register: async (userData: {
    firstName: string
    lastName: string
    email: string
    password: string
    company?: string
  }) => {
    return apiRequest<{ message: string }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    })
  },

  forgotPassword: async (email: string) => {
    return apiRequest<{ message: string }>("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    })
  },

  resetPassword: async (token: string, password: string) => {
    return apiRequest<{ message: string }>("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, password }),
    })
  },

  verifyEmail: async (token: string) => {
    return apiRequest<{ message: string }>("/auth/verify-email", {
      method: "POST",
      body: JSON.stringify({ token }),
    })
  },

  me: async () => {
    return apiRequest<any>("/auth/me")
  },
}

// Users API
export const usersApi = {
  getAll: async (params?: { page?: number; limit?: number; search?: string }) => {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.set("page", params.page.toString())
    if (params?.limit) searchParams.set("limit", params.limit.toString())
    if (params?.search) searchParams.set("search", params.search)

    return apiRequest<{
      users: any[]
      total: number
      page: number
      totalPages: number
    }>(`/users?${searchParams}`)
  },

  create: async (userData: {
    firstName: string
    lastName: string
    email: string
    password: string
    phone?: string
    role: string
    companyId?: string
    agencyId?: string
    isActive: boolean
  }) => {
    return apiRequest<any>("/users", {
      method: "POST",
      body: JSON.stringify(userData),
    })
  },

  update: async (id: string, userData: Partial<any>) => {
    return apiRequest<any>(`/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify(userData),
    })
  },

  delete: async (id: string) => {
    return apiRequest<{ message: string }>(`/users/${id}`, {
      method: "DELETE",
    })
  },
}

// Companies API
export const companiesApi = {
  getAll: async (params?: { page?: number; limit?: number; search?: string }) => {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.set("page", params.page.toString())
    if (params?.limit) searchParams.set("limit", params.limit.toString())
    if (params?.search) searchParams.set("search", params.search)

    return apiRequest<{
      companies: any[]
      total: number
      page: number
      totalPages: number
    }>(`/companies?${searchParams}`)
  },

  create: async (companyData: {
    name: string
    email: string
    phone?: string
    document?: string
    address?: string
    agencyId?: string
    isActive: boolean
  }) => {
    return apiRequest<any>("/companies", {
      method: "POST",
      body: JSON.stringify(companyData),
    })
  },

  update: async (id: string, companyData: Partial<any>) => {
    return apiRequest<any>(`/companies/${id}`, {
      method: "PATCH",
      body: JSON.stringify(companyData),
    })
  },

  delete: async (id: string) => {
    return apiRequest<{ message: string }>(`/companies/${id}`, {
      method: "DELETE",
    })
  },
}

// Conversations API
export const conversationsApi = {
  getAll: async (params?: { page?: number; limit?: number; status?: string }) => {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.set("page", params.page.toString())
    if (params?.limit) searchParams.set("limit", params.limit.toString())
    if (params?.status) searchParams.set("status", params.status)

    return apiRequest<{
      conversations: any[]
      total: number
      page: number
      totalPages: number
    }>(`/conversations?${searchParams}`)
  },

  create: async (conversationData: {
    contactName: string
    phoneNumber: string
    companyId: string
    whatsappConnectionId: string
    assignedUserId?: string
  }) => {
    return apiRequest<any>("/conversations", {
      method: "POST",
      body: JSON.stringify(conversationData),
    })
  },

  update: async (id: string, conversationData: Partial<any>) => {
    return apiRequest<any>(`/conversations/${id}`, {
      method: "PATCH",
      body: JSON.stringify(conversationData),
    })
  },

  assign: async (id: string, userId: string) => {
    return apiRequest<any>(`/conversations/${id}/assign`, {
      method: "POST",
      body: JSON.stringify({ userId }),
    })
  },
}

// Reports API
export const reportsApi = {
  generate: async (reportData: {
    reportType: string
    startDate: string
    endDate: string
    companyId?: string
    format: string
    includeCharts: boolean
    includeDetails: boolean
    includeComparisons: boolean
  }) => {
    return apiRequest<{ downloadUrl: string; fileName: string }>("/reports/generate", {
      method: "POST",
      body: JSON.stringify(reportData),
    })
  },

  getStats: async () => {
    return apiRequest<{
      totalRevenue: number
      totalMessages: number
      activeCompanies: number
      conversionRate: number
    }>("/reports/stats")
  },
}

// WhatsApp API
export const whatsappApi = {
  getConnections: async () => {
    return apiRequest<any[]>("/whatsapp/connections")
  },

  createConnection: async (connectionData: {
    phoneNumber: string
    displayName: string
    companyId: string
  }) => {
    return apiRequest<any>("/whatsapp/connections", {
      method: "POST",
      body: JSON.stringify(connectionData),
    })
  },
}

// Agencies API
export const agenciesApi = {
  getAll: async () => {
    return apiRequest<any[]>("/agencies")
  },

  create: async (agencyData: {
    name: string
    email: string
    phone?: string
    address?: string
  }) => {
    return apiRequest<any>("/agencies", {
      method: "POST",
      body: JSON.stringify(agencyData),
    })
  },
}

export { ApiError }
