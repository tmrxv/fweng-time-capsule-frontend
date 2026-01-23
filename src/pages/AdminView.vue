<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/plugins/axios'
import Button from '@/components/atoms/Button.vue'

interface PagedResponse<T> {
  content: T[]
  totalElements?: number
  totalPages?: number
  number?: number
  size?: number
}

interface AdminUser {
  id: number
  email: string
  username: string
  role: string
  createdAt?: string
  updatedAt?: string
}

interface AdminPost {
  id: number
  title: string
  message: string
  sendAt: string
  userId: number
  createdAt?: string
  updatedAt?: string
  fileUrl?: string
  attachmentUrl?: string
}

const users = ref<AdminUser[]>([])
const posts = ref<AdminPost[]>([])
const loading = ref(false)
const error = ref<string>('')
const router = useRouter()

async function fetchAdminData() {
  loading.value = true
  error.value = ''
  try {
    const [usersRes, postsRes] = await Promise.all([
      api.get<PagedResponse<AdminUser>>('/api/admin/users'),
      api.get<PagedResponse<AdminPost>>('/api/admin/posts'),
    ])
    users.value = usersRes.data.content || []
    posts.value = postsRes.data.content || []
  } catch (err: any) {
    error.value = err?.response?.data?.message || 'Failed to load admin data'
  } finally {
    loading.value = false
  }
}

function editPost(id: number) {
  router.push({ name: 'edit-capsule', params: { id } })
}

onMounted(() => {
  fetchAdminData()
})
</script>

<template>
  <div class="min-h-screen bg-surface text-gray-900 dark:text-gray-100 dark:bg-[#061025] py-12 px-6">
    <div class="max-w-6xl mx-auto flex flex-col gap-10">
      <header class="flex items-center justify-between">
        <div>
          <h1 class="text-4xl font-extrabold">Admin Dashboard</h1>
          <p class="text-sm text-lightest-blue/80">Manage users and time capsule posts</p>
        </div>
        <Button type="secondary" size="sm" @click="fetchAdminData" :disabled="loading">
          {{ loading ? 'Refreshing...' : 'Refresh' }}
        </Button>
      </header>

      <section class="bg-black-100 rounded-xl p-6 shadow-inner">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-2xl font-bold">Users</h2>
          <span class="text-sm text-lightest-blue/70">{{ users.length }} users</span>
        </div>
        <div v-if="users.length === 0" class="text-lightest-blue/80">No users found.</div>
        <div v-else class="overflow-x-auto">
          <table class="min-w-full text-left text-sm">
            <thead class="text-lightest-blue/80">
              <tr>
                <th class="px-2 py-2">ID</th>
                <th class="px-2 py-2">Username</th>
                <th class="px-2 py-2">Email</th>
                <th class="px-2 py-2">Role</th>
                <th class="px-2 py-2">Created</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5">
              <tr v-for="u in users" :key="u.id" class="hover:bg-white/5">
                <td class="px-2 py-2">{{ u.id }}</td>
                <td class="px-2 py-2">{{ u.username }}</td>
                <td class="px-2 py-2">{{ u.email }}</td>
                <td class="px-2 py-2">{{ u.role }}</td>
                <td class="px-2 py-2">{{ u.createdAt?.split('T')[0] || '—' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="bg-black-100 rounded-xl p-6 shadow-inner">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-2xl font-bold">Time Capsule Posts</h2>
          <span class="text-sm text-lightest-blue/70">{{ posts.length }} posts</span>
        </div>
        <div v-if="posts.length === 0" class="text-lightest-blue/80">No posts found.</div>
        <div v-else class="overflow-x-auto">
          <table class="min-w-full text-left text-sm">
            <thead class="text-lightest-blue/80">
              <tr>
                <th class="px-2 py-2">ID</th>
                <th class="px-2 py-2">Title</th>
                <th class="px-2 py-2">User ID</th>
                <th class="px-2 py-2">Send At</th>
                <th class="px-2 py-2">Has File</th>
                <th class="px-2 py-2">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5">
              <tr v-for="p in posts" :key="p.id" class="hover:bg-white/5">
                <td class="px-2 py-2">{{ p.id }}</td>
                <td class="px-2 py-2">{{ p.title }}</td>
                <td class="px-2 py-2">{{ p.userId }}</td>
                <td class="px-2 py-2">{{ p.sendAt?.split('T')[0] }}</td>
                <td class="px-2 py-2">
                  <span v-if="p.attachmentUrl || p.fileUrl" class="text-green-400">Yes</span>
                  <span v-else class="text-lightest-blue/70">No</span>
                </td>
                <td class="px-2 py-2">
                  <Button type="primary" size="sm" @click="editPost(p.id)">Edit</Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <p v-if="error" class="text-red-400 text-sm">{{ error }}</p>
    </div>
  </div>
</template>
