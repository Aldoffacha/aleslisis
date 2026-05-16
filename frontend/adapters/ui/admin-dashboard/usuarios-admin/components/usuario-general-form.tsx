'use client'

import type { AdminUserRole } from '@/domain/entities/usuarios-admin'
import type { GeneralUserFormState } from '../usuarios-admin.utils'
import styles from './usuario-general-form.module.css'

interface UsuarioGeneralFormProps {
  formState: GeneralUserFormState
  isSaving: boolean
  isEditing: boolean
  onFieldChange: (field: keyof GeneralUserFormState, value: string) => void
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  onReset: () => void
}

const roleOptions: Array<{ value: AdminUserRole, label: string }> = [
  { value: 'cliente', label: 'Cliente' },
  { value: 'empleado', label: 'Empleado' },
  { value: 'administrador', label: 'Administrador' },
]

export function UsuarioGeneralForm({
  formState,
  isSaving,
  isEditing,
  onFieldChange,
  onSubmit,
  onReset,
}: UsuarioGeneralFormProps) {
  const showClientFields = formState.rol === 'cliente'
  const showEmployeeFields = formState.rol === 'empleado'

  return (
    <form className={styles.formShell} onSubmit={onSubmit}>
      <div className={styles.formHeader}>
        <div>
          <span className={styles.eyebrow}>Usuarios en general</span>
          <h3 className={styles.title}>{isEditing ? 'Editar usuario' : 'Nuevo usuario'}</h3>
        </div>
        <button type="button" className={styles.secondaryButton} onClick={onReset}>
          {isEditing ? 'Crear nuevo' : 'Limpiar'}
        </button>
      </div>

      <div className={styles.formBody}>
        <div className={styles.section}>
          <span className={styles.sectionLabel}>Rol</span>
          <div className={styles.roleRow}>
            {roleOptions.map((roleOption) => (
              <button
                key={roleOption.value}
                type="button"
                className={`${styles.roleButton} ${formState.rol === roleOption.value ? styles.roleButtonActive : ''}`}
                onClick={() => onFieldChange('rol', roleOption.value)}
              >
                {roleOption.label}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.sectionDivider} />

        <div className={styles.section}>
          <span className={styles.sectionLabel}>Datos personales</span>
          <div className={styles.grid}>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>Nombre</span>
              <input className={styles.fieldInput} value={formState.nombre} onChange={(event) => onFieldChange('nombre', event.target.value)} required />
            </label>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>Apellido paterno</span>
              <input className={styles.fieldInput} value={formState.apellidoPaterno} onChange={(event) => onFieldChange('apellidoPaterno', event.target.value)} />
            </label>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>Apellido materno</span>
              <input className={styles.fieldInput} value={formState.apellidoMaterno} onChange={(event) => onFieldChange('apellidoMaterno', event.target.value)} />
            </label>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>CI</span>
              <input className={styles.fieldInput} value={formState.ci} onChange={(event) => onFieldChange('ci', event.target.value)} />
            </label>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>Genero</span>
              <input className={styles.fieldInput} value={formState.genero} onChange={(event) => onFieldChange('genero', event.target.value)} />
            </label>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>Fecha de nacimiento</span>
              <input className={styles.fieldInput} type="date" value={formState.fechaNacimiento} onChange={(event) => onFieldChange('fechaNacimiento', event.target.value)} />
            </label>
          </div>
        </div>

        <div className={styles.sectionDivider} />

        <div className={styles.section}>
          <span className={styles.sectionLabel}>Contacto y acceso</span>
          <div className={styles.grid}>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>Correo</span>
              <input className={styles.fieldInput} type="email" value={formState.correo} onChange={(event) => onFieldChange('correo', event.target.value)} required />
            </label>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>Telefono</span>
              <input className={styles.fieldInput} value={formState.telefono} onChange={(event) => onFieldChange('telefono', event.target.value)} />
            </label>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>Estado</span>
              <select className={styles.fieldSelect} value={formState.estado} onChange={(event) => onFieldChange('estado', event.target.value)}>
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </label>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>{isEditing ? 'Nueva contraseña' : 'Contraseña'}</span>
              <input
                className={styles.fieldInput}
                type="password"
                value={formState.password}
                onChange={(event) => onFieldChange('password', event.target.value)}
                placeholder={isEditing ? 'Deja en blanco para conservarla' : 'Minimo 6 caracteres'}
                required={!isEditing}
              />
            </label>
          </div>
        </div>

        {showClientFields ? (
          <>
            <div className={styles.sectionDivider} />
            <div className={styles.section}>
              <span className={styles.sectionLabel}>Datos de cliente</span>
              <div className={styles.grid}>
                <label className={styles.field}>
                  <span className={styles.fieldLabel}>NIT</span>
                  <input className={styles.fieldInput} value={formState.nit} onChange={(event) => onFieldChange('nit', event.target.value)} />
                </label>
                <label className={styles.field}>
                  <span className={styles.fieldLabel}>Ubicacion</span>
                  <input className={styles.fieldInput} value={formState.ubicacion} onChange={(event) => onFieldChange('ubicacion', event.target.value)} />
                </label>
                <label className={`${styles.field} ${styles.fieldFull}`}>
                  <span className={styles.fieldLabel}>Preferencias</span>
                  <textarea className={styles.fieldTextarea} value={formState.preferencias} onChange={(event) => onFieldChange('preferencias', event.target.value)} rows={3} />
                </label>
              </div>
            </div>
          </>
        ) : null}

        {showEmployeeFields ? (
          <>
            <div className={styles.sectionDivider} />
            <div className={styles.section}>
              <span className={styles.sectionLabel}>Datos de empleado</span>
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
              </div>
            </div>
          </>
        ) : null}
      </div>

      <div className={styles.actionRow}>
        <button type="submit" className={styles.primaryButton} disabled={isSaving}>
          {isSaving ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear usuario'}
        </button>
      </div>
    </form>
  )
}
