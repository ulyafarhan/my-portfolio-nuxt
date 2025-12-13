<template>
  <div class="p-8 max-w-7xl mx-auto">
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Blog Management</h1>
        <p class="text-muted-foreground">Kelola artikel dan konten publikasi Anda.</p>
      </div>
      <Button @click="toggleForm" :variant="showForm ? 'secondary' : 'default'">
        {{ showForm ? 'Batal' : '+ Tulis Artikel' }}
      </Button>
    </div>

    <div v-if="showForm" class="mb-12 animate-in fade-in slide-in-from-top-4">
      <Card>
        <CardHeader>
          <CardTitle>{{ isEditing ? 'Edit Artikel' : 'Artikel Baru' }}</CardTitle>
          <CardDescription>Isi detail artikel di bawah ini. Slug akan digenerate otomatis dari judul.</CardDescription>
        </CardHeader>
        <CardContent>
          <form @submit.prevent="handleSubmit" class="space-y-6">
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <Label>Judul Artikel</Label>
                <Input 
                  v-model="form.title" 
                  placeholder="Contoh: Tutorial Nuxt 4 Lengkap" 
                  required 
                  @input="handleTitleInput"
                />
              </div>
              <div class="space-y-2">
                <Label>Slug (URL)</Label>
                <div class="relative">
                  <Input v-model="form.slug" placeholder="tutorial-nuxt-4-lengkap" required />
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    class="absolute right-1 top-1 h-7 w-7" 
                    @click="regenerateSlug" 
                    title="Regenerate Slug"
                  >
                    <RefreshCwIcon class="h-3 w-3" />
                  </Button>
                </div>
                <p class="text-xs text-muted-foreground">URL: /blog/{{ form.slug }}</p>
              </div>
            </div>

            <div class="space-y-2">
              <Label>Konten</Label>
              <Tabs default-value="write" class="w-full border rounded-md">
                <div class="flex items-center justify-between px-4 py-2 border-b bg-muted/40">
                  <TabsList>
                    <TabsTrigger value="write" class="text-xs">Write</TabsTrigger>
                    <TabsTrigger value="preview" class="text-xs">Preview</TabsTrigger>
                  </TabsList>
                  <span class="text-xs text-muted-foreground">Markdown Supported</span>
                </div>
                
                <TabsContent value="write" class="p-0 m-0">
                  <Textarea 
                    v-model="form.content" 
                    class="min-h-[400px] border-0 focus-visible:ring-0 rounded-none font-mono text-sm leading-relaxed resize-y" 
                    placeholder="# Mulai menulis di sini..." 
                  />
                </TabsContent>
                
                <TabsContent value="preview" class="p-6 min-h-[400px] prose prose-sm dark:prose-invert max-w-none overflow-y-auto">
                  <div v-if="parsedContent" v-html="parsedContent"></div>
                  <div v-else class="text-muted-foreground text-center italic mt-20">
                    Belum ada konten untuk ditampilkan.
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <Label>Ringkasan (Excerpt)</Label>
                <Textarea v-model="form.excerpt" rows="3" placeholder="Deskripsi singkat untuk kartu artikel..." />
              </div>
              <div class="space-y-4">
                <div class="space-y-2">
                  <Label>Cover Image URL</Label>
                  <Input v-model="form.coverImage" placeholder="https://..." />
                </div>
                <div class="flex items-center space-x-2 border p-3 rounded-md bg-muted/20">
                  <Checkbox 
                    id="pub" 
                    :checked="form.isPublished"
                    @update:checked="(v) => form.isPublished = v"
                  />
                  <div class="grid gap-1.5 leading-none">
                    <label for="pub" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Publikasikan Sekarang
                    </label>
                    <p class="text-xs text-muted-foreground">
                      Jika tidak dicentang, artikel akan disimpan sebagai Draft.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="ghost" @click="toggleForm">Batal</Button>
              <Button type="submit" :disabled="loading">
                <Spinner v-if="loading" class="mr-2" />
                {{ isEditing ? 'Simpan Perubahan' : 'Terbitkan Artikel' }}
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
            <TableHead class="w-[400px]">Artikel</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Tanggal</TableHead>
            <TableHead class="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="post in posts" :key="post.id">
            <TableCell>
              <div class="font-medium">{{ post.title }}</div>
              <div class="text-xs text-muted-foreground truncate max-w-[300px]">/{{ post.slug }}</div>
            </TableCell>
            <TableCell>
              <Badge :variant="post.isPublished ? 'default' : 'secondary'">
                {{ post.isPublished ? 'Published' : 'Draft' }}
              </Badge>
            </TableCell>
            <TableCell class="text-muted-foreground text-sm">
              {{ new Date(post.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) }}
            </TableCell>
            <TableCell class="text-right space-x-2">
              <Button variant="ghost" size="icon" @click="deletePost(post.id)" class="text-destructive hover:text-destructive hover:bg-destructive/10">
                <TrashIcon class="w-4 h-4" />
              </Button>
            </TableCell>
          </TableRow>
          <TableRow v-if="!posts || posts.length === 0">
            <TableCell colspan="4" class="h-24 text-center">
              Belum ada artikel. Yuk mulai menulis!
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
import MarkdownIt from 'markdown-it'
import { RefreshCwIcon, TrashIcon } from 'lucide-vue-next'

// UI Components Imports
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import Spinner from '@/components/ui/spinner/Spinner.vue'

definePageMeta({ layout: 'admin' })

// --- State ---
const md = new MarkdownIt()
const { data: posts, refresh } = await useFetch('/api/blog', { key: 'admin-posts' })

const showForm = ref(false)
const loading = ref(false)
const isEditing = ref(false)
const isSlugManuallyEdited = ref(false)

const form = reactive({
  id: '',
  title: '',
  slug: '',
  content: '',
  excerpt: '',
  coverImage: '',
  isPublished: true
})

// --- Computed ---
const parsedContent = computed(() => {
  return form.content ? md.render(form.content) : ''
})

// --- Methods ---
const toggleForm = () => {
  showForm.value = !showForm.value
  if (!showForm.value) resetForm()
}

const handleTitleInput = () => {
  if (!isSlugManuallyEdited.value) {
    form.slug = slugify(form.title)
  }
}

const regenerateSlug = () => {
  form.slug = slugify(form.title)
  isSlugManuallyEdited.value = false
  toast.info('Slug diperbarui dari judul')
}

watch(() => form.slug, (val) => {
  if (val !== slugify(form.title)) {
    isSlugManuallyEdited.value = true
  }
})

const handleSubmit = async () => {
  loading.value = true
  try {
    const endpoint = '/api/blog'
    const method = isEditing.value ? 'PUT' : 'POST'
    
    await $fetch(endpoint, {
      method,
      body: form
    })
    
    toast.success(isEditing.value ? 'Artikel diperbarui!' : 'Artikel berhasil diterbitkan!')
    toggleForm()
    await refresh()
    
  } catch (err: any) {
    toast.error(err.statusMessage || 'Gagal menyimpan artikel')
  } finally {
    loading.value = false
  }
}

const deletePost = async (id: string) => {
  if (!confirm('Yakin ingin menghapus artikel ini permanen?')) return
  
  try {
    await $fetch(`/api/blog/${id}`, { method: 'DELETE' })
    await refresh()
    toast.success('Artikel dihapus')
  } catch (err) {
    toast.error('Gagal menghapus artikel')
  }
}

const resetForm = () => {
  form.id = ''
  form.title = ''
  form.slug = ''
  form.content = ''
  form.excerpt = ''
  form.coverImage = ''
  form.isPublished = true
  isEditing.value = false
  isSlugManuallyEdited.value = false
}
</script>

<style scoped>
/* PENGGANTIAN KE CSS STANDARD UNTUK MENGHINDARI ERROR @APPLY TAILWIND V4 */

:deep(.prose) h1 { 
  font-size: 1.5rem; /* text-2xl */
  line-height: 2rem;
  font-weight: 700; /* font-bold */
  margin-bottom: 1rem; /* mb-4 */
  margin-top: 1.5rem; /* mt-6 */
}

:deep(.prose) h2 { 
  font-size: 1.25rem; /* text-xl */
  line-height: 1.75rem;
  font-weight: 700;
  margin-bottom: 0.75rem; /* mb-3 */
  margin-top: 1.25rem; /* mt-5 */
}

:deep(.prose) p { 
  margin-bottom: 1rem; /* mb-4 */
  line-height: 1.625; /* leading-relaxed */
}

:deep(.prose) ul { 
  list-style-type: disc;
  list-style-position: inside;
  margin-bottom: 1rem;
}

:deep(.prose) blockquote { 
  border-left-width: 4px;
  border-left-color: #d1d5db; /* border-gray-300 */
  padding-left: 1rem;
  font-style: italic;
  margin-top: 1rem;
  margin-bottom: 1rem;
}

:deep(.prose) code { 
  background-color: #f4f4f5; /* bg-muted fallback */
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-size: 0.875rem; /* text-sm */
  font-family: monospace;
}

:deep(.prose) pre { 
  background-color: #18181b; /* bg-zinc-900 */
  color: white;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin-bottom: 1rem;
}

:deep(.prose) a { 
  color: #2563eb; /* text-blue-600 */
  text-decoration: none;
}

:deep(.prose) a:hover {
  text-decoration: underline;
}
</style>