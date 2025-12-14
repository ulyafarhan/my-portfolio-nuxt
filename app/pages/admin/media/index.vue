<template>
  <div class="p-8 max-w-7xl mx-auto h-[calc(100vh-4rem)] flex flex-col">
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Media Library</h1>
        <p class="text-muted-foreground">Kelola aset gambar dan dokumen di Cloudflare R2.</p>
      </div>
      <div class="flex gap-2">
        <label>
          <Button :disabled="uploading" class="cursor-pointer">
            <UploadCloudIcon class="w-4 h-4 mr-2" />
            {{ uploading ? 'Uploading...' : 'Upload File' }}
          </Button>
          <input 
            type="file" 
            multiple 
            accept="image/*" 
            class="hidden" 
            @change="handleBulkUpload"
          />
        </label>
      </div>
    </div>

    <div class="flex-1 overflow-hidden bg-muted/20 border rounded-xl relative">
      <ScrollArea class="h-full w-full p-6">
        
        <div v-if="pending" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <div v-for="i in 10" :key="i" class="aspect-square bg-muted animate-pulse rounded-lg"></div>
        </div>

        <div v-else-if="!files || files.length === 0" class="h-64 flex flex-col items-center justify-center text-muted-foreground">
          <ImageIcon class="w-12 h-12 mb-2 opacity-20" />
          <p>Belum ada file media.</p>
        </div>

        <div v-else class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div 
            v-for="file in files" 
            :key="file.key" 
            class="group relative aspect-square bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all"
          >
            <img 
              :src="file.url" 
              class="w-full h-full object-cover" 
              loading="lazy"
            />
            
            <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
              <Button size="icon-sm" variant="secondary" @click="copyUrl(file.url)" title="Copy URL">
                <CopyIcon class="w-4 h-4" />
              </Button>
              <Button size="icon-sm" variant="destructive" @click="deleteFile(file.key)" title="Delete">
                <TrashIcon class="w-4 h-4" />
              </Button>
            </div>

            <div class="absolute bottom-0 left-0 w-full bg-black/60 text-white text-[10px] p-1 truncate text-center">
              {{ formatBytes(file.size) }}
            </div>
          </div>
        </div>

      </ScrollArea>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toast } from 'vue-sonner'
import { UploadCloudIcon, CopyIcon, TrashIcon, ImageIcon } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

definePageMeta({ layout: 'admin' })

interface MediaFile {
  key: string
  url: string
  size: number
  lastModified: string
}

const { data: files, refresh, pending } = await useFetch<MediaFile[]>('/api/media')
const uploading = ref(false)

// Helper: Format Size
const formatBytes = (bytes: number) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

// Action: Copy URL
const copyUrl = (url: string) => {
  navigator.clipboard.writeText(url)
  toast.success('URL disalin ke clipboard')
}

// Action: Bulk Upload
const handleBulkUpload = async (e: Event) => {
  const input = e.target as HTMLInputElement
  if (!input.files?.length) return

  uploading.value = true
  const total = input.files.length
  let successCount = 0

  // Upload satu per satu
  for (let i = 0; i < total; i++) {
    const file = input.files[i]
    const formData = new FormData()
    formData.append('file', file)

    try {
      await $fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      successCount++
    } catch (err) {
      console.error('Upload failed', file.name)
    }
  }

  uploading.value = false
  input.value = '' // Reset input
  
  if (successCount > 0) {
    toast.success(`${successCount} file berhasil diupload`)
    refresh() // Reload gallery
  } else {
    toast.error('Gagal mengupload file')
  }
}

// Action: Delete File
const deleteFile = async (key: string) => {
  if (!confirm('Hapus file ini permanen dari Cloudflare R2?')) return

  try {
    await $fetch('/api/media', {
      method: 'DELETE',
      body: { key }
    })
    toast.success('File dihapus')
    refresh()
  } catch (err) {
    toast.error('Gagal menghapus file')
  }
}
</script>