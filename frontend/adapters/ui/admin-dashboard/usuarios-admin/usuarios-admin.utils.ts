import type {
  AdminEmployeeAssignmentInput,
  AdminSortOrder,
  AdminUserInput,
  AdminUserItem,
  AdminUserRole,
} from '@/domain/entities/usuarios-admin'

export interface UserFilterState {
  query: string
  letter: string
  sort: AdminSortOrder
  page: number
}

export interface GeneralUserFormState {
  nombre: string
  apellidoPaterno: string
  apellidoMaterno: string
  ci: string
  telefono: string
  correo: string
  password: string
  genero: string
  estado: string
  fechaNacimiento: string
  rol: AdminUserRole
  nit: string
  ubicacion: string
  preferencias: string
  cargo: string
  horarios: string
  turno: string
}

export interface EmployeeAssignmentFormState {
  cargo: string
  horarios: string
  turno: string
  estado: string
}

export const defaultFilterState: UserFilterState = {
  query: '',
  letter: '',
  sort: 'asc',
  page: 1,
}

export function toggleEntityState(currentState: string): string {
  return currentState.trim().toLowerCase() === 'activo' ? 'inactivo' : 'activo'
}

export function createEmptyGeneralUserFormState(role: AdminUserRole = 'cliente'): GeneralUserFormState {
  return {
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    ci: '',
    telefono: '',
    correo: '',
    password: '',
    genero: '',
    estado: 'activo',
    fechaNacimiento: '',
    rol: role,
    nit: '',
    ubicacion: '',
    preferencias: '',
    cargo: '',
    horarios: '',
    turno: '',
  }
}

export function createEmptyEmployeeAssignmentFormState(): EmployeeAssignmentFormState {
  return {
    cargo: '',
    horarios: '',
    turno: '',
    estado: 'activo',
  }
}

export function mapUserToGeneralUserFormState(user: AdminUserItem): GeneralUserFormState {
  return {
    nombre: user.nombre,
    apellidoPaterno: user.apellidoPaterno,
    apellidoMaterno: user.apellidoMaterno,
    ci: user.ci,
    telefono: user.telefono,
    correo: user.correo,
    password: '',
    genero: user.genero,
    estado: user.estado || 'activo',
    fechaNacimiento: user.fechaNacimiento || '',
    rol: user.rol,
    nit: user.cliente?.nit || '',
    ubicacion: user.cliente?.ubicacion || '',
    preferencias: user.cliente?.preferencias || '',
    cargo: user.empleado?.cargo || '',
    horarios: user.empleado?.horarios || '',
    turno: user.empleado?.turno || '',
  }
}

export function mapUserToEmployeeAssignmentFormState(user: AdminUserItem): EmployeeAssignmentFormState {
  return {
    cargo: user.empleado?.cargo || '',
    horarios: user.empleado?.horarios || '',
    turno: user.empleado?.turno || '',
    estado: user.empleado?.estado || user.estado || 'activo',
  }
}

export function generalUserFormStateToPayload(formState: GeneralUserFormState): AdminUserInput {
  return {
    nombre: formState.nombre.trim(),
    apellido_paterno: formState.apellidoPaterno.trim(),
    apellido_materno: formState.apellidoMaterno.trim(),
    ci: formState.ci.trim(),
    telefono: formState.telefono.trim(),
    correo: formState.correo.trim(),
    password: formState.password.trim(),
    genero: formState.genero.trim(),
    estado: formState.estado,
    fecha_de_nacimiento: formState.fechaNacimiento || null,
    rol: formState.rol,
    nit: formState.nit.trim(),
    ubicacion: formState.ubicacion.trim(),
    preferencias: formState.preferencias.trim(),
    cargo: formState.cargo.trim(),
    horarios: formState.horarios.trim(),
    turno: formState.turno.trim(),
  }
}

export function employeeAssignmentFormStateToPayload(
  formState: EmployeeAssignmentFormState,
): AdminEmployeeAssignmentInput {
  return {
    cargo: formState.cargo.trim(),
    horarios: formState.horarios.trim(),
    turno: formState.turno.trim(),
    estado: formState.estado,
  }
}
