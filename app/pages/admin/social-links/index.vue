<template>
  <div class="min-h-screen bg-background text-foreground p-4 md:p-8 w-full space-y-8">
    
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl md:text-3xl font-bold tracking-tight">Social Links</h1>
        <p class="text-sm md:text-base text-muted-foreground">Kelola tautan sosial media yang muncul di footer/kontak.</p>
      </div>
      </div>

    <div class="grid lg:grid-cols-3 gap-8">
      
      <div class="lg:col-span-1">
        <Card class="bg-card text-card-foreground shadow-sm sticky top-8">
          <CardHeader>
            <CardTitle>{{ isEditing ? 'Edit Link' : 'Tambah Link Baru' }}</CardTitle>
            <CardDescription>
              Gunakan nama icon dari <a href="https://lucide.dev/icons" target="_blank" class="text-primary hover:underline">Lucide Icons</a>.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form @submit.prevent="handleSubmit" class="space-y-4">
              <div class="space-y-2">
                <Label>Platform</Label>
                <Input v-model="form.platform" placeholder="GitHub, LinkedIn, Twitter" required class="bg-background" />
              </div>
              
              <div class="space-y-2">
                <Label>URL</Label>
                <Input v-model="form.url" placeholder="https://..." required class="bg-background" />
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                  <Label>Icon Key</Label>
                  <Input v-model="form.iconKey" placeholder="github" class="bg-background font-mono text-xs" />
                </div>
                <div class="space-y-2">
                  <Label>Urutan</Label>
                  <Input type="number" v-model="form.order" placeholder="0" class="bg-background" />
                </div>
              </div>

              <div class="flex items-center space-x-2 border p-3 rounded-md bg-muted/20 pt-4">
                <Switch :checked="form.isShow" @update:checked="(v) => form.isShow = v" />
                <Label>Tampilkan</Label>
              </div>

              <div class="flex gap-2 pt-4">
                 <Button v-if="isEditing" type="button" variant="ghost" class="flex-1" @click="resetForm">Batal</Button>
                 <Button type="submit" :disabled="loading" class="flex-1">
                    <Spinner v-if="loading" class="mr-2" />
                    {{ isEditing ? 'Simpan' : 'Tambah' }}
                 </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <div class="lg:col-span-2">
        <div class="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow class="bg-muted/50 hover:bg-muted/50 border-b">
                <TableHead class="w-[50px] text-center">#</TableHead>
                <TableHead>Platform & URL</TableHead>
                <TableHead class="w-[100px]">Icon</TableHead>
                <TableHead class="w-[100px]">Status</TableHead>
                <TableHead class="text-right w-[100px]">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="link in links" :key="link.id" class="group hover:bg-muted/30 transition-colors">
                <TableCell class="text-center font-mono text-xs text-muted-foreground">
                  {{ link.order }}
                </TableCell>
                <TableCell>
                  <div class="flex flex-col">
                    <span class="font-medium">{{ link.platform }}</span>
                    <a :href="link.url" target="_blank" class="text-xs text-muted-foreground hover:text-primary truncate max-w-[200px] flex items-center gap-1">
                      {{ link.url }} <ExternalLinkIcon class="w-2.5 h-2.5" />
                    </a>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" class="font-mono text-[10px]">{{ link.iconKey || '-' }}</Badge>
                </TableCell>
                <TableCell>
                   <Badge :variant="link.isShow ? 'default' : 'secondary'" class="h-5 text-[10px]">
                    {{ link.isShow ? 'Active' : 'Hidden' }}
                  </Badge>
                </TableCell>
                <TableCell class="text-right">
                  <div class="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" class="h-8 w-8 text-muted-foreground hover:text-foreground" @click="editLink(link)">
                      <PencilIcon class="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" class="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive" @click="deleteLink(link.id)">
                      <TrashIcon class="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>

              <TableRow v-if="!links || links.length === 0">
                <TableCell colspan="5" class="h-32 text-center text-muted-foreground">
                  <div class="flex flex-col items-center gap-2">
                    <Share2Icon class="h-8 w-8 opacity-20" />
                    <p>Belum ada social link.</p>
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
  TrashIcon, PencilIcon, Share2Icon, ExternalLinkIcon 
} from 'lucide-vue-next'

// UI Imports
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import Spinner from '@/components/ui/spinner/Spinner.vue'

definePageMeta({ layout: 'admin' })

const { data: links, refresh } = await useFetch('/api/social-links', { key: 'admin-socials' })
const loading = ref(false)
const isEditing = ref(false)
const editingId = ref<string | null>(null)

const form = reactive({ 
  platform: '', 
  url: '', 
  iconKey: '', // e.g., 'github', 'twitter'
  order: 0,
  isShow: true
})

const resetForm = () => {
  isEditing.value = false
  editingId.value = null
  form.platform = ''; form.url = ''; form.iconKey = ''; form.order = 0; form.isShow = true;
}

const editLink = (link: any) => {
  isEditing.value = true
  editingId.value = link.id
  form.platform = link.platform
  form.url = link.url
  form.iconKey = link.iconKey || ''
  form.order = link.order || 0
  form.isShow = link.isShow ?? true
  
  // Scroll to form on mobile
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleSubmit = async () => {
  loading.value = true
  try {
    const endpoint = isEditing.value ? `/api/social-links/${editingId.value}` : '/api/social-links'
    const method = isEditing.value ? 'PUT' : 'POST'

    await $fetch(endpoint, { method, body: form })
    
    toast.success(isEditing.value ? 'Link diperbarui' : 'Link ditambahkan')
    resetForm()
    await refresh()
  } catch (e: any) { 
    toast.error('Gagal memproses data') 
  } finally { 
    loading.value = false 
  }
}

const deleteLink = async (id: string) => {
  if(!confirm('Hapus link ini?')) return
  try {
    await $fetch(`/api/social-links/${id}`, { method: 'DELETE' })
    await refresh()
    toast.success('Link dihapus')
  } catch (e) {
    toast.error('Gagal menghapus')
  }
}
</script>