import { defineStore } from 'pinia'
import axios from 'axios'
import api from '@/plugins/axios'
import router from '@/router'

type JwtPayload = {
  sub?: string
  exp?: number
  role?: string
}

const STORAGE_KEY = 'jwt_token'

function decodeJwt(token: string | null): JwtPayload | null {
  if (!token) return null
  try {
    const base64 = token.split('.')[1]
    if (!base64) return null
    return JSON.parse(atob(base64))
  } catch {
    return null
  }
}

function isTokenExpired(token: string | null): boolean {
  const payload = decodeJwt(token)
  if (!payload?.exp) return true
  return Date.now() >= payload.exp * 1000
}

export const useAuthStore = defineStore('authStore', {
  state: () => ({
    token: sessionStorage.getItem(STORAGE_KEY) as string | null,
    isAuthenticated: false,
    username: sessionStorage.getItem('username') as string | null,
    role: sessionStorage.getItem('role') as string | null,
  }),

  getters: {
    isAdmin: (state) => state.role === 'ADMIN',
    isUser: (state) => state.role === 'USER',
  },

  actions: {
    init() {
      if (this.token && !isTokenExpired(this.token)) {
        this.isAuthenticated = true
        axios.defaults.headers.common.Authorization = `Bearer ${this.token}`

        const payload = decodeJwt(this.token)
        if (payload?.exp) {
          scheduleAutoLogout(payload.exp, () => this.logout())
        }
      } else {
        this.logout(false)
      }
    },

    async login(credentials: { email: string; password: string }) {
      const res = await api.post('api/auth/login', credentials)

      this.token = res.data.token
      this.username = res.data.username
      this.role = res.data.role
      this.isAuthenticated = true

      sessionStorage.setItem(STORAGE_KEY, res.data.token)
      sessionStorage.setItem('username', res.data.username)
      sessionStorage.setItem('role', res.data.role)

      axios.defaults.headers.common.Authorization = `Bearer ${res.data.token}`

      const payload = decodeJwt(res.data.token)
      if (payload?.exp) {
        scheduleAutoLogout(payload.exp, () => this.logout())
      }
    },

    logout(redirect = true) {
      this.token = null
      this.username = null
      this.role = null
      this.isAuthenticated = false

      sessionStorage.clear()
      delete axios.defaults.headers.common.Authorization

      logoutTimer && clearTimeout(logoutTimer)
      logoutTimer = null

      if (redirect) router.push({ name: 'home' })
    },
  },
})

let logoutTimer: ReturnType<typeof setTimeout> | null = null

function scheduleAutoLogout(exp: number, logout: () => void) {
  const expiresInMs = exp * 1000 - Date.now()

  if (expiresInMs <= 0) {
    logout()
    return
  }

  logoutTimer && clearTimeout(logoutTimer)
  logoutTimer = setTimeout(() => {
    logout()
  }, expiresInMs)
}
