'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Navbar from '@/adapters/ui/navbar'
import { createAuthUseCases } from '@/domain/use-cases/auth'
import { djangoAuthAdapter } from '@/adapters/api/auth-adapter'
import { User } from '@/domain/entities/user'
import { useRouter } from 'next/navigation'

const auth = createAuthUseCases(djangoAuthAdapter)

const categorias = [
  {
    id: 'flores',
    titulo: 'Flores',
    descripcion: 'Naturales, artificiales y mixtos',
    subcategorias: ['Naturales', 'Artificiales', 'Mixtos', 'Con accesorios'],
    href: '/tienda/flores',
    size: 'large',
    emoji: '🌹',
  },
  {
    id: 'arreglos',
    titulo: 'Arreglos',
    descripcion: 'Para eventos y ocasiones especiales',
    subcategorias: ['Centros de mesa', 'Escaleras florales', 'Arcos', 'Decoración'],
    href: '/tienda/arreglos',
    size: 'medium',
    emoji: '💐',
  },
  {
    id: 'regalos',
    titulo: 'Regalos',
    descripcion: 'Graduaciones, aniversarios y más',
    subcategorias: ['Graduación', 'Aniversario', 'Cumpleaños', 'Corporativos'],
    href: '/tienda/regalos',
    size: 'medium',
    emoji: '🎁',
  },
]

export default function DashboardCliente() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    auth.getCurrentUser()
      .then(setUser)
      .catch(() => router.push('/login'))
  }, [])

  const handleLogout = async () => {
    await auth.logout()
    router.push('/login')
  }

  useEffect(() => {
    window.dispatchEvent(new Event('alesli-rose-background-start'))
  }, [])

  return (
    <div className="min-h-screen font-[DM_Sans,sans-serif]">
      <Navbar isLoggedIn={true} cartCount={0} onLogout={handleLogout} />

      {/* Hero bienvenida */}
      <section
        className="relative flex flex-col items-center justify-center text-center px-6"
        style={{ minHeight: '52vh', paddingTop: '80px' }}
      >
        <p className="text-[11px] tracking-[0.25em] uppercase text-[#9A6060] mb-3">
          Bienvenido de vuelta
        </p>
        <h1
          className="font-light text-[#7A2020] mb-4"
          style={{
            fontFamily: 'Cormorant Garamond, Georgia, serif',
            fontSize: 'clamp(2.5rem, 6vw, 5rem)',
            letterSpacing: '0.1em',
            lineHeight: 1.1,
          }}
        >
          {user ? user.nombre : 'Alesli'}
        </h1>
        <p className="text-sm text-[#9A6060] font-light tracking-wide max-w-md">
          Descubre nuestra colección de flores, arreglos y regalos pensados para cada momento especial.
        </p>
        <div className="flex gap-4 mt-8">
          <Link
            href="/tienda"
            className="px-8 py-3 text-[10px] tracking-[0.2em] uppercase text-white font-[DM_Sans,sans-serif]"
            style={{ background: '#7A2020' }}
          >
            Ver todo
          </Link>
          <Link
            href="/tienda/hazlo-tu-mismo"
            className="px-8 py-3 text-[10px] tracking-[0.2em] uppercase text-[#7A2020] font-[DM_Sans,sans-serif]"
            style={{ border: '0.5px solid rgba(122,32,32,0.4)' }}
          >
            Hazlo tú mismo
          </Link>
        </div>
      </section>

      {/* Grid categorías */}
      <section className="px-6 md:px-12 lg:px-20 pb-20" style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <p className="text-[10px] tracking-[0.25em] uppercase text-[#9A6060] mb-8 text-center">
          Explorar colección
        </p>

        {/* Fila 1 — Flores grande + Arreglos */}
        <div className="grid gap-4 mb-4" style={{ gridTemplateColumns: '1.6fr 1fr' }}>
          {/* Flores — card grande */}
          <Link href="/tienda/flores" className="group relative overflow-hidden block" style={{ minHeight: '420px', background: '#F5E8E8' }}>
            <div className="absolute inset-0 flex flex-col justify-end p-8">
              <span className="text-[10px] tracking-[0.2em] uppercase text-[#9A6060] mb-2">Colección</span>
              <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '3rem', fontWeight: 300, color: '#7A2020', letterSpacing: '0.1em', lineHeight: 1 }}>
                Flores
              </h2>
              <p className="text-xs text-[#9A6060] mt-2 mb-4 font-light">Naturales · Artificiales · Mixtos · Con accesorios</p>
              <div className="flex gap-2 flex-wrap">
                {['Naturales', 'Artificiales', 'Mixtos', 'Con accesorios'].map(sub => (
                  <span key={sub} className="px-3 py-1 text-[9px] tracking-[0.1em] uppercase text-[#7A2020]" style={{ border: '0.5px solid rgba(122,32,32,0.3)' }}>
                    {sub}
                  </span>
                ))}
              </div>
            </div>
            <div
              className="absolute top-8 right-8 text-[120px] opacity-20 group-hover:opacity-30 transition-opacity duration-500 select-none"
              style={{ fontFamily: 'serif', lineHeight: 1 }}
            >
              
            </div>
          </Link>

          {/* Arreglos */}
          <Link href="/tienda/arreglos" className="group relative overflow-hidden block" style={{ minHeight: '420px', background: '#EEE0E0' }}>
            <div className="absolute inset-0 flex flex-col justify-end p-8">
              <span className="text-[10px] tracking-[0.2em] uppercase text-[#9A6060] mb-2">Colección</span>
              <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.5rem', fontWeight: 300, color: '#7A2020', letterSpacing: '0.1em', lineHeight: 1 }}>
                Arreglos
              </h2>
              <p className="text-xs text-[#9A6060] mt-2 mb-4 font-light">Para eventos y ocasiones especiales</p>
              <div className="flex gap-2 flex-wrap">
                {['Centros de mesa', 'Escaleras', 'Arcos', 'Decoración'].map(sub => (
                  <span key={sub} className="px-3 py-1 text-[9px] tracking-[0.1em] uppercase text-[#7A2020]" style={{ border: '0.5px solid rgba(122,32,32,0.3)' }}>
                    {sub}
                  </span>
                ))}
              </div>
            </div>
            <div className="absolute top-8 right-8 text-[90px] opacity-20 group-hover:opacity-30 transition-opacity duration-500 select-none" style={{ lineHeight: 1 }}>
              
            </div>
          </Link>
        </div>

        {/* Fila 2 — Regalos + Hazlo tú mismo */}
        <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 1.4fr' }}>
          {/* Regalos */}
          <Link href="/tienda/regalos" className="group relative overflow-hidden block" style={{ minHeight: '300px', background: '#F0E4E4' }}>
            <div className="absolute inset-0 flex flex-col justify-end p-8">
              <span className="text-[10px] tracking-[0.2em] uppercase text-[#9A6060] mb-2">Colección</span>
              <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.5rem', fontWeight: 300, color: '#7A2020', letterSpacing: '0.1em', lineHeight: 1 }}>
                Regalos
              </h2>
              <p className="text-xs text-[#9A6060] mt-2 mb-4 font-light">Graduaciones · Aniversarios · Cumpleaños</p>
              <div className="flex gap-2 flex-wrap">
                {['Graduación', 'Aniversario', 'Cumpleaños', 'Corporativos'].map(sub => (
                  <span key={sub} className="px-3 py-1 text-[9px] tracking-[0.1em] uppercase text-[#7A2020]" style={{ border: '0.5px solid rgba(122,32,32,0.3)' }}>
                    {sub}
                  </span>
                ))}
              </div>
            </div>
            <div className="absolute top-8 right-8 text-[80px] opacity-20 group-hover:opacity-30 transition-opacity duration-500 select-none" style={{ lineHeight: 1 }}>
              
            </div>
          </Link>

          {/* Hazlo tú mismo */}
          <Link href="/tienda/hazlo-tu-mismo" className="group relative overflow-hidden flex flex-col items-center justify-center text-center p-8" style={{ minHeight: '300px', background: '#2C1A1A' }}>
            <span className="text-[10px] tracking-[0.25em] uppercase text-[rgba(255,255,255,0.4)] mb-3">Experiencia única</span>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.8rem', fontWeight: 300, color: 'rgba(255,255,255,0.9)', letterSpacing: '0.1em', lineHeight: 1 }}>
              Hazlo tú mismo
            </h2>
            <p className="text-xs text-[rgba(255,255,255,0.5)] mt-3 mb-6 font-light max-w-xs">
              Crea tu arreglo perfecto eligiendo cada detalle a tu gusto
            </p>
            <span className="px-6 py-2 text-[9px] tracking-[0.2em] uppercase text-[rgba(255,255,255,0.8)]" style={{ border: '0.5px solid rgba(255,255,255,0.3)' }}>
              Empezar →
            </span>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2C1A1A] text-[rgba(255,255,255,0.7)] px-12 py-12 flex justify-between items-center text-xs tracking-[0.08em] max-md:flex-col max-md:gap-4 max-md:text-center">
        <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', fontWeight: 300, color: 'rgba(255,255,255,0.9)', letterSpacing: '0.2em' }}>
          Alesli
        </span>
        <span className="text-[11px] tracking-[0.08em] opacity-50">
          &copy; 2026 Alesli Flores. Todos los derechos reservados.
        </span>
        <div className="flex gap-6 text-[11px]">
          <Link href="/privacidad" className="text-[rgba(255,255,255,0.5)] no-underline">Privacidad</Link>
          <Link href="/terminos" className="text-[rgba(255,255,255,0.5)] no-underline">Términos</Link>
        </div>
      </footer>
    </div>
  )
}