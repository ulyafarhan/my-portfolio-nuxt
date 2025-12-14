<template>
  <div class="min-h-screen bg-background text-foreground p-4 md:p-8 w-full space-y-8">
    
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl md:text-3xl font-bold tracking-tight">Testimonials</h1>
        <p class="text-sm md:text-base text-muted-foreground">Apa kata klien tentang pekerjaan Anda.</p>
      </div>
      <Button 
        @click="openCreate" 
        :variant="showForm ? 'secondary' : 'default'"
        class="w-full sm:w-auto shadow-sm"
      >
        <component :is="showForm ? XIcon : PlusIcon" class="mr-2 h-4 w-4" />
        {{ showForm ? 'Tutup' : 'Testimoni Baru' }}
      </Button>
    </div>

    <div v-if="showForm" class="rounded-xl border bg-card text-card-foreground shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
      <div class="p-6 border-b flex justify-between items-center">
        <h3 class="text-lg font-semibold">{{ isEditing ? 'Edit Testimoni' : 'Tambah Testimoni' }}</h3>
        <Button variant="ghost" size="sm" @click="closeForm">
          <XIcon class="h-4 w-4" />
        </Button>
      </div>

      <div class="p-6">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div class="grid gap-6 md:grid-cols-2">
            <div class="space-y-4">
              <div class="space-y-2">
                <Label>Nama Klien</Label>
                <Input v-model="form.clientName" placeholder="John Doe" required class="bg-background" />
              </div>
              
              <div class="space-y-2">
                <Label>Perusahaan / Jabatan</Label>
                <Input v-model="form.company" placeholder="CEO at Tech Corp" class="bg-background" />
              </div>

              <div class="space-y-2">
                <Label>Rating</Label>
                <div class="flex items-center gap-1">
                  <button 
                    type="button"
                    v-for="star in 5" 
                    :key="star"
                    @click="form.rating = star"
                    class="focus:outline-none transition-transform hover:scale-110"
                  >
                    <StarIcon 
                      :class="[
                        'h-6 w-6',
                        star <= form.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'
                      ]" 
                    />
                  </button>
                  <span class="ml-2 text-sm text-muted-foreground font-medium">({{ form.rating }}/5)</span>
                </div>
              </div>

              <div class="flex items-center space-x-2 border p-3 rounded-md bg-muted/20">
                <Switch :checked="form.isShow" @update:checked="(v) => form.isShow = v" />
                <div class="flex flex-col">
                  <Label>Tampilkan di Website</Label>
                  <span class="text-xs text-muted-foreground">Aktifkan agar terlihat oleh pengunjung.</span>
                </div>
              </div>
            </div>

            <div class="space-y-4">
              <div class="space-y-2">
                <Label>Foto Profil / Avatar</Label>
                <ImageUpload v-model="form.avatarUrl" />
              </div>

              <div class="space-y-2">
                <Label>Isi Testimoni</Label>
                <Textarea 
                  v-model="form.content" 
                  rows="4" 
                  placeholder="Ceritakan pengalaman kerjasama..." 
                  class="bg-background min-h-[120px]"
                  required
                />
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="ghost" @click="closeForm">Batal</Button>
            <Button type="submit" :disabled="loading">
              <Spinner v-if="loading" class="mr-2" />
              {{ isEditing ? 'Simpan Perubahan' : 'Simpan Testimoni' }}
            </Button>
          </div>
        </form>
      </div>
    </div>

    <div class="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow class="bg-muted/50 hover:bg-muted/50 border-b">
              <TableHead class="w-[80px]">Avatar</TableHead>
              <TableHead class="min-w-[200px]">Klien</TableHead>
              <TableHead class="hidden md:table-cell">Konten</TableHead>
              <TableHead class="w-[100px]">Rating</TableHead>
              <TableHead class="w-[100px]">Status</TableHead>
              <TableHead class="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="item in testimonials" :key="item.id" class="group hover:bg-muted/30 transition-colors">
              <TableCell>
                <Avatar class="h-10 w-10 border bg-muted">
                  <AvatarImage :src="item.avatarUrl" />
                  <AvatarFallback>{{ item.clientName.charAt(0).toUpperCase() }}</AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell>
                <div class="flex flex-col">
                  <span class="font-medium text-foreground">{{ item.clientName }}</span>
                  <span class="text-xs text-muted-foreground">{{ item.company }}</span>
                </div>
              </TableCell>
              <TableCell class="hidden md:table-cell">
                <p class="text-sm text-muted-foreground line-clamp-2 max-w-[400px]">
                  "{{ item.content }}"
                </p>
              </TableCell>
              <TableCell>
                <div class="flex items-center gap-0.5">
                  <StarIcon class="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                  <span class="text-sm font-medium ml-1">{{ item.rating }}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge :variant="item.isShow ? 'default' : 'secondary'">
                  {{ item.isShow ? 'Active' : 'Hidden' }}
                </Badge>
              </TableCell>
              <TableCell class="text-right">
                <div class="flex justify-end gap-1">
                  <Button variant="ghost" size="icon" class="h-8 w-8 text-muted-foreground hover:text-foreground" @click="editItem(item)">
                    <PencilIcon class="w-3.5 h-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" class="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive" @click="deleteItem(item.id)">
                    <TrashIcon class="w-3.5 h-3.5" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>

            <TableRow v-if="!testimonials || testimonials.length === 0">
              <TableCell colspan="6" class="h-40 text-center text-muted-foreground">
                <div class="flex flex-col items-center gap-2">
                  <MessageSquareIcon class="h-8 w-8 opacity-20" />
                  <p>Belum ada testimoni.</p>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toast } from 'vue-sonner'
import { 
  TrashIcon, PencilIcon, PlusIcon, XIcon, StarIcon, MessageSquareIcon 
} from 'lucide-vue-next'
import ImageUpload from '@/components/admin/ImageUpload.vue'

// UI Imports
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import Spinner from '@/components/ui/spinner/Spinner.vue'

definePageMeta({ layout: 'admin' })

const { data: testimonials, refresh } = await useFetch('/api/testimonials', { key: 'admin-testimonials' })

const showForm = ref(false)
const loading = ref(false)
const isEditing = ref(false)
const editingId = ref<string | null>(null)

const form = reactive({
  clientName: '',
  company: '',
  content: '',
  rating: 5,
  avatarUrl: '',
  isShow: true
})

const openCreate = () => {
  resetForm()
  showForm.value = true
}

const closeForm = () => {
  showForm.value = false
  resetForm()
}

const resetForm = () => {
  form.clientName = ''; form.company = ''; form.content = '';
  form.rating = 5; form.avatarUrl = ''; form.isShow = true;
  isEditing.value = false; editingId.value = null;
}

const editItem = (item: any) => {
  editingId.value = item.id
  isEditing.value = true
  
  form.clientName = item.clientName
  form.company = item.company || ''
  form.content = item.content
  form.rating = item.rating
  form.avatarUrl = item.avatarUrl || ''
  form.isShow = item.isShow

  showForm.value = true
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleSubmit = async () => {
  loading.value = true
  try {
    const endpoint = isEditing.value ? `/api/testimonials/${editingId.value}` : '/api/testimonials'
    const method = isEditing.value ? 'PUT' : 'POST'

    await $fetch(endpoint, {
      method,
      body: form
    })

    toast.success(isEditing.value ? 'Testimoni diperbarui' : 'Testimoni ditambahkan')
    await refresh()
    closeForm()
  } catch (err: any) {
    toast.error('Gagal menyimpan data')
  } finally {
    loading.value = false
  }
}

const deleteItem = async (id: string) => {
  if (!confirm('Hapus testimoni ini?')) return
  try {
    await $fetch(`/api/testimonials/${id}`, { method: 'DELETE' })
    await refresh()
    toast.success('Terhapus')
  } catch (err) {
    toast.error('Gagal menghapus')
  }
}
</script>