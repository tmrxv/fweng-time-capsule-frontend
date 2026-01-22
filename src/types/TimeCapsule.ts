export interface TimeCapsuleBase {
  title: string
  message: string
  sendAt: string
}

export interface TimeCapsulePostRequest extends TimeCapsuleBase {
  userId: number
  attachment?: File
}

export interface TimeCapsuleFormData extends TimeCapsuleBase {}

export interface TimeCapsulePostResponse extends TimeCapsuleBase {
  id: number
  userId: number
  createdAt: string
  updatedAt: string
  attachmentUrl?: string
  attachmentFileName?: string
}
