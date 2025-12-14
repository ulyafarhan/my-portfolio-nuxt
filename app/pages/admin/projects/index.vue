<template>
  <div class="p-8 max-w-6xl mx-auto">
    <div class="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Projects</h1>
        <p class="text-muted-foreground">Kelola portofolio dan optimasi SEO project Anda.</p>
      </div>
      <Button @click="toggleForm" :variant="showForm ? 'secondary' : 'default'">
        {{ showForm ? 'Batal' : '+ Project Baru' }}
      </Button>
    </div>

    <div v-if="showForm" class="mb-10 rounded-xl border bg-card text-card-foreground shadow-sm animate-in fade-in slide-in-from-top-2">
      <div class="p-6 space-y-6">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div class="grid gap-8 md:grid-cols-2">
            <div class="space-y-5">
              <div class="space-y-2">
                <Label for="title">Judul Project</Label>
                <Input 
                  id="title" 
                  v-model="form.title" 
                  placeholder="Contoh: Super App 2025" 
                  @input="handleTitleInput"
                  required
                />
              </div>
              
              <div class="space-y-2">
                <Label for="slug">Slug (URL SEO)</Label>
                <div class="flex gap-2">
                  <Input v-model="form.slug" placeholder="super-app-2025" class="font-mono text-xs" />
                  <Button type="button" variant="outline" size="icon" @click="regenerateSlug" title="Regenerate Slug">
                    <RefreshCwIcon class="h-4 w-4" />
                  </Button>
                </div>
                <p class="text-[10px] text-muted-foreground">
                  Preview: https://ulyafarhan.com/projects/<span class="text-primary">{{ form.slug || '...' }}</span>
                </p>
              </div>

              <div class="space-y-2">
                <Label>Tech Stack</Label>
                <Input v-model="techInput" placeholder="Vue, Nuxt, Tailwind (Pisahkan koma)" />
                <div class="flex flex-wrap gap-1 mt-2 min-h-[24px]">
                  <Badge v-for="tech in previewTechStack" :key="tech" variant="secondary" class="text-xs">
                    {{ tech }}
                  </Badge>
                </div>
              </div>

               <div class="space-y-2">
                <Label for="desc">Deskripsi (Meta Description)</Label>
                <Textarea 
                  id="desc" 
                  v-model="form.description" 
                  placeholder="Deskripsi singkat yang mengandung kata kunci untuk SEO (maks 160 karakter disarankan)." 
                  class="min-h-[120px]"
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
                  <Input v-model="form.repoUrl" placeholder="github.com/..." />
                </div>
                <div class="space-y-2">
                  <Label>Demo URL</Label>
                  <Input v-model="form.demoUrl" placeholder="app.com" />
                </div>
              </div>

              <div class="flex items-center space-x-2 border rounded-lg p-4 bg-muted/20 mt-4">
                <Checkbox id="feat" :checked="form.isFeatured" @update:checked="(v) => form.isFeatured = v" />
                <div class="grid gap-1.5 leading-none">
                  <label for="feat" class="text-sm font-medium leading-none cursor-pointer">
                    Featured Project
                  </label>
                  <p class="text-xs text-muted-foreground">
                    Tampilkan project ini di halaman beranda (Hero Section).
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-6 border-t">
            <Button type="button" variant="ghost" @click="toggleForm">Batal</Button>
            <Button type="submit" :disabled="loading">
              <Spinner v-if="loading" class="mr-2" />
              {{ loading ? 'Menyimpan...' : 'Simpan Project' }}
            </Button>
          </div>
        </form>
      </div>
    </div>

    <div class="rounded-xl border bg-white shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead class="w-[80px]">Image</TableHead>
            <TableHead class="w-[250px]">Project</TableHead>
            <TableHead>Tech Stack</TableHead>
            <TableHead>Status</TableHead>
            <TableHead class="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="project in projects" :key="project.id">
            <TableCell>
              <div class="h-10 w-16 overflow-hidden rounded bg-muted">
                <img v-if="project.thumbnail" :src="project.thumbnail" class="h-full w-full object-cover" alt="" />
              </div>
            </TableCell>
            <TableCell>
              <div class="font-medium">{{ project.title }}</div>
              <div class="text-xs text-muted-foreground truncate font-mono">/{{ project.slug }}</div>
            </TableCell>
            <TableCell>
              <div class="flex flex-wrap gap-1">
                <Badge v-for="t in (project.techStack as string[]).slice(0, 3)" :key="t" variant="outline" class="text-[10px]">
                  {{ t }}
                </Badge>
                <span v-if="(project.techStack as string[]).length > 3" class="text-[10px] text-muted-foreground">
                  +{{ (project.techStack as string[]).length - 3 }}
                </span>
              </div>
            </TableCell>
            <TableCell>
              <Badge :variant="project.isFeatured ? 'default' : 'secondary'">
                {{ project.isFeatured ? 'Featured' : 'Standard' }}
              </Badge>
            </TableCell>
            <TableCell class="text-right space-x-2">
              <Button variant="ghost" size="icon" class="text-destructive hover:bg-destructive/10" @click="deleteProject(project.id)">
                <TrashIcon class="w-4 h-4" />
              </Button>
            </TableCell>
          </TableRow>
          
          <TableRow v-if="!projects || projects.length === 0">
            <TableCell colspan="5" class="h-32 text-center text-muted-foreground">
              Belum ada project. Mulai bangun portofolio Anda!
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
import { RefreshCwIcon, TrashIcon } from 'lucide-vue-next'
// Import komponen upload gambar
import ImageUpload from '@/components/admin/ImageUpload.vue'

// Shadcn Components
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import Spinner from '@/components/ui/spinner/Spinner.vue'

definePageMeta({ layout: 'admin' })

const { data: projects, refresh } = await useFetch('/api/portfolio', { key: 'admin-projects' })
const showForm = ref(false)
const loading = ref(false)
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

// Auto-Slug Logic
const handleTitleInput = () => {
  if (!isManualSlug.value) {
    form.slug = slugify(form.title)
  }
}

const regenerateSlug = () => {
  form.slug = slugify(form.title)
  isManualSlug.value = false
  toast.info('Slug di-reset sesuai judul')
}

watch(() => form.slug, (val) => {
  if (val !== slugify(form.title)) {
    isManualSlug.value = true
  }
})

// Computed Tech Stack untuk preview realtime
const previewTechStack = computed(() => {
  return techInput.value.split(',').map(s => s.trim()).filter(Boolean)
})

const toggleForm = () => {
  showForm.value = !showForm.value
  if(!showForm.value) resetForm()
}

const resetForm = () => {
  form.title = ''; form.slug = ''; form.description = ''; 
  form.thumbnail = ''; form.repoUrl = ''; form.demoUrl = '';
  form.isFeatured = false; techInput.value = ''; isManualSlug.value = false;
}

const handleSubmit = async () => {
  loading.value = true
  try {
    await $fetch('/api/portfolio', {
      method: 'POST',
      body: {
        ...form,
        techStack: previewTechStack.value
      }
    })
    
    toast.success('Project berhasil diterbitkan!')
    await refresh()
    toggleForm()
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