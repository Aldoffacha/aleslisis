import type {
  AdminEmployeeAssignmentInput,
  AdminUserInput,
  AdminUserItem,
  AdminUserListResponse,
  AdminUserQueryParams,
} from '@/domain/entities/usuarios-admin'
import { apiRequest } from '@/lib/http-client'

function buildQuery(params?: AdminUserQueryParams): string {
  const searchParams = new URLSearchParams()

  if (params?.q) {
    searchParams.set('q', params.q)
  }

  if (params?.letter) {
    searchParams.set('letter', params.letter)
  }

  if (params?.sort) {
    searchParams.set('sort', params.sort)
  }

  if (params?.page) {
    searchParams.set('page', String(params.page))
  }

  const query = searchParams.toString()
  return query ? `?${query}` : ''
}

export const usuariosAdminAdapter = {
  fetchUsers: (params?: AdminUserQueryParams) => apiRequest<AdminUserListResponse>(`/admin/usuarios/${buildQuery(params)}`, {
    apiPrefix: '/api/usuarios',
  }),

  createUser: (payload: AdminUserInput) => apiRequest<AdminUserItem>('/admin/usuarios/', {
    apiPrefix: '/api/usuarios',
    method: 'POST',
    body: payload,
  }),

  updateUser: (userId: number, payload: Partial<AdminUserInput>) => apiRequest<AdminUserItem>(`/admin/usuarios/${userId}/`, {
    apiPrefix: '/api/usuarios',
    method: 'PATCH',
    body: payload,
  }),

  deleteUser: (userId: number) => apiRequest<AdminUserItem>(`/admin/usuarios/${userId}/`, {
    apiPrefix: '/api/usuarios',
    method: 'DELETE',
  }),

  fetchEmployees: (params?: AdminUserQueryParams) => apiRequest<AdminUserListResponse>(`/admin/empleados/${buildQuery(params)}`, {
    apiPrefix: '/api/usuarios',
  }),

  updateEmployee: (userId: number, payload: AdminEmployeeAssignmentInput) => apiRequest<AdminUserItem>(`/admin/empleados/${userId}/`, {
    apiPrefix: '/api/usuarios',
    method: 'PATCH',
    body: payload,
  }),

  deleteEmployee: (userId: number) => apiRequest<AdminUserItem>(`/admin/empleados/${userId}/`, {
    apiPrefix: '/api/usuarios',
    method: 'DELETE',
  }),
}
