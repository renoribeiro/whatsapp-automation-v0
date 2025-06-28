export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: "SUPER_ADMIN" | "AGENCY_ADMIN" | "COMPANY_ADMIN" | "SELLER"
  isActive: boolean
  companyId?: string
  agencyId?: string
  createdAt: Date
  updatedAt: Date
}

export interface Company {
  id: string
  name: string
  email: string
  phone?: string
  document?: string
  address?: string
  isActive: boolean
  agencyId?: string
  createdAt: Date
  updatedAt: Date
}

export interface Agency {
  id: string
  name: string
  email: string
  phone?: string
  document?: string
  address?: string
  isActive: boolean
  commission: number
  createdAt: Date
  updatedAt: Date
}

// Mock data for development
export const mockUser: User = {
  id: "1",
  email: "admin@example.com",
  firstName: "Admin",
  lastName: "User",
  role: "SUPER_ADMIN",
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
}

export const mockCompany: Company = {
  id: "1",
  name: "Empresa Exemplo",
  email: "contato@empresa.com",
  phone: "(11) 99999-9999",
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
}
