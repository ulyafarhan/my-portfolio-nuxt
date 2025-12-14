<template>
  <div class="min-h-screen bg-background text-foreground p-4 md:p-8 w-full space-y-8">
    
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl md:text-3xl font-bold tracking-tight">Services & Pricing</h1>
        <p class="text-sm md:text-base text-muted-foreground">Kelola paket layanan dan harga.</p>
      </div>
      <Button 
        @click="openCreate" 
        :variant="showForm ? 'secondary' : 'default'"
        class="w-full sm:w-auto shadow-sm"
      >
        <component :is="showForm ? XIcon : PlusIcon" class="mr-2 h-4 w-4" />
        {{ showForm ? 'Tutup Form' : 'Paket Baru' }}
      </Button>
    </div>

    <div v-if="showForm" class="rounded-xl border bg-card text-card-foreground shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
      <div class="p-6 border-b flex justify-between items-center">
        <h3 class="text-lg font-semibold">{{ isEditing ? 'Edit Layanan' : 'Buat Paket Layanan' }}</h3>
        <Button variant="ghost" size="sm" @click="closeForm">
          <XIcon class="h-4 w-4" />
        </Button>
      </div>

      <div class="p-6">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div class="grid md:grid-cols-2 gap-8">
            <div class="space-y-4">
              <div class="space-y-2">
                <Label>Nama Paket</Label>
                <Input v-model="form.title" placeholder="Contoh: Corporate Website" required class="bg-background font-medium" />
              </div>
              
              <div class="space-y-2">
                <Label>Harga (Display)</Label>
                <Input v-model="form.price" placeholder="Rp 5.000.000 / project" required class="bg-background" />
              </div>

              <div class="space-y-2">
                 <Label>Deskripsi Singkat</Label>
                 <Textarea v-model="form.description" rows="3" placeholder="Penjelasan singkat..." class="bg-background" />
              </div>

              <div class="grid grid-cols-2 gap-4 pt-2">
                <div class="space-y-2">
                  <Label>Urutan</Label>
                  <Input type="number" v-model.number="form.order" class="bg-background" />
                </div>
                 <div class="flex items-center space-x-2 border p-3 rounded-lg bg-muted/20 h-full mt-auto">
                  <Switch :checked="form.isPopular" @update:checked="(v) => form.isPopular = v" />
                  <Label class="cursor-pointer">Tag Popular</Label>
                </div>
              </div>
            </div>

            <div class="space-y-3">
              <Label>Fitur Layanan</Label>
              <div class="flex gap-2">
                <Input 
                  v-model="newFeature" 
                  @keydown.enter.prevent="addFeature" 
                  placeholder="Ketik fitur lalu Enter..." 
                  class="bg-background"
                />
                <Button type="button" size="icon" @click="addFeature" variant="secondary">
                  <PlusIcon class="w-4 h-4" />
                </Button>
              </div>
              
              <div class="space-y-2 max-h-[300px] overflow-y-auto p-1 border rounded-md bg-muted/10 min-h-[150px]">
                <div v-if="form.features.length === 0" class="text-center py-8 text-muted-foreground text-xs">
                  Belum ada fitur. Tambahkan di atas.
                </div>
                
                <div 
                  v-for="(feat, idx) in form.features" 
                  :key="idx" 
                  class="flex items-center justify-between p-2 rounded bg-background border shadow-sm group"
                >
                  <span class="text-sm truncate pr-2">{{ feat }}</span>
                  <button type="button" @click="removeFeature(idx)" class="text-muted-foreground hover:text-destructive p-1">
                    <XIcon class="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-end pt-4 gap-3 border-t mt-4">
            <Button type="button" variant="ghost" @click="closeForm">Batal</Button>
            <Button type="submit" :disabled="loading">
              <Spinner v-if="loading" class="mr-2" />
              {{ isEditing ? 'Simpan Perubahan' : 'Buat Layanan' }}
            </Button>
          </div>
        </form>
      </div>
    </div>

    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <div v-if="!services || services.length === 0" class="col-span-full py-20 flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed rounded-xl bg-card/50">
         <p>Belum ada layanan yang ditambahkan.</p>
         <Button variant="link" @click="openCreate">Buat paket pertama</Button>
      </div>

      <Card 
        v-for="item in services" 
        :key="item.id" 
        class="relative overflow-hidden flex flex-col bg-card hover:border-primary/50 transition-colors group"
        :class="{ 'border-primary ring-1 ring-primary/20': item.isPopular }"
      >
        <div v-if="item.isPopular" class="absolute top-0 right-0 z-10">
          <div class="bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1 rounded-bl-lg shadow-sm">
            POPULAR
          </div>
        </div>

        <div class="absolute top-3 right-3 z-20 flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
           <Button variant="secondary" size="icon-sm" class="h-7 w-7 bg-background/80 backdrop-blur shadow-sm hover:bg-background" @click="editService(item)">
             <PencilIcon class="w-3.5 h-3.5" />
           </Button>
            <Button variant="destructive" size="icon-sm" class="h-7 w-7 shadow-sm opacity-90 hover:opacity-100" @click="deleteItem(item.id)">
             <TrashIcon class="w-3.5 h-3.5" />
           </Button>
        </div>

        <CardHeader class="pb-2">
          <CardTitle class="text-xl font-bold line-clamp-1">{{ item.title }}</CardTitle>
          <CardDescription class="line-clamp-2 text-xs h-8">{{ item.description }}</CardDescription>
        </CardHeader>
        
        <CardContent class="flex-1 space-y-4 pt-2">
          <div class="text-2xl font-extrabold text-primary">{{ item.price }}</div>
          <ul class="space-y-2">
            <li v-for="(feat, i) in (item.features || []).slice(0, 4)" :key="i" class="flex items-start gap-2 text-xs text-muted-foreground">
              <CheckCircle2Icon class="w-3.5 h-3.5 text-green-500 shrink-0 mt-0.5" />
              <span class="leading-tight line-clamp-2">{{ feat }}</span>
            </li>
            <li v-if="(item.features || []).length > 4" class="text-xs text-muted-foreground pl-5 italic">
              +{{ item.features.length - 4 }} fitur lainnya
            </li>
          </ul>
        </CardContent>
        
        <CardFooter class="border-t pt-3 pb-3 mt-auto bg-muted/5 text-xs text-muted-foreground font-mono">
           Order: {{ item.order }}
        </CardFooter>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toast } from 'vue-sonner'
import { PlusIcon, XIcon, CheckCircle2Icon, TrashIcon, PencilIcon } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import Spinner from '@/components/ui/spinner/Spinner.vue'

definePageMeta({ layout: 'admin' })

const { data: services, refresh } = await useFetch('/api/services', { key: 'admin-services' })

const showForm = ref(false)
const loading = ref(false)
const isEditing = ref(false)
const editingId = ref<string | null>(null)
const newFeature = ref('')

const form = reactive({
  title: '', description: '', price: '', isPopular: false, features: [] as string[], order: 0
})

const openCreate = () => {
  resetForm()
  showForm.value = true
  setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100)
}

const closeForm = () => {
  showForm.value = false
  setTimeout(resetForm, 300)
}

const resetForm = () => {
  form.title = ''; form.description = ''; form.price = ''; form.isPopular = false; form.features = []; form.order = 0;
  newFeature.value = ''; isEditing.value = false; editingId.value = null;
}

const editService = (item: any) => {
  isEditing.value = true
  editingId.value = item.id
  
  form.title = item.title
  form.description = item.description || ''
  form.price = item.price
  form.isPopular = item.isPopular
  form.features = [...(item.features || [])]
  form.order = item.order || 0

  showForm.value = true
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const addFeature = () => {
  if (newFeature.value.trim()) {
    form.features.push(newFeature.value.trim())
    newFeature.value = ''
  }
}

const removeFeature = (idx: number) => {
  form.features.splice(idx, 1)
}

const handleSubmit = async () => {
  loading.value = true
  try {
    const payload = { 
      ...form,
      // Pastikan fitur dikirim sebagai array bersih
      features: [...form.features] 
    }

    if (isEditing.value && editingId.value) {
      await $fetch(`/api/services/${editingId.value}`, { 
        method: 'PUT', 
        body: payload 
      })
      toast.success('Layanan berhasil diperbarui!')
    } else {
      await $fetch('/api/services', { 
        method: 'POST', 
        body: payload 
      })
      toast.success('Layanan berhasil ditambahkan!')
    }
    
    await refresh()
    closeForm()
  } catch (e: any) { 
    console.error(e)
    toast.error(e.statusMessage || 'Gagal menyimpan data') 
  } finally { 
    loading.value = false 
  }
}

const deleteItem = async (id: string) => {
  if(!confirm('Hapus paket layanan ini permanen?')) return
  
  try {
    await $fetch(`/api/services/${id}`, { method: 'DELETE' })
    await refresh()
    toast.success('Paket layanan dihapus')
  } catch (e) {
    toast.error('Gagal menghapus paket')
  }
}
</script>