<template>
  <div class="p-8 max-w-6xl mx-auto">
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Experience</h1>
        <p class="text-muted-foreground">Kelola riwayat karir dan pendidikan profesional Anda.</p>
      </div>
      <Button @click="toggleForm" :variant="showForm ? 'secondary' : 'default'">
        {{ showForm ? 'Batal' : '+ Tambah Pengalaman' }}
      </Button>
    </div>

    <div v-if="showForm" class="mb-10 animate-in fade-in slide-in-from-top-2">
      <Card>
        <CardHeader>
          <CardTitle>Pengalaman Baru</CardTitle>
          <CardDescription>Tambahkan detail pekerjaan atau organisasi.</CardDescription>
        </CardHeader>
        <CardContent>
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div class="grid gap-4 md:grid-cols-2">
              <div class="space-y-2">
                <Label>Posisi / Role</Label>
                <Input v-model="form.position" placeholder="Contoh: Senior Frontend Engineer" required />
              </div>
              <div class="space-y-2">
                <Label>Perusahaan / Organisasi</Label>
                <Input v-model="form.company" placeholder="Contoh: Google Indonesia" required />
              </div>
            </div>

            <div class="grid gap-4 md:grid-cols-3">
              <div class="space-y-2">
                <Label>Lokasi</Label>
                <Input v-model="form.location" placeholder="Jakarta (Remote)" />
              </div>
              <div class="space-y-2">
                <Label>Tanggal Mulai</Label>
                <Input type="date" v-model="form.startDate" required />
              </div>
              <div class="space-y-2">
                <Label>Tanggal Selesai</Label>
                <div class="flex gap-2 items-center">
                   <Input type="date" v-model="form.endDate" :disabled="isPresent" />
                </div>
                <div class="flex items-center space-x-2 mt-2">
                  <Checkbox id="present" :checked="isPresent" @update:checked="(v) => isPresent = v" />
                  <label for="present" class="text-xs text-muted-foreground cursor-pointer">Masih bekerja di sini</label>
                </div>
              </div>
            </div>

            <div class="space-y-2">
              <Label>Deskripsi Pekerjaan</Label>
              <Textarea 
                v-model="form.description" 
                rows="4" 
                placeholder="Jelaskan tanggung jawab dan pencapaian utama..." 
              />
            </div>

            <div class="flex justify-end gap-2 pt-2">
              <Button type="submit" :disabled="loading">
                <Spinner v-if="loading" class="mr-2" />
                {{ loading ? 'Menyimpan...' : 'Simpan Data' }}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>

    <div class="rounded-xl border bg-white shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Posisi & Perusahaan</TableHead>
            <TableHead>Periode</TableHead>
            <TableHead>Lokasi</TableHead>
            <TableHead class="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="exp in experiences" :key="exp.id">
            <TableCell>
              <div class="font-medium">{{ exp.position }}</div>
              <div class="text-xs text-muted-foreground">{{ exp.company }}</div>
            </TableCell>
            <TableCell>
              <div class="text-sm">
                {{ formatDate(exp.startDate) }} - 
                <span v-if="exp.endDate">{{ formatDate(exp.endDate) }}</span>
                <Badge v-else variant="secondary" class="ml-1 text-[10px]">Present</Badge>
              </div>
            </TableCell>
            <TableCell class="text-sm text-muted-foreground">
              {{ exp.location || '-' }}
            </TableCell>
            <TableCell class="text-right">
              <Button variant="ghost" size="icon" class="text-destructive hover:bg-destructive/10" @click="deleteItem(exp.id)">
                <TrashIcon class="w-4 h-4" />
              </Button>
            </TableCell>
          </TableRow>
          <TableRow v-if="!experiences || experiences.length === 0">
            <TableCell colspan="4" class="h-24 text-center text-muted-foreground">
              Belum ada riwayat pengalaman.
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toast } from 'vue-sonner'
import { TrashIcon } from 'lucide-vue-next'

// Shadcn imports
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import Spinner from '@/components/ui/spinner/Spinner.vue'

definePageMeta({ layout: 'admin' })

const { data: experiences, refresh } = await useFetch('/api/experience', { key: 'admin-exp' })

const showForm = ref(false)
const loading = ref(false)
const isPresent = ref(false)

const form = reactive({
  position: '',
  company: '',
  location: '',
  startDate: '',
  endDate: '',
  description: ''
})

const toggleForm = () => {
  showForm.value = !showForm.value
  if (!showForm.value) resetForm()
}

const resetForm = () => {
  form.position = ''; form.company = ''; form.location = '';
  form.startDate = ''; form.endDate = ''; form.description = '';
  isPresent.value = false;
}

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })
}

const handleSubmit = async () => {
  loading.value = true
  try {
    await $fetch('/api/experience', {
      method: 'POST',
      body: {
        ...form,
        endDate: isPresent.value ? null : form.endDate
      }
    })
    toast.success('Pengalaman berhasil ditambahkan')
    await refresh()
    toggleForm()
  } catch (err: any) {
    toast.error('Gagal menyimpan data')
  } finally {
    loading.value = false
  }
}

const deleteItem = async (id: string) => {
  if (!confirm('Hapus item ini?')) return
  try {
    await $fetch(`/api/experience/${id}`, { method: 'DELETE' })
    await refresh()
    toast.success('Data dihapus')
  } catch (err) {
    toast.error('Gagal menghapus')
  }
}
</script>