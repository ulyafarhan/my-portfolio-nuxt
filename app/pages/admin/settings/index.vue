<template>
  <div class="p-8 max-w-4xl">
    <div class="mb-8">
      <h1 class="text-3xl font-bold tracking-tight">Global Settings</h1>
      <p class="text-muted-foreground">Konfigurasi profil publik dan informasi kontak.</p>
    </div>

    <div class="rounded-xl border bg-white p-6 shadow-sm">
      <form @submit.prevent="saveSettings" class="space-y-6">
        
        <div class="space-y-4">
          <h2 class="text-lg font-semibold border-b pb-2">Profile Information</h2>
          
          <div class="grid gap-2">
            <label class="text-sm font-medium">Short Bio (Hero Section)</label>
            <textarea 
              v-model="form.bio_short" 
              rows="3" 
              class="w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-black focus:outline-none"
              placeholder="Fullstack Developer obsessed with..."
            ></textarea>
            <p class="text-xs text-gray-500">Muncul di halaman utama.</p>
          </div>

          <div class="grid gap-2">
            <label class="text-sm font-medium">Full Bio (About Page)</label>
            <textarea 
              v-model="form.bio_long" 
              rows="5" 
              class="w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-black focus:outline-none"
              placeholder="Ceritakan detail pengalaman anda..."
            ></textarea>
          </div>
        </div>

        <div class="space-y-4 pt-4">
          <h2 class="text-lg font-semibold border-b pb-2">Connect</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <label class="text-sm font-medium">GitHub URL</label>
              <input v-model="form.social_github" class="w-full rounded-md border px-3 py-2 text-sm" placeholder="https://github.com/..." />
            </div>
            
            <div class="space-y-2">
              <label class="text-sm font-medium">LinkedIn URL</label>
              <input v-model="form.social_linkedin" class="w-full rounded-md border px-3 py-2 text-sm" placeholder="https://linkedin.com/in/..." />
            </div>

            <div class="space-y-2">
              <label class="text-sm font-medium">Email Contact</label>
              <input v-model="form.contact_email" type="email" class="w-full rounded-md border px-3 py-2 text-sm" placeholder="me@example.com" />
            </div>
             <div class="space-y-2">
              <label class="text-sm font-medium">Resume / CV Link</label>
              <input v-model="form.resume_url" class="w-full rounded-md border px-3 py-2 text-sm" placeholder="https://..." />
            </div>
          </div>
        </div>

        <div class="pt-4 flex justify-end">
          <button 
            type="submit" 
            :disabled="loading"
            class="rounded-md bg-black px-8 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50 transition-all"
          >
            {{ loading ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>

      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toast } from 'vue-sonner'

definePageMeta({
  layout: 'admin'
})

const loading = ref(false)

// State Form Default
const form = reactive({
  bio_short: '',
  bio_long: '',
  social_github: '',
  social_linkedin: '',
  contact_email: '',
  resume_url: ''
})

// Fetch Data Awal
const { data: settings } = await useFetch('/api/settings')

// Isi form jika data ada di DB
if (settings.value) {
  Object.assign(form, settings.value)
}

// Handle Save
const saveSettings = async () => {
  loading.value = true
  try {
    await $fetch('/api/settings', {
      method: 'POST',
      body: form
    })
    toast.success('Pengaturan berhasil disimpan!')
  } catch (error) {
    toast.error('Gagal menyimpan pengaturan')
  } finally {
    loading.value = false
  }
}
</script>