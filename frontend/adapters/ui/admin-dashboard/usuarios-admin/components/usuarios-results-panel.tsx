'use client'

import type { AdminPagination, AdminUserItem } from '@/domain/entities/usuarios-admin'
import styles from './usuarios-results-panel.module.css'

interface UsuariosResultsPanelProps {
  title: string
  items: AdminUserItem[]
  selectedUserId: number | null
  pagination: AdminPagination
  isLoading: boolean
  isMutating: boolean
  emptyMessage: string
  onSelectUser: (user: AdminUserItem) => void
  onToggleState: (user: AdminUserItem) => void
  onPageChange: (page: number) => void
  currentUserId?: number
}

function getStateLabel(state: string): string {
  return state.trim().toLowerCase() === 'activo' ? 'Activo' : 'Inactivo'
}

function getInitials(user: AdminUserItem): string {
  const rawName = user.nombreCompleto || [user.nombre, user.apellidoPaterno].filter(Boolean).join(' ')
  const parts = rawName.split(' ').map((part) => part.trim()).filter(Boolean)

  if (parts.length === 0) {
    return 'US'
  }

  return parts.slice(0, 2).map((part) => part[0]?.toUpperCase() ?? '').join('')
}

function getRoleLabel(role: string): string {
  return role ? `${role.charAt(0).toUpperCase()}${role.slice(1)}` : 'Usuario'
}

export function UsuariosResultsPanel({
  title,
  items,
  selectedUserId,
  pagination,
  isLoading,
  isMutating,
  emptyMessage,
  onSelectUser,
  onToggleState,
  onPageChange,
  currentUserId,
}: UsuariosResultsPanelProps) {
  return (
    <section className={styles.panel}>
      <div className={styles.header}>
        <div>
          <span className={styles.eyebrow}>Resultados</span>
          <h3 className={styles.title}>{title}</h3>
        </div>
        <div className={styles.headerMeta}>
          {isLoading ? <span className={styles.loadingBadge}>Sincronizando</span> : null}
          <span className={styles.counter}>Pagina {pagination.page} de {Math.max(pagination.totalPages, 1)}</span>
        </div>
      </div>

      {isLoading && items.length === 0 ? (
        <div className={styles.emptyState}>Cargando registros reales...</div>
      ) : items.length === 0 ? (
        <div className={styles.emptyState}>{emptyMessage}</div>
      ) : (
        <div className={styles.cardList}>
          {items.map((user, index) => {
            const isSelected = selectedUserId === user.id
            const isActive = user.estado.trim().toLowerCase() === 'activo'
            const displayName = user.nombreCompleto || user.nombre || 'Usuario sin nombre'
            const isSelf = currentUserId !== undefined && user.id === currentUserId

            return (
              <article
                key={user.id}
                className={`${styles.card} ${isSelected ? styles.cardActive : ''}`}
                style={{ animationDelay: `${index * 45}ms` }}
              >
                <button
                  type="button"
                  className={styles.cardMain}
                  onClick={() => onSelectUser(user)}
                  aria-pressed={isSelected}
                  aria-label={`Seleccionar a ${displayName}`}
                >
                  <div className={styles.cardLeading}>
                    <span className={styles.avatar}>{getInitials(user)}</span>

                    <div className={styles.cardBody}>
                      <div className={styles.cardHeader}>
                        <div className={styles.identityBlock}>
                          <strong>{displayName}</strong>
                          <p>{user.correo || 'Sin correo registrado'}</p>
                        </div>

                        <div className={styles.badgeCluster}>
                          {isSelf ? <span className={styles.selfBadge}>Tu cuenta</span> : null}
                          {isSelected ? <span className={styles.selectedBadge}>Seleccionado</span> : null}
                          <span className={`${styles.stateBadge} ${isActive ? styles.stateBadgeActive : styles.stateBadgeInactive}`}>
                            {getStateLabel(user.estado)}
                          </span>
                        </div>
                      </div>

                      <div className={styles.metaRow}>
                        <span className={styles.roleChip}>{getRoleLabel(user.rol)}</span>
                        <span>{user.ci || 'Sin CI'}</span>
                        <span>{user.telefono || 'Sin telefono'}</span>
                      </div>
                    </div>
                  </div>
                </button>

                <div className={styles.actionRow}>
                  <button
                    type="button"
                    className={styles.iconButtonPrimary}
                    onClick={() => onSelectUser(user)}
                    aria-label={`Editar a ${displayName}`}
                    title="Editar"
                  >
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M4 20h4l10-10-4-4L4 16v4Z" />
                      <path d="m13 7 4 4" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className={`${isActive ? styles.iconButtonDanger : styles.iconButtonSuccess}`}
                    onClick={() => onToggleState(user)}
                    disabled={isMutating || isSelf}
                    aria-label={isActive ? `Desactivar a ${displayName}` : `Activar a ${displayName}`}
                    title={isSelf ? 'No puedes desactivarte a ti mismo' : (isActive ? 'Desactivar' : 'Activar')}
                  >
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M12 3v8" />
                      <path d="M7.05 5.05a8 8 0 1 0 9.9 0" />
                    </svg>
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      )}

      <div className={styles.paginationRow}>
        <button
          type="button"
          className={styles.paginationButton}
          onClick={() => onPageChange(pagination.page - 1)}
          disabled={!pagination.hasPrevious || isLoading}
        >
          Anterior
        </button>
        <span className={styles.pageInfo}>{pagination.page} / {Math.max(pagination.totalPages, 1)}</span>
        <button
          type="button"
          className={styles.paginationButton}
          onClick={() => onPageChange(pagination.page + 1)}
          disabled={!pagination.hasNext || isLoading}
        >
          Siguiente
        </button>
      </div>
    </section>
  )
}
