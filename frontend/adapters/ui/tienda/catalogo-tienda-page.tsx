'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Navbar from '@/adapters/ui/navbar'
import { catalogoAdapter } from '@/adapters/api/catalogo-adapter'
import { djangoAuthAdapter } from '@/adapters/api/auth-adapter'
import { createAuthUseCases } from '@/domain/use-cases/auth'
import { mapCatalogoPublicoToPersonalizacion } from '@/adapters/ui/personalizacion-bouquets/personalizacion-bouquets.catalog'
import styles from './catalogo-tienda-page.module.css'

const auth = createAuthUseCases(djangoAuthAdapter)

export default function CatalogoTiendaPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [bouquets, setBouquets] = useState<ReturnType<typeof mapCatalogoPublicoToPersonalizacion>['bouquets']>([])
  const [flowers, setFlowers] = useState<ReturnType<typeof mapCatalogoPublicoToPersonalizacion>['flowers']>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    auth.getCurrentUser()
      .then(() => { if (isMounted) setIsLoggedIn(true) })
      .catch(() => { if (isMounted) setIsLoggedIn(false) })

    catalogoAdapter.fetchPublicPersonalizacion()
      .then((response) => {
        if (!isMounted) return
        const mappedCatalog = mapCatalogoPublicoToPersonalizacion(response)
        setBouquets(mappedCatalog.bouquets)
        setFlowers(mappedCatalog.flowers)
        setIsLoading(false)
      })
      .catch((error) => {
        if (!isMounted) return
        setErrorMessage(error instanceof Error ? error.message : 'No se pudo cargar el catálogo.')
        setIsLoading(false)
      })

    return () => { isMounted = false }
  }, [])

  const handleLogout = async () => {
    await auth.logout()
    setIsLoggedIn(false)
  }

  return (
    <div className="min-h-screen font-[DM_Sans,sans-serif]">
      <Navbar isLoggedIn={isLoggedIn} cartCount={0} onLogout={handleLogout} />

      <section className={styles.hero} style={{ paddingTop: '100px' }}>
        <span className={styles.eyebrow}>Tienda</span>
        <h1 className={styles.title}>Nuestro catálogo</h1>
        <p className={styles.description}>
          Descubre nuestra colección de bouquets y flores, cada uno creado con los mejores materiales.
        </p>
        <div className={styles.ctaRow}>
          <Link href="/cliente/tienda/hazlo-tu-mismo" className={styles.primaryLink}>Hazlo tú mismo</Link>
          <Link href="#flores" className={styles.secondaryLink}>Ver flores</Link>
        </div>
      </section>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px 60px' }}>
        {isLoading ? <p className={styles.feedback}>Cargando catálogo…</p> : null}
        {errorMessage ? <p className={styles.feedback}>{errorMessage}</p> : null}
      </div>

      {!isLoading && !errorMessage ? (
        <>
          <section id="bouquets" className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.eyebrow}>Bouquets</span>
              <h2 className={styles.sectionTitle}>Envolturas y bouquets</h2>
            </div>
            <div className={styles.cardGrid}>
              {bouquets.map((bouquet) => (
                <article key={bouquet.id} className={styles.card}>
                  <div className={styles.imageWrap}>
                    <img src={bouquet.imageSrc} alt={bouquet.title} />
                  </div>
                  <div className={styles.cardBody}>
                    <span className={styles.cardBadge}>{bouquet.badge}</span>
                    <strong className={styles.cardTitle}>{bouquet.title}</strong>
                    <p className={styles.cardText}>{bouquet.description}</p>
                    <div className={styles.cardMeta}>
                      <span>Stock {bouquet.stock}</span>
                      <span>Bs. {bouquet.price}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section id="flores" className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.eyebrow}>Flores</span>
              <h2 className={styles.sectionTitle}>Catálogo floral</h2>
            </div>
            <div className={styles.cardGrid}>
              {flowers.map((flower) => (
                <article key={flower.id} className={styles.card}>
                  <div className={styles.imageWrap}>
                    <img src={flower.imageSrc} alt={flower.name} />
                  </div>
                  <div className={styles.cardBody}>
                    <span className={styles.cardBadge}>{flower.category}</span>
                    <strong className={styles.cardTitle}>{flower.name}</strong>
                    <p className={styles.cardText}>{flower.note}</p>
                    <div className={styles.cardMeta}>
                      <span>{flower.tone}</span>
                      <span>Stock {flower.stock}</span>
                      <span>Bs. {flower.price}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </>
      ) : null}

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