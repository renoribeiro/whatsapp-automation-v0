"use client"

import type * as React from "react"
import {
  AudioWaveform,
  Command,
  GalleryVerticalEnd,
  MessageCircle,
  Users,
  Building,
  BarChart3,
  Zap,
  Phone,
  Calendar,
  FileText,
  Shield,
  CreditCard,
  Headphones,
  Home,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "Admin WhatsApp",
    email: "admin@whatsapp.com",
    avatar: "/avatars/admin.jpg",
  },
  teams: [
    {
      name: "WhatsApp Platform",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Agência Digital",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "E-commerce Plus",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
      isActive: true,
    },
    {
      title: "Chat",
      url: "/dashboard/chat",
      icon: MessageCircle,
      badge: "12",
    },
    {
      title: "Conversas",
      url: "/dashboard/conversations",
      icon: MessageCircle,
      items: [
        {
          title: "Todas",
          url: "/dashboard/conversations",
        },
        {
          title: "Ativas",
          url: "/dashboard/conversations?status=active",
        },
        {
          title: "Pendentes",
          url: "/dashboard/conversations?status=pending",
        },
        {
          title: "Arquivadas",
          url: "/dashboard/conversations?status=archived",
        },
      ],
    },
    {
      title: "Usuários",
      url: "/dashboard/users",
      icon: Users,
      items: [
        {
          title: "Todos os Usuários",
          url: "/dashboard/users",
        },
        {
          title: "Administradores",
          url: "/dashboard/users?role=admin",
        },
        {
          title: "Vendedores",
          url: "/dashboard/users?role=seller",
        },
        {
          title: "Suporte",
          url: "/dashboard/users?role=support",
        },
      ],
    },
    {
      title: "Empresas",
      url: "/dashboard/companies",
      icon: Building,
      items: [
        {
          title: "Todas as Empresas",
          url: "/dashboard/companies",
        },
        {
          title: "Ativas",
          url: "/dashboard/companies?status=active",
        },
        {
          title: "Inativas",
          url: "/dashboard/companies?status=inactive",
        },
        {
          title: "Pendentes",
          url: "/dashboard/companies?status=pending",
        },
      ],
    },
    {
      title: "Permissões",
      url: "/dashboard/permissions",
      icon: Shield,
    },
    {
      title: "Relatórios",
      url: "/dashboard/reports",
      icon: BarChart3,
      items: [
        {
          title: "Visão Geral",
          url: "/dashboard/reports",
        },
        {
          title: "Conversas",
          url: "/dashboard/reports/conversations",
        },
        {
          title: "Usuários",
          url: "/dashboard/reports/users",
        },
        {
          title: "Receita",
          url: "/dashboard/reports/revenue",
        },
      ],
    },
    {
      title: "Configurações",
      url: "/dashboard/settings",
      icon: CreditCard,
    },
    {
      title: "Automação",
      url: "/dashboard/automation",
      icon: Zap,
      items: [
        {
          title: "Fluxos",
          url: "/dashboard/automation/flows",
        },
        {
          title: "Gatilhos",
          url: "/dashboard/automation/triggers",
        },
        {
          title: "Templates",
          url: "/dashboard/automation/templates",
        },
      ],
    },
  ],
  projects: [
    {
      name: "WhatsApp Business",
      url: "/dashboard/whatsapp",
      icon: Phone,
    },
    {
      name: "Agendamentos",
      url: "/dashboard/scheduling",
      icon: Calendar,
    },
    {
      name: "Documentos",
      url: "/dashboard/documents",
      icon: FileText,
    },
    {
      name: "Segurança",
      url: "/dashboard/security",
      icon: Shield,
    },
    {
      name: "Faturamento",
      url: "/dashboard/billing",
      icon: CreditCard,
    },
    {
      name: "Suporte",
      url: "/dashboard/support",
      icon: Headphones,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
