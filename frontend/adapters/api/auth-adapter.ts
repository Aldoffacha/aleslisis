import { AuthService } from '@/domain/ports/auth-service'
import { User } from '@/domain/entities/user'
import { httpRequest } from '@/lib/http-client'

export const djangoAuthAdapter: AuthService = {
  login: (correo: string, password: string) =>
    httpRequest<User>('/login/', { method: 'POST', body: { correo, password } }),

  register: (form: Record<string, string>) =>
    httpRequest<User>('/register/', { method: 'POST', body: form }),

  logout: async () => {
    await httpRequest<{ message: string }>('/logout/', { method: 'POST' })
  },

  getCurrentUser: () =>
    httpRequest<User>('/me/'),
}