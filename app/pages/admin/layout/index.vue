<template>
  <div class="p-8 max-w-4xl mx-auto">
    <div class="mb-8">
      <h1 class="text-3xl font-bold tracking-tight">Layout Builder</h1>
      <p class="text-muted-foreground">Atur susunan halaman depan dengan Drag & Drop.</p>
    </div>

    <div v-if="pending" class="py-10 text-center">Loading builder...</div>

    <div v-else class="space-y-6">
      <VueDraggable 
        v-model="sections" 
        :animation="150" 
        handle=".drag-handle"
        class="space-y-3"
        @end="onDragEnd"
      >
        <div 
          v-for="element in sections" 
          :key="element.id"
          class="flex items-center justify-between p-4 bg-white border rounded-lg shadow-sm hover:shadow-md transition-all group"
          :class="{ 'opacity-60 bg-gray-50': !element.isVisible }"
        >
          <div class="flex items-center gap-4">
            <div class="drag-handle cursor-move p-2 hover:bg-gray-100 rounded text-gray-400">
              <GripVerticalIcon class="w-5 h-5" />
            </div>
            
            <div>
              <h3 class="font-semibold text-sm">{{ element.label }}</h3>
              <p class="text-xs text-muted-foreground font-mono">{{ element.component }}</p>
            </div>
          </div>

          <div class="flex items-center gap-3">
             <Dialog>
              <DialogTrigger as-child>
                <Button variant="outline" size="sm" @click="editSection(element)">
                  <SettingsIcon class="w-4 h-4 mr-2" /> Config
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit {{ editingSection?.label }}</DialogTitle>
                </DialogHeader>
                <div class="space-y-4 py-4" v-if="editingSection">
                  <div v-for="(val, key) in editingSection.content" :key="key" class="space-y-2">
                    <Label class="capitalize">{{ key }}</Label>
                    <Input v-if="key !== 'description'" v-model="editingSection.content[key]" />
                    <Textarea v-else v-model="editingSection.content[key]" />
                  </div>
                </div>
                <DialogFooter>
                  <Button @click="saveContent">Simpan Konten</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <div class="flex items-center space-x-2">
              <Switch 
                :checked="element.isVisible" 
                @update:checked="(val) => toggleVisibility(element, val)"
              />
              <span class="text-xs w-12">{{ element.isVisible ? 'Visible' : 'Hidden' }}</span>
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog'

definePageMeta({ layout: 'admin' })

const { data: sections, refresh, pending } = await useFetch<any[]>('/api/sections')
const editingSection = ref<any>(null)

// 1. Handle Drag & Drop Reorder
const onDragEnd = async () => {
  if (!sections.value) return

  // Update order number di local state
  const updates = sections.value.map((item, index) => ({
    id: item.id,
    order: index + 1
  }))

  try {
    await $fetch('/api/sections/reorder', {
      method: 'PUT',
      body: updates
    })
    toast.success('Urutan layout disimpan')
  } catch (e) {
    toast.error('Gagal menyimpan urutan')
    refresh() // Revert jika gagal
  }
}

// 2. Handle Toggle Visibility
const toggleVisibility = async (item: any, val: boolean) => {
  item.isVisible = val // Optimistic update
  try {
    await $fetch(`/api/sections/${item.id}`, {
      method: 'PATCH',
      body: { isVisible: val }
    })
  } catch (e) {
    item.isVisible = !val // Revert
    toast.error('Gagal update status')
  }
}

// 3. Handle Edit Content
const editSection = (item: any) => {
  // Clone object untuk edit agar tidak reaktif langsung ke list sebelum save
  editingSection.value = JSON.parse(JSON.stringify(item))
}

const saveContent = async () => {
  if (!editingSection.value) return
  
  try {
    await $fetch(`/api/sections/${editingSection.value.id}`, {
      method: 'PATCH',
      body: { content: editingSection.value.content }
    })
    
    toast.success('Konten section diperbarui')
    await refresh() // Refresh data asli
  } catch (e) {
    toast.error('Gagal menyimpan konten')
  }
}
</script>