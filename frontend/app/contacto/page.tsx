import type { Metadata } from 'next'
import ContactoPage from '@/adapters/ui/contacto/contacto-page'

export const metadata: Metadata = {
  title: 'Contacto | Alesli Flores',
  description: 'Contacta con Alesli Flores. Síguenos en Instagram, Facebook y TikTok, o llámanos al +591 77793200.',
}

export default function Page() {
  return <ContactoPage />
}
