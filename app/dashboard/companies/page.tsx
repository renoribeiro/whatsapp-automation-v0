import { CompaniesHeader } from "@/components/dashboard/companies/companies-header"
import { CompaniesStats } from "@/components/dashboard/companies/companies-stats"
import { CompaniesTable } from "@/components/dashboard/companies/companies-table"
import { CreateCompanyModal } from "@/components/dashboard/modals/create-company-modal"

export default function CompaniesPage() {
  return (
    <div className="space-y-4">
      <CompaniesHeader />
      <CompaniesStats />
      <CompaniesTable />
      <CreateCompanyModal />
    </div>
  )
}
