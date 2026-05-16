'use client'

import type { AdminUserItem } from '@/domain/entities/usuarios-admin'
import type { EmployeeAssignmentFormState } from '../usuarios-admin.utils'
import styles from './employee-assignment-form.module.css'

interface EmployeeAssignmentFormProps {
  selectedUser: AdminUserItem | null
  formState: EmployeeAssignmentFormState
  isSaving: boolean
  onFieldChange: (field: keyof EmployeeAssignmentFormState, value: string) => void
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  onReset: () => void
}

export function EmployeeAssignmentForm({
  selectedUser,
  formState,
  isSaving,
  onFieldChange,
  onSubmit,
  onReset,
}: EmployeeAssignmentFormProps) {
  return (
    <form className={styles.formShell} onSubmit={onSubmit}>
      <div className={styles.formHeader}>
        <div>
          <span className={styles.eyebrow}>Empleado seleccionado</span>
          <h3 className={styles.title}>{selectedUser ? selectedUser.nombreCompleto || selectedUser.nombre : 'Elige un empleado'}</h3>
        </div>
        <button type="button" className={styles.secondaryButton} onClick={onReset}>
          Limpiar seleccion
        </button>
      </div>

      {selectedUser ? (
        <div className={styles.formBody}>
          <div className={styles.summaryCard}>
            <div>
              <span className={styles.summaryLabel}>Correo</span>
              <strong>{selectedUser.correo || 'Sin correo'}</strong>
            </div>
            <div>
              <span className={styles.summaryLabel}>CI</span>
              <strong>{selectedUser.ci || 'Sin CI'}</strong>
            </div>
            <div>
              <span className={styles.summaryLabel}>Telefono</span>
              <strong>{selectedUser.telefono || 'Sin telefono'}</strong>
            </div>
          </div>

          <div>
            <span className={styles.sectionLabel}>Asignacion operativa</span>
            <div className={styles.grid}>
              <label className={styles.field}>
                <span className={styles.fieldLabel}>Cargo</span>
                <input className={styles.fieldInput} value={formState.cargo} onChange={(event) => onFieldChange('cargo', event.target.value)} />
              </label>
              <label className={styles.field}>
                <span className={styles.fieldLabel}>Horarios</span>
                <input className={styles.fieldInput} value={formState.horarios} onChange={(event) => onFieldChange('horarios', event.target.value)} />
              </label>
              <label className={styles.field}>
                <span className={styles.fieldLabel}>Turno</span>
                <input className={styles.fieldInput} value={formState.turno} onChange={(event) => onFieldChange('turno', event.target.value)} />
              </label>
              <label className={styles.field}>
                <span className={styles.fieldLabel}>Estado</span>
                <select className={styles.fieldSelect} value={formState.estado} onChange={(event) => onFieldChange('estado', event.target.value)}>
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
              </label>
            </div>
          </div>

          <div className={styles.actionRow}>
            <button type="submit" className={styles.primaryButton} disabled={isSaving}>
              {isSaving ? 'Guardando...' : 'Guardar asignacion'}
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.emptyState}>
          Selecciona un empleado desde la lista para editar horarios, cargo y turno con datos reales.
        </div>
      )}
    </form>
  )
}
