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
    payload: null as JwtPayload | null,
    isAuthenticated: false,
    storedUsername: sessionStorage.getItem('username') as string | null,
  }),
  getters: {
    role: (state) => state.payload?.role ?? null,
    username: (state) => state.storedUsername ?? state.payload?.sub ?? null,
    isTokenExpired: (state) => isTokenExpired(state.token),
  },
  actions: {
    init() {
      if (this.token && !isTokenExpired(this.token)) {
        this.payload = decodeJwt(this.token)
        this.isAuthenticated = true
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
        if (this.payload?.exp) {
          scheduleAutoLogout(this.payload.exp, () => this.logout())
        } else {
          this.logout(false)
        }
      } else {
        this.logout(false)
      }
    },
    setToken(token: string) {
      this.token = token
      this.payload = decodeJwt(token)
      this.isAuthenticated = true

      sessionStorage.setItem(STORAGE_KEY, token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

      if (this.payload?.exp) {
        scheduleAutoLogout(this.payload.exp, this.logout)
      }
    },
    async login(credentials: { email: string; password: string }) {
      const res = await api.post('api/auth/login', credentials)
      const token = res.data.token
      this.setToken(token)
      if (res.data.username) {
        this.storedUsername = res.data.username
        sessionStorage.setItem('username', res.data.username)
      }
    },
    logout(redirect = true) {
      this.token = null
      this.payload = null
      this.isAuthenticated = false
      this.storedUsername = null
      sessionStorage.removeItem(STORAGE_KEY)
      sessionStorage.removeItem('username')
      delete axios.defaults.headers.common['Authorization']
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
