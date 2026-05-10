import { AuthService } from '@/domain/ports/auth-service'
import { User } from '@/domain/entities/user'

export function createAuthUseCases(auth: AuthService) {
  return {
    login: (username: string, password: string): Promise<User> =>
      auth.login(username, password),

    register: (username: string, email: string, password: string): Promise<User> =>
      auth.register(username, email, password),

    logout: (): Promise<void> =>
      auth.logout(),

    getCurrentUser: (): Promise<User> =>
      auth.getCurrentUser(),
  }
}

export type AuthUseCases = ReturnType<typeof createAuthUseCases>
