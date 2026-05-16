import type { Metadata } from 'next'
import { PersonalizacionBouquetsPage } from '@/adapters/ui/personalizacion-bouquets'

export const metadata: Metadata = {
  title: 'Hazlo tu mismo | Alesli Flores',
  description: 'Personaliza tu bouquet eligiendo envoltura y flores por nombre o por orden alfabetico.',
}

export default function HazloTuMismoPage() {
  return <PersonalizacionBouquetsPage />
}