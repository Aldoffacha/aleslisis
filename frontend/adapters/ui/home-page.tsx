'use client'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import Navbar from './navbar'
import HeroCarousel from './hero-carousel'
import SocialSection from './social-section'
import { createAuthUseCases } from '@/domain/use-cases/auth'
import { djangoAuthAdapter } from '@/adapters/api/auth-adapter'

const INTRO_SEEN_KEY = 'alesli_intro_seen'

const IntroAnimation = dynamic(() => import('./intro-animation'), { ssr: false })

const auth = createAuthUseCases(djangoAuthAdapter)

export default function HomePage() {

  const router = useRouter()

  const [showDashboard, setShowDashboard] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    setIsClient(true)
    if (sessionStorage.getItem(INTRO_SEEN_KEY) === 'true') {
      setShowDashboard(true)
    }
  }, [])

  useEffect(() => {
    auth.getCurrentUser()
      .then((user) => {
        setIsLoggedIn(true)

        if (user.rol === 'cliente') {
          router.push('/cliente/dashboard')
        } else if (user.rol === 'empleado') {
          router.push('/empleado/dashboard')
        } else if (user.rol === 'administrador') {
          router.push('/administrador/dashboard')
        }
      })
      .catch((err) => {
  if (err instanceof Error && err.message.includes('No autenticado')) {
    setIsLoggedIn(false)
    return
  }

  console.error(err)
})
  }, [router])

  useEffect(() => {
    if (!isClient || !showDashboard) return
    window.dispatchEvent(new Event('alesli-rose-background-start'))
  }, [isClient, showDashboard])

  const handleIntroComplete = () => {
    sessionStorage.setItem(INTRO_SEEN_KEY, 'true')
    setShowDashboard(true)
  }

  if (!isClient) {
    return null
  }

  return (
    <>
      {!showDashboard && (
        <IntroAnimation onComplete={handleIntroComplete} />
      )}

      {showDashboard && (
        <>
          <Navbar cartCount={0} isLoggedIn={isLoggedIn} />

          <div className="main-content">
            <main className="pt-0">
              <HeroCarousel />
            </main>

            <SocialSection />

            <footer className="bg-[#2C1A1A] text-[rgba(255,255,255,0.7)] px-12 py-12 flex justify-between items-center text-xs tracking-[0.08em] max-md:flex-col max-md:gap-4 max-md:text-center">
              <span className="font-[Cormorant_Garamond,serif] text-xl font-light text-[rgba(255,255,255,0.9)] tracking-[0.2em]">
                Alesli
              </span>

              <span className="text-[11px] tracking-[0.08em] opacity-50">
                &copy; 2026 Alesli Flores. Todos los derechos reservados.
              </span>

              <div className="flex gap-6 text-[11px] tracking-[0.08em]">
                <Link href="/privacidad" className="text-[rgba(255,255,255,0.5)] no-underline">
                  Privacidad
                </Link>

                <Link href="/terminos" className="text-[rgba(255,255,255,0.5)] no-underline">
                  Términos
                </Link>
              </div>
            </footer>
          </div>
        </>
      )}
    </>
  )
}