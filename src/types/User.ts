export interface User {
  id: number
  email: string
  username: string
  country: string
  profileImageUrl: string | null
  role: 'USER' | 'ADMIN'
  createdAt: string
}
