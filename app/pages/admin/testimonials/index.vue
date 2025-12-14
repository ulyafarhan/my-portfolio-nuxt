<template>
  <div class="p-8 max-w-6xl mx-auto">
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Testimonials</h1>
        <p class="text-muted-foreground">Apa kata klien tentang kinerja Anda.</p>
      </div>
      <Button @click="toggleForm" :variant="showForm ? 'secondary' : 'default'">
        {{ showForm ? 'Batal' : '+ Testimoni Baru' }}
      </Button>
    </div>

    <div v-if="showForm" class="mb-10 animate-in fade-in slide-in-from-top-2">
      <Card>
        <CardHeader>
          <CardTitle>Tambah Testimoni</CardTitle>
        </CardHeader>
        <CardContent>
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div class="grid md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <Label>Nama Klien</Label>
                <Input v-model="form.clientName" placeholder="Jhon Doe" required />
              </div>
              <div class="space-y-2">
                <Label>Perusahaan / Role</Label>
                <Input v-model="form.company" placeholder="CEO at TechCorp" />
              </div>
            </div>
            
            <div class="space-y-2">
              <Label>Isi Testimoni</Label>
              <Textarea v-model="form.content" rows="3" placeholder="Sangat puas bekerja sama dengan..." required />
            </div>

            <div class="space-y-2">
              <Label>Foto Klien (Upload)</Label>
              <ImageUpload v-model="form.avatarUrl" />
            </div>

            <div class="flex items-center gap-4 pt-2">
              <div class="space-y-2 w-24">
                <Label>Rating (1-5)</Label>
                <Input type="number" v-model="form.rating" min="1" max="5" />
              </div>
              <div class="flex items-center space-x-2 mt-6">
                <Switch :checked="form.isShow" @update:checked="(v) => form.isShow = v" />
                <span class="text-sm">Tampilkan di Web</span>
              </div>
            </div>

            <div class="flex justify-end pt-4">
               <Button type="submit" :disabled="loading">Simpan</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>

    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card v-for="item in items" :key="item.id" class="relative group">
        <CardHeader class="pb-2">
          <div class="flex items-start justify-between">
            <div class="flex items-center gap-3">
              <Avatar class="h-10 w-10">
                <AvatarImage :src="item.avatarUrl" />
                <AvatarFallback>{{ item.clientName.charAt(0) }}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle class="text-base">{{ item.clientName }}</CardTitle>
                <CardDescription class="text-xs">{{ item.company }}</CardDescription>
              </div>
            </div>
            <div class="flex gap-1">
               <StarIcon v-for="i in item.rating" :key="i" class="w-3 h-3 fill-yellow-400 text-yellow-400" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p class="text-sm text-muted-foreground line-clamp-3">"{{ item.content }}"</p>
        </CardContent>
        <CardFooter class="pt-0 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="destructive" size="icon-sm" @click="deleteItem(item.id)">
            <TrashIcon class="w-4 h-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toast } from 'vue-sonner'
import { TrashIcon, StarIcon } from 'lucide-vue-next'
import ImageUpload from '@/components/admin/ImageUpload.vue'

// Shadcn imports (pastikan path benar sesuai struktur Anda)
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

definePageMeta({ layout: 'admin' })

const { data: items, refresh } = await useFetch('/api/testimonials')
const showForm = ref(false)
const loading = ref(false)

const form = reactive({
  clientName: '', company: '', content: '', avatarUrl: '', rating: 5, isShow: true
})

const toggleForm = () => {
  showForm.value = !showForm.value
  if(!showForm.value) Object.assign(form, { clientName: '', company: '', content: '', avatarUrl: '', rating: 5, isShow: true })
}

const handleSubmit = async () => {
  loading.value = true
  try {
    await $fetch('/api/testimonials', { method: 'POST', body: form })
    toast.success('Testimoni disimpan')
    await refresh()
    toggleForm()
  } catch (e) { toast.error('Gagal menyimpan') } 
  finally { loading.value = false }
}

const deleteItem = async (id: string) => {
  if(!confirm('Hapus testimoni ini?')) return
  await $fetch(`/api/testimonials/${id}`, { method: 'DELETE' })
  await refresh()
  toast.success('Terhapus')
}
</script>