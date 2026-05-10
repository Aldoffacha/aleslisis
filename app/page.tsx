'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import HeroCarousel from '@/components/HeroCarousel'
import Navbar from '@/components/Navbar'
import SocialSection from '@/components/SocialSection'

const IntroAnimation = dynamic(() => import('@/components/IntroAnimation'), { ssr: false })

export default function Home() {
  const [showDashboard, setShowDashboard] = useState(false)

  return (
    <>
      {/* Intro animation */}
      {!showDashboard && (
        <IntroAnimation onComplete={() => setShowDashboard(true)} />
      )}

      {/* Main content */}
      {showDashboard && (
        <div className="main-content">
          <Navbar cartCount={0} isLoggedIn={false} />

          {/* Hero Carousel */}
          <main style={{ paddingTop: 0 }}>
            <HeroCarousel />
          </main>

          {/* Social / Instagram section */}
          <SocialSection />

          {/* Footer */}
          <footer>
            <span className="logo">Alesli</span>
            <span style={{ fontSize: 11, letterSpacing: '0.08em', opacity: 0.5 }}>
              © 2026 Alesli Flores. Todos los derechos reservados.
            </span>
            <div style={{ display: 'flex', gap: 24, fontSize: 11, letterSpacing: '0.08em' }}>
              <a href="/privacidad" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Privacidad</a>
              <a href="/terminos" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Terminos</a>
            </div>
          </footer>
        </div>
      )}
    </>
  )
}
