import { User } from '@/domain/entities/user'

export interface AuthService {
  login(correo: string, password: string): Promise<User>
  register(form: Record<string, string>): Promise<User>
  logout(): Promise<void>
  getCurrentUser(): Promise<User>
}