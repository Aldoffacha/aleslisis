import type { Metadata } from 'next'
import { AdminDashboardPage } from '@/adapters/ui/admin-dashboard'

export const metadata: Metadata = {
  title: 'Dashboard Administrador | Alesli Flores',
  description: 'Centro de control administrativo para sucursales, ventas, catalogo, promociones y logistica.',
}

export default function DashboardAdministrador() {
  return <AdminDashboardPage />
}