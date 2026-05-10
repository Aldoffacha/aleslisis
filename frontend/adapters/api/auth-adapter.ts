import { AuthService } from '@/domain/ports/auth-service'
import { User } from '@/domain/entities/user'
import { httpRequest } from '@/lib/http-client'

interface AuthResponse extends User {}

export const djangoAuthAdapter: AuthService = {
  login: (username: string, password: string) =>
    httpRequest<AuthResponse>('/login/', { method: 'POST', body: { username, password } }),

  register: (username: string, email: string, password: string) =>
    httpRequest<AuthResponse>('/register/', { method: 'POST', body: { username, email, password } }),

  logout: async () => {
    await httpRequest<{ message: string }>('/logout/', { method: 'POST' })
  },

  getCurrentUser: () =>
    httpRequest<User>('/me/'),
}
