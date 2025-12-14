<template>
  <div class="min-h-screen bg-background text-foreground p-4 md:p-8 w-full space-y-8">
    
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl md:text-3xl font-bold tracking-tight">Code Snippets</h1>
        <p class="text-sm md:text-base text-muted-foreground">Simpan potongan kode reusable untuk project Anda.</p>
      </div>
      <Button @click="openCreate" :variant="showForm ? 'secondary' : 'default'">
        <component :is="showForm ? XIcon : PlusIcon" class="mr-2 h-4 w-4" />
        {{ showForm ? 'Batal' : 'Snippet Baru' }}
      </Button>
    </div>

    <div v-if="showForm" class="rounded-xl border bg-card text-card-foreground shadow-sm animate-in fade-in slide-in-from-top-4">
      <div class="p-6 space-y-6">
        <div class="flex justify-between items-center border-b pb-4">
          <h3 class="text-lg font-semibold">{{ isEditing ? 'Edit Snippet' : 'Buat Snippet' }}</h3>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div class="grid md:grid-cols-2 gap-6">
            <div class="space-y-4">
              <div class="space-y-2">
                <Label>Judul</Label>
                <Input v-model="form.title" placeholder="e.g. Docker Compose Setup" required class="bg-background" />
              </div>
              <div class="space-y-2">
                <Label>Language / Tag</Label>
                <Input v-model="form.language" placeholder="yaml" class="bg-background font-mono text-sm" />
              </div>
              <div class="space-y-2">
                <Label>Deskripsi</Label>
                <Textarea v-model="form.description" rows="3" class="bg-background" />
              </div>
            </div>

            <div class="space-y-2">
              <Label>Kode</Label>
              <Textarea 
                v-model="form.code" 
                rows="10" 
                class="bg-zinc-950 text-green-400 font-mono text-xs md:text-sm leading-relaxed p-4 rounded-md border-zinc-800 focus-visible:ring-zinc-700" 
                placeholder="// Paste your code here..."
                required 
              />
            </div>
          </div>

          <div class="flex justify-end pt-4">
            <Button type="submit" :disabled="loading">
              <Spinner v-if="loading" class="mr-2" />
              {{ isEditing ? 'Update Snippet' : 'Simpan Snippet' }}
            </Button>
          </div>
        </form>
      </div>
    </div>

    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card v-for="item in snippets" :key="item.id" class="flex flex-col bg-card hover:border-primary/50 transition-colors group">
        <CardHeader class="pb-3">
          <div class="flex justify-between items-start">
            <Badge variant="outline" class="font-mono text-[10px] uppercase">{{ item.language }}</Badge>
            <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="ghost" size="icon-sm" class="h-6 w-6" @click="editItem(item)"><PencilIcon class="h-3 w-3" /></Button>
              <Button variant="ghost" size="icon-sm" class="h-6 w-6 text-destructive" @click="deleteItem(item.id)"><TrashIcon class="h-3 w-3" /></Button>
            </div>
          </div>
          <CardTitle class="text-base mt-2">{{ item.title }}</CardTitle>
          <CardDescription class="line-clamp-2 text-xs">{{ item.description }}</CardDescription>
        </CardHeader>
        <CardContent class="flex-1">
          <div class="bg-muted p-3 rounded-md overflow-hidden relative h-32 group/code">
            <pre class="text-[10px] font-mono text-muted-foreground">{{ item.code }}</pre>
            <div class="absolute inset-0 bg-gradient-to-t from-muted to-transparent pointer-events-none" />
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toast } from 'vue-sonner'
import { PlusIcon, XIcon, PencilIcon, TrashIcon } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import Spinner from '@/components/ui/spinner/Spinner.vue'

definePageMeta({ layout: 'admin' })

// Ganti '/api/snippets' sesuai endpoint backend Anda
const { data: snippets, refresh } = await useFetch('/api/snippets', { key: 'admin-snippets' })

const showForm = ref(false)
const loading = ref(false)
const isEditing = ref(false)
const editingId = ref<string | null>(null)

const form = reactive({
  title: '', language: '', description: '', code: ''
})

const openCreate = () => {
  resetForm()
  showForm.value = !showForm.value
}

const resetForm = () => {
  form.title = ''; form.language = ''; form.description = ''; form.code = '';
  isEditing.value = false; editingId.value = null;
}

const editItem = (item: any) => {
  isEditing.value = true
  editingId.value = item.id
  Object.assign(form, item)
  showForm.value = true
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleSubmit = async () => {
  loading.value = true
  try {
    const endpoint = isEditing.value ? `/api/snippets/${editingId.value}` : '/api/snippets'
    const method = isEditing.value ? 'PUT' : 'POST' // Pastikan backend support PUT

    // Fallback jika backend snippets belum dibuat: Gunakan mock/log
    await $fetch(endpoint, { method, body: form })
    
    toast.success('Snippet disimpan!')
    await refresh()
    showForm.value = false
    resetForm()
  } catch (e) {
    toast.error('Gagal menyimpan snippet (Pastikan API /api/snippets ada)')
  } finally {
    loading.value = false
  }
}

const deleteItem = async (id: string) => {
  if(!confirm('Hapus snippet ini?')) return
  try {
    await $fetch(`/api/snippets/${id}`, { method: 'DELETE' })
    await refresh()
    toast.success('Terhapus')
  } catch (e) {
    toast.error('Gagal menghapus')
  }
}
</script>