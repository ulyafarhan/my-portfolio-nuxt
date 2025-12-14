<template>
  <div class="min-h-screen bg-background text-foreground p-4 md:p-8 w-full space-y-8">
    
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl md:text-3xl font-bold tracking-tight">Experience</h1>
        <p class="text-sm md:text-base text-muted-foreground">Kelola riwayat karir dan pendidikan profesional Anda.</p>
      </div>
      <Button 
        @click="toggleForm" 
        :variant="showForm ? 'secondary' : 'default'"
        class="w-full sm:w-auto shadow-sm"
      >
        <component :is="showForm ? XIcon : PlusIcon" class="mr-2 h-4 w-4" />
        {{ showForm ? 'Batal' : 'Tambah Pengalaman' }}
      </Button>
    </div>

    <div v-if="showForm" class="rounded-xl border bg-card text-card-foreground shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
      <div class="p-6 border-b flex justify-between items-center">
        <h3 class="text-lg font-semibold">{{ isEditing ? 'Edit Pengalaman' : 'Pengalaman Baru' }}</h3>
        <Button variant="ghost" size="sm" @click="closeForm">
          <XIcon class="h-4 w-4" />
        </Button>
      </div>
      
      <div class="p-6">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div class="grid gap-6 md:grid-cols-2">
            <div class="space-y-2">
              <Label>Posisi / Role</Label>
              <Input v-model="form.position" placeholder="Contoh: Senior Frontend Engineer" required class="bg-background" />
            </div>
            <div class="space-y-2">
              <Label>Perusahaan / Organisasi</Label>
              <Input v-model="form.company" placeholder="Contoh: Google Indonesia" required class="bg-background" />
            </div>
          </div>

          <div class="grid gap-6 md:grid-cols-3">
            <div class="space-y-2">
              <Label>Lokasi</Label>
              <Input v-model="form.location" placeholder="Jakarta (Remote)" class="bg-background" />
            </div>
            <div class="space-y-2">
              <Label>Tanggal Mulai</Label>
              <Input type="date" v-model="form.startDate" required class="bg-background" />
            </div>
            <div class="space-y-2">
              <Label>Tanggal Selesai</Label>
              <div class="space-y-3">
                 <Input type="date" v-model="form.endDate" :disabled="isPresent" class="bg-background" />
                 <div class="flex items-center space-x-2">
                  <Checkbox id="present" :checked="isPresent" @update:checked="(v) => isPresent = v" />
                  <label for="present" class="text-sm font-medium leading-none cursor-pointer text-muted-foreground hover:text-foreground transition-colors">
                    Masih bekerja di sini (Present)
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div class="space-y-2">
            <Label>Deskripsi Pekerjaan</Label>
            <Textarea 
              v-model="form.description" 
              rows="4" 
              placeholder="Jelaskan tanggung jawab dan pencapaian utama..." 
              class="bg-background resize-y min-h-[100px]"
            />
          </div>

          <div class="flex justify-end pt-4 border-t gap-2">
            <Button type="button" variant="ghost" @click="closeForm">Batal</Button>
            <Button type="submit" :disabled="loading">
              <Spinner v-if="loading" class="mr-2" />
              {{ isEditing ? 'Simpan Perubahan' : 'Simpan Data' }}
            </Button>
          </div>
        </form>
      </div>
    </div>

    <div v-else class="space-y-4">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div class="relative w-full sm:w-72">
          <SearchIcon class="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input v-model="searchQuery" placeholder="Cari pengalaman..." class="pl-8 bg-card" />
        </div>
      </div>

      <div class="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow class="bg-muted/50 hover:bg-muted/50 border-b">
                <TableHead class="min-w-[200px]">Posisi & Perusahaan</TableHead>
                <TableHead class="min-w-[180px]">Periode</TableHead>
                <TableHead class="hidden md:table-cell">Lokasi</TableHead>
                <TableHead class="text-right w-[100px]">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="exp in filteredExperiences" :key="exp.id" class="group hover:bg-muted/30 transition-colors">
                <TableCell>
                  <div class="flex flex-col gap-1">
                    <span class="font-semibold text-foreground">{{ exp.position }}</span>
                    <span class="text-sm text-muted-foreground">{{ exp.company }}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div class="flex items-center gap-2 text-sm">
                    <span class="text-muted-foreground">{{ formatDate(exp.startDate) }}</span>
                    <ArrowRightIcon class="w-3 h-3 text-muted-foreground/50" />
                    <span v-if="exp.endDate" class="text-muted-foreground">{{ formatDate(exp.endDate) }}</span>
                    <Badge v-else variant="default" class="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">Present</Badge>
                  </div>
                </TableCell>
                <TableCell class="hidden md:table-cell text-sm text-muted-foreground">
                  <div class="flex items-center gap-1.5">
                    <MapPinIcon class="w-3.5 h-3.5 opacity-70" />
                    {{ exp.location || '-' }}
                  </div>
                </TableCell>
                <TableCell class="text-right">
                  <div class="flex justify-end gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" class="h-8 w-8 text-muted-foreground hover:text-foreground" @click="editItem(exp)">
                      <PencilIcon class="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" class="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive" @click="deleteItem(exp.id)">
                      <TrashIcon class="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>

              <TableRow v-if="filteredExperiences.length === 0">
                <TableCell colspan="4" class="h-40 text-center text-muted-foreground">
                   <div class="flex flex-col items-center gap-2">
                    <BriefcaseIcon class="h-8 w-8 opacity-20" />
                    <p>Tidak ada data pengalaman.</p>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toast } from 'vue-sonner'
import { 
  TrashIcon, PencilIcon, PlusIcon, XIcon, SearchIcon, 
  BriefcaseIcon, ArrowRightIcon, MapPinIcon 
} from 'lucide-vue-next'

// Shadcn imports
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import Spinner from '@/components/ui/spinner/Spinner.vue'

definePageMeta({ layout: 'admin' })

// Fetch Data
const { data: experiences, refresh } = await useFetch('/api/experience', { key: 'admin-exp' })

// State
const showForm = ref(false)
const loading = ref(false)
const isEditing = ref(false)
const editingId = ref<string | null>(null)
const isPresent = ref(false)
const searchQuery = ref('')

const form = reactive({
  position: '',
  company: '',
  location: '',
  startDate: '',
  endDate: '',
  description: ''
})

// Search Logic
const filteredExperiences = computed(() => {
  if (!experiences.value) return []
  if (!searchQuery.value) return experiences.value

  const q = searchQuery.value.toLowerCase()
  return experiences.value.filter((ex: any) => 
    ex.position.toLowerCase().includes(q) || 
    ex.company.toLowerCase().includes(q) ||
    ex.location?.toLowerCase().includes(q)
  )
})

// Actions
const toggleForm = () => {
  showForm.value = !showForm.value
  if (!showForm.value) resetForm()
}

const closeForm = () => {
  showForm.value = false
  resetForm()
}

const resetForm = () => {
  form.position = ''; form.company = ''; form.location = '';
  form.startDate = ''; form.endDate = ''; form.description = '';
  isPresent.value = false; isEditing.value = false; editingId.value = null;
}

const editItem = (item: any) => {
  editingId.value = item.id
  isEditing.value = true

  form.position = item.position
  form.company = item.company
  form.location = item.location || ''
  // Format date for HTML input type="date" (YYYY-MM-DD)
  form.startDate = new Date(item.startDate).toISOString().split('T')[0]
  
  if (item.endDate) {
    form.endDate = new Date(item.endDate).toISOString().split('T')[0]
    isPresent.value = false
  } else {
    form.endDate = ''
    isPresent.value = true
  }
  
  form.description = item.description

  showForm.value = true
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })
}

const handleSubmit = async () => {
  loading.value = true
  try {
    const payload = {
      ...form,
      endDate: isPresent.value ? null : form.endDate
    }

    if (isEditing.value && editingId.value) {
      await $fetch(`/api/experience/${editingId.value}`, {
        method: 'PUT',
        body: payload
      })
      toast.success('Pengalaman diperbarui')
    } else {
      await $fetch('/api/experience', {
        method: 'POST',
        body: payload
      })
      toast.success('Pengalaman ditambahkan')
    }

    await refresh()
    closeForm()
  } catch (err: any) {
    toast.error('Gagal menyimpan data')
  } finally {
    loading.value = false
  }
}

const deleteItem = async (id: string) => {
  if (!confirm('Hapus item ini permanen?')) return
  try {
    await $fetch(`/api/experience/${id}`, { method: 'DELETE' })
    await refresh()
    toast.success('Data dihapus')
  } catch (err) {
    toast.error('Gagal menghapus')
  }
}

// Watcher untuk 'Present' checkbox
watch(isPresent, (val) => {
  if (val) form.endDate = ''
})
</script>