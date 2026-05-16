import type { Metadata } from 'next'
import CatalogoTiendaPage from '@/adapters/ui/tienda/catalogo-tienda-page'

export const metadata: Metadata = {
  title: 'Tienda | Alesli Flores',
  description: 'Catalogo real de bouquets y flores conectado a la base de datos.',
}

export default function TiendaPage() {
  return <CatalogoTiendaPage />
}
