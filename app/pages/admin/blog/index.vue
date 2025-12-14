<template>
  <div class="min-h-screen bg-background text-foreground p-4 md:p-8 w-full space-y-8">
    
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl md:text-3xl font-bold tracking-tight">Blog Engine</h1>
        <p class="text-sm md:text-base text-muted-foreground">Manage artikel dan konten SEO.</p>
      </div>
      <div class="flex gap-2 w-full sm:w-auto">
        <Button 
          @click="toggleForm" 
          :variant="showForm ? 'secondary' : 'default'"
          class="w-full sm:w-auto shadow-sm"
        >
          <component :is="showForm ? XIcon : PlusIcon" class="mr-2 h-4 w-4" />
          {{ showForm ? 'Batal' : 'Tulis Artikel' }}
        </Button>
      </div>
    </div>

    <div v-if="showForm" class="rounded-xl border bg-card text-card-foreground shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
      <div class="p-6 border-b flex justify-between items-center">
        <h3 class="text-lg font-semibold">{{ isEditing ? 'Edit Artikel' : 'Artikel Baru' }}</h3>
        <Button variant="ghost" size="sm" @click="toggleForm">
          <XIcon class="h-4 w-4" />
        </Button>
      </div>

      <div class="p-6">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div class="lg:col-span-2 space-y-6">
            <div class="space-y-2">
              <Label>Judul Artikel</Label>
              <Input 
                v-model="form.title" 
                placeholder="Judul yang menarik..." 
                class="text-lg font-bold bg-background h-12" 
                @input="handleTitleInput" 
              />
            </div>
            
            <div class="space-y-2">
              <Label>Konten</Label>
              <div class="border rounded-md overflow-hidden bg-background min-h-[400px]">
                <ClientOnly>
                  <TiptapEditor v-model="form.content" />
                </ClientOnly>
              </div>
            </div>
          </div>

          <div class="space-y-6">
            <div class="p-5 border rounded-xl bg-muted/10 space-y-5">
               <h3 class="font-semibold flex items-center gap-2">
                 <SettingsIcon class="w-4 h-4" /> Pengaturan Publikasi
               </h3>
               
               <div class="space-y-2">
                  <Label>Cover Image</Label>
                  <ImageUpload v-model="form.coverImage" />
                </div>

                <div class="space-y-2">
                  <Label>Slug URL</Label>
                  <div class="flex gap-2">
                    <Input v-model="form.slug" class="text-xs font-mono bg-background" />
                    <Button variant="outline" size="icon" @click="regenerateSlug" title="Reset Slug">
                      <RefreshCwIcon class="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>

                <div class="space-y-2">
                  <Label>Excerpt (Meta Description)</Label>
                  <Textarea 
                    v-model="form.excerpt" 
                    rows="4" 
                    placeholder="Ringkasan singkat untuk SEO..." 
                    class="bg-background text-sm"
                  />
                </div>

                <div class="flex items-center justify-between border rounded-lg p-3 bg-background shadow-sm">
                  <span class="text-sm font-medium">Status Publish</span>
                  <Switch :checked="form.isPublished" @update:checked="(v) => form.isPublished = v" />
                </div>

                <Button class="w-full" @click="handleSubmit" :disabled="loading">
                  <Spinner v-if="loading" class="mr-2" />
                  {{ isEditing ? 'Update Artikel' : 'Terbitkan Artikel' }}
                </Button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="space-y-4">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div class="relative w-full sm:w-72">
          <SearchIcon class="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input v-model="searchQuery" placeholder="Cari artikel..." class="pl-8 bg-card" />
        </div>
        <div class="text-xs md:text-sm text-muted-foreground self-end sm:self-auto">
          Total: {{ filteredPosts.length }} Artikel
        </div>
      </div>

      <div class="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow class="bg-muted/50 hover:bg-muted/50 border-b">
                <TableHead class="w-[300px] md:w-auto">Artikel</TableHead>
                <TableHead class="w-[100px]">Status</TableHead>
                <TableHead class="hidden md:table-cell w-[150px]">Tanggal</TableHead>
                <TableHead class="text-right w-[100px]">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="post in filteredPosts" :key="post.id" class="group hover:bg-muted/30 transition-colors">
                <TableCell>
                  <div class="flex flex-col gap-1">
                    <span class="font-medium text-foreground line-clamp-1">{{ post.title }}</span>
                    <div class="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                      <span class="truncate max-w-[200px]">/blog/{{ post.slug }}</span>
                      <a :href="`/blog/${post.slug}`" target="_blank" class="hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                        <ExternalLinkIcon class="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge :variant="post.isPublished ? 'default' : 'secondary'" class="capitalize">
                    {{ post.isPublished ? 'Live' : 'Draft' }}
                  </Badge>
                </TableCell>
                <TableCell class="hidden md:table-cell text-muted-foreground text-sm">
                  {{ new Date(post.createdAt).toLocaleDateString('id-ID', { dateStyle: 'medium' }) }}
                </TableCell>
                <TableCell class="text-right">
                  <div class="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" class="h-8 w-8 text-muted-foreground hover:text-foreground" @click="editPost(post)">
                      <PencilIcon class="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" class="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive" @click="deletePost(post.id)">
                      <TrashIcon class="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
               <TableRow v-if="filteredPosts.length === 0">
                <TableCell colspan="4" class="h-40 text-center text-muted-foreground">
                  <div class="flex flex-col items-center gap-2">
                    <FileTextIcon class="h-8 w-8 opacity-20" />
                    <p>Tidak ada artikel yang ditemukan.</p>
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
import { slugify } from '~/lib/utils'
import { toast } from 'vue-sonner'
import { 
  RefreshCwIcon, TrashIcon, PencilIcon, PlusIcon, XIcon, 
  SearchIcon, FileTextIcon, SettingsIcon, ExternalLinkIcon 
} from 'lucide-vue-next'
import TiptapEditor from '@/components/admin/TiptapEditor.vue'
import ImageUpload from '@/components/admin/ImageUpload.vue'

// Import UI Components
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import Spinner from '@/components/ui/spinner/Spinner.vue'

definePageMeta({ layout: 'admin' })

// Fetch Data
const { data: posts, refresh } = await useFetch('/api/blog', { key: 'admin-posts' })

// State Management
const showForm = ref(false)
const loading = ref(false)
const isEditing = ref(false)
const editingId = ref<string | null>(null)
const isSlugManuallyEdited = ref(false)
const searchQuery = ref('')

const form = reactive({
  title: '', slug: '', content: '', excerpt: '', coverImage: '', isPublished: true
})

// Search & Filter
const filteredPosts = computed(() => {
  if(!posts.value) return []
  if(!searchQuery.value) return posts.value
  
  const q = searchQuery.value.toLowerCase()
  return posts.value.filter((p: any) => 
    p.title.toLowerCase().includes(q) || 
    p.slug.toLowerCase().includes(q)
  )
})

// Slug Logic
const handleTitleInput = () => {
  if (!isSlugManuallyEdited.value) form.slug = slugify(form.title)
}

const regenerateSlug = () => {
  form.slug = slugify(form.title)
  isSlugManuallyEdited.value = false
  toast.info('Slug di-reset otomatis')
}

// Form Actions
const toggleForm = () => {
  showForm.value = !showForm.value
  if (!showForm.value) resetForm()
}

const resetForm = () => {
  Object.assign(form, { title: '', slug: '', content: '', excerpt: '', coverImage: '', isPublished: true })
  isEditing.value = false; editingId.value = null; isSlugManuallyEdited.value = false;
}

const editPost = (post: any) => {
  editingId.value = post.id
  Object.assign(form, post)
  isEditing.value = true
  isSlugManuallyEdited.value = true // Agar slug tidak berubah saat judul diedit
  showForm.value = true
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleSubmit = async () => {
  loading.value = true
  try {
    const endpoint = isEditing.value ? `/api/blog/${editingId.value}` : '/api/blog'
    const method = isEditing.value ? 'PUT' : 'POST'
    
    await $fetch(endpoint, { method, body: form })
    
    toast.success(isEditing.value ? 'Artikel berhasil diperbarui' : 'Artikel berhasil diterbitkan')
    await refresh()
    toggleForm()
  } catch (err: any) {
    toast.error(err.statusMessage || 'Gagal menyimpan artikel')
  } finally {
    loading.value = false
  }
}

const deletePost = async (id: string) => {
  if (!confirm('Hapus artikel ini permanen?')) return
  
  try {
    await $fetch(`/api/blog/${id}`, { method: 'DELETE' })
    await refresh()
    toast.success('Artikel dihapus')
  } catch (err) {
    toast.error('Gagal menghapus')
  }
}
</script>