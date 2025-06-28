"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UserPlus, Search, Filter } from "lucide-react"

interface UsersHeaderProps {
  setShowCreateModal: (show: boolean) => void
}

export function UsersHeader({ setShowCreateModal }: UsersHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Usuários</h2>
        <p className="text-muted-foreground">Gerencie usuários e permissões do sistema</p>
      </div>
      <div className="flex items-center space-x-2">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar usuários..." className="pl-8 w-64" />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filtros
        </Button>
        <Button onClick={() => setShowCreateModal(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Novo Usuário
        </Button>
      </div>
    </div>
  )
}
