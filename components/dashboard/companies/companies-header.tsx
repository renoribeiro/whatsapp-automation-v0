"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Building, Search, Filter } from "lucide-react"
import { CreateCompanyModal } from "@/components/dashboard/modals/create-company-modal"

export function CompaniesHeader() {
  const [showCreateModal, setShowCreateModal] = useState(false)

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Empresas</h2>
          <p className="text-muted-foreground">Gerencie empresas e suas configurações</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar empresas..." className="pl-8 w-64" />
          </div>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filtros
          </Button>
          <Button onClick={() => setShowCreateModal(true)}>
            <Building className="mr-2 h-4 w-4" />
            Nova Empresa
          </Button>
        </div>
      </div>
      <CreateCompanyModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onSuccess={() => {
          console.log("Empresa criada com sucesso!")
        }}
      />
    </>
  )
}
