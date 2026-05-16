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

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <strong>Rol principal</strong>
          <span>Asigna el rol real segun tus tablas</span>
        </div>
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
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <strong>Datos personales</strong>
          <span>Nombre, apellidos, CI y fecha de nacimiento</span>
        </div>
        <div className={styles.grid}>
          <label className={styles.field}>
            <span>Nombre</span>
            <input value={formState.nombre} onChange={(event) => onFieldChange('nombre', event.target.value)} required />
          </label>
          <label className={styles.field}>
            <span>Apellido paterno</span>
            <input value={formState.apellidoPaterno} onChange={(event) => onFieldChange('apellidoPaterno', event.target.value)} />
          </label>
          <label className={styles.field}>
            <span>Apellido materno</span>
            <input value={formState.apellidoMaterno} onChange={(event) => onFieldChange('apellidoMaterno', event.target.value)} />
          </label>
          <label className={styles.field}>
            <span>CI</span>
            <input value={formState.ci} onChange={(event) => onFieldChange('ci', event.target.value)} />
          </label>
          <label className={styles.field}>
            <span>Genero</span>
            <input value={formState.genero} onChange={(event) => onFieldChange('genero', event.target.value)} />
          </label>
          <label className={styles.field}>
            <span>Fecha de nacimiento</span>
            <input type="date" value={formState.fechaNacimiento} onChange={(event) => onFieldChange('fechaNacimiento', event.target.value)} />
          </label>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <strong>Contacto y acceso</strong>
          <span>Correo, telefono, estado y contraseña</span>
        </div>
        <div className={styles.grid}>
          <label className={styles.field}>
            <span>Correo</span>
            <input type="email" value={formState.correo} onChange={(event) => onFieldChange('correo', event.target.value)} required />
          </label>
          <label className={styles.field}>
            <span>Telefono</span>
            <input value={formState.telefono} onChange={(event) => onFieldChange('telefono', event.target.value)} />
          </label>
          <label className={styles.field}>
            <span>Estado</span>
            <select value={formState.estado} onChange={(event) => onFieldChange('estado', event.target.value)}>
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </label>
          <label className={styles.field}>
            <span>{isEditing ? 'Nueva contraseña' : 'Contraseña'}</span>
            <input
              type="password"
              value={formState.password}
              onChange={(event) => onFieldChange('password', event.target.value)}
              placeholder={isEditing ? 'Deja en blanco para conservarla' : 'Minimo 6 caracteres'}
              required={!isEditing}
            />
          </label>
        </div>
      </section>

      {showClientFields ? (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <strong>Datos de cliente</strong>
            <span>Informacion propia de la tabla CLIENTE</span>
          </div>
          <div className={styles.grid}>
            <label className={styles.field}>
              <span>NIT</span>
              <input value={formState.nit} onChange={(event) => onFieldChange('nit', event.target.value)} />
            </label>
            <label className={styles.field}>
              <span>Ubicacion</span>
              <input value={formState.ubicacion} onChange={(event) => onFieldChange('ubicacion', event.target.value)} />
            </label>
            <label className={`${styles.field} ${styles.fieldFull}`}>
              <span>Preferencias</span>
              <textarea value={formState.preferencias} onChange={(event) => onFieldChange('preferencias', event.target.value)} rows={4} />
            </label>
          </div>
        </section>
      ) : null}

      {showEmployeeFields ? (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <strong>Datos iniciales de empleado</strong>
            <span>Tambien podras afinarlos desde la vista exclusiva de empleados</span>
          </div>
          <div className={styles.grid}>
            <label className={styles.field}>
              <span>Cargo</span>
              <input value={formState.cargo} onChange={(event) => onFieldChange('cargo', event.target.value)} />
            </label>
            <label className={styles.field}>
              <span>Horarios</span>
              <input value={formState.horarios} onChange={(event) => onFieldChange('horarios', event.target.value)} />
            </label>
            <label className={styles.field}>
              <span>Turno</span>
              <input value={formState.turno} onChange={(event) => onFieldChange('turno', event.target.value)} />
            </label>
          </div>
        </section>
      ) : null}

      <div className={styles.actionRow}>
        <button type="submit" className={styles.primaryButton} disabled={isSaving}>
          {isSaving ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear usuario'}
        </button>
      </div>
    </form>
  )
}
