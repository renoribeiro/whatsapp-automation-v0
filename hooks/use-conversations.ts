"use client"

import { useState, useEffect } from "react"
import { conversationsApi } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export function useConversations() {
  const [conversations, setConversations] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const { toast } = useToast()

  const fetchConversations = async (params?: { page?: number; status?: string }) => {
    setIsLoading(true)
    try {
      const response = await conversationsApi.getAll({
        page: params?.page || page,
        limit: 10,
        status: params?.status,
      })

      setConversations(response.conversations)
      setTotal(response.total)
      setPage(response.page)
      setTotalPages(response.totalPages)
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao carregar conversas",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const createConversation = async (conversationData: any) => {
    try {
      await conversationsApi.create(conversationData)
      toast({
        title: "Sucesso",
        description: "Conversa criada com sucesso",
      })
      await fetchConversations()
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao criar conversa",
        variant: "destructive",
      })
      throw error
    }
  }

  const updateConversation = async (id: string, conversationData: any) => {
    try {
      await conversationsApi.update(id, conversationData)
      toast({
        title: "Sucesso",
        description: "Conversa atualizada com sucesso",
      })
      await fetchConversations()
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar conversa",
        variant: "destructive",
      })
      throw error
    }
  }

  const assignConversation = async (id: string, userId: string) => {
    try {
      await conversationsApi.assign(id, userId)
      toast({
        title: "Sucesso",
        description: "Conversa atribuída com sucesso",
      })
      await fetchConversations()
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao atribuir conversa",
        variant: "destructive",
      })
      throw error
    }
  }

  useEffect(() => {
    fetchConversations()
  }, [])

  return {
    conversations,
    isLoading,
    total,
    page,
    totalPages,
    fetchConversations,
    createConversation,
    updateConversation,
    assignConversation,
  }
}
