"use client"

import { UsersHeader } from "@/components/dashboard/users/users-header"
import { UsersStats } from "@/components/dashboard/users/users-stats"
import { UsersTable } from "@/components/dashboard/users/users-table"
import { CreateUserModal } from "@/components/dashboard/modals/create-user-modal"
import { useState } from "react"

export default function UsersPage() {
  const [showCreateModal, setShowCreateModal] = useState(false)

  return (
    <div className="space-y-4">
      <UsersHeader setShowCreateModal={setShowCreateModal} />
      <UsersStats />
      <UsersTable />
      <CreateUserModal open={showCreateModal} setOpen={setShowCreateModal} />
    </div>
  )
}
