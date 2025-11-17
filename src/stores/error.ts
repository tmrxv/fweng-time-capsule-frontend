import { defineStore } from 'pinia'

export const useErrorStore = defineStore('errorStore', {
  state: () => ({
    show: false as boolean,
    message: '' as string,
  }),
  actions: {
    triggerError(message: string) {
      this.show = true
      this.message = message
    },
    clearError() {
      this.show = false
      this.message = ''
    },
  },
})

export type ErrorState = ReturnType<typeof useErrorStore>
