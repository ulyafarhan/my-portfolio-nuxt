<script setup lang="ts">
import { toast } from 'vue-sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import Spinner from '@/components/ui/spinner/Spinner.vue'

const loading = ref(false)
const form = reactive({
  name: '',
  email: '',
  subject: '',
  content: ''
})

const submit = async () => {
  loading.value = true
  try {
    await $fetch('/api/contact', {
      method: 'POST',
      body: form
    })
    toast.success('Pesan terkirim! Saya akan segera menghubungi Anda.')
    // Reset form
    form.name = ''; form.email = ''; form.subject = ''; form.content = '';
  } catch (err) {
    toast.error('Gagal mengirim pesan. Silakan coba lagi.')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <form @submit.prevent="submit" class="space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="space-y-2">
        <Label>Nama Lengkap</Label>
        <Input v-model="form.name" placeholder="John Doe" required class="bg-background" />
      </div>
      <div class="space-y-2">
        <Label>Email</Label>
        <Input v-model="form.email" type="email" placeholder="john@example.com" required class="bg-background" />
      </div>
    </div>
    
    <div class="space-y-2">
      <Label>Subjek</Label>
      <Input v-model="form.subject" placeholder="Project Inquiry..." required class="bg-background" />
    </div>

    <div class="space-y-2">
      <Label>Pesan</Label>
      <Textarea v-model="form.content" rows="5" placeholder="Ceritakan tentang proyek Anda..." required class="bg-background" />
    </div>

    <Button type="submit" size="lg" class="w-full md:w-auto" :disabled="loading">
      <Spinner v-if="loading" class="mr-2" />
      {{ loading ? 'Mengirim...' : 'Kirim Pesan' }}
    </Button>
  </form>
</template>