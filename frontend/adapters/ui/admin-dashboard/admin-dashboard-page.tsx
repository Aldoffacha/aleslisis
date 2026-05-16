'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { User } from '@/domain/entities/user'
import { djangoAuthAdapter } from '@/adapters/api/auth-adapter'
import { createAuthUseCases } from '@/domain/use-cases/auth'
import {
  adminDashboardViews,
  adminDefaultViewId,
  adminSidebarGroups,
} from './admin-dashboard.data'
import { CatalogoPersonalizacionView } from './catalogo-personalizacion/catalogo-personalizacion-view'
import { UsuariosEmpleadosView } from './usuarios-admin/usuarios-empleados-view'
import { UsuariosGeneralView } from './usuarios-admin/usuarios-general-view'
import { AdminSidebar } from './components/admin-sidebar'
import styles from './admin-dashboard-page.module.css'

const auth = createAuthUseCases(djangoAuthAdapter)

const toneClassMap = {
  vino: styles.toneVino,
  oro: styles.toneOro,
  hoja: styles.toneHoja,
  grafito: styles.toneGrafito,
}

function resolveDashboardPath(role: string) {
  if (role === 'administrador') {
    return '/administrador/dashboard'
  }

  if (role === 'empleado') {
    return '/empleado/dashboard'
  }

  return '/cliente/dashboard'
}

export default function AdminDashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [activeViewId, setActiveViewId] = useState(adminDefaultViewId)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 959px)')

    const syncSidebar = () => {
      setIsSidebarOpen(!mediaQuery.matches)
    }

    syncSidebar()

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', syncSidebar)

      return () => {
        mediaQuery.removeEventListener('change', syncSidebar)
      }
    }

    mediaQuery.addListener(syncSidebar)

    return () => {
      mediaQuery.removeListener(syncSidebar)
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    window.dispatchEvent(new Event('alesli-rose-background-start'))

    auth.getCurrentUser()
      .then((currentUser) => {
        if (!isMounted) {
          return
        }

        if (currentUser.rol !== 'administrador') {
          router.replace(resolveDashboardPath(currentUser.rol))
          return
        }

        setUser(currentUser)
        setIsLoading(false)
      })
      .catch(() => {
        if (isMounted) {
          router.replace('/login')
        }
      })

    return () => {
      isMounted = false
    }
  }, [router])

  const handleLogout = async () => {
    await auth.logout()
    router.replace('/login')
  }

  const activeView = adminDashboardViews.find((view) => view.id === activeViewId) ?? adminDashboardViews[0]
  const customView = (() => {
    if (activeView.id === 'catalogo-personalizacion') {
      return <CatalogoPersonalizacionView />
    }

    if (activeView.id === 'usuarios-general') {
      return <UsuariosGeneralView />
    }

    if (activeView.id === 'usuarios-empleados') {
      return <UsuariosEmpleadosView />
    }

    return null
  })()

  if (isLoading || !user) {
    return (
      <div className={styles.pageShell}>
        <div className={styles.pageFrame}>
          <div className={styles.loadingCard}>
            <span className={styles.loadingEyebrow}>Cargando consola administrativa</span>
            <strong className={styles.loadingTitle}>Preparando metricas, modulos y actividad del negocio...</strong>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.pageShell}>
      <div className={styles.pageFrame}>
        <AdminSidebar
          userName={user.nombre}
          userEmail={user.correo}
          groups={adminSidebarGroups}
          activeItemId={activeView.id}
          isOpen={isSidebarOpen}
          onSelect={setActiveViewId}
          onClose={() => setIsSidebarOpen(false)}
          onLogout={handleLogout}
        />

        <main className={`${styles.mainColumn} ${isSidebarOpen ? styles.mainColumnShifted : ''}`}>
          <div className={`${styles.viewport} ${toneClassMap[activeView.accent]}`}>
            <header className={styles.topBar}>
              <button
                type="button"
                className={styles.menuButton}
                onClick={() => setIsSidebarOpen((currentValue) => !currentValue)}
                aria-label={isSidebarOpen ? 'Ocultar menu lateral' : 'Mostrar menu lateral'}
              >
                Menu
              </button>

              <div className={styles.topBarRail}>
                <span className={styles.topBarDot} />
                <span className={styles.topBarLine} />
              </div>
            </header>

            {customView ? (
              <section className={styles.workspaceSurface} aria-label={`Panel del modulo ${activeView.label}`}>
                {customView}
              </section>
            ) : (
              <section className={styles.workspaceCanvas} aria-label={`Panel del modulo ${activeView.label}`}>
                <div className={styles.primaryCanvas}>
                  <div className={styles.primaryGlow} />
                  <div className={styles.primaryFrame} />
                  <div className={styles.primaryDock}>
                    <span className={styles.blankChip} />
                    <span className={styles.blankChip} />
                    <span className={`${styles.blankChip} ${styles.blankChipWide}`} />
                  </div>
                </div>

                <section className={styles.cardDeck}>
                  {activeView.cards.map((card, index) => (
                    <article
                      key={card.id}
                      className={`${styles.moduleCard} ${toneClassMap[card.tone]}`}
                      aria-label={card.title}
                    >
                      <span className={styles.cardAccent} />

                      <div className={styles.cardCanvas}>
                        <div className={`${styles.canvasOrb} ${index % 2 === 0 ? styles.canvasOrbLarge : styles.canvasOrbSmall}`} />
                        <div className={styles.canvasShelf} />
                        <div className={styles.canvasBar} />
                        <div className={`${styles.canvasBar} ${styles.canvasBarShort}`} />
                      </div>
                    </article>
                  ))}
                </section>
              </section>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}