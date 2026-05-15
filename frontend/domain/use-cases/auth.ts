import { AuthService } from '@/domain/ports/auth-service'
import { User } from '@/domain/entities/user'

export function createAuthUseCases(auth: AuthService) {
  return {
    login: (correo: string, password: string): Promise<User> =>
      auth.login(correo, password),

    register: (form: Record<string, string>): Promise<User> =>
      auth.register(form),

    logout: (): Promise<void> =>
      auth.logout(),

    getCurrentUser: (): Promise<User> =>
      auth.getCurrentUser(),
  }
}

export type AuthUseCases = ReturnType<typeof createAuthUseCases>