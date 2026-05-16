export type AdminUserRole = 'cliente' | 'empleado' | 'administrador'
export type AdminSortOrder = 'asc' | 'desc'

export interface AdminUserClientData {
  nit: string
  ubicacion: string
  preferencias: string
  estado: string
}

export interface AdminUserEmployeeData {
  cargo: string
  horarios: string
  turno: string
  estado: string
}

export interface AdminUserAdministratorData {
  estado: string
}

export interface AdminUserItem {
  id: number
  nombre: string
  apellidoPaterno: string
  apellidoMaterno: string
  nombreCompleto: string
  ci: string
  telefono: string
  correo: string
  genero: string
  estado: string
  fechaNacimiento: string | null
  fechaCreacion: string | null
  rol: AdminUserRole
  cliente: AdminUserClientData | null
  empleado: AdminUserEmployeeData | null
  administrador: AdminUserAdministratorData | null
}

export interface AdminPagination {
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
  hasNext: boolean
  hasPrevious: boolean
}

export interface AdminListFilters {
  query: string
  letter: string
  sort: AdminSortOrder
  availableLetters: string[]
}

export interface AdminUserListResponse {
  items: AdminUserItem[]
  pagination: AdminPagination
  filters: AdminListFilters
}

export interface AdminUserQueryParams {
  q?: string
  letter?: string
  sort?: AdminSortOrder
  page?: number
}

export interface AdminUserInput {
  nombre: string
  apellido_paterno?: string
  apellido_materno?: string
  ci?: string
  telefono?: string
  correo: string
  password?: string
  genero?: string
  estado?: string
  fecha_de_nacimiento?: string | null
  rol: AdminUserRole
  nit?: string
  ubicacion?: string
  preferencias?: string
  cargo?: string
  horarios?: string
  turno?: string
}

export interface AdminEmployeeAssignmentInput {
  cargo?: string
  horarios?: string
  turno?: string
  estado?: string
}
