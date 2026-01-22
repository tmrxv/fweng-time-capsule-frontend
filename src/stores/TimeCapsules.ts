import { defineStore } from 'pinia'
import api from '@/plugins/axios'
import { useErrorStore } from './error'
import type { TimeCapsulePostResponse, TimeCapsulePostRequest } from '@/types/TimeCapsule'

export const useTimeCapsuleStore = defineStore('timeCapsuleStore', {
  state: () => ({
    capsules: [] as TimeCapsulePostResponse[],
    loading: false,
    selectedCapsule: null as TimeCapsulePostResponse | null,
  }),

  actions: {
    async fetchAllCapsules() {
      this.loading = true
      try {
        const response = await api.get('/api/posts')
        this.capsules = response.data.content
      } catch (error: any) {
        const errorStore = useErrorStore()
        const message = error.response?.data?.message || 'Failed to fetch time capsules'
        errorStore.triggerError(message)
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchCapsuleById(id: number) {
      this.loading = true
      try {
        const response = await api.get(`/api/posts/${id}`)
        this.selectedCapsule = response.data
        return response.data
      } catch (error: any) {
        const errorStore = useErrorStore()
        const message = error.response?.data?.message || 'Failed to fetch time capsule'
        errorStore.triggerError(message)
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchUserCapsules(userId: number) {
      this.loading = true
      try {
        const response = await api.get('/api/posts', {
          params: { userId },
        })
        this.capsules = response.data.content
      } catch (error: any) {
        const errorStore = useErrorStore()
        const message = error.response?.data?.message || 'Failed to fetch your time capsules'
        errorStore.triggerError(message)
        throw error
      } finally {
        this.loading = false
      }
    },

    async createCapsule(data: TimeCapsulePostRequest) {
      this.loading = true
      try {
        const response = await api.post('/api/posts', data)
        this.capsules.push(response.data)
        return response.data
      } catch (error: any) {
        const errorStore = useErrorStore()
        const message = error.response?.data?.message || 'Failed to create time capsule'
        errorStore.triggerError(message)
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateCapsule(id: number, data: Partial<TimeCapsulePostRequest>) {
      this.loading = true
      try {
        const response = await api.put(`/api/posts/${id}`, data)
        const index = this.capsules.findIndex((c) => c.id === id)
        if (index !== -1) {
          this.capsules[index] = response.data
        }
        if (this.selectedCapsule?.id === id) {
          this.selectedCapsule = response.data
        }
        return response.data
      } catch (error: any) {
        const errorStore = useErrorStore()
        const message = error.response?.data?.message || 'Failed to update time capsule'
        errorStore.triggerError(message)
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteCapsule(id: number) {
      this.loading = true
      try {
        await api.delete(`/api/posts/${id}`)
        this.capsules = this.capsules.filter((c) => c.id !== id)
        if (this.selectedCapsule?.id === id) {
          this.selectedCapsule = null
        }
      } catch (error: any) {
        const errorStore = useErrorStore()
        const message = error.response?.data?.message || 'Failed to delete time capsule'
        errorStore.triggerError(message)
        throw error
      } finally {
        this.loading = false
      }
    },

    clearSelectedCapsule() {
      this.selectedCapsule = null
    },
  },
})
