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
      } catch (error: unknown) {
        const errorStore = useErrorStore()
        const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to fetch time capsules'
        errorStore.triggerError(message)
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchPublicCapsules() {
      this.loading = true
      try {
        const response = await api.get('/api/posts/public')
        return response.data?.content ?? response.data ?? []
      } catch (error: unknown) {
        const errorStore = useErrorStore()
        const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to fetch public capsules'
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
      } catch (error: unknown) {
        const errorStore = useErrorStore()
        const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to fetch time capsule'
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
      } catch (error: unknown) {
        const errorStore = useErrorStore()
        const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to fetch your time capsules'
        errorStore.triggerError(message)
        throw error
      } finally {
        this.loading = false
      }
    },

    async createCapsule(data: TimeCapsulePostRequest) {
      this.loading = true
      try {
        // Step 1: Create capsule with JSON (backend requires @RequestBody)
        const { attachment, ...jsonPayload } = data
        const response = await api.post('/api/posts', jsonPayload)
        let created: TimeCapsulePostResponse = response.data
        this.capsules.push(created)

        // Step 2: If file selected, upload to /api/posts/{id}/upload as 'file'
        if (attachment && created.id) {
          try {
            const formData = new FormData()
            formData.append('file', attachment)
            const uploadRes = await api.post(`/api/posts/${created.id}/upload`, formData)
            const updated: TimeCapsulePostResponse = uploadRes.data

            // Update local cache
            const idx = this.capsules.findIndex((c) => c.id === created.id)
            if (idx !== -1) this.capsules[idx] = updated
            if (this.selectedCapsule?.id === created.id) this.selectedCapsule = updated
            created = updated
          } catch (uploadErr: unknown) {
            const errorStore = useErrorStore()
            const msg =
              (uploadErr as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Attachment upload failed; capsule created.'
            errorStore.triggerError(msg)
            // proceed with created capsule without attachment
          }
        }

        return created
      } catch (error: unknown) {
        const errorStore = useErrorStore()
        const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to create time capsule'
        errorStore.triggerError(message)
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateCapsule(id: number, data: Partial<TimeCapsulePostRequest>) {
      this.loading = true
      try {
        // Step 1: Update core fields via JSON
        const { attachment, ...jsonPayload } = data
        const response = await api.put(`/api/posts/${id}`, jsonPayload)
        let updated: TimeCapsulePostResponse = response.data

        // Step 2: If a new file provided, upload it
        if (attachment) {
          try {
            const formData = new FormData()
            formData.append('file', attachment)
            const uploadRes = await api.post(`/api/posts/${id}/upload`, formData)
            updated = uploadRes.data
          } catch (uploadErr: unknown) {
            const errorStore = useErrorStore()
            const msg =
              (uploadErr as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Attachment upload failed; details saved.'
            errorStore.triggerError(msg)
            // keep JSON update result
          }
        }

        const index = this.capsules.findIndex((c) => c.id === id)
        if (index !== -1) {
          this.capsules[index] = updated
        }
        if (this.selectedCapsule?.id === id) {
          this.selectedCapsule = updated
        }
        return updated
      } catch (error: unknown) {
        const errorStore = useErrorStore()
        const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to update time capsule'
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
      } catch (error: unknown) {
        const errorStore = useErrorStore()
        const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to delete time capsule'
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
