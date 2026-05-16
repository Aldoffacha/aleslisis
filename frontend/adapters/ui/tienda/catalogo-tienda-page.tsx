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
      .then(() => {
        if (isMounted) {
          setIsLoggedIn(true)
        }
      })
      .catch(() => {
        if (isMounted) {
          setIsLoggedIn(false)
        }
      })

    catalogoAdapter.fetchPublicPersonalizacion()
      .then((response) => {
        if (!isMounted) {
          return
        }

        const mappedCatalog = mapCatalogoPublicoToPersonalizacion(response)
        setBouquets(mappedCatalog.bouquets)
        setFlowers(mappedCatalog.flowers)
        setIsLoading(false)
      })
      .catch((error) => {
        if (!isMounted) {
          return
        }

        setErrorMessage(error instanceof Error ? error.message : 'No se pudo cargar el catalogo de la tienda.')
        setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  const handleLogout = async () => {
    await auth.logout()
    setIsLoggedIn(false)
  }

  return (
    <div className={styles.pageShell}>
      <Navbar isLoggedIn={isLoggedIn} cartCount={0} onLogout={handleLogout} />

      <main className={styles.pageContent}>
        <section className={styles.hero}>
          <div className={styles.heroCopy}>
            <span className={styles.eyebrow}>Tienda conectada a la base de datos</span>
            <h1 className={styles.title}>Catalogo real de bouquets y flores</h1>
            <p className={styles.description}>
              Esta vista consume el mismo flujo real que usa el administrador. Si un bouquet o una flor se crea,
              edita u oculta desde el dashboard, aqui se refleja sin volver a usar datos hardcodeados.
            </p>
            <div className={styles.ctaRow}>
              <Link href="/cliente/tienda/hazlo-tu-mismo" className={styles.primaryLink}>Ir a Hazlo tu mismo</Link>
              <Link href="#flores" className={styles.secondaryLink}>Ver flores</Link>
            </div>
          </div>

          <div className={styles.statsGrid}>
            <article className={styles.statCard}>
              <span className={styles.statLabel}>Bouquets</span>
              <strong className={styles.statValue}>{bouquets.length}</strong>
            </article>
            <article className={styles.statCard}>
              <span className={styles.statLabel}>Flores</span>
              <strong className={styles.statValue}>{flowers.length}</strong>
            </article>
            <article className={styles.statCard}>
              <span className={styles.statLabel}>Origen</span>
              <strong className={styles.statValue}>BD</strong>
            </article>
          </div>
        </section>

        {isLoading ? <div className={styles.feedback}>Cargando catalogo real...</div> : null}
        {errorMessage ? <div className={styles.feedback}>{errorMessage}</div> : null}

        {!isLoading && !errorMessage ? (
          <>
            <section id="bouquets" className={styles.section}>
              <div className={styles.sectionHeader}>
                <div>
                  <span className={styles.eyebrow}>Bouquets</span>
                  <h2 className={styles.sectionTitle}>Envolturas y bouquets base</h2>
                </div>
                <p className={styles.sectionNote}>Cada bouquet aqui usa la configuracion visual real guardada desde el administrador.</p>
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
                <div>
                  <span className={styles.eyebrow}>Flores</span>
                  <h2 className={styles.sectionTitle}>Catalogo floral activo</h2>
                </div>
                <p className={styles.sectionNote}>Estas flores alimentan directamente el editor de Hazlo tu mismo.</p>
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
      </main>
    </div>
  )
}
