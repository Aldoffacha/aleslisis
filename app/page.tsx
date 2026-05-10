'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import HeroCarousel from '@/components/HeroCarousel'
import Navbar from '@/components/Navbar'
import SocialSection from '@/components/SocialSection'
import { api, User } from '@/lib/api'

const INTRO_SEEN_KEY = 'alesli_intro_seen'

const IntroAnimation = dynamic(() => import('@/components/IntroAnimation'), { ssr: false })

export default function Home() {
  const [showDashboard, setShowDashboard] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    if (sessionStorage.getItem(INTRO_SEEN_KEY) === 'true') {
      setShowDashboard(true)
    }
  }, [])

  useEffect(() => {
    api.me()
      .then(setUser)
      .catch(() => setUser(null))
  }, [])

  const handleIntroComplete = () => {
    sessionStorage.setItem(INTRO_SEEN_KEY, 'true')
    setShowDashboard(true)
  }

  return (
    <>
      {!showDashboard && (
        <IntroAnimation onComplete={handleIntroComplete} />
      )}

      {showDashboard && (
        <div className="main-content">
          <Navbar cartCount={0} isLoggedIn={!!user} />

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
              <Link href="/privacidad" className="text-[rgba(255,255,255,0.5)] no-underline">Privacidad</Link>
              <Link href="/terminos" className="text-[rgba(255,255,255,0.5)] no-underline">Términos</Link>
            </div>
          </footer>
        </div>
      )}
    </>
  )
}
