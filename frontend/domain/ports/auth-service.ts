import { User } from '@/domain/entities/user'

export interface AuthService {
  login(username: string, password: string): Promise<User>
  register(username: string, email: string, password: string): Promise<User>
  logout(): Promise<void>
  getCurrentUser(): Promise<User>
}
