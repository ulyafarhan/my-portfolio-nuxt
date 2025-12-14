<template>
  <div class="w-full p-6 lg:p-10 space-y-8 bg-background min-h-screen text-foreground">
    
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b pb-6">
      <div class="space-y-1">
        <h1 class="text-3xl font-bold tracking-tight">Projects</h1>
        <p class="text-muted-foreground text-base">Kelola daftar portofolio yang ditampilkan di website utama.</p>
      </div>
      <div class="flex items-center gap-3">
        <div class="relative w-full sm:w-64">
          <SearchIcon class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            v-model="searchQuery" 
            placeholder="Cari project..." 
            class="pl-9 bg-card border-input" 
          />
        </div>
        <Button @click="openCreate" class="shadow-md transition-all hover:scale-105 active:scale-95">
          <PlusIcon class="mr-2 h-4 w-4" /> Project Baru
        </Button>
      </div>
    </div>

    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform -translate-y-4 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform -translate-y-4 opacity-0"
    >
      <div v-if="showForm" class="rounded-xl border bg-card shadow-lg overflow-hidden mb-8">
        <div class="bg-muted/40 px-6 py-4 border-b flex justify-between items-center">
          <div>
            <h3 class="font-semibold text-lg">{{ isEditing ? 'Edit Project' : 'Tambah Project Baru' }}</h3>
            <p class="text-xs text-muted-foreground">Pastikan data project lengkap untuk hasil SEO maksimal.</p>
          </div>
          <Button variant="ghost" size="icon" @click="closeForm" class="hover:bg-destructive/10 hover:text-destructive rounded-full">
            <XIcon class="h-5 w-5" />
          </Button>
        </div>

        <div class="p-6 md:p-8">
          <form @submit.prevent="handleSubmit" class="space-y-8">
            <div class="grid lg:grid-cols-12 gap-8">
              <div class="lg:col-span-8 space-y-6">
                <div class="grid gap-6 md:grid-cols-2">
                  <div class="space-y-2">
                    <Label>Judul Project</Label>
                    <Input v-model="form.title" placeholder="Contoh: Super App 2025" @input="handleTitleInput" required class="bg-background text-lg py-6 font-medium" />
                  </div>
                  <div class="space-y-2">
                    <Label>Slug URL</Label>
                    <div class="flex gap-2">
                      <Input v-model="form.slug" class="bg-background font-mono text-xs py-6" />
                      <Button type="button" variant="outline" size="icon" @click="regenerateSlug" title="Reset Slug" class="h-auto w-12">
                        <RefreshCwIcon class="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div class="space-y-2">
                  <Label>Deskripsi</Label>
                  <Textarea v-model="form.description" placeholder="Deskripsi singkat project..." class="min-h-[150px] bg-background resize-none leading-relaxed" />
                </div>

                <div class="space-y-3">
                  <Label>Tech Stack</Label>
                  <Input v-model="techInput" placeholder="Vue, Nuxt, Tailwind (Pisahkan dengan koma)" class="bg-background" />
                  <div class="flex flex-wrap gap-2 pt-1 min-h-[32px]">
                    <Badge v-for="tech in previewTechStack" :key="tech" variant="secondary" class="px-2 py-1 text-xs">
                      {{ tech }}
                    </Badge>
                  </div>
                </div>
              </div>

              <div class="lg:col-span-4 space-y-6">
                <div class="space-y-3 p-4 border rounded-xl bg-muted/20">
                  <Label class="text-sm font-semibold">Thumbnail Project</Label>
                  <div class="aspect-video bg-background rounded-lg border overflow-hidden shadow-sm">
                    <ImageUpload v-model="form.thumbnail" />
                  </div>
                </div>

                <div class="space-y-4">
                  <div class="space-y-2">
                    <Label>Repository URL</Label>
                    <Input v-model="form.repoUrl" placeholder="https://github.com/..." class="bg-background" />
                  </div>
                  <div class="space-y-2">
                    <Label>Demo URL</Label>
                    <Input v-model="form.demoUrl" placeholder="https://app.com" class="bg-background" />
                  </div>
                </div>

                <div class="flex items-center justify-between border p-4 rounded-xl bg-card shadow-sm">
                  <div class="space-y-0.5">
                    <Label class="text-base cursor-pointer">Featured</Label>
                    <p class="text-[10px] text-muted-foreground">Tampil di halaman depan.</p>
                  </div>
                  <Switch :checked="form.isFeatured" @update:checked="(v) => form.isFeatured = v" />
                </div>
              </div>
            </div>

            <div class="flex items-center justify-end gap-3 pt-6 border-t">
              <Button type="button" variant="outline" @click="closeForm">Batal</Button>
              <Button type="submit" :disabled="loading" class="px-8">
                <Spinner v-if="loading" class="mr-2" />
                {{ isEditing ? 'Simpan Perubahan' : 'Terbitkan Project' }}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </transition>

    <div class="rounded-xl border bg-card shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow class="bg-muted/40 hover:bg-muted/40 border-b border-border/50">
            <TableHead class="w-[100px] pl-6 font-semibold">Thumbnail</TableHead>
            <TableHead class="min-w-[250px] font-semibold">Project Info</TableHead>
            <TableHead class="hidden md:table-cell font-semibold">Tech Stack</TableHead>
            <TableHead class="w-[120px] font-semibold">Status</TableHead>
            <TableHead class="w-[100px] pr-6 text-right font-semibold">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="project in filteredProjects" :key="project.id" class="group hover:bg-muted/10 transition-colors border-b border-border/40 last:border-0">
            <TableCell class="pl-6 py-4">
              <div class="h-14 w-24 overflow-hidden rounded-lg border bg-muted shadow-sm group-hover:shadow-md transition-all">
                <img 
                  v-if="project.thumbnail" 
                  :src="project.thumbnail" 
                  class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  alt="Thumb" 
                />
                <div v-else class="h-full w-full flex items-center justify-center text-muted-foreground">
                  <ImageIcon class="h-5 w-5 opacity-20" />
                </div>
              </div>
            </TableCell>
            <TableCell class="py-4">
              <div class="flex flex-col gap-1.5">
                <span class="font-bold text-foreground text-base tracking-tight">{{ project.title }}</span>
                <div class="flex items-center gap-2 text-xs text-muted-foreground">
                  <span class="font-mono bg-muted px-1.5 py-0.5 rounded">/{{ project.slug }}</span>
                  <a v-if="project.demoUrl" :href="project.demoUrl" target="_blank" class="hover:text-primary transition-colors">
                    <ExternalLinkIcon class="h-3 w-3" />
                  </a>
                </div>
              </div>
            </TableCell>
            <TableCell class="hidden md:table-cell py-4">
              <div class="flex flex-wrap gap-1.5">
                <Badge 
                  v-for="(t, i) in (project.techStack as string[] || []).slice(0, 3)" 
                  :key="i" 
                  variant="outline" 
                  class="bg-background/50 backdrop-blur font-normal text-[11px]"
                >
                  {{ t }}
                </Badge>
                <span v-if="(project.techStack?.length || 0) > 3" class="text-xs text-muted-foreground px-1 self-center">
                  +{{ (project.techStack?.length || 0) - 3 }}
                </span>
              </div>
            </TableCell>
            <TableCell class="py-4">
              <Badge :variant="project.isFeatured ? 'default' : 'secondary'" class="shadow-sm">
                {{ project.isFeatured ? 'Featured' : 'Standard' }}
              </Badge>
            </TableCell>
            <TableCell class="pr-6 py-4 text-right">
              <div class="flex justify-end gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-200">
                <Button variant="ghost" size="icon" class="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-background border border-transparent hover:border-border hover:shadow-sm rounded-lg" @click="editProject(project)">
                  <PencilIcon class="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" class="h-8 w-8 text-destructive hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg" @click="deleteProject(project.id)">
                  <TrashIcon class="h-3.5 w-3.5" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
          
          <TableRow v-if="filteredProjects.length === 0">
            <TableCell colspan="5" class="h-64 text-center">
              <div class="flex flex-col items-center justify-center gap-3 text-muted-foreground">
                <div class="p-4 rounded-full bg-muted/50">
                  <FolderOpenIcon class="h-8 w-8 opacity-40" />
                </div>
                <div class="space-y-1">
                  <p class="font-medium text-foreground">Tidak ada project ditemukan.</p>
                  <p class="text-xs">Coba kata kunci lain atau buat project baru.</p>
                </div>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { slugify } from '~/lib/utils'
import { toast } from 'vue-sonner'
import { 
  RefreshCwIcon, TrashIcon, PencilIcon, PlusIcon, XIcon, 
  ImageIcon, ExternalLinkIcon, FolderOpenIcon, SearchIcon 
} from 'lucide-vue-next'
import ImageUpload from '@/components/admin/ImageUpload.vue'

// UI Imports
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import Spinner from '@/components/ui/spinner/Spinner.vue'

definePageMeta({ layout: 'admin' })

const { data: projects, refresh } = await useFetch('/api/portfolio', { key: 'admin-projects' })
const showForm = ref(false)
const loading = ref(false)
const isEditing = ref(false)
const editingId = ref<string | null>(null)
const techInput = ref('')
const isManualSlug = ref(false)
const searchQuery = ref('')

const form = reactive({
  title: '',
  slug: '',
  description: '',
  thumbnail: '',
  repoUrl: '',
  demoUrl: '',
  isFeatured: false
})

const filteredProjects = computed(() => {
  if (!projects.value) return []
  if (!searchQuery.value) return projects.value
  
  const q = searchQuery.value.toLowerCase()
  return projects.value.filter((p: any) => 
    p.title.toLowerCase().includes(q) || 
    p.slug.toLowerCase().includes(q) ||
    (p.techStack && p.techStack.some((t: string) => t.toLowerCase().includes(q)))
  )
})

const previewTechStack = computed(() => {
  return techInput.value.split(',').map(s => s.trim()).filter(Boolean)
})

const handleTitleInput = () => {
  if (!isManualSlug.value) form.slug = slugify(form.title)
}

const regenerateSlug = () => {
  form.slug = slugify(form.title)
  isManualSlug.value = false
  toast.info('Slug di-reset dari judul')
}

watch(() => form.slug, (val) => {
  if (val !== slugify(form.title)) isManualSlug.value = true
})

const openCreate = () => {
  resetForm()
  showForm.value = true
  setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100)
}

const closeForm = () => {
  showForm.value = false
  setTimeout(resetForm, 300)
}

const resetForm = () => {
  form.title = ''; form.slug = ''; form.description = ''; 
  form.thumbnail = ''; form.repoUrl = ''; form.demoUrl = '';
  form.isFeatured = false; techInput.value = ''; isManualSlug.value = false;
  isEditing.value = false; editingId.value = null;
}

const editProject = (project: any) => {
  isEditing.value = true
  editingId.value = project.id
  
  form.title = project.title
  form.slug = project.slug
  form.description = project.description
  form.thumbnail = project.thumbnail
  form.repoUrl = project.repoUrl || ''
  form.demoUrl = project.demoUrl || ''
  form.isFeatured = project.isFeatured
  
  techInput.value = (project.techStack || []).join(', ')
  isManualSlug.value = true 
  showForm.value = true
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleSubmit = async () => {
  loading.value = true
  try {
    const payload = {
      ...form,
      techStack: previewTechStack.value
    }

    const endpoint = isEditing.value ? `/api/portfolio/${editingId.value}` : '/api/portfolio'
    const method = isEditing.value ? 'PUT' : 'POST'

    await $fetch(endpoint, { method, body: payload })
    
    toast.success(isEditing.value ? 'Project berhasil diupdate!' : 'Project diterbitkan!')
    await refresh()
    closeForm()
  } catch (err: any) {
    toast.error(err.statusMessage || 'Gagal menyimpan project')
  } finally {
    loading.value = false
  }
}

const deleteProject = async (id: string) => {
  if (!confirm('Hapus project ini permanen?')) return
  try {
    await $fetch(`/api/portfolio/${id}`, { method: 'DELETE' })
    await refresh()
    toast.success('Project dihapus')
  } catch (err) {
    toast.error('Gagal menghapus')
  }
}
</script>