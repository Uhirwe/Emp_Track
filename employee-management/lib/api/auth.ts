import { LoginCredentials, AuthResponse, User } from '@/types/user'
import { cookies } from 'next/headers'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'
const TOKEN_COOKIE = 'auth_token'
const USER_COOKIE = 'user_data'

export const authService = {

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(credentials),
    })

    if (!response.ok) {
      throw new Error('Login failed')
    }

    const data = await response.json()
    
    // Set cookies using Next.js cookies API
    // const cookieStore = cookies()
    // ;(await cookieStore).set(TOKEN_COOKIE, data.token, {
    //   secure: process.env.NODE_ENV === 'production',
    //   sameSite: 'strict',
    //   maxAge: 60 * 60 * 24 * 7 // 7 days
    // })
    
    // ;(await cookieStore).set(USER_COOKIE, JSON.stringify(data.user), {
    //   secure: process.env.NODE_ENV === 'production',
    //   sameSite: 'strict',
    //   maxAge: 60 * 60 * 24 * 7
    // })
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", data.userId);

    return data
  },

  async logout(): Promise<void> {
    localStorage.clear();
  },

  async getToken(): Promise<string | undefined> {
    const cookieStore = await cookies()
    return cookieStore.get(TOKEN_COOKIE)?.value
  },

  async getUser(): Promise<User | null> {
    const cookieStore = await cookies()
    const userStr = cookieStore.get(USER_COOKIE)?.value
    return userStr ? JSON.parse(userStr) : null
  },

  isAuthenticated(): boolean {
    return !!this.getToken()
  },

  getAuthHeader(): Record<string, string> {
    const token = this.getToken()
    return token ? { Authorization: `Bearer ${token}` } : {}
  },

  async validateSession(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/validate`, {
        headers: this.getAuthHeader(),
        credentials: 'include'
      })
      return response.ok
    } catch (error) {
      return false
    }
  }
} 