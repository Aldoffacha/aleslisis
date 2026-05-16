import type { Metadata } from 'next'
import dynamic from 'next/dynamic'

export const metadata: Metadata = {
  title: 'Sucursales | Alesli Flores',
  description: 'Encuentra la sucursal Alesli más cercana. Calle Campos No. 248, La Paz, Bolivia.',
}

const SucursalesPage = dynamic(
  () => import('@/adapters/ui/sucursales/sucursales-page'),
  { ssr: false },
)

export default function Page() {
  return <SucursalesPage />
}
