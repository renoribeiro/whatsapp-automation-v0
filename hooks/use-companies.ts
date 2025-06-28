"use client"

import { useState, useEffect } from "react"
import { companiesApi } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export function useCompanies() {
  const [companies, setCompanies] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const { toast } = useToast()

  const fetchCompanies = async (params?: { page?: number; search?: string }) => {
    setIsLoading(true)
    try {
      const response = await companiesApi.getAll({
        page: params?.page || page,
        limit: 10,
        search: params?.search,
      })

      setCompanies(response.companies)
      setTotal(response.total)
      setPage(response.page)
      setTotalPages(response.totalPages)
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao carregar empresas",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const createCompany = async (companyData: any) => {
    try {
      await companiesApi.create(companyData)
      toast({
        title: "Sucesso",
        description: "Empresa criada com sucesso",
      })
      await fetchCompanies()
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao criar empresa",
        variant: "destructive",
      })
      throw error
    }
  }

  const updateCompany = async (id: string, companyData: any) => {
    try {
      await companiesApi.update(id, companyData)
      toast({
        title: "Sucesso",
        description: "Empresa atualizada com sucesso",
      })
      await fetchCompanies()
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar empresa",
        variant: "destructive",
      })
      throw error
    }
  }

  const deleteCompany = async (id: string) => {
    try {
      await companiesApi.delete(id)
      toast({
        title: "Sucesso",
        description: "Empresa excluída com sucesso",
      })
      await fetchCompanies()
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao excluir empresa",
        variant: "destructive",
      })
      throw error
    }
  }

  useEffect(() => {
    fetchCompanies()
  }, [])

  return {
    companies,
    isLoading,
    total,
    page,
    totalPages,
    fetchCompanies,
    createCompany,
    updateCompany,
    deleteCompany,
  }
}
