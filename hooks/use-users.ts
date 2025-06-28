"use client"

import { useState, useEffect } from "react"
import { usersApi } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export function useUsers() {
  const [users, setUsers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const { toast } = useToast()

  const fetchUsers = async (params?: { page?: number; search?: string }) => {
    setIsLoading(true)
    try {
      const response = await usersApi.getAll({
        page: params?.page || page,
        limit: 10,
        search: params?.search,
      })

      setUsers(response.users)
      setTotal(response.total)
      setPage(response.page)
      setTotalPages(response.totalPages)
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao carregar usuários",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const createUser = async (userData: any) => {
    try {
      await usersApi.create(userData)
      toast({
        title: "Sucesso",
        description: "Usuário criado com sucesso",
      })
      await fetchUsers()
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao criar usuário",
        variant: "destructive",
      })
      throw error
    }
  }

  const updateUser = async (id: string, userData: any) => {
    try {
      await usersApi.update(id, userData)
      toast({
        title: "Sucesso",
        description: "Usuário atualizado com sucesso",
      })
      await fetchUsers()
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar usuário",
        variant: "destructive",
      })
      throw error
    }
  }

  const deleteUser = async (id: string) => {
    try {
      await usersApi.delete(id)
      toast({
        title: "Sucesso",
        description: "Usuário excluído com sucesso",
      })
      await fetchUsers()
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao excluir usuário",
        variant: "destructive",
      })
      throw error
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  return {
    users,
    isLoading,
    total,
    page,
    totalPages,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
  }
}
