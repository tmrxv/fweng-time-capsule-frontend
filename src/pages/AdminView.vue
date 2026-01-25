<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
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
  country?: string
  profileImageUrl?: string
  role: string
  locked?: boolean 
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

// Fulltext search 
const userSearch = ref('')

// Per-user UI state
const roleDraft = reactive<Record<number, string>>({})
const rowExpanded = reactive<Record<number, boolean>>({})
const actionLoading = reactive<Record<number, boolean>>({})

// Pagination for users 
const userPage = ref(0)
const userSize = ref(20)
const userTotalPages = ref(1)
const userTotalElements = ref(0)

async function fetchAdminData() {
  loading.value = true
  error.value = ''
  try {
    const [usersRes, postsRes] = await Promise.all([
      api.get<PagedResponse<AdminUser>>('/api/admin/users', {
        params: { page: userPage.value, size: userSize.value },
      }),
      api.get<PagedResponse<AdminPost>>('/api/admin/posts'),
    ])

    const pageUsers = usersRes.data
    users.value = pageUsers.content || []
    userTotalPages.value = pageUsers.totalPages ?? 1
    userTotalElements.value = pageUsers.totalElements ?? users.value.length

    // init local UI models
    for (const u of users.value) {
      roleDraft[u.id] = u.role
      if (rowExpanded[u.id] === undefined) rowExpanded[u.id] = false
      if (actionLoading[u.id] === undefined) actionLoading[u.id] = false
      if (u.locked === undefined) u.locked = false
    }

    posts.value = postsRes.data.content || []
  } catch (err: any) {
    error.value = err?.response?.data?.message || 'Failed to load admin data'
  } finally {
    loading.value = false
  }
}

const filteredUsers = computed(() => {
  const q = userSearch.value.trim().toLowerCase()
  if (!q) return users.value
  return users.value.filter((u) => JSON.stringify(u ?? {}).toLowerCase().includes(q))
})

function editPost(id: number) {
  router.push({ name: 'edit-capsule', params: { id } })
}

function toggleExpanded(id: number) {
  rowExpanded[id] = !rowExpanded[id]
}

async function updateUserRole(user: AdminUser) {
  error.value = ''
  actionLoading[user.id] = true

  const newRole = (roleDraft[user.id] || '').trim().toUpperCase()
  if (!newRole) {
    roleDraft[user.id] = user.role
    actionLoading[user.id] = false
    return
  }

  try {
    await api.patch(`/api/admin/users/${user.id}`, { role: newRole })
    user.role = newRole
  } catch (err: any) {
    roleDraft[user.id] = user.role
    error.value = err?.response?.data?.message || 'Failed to update user role'
  } finally {
    actionLoading[user.id] = false
  }
}

async function toggleUserLock(user: AdminUser) {
  error.value = ''
  actionLoading[user.id] = true

  const current = !!user.locked
  const next = !current

  try {
    await api.patch(`/api/admin/users/${user.id}`, { locked: next })
    user.locked = next
  } catch (err: any) {
    error.value = err?.response?.data?.message || 'Failed to lock/unlock user'
  } finally {
    actionLoading[user.id] = false
  }
}

async function deleteUser(user: AdminUser) {
  error.value = ''
  const ok = confirm(`Delete user "${user.username}" (ID ${user.id})? This cannot be undone.`)
  if (!ok) return

  actionLoading[user.id] = true
  try {
    await api.delete(`/api/admin/users/${user.id}`)
    users.value = users.value.filter((u) => u.id !== user.id)
  } catch (err: any) {
    error.value = err?.response?.data?.message || 'Failed to delete user'
  } finally {
    actionLoading[user.id] = false
  }
}

function prevUserPage() {
  if (userPage.value <= 0) return
  userPage.value -= 1
  fetchAdminData()
}

function nextUserPage() {
  if (userPage.value >= userTotalPages.value - 1) return
  userPage.value += 1
  fetchAdminData()
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

      <!-- USERS -->
      <section class="bg-black-100 rounded-xl p-6 shadow-inner">
        <div class="flex items-start md:items-center justify-between mb-4 gap-3 flex-col md:flex-row">
          <div>
            <h2 class="text-2xl font-bold">Users</h2>
            <span class="text-sm text-lightest-blue/70">
              {{ userTotalElements }} users · page {{ userPage + 1 }} / {{ userTotalPages }}
            </span>
          </div>

          <!-- Fulltext search -->
          <input
            v-model="userSearch"
            type="text"
            placeholder="Search users (full text)..."
            class="w-full md:w-80 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm outline-none focus:ring-2 focus:ring-white/20"
          />
        </div>

        <div class="flex items-center justify-between mb-4">
          <div class="flex gap-2">
            <Button type="secondary" size="sm" @click="prevUserPage" :disabled="loading || userPage === 0">
              Prev
            </Button>
            <Button
              type="secondary"
              size="sm"
              @click="nextUserPage"
              :disabled="loading || userPage >= userTotalPages - 1"
            >
              Next
            </Button>
          </div>
          <div class="text-xs text-lightest-blue/70">Showing {{ filteredUsers.length }} on this page</div>
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
                <th class="px-2 py-2">Status</th>
                <th class="px-2 py-2">Created</th>
                <th class="px-2 py-2">Actions</th>
              </tr>
            </thead>

            <tbody class="divide-y divide-white/5">
              <template v-for="u in filteredUsers" :key="u.id">
                <tr class="hover:bg-white/5">
                  <td class="px-2 py-2">{{ u.id }}</td>
                  <td class="px-2 py-2">
                    <button class="underline decoration-white/30 hover:decoration-white/70" @click="toggleExpanded(u.id)">
                      {{ u.username }}
                    </button>
                  </td>
                  <td class="px-2 py-2">{{ u.email }}</td>

                  <!-- Role editor -->
                  <td class="px-2 py-2">
                    <select
                      v-model="roleDraft[u.id]"
                      class="px-2 py-1 rounded bg-white/5 border border-white/10 text-sm"
                      :disabled="actionLoading[u.id]"
                      @change="updateUserRole(u)"
                    >
                      <option value="USER">USER</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </td>

                  <!-- Lock status -->
                  <td class="px-2 py-2">
                    <span v-if="u.locked" class="text-red-400">Locked</span>
                    <span v-else class="text-green-400">Active</span>
                  </td>

                  <td class="px-2 py-2">{{ u.createdAt?.split('T')[0] || '—' }}</td>

                  <!-- Management actions -->
                  <td class="px-2 py-2 flex gap-2">
                    <Button type="secondary" size="sm" :disabled="actionLoading[u.id]" @click="toggleUserLock(u)">
                      {{ u.locked ? 'Unlock' : 'Lock' }}
                    </Button>

                    <Button type="danger" size="sm" :disabled="actionLoading[u.id]" @click="deleteUser(u)">
                      Delete
                    </Button>
                  </td>
                </tr>

                <!-- Detail row -->
                <tr v-if="rowExpanded[u.id]" class="bg-white/0">
                  <td class="px-2 py-3" colspan="7">
                    <div class="flex flex-col md:flex-row gap-4">
                      <div class="flex items-center gap-3">
                        <img
                          v-if="u.profileImageUrl"
                          :src="u.profileImageUrl"
                          alt="profile"
                          class="w-12 h-12 rounded-full object-cover border border-white/10"
                        />
                        <div v-else class="w-12 h-12 rounded-full bg-white/10" />
                        <div class="text-sm">
                          <div class="font-semibold">{{ u.username }}</div>
                          <div class="text-lightest-blue/70">Country: {{ u.country || '—' }}</div>
                        </div>
                      </div>

                      <div class="text-sm text-lightest-blue/70 flex-1">
                        <div><span class="text-lightest-blue/90">Email:</span> {{ u.email }}</div>
                        <div><span class="text-lightest-blue/90">Role:</span> {{ u.role }}</div>
                        <div><span class="text-lightest-blue/90">Created:</span> {{ u.createdAt || '—' }}</div>
                      </div>
                    </div>
                  </td>
                </tr>
              </template>

              <tr v-if="filteredUsers.length === 0">
                <td class="px-2 py-6 text-center text-lightest-blue/70" colspan="7">
                  No users match your search.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- POSTS -->
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
