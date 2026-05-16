'use client'

import type { AdminSidebarGroup, DashboardIcon } from '../admin-dashboard.types'
import styles from './admin-sidebar.module.css'

interface AdminSidebarProps {
  userName: string
  userEmail: string
  groups: AdminSidebarGroup[]
  activeItemId: string
  isOpen: boolean
  onSelect: (viewId: string) => void
  onClose: () => void
  onLogout: () => void
}

function SidebarIcon({ icon }: { icon: DashboardIcon }) {
  switch (icon) {
    case 'users':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
          <path d="M9.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      )

    case 'store':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M3 9.5 4.5 4h15L21 9.5" />
          <path d="M4 10h16v10a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V10Z" />
          <path d="M9 21v-6h6v6" />
          <path d="M3 9.5a3 3 0 0 0 6 0" />
          <path d="M9 9.5a3 3 0 0 0 6 0" />
          <path d="M15 9.5a3 3 0 0 0 6 0" />
        </svg>
      )

    case 'box':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" />
          <path d="M12 12 4 7.5" />
          <path d="M12 12l8-4.5" />
          <path d="M12 12v9" />
        </svg>
      )

    case 'sparkles':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" />
          <path d="M19 3v4" />
          <path d="M21 5h-4" />
          <path d="M5 17v4" />
          <path d="M7 19H3" />
        </svg>
      )

    case 'credit-card':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="2.5" y="5" width="19" height="14" rx="3" />
          <path d="M2.5 10h19" />
          <path d="M7 15h4" />
        </svg>
      )

    case 'truck':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M3 6h11v9H3Z" />
          <path d="M14 9h3l4 4v2h-7" />
          <path d="M7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
          <path d="M18 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
        </svg>
      )

    case 'home':
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M3 10.5 12 3l9 7.5" />
          <path d="M5 9.5V21h14V9.5" />
          <path d="M10 21v-6h4v6" />
        </svg>
      )
  }
}

export function AdminSidebar({
  userName,
  userEmail,
  groups,
  activeItemId,
  isOpen,
  onSelect,
  onClose,
  onLogout,
}: AdminSidebarProps) {
  const handleSelect = (viewId: string) => {
    onSelect(viewId)

    if (typeof window !== 'undefined' && window.innerWidth < 960) {
      onClose()
    }
  }

  return (
    <>
      <button
        type="button"
        className={`${styles.backdrop} ${isOpen ? styles.backdropVisible : ''}`}
        onClick={onClose}
        aria-label="Cerrar menu del dashboard"
      />

      <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.brandBlock}>
          <div>
            <span className={styles.brandName}>Alesli</span>
            <span className={styles.brandRole}>Administrador</span>
          </div>
          <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Cerrar menu lateral">
            <span className={styles.closeIcon}>×</span>
          </button>
        </div>

        <div className={styles.profileCard}>
          <span className={styles.profileEyebrow}>Sesion activa</span>
          <strong className={styles.profileName}>{userName}</strong>
          <span className={styles.profileEmail}>{userEmail}</span>
        </div>

        <div className={styles.groupStack}>
          {groups.map((group) => (
            <section key={group.id} className={styles.groupSection}>
              <span className={styles.groupTitle}>{group.title}</span>

              <div className={styles.itemList}>
                {group.items.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`${styles.navItem} ${activeItemId === item.viewId ? styles.navItemActive : ''}`}
                    onClick={() => handleSelect(item.viewId)}
                    aria-current={activeItemId === item.viewId ? 'page' : undefined}
                  >
                    <span className={styles.navBadge}>
                      <SidebarIcon icon={item.icon} />
                    </span>
                    <span className={styles.navCopy}>
                      <strong className={styles.navLabel}>{item.label}</strong>
                      <span className={styles.navNote}>{item.note}</span>
                    </span>
                  </button>
                ))}
              </div>
            </section>
          ))}
        </div>

        <button type="button" className={styles.logoutButton} onClick={onLogout}>
          Cerrar sesion
        </button>
      </aside>
    </>
  )
}