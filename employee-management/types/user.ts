export interface User {
  id: number
  email: string
  firstName: string
  lastName: string
  role: 'ADMIN' | 'USER'
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  user: User
} 