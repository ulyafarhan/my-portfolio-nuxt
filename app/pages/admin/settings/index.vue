<template>
  <div class="min-h-screen bg-background text-foreground p-4 md:p-8 w-full space-y-8">
    
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl md:text-3xl font-bold tracking-tight">Projects</h1>
        <p class="text-sm md:text-base text-muted-foreground">Showcase karya terbaik Anda.</p>
      </div>
      <div class="flex gap-2">
        <Button 
          @click="openCreate" 
          :variant="showForm ? 'secondary' : 'default'"
          class="w-full sm:w-auto shadow-sm"
        >
          <component :is="showForm ? XIcon : PlusIcon" class="mr-2 h-4 w-4" />
          {{ showForm ? 'Tutup' : 'Project Baru' }}
        </Button>
      </div>
    </div>

    <div v-if="showForm" class="rounded-xl border bg-card text-card-foreground shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
      <div class="p-6 border-b flex justify-between items-center">
        <h3 class="text-lg font-semibold">{{ isEditing ? 'Edit Project' : 'Tambah Project' }}</h3>
        <Button variant="ghost" size="sm" @click="closeForm">
          <XIcon class="h-4 w-4" />
        </Button>
      </div>

      <div class="p-6">
        <form @submit.prevent="handleSubmit" class="space-y-8">
          <div class="grid lg:grid-cols-2 gap-8">
            <div class="space-y-5">
              <div class="space-y-2">
                <Label>Judul Project</Label>
                <Input 
                  v-model="form.title" 
                  placeholder="Super App 2025" 
                  @input="handleTitleInput"
                  required 
                  class="bg-background text-lg font-medium"
                />
              </div>
              
              <div class="space-y-2">
                <Label>Slug URL</Label>
                <div class="flex gap-2">
                  <Input v-model="form.slug" placeholder="super-app-2025" class="bg-background font-mono text-sm" />
                  <Button type="button" variant="outline" size="icon" @click="regenerateSlug" title="Reset Slug">
                    <RefreshCwIcon class="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div class="space-y-2">
                <Label>Tech Stack</Label>
                <Input 
                  v-model="techInput" 
                  placeholder="Vue, Nuxt, Tailwind (Pisahkan dengan koma)" 
                  class="bg-background" 
                />
                <div class="flex flex-wrap gap-1 mt-2 min-h-[28px]">
                  <Badge v-for="(tech, idx) in previewTechStack" :key="idx" variant="secondary" class="text-xs">
                    {{ tech }}
                  </Badge>
                </div>
              </div>

               <div class="space-y-2">
                <Label>Deskripsi</Label>
                <Textarea 
                  v-model="form.description" 
                  placeholder="Deskripsi singkat project..." 
                  class="bg-background min-h-[120px]"
                />
              </div>
            </div>

            <div class="space-y-5">
              <div class="space-y-2">
                <Label>Thumbnail Project</Label>
                <ImageUpload v-model="form.thumbnail" />
              </div>
              
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                  <Label>Repo URL</Label>
                  <Input v-model="form.repoUrl" placeholder="github.com/..." class="bg-background" />
                </div>
                <div class="space-y-2">
                  <Label>Demo URL</Label>
                  <Input v-model="form.demoUrl" placeholder="app.com" class="bg-background" />
                </div>
              </div>

              <div class="flex items-center space-x-3 border p-4 rounded-lg bg-muted/20 mt-2">
                <Switch :checked="form.isFeatured" @update:checked="(v) => form.isFeatured = v" />
                <div class="flex flex-col">
                  <Label class="cursor-pointer font-medium">Featured Project</Label>
                  <span class="text-xs text-muted-foreground">Tampilkan di halaman utama (Hero Section).</span>
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-6 border-t">
            <Button type="button" variant="ghost" @click="closeForm">Batal</Button>
            <Button type="submit" :disabled="loading">
              <Spinner v-if="loading" class="mr-2" />
              {{ isEditing ? 'Update Project' : 'Simpan Project' }}
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
              <TableHead class="w-[100px]">Thumbnail</TableHead>
              <TableHead class="min-w-[200px]">Project Info</TableHead>
              <TableHead class="hidden md:table-cell">Tech Stack</TableHead>
              <TableHead class="w-[100px]">Status</TableHead>
              <TableHead class="text-right w-[100px]">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="project in projects" :key="project.id" class="group hover:bg-muted/10 transition-colors">
              <TableCell>
                <div class="h-12 w-20 overflow-hidden rounded-md border bg-muted">
                  <img 
                    v-if="project.thumbnail" 
                    :src="project.thumbnail" 
                    class="h-full w-full object-cover transition-transform group-hover:scale-105" 
                    alt="Thumb" 
                  />
                  <div v-else class="h-full w-full flex items-center justify-center text-muted-foreground">
                    <ImageIcon class="h-5 w-5 opacity-20" />
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div class="flex flex-col gap-1">
                  <span class="font-medium text-foreground line-clamp-1">{{ project.title }}</span>
                  <a :href="`/portfolio/${project.slug}`" target="_blank" class="text-xs text-muted-foreground hover:text-primary font-mono truncate max-w-[150px] flex items-center gap-1">
                    /{{ project.slug }} <ExternalLinkIcon class="w-2.5 h-2.5" />
                  </a>
                </div>
              </TableCell>
              <TableCell class="hidden md:table-cell">
                <div class="flex flex-wrap gap-1">
                  <Badge 
                    v-for="t in (project.techStack as string[] || []).slice(0, 3)" 
                    :key="t" 
                    variant="outline" 
                    class="text-[10px] border-primary/20 bg-primary/5"
                  >
                    {{ t }}
                  </Badge>
                  <span v-if="(project.techStack as string[] || []).length > 3" class="text-[10px] text-muted-foreground px-1">
                    +{{ (project.techStack as string[]).length - 3 }}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <Badge :variant="project.isFeatured ? 'default' : 'secondary'">
                  {{ project.isFeatured ? 'Featured' : 'Regular' }}
                </Badge>
              </TableCell>
              <TableCell class="text-right">
                <div class="flex justify-end gap-1">
                  <Button variant="ghost" size="icon" class="h-8 w-8 text-muted-foreground hover:text-foreground" @click="editProject(project)">
                    <PencilIcon class="w-3.5 h-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" class="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive" @click="deleteProject(project.id)">
                    <TrashIcon class="w-3.5 h-3.5" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
            
            <TableRow v-if="!projects || projects.length === 0">
              <TableCell colspan="5" class="h-40 text-center text-muted-foreground">
                <div class="flex flex-col items-center gap-2">
                  <FolderOpenIcon class="h-10 w-10 opacity-20" />
                  <p>Belum ada project.</p>
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
import { slugify } from '~/lib/utils'
import { toast } from 'vue-sonner'
import { 
  RefreshCwIcon, TrashIcon, PencilIcon, PlusIcon, XIcon, 
  ImageIcon, ExternalLinkIcon, FolderOpenIcon 
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

const form = reactive({
  title: '',
  slug: '',
  description: '',
  thumbnail: '',
  repoUrl: '',
  demoUrl: '',
  isFeatured: false
})

// Tech Stack Handling (Convert String <-> Array)
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

// Watch slug manual edit
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
  
  // Convert Array -> String untuk input
  techInput.value = (project.techStack || []).join(', ')
  
  isManualSlug.value = true // Agar slug tidak berubah sendiri saat edit
  showForm.value = true
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleSubmit = async () => {
  loading.value = true
  try {
    const payload = {
      ...form,
      techStack: previewTechStack.value // Kirim sebagai Array
    }

    if (isEditing.value && editingId.value) {
      await $fetch(`/api/portfolio/${editingId.value}`, {
        method: 'PUT',
        body: payload
      })
      toast.success('Project berhasil diupdate!')
    } else {
      await $fetch('/api/portfolio', {
        method: 'POST',
        body: payload
      })
      toast.success('Project diterbitkan!')
    }
    
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