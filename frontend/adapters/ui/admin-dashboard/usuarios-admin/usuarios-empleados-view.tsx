'use client'

import type { FormEvent } from 'react'
import { useEffect, useRef, useState } from 'react'
import type { AdminUserItem, AdminUserListResponse } from '@/domain/entities/usuarios-admin'
import { usuariosAdminAdapter } from '@/adapters/api/usuarios-admin-adapter'
import { EmployeeAssignmentForm } from './components/employee-assignment-form'
import { UsuariosResultsPanel } from './components/usuarios-results-panel'
import { UsuariosToolbar } from './components/usuarios-toolbar'
import styles from './usuarios-admin-shell.module.css'
import {
  createEmptyEmployeeAssignmentFormState,
  defaultFilterState,
  employeeAssignmentFormStateToPayload,
  mapUserToEmployeeAssignmentFormState,
  toggleEntityState,
  type EmployeeAssignmentFormState,
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

export function UsuariosEmpleadosView() {
  const [filters, setFilters] = useState<UserFilterState>(defaultFilterState)
  const [draftQuery, setDraftQuery] = useState('')
  const [data, setData] = useState<AdminUserListResponse>(emptyResponse)
  const [selectedUser, setSelectedUser] = useState<AdminUserItem | null>(null)
  const [formState, setFormState] = useState<EmployeeAssignmentFormState>(createEmptyEmployeeAssignmentFormState())
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

    const loadEmployees = async () => {
      setIsLoading(true)

      try {
        const response = await usuariosAdminAdapter.fetchEmployees({
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
            setFormState(mapUserToEmployeeAssignmentFormState(refreshedUser))
          } else {
            setSelectedUser(null)
            setFormState(createEmptyEmployeeAssignmentFormState())
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

    void loadEmployees()

    return () => {
      isCancelled = true
    }
  }, [filters])

  const handleSelectUser = (user: AdminUserItem) => {
    setSelectedUser(user)
    setFormState(mapUserToEmployeeAssignmentFormState(user))
    setFeedbackMessage(null)
    setErrorMessage(null)
  }

  const handleReset = () => {
    setSelectedUser(null)
    setFormState(createEmptyEmployeeAssignmentFormState())
    setFeedbackMessage(null)
    setErrorMessage(null)
  }

  const handleFieldChange = (field: keyof EmployeeAssignmentFormState, value: string) => {
    setFormState((currentState) => ({
      ...currentState,
      [field]: value,
    }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!selectedUser) {
      setErrorMessage('Selecciona un empleado real antes de guardar cambios.')
      return
    }

    setIsSaving(true)
    setFeedbackMessage(null)
    setErrorMessage(null)

    try {
      const savedUser = await usuariosAdminAdapter.updateEmployee(
        selectedUser.id,
        employeeAssignmentFormStateToPayload(formState),
      )

      setSelectedUser(savedUser)
      setFormState(mapUserToEmployeeAssignmentFormState(savedUser))
      setFeedbackMessage('Empleado actualizado correctamente.')
      setFilters((currentState) => ({ ...currentState }))
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
        ? await usuariosAdminAdapter.deleteEmployee(user.id)
        : await usuariosAdminAdapter.updateEmployee(user.id, { estado: toggleEntityState(user.estado) })

      if (selectedUser?.id === user.id) {
        setSelectedUser(updatedUser)
        setFormState(mapUserToEmployeeAssignmentFormState(updatedUser))
      }

      setFeedbackMessage(isActive ? 'Empleado desactivado logicamente.' : 'Empleado reactivado correctamente.')
      setFilters((currentState) => ({ ...currentState }))
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    } finally {
      setIsSaving(false)
    }
  }

  const activeEmployees = data.items.filter((user) => user.estado.trim().toLowerCase() === 'activo').length
  const inactiveEmployees = data.items.filter((user) => user.estado.trim().toLowerCase() !== 'activo').length

  return (
    <div className={styles.shell}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <span className={styles.eyebrow}>Usuarios y roles / operacion interna</span>
          <h2 className={styles.title}>Empleados</h2>
          <p className={styles.description}>
            Filtra y mantiene al personal operativo real por nombre, CI o correo, con asignacion editable de cargo, turno y horarios.
          </p>
        </div>

        <div className={styles.metricsGrid}>
          <article className={styles.metricCard}>
            <span className={styles.metricLabel}>Total empleados</span>
            <strong className={styles.metricValue}>{data.pagination.totalItems}</strong>
          </article>
          <article className={styles.metricCard}>
            <span className={styles.metricLabel}>Activos en pagina</span>
            <strong className={styles.metricValue}>{activeEmployees}</strong>
          </article>
          <article className={styles.metricCard}>
            <span className={styles.metricLabel}>Inactivos en pagina</span>
            <strong className={styles.metricValue}>{inactiveEmployees}</strong>
          </article>
        </div>
      </section>

      <UsuariosToolbar
        title="Control de empleados"
        description="La lista responde a busqueda por nombre, CI o correo, orden alfabetico y paginacion real de hasta 10 registros por pagina."
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
          title="Lista de empleados"
          items={data.items}
          selectedUserId={selectedUser?.id ?? null}
          pagination={data.pagination}
          isLoading={isLoading}
          isMutating={isSaving}
          emptyMessage="No hay empleados que coincidan con los filtros actuales."
          onSelectUser={handleSelectUser}
          onToggleState={handleToggleState}
          onPageChange={(page) => setFilters((currentState) => ({ ...currentState, page }))}
        />

        <EmployeeAssignmentForm
          selectedUser={selectedUser}
          formState={formState}
          isSaving={isSaving}
          onFieldChange={handleFieldChange}
          onSubmit={handleSubmit}
          onReset={handleReset}
        />
      </div>
    </div>
  )
}
