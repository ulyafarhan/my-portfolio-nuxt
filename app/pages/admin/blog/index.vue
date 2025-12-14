<template>
  <div class="p-8 max-w-7xl mx-auto">
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Blog Engine</h1>
        <p class="text-muted-foreground">Manage your articles with AI-assisted SEO.</p>
      </div>
      <Button @click="toggleForm" :variant="showForm ? 'secondary' : 'default'">
        {{ showForm ? 'Batal' : '+ Tulis Artikel' }}
      </Button>
    </div>

    <div v-if="showForm" class="mb-12 animate-in fade-in slide-in-from-top-4">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 space-y-6">
          <Card>
            <CardContent class="pt-6 space-y-6">
              <div class="space-y-2">
                <Label>Judul Artikel</Label>
                <Input v-model="form.title" placeholder="Judul yang menarik..." class="text-lg font-bold" @input="handleTitleInput" />
              </div>
              
              <div class="space-y-2">
                <Label>Konten</Label>
                <ClientOnly>
                  <TiptapEditor v-model="form.content" />
                </ClientOnly>
              </div>
            </CardContent>
          </Card>
        </div>

        <div class="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Publikasi</CardTitle>
            </CardHeader>
            <CardContent class="space-y-4">
              <div class="space-y-2">
                <Label>Cover Image</Label>
                <ImageUpload v-model="form.coverImage" />
              </div>

              <div class="space-y-2">
                <Label>Slug URL</Label>
                <div class="flex gap-2">
                  <Input v-model="form.slug" class="text-xs font-mono" />
                  <Button variant="outline" size="icon" @click="regenerateSlug"><RefreshCwIcon class="h-3 w-3" /></Button>
                </div>
              </div>

              <div class="space-y-2">
                <Label>Excerpt (SEO Meta)</Label>
                <Textarea v-model="form.excerpt" rows="3" placeholder="Ringkasan untuk Google & Social Media..." />
              </div>

              <div class="flex items-center justify-between border rounded-md p-3">
                <span class="text-sm font-medium">Status Publish</span>
                <Switch :checked="form.isPublished" @update:checked="(v) => form.isPublished = v" />
              </div>

              <Button class="w-full" @click="handleSubmit" :disabled="loading">
                <Spinner v-if="loading" class="mr-2" />
                {{ isEditing ? 'Update Artikel' : 'Terbitkan Artikel' }}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>

    <div v-else class="rounded-xl border bg-white shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Artikel</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Tanggal</TableHead>
            <TableHead class="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="post in posts" :key="post.id">
            <TableCell>
              <div class="font-medium">{{ post.title }}</div>
              <div class="text-xs text-muted-foreground truncate max-w-[300px]">/blog/{{ post.slug }}</div>
            </TableCell>
            <TableCell>
              <Badge :variant="post.isPublished ? 'default' : 'secondary'">{{ post.isPublished ? 'Live' : 'Draft' }}</Badge>
            </TableCell>
            <TableCell class="text-muted-foreground text-sm">
              {{ new Date(post.createdAt).toLocaleDateString() }}
            </TableCell>
            <TableCell class="text-right">
              <div class="flex justify-end gap-2">
                <Button variant="ghost" size="icon" @click="editPost(post)"><PencilIcon class="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" class="text-destructive" @click="deletePost(post.id)"><TrashIcon class="w-4 h-4" /></Button>
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
import { RefreshCwIcon, TrashIcon, PencilIcon } from 'lucide-vue-next'
import TiptapEditor from '@/components/admin/TiptapEditor.vue'
import ImageUpload from '@/components/admin/ImageUpload.vue'

// Import Shadcn Components... (Button, Input, etc - Auto imported by Nuxt usually, but explicitly needed if not)
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import Spinner from '@/components/ui/spinner/Spinner.vue'

definePageMeta({ layout: 'admin' })

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

const handleTitleInput = () => {
  if (!isSlugManuallyEdited.value) form.slug = slugify(form.title)
}

const regenerateSlug = () => {
  form.slug = slugify(form.title)
  isSlugManuallyEdited.value = false
}

const toggleForm = () => {
  showForm.value = !showForm.value
  if (!showForm.value) resetForm()
}

const resetForm = () => {
  form.id = ''; form.title = ''; form.slug = ''; form.content = ''; 
  form.excerpt = ''; form.coverImage = ''; form.isPublished = true;
  isEditing.value = false; isSlugManuallyEdited.value = false;
}

const editPost = (post: any) => {
  Object.assign(form, post)
  isEditing.value = true
  isSlugManuallyEdited.value = true // Prevent auto slug update on edit
  showForm.value = true
}

const handleSubmit = async () => {
  loading.value = true
  try {
    const endpoint = '/api/blog'
    const method = isEditing.value ? 'PUT' : 'POST'
    // Logic untuk update endpoint jika PUT biasanya butuh ID di URL atau di Body, sesuaikan dengan API backend
    // Asumsi API support method PUT di root atau handle logicnya
    
    await $fetch(endpoint, { method, body: form })
    toast.success('Artikel berhasil disimpan')
    await refresh()
    toggleForm()
  } catch (err: any) {
    toast.error(err.statusMessage || 'Gagal menyimpan')
  } finally {
    loading.value = false
  }
}

const deletePost = async (id: string) => {
  if (!confirm('Hapus artikel ini?')) return
  await $fetch(`/api/blog/${id}`, { method: 'DELETE' })
  await refresh()
  toast.success('Artikel dihapus')
}
</script>