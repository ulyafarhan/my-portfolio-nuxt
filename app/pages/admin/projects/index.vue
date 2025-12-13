<template>
  <div class="p-8">
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Manage Projects</h1>
        <p class="text-muted-foreground">Create, edit, and remove portfolio items.</p>
      </div>
      <button 
        @click="showForm = !showForm"
        class="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
      >
        {{ showForm ? 'Cancel' : '+ New Project' }}
      </button>
    </div>

    <div v-if="showForm" class="mb-10 rounded-xl border bg-gray-50 p-6 shadow-sm">
      <form @submit.prevent="handleSubmit" class="grid gap-4 md:grid-cols-2">
        <div class="space-y-2">
          <label class="text-sm font-medium">Title</label>
          <input v-model="form.title" class="w-full rounded-md border px-3 py-2 text-sm" required />
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium">Slug (URL)</label>
          <input v-model="form.slug" class="w-full rounded-md border px-3 py-2 text-sm" required />
        </div>
        <div class="space-y-2 md:col-span-2">
          <label class="text-sm font-medium">Description</label>
          <textarea v-model="form.description" class="w-full rounded-md border px-3 py-2 text-sm" rows="3"></textarea>
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium">Thumbnail URL</label>
          <input v-model="form.thumbnail" class="w-full rounded-md border px-3 py-2 text-sm" placeholder="https://..." />
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium">Tech Stack (Comma separated)</label>
          <input v-model="techInput" class="w-full rounded-md border px-3 py-2 text-sm" placeholder="Vue, Nuxt, Prisma" />
        </div>
        <div class="flex items-center space-x-2 md:col-span-2">
          <input type="checkbox" v-model="form.isFeatured" id="feat" class="rounded border-gray-300" />
          <label for="feat" class="text-sm">Feature on Homepage</label>
        </div>
        
        <div class="md:col-span-2">
          <button 
            type="submit" 
            :disabled="loading"
            class="w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {{ loading ? 'Saving...' : 'Save Project' }}
          </button>
        </div>
      </form>
    </div>

    <div class="rounded-xl border shadow-sm overflow-hidden">
      <table class="w-full text-left text-sm">
        <thead class="bg-gray-100 border-b">
          <tr>
            <th class="px-6 py-3 font-medium">Project</th>
            <th class="px-6 py-3 font-medium">Tech Stack</th>
            <th class="px-6 py-3 font-medium">Status</th>
            <th class="px-6 py-3 font-medium text-right">Action</th>
          </tr>
        </thead>
        <tbody class="divide-y">
          <tr v-for="project in projects" :key="project.id" class="group hover:bg-gray-50">
            <td class="px-6 py-4">
              <div class="font-medium">{{ project.title }}</div>
              <div class="text-xs text-gray-500">/{{ project.slug }}</div>
            </td>
            <td class="px-6 py-4">
              <div class="flex flex-wrap gap-1">
                <span v-for="t in (project.techStack as string[])" :key="t" class="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold text-gray-800">
                  {{ t }}
                </span>
              </div>
            </td>
            <td class="px-6 py-4">
              <span v-if="project.isFeatured" class="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                Featured
              </span>
              <span v-else class="text-gray-400">Standard</span>
            </td>
            <td class="px-6 py-4 text-right">
              <button 
                @click="deleteProject(project.id)" 
                class="text-red-500 hover:text-red-700 hover:underline"
              >
                Delete
              </button>
            </td>
          </tr>
          <tr v-if="projects?.length === 0">
            <td colspan="4" class="px-6 py-8 text-center text-muted-foreground">
              No projects found. Create one above.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin'
})

// Fetch Data (Realtime refresh saat data berubah)
const { data: projects, refresh } = await useFetch('/api/portfolio', {
  key: 'admin-projects'
})

const showForm = ref(false)
const loading = ref(false)
const techInput = ref('')

const form = reactive({
  title: '',
  slug: '',
  description: '',
  thumbnail: '',
  isFeatured: false
})

// Create Logic
const handleSubmit = async () => {
  loading.value = true
  try {
    await $fetch('/api/portfolio', {
      method: 'POST',
      body: {
        ...form,
        techStack: techInput.value.split(',').map(s => s.trim()).filter(Boolean)
      }
    })
    
    // Reset & Refresh
    form.title = ''
    form.slug = ''
    form.description = ''
    techInput.value = ''
    showForm.value = false
    await refresh() // Refresh tabel
    
  } catch (err: any) {
    alert(err.statusMessage || 'Failed to create')
  } finally {
    loading.value = false
  }
}

// Delete Logic
const deleteProject = async (id: string) => {
  if (!confirm('Are you sure? This action cannot be undone.')) return
  
  try {
    await $fetch(`/api/portfolio/${id}`, { method: 'DELETE' })
    await refresh()
  } catch (err) {
    alert('Failed to delete')
  }
}
</script>