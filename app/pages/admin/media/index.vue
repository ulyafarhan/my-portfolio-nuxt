<template>
  <div class="min-h-screen bg-background text-foreground p-4 md:p-8 w-full space-y-8">
    
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl md:text-3xl font-bold tracking-tight">Media Library</h1>
        <p class="text-sm md:text-base text-muted-foreground">Manage aset gambar dan file yang tersimpan di CDN.</p>
      </div>
      <Button @click="triggerUpload" :disabled="isUploading">
        <UploadCloudIcon class="mr-2 h-4 w-4" />
        {{ isUploading ? 'Uploading...' : 'Upload Baru' }}
      </Button>
      <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="handleFileUpload" />
    </div>

    <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      <div 
        @click="triggerUpload"
        class="aspect-square rounded-xl border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50 cursor-pointer flex flex-col items-center justify-center text-muted-foreground transition-all"
      >
        <PlusIcon class="h-8 w-8 mb-2 opacity-50" />
        <span class="text-xs font-medium">Upload</span>
      </div>

      <div 
        v-for="file in mediaFiles" 
        :key="file.key" 
        class="group relative aspect-square rounded-xl overflow-hidden border bg-muted"
      >
        <img 
          :src="file.url" 
          class="h-full w-full object-cover transition-transform group-hover:scale-105" 
          loading="lazy" 
          alt="Media Asset"
        />
        
        <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
          <Button variant="secondary" size="icon-sm" class="h-8 w-8 rounded-full" @click="copyUrl(file.url)" title="Copy URL">
            <CopyIcon class="h-4 w-4" />
          </Button>
          <Button variant="destructive" size="icon-sm" class="h-8 w-8 rounded-full" @click="deleteFile(file.key)">
            <TrashIcon class="h-4 w-4" />
          </Button>
        </div>
        
        <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
          <p class="text-[10px] text-white truncate font-mono">{{ file.key.split('/').pop() }}</p>
        </div>
      </div>
    </div>

    <div v-if="!mediaFiles || mediaFiles.length === 0" class="flex flex-col items-center justify-center py-20 text-muted-foreground">
      <ImageIcon class="h-12 w-12 mb-4 opacity-20" />
      <p>Belum ada file media.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toast } from 'vue-sonner'
import { UploadCloudIcon, PlusIcon, CopyIcon, TrashIcon, ImageIcon } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'

definePageMeta({ layout: 'admin' })

// Fetch media list (pastikan endpoint ini mengembalikan array { key: string, url: string })
const { data: mediaFiles, refresh } = await useFetch('/api/media', { key: 'admin-media' })

const isUploading = ref(false)
const fileInput = ref<HTMLInputElement>()

const triggerUpload = () => fileInput.value?.click()

const handleFileUpload = async (event: Event) => {
  const files = (event.target as HTMLInputElement).files
  if (!files || files.length === 0) return

  isUploading.value = true
  const formData = new FormData()
  formData.append('file', files[0])

  try {
    await $fetch('/api/upload', {
      method: 'POST',
      body: formData
    })
    toast.success('Upload berhasil!')
    await refresh() // Refresh grid
  } catch (error: any) {
    toast.error(error.statusMessage || 'Upload gagal')
  } finally {
    isUploading.value = false
    if (fileInput.value) fileInput.value.value = ''
  }
}

const copyUrl = (url: string) => {
  navigator.clipboard.writeText(url)
  toast.success('URL disalin ke clipboard')
}

const deleteFile = async (key: string) => {
  if (!confirm('Hapus file ini permanen?')) return
  
  try {
    // Pastikan endpoint delete menerima key/path file
    await $fetch('/api/media', {
      method: 'DELETE',
      body: { key }
    })
    toast.success('File dihapus')
    await refresh()
  } catch (error) {
    toast.error('Gagal menghapus file')
  }
}
</script>