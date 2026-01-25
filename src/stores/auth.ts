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
    token: localStorage.getItem(STORAGE_KEY) as string | null,
    isAuthenticated: false,
    username: localStorage.getItem('username') as string | null,
    role: localStorage.getItem('role') as string | null,
    id: localStorage.getItem('id') as string | null,
  }),

  actions: {
    init() {
      if (this.token && !isTokenExpired(this.token)) {
        this.isAuthenticated = true
        axios.defaults.headers.common.Authorization = `Bearer ${this.token}`

        const payload = decodeJwt(this.token)
        if (payload?.role) {
          this.role = payload.role
          localStorage.setItem('role', payload.role)
        }
        if (payload?.exp) {
          scheduleAutoLogout(payload.exp, () => this.logout())
        }
      } else {
        this.logout(false)
      }
    },

    async login(credentials: { identifier: string; password: string }) {
      const isEmail = /[^@\s]+@[^@\s]+\.[^@\s]+/.test(credentials.identifier)
      const loginPayload = isEmail
        ? { email: credentials.identifier, password: credentials.password }
        : { username: credentials.identifier, password: credentials.password }

      const res = await api.post('api/auth/login', loginPayload)

      this.token = res.data.token
      this.username = res.data.username
      this.role = res.data.role
      this.isAuthenticated = true

      // Prefer explicit id from response; fall back to JWT `sub` if absent
      const incomingId = res.data.id ?? decodeJwt(res.data.token)?.sub ?? null
      this.id = incomingId !== null ? String(incomingId) : null

      localStorage.setItem(STORAGE_KEY, res.data.token)
      if (this.username) localStorage.setItem('username', this.username)
      if (this.id) localStorage.setItem('id', String(this.id))
      if (this.role) localStorage.setItem('role', this.role)

      axios.defaults.headers.common.Authorization = `Bearer ${res.data.token}`

      const tokenPayload = decodeJwt(res.data.token)
      if (tokenPayload?.exp) {
        scheduleAutoLogout(tokenPayload.exp, () => this.logout())
      }
    },


    logout(redirect = true) {
      this.token = null
      this.username = null
      this.role = null
      this.id = null
      this.isAuthenticated = false

      // Remove only our keys from localStorage
      try {
        localStorage.removeItem(STORAGE_KEY)
        localStorage.removeItem('username')
        localStorage.removeItem('role')
        localStorage.removeItem('id')
      } catch {
        // noop
      }
      delete axios.defaults.headers.common.Authorization

      if (logoutTimer) {
        clearTimeout(logoutTimer)
        logoutTimer = null
      }

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

  if (logoutTimer) {
    clearTimeout(logoutTimer)
  }
  logoutTimer = setTimeout(() => {
    logout()
  }, expiresInMs)
}
