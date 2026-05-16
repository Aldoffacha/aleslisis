export type DashboardTone = 'vino' | 'oro' | 'hoja' | 'grafito'

export type DashboardIcon =
  | 'home'
  | 'users'
  | 'store'
  | 'box'
  | 'sparkles'
  | 'credit-card'
  | 'truck'

export interface AdminCommandHighlight {
  id: string
  label: string
  value: string
  note: string
  tone: DashboardTone
}

export interface AdminSidebarItem {
  id: string
  label: string
  icon: DashboardIcon
  viewId?: string
  note: string
  children?: AdminSidebarItem[]
}

export interface AdminSidebarGroup {
  id: string
  title: string
  items: AdminSidebarItem[]
}

export interface AdminKpiStat {
  id: string
  label: string
  value: string
  status: string
  context: string
  tables: string[]
  href: string
  tone: DashboardTone
}

export interface AdminModuleSection {
  id: string
  title: string
  summary: string
  tables: string[]
  sections: string[]
  href: string
  status: string
  tone: DashboardTone
}

export interface AdminWorkflowLane {
  id: string
  title: string
  description: string
  tables: string[]
  href: string
  note: string
}

export interface AdminSnapshotCard {
  id: string
  label: string
  value: string
  note: string
  href: string
  tone: DashboardTone
}

export interface AdminViewCard {
  id: string
  title: string
  description: string
  note: string
  tone: DashboardTone
  tags: string[]
}

export interface AdminDashboardView {
  id: string
  icon: DashboardIcon
  label: string
  eyebrow: string
  title: string
  description: string
  emptyState: string
  accent: DashboardTone
  cards: AdminViewCard[]
}