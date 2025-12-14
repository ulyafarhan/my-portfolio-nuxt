<template>
  <div class="min-h-screen bg-background text-foreground p-4 md:p-8 w-full space-y-8">
    
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl md:text-3xl font-bold tracking-tight">Layout Builder</h1>
        <p class="text-sm md:text-base text-muted-foreground">Atur susunan dan konten halaman depan (Homepage).</p>
      </div>
      </div>

    <div v-if="pending" class="flex flex-col items-center justify-center py-20 space-y-4">
      <Spinner class="w-8 h-8" />
      <p class="text-muted-foreground text-sm">Memuat konfigurasi layout...</p>
    </div>

    <div v-else class="max-w-5xl mx-auto">
      <VueDraggable 
        v-model="sections" 
        :animation="200" 
        handle=".drag-handle"
        class="space-y-3"
        @end="onDragEnd"
        ghost-class="ghost"
      >
        <div 
          v-for="element in sections" 
          :key="element.id"
          class="group flex items-center justify-between p-4 bg-card border rounded-xl shadow-sm transition-all hover:border-primary/50"
          :class="{ 'opacity-60 bg-muted/50 dashed-border': !element.isVisible }"
        >
          <div class="flex items-center gap-4 overflow-hidden">
            <div class="drag-handle cursor-grab active:cursor-grabbing p-2 hover:bg-muted rounded-md text-muted-foreground transition-colors">
              <GripVerticalIcon class="w-5 h-5" />
            </div>
            
            <div class="flex flex-col">
              <div class="flex items-center gap-2">
                <h3 class="font-semibold text-sm md:text-base truncate">{{ element.label }}</h3>
                <Badge variant="outline" class="font-mono text-[10px] hidden sm:inline-flex">
                  {{ element.component }}
                </Badge>
              </div>
              <p class="text-xs text-muted-foreground truncate max-w-[200px] md:max-w-[400px]">
                {{ getPreviewContent(element.content) }}
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2 md:gap-4 shrink-0">
             <Dialog :open="isDialogOpen && editingSection?.id === element.id" @update:open="(v) => !v && closeDialog()">
              <DialogTrigger as-child>
                <Button variant="outline" size="sm" @click="editSection(element)">
                  <SettingsIcon class="w-4 h-4 md:mr-2" /> 
                  <span class="hidden md:inline">Config</span>
                </Button>
              </DialogTrigger>
              <DialogContent class="max-h-[85vh] overflow-y-auto sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Edit {{ editingSection?.label }}</DialogTitle>
                  <DialogDescription>
                    Sesuaikan teks dan konten untuk bagian ini.
                  </DialogDescription>
                </DialogHeader>
                
                <div class="space-y-5 py-4" v-if="editingSection && editingSection.content">
                  <div v-for="(val, key) in editingSection.content" :key="key" class="space-y-2">
                    <Label class="capitalize text-xs font-bold text-muted-foreground">{{ formatLabel(key) }}</Label>
                    
                    <Textarea 
                      v-if="isTextArea(key)" 
                      v-model="editingSection.content[key]" 
                      rows="4"
                      class="bg-background"
                    />
                    <Input 
                      v-else 
                      v-model="editingSection.content[key]" 
                      class="bg-background"
                    />
                  </div>
                  
                  <div v-if="Object.keys(editingSection.content).length === 0" class="text-center py-8 text-muted-foreground text-sm bg-muted/20 rounded-lg">
                    Bagian ini tidak memiliki konfigurasi konten statis.
                    <br>Konten diambil secara dinamis dari database.
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="ghost" @click="closeDialog">Batal</Button>
                  <Button @click="saveContent" :disabled="saving">
                    <Spinner v-if="saving" class="mr-2" />
                    {{ saving ? 'Menyimpan...' : 'Simpan Perubahan' }}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <div class="flex items-center space-x-2 border-l pl-2 md:pl-4 ml-2">
              <Switch 
                :checked="element.isVisible" 
                @update:checked="(val) => toggleVisibility(element, val)"
              />
              <span class="text-xs text-muted-foreground w-8 hidden md:inline-block">
                {{ element.isVisible ? 'On' : 'Off' }}
              </span>
            </div>
          </div>
        </div>
      </VueDraggable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { VueDraggable } from 'vue-draggable-plus'
import { GripVerticalIcon, SettingsIcon } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

// UI Components
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogDescription } from '@/components/ui/dialog'
import Spinner from '@/components/ui/spinner/Spinner.vue'

definePageMeta({ layout: 'admin' })

const { data: sections, refresh, pending } = await useFetch<any[]>('/api/sections', { key: 'admin-layout' })
const editingSection = ref<any>(null)
const isDialogOpen = ref(false)
const saving = ref(false)

// Helper: Format key object (e.g., 'subTitle' -> 'Sub Title')
const formatLabel = (key: string | number) => {
  return String(key).replace(/([A-Z])/g, ' $1').trim()
}

// Helper: Determine input type
const isTextArea = (key: string | number) => {
  const k = String(key).toLowerCase()
  return k.includes('description') || k.includes('bio') || k.includes('content')
}

// Helper: Preview text
const getPreviewContent = (content: any) => {
  if (!content || Object.keys(content).length === 0) return 'Konten dinamis'
  // Ambil value pertama yang string
  const firstVal = Object.values(content).find(v => typeof v === 'string' && v.length > 0)
  return firstVal ? String(firstVal) : 'Konfigurasi tersedia'
}

// 1. Handle Drag & Drop Reorder
const onDragEnd = async () => {
  if (!sections.value) return

  // Update order number di local state
  const updates = sections.value.map((item, index) => ({
    id: item.id,
    order: index + 1
  }))

  try {
    // Silent update (no loading spinner blocking UI)
    await $fetch('/api/sections/reorder', {
      method: 'PUT',
      body: updates
    })
    toast.success('Susunan layout disimpan')
  } catch (e) {
    toast.error('Gagal menyimpan urutan')
    refresh() // Revert jika gagal
  }
}

// 2. Handle Toggle Visibility
const toggleVisibility = async (item: any, val: boolean) => {
  const originalState = item.isVisible
  item.isVisible = val // Optimistic update
  
  try {
    await $fetch(`/api/sections/${item.id}`, {
      method: 'PATCH',
      body: { isVisible: val }
    })
    toast.success(val ? `Section ${item.label} diaktifkan` : `Section ${item.label} disembunyikan`)
  } catch (e) {
    item.isVisible = originalState // Revert
    toast.error('Gagal update status')
  }
}

// 3. Handle Edit Content
const editSection = (item: any) => {
  // Clone object untuk edit agar tidak reaktif langsung ke list sebelum save
  editingSection.value = JSON.parse(JSON.stringify(item))
  isDialogOpen.value = true
}

const closeDialog = () => {
  isDialogOpen.value = false
  setTimeout(() => editingSection.value = null, 300) // Clear after anim
}

const saveContent = async () => {
  if (!editingSection.value) return
  saving.value = true
  
  try {
    await $fetch(`/api/sections/${editingSection.value.id}`, {
      method: 'PATCH',
      body: { content: editingSection.value.content }
    })
    
    toast.success('Konten section diperbarui')
    await refresh() // Refresh data asli untuk update list view
    closeDialog()
  } catch (e) {
    toast.error('Gagal menyimpan konten')
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
/* FIX: Import referensi tema dari file CSS global agar @apply mengenali class custom */
@reference "../../../assets/css/tailwind.css";

.ghost {
  @apply opacity-50 bg-primary/10 border-2 border-dashed border-primary;
}
</style>