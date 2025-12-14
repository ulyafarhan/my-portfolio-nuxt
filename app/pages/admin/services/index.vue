<template>
  <div class="p-8 max-w-5xl mx-auto">
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Services & Pricing</h1>
        <p class="text-muted-foreground">Kelola paket layanan yang Anda tawarkan.</p>
      </div>
      <Button @click="toggleForm" :variant="showForm ? 'secondary' : 'default'">
        {{ showForm ? 'Batal' : '+ Paket Baru' }}
      </Button>
    </div>

    <div v-if="showForm" class="mb-10 animate-in fade-in slide-in-from-top-2">
      <Card>
        <CardHeader>
          <CardTitle>Buat Paket Layanan</CardTitle>
        </CardHeader>
        <CardContent>
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <div class="grid md:grid-cols-2 gap-6">
              <div class="space-y-4">
                <div class="space-y-2">
                  <Label>Nama Paket</Label>
                  <Input v-model="form.title" placeholder="e.g. Corporate Website" required />
                </div>
                <div class="space-y-2">
                  <Label>Harga (Display)</Label>
                  <Input v-model="form.price" placeholder="e.g. Rp 5.000.000 / project" required />
                </div>
                <div class="space-y-2">
                   <Label>Deskripsi Singkat</Label>
                   <Textarea v-model="form.description" rows="2" />
                </div>
                <div class="flex items-center space-x-2 border p-3 rounded bg-muted/20">
                  <Switch :checked="form.isPopular" @update:checked="(v) => form.isPopular = v" />
                  <Label>Highlight sebagai "Popular"</Label>
                </div>
              </div>

              <div class="space-y-3">
                <Label>Fitur Layanan (Enter untuk tambah)</Label>
                <div class="flex gap-2">
                  <Input 
                    v-model="newFeature" 
                    @keydown.enter.prevent="addFeature" 
                    placeholder="Ketik fitur lalu Enter..." 
                  />
                  <Button type="button" size="icon" @click="addFeature"><PlusIcon class="w-4 h-4" /></Button>
                </div>
                
                <div class="space-y-2 max-h-[200px] overflow-y-auto p-2 border rounded-md bg-muted/10">
                  <div v-for="(feat, idx) in form.features" :key="idx" class="flex items-center justify-between bg-background p-2 rounded border text-sm">
                    <span>{{ feat }}</span>
                    <button type="button" @click="removeFeature(idx)" class="text-red-500 hover:text-red-700">
                      <XIcon class="w-4 h-4" />
                    </button>
                  </div>
                  <div v-if="form.features.length === 0" class="text-xs text-muted-foreground text-center py-2">
                    Belum ada fitur ditambahkan.
                  </div>
                </div>
              </div>
            </div>

            <div class="flex justify-end pt-4">
              <Button type="submit" :disabled="loading">Simpan Layanan</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>

    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card v-for="item in services" :key="item.id" class="relative overflow-hidden flex flex-col" :class="{ 'border-primary border-2 shadow-lg': item.isPopular }">
        <div v-if="item.isPopular" class="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1 rounded-bl-lg">
          POPULAR
        </div>
        <CardHeader>
          <CardTitle>{{ item.title }}</CardTitle>
          <CardDescription>{{ item.description }}</CardDescription>
        </CardHeader>
        <CardContent class="flex-1 space-y-4">
          <div class="text-2xl font-bold text-primary">{{ item.price }}</div>
          <ul class="space-y-2 text-sm text-muted-foreground">
            <li v-for="feat in item.features" :key="feat" class="flex items-center gap-2">
              <CheckCircle2Icon class="w-4 h-4 text-green-500 shrink-0" />
              {{ feat }}
            </li>
          </ul>
        </CardContent>
        <CardFooter class="border-t pt-4 flex justify-between">
           <span class="text-xs text-muted-foreground">Order: {{ item.order }}</span>
           <Button variant="ghost" size="sm" class="text-destructive" @click="deleteItem(item.id)">
             <TrashIcon class="w-4 h-4" /> Hapus
           </Button>
        </CardFooter>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toast } from 'vue-sonner'
import { PlusIcon, XIcon, CheckCircle2Icon, TrashIcon } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'

definePageMeta({ layout: 'admin' })

const { data: services, refresh } = await useFetch('/api/services')
const showForm = ref(false)
const loading = ref(false)
const newFeature = ref('')

const form = reactive({
  title: '', description: '', price: '', isPopular: false, features: [] as string[], order: 0
})

const toggleForm = () => { showForm.value = !showForm.value; if(!showForm.value) resetForm() }

const resetForm = () => {
  form.title = ''; form.description = ''; form.price = ''; form.isPopular = false; form.features = [];
  newFeature.value = ''
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
    await $fetch('/api/services', { method: 'POST', body: form })
    toast.success('Layanan ditambahkan')
    await refresh()
    toggleForm()
  } catch (e) { toast.error('Gagal menyimpan') } 
  finally { loading.value = false }
}

const deleteItem = async (id: string) => {
  if(!confirm('Hapus paket ini?')) return
  await $fetch(`/api/services/${id}`, { method: 'DELETE' })
  await refresh()
  toast.success('Terhapus')
}
</script>