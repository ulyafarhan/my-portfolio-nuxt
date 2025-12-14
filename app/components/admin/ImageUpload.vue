<script setup lang="ts">
import { UploadCloudIcon, XIcon, Loader2Icon } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'

const props = defineProps<{ modelValue?: string }>()
const emit = defineEmits(['update:modelValue'])

const isUploading = ref(false)
const fileInput = ref<HTMLInputElement>()

const triggerUpload = () => fileInput.value?.click()

const handleFile = async (e: Event) => {
  const files = (e.target as HTMLInputElement).files
  if (!files || files.length === 0) return

  isUploading.value = true
  const formData = new FormData()
  formData.append('file', files[0])

  try {
    const res = await $fetch<{ url: string }>('/api/upload', {
      method: 'POST',
      body: formData
    })
    emit('update:modelValue', res.url)
  } catch (err) {
    alert('Gagal upload gambar')
  } finally {
    isUploading.value = false
    // Reset input agar bisa upload file yang sama lagi
    if (fileInput.value) fileInput.value.value = ''
  }
}

const removeImage = () => emit('update:modelValue', '')
</script>

<template>
  <div class="w-full">
    <div v-if="modelValue" class="relative group rounded-xl overflow-hidden border aspect-video bg-muted/30">
      <img :src="modelValue" class="w-full h-full object-cover" loading="lazy" alt="Preview" />
      <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <Button variant="destructive" size="sm" @click="removeImage">
          <XIcon class="w-4 h-4 mr-2" /> Hapus Gambar
        </Button>
      </div>
    </div>

    <div v-else 
      @click="triggerUpload"
      class="border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors h-40"
    >
      <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="handleFile" />
      <Loader2Icon v-if="isUploading" class="w-8 h-8 animate-spin text-muted-foreground" />
      <template v-else>
        <UploadCloudIcon class="w-8 h-8 text-muted-foreground mb-2" />
        <p class="text-sm text-muted-foreground font-medium">Klik untuk upload cover</p>
        <p class="text-xs text-muted-foreground/70">JPG, PNG, WebP (Max 2MB)</p>
      </template>
    </div>
  </div>
</template>