'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/adapters/ui/navbar'
import styles from './contacto-page.module.css'

const CONTACTOS = [
  {
    red: 'Instagram',
    usuario: '@floreria_alesli',
    url: 'https://www.instagram.com/floreria_alesli?fbclid=IwY2xjawR1sbhleHRuA2FlbQIxMABicmlkETB6UXl6QjdUcjNyTE5VNXowc3J0YwZhcHBfaWQQMjIyMDM5MTc4ODIwMDg5MgABHlOAuO1lKTGhD0M2NRNB2cxiW--6Vh8X6225udafzAIDVnQdzA1E7u-vywHS_aem_GmBXK6xS4-0tfJ0OZLo9fA',
    icon: 'M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 0 2.5 1.25 1.25 0 0 1 0-2.5M12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10m0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
  },
  {
    red: 'Facebook',
    usuario: 'Alesli Naturalmente Para Ti',
    url: 'https://www.facebook.com/AlesliNaturalmenteParaTi/',
    icon: 'M17 2v4h-2c-.69 0-1 .81-1 1.5V10h3v4h-3v8h-4v-8H7v-4h3V6a4 4 0 0 1 4-4h3z',
  },
  {
    red: 'TikTok',
    usuario: '@alesli_floreria_lp',
    url: 'https://www.tiktok.com/@alesli_floreria_lp?_r=1&_t=ZS-96PzmdNZIiV',
    icon: 'M16.6 2c.2 2.5 1.5 4 3.8 4.2v3.1c-1 .2-2-.3-3.1-.9v5.2c0 5.5-5.7 8.8-10 5.5-3.6-2.8-2.8-9.5 3.1-9.5v3.1c-1.2 0-2.2.5-2.6 1.4-.5 1.3-.1 2.9.9 3.6 1.6 1.2 4 .1 4-2.8V2h3.9z',
  },
]

export default function ContactoPage() {
  useEffect(() => {
    window.dispatchEvent(new Event('alesli-rose-background-start'))
  }, [])

  return (
    <div className="min-h-screen font-[DM_Sans,sans-serif]">
      <Navbar isLoggedIn={false} cartCount={0} />

      <main className={styles.main}>
        <div className={styles.content}>
          <div className={styles.header}>
            <span className={styles.eyebrow}>Contacto</span>
            <h1 className={styles.title}>Hablemos</h1>
            <p className={styles.description}>
              Estamos aquí para ayudarte a encontrar el detalle perfecto.
              Contáctanos por cualquiera de nuestros canales.
            </p>
          </div>

          <div className={styles.divider} />

          <div className={styles.socialGrid}>
            {CONTACTOS.map((c) => (
              <a
                key={c.red}
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialCard}
              >
                <div className={styles.socialIconWrap}>
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d={c.icon} />
                  </svg>
                </div>
                <div>
                  <span className={styles.socialRed}>{c.red}</span>
                  <span className={styles.socialUser}>{c.usuario}</span>
                </div>
              </a>
            ))}
          </div>

          <div className={styles.divider} />

          <div className={styles.contactRow}>
            <div className={styles.contactItem}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#7A2020" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <a href="tel:+59177793200" className={styles.contactLink}>+591 77793200</a>
            </div>
            <div className={styles.contactItem}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#25D366" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
              <a href="https://wa.me/59177793200" target="_blank" rel="noopener noreferrer" className={styles.contactLink}>WhatsApp: +591 77793200</a>
            </div>
            <div className={styles.contactItem}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#7A2020" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <polyline points="2,4 12,13 22,4" />
              </svg>
              <a href="mailto:leslieferlo@icloud.com" className={styles.contactLink}>leslieferlo@icloud.com</a>
            </div>
            <div className={styles.contactItem}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#7A2020" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span className={styles.contactText}>Calle Campos No. 248, La Paz, Bolivia</span>
            </div>
          </div>

          <div className={styles.divider} />

          <div className={styles.footerNote}>
            <span className={styles.footerBrand}>Alesli</span>
            <span className={styles.footerTagline}>Naturalmente para ti</span>
          </div>
        </div>
      </main>

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
