'use client'

import type { FormEvent } from 'react'
import { useEffect, useRef, useState } from 'react'
import type { AdminUserItem, AdminUserListResponse } from '@/domain/entities/usuarios-admin'
import { usuariosAdminAdapter } from '@/adapters/api/usuarios-admin-adapter'
import { UsuarioGeneralForm } from './components/usuario-general-form'
import { UsuariosResultsPanel } from './components/usuarios-results-panel'
import { UsuariosToolbar } from './components/usuarios-toolbar'
import styles from './usuarios-admin-shell.module.css'
import {
  createEmptyGeneralUserFormState,
  defaultFilterState,
  generalUserFormStateToPayload,
  mapUserToGeneralUserFormState,
  toggleEntityState,
  type GeneralUserFormState,
  type UserFilterState,
} from './usuarios-admin.utils'

const emptyResponse: AdminUserListResponse = {
  items: [],
  pagination: {
    page: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
    hasNext: false,
    hasPrevious: false,
  },
  filters: {
    query: '',
    letter: '',
    sort: 'asc',
    availableLetters: [],
  },
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message
  }

  return 'No se pudo completar la operacion con datos reales.'
}

export function UsuariosGeneralView() {
  const [filters, setFilters] = useState<UserFilterState>(defaultFilterState)
  const [draftQuery, setDraftQuery] = useState('')
  const [data, setData] = useState<AdminUserListResponse>(emptyResponse)
  const [selectedUser, setSelectedUser] = useState<AdminUserItem | null>(null)
  const [formState, setFormState] = useState<GeneralUserFormState>(createEmptyGeneralUserFormState())
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const selectedUserIdRef = useRef<number | null>(null)

  useEffect(() => {
    selectedUserIdRef.current = selectedUser?.id ?? null
  }, [selectedUser])

  useEffect(() => {
    let isCancelled = false

    const loadUsers = async () => {
      setIsLoading(true)

      try {
        const response = await usuariosAdminAdapter.fetchUsers({
          q: filters.query,
          letter: filters.letter,
          sort: filters.sort,
          page: filters.page,
        })

        if (isCancelled) {
          return
        }

        setData(response)
        setDraftQuery(response.filters.query)
        setErrorMessage(null)

        if (selectedUserIdRef.current !== null) {
          const refreshedUser = response.items.find((user) => user.id === selectedUserIdRef.current)

          if (refreshedUser) {
            setSelectedUser(refreshedUser)
            setFormState(mapUserToGeneralUserFormState(refreshedUser))
          } else {
            setSelectedUser(null)
            setFormState(createEmptyGeneralUserFormState())
          }
        }
      } catch (error) {
        if (!isCancelled) {
          setErrorMessage(getErrorMessage(error))
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false)
        }
      }
    }

    void loadUsers()

    return () => {
      isCancelled = true
    }
  }, [filters])

  const handleFieldChange = (field: keyof GeneralUserFormState, value: string) => {
    setFormState((currentState) => ({
      ...currentState,
      [field]: value,
    }))
  }

  const handleSelectUser = (user: AdminUserItem) => {
    setSelectedUser(user)
    setFormState(mapUserToGeneralUserFormState(user))
    setFeedbackMessage(null)
    setErrorMessage(null)
  }

  const handleReset = () => {
    setSelectedUser(null)
    setFormState(createEmptyGeneralUserFormState())
    setFeedbackMessage(null)
    setErrorMessage(null)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSaving(true)
    setFeedbackMessage(null)
    setErrorMessage(null)

    try {
      const payload = generalUserFormStateToPayload(formState)
      const savedUser = selectedUser
        ? await usuariosAdminAdapter.updateUser(selectedUser.id, payload)
        : await usuariosAdminAdapter.createUser(payload)

      setSelectedUser(savedUser)
      setFormState(mapUserToGeneralUserFormState(savedUser))
      setFeedbackMessage(selectedUser ? 'Usuario actualizado correctamente.' : 'Usuario creado correctamente.')
      setFilters((currentState) => ({ ...currentState, page: 1 }))
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    } finally {
      setIsSaving(false)
    }
  }

  const handleToggleState = async (user: AdminUserItem) => {
    setIsSaving(true)
    setFeedbackMessage(null)
    setErrorMessage(null)

    try {
      const isActive = user.estado.trim().toLowerCase() === 'activo'
      const updatedUser = isActive
        ? await usuariosAdminAdapter.deleteUser(user.id)
        : await usuariosAdminAdapter.updateUser(user.id, { estado: toggleEntityState(user.estado) })

      if (selectedUser?.id === user.id) {
        setSelectedUser(updatedUser)
        setFormState(mapUserToGeneralUserFormState(updatedUser))
      }

      setFeedbackMessage(isActive ? 'Usuario desactivado logicamente.' : 'Usuario reactivado correctamente.')
      setFilters((currentState) => ({ ...currentState }))
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    } finally {
      setIsSaving(false)
    }
  }

  const activeUsers = data.items.filter((user) => user.estado.trim().toLowerCase() === 'activo').length
  const currentRoles = new Set(data.items.map((user) => user.rol)).size

  return (
    <div className={styles.shell}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <span className={styles.eyebrow}>Usuarios y roles / gestion real</span>
          <h2 className={styles.title}>Usuarios en general</h2>
          <p className={styles.description}>
            Administra usuarios base, clientes, empleados y administradores con datos reales, sin tarjetas inventadas ni contadores simulados.
          </p>
        </div>

        <div className={styles.metricsGrid}>
          <article className={styles.metricCard}>
            <span className={styles.metricLabel}>Total registrado</span>
            <strong className={styles.metricValue}>{data.pagination.totalItems}</strong>
          </article>
          <article className={styles.metricCard}>
            <span className={styles.metricLabel}>Activos en pagina</span>
            <strong className={styles.metricValue}>{activeUsers}</strong>
          </article>
          <article className={styles.metricCard}>
            <span className={styles.metricLabel}>Roles visibles</span>
            <strong className={styles.metricValue}>{currentRoles}</strong>
          </article>
        </div>
      </section>

      <UsuariosToolbar
        title="Control de usuarios"
        description="Busca por nombre, CI o correo, filtra por inicial y ordena alfabeticamente con paginacion maxima de 10 registros por pagina."
        draftQuery={draftQuery}
        sort={filters.sort}
        activeLetter={filters.letter}
        availableLetters={data.filters.availableLetters}
        totalItems={data.pagination.totalItems}
        onDraftQueryChange={setDraftQuery}
        onApplySearch={() => setFilters((currentState) => ({ ...currentState, query: draftQuery.trim(), page: 1 }))}
        onLetterChange={(letter) => setFilters((currentState) => ({
          ...currentState,
          letter: currentState.letter === letter ? '' : letter,
          page: 1,
        }))}
        onSortChange={(sort) => setFilters((currentState) => ({ ...currentState, sort, page: 1 }))}
      />

      {feedbackMessage ? <div className={styles.feedbackSuccess}>{feedbackMessage}</div> : null}
      {errorMessage ? <div className={styles.feedbackError}>{errorMessage}</div> : null}

      <div className={styles.workspace}>
        <UsuariosResultsPanel
          title="Lista de usuarios"
          items={data.items}
          selectedUserId={selectedUser?.id ?? null}
          pagination={data.pagination}
          isLoading={isLoading}
          isMutating={isSaving}
          emptyMessage="No hay usuarios que coincidan con los filtros actuales."
          onSelectUser={handleSelectUser}
          onToggleState={handleToggleState}
          onPageChange={(page) => setFilters((currentState) => ({ ...currentState, page }))}
        />

        <UsuarioGeneralForm
          formState={formState}
          isSaving={isSaving}
          isEditing={Boolean(selectedUser)}
          onFieldChange={handleFieldChange}
          onSubmit={handleSubmit}
          onReset={handleReset}
        />
      </div>
    </div>
  )
}
